# Missão Imunidade — Guia de continuidade

## Propósito

**Missão Imunidade** é um jogo educativo em português para estudantes de medicina. O jogador conduz uma equipe multidisciplinar durante surtos de doenças infecciosas: observa evidências, investiga, formula hipóteses, administra o tempo, identifica o agente e aplica medidas de contenção.

O jogo deve ensinar raciocínio clínico, microbiologia, epidemiologia e saúde pública por meio de decisões, não como um questionário de múltipla escolha.

## Escopo entregue

A primeira versão implementa a **Missão 01**, um cenário fictício de cólera no Sudeste Asiático.

- Há quatro especialistas: cientista, médico, especialista de campo e comunicação;
- O jogador possui três ações por dia;
- As ações revelam pistas clínica, epidemiológica, laboratorial e preventiva;
- O surto cresce ao encerrar o dia e cresce menos após ação preventiva;
- É possível propor diagnóstico antes de obter todas as pistas; um erro consome um dia;
- O diagnóstico correto libera a etapa de contenção;
- A missão tem medidas de água segura, atendimento, comunicação e vigilância;
- A vitória exige ao menos três medidas, incluindo água segura e organização do atendimento;
- Há telas de vitória, derrota, reinício e score.

O conteúdo de cólera usa como referência a ficha da Organização Mundial da Saúde: transmissão por água/alimentos contaminados, diarreia aquosa aguda, risco de desidratação, acesso rápido ao tratamento e medidas WASH (água, saneamento e higiene). Antes de incluir ou revisar conteúdo médico, use fontes oficiais/primárias e trate o jogo como educacional, não como orientação clínica individual.

## Tecnologia e estrutura

- Frontend: React 18, Vite 5 e TypeScript;
- Estilos: CSS próprio em `src/styles.css`;
- Lógica e dados atuais: `src/main.tsx`;
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

Quando adicionar backend, prefira uma API TypeScript separada e variáveis de ambiente para a conexão PostgreSQL. Nunca versione `.env`, tokens, chaves privadas, IPs de administração, credenciais de banco ou configurações de firewall.

O painel de infraestrutura deve ter acesso restrito por identidade ou por IP específico. Não amplie permissões para blocos inteiros de operadoras: IPs residenciais são dinâmicos e faixas amplas expõem o painel a terceiros. Para acesso administrativo recorrente, prefira túnel SSH, VPN privada (por exemplo, Tailscale) ou IP fixo.

## Direção visual

- Interface de central de comando médica: azul-marinho, ciano/verde-água, alertas âmbar/vermelho;
- O globo 3D é uma imagem gerada para o projeto e substitui o antigo mapa SVG abstrato;
- A imagem está centrada no Sul/Sudeste Asiático e deve manter destaque visual para o foco do surto;
- Preserve contraste, navegação por teclado e responsividade para celular;
- Não inserir texto dentro de imagens geradas; rótulos devem permanecer em HTML/CSS.

## Próximas implementações

1. Separar missões, diagnósticos, pistas, medidas e fórmulas de pontuação em arquivos de dados versionados;
2. Criar etapa de seleção de missão e campanha com cinco fases;
3. Adicionar outras doenças e diferenciais diagnósticos (vírus, bactérias, fungos e cenários complexos);
4. Criar API TypeScript e PostgreSQL para usuários, partidas, decisões e progresso;
5. Adicionar autenticação, placar e retomada de partidas;
6. Revisar conteúdo por docentes/área médica antes de disponibilizar a estudantes.

## Regras para contribuições

- Todo texto da interface deve estar em português do Brasil;
- Mantenha mecânicas explicáveis e dados médicos revisáveis, evitando regras escondidas;
- Não remova alterações existentes sem solicitação explícita;
- Prefira mudanças pequenas, testáveis e acessíveis;
- Ao alterar uma mecânica, atualize o `README.md` e este documento quando o contexto de continuidade mudar;
- Não trate uma vitória no jogo como recomendação médica real;
- Antes de commit, execute `npm run build`.
