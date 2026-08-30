# Missão Imunidade

Protótipo inicial de um jogo educativo sobre investigação e controle de surtos infecciosos. Esta versão implementa apenas a **Missão 01**, com um surto de cólera fictício no Sudeste Asiático.

## O que já funciona

- Painel de situação com globo 3D do Sudeste Asiático e número de casos;
- Equipe de quatro especialistas, com três ações por dia;
- Pistas clínica, epidemiológica, laboratorial e de prevenção;
- Encerramento do dia e evolução diferente conforme a ação preventiva;
- Hipótese diagnóstica, incluindo penalidade ao errar;
- Diagnóstico, medidas específicas de contenção, vitória, derrota e score final.

As informações clínicas usadas na missão (diarreia aquosa aguda, desidratação, transmissão por água/alimentos contaminados e prevenção por água, saneamento e higiene) foram sintetizadas a partir da [ficha de cólera da OMS](https://www.who.int/en/news-room/fact-sheets/detail/cholera).

## Rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`). Para criar a versão de produção:

```bash
npm run build
```

## Publicar no Coolify

O projeto possui um `Dockerfile` multiestágio. No Coolify:

1. Crie uma nova aplicação a partir do repositório Git.
2. Selecione **Dockerfile** como método de build.
3. Use a porta exposta `80`.
4. Vincule o domínio e faça o deploy.

Não há variáveis de ambiente nesta primeira versão e não é necessário conectar o PostgreSQL ainda.

## Decisão técnica

Foi escolhido **React + Vite + TypeScript**, servido por Nginx em produção. É uma estrutura pequena, amplamente conhecida e fácil de continuar. O jogo está separado de infraestrutura persistente de propósito: a próxima etapa pode adicionar uma API em Node.js/TypeScript e PostgreSQL sem mudar a interface.

## Próxima etapa sugerida

1. Extrair missões, ações e pistas para arquivos de dados versionados;
2. Criar API (por exemplo, Fastify) e tabelas PostgreSQL para usuários, partidas e decisões;
3. Conectar autenticação simples e salvamento de progresso;
4. Implementar a etapa de contenção, derrota, mais doenças e fases.
