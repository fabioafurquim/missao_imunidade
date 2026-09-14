# Missão Imunidade — Guia de continuidade

## Propósito

**Missão Imunidade** é um jogo educativo em português para estudantes de medicina. O jogador conduz uma equipe multidisciplinar durante surtos de doenças infecciosas: observa evidências, investiga, formula hipóteses, administra o tempo, identifica o agente e aplica medidas de contenção.

O jogo deve ensinar raciocínio clínico, microbiologia, epidemiologia e saúde pública por meio de decisões, não como um questionário de múltipla escolha.

## Escopo entregue

A primeira versão navegável implementa cinco dossiês clínico-epidemiológicos fictícios. Os diagnósticos reais são cólera, dengue, sarampo, tuberculose pulmonar e *Candida auris*, mas isso é informação de autoria: não exiba o agente em cards, títulos de missão, briefing ou antes de uma defesa diagnóstica correta.

- Há quatro médicos: emergência, infectologia, epidemiologia médica e patologia clínica;
- Cada ciclo possui três decisões; cada médico entrega duas camadas de evidência, totalizando oito por caso;
- Cada decisão abre o achado em destaque antes de adicioná-lo ao Quadro do caso, que organiza clínica, exposição, vigilância e laboratório;
- Todos os dossiês usam o fluxo visual de episódio: chamado, cena de campo, primeira ordem, mapa explorável, mesa de evidências, defesa e resposta. Cada caso possui uma arte própria em `src/assets/*-mapa-exploracao.png` e marcadores HTML acessíveis; os textos e locais de exploração ficam na configuração `episodeScenes` em `src/main.tsx`.
- Distrito Alvorada possui variações persistidas por partida em `districtVariants`, dentro de `src/data/missions.ts`. A variação é escolhida ao iniciar o dossiê e altera evidências, hipótese, medidas e fonte; não sorteie uma nova variação durante uma partida em andamento.
- A referência recebida da equipe está em `docs/referencias/doencas-jogo.xlsx`. Ela orienta a expansão. Vale Safira (malária), Instituto Ponte (meningite meningocócica) e Ilha Aurora (hepatite A) foram incorporados a partir dela e de fontes OMS; cada caso exige revisão docente antes de publicação.
- O botão **Recordes** usa `GET /api/records` e mostra o nome de exibição informado no perfil, além de totais de participantes e rankings de pontuação, XP e partidas. O PostgreSQL registra `best_score`, `plays` e `display_name`. O formulário deixa explícito que o nome aparecerá no ranking; não envie semestre, foco, e-mail, senha ou opinião de teste.
- A identidade v2 usa um código recuperável `MISSAO-XXXX-XXXX-XXXX`; o mesmo código consolida partidas em qualquer navegador. A migração `identity-v2-reset` limpa Recordes legados uma única vez e nunca deve ser reaplicada manualmente. O painel expansível mostra até 30 participantes, com primeira e última atividade.
- Desafios cronometrados só podem ocorrer em decisões específicas, com propósito didático, impacto e recompensa explicados antes de iniciarem. Não aplique penalidades de tempo escondidas ou uma contagem contínua durante a investigação;
- A partida ativa é salva localmente e deve restaurar ciclo, recursos, decisões, achados, exame pendente e fase após recarregar. O debriefing é o encerramento visual do caso: não mantenha no fundo textos que orientem investigação ou defesa diagnóstica;
- O debriefing registra competências de raciocínio/diagnóstico, investigação, conduta/tratamento, controle/prevenção e tempo de resposta com base nas decisões da partida;
- A campanha oferece uma missão diária rotativa, identificada pela data de São Paulo, que concede bônus uma vez ao dia e mantém uma sequência de acessos; ela deve reutilizar dossiês revisados e não expor o diagnóstico antes da defesa;
- Ao usar as três decisões, o ciclo é fechado de forma explícita e o cenário evolui; avançar antes disso informa as decisões descartadas e a projeção de casos;
- Cada missão possui eventos operacionais alternados no fechamento de ciclo; o impacto de pressão deve ser exibido antes de ser aplicado, sem regras ocultas;
- É possível propor diagnóstico após três evidências; uma defesa insuficiente avança um ciclo e explica a lacuna de raciocínio;
- O diagnóstico correto libera a etapa de contenção;
- A missão tem medidas de água segura, atendimento, comunicação e vigilância;
- Cada fase possui quatro medidas contextualizadas; a vitória exige ao menos três, incluindo duas medidas essenciais;
- Há telas de vitória, derrota, reinício, score, debriefing, aprendizados e referência oficial;
- O mapa de missões libera a fase seguinte após a conclusão da anterior; há um modo de teste para explorar todas as fases;
- O progresso é somente local em memória e é perdido ao recarregar a página.

