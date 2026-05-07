# 📘 Documentação Técnica — SISMOB Boilerplate

> **Público-alvo:** Estagiários e desenvolvedores júnior  
> **Stack:** NestJS · TypeScript · PostgreSQL · TypeORM · JWT · Docker · Kubernetes · GitLab CI/CD

---

## 1. Visão Geral

O **SISMOB Boilerplate** é um projeto base padronizado para criação de APIs REST no sistema de mobilidade urbana (SISMOB / SMTR). Ele já vem configurado com as principais práticas de desenvolvimento adotadas pelo time:

| Categoria | Tecnologia |
|---|---|
| Framework | NestJS 11 (Node.js + TypeScript) |
| Banco de dados | PostgreSQL 15 via TypeORM |
| Autenticação | JWT (JSON Web Token) com expiração de 8h |
| Documentação | Swagger (OpenAPI 3) |
| Containerização | Docker + Docker Compose |
| Orquestração | Kubernetes (K8s) |
| CI/CD | GitLab CI/CD |
| Testes | Jest (unitário + e2e) |

---

## 2. Estrutura de Diretórios

```
SISMOB-BOILERPLATE/
├── src/
│   ├── main.ts                   ← Ponto de entrada da aplicação
│   ├── app.module.ts             ← Módulo raiz (configura tudo)
│   ├── config/
│   │   ├── Database.ts           ← Configuração do PostgreSQL
│   │   ├── Jwt.ts                ← Configuração do JWT
│   │   └── tab_linha.sql         ← Seed de dados de linhas
│   ├── module/
│   │   └── Linha.ts              ← Módulo de Linhas (agrupa controller + service + repo)
│   ├── controller/
│   │   ├── Auth.ts               ← Endpoint POST /auth/login
│   │   └── Linha.ts              ← Endpoint GET /linhas
│   ├── service/
│   │   ├── Auth.ts               ← Lógica de autenticação
│   │   ├── Linha.ts              ← Lógica de negócio das linhas
│   │   └── Seed.ts               ← Popula banco na inicialização
│   ├── repository/
│   │   └── Linha.ts              ← Queries SQL anti-injection
│   ├── entity/
│   │   └── Linha.ts              ← Mapeamento da tabela tab_linha
│   ├── dto/
│   │   ├── Auth.ts               ← Validação do login (username + password)
│   │   └── Linha.ts              ← Validação dos filtros de busca
│   ├── guards/
│   │   └── Jwt.ts                ← Proteção de rotas com JWT
│   ├── filters/
│   │   └── all-exceptions.filter.ts ← Captura e formata todos os erros
│   ├── exceptions/
│   │   ├── Business.ts           ← Exceção base de regra de negócio (400)
│   │   ├── entity-not-found.exception.ts ← Entidade não encontrada (404)
│   │   └── entity-already-exists.exception.ts ← Duplicidade (409)
│   ├── utils/
│   │   └── Base.ts               ← Entidade base com createdAt / updatedAt
│   ├── docs/
│   │   └── Swagger.ts            ← Configuração da documentação OpenAPI
│   └── k8s/
│       ├── app-deployment.yaml   ← Deployment Kubernetes (2 réplicas)
│       └── app-service.yaml      ← Service para exposição do pod
├── .env                          ← Variáveis de ambiente (local)
├── docker-compose.yml            ← Sobe PostgreSQL + pgAdmin localmente
├── Dockerfile                    ← Imagem de produção (Node 20 Alpine)
├── .gitlab-ci.yml                ← Pipeline: build → test → deploy
└── init.sql                      ← Cria o schema 'dados_mobilidade' no boot
```

---

## 3. Arquitetura em Camadas

O NestJS segue um padrão de **arquitetura em camadas** (Layered Architecture), onde cada camada tem uma responsabilidade única.

