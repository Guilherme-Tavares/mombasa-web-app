# Agroware Mombasa

## Descrição

Aplicação web monolítica para gestão de propriedades rurais dedicadas à pecuária de corte (fases de recria e engorda) em regime semi-intensivo. O nome referencia o capim-mombaça (*Panicum maximum* cv. Mombaça), forrageira amplamente utilizada nesses sistemas no Brasil.

## Objetivo

Fornecer aos produtores rurais uma ferramenta para controle de rebanho, divisões de pastagem, insumos (alimentação e medicamentos), temporadas produtivas e rastreabilidade dos animais.

## Equipe

Guilherme Tavares

## Stack

- **NestJS 11** com Express
- **EJS 5** com express-ejs-layouts
- **TypeORM 0.3** com MySQL 8.0
- **@nestjs/config** para variáveis de ambiente via `.env`

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
└── modules/           # Módulos de domínio

views/
├── layouts/           # Layout mestre e partials
└── home.ejs

public/
├── css/               # style.css (template) + agroware.css (identidade visual)
├── js/
└── vendor/
```

## Contexto acadêmico

Projeto da disciplina de Programação Web II, IFRO Campus Ji-Paraná, 2026.1.
