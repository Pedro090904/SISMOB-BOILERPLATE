# SISMOB BOILERPLATE - Backend

Este é o repositório base padronizado para o desenvolvimento de sistemas backend no ecossistema **SISMOB**. Ele utiliza o framework **NestJS** com integração nativa ao **Oracle Database** e orquestração via **Kubernetes**.

---

## 📂 Estrutura de Pastas

A arquitetura segue o padrão de **Camadas (Layered Architecture)** para garantir manutenibilidade e escalabilidade.

### `src/`
*   **`config/`**: Centraliza configurações globais (Banco de Dados, Variáveis de Ambiente).
*   **`controller/`**: Camada de entrada (HTTP). Responsável apenas por receber a requisição, validar a entrada (via DTOs) e chamar o serviço correspondente.
*   **`service/`**: **Coração da aplicação**. Onde reside toda a lógica de negócio. Não deve haver lógica de banco de dados aqui.
*   **`repository/`**: Camada de persistência. Isolamos aqui todas as queries (TypeORM) para que o serviço não dependa de detalhes do banco de dados.
*   **`entity/`**: Definições das tabelas do banco de dados (Oracle). Utiliza decoradores do TypeORM.
*   **`dto/`**: Objetos de transferência de dados. Utilizados para tipar e validar as entradas da API usando `class-validator`.
*   **`exceptions/`**: Definições de erros customizados (ex: `BusinessException`), permitindo lançar erros semânticos que são capturados pelo filtro global.
*   **`filters/`**: Filtros de exceção que interceptam erros e formatam a resposta JSON padronizada para o frontend.
*   **`utils/`**: Classes base (ex: `BaseEntity`) e funções auxiliares reutilizáveis.
*   **`docs/`**: Configurações de documentação automática (Swagger).

### `k8s/`
*   Contém os manifestos YAML para deploy no Kubernetes (Deployment e Service).

---

## 📚 Bibliotecas Principais

Para manter a padronização, os projetos SISMOB devem utilizar preferencialmente as seguintes bibliotecas:

| Biblioteca | Finalidade |
| :--- | :--- |
| **@nestjs/core** | Framework base da aplicação. |
| **TypeORM** | ORM oficial para interação com o banco de dados. |
| **oracledb** | Driver nativo para conexão com Oracle Database. |
| **@nestjs/jwt** | Implementação de autenticação via JSON Web Token. |
| **@nestjs/passport**| Integração com estratégias de autenticação Passport. |
| **bcrypt** | Algoritmo de hash para armazenamento seguro de senhas. |
| **class-validator** | Validação de payloads e prevenção contra Injection de dados. |

---

## 🛠️ Como Iniciar um Novo Projeto

1.  **Clone este repositório:**
    ```bash
    git clone https://repositorio.semob.df.gov.br/sismob/boilerplate.git meu-novo-projeto
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente:**
    *   Renomeie o arquivo `.env.example` para `.env`.
    *   Configure as credenciais do banco Oracle.

4.  **Desenvolvimento:**
    *   Inicie em modo watch: `npm run start:dev`
    *   Acesse a documentação Swagger em: `http://localhost:3000/api`

---

## 🔐 Padrões de Segurança

### 1. Autenticação (JWT)
*   **Token:** Utilizar `Bearer Token` em todas as rotas protegidas.
*   **Expiração:** O padrão configurado é de **8 horas**. Pode ser ajustado via variável `JWT_EXPIRES_IN`.
*   **Segredo:** Nunca deixe a `JWT_SECRET` exposta no código. Utilize o arquivo `.env`.

### 2. Prevenção contra Injection (SQL/NoSQL)
*   **SQL Nativo Parametrizado:** O padrão do projeto é utilizar SQL Nativo para maior controle e performance. Para evitar Injection, **nunca concatene variáveis diretamente na string SQL**. Utilize placeholders (`:1`, `:2` ou `?`) e passe os valores no array de parâmetros.
    *   *Errado:* `query("SELECT * FROM TAB_LINHA WHERE CD_LINHA = '" + codigo + "'")`
    *   *Certo:* `query("SELECT * FROM TAB_LINHA WHERE CD_LINHA = :1", [codigo])`
*   **Validação de Entrada:** Utilize os decoradores `@IsString()`, `@IsInt()`, etc., nos DTOs. Isso impede que caracteres maliciosos cheguem à camada de banco de dados.

### 3. Senhas
*   **Hash:** Nunca armazene senhas em texto plano. Utilize a biblioteca `bcrypt` com um *salt factor* de pelo menos 10.

---
**SUTINF - Secretaria de Transporte e Mobilidade do DF**