Antes da campanha, o aluno informa nome, semestre e eixo de estudo. O nome é o nome de exibição do ranking e é enviado ao PostgreSQL somente com o aviso visível no formulário; semestre e eixo ficam em `localStorage` e personalizam a saudação e o foco exibido. Não transforme esta etapa em cadastro, autenticação ou coleta de dados sensíveis sem uma decisão explícita de produto e privacidade.

O tutorial é apresentado no primeiro acesso e pode ser reaberto pelo botão **Como jogar**, inclusive durante uma missão. Ele explica o fluxo completo: dossiê → três decisões por ciclo → achado no Quadro do caso → evento com escolha visível → defesa da hipótese → contenção → opinião de teste. Nina, a assistente da central (`src/assets/nina-assistente.png`), aponta a próxima ação em um balão flutuante e muda de posição conforme a etapa. Fora o próprio botão de fechar, ela nunca pode capturar cliques ou toques; ao indicar a equipe, os cards de personagens precisam ficar visualmente destacados e clicáveis. Mantenha os textos curtos e o direcionamento visual coerente com a etapa. Preserve esse suporte enquanto o jogo tiver mecânicas por descoberta. Em celular, Nina deve ser compacta, fechável e ocupar espaço no fluxo ou uma zona segura: ela nunca pode encobrir o botão que o aluno deve acionar. Em celular, o mapa não deve competir com o fluxo de decisão: a leitura do achado e o Quadro do caso têm prioridade. Todo modal, sobretudo o debriefing, deve ter rolagem utilizável em telas baixas. A tela de campanha tem mapa-múndi com marcadores em `mapPosition` de cada missão: hover, foco por teclado e toque no card devem atualizar local e marcador. O asset é `src/assets/mapa-mundi-interativo-3d.png`.

Os cenários usam sínteses de fontes oficiais: OMS para cólera, dengue, sarampo e tuberculose; CDC para *Candida auris*. Antes de incluir ou revisar conteúdo médico, use fontes oficiais/primárias, mantenha o link da fonte em cada missão e trate o jogo como educacional, não como orientação clínica individual.

## Tecnologia e estrutura

- Frontend: React 18, Vite 5 e TypeScript;
- Estilos: CSS próprio em `src/styles.css`;
- Interface e lógica de campanha: `src/main.tsx`;
- Dados clínico-pedagógicos das missões: `src/data/missions.ts`;
- Asset principal: `src/assets/globo-sudeste-asiatico-3d.png`;
- Produção: Docker multiestágio com servidor Node na porta 80; a SPA e a API de progresso são entregues pelo mesmo processo.

O projeto não possui autenticação ou cadastro. Cada navegador cria um identificador técnico para persistir XP, moedas, dossiês concluídos, nome de exibição e o resgate da missão diária em `localStorage` e, se `DATABASE_URL` estiver configurada, no PostgreSQL. A retomada da partida fica no navegador nesta fase. O formulário de opinião de teste continua local e pode ser copiado pelo próprio estudante; não é enviado a servidor.

## Desenvolvimento local

```bash
npm install
npm run dev
npm run build
```

O build precisa passar antes de entregar alterações. Não use dependências desnecessárias para ícones, mapas ou estado simples.

## Publicação

Nunca faça deploy em produção sem avisar o usuário e receber uma confirmação explícita para essa publicação. O usuário é responsável pelo `push` no Git e pelo deploy no Coolify. Antes de qualquer publicação, as alterações devem ser testadas no ambiente de desenvolvimento local e apresentadas para revisão.

## Deploy no Coolify

