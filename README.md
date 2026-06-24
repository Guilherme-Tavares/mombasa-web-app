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
- MySQL 8.0 em execução (o banco `agroware_mombasa_legacy` é criado pelo script DDL abaixo)

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

## Banco de dados

A aplicação roda com `DB_SYNCHRONIZE=false`, ou seja, **não cria as tabelas automaticamente**. Antes de executar, rode os dois scripts SQL abaixo no MySQL, nesta ordem:

1. **DDL** - cria o banco `agroware_mombasa_legacy` e as 16 tabelas (com PKs UUID, enums, FKs e constraints).
2. **DML** - popula as tabelas com dados de exemplo (1 produtor, 1 propriedade *Sítio Santa Fé*, 6 divisões, 4 rebanhos, 20 bovinos, etc.). É re-executável: limpa os dados antes de inserir.

<details>
<summary><strong>Script DDL - estrutura do banco</strong></summary>

```sql
CREATE DATABASE agroware_mombasa_legacy;
USE agroware_mombasa_legacy;

-- ============================================
-- TABELA: produtor
-- ============================================
CREATE TABLE produtor
(
    id_produtor CHAR(36) NOT NULL DEFAULT (UUID()),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    senha VARCHAR(256),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_produtor)
);

-- ============================================
-- TABELA: propriedade
-- ============================================
CREATE TABLE propriedade
(
    id_propriedade CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_produtor CHAR(36) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    area_total_hectares DECIMAL(10,2),
    municipio VARCHAR(100),
    estado CHAR(2),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_propriedade),
    FOREIGN KEY (fk_id_produtor) REFERENCES produtor(id_produtor)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- TABELA: divisao
-- ============================================
CREATE TABLE divisao
(
    id_divisao CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_propriedade CHAR(36) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    tipo ENUM('pasto', 'reserva', 'instalacao') NOT NULL DEFAULT 'pasto',
    area_hectares DECIMAL(10,2),
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_divisao),
    FOREIGN KEY (fk_id_propriedade) REFERENCES propriedade(id_propriedade)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- TABELA: rebanho
-- ============================================
CREATE TABLE rebanho
(
    id_rebanho CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_propriedade CHAR(36) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    finalidade ENUM('recria', 'engorda', 'misto') NOT NULL,
    data_formacao DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_rebanho),
    FOREIGN KEY (fk_id_propriedade) REFERENCES propriedade(id_propriedade)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- TABELA: bovino
-- ============================================
CREATE TABLE bovino
(
    id_bovino CHAR(36) NOT NULL DEFAULT (UUID()),
    brinco VARCHAR(20) UNIQUE,
    nome VARCHAR(50) NOT NULL,
    sexo ENUM('m', 'f') NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    peso_atual_kg DECIMAL(6,2),
    data_ultima_pesagem DATE,
    origem ENUM('comprado', 'doacao'),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_bovino)
);

-- ============================================
-- TABELA: temporada
-- ============================================
CREATE TABLE temporada
(
    id_temporada CHAR(36) NOT NULL DEFAULT (UUID()),
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('aguas', 'seca', 'transicao') NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,

    PRIMARY KEY (id_temporada),
    CHECK (data_fim > data_inicio)
);

-- ============================================
-- TABELA: forragem
-- ============================================
CREATE TABLE forragem
(
    id_forragem CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_divisao CHAR(36) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_plantio DATE,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_forragem),
    FOREIGN KEY (fk_id_divisao) REFERENCES divisao(id_divisao)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- TABELA: cocho
-- ============================================
CREATE TABLE cocho
(
    id_cocho CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_divisao CHAR(36) NOT NULL,
    identificacao VARCHAR(30),
    tipo_material ENUM('madeira', 'concreto', 'plastico', 'metal'),
    capacidade_kg DECIMAL(8,2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_cocho),
    FOREIGN KEY (fk_id_divisao) REFERENCES divisao(id_divisao)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (capacidade_kg > 0)
);

-- ============================================
-- TABELA: medicamento
-- ============================================
CREATE TABLE medicamento
(
    id_medicamento CHAR(36) NOT NULL DEFAULT (UUID()),
    nome_comercial VARCHAR(100) NOT NULL UNIQUE,
    principio_ativo VARCHAR(100),
    tipo ENUM('antibiotico', 'antiparasitario', 'vitamina', 'vacina', 'outro') NOT NULL,

    PRIMARY KEY (id_medicamento)
);

-- ============================================
-- TABELA: alimento
-- ============================================
CREATE TABLE alimento
(
    id_alimento CHAR(36) NOT NULL DEFAULT (UUID()),
    nome VARCHAR(100) NOT NULL UNIQUE,
    tipo ENUM('racao', 'sal_mineral', 'silagem', 'farelo', 'suplemento', 'outro') NOT NULL,

    PRIMARY KEY (id_alimento)
);

-- ============================================
-- TABELA: estoque_medicamento
-- ============================================
CREATE TABLE estoque_medicamento
(
    id_estoque_med CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_propriedade CHAR(36) NOT NULL,
    fk_id_medicamento CHAR(36) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    unidade ENUM('ml', 'l', 'g', 'kg', 'doses', 'frascos') NOT NULL,
    data_entrada DATE NOT NULL DEFAULT (CURRENT_DATE),
    estoque_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,

    PRIMARY KEY (id_estoque_med),
    UNIQUE (fk_id_propriedade, fk_id_medicamento),
    FOREIGN KEY (fk_id_propriedade) REFERENCES propriedade(id_propriedade)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_medicamento) REFERENCES medicamento(id_medicamento)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (quantidade >= 0)
);

-- ============================================
-- TABELA: lotacao (N:N)
-- ============================================
CREATE TABLE lotacao
(
    id_lotacao CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_rebanho CHAR(36) NOT NULL,
    fk_id_divisao CHAR(36) NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE,
    numero_cabecas INT NOT NULL,

    PRIMARY KEY (id_lotacao),
    UNIQUE (fk_id_rebanho, fk_id_divisao, data_entrada),
    FOREIGN KEY (fk_id_rebanho) REFERENCES rebanho(id_rebanho)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_divisao) REFERENCES divisao(id_divisao)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (numero_cabecas > 0)
);

-- ============================================
-- TABELA: pertencimento (N:N)
-- ============================================
CREATE TABLE pertencimento
(
    id_pertencimento CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_bovino CHAR(36) NOT NULL,
    fk_id_rebanho CHAR(36) NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE,
    peso_entrada_kg DECIMAL(6,2),

    PRIMARY KEY (id_pertencimento),
    UNIQUE (fk_id_bovino, fk_id_rebanho, data_entrada),
    FOREIGN KEY (fk_id_bovino) REFERENCES bovino(id_bovino)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_rebanho) REFERENCES rebanho(id_rebanho)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (peso_entrada_kg IS NULL OR peso_entrada_kg > 0)
);

-- ============================================
-- TABELA: passagem_temporada (N:N)
-- ============================================
CREATE TABLE passagem_temporada
(
    id_passagem CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_rebanho CHAR(36) NOT NULL,
    fk_id_temporada CHAR(36) NOT NULL,
    peso_medio_inicial_kg DECIMAL(6,2),
    peso_medio_final_kg DECIMAL(6,2),
    gmd_medio_kg DECIMAL(5,3),

    PRIMARY KEY (id_passagem),
    UNIQUE (fk_id_rebanho, fk_id_temporada),
    FOREIGN KEY (fk_id_rebanho) REFERENCES rebanho(id_rebanho)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_temporada) REFERENCES temporada(id_temporada)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- TABELA: aplicacao_medicamento (N:N)
-- ============================================
CREATE TABLE aplicacao_medicamento
(
    id_aplicacao CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_bovino CHAR(36) NOT NULL,
    fk_id_medicamento CHAR(36) NOT NULL,
    data_aplicacao DATETIME NOT NULL,
    dose DECIMAL(8,2) NOT NULL,
    unidade_dose ENUM('ml', 'g', 'doses') NOT NULL,

    PRIMARY KEY (id_aplicacao),
    FOREIGN KEY (fk_id_bovino) REFERENCES bovino(id_bovino)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_medicamento) REFERENCES medicamento(id_medicamento)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (dose > 0)
);

-- ============================================
-- TABELA: abastecimento_cocho (N:N)
-- ============================================
CREATE TABLE abastecimento_cocho
(
    id_abastecimento CHAR(36) NOT NULL DEFAULT (UUID()),
    fk_id_cocho CHAR(36) NOT NULL,
    fk_id_alimento CHAR(36) NOT NULL,
    data_abastecimento DATETIME NOT NULL,
    quantidade_inicial_kg DECIMAL(8,2) NOT NULL,
    quantidade_restante_kg DECIMAL(8,2) NOT NULL,
    esgotado BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (id_abastecimento),
    FOREIGN KEY (fk_id_cocho) REFERENCES cocho(id_cocho)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_alimento) REFERENCES alimento(id_alimento)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (quantidade_inicial_kg > 0 AND quantidade_restante_kg >= 0)
);
```

