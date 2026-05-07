# Agroware Mombasa — Web App

Aplicação web monolítica para gestão de propriedades rurais dedicadas à pecuária de corte (fases de recria e engorda) em regime semi-intensivo.

Projeto acadêmico — disciplina de Programação Web II, IFRO Campus Ji-Paraná, 2026.1.

---

## Stack

- **NestJS 11** + Express
- **EJS 5** + express-ejs-layouts
- **TypeORM 0.3** + MySQL 8.0
- **@nestjs/config** — variáveis de ambiente via `.env`

## Pré-requisitos

- Node.js 20+
- MySQL 8.0 com o banco `agroware_mombasa` criado

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

## Executar

```bash
# modo desenvolvimento (watch)
npm run start:dev

# modo produção
npm run start:prod
```

A aplicação sobe em `http://localhost:3000` por padrão.

## Estrutura

```
src/
├── config/database/   # DatabaseModule (TypeORM DataSource)
├── helpers/           # Helpers EJS (dateFormat, currencyFormat)
└── modules/           # Módulos de domínio (a implementar)

views/
├── layouts/           # Layout mestre e partials
└── home.ejs

public/
├── css/               # style.css (template) + agroware.css (brand)
├── js/
└── vendor/
```
