# Missão Imunidade — Guia de continuidade

## Propósito

**Missão Imunidade** é um jogo educativo em português para estudantes de medicina. O jogador conduz uma equipe multidisciplinar durante surtos de doenças infecciosas: observa evidências, investiga, formula hipóteses, administra o tempo, identifica o agente e aplica medidas de contenção.

O jogo deve ensinar raciocínio clínico, microbiologia, epidemiologia e saúde pública por meio de decisões, não como um questionário de múltipla escolha.

## Escopo entregue

A primeira versão navegável implementa cinco dossiês clínico-epidemiológicos fictícios. Os diagnósticos reais são cólera, dengue, sarampo, tuberculose pulmonar e *Candida auris*, mas isso é informação de autoria: não exiba o agente em cards, títulos de missão, briefing ou antes de uma defesa diagnóstica correta.

- Há quatro médicos: emergência, infectologia, epidemiologia médica e patologia clínica;
- O jogador possui três ações por dia; cada médico entrega duas camadas de evidência, totalizando oito por caso;
- As ações revelam evidências clínica, de exposição, de vigilância e laboratoriais, em progressão;
- O surto cresce ao encerrar o dia e cresce menos após ação preventiva;
- É possível propor diagnóstico antes de obter todas as pistas; um erro consome um dia;
- O diagnóstico correto libera a etapa de contenção;
- A missão tem medidas de água segura, atendimento, comunicação e vigilância;
- Cada fase possui quatro medidas contextualizadas; a vitória exige ao menos três, incluindo duas medidas essenciais;
- Há telas de vitória, derrota, reinício, score, debriefing, aprendizados e referência oficial;
- O mapa de missões libera a fase seguinte após a conclusão da anterior; há um modo de teste para explorar todas as fases;
- O progresso é somente local em memória e é perdido ao recarregar a página.

Antes da campanha, o aluno informa nome, semestre e eixo de estudo. Esses dados ficam em `localStorage` apenas no navegador e personalizam a saudação e o foco exibido; não são enviados a servidor. Não transforme esta etapa em cadastro, autenticação ou coleta de dados sensíveis sem uma decisão explícita de produto e privacidade.

O tutorial é apresentado no primeiro acesso e pode ser reaberto pelo botão **Como jogar**. Ele explica o fluxo dossiê → equipe médica → defesa da hipótese; preserve esse suporte enquanto o jogo tiver mecânicas por descoberta. A tela de campanha tem mapa-múndi com marcadores em `mapPosition` de cada missão: hover, foco por teclado e toque no card devem atualizar local e marcador. O asset é `src/assets/mapa-mundi-interativo-3d.png`.

Os cenários usam sínteses de fontes oficiais: OMS para cólera, dengue, sarampo e tuberculose; CDC para *Candida auris*. Antes de incluir ou revisar conteúdo médico, use fontes oficiais/primárias, mantenha o link da fonte em cada missão e trate o jogo como educacional, não como orientação clínica individual.

## Tecnologia e estrutura

- Frontend: React 18, Vite 5 e TypeScript;
- Estilos: CSS próprio em `src/styles.css`;
- Interface e lógica de campanha: `src/main.tsx`;
- Dados clínico-pedagógicos das missões: `src/data/missions.ts`;
- Asset principal: `src/assets/globo-sudeste-asiatico-3d.png`;
- Produção: Docker multiestágio com Nginx (`Dockerfile` e `nginx.conf`).

O projeto é propositalmente uma SPA sem backend, autenticação ou persistência nesta fase. Isso reduz a complexidade inicial para que estudantes possam evoluir o jogo gradualmente.

## Desenvolvimento local

```bash
npm install
npm run dev
npm run build
```

O build precisa passar antes de entregar alterações. Não use dependências desnecessárias para ícones, mapas ou estado simples.

## Deploy no Coolify

O Coolify deve construir o `Dockerfile` e expor a porta `80`. Não existem variáveis de ambiente para a versão atual. A aplicação é estática; PostgreSQL não é utilizado ainda.

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

1. Criar eventos variáveis, justificativas para intervenções não essenciais e maior diversidade de diferenciais diagnósticos;
2. Criar um banco de questões revisado por docentes, com referências por afirmação e dificuldade calibrada por semestre;
3. Criar API TypeScript e PostgreSQL para usuários, partidas, decisões e progresso, após definir privacidade e consentimento;
4. Adicionar autenticação, placar e retomada de partidas;
5. Revisar conteúdo por docentes/área médica antes de disponibilizar a estudantes.

## Regras para contribuições

- Todo texto da interface deve estar em português do Brasil;
- Mantenha mecânicas explicáveis e dados médicos revisáveis, evitando regras escondidas;
- Preserve o diagnóstico como segredo didático: o aluno deve inferi-lo a partir de dados, não lê-lo na navegação;
- Não cite o diagnóstico correto na pergunta de justificativa da hipótese; use formulações neutras como “qual dado tem maior peso entre os diferenciais?”;
- Diferenciais e perguntas de justificativa devem avaliar padrão clínico, cronologia, exposição e limitações dos exames, e não memorização de uma palavra-chave;
- Trate o celular como tela prioritária: uma ação não pode depender apenas de hover, botões precisam ter área de toque confortável e modais devem poder rolar sem ficar inacessíveis.
- Não remova alterações existentes sem solicitação explícita;
- Prefira mudanças pequenas, testáveis e acessíveis;
- Ao alterar uma mecânica, atualize o `README.md` e este documento quando o contexto de continuidade mudar;
- Não trate uma vitória no jogo como recomendação médica real;
- Antes de commit, execute `npm run build`.