```mermaid
graph TB
    subgraph Cliente["🌐 Cliente (HTTP)"]
        REQ[Requisição HTTP]
    end

    subgraph NestJS["🔷 Aplicação NestJS"]
        direction TB
        PIPE[ValidationPipe\n class-validator]
        GUARD[JwtAuthGuard\n Verifica Bearer Token]
        CTRL[Controller\n Recebe e repassa]
        SVC[Service\n Regra de negócio]
        REPO[Repository\n Query SQL segura]
        FILTER[AllExceptionsFilter\n Formata erros]
    end

    subgraph Infra["🗄️ Infraestrutura"]
        DB[(PostgreSQL\n dados_mobilidade.tab_linha)]
        SEED[SeedService\n Popula banco no boot]
    end

    REQ -->|"Body / Query Params"| PIPE
    PIPE -->|"DTO validado"| GUARD
    GUARD -->|"JWT ok ✅"| CTRL
    CTRL --> SVC
    SVC --> REPO
    REPO -->|"Query parametrizada $1"| DB
    DB --> REPO --> SVC --> CTRL
    CTRL -->|"JSON Response"| Cliente
    SEED -.->|"Executa tab_linha.sql"| DB

    GUARD -->|"Token inválido ❌"| FILTER
    REPO -->|"Erro de banco"| FILTER
    FILTER -->|"Resposta padronizada"| Cliente
```

> [!NOTE]
> Cada camada **só conversa com a camada imediatamente abaixo**. O Controller nunca acessa o banco diretamente, e o Repository nunca conhece o Controller. Isso facilita testes e manutenção.

---

## 4. Fluxo Completo de uma Requisição

### 4.1 Fluxo de Login (POST /api/auth/login)

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant CTRL as AuthController
    participant PIPE as ValidationPipe
    participant SVC as AuthService
    participant JWT as JwtService

    User->>CTRL: POST /api/auth/login\n{ username, password }
    CTRL->>PIPE: Valida LoginDto
    PIPE-->>CTRL: DTO válido ✅

    CTRL->>SVC: login(loginDto)
    SVC->>SVC: Verifica username === 'admin'\ne password === 'sismob@2026'

    alt Credenciais corretas
        SVC->>JWT: sign({ username, sub: 1, role: 'ADMIN' })
        JWT-->>SVC: access_token (Bearer, exp 8h)
        SVC-->>CTRL: { access_token, token_type, expires_in }
        CTRL-->>User: HTTP 200 OK\n{ access_token: "eyJ..." }
    else Credenciais inválidas
        SVC-->>CTRL: throw UnauthorizedException
        CTRL-->>User: HTTP 401 Unauthorized\n{ message: "Usuário ou senha inválidos" }
    end
```

> [!IMPORTANT]
> No boilerplate, a validação de credenciais é **simulada em memória** (`admin / sismob@2026`). Em um sistema real, você consultaria o banco de dados ou um servidor de Active Directory (AD) aqui dentro do `AuthService`.

---

### 4.2 Fluxo de Consulta de Linhas (GET /api/linhas)

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant CTRL as LinhaController
    participant GUARD as JwtAuthGuard
    participant PIPE as ValidationPipe
    participant SVC as LinhaService
    participant REPO as LinhaRepository
    participant DB as PostgreSQL

    User->>CTRL: GET /api/linhas?codigo=0.108\nAuthorization: Bearer eyJ...
    CTRL->>GUARD: canActivate()
    GUARD->>GUARD: Extrai token do header\nverifyAsync(token)

    alt Token válido
        GUARD-->>CTRL: true ✅
        CTRL->>PIPE: Valida FilterLinhaDto\n(MaxLength, IsOptional, IsString)
        PIPE-->>CTRL: DTO válido ✅
        CTRL->>SVC: buscarLinhas('0.108', undefined)
        SVC->>REPO: findByFilters('0.108', undefined)
        REPO->>DB: SELECT ... WHERE cd_linha = $1\n params: ['0.108']
        DB-->>REPO: rows[]
        REPO-->>SVC: Linha[]
        SVC-->>CTRL: Linha[]
        CTRL-->>User: HTTP 200 OK [ {...}, {...} ]
    else Token inválido ou ausente
        GUARD-->>User: HTTP 401 Unauthorized\n{ message: "Token inválido ou expirado" }
    end
```

---

## 5. Módulo de Autenticação — JWT em Detalhe

