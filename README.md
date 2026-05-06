# SISMOB-BOILERPLATE

Boilerplate padronizado para o desenvolvimento de sistemas backend da **SEMOB-DF (SISMOB)**, utilizando NestJS, PostgreSQL e arquitetura em camadas.

## 🚀 Tecnologias
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL 15
- **ORM:** TypeORM
- **Segurança:** JWT (JSON Web Token), Bcrypt e Proteção contra SQL Injection
- **Documentação:** Swagger (OpenAPI)
- **Infraestrutura:** Docker & Kubernetes

---

## 🛠️ Ambiente de Desenvolvimento Local

### 1. Requisitos
- Docker Desktop
- Node.js 18+ (opcional se rodar fora do Docker)

### 2. Infraestrutura (Banco de Dados e pgAdmin)
O projeto já conta com um ambiente pronto. Para subir o banco e a ferramenta de gerenciamento:

```bash
docker compose up -d
```

- **PostgreSQL:** Rodando na porta `5432`.
- **pgAdmin 4:** Acesse em [http://localhost:5050](http://localhost:5050)
  - **Login:** `admin@sismob.com`
  - **Senha:** `admin`
  - **Dica:** Para conectar no banco pelo pgAdmin, use o host `sismob-db`.

---

## 🔑 APIs de Exemplo

O projeto inclui módulos de exemplo que seguem os padrões de engenharia da SISMOB.

### 1. Autenticação (Auth)
Utilizada para gerar tokens JWT para testar rotas protegidas.
- **Rota:** `POST /api/auth/login`
- **Credenciais de Teste:**
  - `username: admin`
  - `password: sismob@2026`

### 2. Linhas de Mobilidade
Módulo que demonstra consulta ao banco de dados com proteção contra SQL Injection.
- **Rota:** `GET /api/linhas`
- **Segurança:** Exige `Bearer Token` no Header.
- **Filtros:** Suporta `codigo` e `descricao`.

---

## 📖 Documentação Swagger

A documentação interativa fica disponível em:
[http://localhost:8097/api/docs](http://localhost:8097/api/docs)

**Como testar rotas protegidas no Swagger:**
1. Chame a rota `/api/auth/login` para obter o `access_token`.
2. Clique no botão **"Authorize"** no topo da página.
3. Cole o token e salve.
4. Agora as rotas do `LinhaController` estarão liberadas para teste.

---

## 🧠 Decisão Arquitetural: Entity vs SQL Nativo

Para manter a alta performance em sistemas de grande escala (como o SISMOB), seguimos esta regra de ouro:

### 1. Quando usar ENTITIES (ORM)
- **Cenário:** Operações de **CRUD** (Create, Read, Update, Delete) em uma única tabela.
- **Vantagem:** Rapidez no desenvolvimento, validação automática de tipos e integridade dos dados.

### 2. Quando usar SQL NATIVO (Sem Entity)
- **Cenário:** **Relatórios complexos**, consultas com múltiplos `JOINS` (mais de 3 tabelas) ou agregações pesadas.
- **Vantagem:** 
    - **Performance Extrema:** Evita o custo de processamento (hydration) do ORM.
    - **Flexibilidade:** Permite usar recursos específicos do PostgreSQL que o ORM muitas vezes limita.
    - **Clareza:** Para quem vem do mundo DBA/SQL, o código fica muito mais legível que um QueryBuilder gigante.
- **Padrão:** Nestes casos, não criamos uma Entity. Retornamos os dados diretamente em um **DTO** ou **Interface**.

---

## 🏗️ Estrutura de Pastas (Padrão SISMOB)

- `src/config`: Configurações de Banco, JWT e Variáveis de Ambiente.
- `src/controller`: Camada de entrada (Routes).
- `src/service`: Lógica de negócio e regras.
- `src/repository`: Acesso a dados (SQL Nativo Parametrizado).
- `src/entity`: Mapeamento de tabelas.
- `src/dto`: Objetos de transferência de dados e validação.
- `src/guards`: Filtros de segurança (JWT).

---

## 📦 Deploy e CI/CD
- **Docker:** `Dockerfile` pronto para produção.
- **K8s:** Manifestos em `src/k8s/` para deployment no cluster.
- **GitLab CI:** Pipeline configurada em `.gitlab-ci.yml`.

---
*Desenvolvido pela equipe de Engenharia de Software da SEMOB-DF.*