O Coolify deve construir o `Dockerfile` e expor a porta `80`. A variável opcional `DATABASE_URL` ativa a persistência de progresso anônimo; `PGSSLMODE=require` ativa SSL para conexões externas. Sem essas variáveis, a aplicação funciona em modo local. Não versione credenciais.

### Domínio personalizado

O domínio público da aplicação é `https://missaoimunidade.furquim.cloud`. Nesta instância do Coolify, um comportamento legado pode recriar o `docker-compose.yaml` com um domínio automático `sslip.io` após um deploy. A VPS possui o script operacional `/root/fix-domain-missaoimunidade.sh`, que corrige o host nas labels do proxy, garante a rota HTTPS/Let's Encrypt e recria somente o container desta aplicação. Execute-o após um redeploy apenas se o domínio personalizado for substituído novamente.

O registro de domínio persistido no Coolify também foi corrigido. Não registre endereços IP, chaves ou regras específicas de firewall neste repositório.

A referência versionada do procedimento está em `scripts/fix-coolify-domain.sh`. Ela deve ser mantida consistente com a cópia executável da VPS e pode receber `APP_UUID` e `DOMAIN` por variáveis de ambiente caso seja reutilizada para outra aplicação.

Quando adicionar backend, prefira uma API TypeScript separada e variáveis de ambiente para a conexão PostgreSQL. Nunca versione `.env`, tokens, chaves privadas, IPs de administração, credenciais de banco ou configurações de firewall.

O painel de infraestrutura deve ter acesso restrito por identidade ou por IP específico. Não amplie permissões para blocos inteiros de operadoras: IPs residenciais são dinâmicos e faixas amplas expõem o painel a terceiros. Para acesso administrativo recorrente, prefira túnel SSH, VPN privada (por exemplo, Tailscale) ou IP fixo.

## Direção visual

- Interface de central de comando médica: azul-marinho, ciano/verde-água, alertas âmbar/vermelho;
- O globo 3D é uma imagem gerada para o projeto e substitui o antigo mapa SVG abstrato;
- A imagem está centrada no Sul/Sudeste Asiático e deve manter destaque visual para o foco do surto;
- Preserve contraste, navegação por teclado e responsividade para celular;
- Não inserir texto dentro de imagens geradas; rótulos devem permanecer em HTML/CSS.

## Próximas implementações

1. Conduzir teste de usabilidade com estudantes e consolidar as opiniões locais exportadas;
2. Criar mais eventos com escolhas de resposta, justificativas para intervenções não essenciais e maior diversidade de diferenciais diagnósticos;
3. Criar um banco de questões revisado por docentes, com referências por afirmação e dificuldade calibrada por semestre;
3. Criar API TypeScript e PostgreSQL para usuários, partidas, decisões e progresso, após definir privacidade e consentimento;
4. Adicionar autenticação, placar e retomada de partidas;
5. Revisar conteúdo por docentes/área médica antes de disponibilizar a estudantes.

## Regras para contribuições

- Todo texto da interface deve estar em português do Brasil;
- Mantenha mecânicas explicáveis e dados médicos revisáveis, evitando regras escondidas;
- Preserve o diagnóstico como segredo didático: o aluno deve inferi-lo a partir de dados, não lê-lo na navegação;
- Não cite o diagnóstico correto na pergunta de justificativa da hipótese; use formulações neutras como “qual dado tem maior peso entre os diferenciais?”;
- Não revele o agente em texto de evidência laboratorial antes de uma defesa diagnóstica correta; descreva a implicação diagnóstica sem nomear o agente;
- Diferenciais e perguntas de justificativa devem avaliar padrão clínico, cronologia, exposição e limitações dos exames, e não memorização de uma palavra-chave;
- Trate o celular como tela prioritária: uma ação não pode depender apenas de hover, botões precisam ter área de toque confortável e modais devem poder rolar sem ficar inacessíveis.
- Não remova alterações existentes sem solicitação explícita;
- Prefira mudanças pequenas, testáveis e acessíveis;
- Ao alterar uma mecânica, atualize o `README.md` e este documento quando o contexto de continuidade mudar;
- Não trate uma vitória no jogo como recomendação médica real;
- Antes de commit, execute `npm run build`.