```mermaid
flowchart LR
    subgraph Geração["🔑 Geração (Login)"]
        A[Usuário envia\nusername + password] --> B{Credenciais\nválidas?}
        B -- Sim --> C[JwtService.sign\npayload: username, sub, role]
        C --> D[Retorna access_token\nBearer · exp 8h]
        B -- Não --> E[HTTP 401\nUnauthorized]
    end

    subgraph Uso["🔒 Uso (Rotas Protegidas)"]
        F[Usuário envia\nAuthorization: Bearer TOKEN] --> G[JwtAuthGuard\nextractTokenFromHeader]
        G --> H{JwtService\n.verifyAsync}
        H -- Válido --> I[request.user = payload\nAcesso liberado ✅]
        H -- Inválido/Expirado --> J[HTTP 401\nToken inválido]
    end

    D -.->|"Guarda o token e\nenvia nas próximas chamadas"| F
```

---

## 6. Proteção contra SQL Injection

O `LinhaRepository` usa **queries parametrizadas** nativas do PostgreSQL, que é a forma mais segura de montar SQL dinâmico.

```mermaid
flowchart TD
    A["FilterLinhaDto\n{ codigo?: string, descricao?: string }"] --> B[LinhaRepository\nfindByFilters]

    B --> C["Monta SQL base:\nSELECT ... FROM tab_linha WHERE 1=1"]

    C --> D{codigo\nfornecido?}
    D -- Sim --> E["sql += AND cd_linha = $1\nparams.push(codigo)"]
    D -- Não --> F[Ignora filtro]

    E --> G{descricao\nfornecida?}
    F --> G

    G -- Sim --> H["sql += AND tx_linha LIKE $2\nparams.push('%descricao%')"]
    G -- Não --> I[Ignora filtro]

    H --> J["dataSource.query(sql, params)\n⚠️ O driver substitui $1, $2...\nde forma segura — sem concatenação!"]
    I --> J

    J --> K[(PostgreSQL\nexecuta com segurança)]
```

> [!WARNING]
> **Nunca** faça `sql += "AND cd_linha = '" + codigo + "'"`. Isso permite SQL Injection. Sempre use parâmetros `$1, $2, ...` e passe os valores no array separado.

---

## 7. Ciclo de Vida da Aplicação (Bootstrap)

```mermaid
flowchart TD
    A["▶️ npm run start:dev\nou\nnpm run start:prod"] --> B["NestFactory.create(AppModule)"]

    B --> C[ConfigModule carrega\n.env → databaseConfig + jwtConfig]
    C --> D["TypeOrmModule conecta\nao PostgreSQL"]
    D --> E["JwtModule registra\nsecret + expiresIn"]
    E --> F[LinhaModule registra\nController · Service · Repository]

    F --> G["SeedService.onApplicationBootstrap()\n🌱 Verifica se tab_linha tem dados"]
    G --> H{Tabela\nvazia?}
    H -- Sim --> I["Lê src/config/tab_linha.sql\ne executa no banco"]
    H -- Não --> J["Pula seed\n(evita duplicatas)"]

    I --> K
    J --> K

    K["ValidationPipe global\n(whitelist + forbidNonWhitelisted)"] --> L
    L["AllExceptionsFilter global"] --> M
    M["CORS habilitado"] --> N
    N["Swagger configurado em\n/api/docs"] --> O

    O["🚀 Servidor escutando\nem http://localhost:8097/api"]
```

---

## 8. Hierarquia de Exceções

```mermaid
classDiagram
    class HttpException {
        +getStatus() HttpStatus
        +getResponse() object
    }

    class BusinessException {
        +constructor(message: string, status?: HttpStatus)
        +statusCode: HttpStatus
        +message: string
        +error: string
        +timestamp: string
    }

    class EntityNotFoundException {
        +constructor(entity: string, id: any)
        Retorna HTTP 404
    }

    class EntityAlreadyExistsException {
        +constructor(entity: string, field: string)
        Retorna HTTP 409
    }

    class AllExceptionsFilter {
        +catch(exception, host)
        Captura TODAS as exceções
        Formata resposta padronizada
    }

    HttpException <|-- BusinessException
    BusinessException <|-- EntityNotFoundException
    BusinessException <|-- EntityAlreadyExistsException
    AllExceptionsFilter ..> HttpException : captura
```