</details>

<details>
<summary><strong>Script DML - dados de exemplo</strong></summary>

```sql
USE agroware_mombasa_legacy;

-- Desativa o modo de atualização segura do Workbench (evita o erro 1175 nos
-- DELETE sem WHERE abaixo). Reativado ao final do script.
SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- LIMPEZA (ordem reversa de dependência) — torna o script re-executável
-- ============================================
DELETE FROM abastecimento_cocho;
DELETE FROM aplicacao_medicamento;
DELETE FROM passagem_temporada;
DELETE FROM pertencimento;
DELETE FROM lotacao;
DELETE FROM estoque_medicamento;
DELETE FROM alimento;
DELETE FROM medicamento;
DELETE FROM cocho;
DELETE FROM forragem;
DELETE FROM temporada;
DELETE FROM bovino;
DELETE FROM rebanho;
DELETE FROM divisao;
DELETE FROM propriedade;
DELETE FROM produtor;

-- ============================================
-- PRODUTOR (1)
-- ============================================
-- senha de demonstração: admin.mombasa2026 (hash ASP.NET Identity PasswordHasher V3)
INSERT INTO produtor (id_produtor, nome, email, telefone, senha) VALUES
('10000000-0000-4000-8000-000000000001', 'Admin', 'admin@mombasa.com', '(69) 99999-0001', 'AQAAAAIAAYagAAAAEIhZaOWY1rAKSbY0CxAlvPc5wEK11GXfWlQcZpKjOyFDJEbu7NPk0qeN0jVk1lRWsA==');

-- ============================================
-- PROPRIEDADE (1)
-- ============================================
INSERT INTO propriedade (id_propriedade, fk_id_produtor, nome, area_total_hectares, municipio, estado, ativa) VALUES
('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Sítio Santa Fé', 480.00, 'Ji-Paraná', 'RO', TRUE);

-- ============================================
-- DIVISAO (6) — soma das áreas = 466 ha (≤ 480 ha)
-- ============================================
INSERT INTO divisao (id_divisao, fk_id_propriedade, nome, tipo, area_hectares, ativa) VALUES
('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Pasto Sede',           'pasto',      80.00,  TRUE),
('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'Pasto Baixão',         'pasto',      120.00, TRUE),
('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'Pasto da Mata',        'pasto',      95.00,  TRUE),
('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'Reserva Legal',        'reserva',    96.00,  TRUE),
('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 'Curral e Instalações', 'instalacao', 5.00,   TRUE),
('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', 'Pasto do Riacho',      'pasto',      70.00,  TRUE);

-- ============================================
-- REBANHO (4) — data_formacao não futura
-- ============================================
INSERT INTO rebanho (id_rebanho, fk_id_propriedade, nome, finalidade, data_formacao, ativo) VALUES
('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Lote Recria 2025',    'recria',  '2025-04-15', TRUE),
('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'Lote Engorda Nelore', 'engorda', '2025-08-10', TRUE),
('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'Lote Misto Sede',     'misto',   '2025-11-20', TRUE),
('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'Lote Engorda 2026',   'engorda', '2026-02-05', TRUE);

-- ============================================
-- BOVINO (20) — 'Pintada' e 'Fumaça' sem brinco (opcional)
-- ============================================
INSERT INTO bovino (id_bovino, brinco, nome, sexo, raca, data_nascimento, peso_atual_kg, data_ultima_pesagem, origem, ativo) VALUES
('50000000-0000-4000-8000-000000000001', 'BR-0001', 'Trovão',        'm', 'Nelore',  '2022-03-10', 520.00, '2026-05-20', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000002', 'BR-0002', 'Estrela',       'f', 'Nelore',  '2021-07-22', 430.00, '2026-05-20', 'doacao',   TRUE),
('50000000-0000-4000-8000-000000000003', 'BR-0003', 'Relâmpago',     'm', 'Brahman', '2022-01-15', 540.00, '2026-06-01', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000004', 'BR-0004', 'Mimosa',        'f', 'Gir',     '2020-11-30', 460.00, '2026-06-01', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000005', 'BR-0005', 'Curió',         'm', 'Angus',   '2022-09-05', 500.00, '2026-05-15', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000006', 'BR-0006', 'Aurora',        'f', 'Nelore',  '2021-05-18', 410.00, '2026-05-15', 'doacao',   TRUE),
('50000000-0000-4000-8000-000000000007', 'BR-0007', 'Touro Sansão',  'm', 'Nelore',  '2019-04-02', 720.00, '2026-06-10', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000008', NULL,      'Pintada',       'f', 'Senepol', '2022-12-12', 380.00, '2026-06-10', NULL,       TRUE),
('50000000-0000-4000-8000-000000000009', 'BR-0009', 'Valente',       'm', 'Brahman', '2023-02-20', 360.00, '2026-05-25', 'comprado', TRUE),
('50000000-0000-4000-8000-00000000000a', 'BR-0010', 'Boneca',        'f', 'Cruzado', '2022-08-08', 395.00, '2026-05-25', 'doacao',   TRUE),
('50000000-0000-4000-8000-00000000000b', 'BR-0011', 'Gateado',       'm', 'Nelore',  '2023-01-09', 340.00, '2026-06-05', 'comprado', TRUE),
('50000000-0000-4000-8000-00000000000c', 'BR-0012', 'Maravilha',     'f', 'Gir',     '2021-10-14', 445.00, '2026-06-05', 'comprado', TRUE),
('50000000-0000-4000-8000-00000000000d', 'BR-0013', 'Jaguar',        'm', 'Angus',   '2022-06-25', 510.00, '2026-05-30', 'comprado', TRUE),
('50000000-0000-4000-8000-00000000000e', 'BR-0014', 'Princesa',      'f', 'Nelore',  '2020-09-19', 455.00, '2026-05-30', 'doacao',   TRUE),
('50000000-0000-4000-8000-00000000000f', NULL,      'Fumaça',        'm', 'Cruzado', '2023-03-30', 330.00, '2026-06-12', NULL,       TRUE),
('50000000-0000-4000-8000-000000000010', 'BR-0016', 'Pérola',        'f', 'Senepol', '2022-04-17', 400.00, '2026-06-12', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000011', 'BR-0017', 'Coração',       'f', 'Nelore',  '2021-12-01', 420.00, '2026-05-22', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000012', 'BR-0018', 'Brilhante',     'm', 'Brahman', '2022-07-07', 525.00, '2026-05-22', 'comprado', TRUE),
('50000000-0000-4000-8000-000000000013', 'BR-0019', 'Indomável',     'm', 'Nelore',  '2023-05-11', 300.00, '2026-06-14', 'doacao',   TRUE),
('50000000-0000-4000-8000-000000000014', 'BR-0020', 'Florzinha',     'f', 'Gir',     '2022-02-28', 388.00, '2026-06-14', 'comprado', TRUE);

-- ============================================
-- TEMPORADA (4) — data_fim > data_inicio
-- ============================================
INSERT INTO temporada (id_temporada, nome, tipo, data_inicio, data_fim) VALUES
('60000000-0000-4000-8000-000000000001', 'Águas 2024/2025', 'aguas', '2024-10-01', '2025-03-31'),
('60000000-0000-4000-8000-000000000002', 'Seca 2025',       'seca',  '2025-04-01', '2025-09-30'),
('60000000-0000-4000-8000-000000000003', 'Águas 2025/2026', 'aguas', '2025-10-01', '2026-03-31'),
('60000000-0000-4000-8000-000000000004', 'Seca 2026',       'seca',  '2026-04-01', '2026-09-30');

-- ============================================
-- FORRAGEM (4) — uma forragem ativa por divisão
-- ============================================
INSERT INTO forragem (id_forragem, fk_id_divisao, tipo, data_plantio, ativa) VALUES
('70000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Capim Mombaça (Panicum maximum)',     '2024-11-15', TRUE),
('70000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'Brachiaria Brizantha (Marandu)',      '2024-12-01', TRUE),
('70000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', 'Capim Mombaça (Panicum maximum)',     '2025-01-20', TRUE),
('70000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', 'Brachiaria Humidícola',               '2025-02-10', TRUE);

-- ============================================
-- COCHO (5) — capacidade_kg > 0
-- ============================================
INSERT INTO cocho (id_cocho, fk_id_divisao, identificacao, tipo_material, capacidade_kg, ativo) VALUES
('80000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'COCHO-SEDE-01',   'concreto', 1500.00, TRUE),
('80000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'COCHO-BAIXAO-01', 'concreto', 2000.00, TRUE),
('80000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', 'COCHO-MATA-01',   'madeira',  800.00,  TRUE),
('80000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000005', 'COCHO-CURRAL-01', 'metal',    500.00,  TRUE),
('80000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000006', 'COCHO-RIACHO-01', 'plastico', 1200.00, TRUE);

-- ============================================
-- MEDICAMENTO (6) — nome_comercial único
-- ============================================
INSERT INTO medicamento (id_medicamento, nome_comercial, principio_ativo, tipo) VALUES
('90000000-0000-4000-8000-000000000001', 'Ivomec Gold',             'Ivermectina + Abamectina',     'antiparasitario'),
('90000000-0000-4000-8000-000000000002', 'Terramicina LA',          'Oxitetraciclina',              'antibiotico'),
('90000000-0000-4000-8000-000000000003', 'Vencobal',                'Cianocobalamina (B12)',        'vitamina'),
('90000000-0000-4000-8000-000000000004', 'Vacina Aftosa Marromvac', NULL,                           'vacina'),
('90000000-0000-4000-8000-000000000005', 'Sintoxan Polivalente',    'Clostridioses',                'vacina'),
('90000000-0000-4000-8000-000000000006', 'Colosso Pour-On',         'Cipermetrina + Fluazuron',     'antiparasitario');

-- ============================================
-- ALIMENTO (6) — nome único
-- ============================================
INSERT INTO alimento (id_alimento, nome, tipo) VALUES
('a0000000-0000-4000-8000-000000000001', 'Sal Mineral Boi Gordo 90', 'sal_mineral'),
('a0000000-0000-4000-8000-000000000002', 'Ração Engorda 18% PB',     'racao'),
('a0000000-0000-4000-8000-000000000003', 'Silagem de Milho',         'silagem'),
('a0000000-0000-4000-8000-000000000004', 'Farelo de Soja',           'farelo'),
('a0000000-0000-4000-8000-000000000005', 'Suplemento Proteico Seca', 'suplemento'),
('a0000000-0000-4000-8000-000000000006', 'Sal Mineral Cria',         'sal_mineral');

-- ============================================
-- ESTOQUE_MEDICAMENTO (5) — UNIQUE(propriedade, medicamento); quantidade >= 0
-- 'Terramicina LA' e 'Sintoxan' abaixo do mínimo (demonstram alerta "Baixo")
-- ============================================
INSERT INTO estoque_medicamento (id_estoque_med, fk_id_propriedade, fk_id_medicamento, quantidade, unidade, data_entrada, estoque_minimo) VALUES
('b0000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', 5000.00, 'ml',      '2026-05-10', 1000.00),
('b0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000002', 800.00,  'ml',      '2026-04-22', 1000.00),
('b0000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000003', 30.00,   'frascos', '2026-05-30', 10.00),
('b0000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000004', 150.00,  'doses',   '2026-06-01', 50.00),
('b0000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000005', 40.00,   'doses',   '2026-03-15', 50.00);

-- ============================================
-- LOTACAO (6) — UNIQUE(rebanho, divisao, data_entrada); numero_cabecas > 0
-- data_saida NULL = lotação ativa
-- ============================================
INSERT INTO lotacao (id_lotacao, fk_id_rebanho, fk_id_divisao, data_entrada, data_saida, numero_cabecas) VALUES
('c0000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2025-04-20', '2025-08-30', 45),
('c0000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', '2025-09-01', NULL,         42),
('c0000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '2025-08-15', NULL,         60),
('c0000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', '2025-11-25', NULL,         30),
('c0000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', '2026-02-10', NULL,         50),
('c0000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000003', '2025-05-01', '2025-08-10', 25);

-- ============================================
-- PERTENCIMENTO (20) — UNIQUE(bovino, rebanho, data_entrada); peso_entrada_kg > 0 ou NULL
-- ============================================
INSERT INTO pertencimento (id_pertencimento, fk_id_bovino, fk_id_rebanho, data_entrada, data_saida, peso_entrada_kg) VALUES
('d0000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 480.00),
('d0000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 390.00),
('d0000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 500.00),
('d0000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 420.00),
('d0000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 460.00),
('d0000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000001', '2025-04-20', NULL, 370.00),
('d0000000-0000-4000-8000-000000000007', '50000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 680.00),
('d0000000-0000-4000-8000-000000000008', '50000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 340.00),
('d0000000-0000-4000-8000-000000000009', '50000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 320.00),
('d0000000-0000-4000-8000-00000000000a', '50000000-0000-4000-8000-00000000000a', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 355.00),
('d0000000-0000-4000-8000-00000000000b', '50000000-0000-4000-8000-00000000000b', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 300.00),
('d0000000-0000-4000-8000-00000000000c', '50000000-0000-4000-8000-00000000000c', '40000000-0000-4000-8000-000000000002', '2025-08-15', NULL, 405.00),
('d0000000-0000-4000-8000-00000000000d', '50000000-0000-4000-8000-00000000000d', '40000000-0000-4000-8000-000000000003', '2025-11-25', NULL, 470.00),
('d0000000-0000-4000-8000-00000000000e', '50000000-0000-4000-8000-00000000000e', '40000000-0000-4000-8000-000000000003', '2025-11-25', NULL, 415.00),
('d0000000-0000-4000-8000-00000000000f', '50000000-0000-4000-8000-00000000000f', '40000000-0000-4000-8000-000000000003', '2025-11-25', NULL, 290.00),
('d0000000-0000-4000-8000-000000000010', '50000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000003', '2025-11-25', NULL, 360.00),
('d0000000-0000-4000-8000-000000000011', '50000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000004', '2026-02-10', NULL, 380.00),
('d0000000-0000-4000-8000-000000000012', '50000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000004', '2026-02-10', NULL, 485.00),
('d0000000-0000-4000-8000-000000000013', '50000000-0000-4000-8000-000000000013', '40000000-0000-4000-8000-000000000004', '2026-02-10', NULL, 270.00),
('d0000000-0000-4000-8000-000000000014', '50000000-0000-4000-8000-000000000014', '40000000-0000-4000-8000-000000000004', '2026-02-10', NULL, 350.00);

-- ============================================
-- PASSAGEM_TEMPORADA (6) — UNIQUE(rebanho, temporada); GMD = (final - inicial) / dias
-- Última linha com peso final/GMD NULL (temporada em andamento)
-- ============================================
INSERT INTO passagem_temporada (id_passagem, fk_id_rebanho, fk_id_temporada, peso_medio_inicial_kg, peso_medio_final_kg, gmd_medio_kg) VALUES
('e0000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 220.00, 280.00, 0.331),
('e0000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000002', 280.00, 310.00, 0.165),
('e0000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', 380.00, 430.00, 0.275),
('e0000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000003', 430.00, 510.00, 0.440),
('e0000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000003', 300.00, 370.00, 0.385),
('e0000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000004', '60000000-0000-4000-8000-000000000004', 350.00, NULL,   NULL);

-- ============================================
-- APLICACAO_MEDICAMENTO (10) — data_aplicacao não futura; dose > 0; unidade ml/g/doses
-- ============================================
INSERT INTO aplicacao_medicamento (id_aplicacao, fk_id_bovino, fk_id_medicamento, data_aplicacao, dose, unidade_dose) VALUES
('f0000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', '2026-05-20 08:30:00', 21.00, 'ml'),
('f0000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000001', '2026-05-20 08:45:00', 18.00, 'ml'),
('f0000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', '90000000-0000-4000-8000-000000000004', '2026-05-12 07:00:00', 5.00,  'ml'),
('f0000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000007', '90000000-0000-4000-8000-000000000002', '2026-06-10 16:20:00', 30.00, 'ml'),
('f0000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000004', '90000000-0000-4000-8000-000000000003', '2026-06-01 09:15:00', 10.00, 'ml'),
('f0000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000005', '90000000-0000-4000-8000-000000000006', '2026-05-15 15:00:00', 40.00, 'ml'),
('f0000000-0000-4000-8000-000000000007', '50000000-0000-4000-8000-00000000000d', '90000000-0000-4000-8000-000000000005', '2026-05-30 10:00:00', 5.00,  'ml'),
('f0000000-0000-4000-8000-000000000008', '50000000-0000-4000-8000-00000000000e', '90000000-0000-4000-8000-000000000004', '2026-05-12 07:30:00', 5.00,  'ml'),
('f0000000-0000-4000-8000-000000000009', '50000000-0000-4000-8000-000000000012', '90000000-0000-4000-8000-000000000001', '2026-05-22 11:00:00', 20.00, 'ml'),
('f0000000-0000-4000-8000-00000000000a', '50000000-0000-4000-8000-000000000009', '90000000-0000-4000-8000-000000000002', '2026-06-05 14:30:00', 12.00, 'ml');

-- ============================================
-- ABASTECIMENTO_COCHO (8) — qtd_inicial > 0; qtd_restante >= 0; esgotado bool
-- ============================================
INSERT INTO abastecimento_cocho (id_abastecimento, fk_id_cocho, fk_id_alimento, data_abastecimento, quantidade_inicial_kg, quantidade_restante_kg, esgotado) VALUES
('ab000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '2026-06-10 06:00:00', 50.00,  35.00,  FALSE),
('ab000000-0000-4000-8000-000000000002', '80000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', '2026-06-12 06:30:00', 300.00, 120.00, FALSE),
('ab000000-0000-4000-8000-000000000003', '80000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', '2026-06-08 07:00:00', 40.00,  0.00,   TRUE),
('ab000000-0000-4000-8000-000000000004', '80000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000003', '2026-06-14 17:00:00', 200.00, 150.00, FALSE),
('ab000000-0000-4000-8000-000000000005', '80000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000005', '2026-06-13 06:15:00', 80.00,  25.00,  FALSE),
('ab000000-0000-4000-8000-000000000006', '80000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004', '2026-06-05 06:45:00', 150.00, 0.00,   TRUE),
('ab000000-0000-4000-8000-000000000007', '80000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000006', '2026-06-15 06:00:00', 30.00,  28.00,  FALSE),
('ab000000-0000-4000-8000-000000000008', '80000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002', '2026-06-11 16:30:00', 250.00, 90.00,  FALSE);

-- Reativa o modo de atualização segura
SET SQL_SAFE_UPDATES = 1;
```

</details>

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
