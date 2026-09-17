# Atualização para a equipe — Base de Operações e evolução do jogo

Nesta etapa, a Missão Imunidade avançou de uma tela de seleção de casos para uma **Base de Operações visual**, mais próxima da linguagem de um jogo de investigação. O objetivo foi fazer o estudante perceber o surto, escolher para onde a equipe irá e acompanhar o efeito das decisões com menos leitura inicial e mais sinais visuais.

## O que foi implementado

- A tela inicial agora usa um mapa de operações próprio, com aparência de central de resposta a surtos.
- Cada missão aparece como um foco no mapa. Os focos em alerta pulsam; os territórios concluídos recebem um estado visual de controle.
- O mapa ganhou grade de monitoramento, varredura de radar, anéis de alerta e transições visuais que ajudam a indicar que a central está ativa.
- A missão diária passou a ser apresentada como um sinal especial de operação, com acesso direto pelo mapa.
- Ao tocar ou clicar em um foco, a missão é mostrada em uma ficha resumida, com informações essenciais e um botão claro para iniciar.
- No celular, o mapa continua visual, mas a ficha da missão aparece em uma área confortável abaixo dele, evitando alvos pequenos ou controles sobrepostos.
- As animações podem ser reduzidas automaticamente para pessoas que preferem menos movimento no dispositivo.

Além da Base de Operações, foram consolidados avanços na estrutura das missões:

- Alguns casos agora podem começar com uma breve história do paciente, para criar contexto humano antes da investigação.
- A etapa de resposta passou a aceitar uma medida de risco contextualizada. Ela não bloqueia a partida, mas gera uma consequência visível e reduz a recompensa de domínio ao final.
- O fechamento clínico foi separado da resposta inicial: o jogador organiza a proteção e, depois, encerra o dossiê defendendo a hipótese com as evidências reunidas.
- O resultado passou a reunir um diário de decisões, o impacto de escolhas de risco, XP e moedas conquistados e uma biblioteca opcional da doença.
- Depois de concluir, o estudante pode consultar diferenciais diagnósticos e entender por que cada alternativa se encaixava menos ou mais no caso, sem que a resposta seja antecipada durante o jogo.

## O que isso muda para quem joga

O fluxo deixa de começar por uma lista extensa de cartões. O estudante entra na central, identifica um foco, assume uma missão, observa o cenário, reúne pistas, toma decisões e vê o resultado. As explicações médicas continuam presentes, mas aparecem na hora em que ajudam a compreender a decisão ou no encerramento do caso.

Erros deixam de ser apenas uma interrupção. Uma escolha frágil pode manter a pressão do surto e reduzir parte da recompensa, enquanto a revisão final mostra o motivo didático da consequência. O jogo preserva a possibilidade de aprender com o erro sem transformar a missão em tentativa até acertar.

## Próximos passos propostos

1. Testar a nova Base de Operações com estudantes em computador e celular, observando se encontram uma missão sem orientação verbal.
2. Aplicar o modelo de história do paciente, risco contextualizado e revisão de diferenciais aos demais casos, com revisão docente do conteúdo.
3. Transformar o mapa em registro da campanha: territórios controlados, progresso do capítulo e abertura visual da fase seguinte.
4. Criar novas missões e variações por doença para ampliar a rejogabilidade sem repetir sempre as mesmas pistas e alternativas.
5. Refinar as consequências por caso para que atendimento, vigilância, recursos e estado do surto respondam de forma clara às decisões do estudante.

O próximo ciclo de testes deve nos dizer se o mapa facilita a entrada no jogo e se os efeitos tornam as consequências mais fáceis de perceber. A partir desses retornos, será possível aumentar o conteúdo sem perder clareza ou precisão clínica.