**Formato de erro padronizado** (toda exceção retorna este JSON):

```json
{
  "statusCode": 404,
  "timestamp": "2026-05-07T00:00:00.000Z",
  "path": "/api/linhas",
  "method": "GET",
  "message": "Linha com identificador '999' não foi encontrado."
}
```

---

## 9. Entidade e Banco de Dados

```mermaid
erDiagram
    TAB_LINHA {
        int id_linha PK "Identificador único"
        varchar cd_linha "Código da linha (Ex: 0.108)"
        varchar tx_linha "Descrição (Ex: W3 Norte)"
        numeric vl_tarifa "Valor da tarifa (Ex: 5.50)"
        varchar fx_tarifaria "Faixa tarifária (nullable)"
        timestamp dataregistro "Data de registro (auto)"
        date dt_inicial_tarifa "Início da vigência da tarifa (nullable)"
        date dt_final_tarifa "Fim da vigência da tarifa (nullable)"
    }
```

> [!NOTE]
> A tabela fica no schema `dados_mobilidade`. O schema é criado automaticamente pelo `init.sql` quando o container PostgreSQL sobe pela primeira vez.

---

## 10. Infraestrutura Local (Docker Compose)

```mermaid
graph TB
    subgraph Host["💻 Máquina Local"]
        APP["🔷 NestJS App\n:8097"]
        CLI["🌐 Browser / Postman"]
    end

    subgraph Docker["🐳 Docker Compose"]
        PG["🐘 sismob-postgres\n(postgres:15-alpine)\n:5432"]
        PGADMIN["🖥️ sismob-pgadmin\n(dpage/pgadmin4)\n:5050"]
        VOL[("📦 Volume\nsismob_pgdata")]
    end

    APP -->|"TypeORM\nlocalhost:5432"| PG
    CLI -->|"http://localhost:5050"| PGADMIN
    PGADMIN -->|"Interface visual\npara o banco"| PG
    PG --- VOL
    PG -.->|"init.sql executado\nno primeiro boot"| PG
```

**Comandos Docker:**
```bash
# Sobe o banco + pgAdmin
docker-compose up -d

# Para tudo
docker-compose down

# Apaga dados do volume (reset total)
docker-compose down -v
```

---

## 11. Pipeline CI/CD (GitLab)

```mermaid
flowchart LR
    subgraph Trigger["⚡ Trigger"]
        TAG["git tag v1.0.0\ngit push --tags"]
    end

    subgraph Build["🔨 Stage: build"]
        B1[docker login\nno GitLab Registry]
        B2["docker build\n-t registry/sismob:v1.0.0 ."]
        B3["docker push\n:v1.0.0 e :latest"]
        B1 --> B2 --> B3
    end

    subgraph Test["🧪 Stage: test"]
        T1["docker pull\nregistry/sismob:v1.0.0"]
        T2["docker run --rm\necho CONTAINER_START_OK"]
        T1 --> T2
    end

    subgraph Deploy["🚀 Stage: deploy"]
        D1["kubectl apply -f k8s/\nCria Deployment + Service"]
        D2["kubectl set image\natualiza para :v1.0.0"]
        D3["kubectl rollout status\nAguarda pods subirem"]
        D1 --> D2 --> D3
    end

    TAG --> Build --> Test --> Deploy
```

> [!IMPORTANT]
> O pipeline **só dispara com uma tag Git**. Para fazer deploy, crie uma tag (`git tag v1.x.x`) e dê push. Commits sem tag não acionam o CI/CD.

---

## 12. Arquitetura Kubernetes (Produção)

