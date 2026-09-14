# PostgreSQL em produção

A aplicação funciona sem banco, com progresso local. Para persistir XP, moedas, dossiês concluídos, missão diária e sequência entre navegadores, configure uma instância PostgreSQL de produção e a variável `DATABASE_URL` na aplicação do Coolify.

## Configuração no Coolify

1. Crie ou conecte um serviço PostgreSQL isolado para o ambiente de produção.
2. Na aplicação **Missão Imunidade**, defina `DATABASE_URL` com a URL de conexão entregue pelo serviço.
3. Defina `PGSSLMODE=require` apenas se o provedor exigir SSL. Para uma conexão interna do Coolify, deixe essa variável ausente.
4. Faça o deploy. A API cria e atualiza a tabela `game_profiles` automaticamente, sem migrar dados de estudantes ou criar contas.

Não coloque URL de banco, senhas ou valores de variáveis em arquivos versionados, no README público ou em logs.

## Verificação após o deploy

Com `DATABASE_URL` presente no ambiente de produção:

```bash
npm run verify:postgres
```

O comando só confirma a conexão e as colunas esperadas; ele não altera perfis. A rota `GET /api/health` deve responder `{"ok":true,"persistence":"postgres"}`.

Na inicialização, a aplicação também cria as colunas de recordes `best_score`, `plays` e `display_name` quando ainda não existirem. O painel mostra o nome de exibição informado no perfil, com aviso visível antes do início do jogo.

## Dados armazenados

`game_profiles` contém um identificador aleatório criado pelo navegador, nome de exibição, XP, moedas, ids de dossiês concluídos e estado da missão diária. Semestre, foco de estudo e opinião de teste não são enviados à API.

## Identidade de jogador e acompanhamento

A identidade v2 substitui os identificadores antigos. No primeiro acesso após a atualização, o navegador solicita um novo perfil e gera um código no formato `MISSAO-XXXX-XXXX-XXXX`. O estudante guarda esse código e pode informá-lo em outro navegador para reunir XP, melhor pontuação, partidas e dossiês concluídos na mesma identidade.

A primeira inicialização desta versão remove os Recordes anteriores uma única vez, por decisão de produto, e registra a migração em `game_schema_migrations`. A aplicação passa a registrar também data de criação, última partida e último dossiê. A rota de Recordes entrega uma lista de até 30 participantes para o painel expansível.
