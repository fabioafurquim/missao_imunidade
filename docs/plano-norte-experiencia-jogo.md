# Missão Imunidade — plano norte da experiência

## Direção

Transformar a Missão Imunidade em uma aventura visual de investigação médica. O estudante deve sentir que entrou em um cenário, descobriu pistas, tomou decisões e viu consequências, em vez de apenas percorrer textos e cartões.

O objetivo didático permanece: praticar observação, raciocínio clínico, microbiologia, epidemiologia e saúde pública por meio de decisões explicáveis. O diagnóstico deve continuar oculto até uma defesa devidamente sustentada.

A revisão de rumo aprovada para a próxima fase está detalhada em [revisao-de-rumo-campanha-visual.md](revisao-de-rumo-campanha-visual.md). Ela amplia este norte com navegação pelo mapa, consequências que permitem aprender com o erro, consulta às etapas anteriores, biblioteca opcional de doenças e campanha em capítulos.

## Problema que este plano resolve

A versão atual já possui cenários, personagens, indicadores, recursos, XP e consequências. Ainda assim, a interação predominante é clicar em um cartão, ler uma informação e seguir para o próximo cartão. Muitos elementos de orientação competem pela atenção, os cenários têm pouca influência direta sobre a ação e as recompensas aparecem tarde.

## Experiência desejada

Cada caso deve seguir um ciclo simples e perceptível:

**Explorar → descobrir → escolher → ver a consequência → conquistar → avançar.**

A campanha também passa a seguir um ciclo maior:

**Receber alerta → atuar no território → controlar o surto → transformar o mapa → liberar um novo capítulo.**

O primeiro caso é o piloto da nova linguagem. A campanha será expandida somente depois de o piloto ser compreensível e divertido para quem o testa sem ajuda.

## Estrutura de um episódio

1. **Chamado:** o alerta chega, a equipe apresenta o problema e o jogador entra em operação.
2. **Cena de campo:** o estudante observa uma pessoa, lugar ou situação e toca em elementos relevantes para descobrir os primeiros achados.
3. **Primeira ordem:** escolhe uma ação de proteção que produz uma alteração visual e uma consequência explicada.
4. **Exploração do território:** escolhe onde investigar, por exemplo atendimento, comunidade ou laboratório. Cada lugar responde a uma pergunta diferente.
5. **Mesa de investigação:** reúne cartas de evidência, seleciona as que sustentam a hipótese e reconhece incertezas.
6. **Intervenção no cenário:** posiciona medidas em pontos da cidade, unidade ou rede de contatos e observa o efeito simulado.
7. **Desfecho:** encontra a equipe, recebe recompensa, revisa decisões importantes e abre o debriefing completo.

## Telas principais

| Tela | Papel no jogo |
| --- | --- |
| Base da equipe | Escolher missões diretamente no mapa, acompanhar territórios, evolução e personalização. |
| Cena de campo | Observar, conversar, agir e acompanhar consequências imediatas. |
| Mapa local | Escolher o próximo lugar de investigação ou intervenção. |
| Mesa de investigação | Organizar pistas e defender hipótese. |
| Resultado | Celebrar, compreender a partida e avançar. |
| Biblioteca médica | Abrir, opcionalmente e após o diagnóstico, curiosidades e informações revisadas sobre a doença. |

Em celular, cada tela deve ter uma ação principal evidente. Informações adicionais permanecem disponíveis sob demanda, sem competir com o próximo passo.

## Direção visual e de interação

- Usar animações apenas quando comunicarem uma mudança: chegada de alerta, descoberta de pista, equipe enviada, intervenção aplicada, conquista desbloqueada ou evolução do cenário.
- Personagens devem reagir à situação e assumir papéis diferentes durante a missão; não podem servir apenas como decoração dos cartões.
- Pistas devem aparecer como cartas colecionáveis ou objetos da cena e ir para a mesa de investigação.
- A Nina ensina um gesto novo, responde quando chamada e comenta momentos importantes. Ela pode ser fechada e nunca encobre uma ação necessária.
- Só o próximo objetivo recebe destaque. Vários elementos piscando ao mesmo tempo devem ser evitados.
- Oferecer redução de movimento e preservar navegação por teclado e toque.
- Etapas já visitadas podem ser revistas como diário de bordo, sem desfazer decisões ou devolver recursos.
- O mapa deve mostrar estados claros de alerta, operação e território controlado. “Imunizado” só pode ser usado quando imunização realmente fizer parte da resposta.
- Uma escolha inadequada pode seguir adiante e gerar consequência, mas a explicação completa fica no debriefing para não revelar a solução durante a investigação.