```mermaid
graph TB
    subgraph Internet["🌐 Internet"]
        USER["👤 Usuário"]
    end

    subgraph K8s["☸️ Cluster Kubernetes"]
        subgraph SVC["Service (LoadBalancer/NodePort)"]
            S["app-service.yaml\n:3000"]
        end

        subgraph DEP["Deployment (2 réplicas)"]
            P1["🟦 Pod 1\nsismob-app-deployment"]
            P2["🟦 Pod 2\nsismob-app-deployment"]
        end

        subgraph SECRETS["Secrets"]
            ENV["sismob-app-env\n(variáveis sensíveis do .env)"]
            REG["gitlab-registry\n(credenciais para puxar imagem)"]
        end
    end

    subgraph Registry["📦 GitLab Registry"]
        IMG["registry/sismob:v1.0.0"]
    end

    USER --> S
    S --> P1
    S --> P2
    ENV -.->|"envFrom: secretRef"| P1
    ENV -.->|"envFrom: secretRef"| P2
    REG -.->|"imagePullSecrets"| P1
    REG -.->|"imagePullSecrets"| P2
    IMG -.->|"image pull"| P1
    IMG -.->|"image pull"| P2
```

> [!TIP]
> As variáveis de ambiente (DB_PASSWORD, JWT_SECRET etc.) **nunca ficam no código**. No Kubernetes, elas são armazenadas como `Secret` e injetadas nos pods via `envFrom`.

---

## 13. Fluxo de Desenvolvimento — Como Adicionar um Novo Recurso

Seguindo o padrão do boilerplate, para criar um novo recurso (ex: `Veículo`) você deve:

```mermaid
flowchart TD
    A["1️⃣ Criar Entity\nsrc/entity/Veiculo.ts\n@Entity, @Column, @PrimaryColumn"] --> B
    B["2️⃣ Criar DTO\nsrc/dto/Veiculo.ts\nclass-validator decorators"] --> C
    C["3️⃣ Criar Repository\nsrc/repository/Veiculo.ts\nQueries parametrizadas"] --> D
    D["4️⃣ Criar Service\nsrc/service/Veiculo.ts\nLógica de negócio"] --> E
    E["5️⃣ Criar Controller\nsrc/controller/Veiculo.ts\n@Get, @Post, @UseGuards"] --> F
    F["6️⃣ Criar Module\nsrc/module/Veiculo.ts\nAgrupa tudo + registra TypeORM"] --> G
    G["7️⃣ Importar em AppModule\nsrc/app.module.ts\nimports: [VeiculoModule]"] --> H
    H["✅ Novo endpoint disponível\nem /api/veiculos"]
```

---

## 14. Variáveis de Ambiente

| Variável | Exemplo | Descrição |
|---|---|---|
| `DB_HOST` | `localhost` | Host do banco PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_SERVICE_NAME` | `postgres` | Nome do banco (database) |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `postgres` | Senha do banco |
| `DB_SYNCHRONIZE` | `true` | Sincroniza schema automaticamente (**nunca use `true` em produção!**) |
| `DB_LOGGING` | `true` | Exibe queries SQL no console |
| `JWT_SECRET` | `SISMOB_SECRET_KEY_2026` | Chave de assinatura dos tokens JWT |
| `JWT_EXPIRES_IN` | `8h` | Tempo de expiração do token |
| `APP_PREFIX` | `api` | Prefixo global das rotas (ex: `/api/linhas`) |

> [!CAUTION]
> **Nunca** faça commit do `.env` com dados de produção. O arquivo `.gitignore` já exclui o `.env` por padrão. Em produção, use Kubernetes Secrets ou variáveis de CI/CD do GitLab.

---

## 15. Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ Pública | Gera um token JWT |
| `GET` | `/api/linhas` | ✅ Bearer JWT | Lista linhas com filtros opcionais |
| `GET` | `/api/docs` | ❌ Pública | Interface Swagger/OpenAPI |

**Exemplo de uso com cURL:**

```bash
# 1. Obter token
curl -X POST http://localhost:8097/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"sismob@2026"}'

# 2. Usar token para consultar linhas
curl http://localhost:8097/api/linhas?codigo=0.108 \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

---

*Documentação gerada automaticamente a partir do código-fonte do SISMOB-BOILERPLATE.*  
*Última atualização: 2026-05-07*
