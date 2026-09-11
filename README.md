# Missão Imunidade

Jogo educativo, em português do Brasil, sobre investigação e controle de surtos infecciosos. A campanha atual propõe decisões de raciocínio clínico, microbiologia, epidemiologia e saúde pública — não substitui protocolos ou orientação médica individual.

## O que já funciona

- Tela inicial com nome, semestre e eixo de estudo do aluno; os dados ficam apenas no navegador;
- Tutorial automático no primeiro acesso e botão **Como jogar** também durante a missão; o guia detalha os oito passos, do dossiê ao feedback final;
- Mapa de dossiês com agentes ocultos, desbloqueio progressivo e modo de teste para explorar todas as fases;
- Mapa-múndi interativo: hover, foco por teclado ou toque em um dossiê atualiza o marcador e a localização exibida;
- Ciclos claros de três decisões: a conclusão do ciclo mostra a evolução do cenário e avançar antes do fim explicita o custo;
- Eventos operacionais específicos de cada cenário no fechamento do ciclo, com impacto de pressão sempre visível antes de ser aplicado;
- Cada evento oferece duas escolhas operacionais, com efeito percentual e justificativa didática visíveis antes da confirmação;
- O Porto de Mahan é o piloto da nova central de comando: inclui painel de atendimento, recursos, exame com resultado no ciclo seguinte, cuidado precoce e debriefing por competências;
- O debriefing mostra o desempenho em raciocínio/diagnóstico, investigação, conduta, controle/prevenção e tempo de resposta, usando as decisões registradas na partida;
- Achado em destaque após cada decisão e Quadro do caso que agrupa o progresso das quatro lentes de investigação;
- Equipe de quatro médicos (emergência, infectologia, epidemiologia médica e patologia clínica), cada um com duas camadas graduais de investigação;
- Dossiê inicial, oito evidências por caso, diferenciais coerentes, justificativa obrigatória da hipótese e consequência para defesas insuficientes;
- Medidas de resposta específicas, perguntas de discussão por cenário, debriefing, pontuação, aprendizados e links para fontes oficiais.
- Formulário de opinião no debriefing para testes: guarda a avaliação localmente e copia um resumo para o estudante encaminhar à equipe, sem envio de dados ou conta.
- Perfil de jogador anônimo: cada navegador recebe XP, nível, moedas e desbloqueios; a primeira conclusão de cada dossiê concede recompensa.
- Nina, a assistente visual da central, aponta a próxima ação com balões, animação e destaque; o jogador pode tocar no balão para ir até ela.
- Missão diária rotativa: um alerta reutiliza um dossiê com contexto e objetivo próprios; a primeira conclusão do dia concede +80 XP, +15 moedas e alimenta a sequência de acessos.
- Todos os dossiês incluem uma cena operacional, uma prioridade visível antes do diagnóstico, recursos limitados e exame de laboratório que consome dois recursos e chega no ciclo seguinte.
- Quando Nina indica as missões da equipe, os quatro cards clicáveis pulsam com uma seta visual até o jogador tomar a primeira decisão.
- Partidas em andamento são retomadas no mesmo navegador após recarregar a página; o dossiê concluído abre o debriefing e não mantém instruções de investigação ao fundo.

| Dossiê | Cenário | Foco didático |
| --- | --- | --- |
| 01 · Porto de Mahan | Síndrome diarreica aguda em agrupamento | Água segura, atendimento e vigilância |
| 02 · Distrito Alvorada | Síndrome febril aguda urbana | Vetores, criadouros e triagem |
| 03 · Campus Norte | Exantema febril em rede de contatos | Vacinação, contatos e comunicação |
| 04 · Pavilhão 7 | Síndrome respiratória subaguda | Testagem, ventilação e contatos |
| 05 · UTI Aurora | Culturas incomuns em unidade crítica | Triagem, precauções e desinfecção |