## Identidade dos cinco casos

| Caso | Interação característica proposta |
| --- | --- |
| Porto de Mahan | Relacionar locais de exposição com a distribuição de casos. |
| Distrito Alvorada | Explorar o bairro e priorizar pontos de investigação. |
| Campus Norte | Reconstruir uma rede de contatos e uma cronologia. |
| Pavilhão 7 | Organizar uma linha do tempo e reconhecer conexões. |
| UTI Aurora | Acompanhar deslocamentos entre ambientes e planejar barreiras. |

As mecânicas precisam ser revisadas por docentes antes de entrarem em produção, para preservar precisão clínica e epidemiológica.

## Progressão e recompensas

- XP reconhece objetivos e raciocínio demonstrado; o resultado precisa explicar ganhos e perdas.
- Moedas devem servir para elementos cosméticos, acessórios, avatar e base da equipe.
- O desfecho mostra XP e moedas recebidos, separando primeira conclusão, missão diária e bônus de agilidade.
- Não bloquear opções clínicas necessárias por moedas ou nível.
- Criar coleção de casos resolvidos e selos ligados a competências praticadas.
- Manter a missão diária como retorno opcional, com objetivo e recompensa claros.
- A Jornada deve reunir partidas encerradas, tentativas, recompensas e evolução por competência, sem transformar a experiência em vigilância acadêmica.
- A partida ativa deve poder ser retomada com a mesma identidade em outro dispositivo. O código recuperável segue como caminho padrão; vínculo Google é opcional, sem e-mail armazenado.
- Separar XP de missão, XP de domínio, moedas de resposta e bônus opcionais. O erro reduz a parcela ligada ao domínio; não apaga todo o progresso de aprendizagem.
- A Central de Evolução já oferece títulos, conquistas e emblemas cosméticos adquiridos com moedas, sem bloquear conteúdo clínico.

## Comunidade, recordes e privacidade

- A central de recordes mostra atividade coletiva e rankings de melhor pontuação, XP e partidas iniciadas.
- Cada participante aparece pelo nome de exibição informado com aviso no perfil e usa um código recuperável para consolidar partidas. O sistema não guarda e-mail, senha, semestre nem matrícula.
- O PostgreSQL registra total de partidas, melhor pontuação e progresso agregado. Esses dados permitem acompanhar adesão e engajamento sem transformar o perfil didático em cadastro.
- Login com Google fica para uma etapa posterior, após definição de consentimento, política de privacidade, finalidade dos dados e fluxo de exclusão de conta. Não é necessário para a experiência atual.

## Rejogabilidade e biblioteca de doenças

A planilha `docs/referencias/doencas-jogo.xlsx` é a matriz inicial de autoria: reúne 30 doenças transmissíveis, transmissão, sintomas-chave, prevenção, tratamento e distribuição. Ela não substitui a revisão por fontes oficiais e docentes antes de cada caso entrar no jogo.

- Um dossiê variável mantém um núcleo didático obrigatório — padrão clínico, exposição, exame e medidas essenciais — e sorteia contexto, ordem de pistas, diferenciais e eventos sem retirar a possibilidade de raciocinar corretamente.
- Distrito Alvorada inaugura o modelo com três cenários: dengue, Zika e chikungunya. O território permanece reconhecível, mas mudam o padrão predominante, a hipótese, as cartas de evidência e as prioridades de resposta.
- A resposta tem uma ampulheta opcional: aplicar uma medida prioritária dentro do prazo concede XP adicional; o fim do prazo não bloqueia escolhas nem penaliza leitura.
- Acertos de prioridade recebem uma celebração visual curta. Animações devem sempre comunicar conquista, progresso ou mudança de cenário.

## Tempo e desafio

