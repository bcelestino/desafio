# 🚀 Desafio QA - API Automation

Este projeto contém um conjunto de automações completas, incluindo testes end-to-end (Cypress), contrato (Postman/Newman), carga (k6) e pipeline CI/CD (GitHub Actions).


## 💡 Tecnologias utilizadas

- **Cypress** → Automação e2e, API e validação de payload.  
- **Postman + Newman** → Testes de contrato.  
- **k6** → Testes de carga e desempenho.  
- **chai-json-schema** → Validação de contratos de resposta JSON.  
- **jsonwebtoken (JWT)** → Geração e validação de tokens.  
- **dotenv** → Gerenciamento seguro de variáveis de ambiente.  
- **GitHub Actions** → Integração contínua (CI/CD).  

---

## 📁 Estrutura do projeto

├── cypress/
│ ├── e2e/
│ ├── fixtures/
│ └── support/
├── postman/
│ └── collections/
├── load/
│ └── users_load.js
├── .github/
│ └── workflows/
│ └── ci.yml
├── cypress.config.js
├── .env (não versionado)
├── .env.exemplo (modelo de exemplo sem dados versionado)
├── package.json
├── .gitignore
└── README.md

## 🧰 Pré-requisitos

- Node.js >= 18
- npm >= 9
- Postman (opcional para criar/editar coleções)
- k6 instalado globalmente (ou via Docker)

---

## 🔑 Configuração de ambiente

1️⃣ Clonar o repositório


```bash
git clone https://github.com/bcelestino/desafio
```bash


2️⃣ Instalar as dependências

```bash
npm install
```bash


3️⃣ Configurar o .env

⚠️ Nunca suba suas chaves ou tokens para o repositório.
O arquivo cypress.env.json já está listado no .gitignore.

## 🏃 Como rodar

✅ Testes de automação (Cypress)

```bash
npm run test
```bash


Ou para abrir a interface interativa:

```bash
npx cypress open
```bash


✅ Testes Postman (Newman)


```bash
npm run postman
```bash



✅ Testes de carga (k6)

```bash
npm run load
npm run load-login
```bash



```json
"scripts": {
    "postman": "newman run postman/Softdev.postman_collection.json -e postman/env_soft.postman_environment.json --reporters cli,html --reporter-html-export postman/report.html",
    "cypress": "cypress open",
    "test": "cypress run",
    "load": "dotenv -e .env -- k6 run load/users_load_test.js",
    "load-login": "dotenv -e .env -- k6 run load/login_load_test.js",
    "teste": "echo \"Error: no test specified\" && exit 1"
}
```json


🤝 Boas práticas aplicadas
✅ Comandos customizados em support/commands.js para fluxo de autenticação

✅ Uso de interceptações para simular erros e delays

✅ Estrutura modular e reutilizável

✅ Variáveis de ambiente protegidas

✅ Cobertura funcional e de contrato

✅ Validações robustas com assertions detalhadas

✅ Pipelines CI/CD configurados (GitHub Actions)

⚙️ CI/CD
O pipeline em .github/workflows/ci.yml executa automaticamente os testes em PRs ou pushs para a branch principal.

💬 Contribuição
Pull requests são bem-vindos!
Para grandes alterações, abra primeiro uma issue para discutir o que gostaria de modificar.

📄 Licença
MIT

⚠️ Importante
🔐 Nunca adicione seu cypress.env.json ou qualquer token em commits.
Use variáveis de ambiente e configure corretamente no CI.