O conteúdo é uma síntese educacional baseada em fichas da [OMS sobre cólera](https://www.who.int/en/news-room/fact-sheets/detail/cholera), [dengue](https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue), [sarampo](https://www.who.int/news-room/fact-sheets/detail/measles) e [tuberculose](https://www.who.int/news-room/fact-sheets/detail/tuberculosis), e no material do [CDC sobre *Candida auris*](https://www.cdc.gov/candida-auris/about/index.html). Cada debriefing aponta novamente para sua fonte.

## Rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`). Para gerar a versão de produção:

```bash
npm run build
```

## Onde editar as missões

As fases e o conteúdo revisável estão concentrados em `src/data/missions.ts`. Cada caso define briefing, coordenadas do marcador no mapa, dados iniciais, duas evidências por médico, diferenciais, pergunta de justificativa, intervenções, critérios mínimos de vitória, aprendizados e fonte oficial. O diagnóstico verdadeiro não deve aparecer em títulos, cards de campanha, briefings ou enunciados da justificativa; a interface só o revela após uma defesa correta ou no debriefing.

A interface e a lógica da campanha ficam em `src/main.tsx`. O perfil inicial usa `localStorage` somente para manter nome, semestre e foco de estudo no navegador do aluno; não há login, cadastro ou coleta de dados pessoais pela API de progresso.

A interface é mobile-first: no celular, o estado do ciclo fica fixo no topo, o mapa não compete com a investigação e cada achado abre como painel de leitura antes de o jogador continuar. O Quadro do caso aparece logo após as escolhas da equipe, com botões de toque ampliados. Todos os modais, inclusive o debriefing, possuem rolagem segura em telas baixas.

Recursos, resultados pendentes, score, decisões e desempenho por competências da partida em andamento ficam em `localStorage` para permitir retomada no mesmo navegador. XP, moedas, missões concluídas e o resgate da missão diária ficam em `localStorage` e, quando `DATABASE_URL` estiver configurada, também são enviados para PostgreSQL pela API própria. O identificador é anônimo e gerado no navegador; não há login, senha nem cadastro. As opiniões de teste continuam somente em `localStorage`.

## Publicar no Coolify

O projeto possui um `Dockerfile` multiestágio. Em produção, um servidor Node entrega a SPA e a API de progresso na mesma porta. No Coolify:

1. Crie uma nova aplicação a partir do repositório Git.
2. Selecione **Dockerfile** como método de build.
3. Use a porta exposta `80`.
4. Vincule o domínio e faça o deploy.

Para ativar persistência entre dispositivos, configure `DATABASE_URL` com a conexão PostgreSQL no Coolify. A aplicação cria a tabela `game_profiles` na primeira conexão. Sem essa variável, continua funcionando com o progresso local do navegador.

O procedimento seguro para configurar e verificar o PostgreSQL está em [docs/postgres-producao.md](docs/postgres-producao.md). Nenhuma credencial deve entrar no repositório.

### Domínio personalizado no Coolify

O domínio de produção é `https://missaoimunidade.furquim.cloud`. Se, depois de um deploy, o Coolify substituir esse domínio pelo endereço automático `sslip.io`, conecte-se à VPS como root e execute:

```bash
/root/fix-domain-missaoimunidade.sh
```

O script atualiza o `docker-compose.yaml` gerado pelo Coolify, recria somente o container desta aplicação e garante as rotas HTTPS. A cópia versionada em `scripts/fix-coolify-domain.sh` serve como referência e recuperação do script operacional.

## Decisão técnica

Foi escolhido **React + Vite + TypeScript**, servido por Nginx em produção. É uma estrutura pequena, amplamente conhecida e fácil de continuar pelos estudantes. Quando houver necessidade de progresso entre sessões, a evolução natural é uma API TypeScript e PostgreSQL, sem precisar reescrever a interface.

## Próxima etapa sugerida

1. Conduzir teste de usabilidade com estudantes usando o formulário local e consolidar os resumos copiados;
2. Criar mais eventos por missão, com escolhas de resposta e consequências justificadas, e ampliar a diversidade de diferenciais;
3. Criar banco de questões revisado por docentes, com referências por afirmação e dificuldade calibrada por semestre;
4. Persistir usuários, partidas, decisões e progresso com API TypeScript e PostgreSQL, após definir consentimento e privacidade;
5. Adicionar autenticação, placar e retomada de partidas.