A investigação regular não terá contagem regressiva contínua. Futuras provas de tempo devem ser desafios opcionais e anunciados antes de começar, explicando propósito, prazo, impacto e recompensa. O tempo não deve punir leitura, acessibilidade ou uma pausa fora do jogo.

## Conteúdo e rejogabilidade

- Cada dossiê pode receber variações persistentes por partida: a escolha ocorre no início e não muda ao recarregar.
- Distrito Alvorada já alterna dengue, Zika e chikungunya. As próximas variações devem trocar padrão clínico, pistas, diferenciais, prioridades e desfecho, preservando a identidade do cenário.
- A campanha agora inclui três novos episódios inspirados na planilha recebida: Vale Safira (malária), Instituto Ponte (meningite meningocócica) e Ilha Aurora (hepatite A). Eles foram construídos com fontes da OMS e precisam de revisão docente antes de produção.
- A expansão futura deve priorizar doenças da planilha que ofereçam uma mecânica própria, como cronologia de viagem, rede de contatos, fonte comum, ambiente, vetor ou fluxo hospitalar.

## Roteiro de implementação

1. Desenhar o roteiro jogável completo de Porto de Mahan: telas, falas, descobertas, escolhas, consequências e recompensa.
2. Separar as regras da partida das telas atuais para permitir cenas e interações reutilizáveis.
3. Construir o episódio piloto completo: chamado, cena de campo, exploração, investigação, decisão, intervenção e desfecho.
4. Testar o piloto com estudantes sem explicação adicional e registrar onde param, o que entendem e o que querem fazer a seguir.
5. Ajustar ritmo, legibilidade e recompensas com base nos testes.
6. Adaptar o modelo aos outros quatro casos, preservando uma interação característica para cada um.
7. Acrescentar personalização, desafios opcionais e conteúdo revisado por docentes.
8. Revisar os novos episódios com docentes e criar uma segunda variação para cada cenário.
9. Permitir rever etapas concluídas e criar a biblioteca opcional **Conheça a doença**.
10. Testar em Porto de Mahan decisões que continuam após o erro, com consequência imediata e explicação no resultado.
11. Transformar o mapa na interface principal da campanha, incluindo estados dos territórios e sinal da missão diária.
12. Encerrar as oito missões como Capítulo 1 e liberar a estrutura do Capítulo 2.
13. Avaliar, com a equipe docente e de privacidade, se autenticação opcional traz benefício real para a turma.

## Ciclo de aprofundamento aprovado pela equipe

- Em implementação: cada episódio passa a abrir com uma **história humana curta**, separada das cartas. Ela cria interesse e contexto, mas não entrega a resposta diagnóstica.
- Em implementação: uma defesa frágil deixa de ser um bloqueio de tentativa e erro. A equipe continua em campo, a pressão do surto aumenta de forma visível e o jogador é direcionado a buscar outra lente; o debriefing explicará a lacuna e os diferenciais.
- Em implementação: etapas já visitadas se tornarão um **diário de bordo** para consulta, sem desfazer recursos ou escolhas. A Nina oferecerá dicas contextuais em camadas, sem custo ou punição por pedir ajuda.
- Planejado para o mesmo modelo: duas decisões de resposta entre três opções por vez, com alternativas inadequadas e consequências operacionais claras; a defesa diagnóstica ocorrerá no fechamento da missão, depois das primeiras medidas sindrômicas de proteção.
- Planejado: o resultado exibirá uma linha do tempo de acertos, escolhas frágeis, efeito no cenário, XP de participação e XP de domínio; a aba opcional **Conheça a doença** apresentará diferenciais e porquês após o encerramento.
- Planejado: o mapa da campanha passará a usar geografia real como contexto, deixando explícito que os episódios são simulações educativas. Marcadores e painéis devem se afastar do ponto geográfico selecionado; no celular, a ficha da missão sobe abaixo do mapa.

## Progresso da implementação

- Concluído nesta etapa: Porto de Mahan recebeu uma história opcional da paciente, apresentada antes da cena de campo e fora das cartas de evidência.
- Concluído nesta etapa: a resposta do episódio agora mostra apenas as duas prioridades e um atalho de risco. Escolher o atalho aumenta casos, marca a decisão como frágil e pode ser desfeito; escolher as duas prioridades encerra a resposta. A escolha de risco também sobrevive à retomada local da partida.
- Concluído nesta etapa: uma defesa diagnóstica frágil gera mais pressão e abre uma nova oportunidade de investigação; após usar todas as lentes, a equipe continua para a resposta em vez de recomeçar o caso.
- Concluído nesta etapa: aplicar as duas prioridades não encerra mais a missão automaticamente. A equipe vai para um fechamento clínico, em que a hipótese e a justificativa definem o desfecho.
- Concluído nesta etapa: o resultado traz o Diário da Equipe, com decisões adequadas e frágeis, e uma biblioteca opcional da doença com debrief, aprendizados e fonte oficial. A tela continua rolável em telas baixas.
- Concluído nesta etapa: a fase exata do episódio é persistida localmente, incluindo o novo fechamento clínico, para que uma recarga não devolva o jogador a uma etapa anterior.
- Concluído nesta etapa: o cabeçalho do episódio recebeu **Dica da Nina**, uma ajuda contextual que explica o objetivo da etapa atual sem cobrar energia, punir leitura ou encobrir controles.
- Concluído nesta etapa: o resultado explica cada hipótese alternativa e identifica o dado mais discriminativo somente após o fim do caso. Usar o atalho de risco continua permitindo aprender e concluir, mas reduz XP de domínio e moedas da primeira conclusão.
- Concluído nesta etapa: a Base da Equipe foi transformada em mapa de operações. Os dossiês são escolhidos por marcadores de alerta, o território concluído recebe estado visual de controle e a missão diária virou um sinal no mapa. No celular, a ficha da missão fica abaixo do mapa, com áreas de toque grandes e sem depender de pontos pequenos.
- Concluído nesta etapa: o mapa recebeu a arte `mapa-central-operacoes-v1.png` e camadas animadas de grade, varredura, radar, anéis de alerta, estado controlado e sinal diário. As animações comunicam o estado da operação e respeitam a preferência de redução de movimento.

- Concluído: Porto de Mahan passou a ter o episódio piloto com chamado, cena de campo, primeira ordem, mapa de exploração, cartas de evidência, mesa de investigação, resposta em campo e desfecho visual.
- Concluído: a estrutura visual de episódio foi adaptada aos oito dossiês, com chamado, campo, exploração, pistas, defesa, resposta e resultado.
- Concluído: foram criadas artes próprias de mapa explorável, com marcadores em HTML para que o jogador escolha cada investigação diretamente sobre o cenário.
- Concluído: Distrito Alvorada ganhou três variações sorteadas para rejogabilidade (dengue, Zika e chikungunya), com conteúdo e fontes específicas.
- Concluído: a resposta passou a oferecer bônus opcional de agilidade e celebração visual ao acionar uma prioridade dentro do prazo.
- Concluído: foi criado o painel Recordes, com nomes de exibição consentidos, agregados de jogadores, atividade mensal, partidas, dossiês concluídos e rankings por pontuação, XP e partidas.
- Concluído: PostgreSQL passou a registrar melhor pontuação e partidas iniciadas, com migração automática de esquema na inicialização.
- Concluído: a Central de Evolução passou a dar uso visual a XP e moedas por meio de títulos, conquistas e emblemas cosméticos.
- Concluído: a partida do piloto deriva a tela correta ao ser retomada no navegador.
- Em validação: clareza da jornada e interesse dos estudantes durante os testes de usabilidade.
- Pendente: tornar as etapas anteriores consultáveis, registrar escolhas frágeis sem bloquear o caso e explicar suas consequências no resultado.
- Pendente: transformar o mapa na interface principal da campanha e organizar a continuidade em capítulos.

## Critérios para aprovar o piloto

- Uma pessoa que nunca viu o jogo inicia e conclui o primeiro passo sem ajuda verbal.
- O jogador encontra a próxima ação e entende por que ela importa.
- O jogador consegue relatar o que mudou depois de uma decisão.
- O celular permite concluir toda a missão sem controles encobertos ou textos inacessíveis.
- Ao terminar, o jogador demonstra vontade de abrir outro caso.

## Implementado no ciclo atual

- A Base de Operações já apresenta alertas e territórios controlados em um mapa visual animado.
- Os oito dossiês possuem histórias humanas ilustradas, exibidas como contexto opcional antes da investigação.
- A Mesa de Investigação passou a organizar a resposta inicial sem pedir o diagnóstico. A hipótese final fica no encerramento, depois das medidas e de suas consequências.
- A central oferece quatro pontos de energia por partida para dicas. A orientação custa um ponto e o foco investigativo custa dois; ambos mostram o próximo raciocínio útil sem revelar o diagnóstico e ficam registrados no Diário da Equipe.
- O Sinal da Central acompanha o episódio com mensagens curtas ligadas ao território, ao número de casos e às pistas descobertas.
- A Base mostra o avanço do Capítulo 1 por meio de selos de território; ao concluir todos os dossiês, a central muda para um estado de campanha completa e anuncia a abertura futura do próximo capítulo.
- O Diário da Equipe inclui um indicador visual de consequência, distinguindo ações protetoras de escolhas frágeis e resumindo o estado da resposta.
- Cada dossiê agora possui uma Operação-chave entre a Mesa de Investigação e a resposta. As três rotas são específicas para o território e apresentam uma escolha protetora, uma parcial e uma de risco. A consequência altera o cenário e entra no Diário da Equipe; o diagnóstico segue reservado para o fechamento.
- Porto de Mahan, Campus Norte, Pavilhão 7, UTI Aurora, Vale Safira, Instituto Ponte e Ilha Aurora passaram a sortear duas aberturas operacionais persistentes. Cada abertura altera o contexto humano, a síndrome inicial, os indicadores da central e a fala de campo, sem trocar o diagnóstico oculto durante a partida. Distrito Alvorada mantém suas variações clínicas próprias. A seleção é salva na partida ativa e permanece igual após recarregar a página.
- Uma hipótese final frágil não encerra automaticamente a missão. A pressão do surto aumenta, a capacidade de cuidado sofre impacto e a equipe volta à Mesa de Investigação com duas ações e um recurso recuperado para buscar outra lente. Apenas ao ultrapassar o limite de casos ou de ciclos a missão entra em revisão. A tentativa é registrada no Diário da Equipe e a revisão final relaciona cada diferencial ao sinal mais discriminativo do dossiê.
- O resultado agora usa um debriefing individual: identifica uma decisão protetora do percurso, aponta a principal lacuna efetivamente registrada na partida e apresenta uma linha do tempo completa das decisões clínicas, territoriais e diagnósticas. Não usa um texto genérico de desempenho para todos os jogadores.

## Próximo bloco

1. Fazer os territórios controlados mudarem visualmente de forma mais marcante no mapa e abrir uma cena curta de conclusão de capítulo.
2. Criar efeitos de consequência específicos para cada missão, com mudanças claras de atendimento, vigilância e exposição.
3. Ampliar as histórias ilustradas para os demais cenários e revisar cada narrativa com docentes.
4. Criar variações de pistas e eventos para todos os dossiês, preservando coerência clínica e epidemiológica.
5. Revisar as variações operacionais com docentes e evoluí-las para variações clínicas completas apenas quando houver sinais, diferenciais, medidas e fontes revisados para cada rota.

## Capítulo 2 em preparação

O Capítulo 2 tem uma matriz editorial em `docs/referencias/matriz-capitulo-2-revisao.md`. Ela parte de febre amarela, coqueluche e doença de Chagas, temas presentes na planilha fornecida pela equipe. Os casos só entram como dossiês jogáveis depois de revisão docente de sinais, diferenciais, medidas e fontes oficiais.

## Expansão de conteúdo em desenvolvimento

- A Base de Operações agora possui uma cerimônia de encerramento visual do Capítulo 1. Quando todos os oito territórios são controlados, o mapa reconhece a conquista, entrega o selo **Guardião da Resposta** e apresenta a próxima transmissão da Central.
- Abaixo da cerimônia, o Capítulo 2 aparece como uma prévia de desenvolvimento. Rota Dourada, Vila Horizonte e Corredor Andino mostram contexto narrativo, mecânica proposta, competência principal e fonte oficial, sempre marcados como **em revisão docente**.
- Os rascunhos não são dossiês iniciáveis e não contam para XP, moedas, recordes ou missão diária. A liberação exige aprovação docente registrada para cada caso, de acordo com a matriz editorial.
