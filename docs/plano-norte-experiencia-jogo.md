# Missão Imunidade — plano norte da experiência

## Direção

Transformar a Missão Imunidade em uma aventura visual de investigação médica. O estudante deve sentir que entrou em um cenário, descobriu pistas, tomou decisões e viu consequências, em vez de apenas percorrer textos e cartões.

O objetivo didático permanece: praticar observação, raciocínio clínico, microbiologia, epidemiologia e saúde pública por meio de decisões explicáveis. O diagnóstico deve continuar oculto até uma defesa devidamente sustentada.

## Problema que este plano resolve

A versão atual já possui cenários, personagens, indicadores, recursos, XP e consequências. Ainda assim, a interação predominante é clicar em um cartão, ler uma informação e seguir para o próximo cartão. Muitos elementos de orientação competem pela atenção, os cenários têm pouca influência direta sobre a ação e as recompensas aparecem tarde.

## Experiência desejada

Cada caso deve seguir um ciclo simples e perceptível:

**Explorar → descobrir → escolher → ver a consequência → conquistar → avançar.**

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
| Base da equipe | Escolher missão, acompanhar evolução e personalizar o avatar e a central. |
| Cena de campo | Observar, conversar, agir e acompanhar consequências imediatas. |
| Mapa local | Escolher o próximo lugar de investigação ou intervenção. |
| Mesa de investigação | Organizar pistas e defender hipótese. |
| Resultado | Celebrar, compreender a partida e avançar. |

Em celular, cada tela deve ter uma ação principal evidente. Informações adicionais permanecem disponíveis sob demanda, sem competir com o próximo passo.

## Direção visual e de interação

- Usar animações apenas quando comunicarem uma mudança: chegada de alerta, descoberta de pista, equipe enviada, intervenção aplicada, conquista desbloqueada ou evolução do cenário.
- Personagens devem reagir à situação e assumir papéis diferentes durante a missão; não podem servir apenas como decoração dos cartões.
- Pistas devem aparecer como cartas colecionáveis ou objetos da cena e ir para a mesa de investigação.
- A Nina ensina um gesto novo, responde quando chamada e comenta momentos importantes. Ela pode ser fechada e nunca encobre uma ação necessária.
- Só o próximo objetivo recebe destaque. Vários elementos piscando ao mesmo tempo devem ser evitados.
- Oferecer redução de movimento e preservar navegação por teclado e toque.

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

## Comunidade, recordes e privacidade

- A central de recordes mostra atividade coletiva e rankings de melhor pontuação, XP e partidas iniciadas.
- Cada participante aparece somente como um código anônimo gerado no navegador; o ranking não usa nome, e-mail nem matrícula.
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
8. Avaliar, com a equipe docente e de privacidade, se autenticação opcional e identificação visível no ranking trazem benefício real para a turma.

## Progresso da implementação

- Concluído: Porto de Mahan passou a ter o episódio piloto com chamado, cena de campo, primeira ordem, mapa de exploração, cartas de evidência, mesa de investigação, resposta em campo e desfecho visual.
- Concluído: a estrutura do episódio foi adaptada aos cinco dossiês, com textos de orientação, perguntas de exploração e locais próprios para Distrito Alvorada, Campus Norte, Pavilhão 7 e UTI Aurora.
- Concluído: foram criadas cinco artes próprias de mapa explorável, com marcadores em HTML para que o jogador escolha cada investigação diretamente sobre o cenário.
- Concluído: Distrito Alvorada ganhou três variações sorteadas para rejogabilidade (dengue, Zika e chikungunya), com conteúdo e fontes específicas.
- Concluído: a resposta passou a oferecer bônus opcional de agilidade e celebração visual ao acionar uma prioridade dentro do prazo.
- Concluído: foi criado o painel Recordes, com agregados de jogadores, atividade mensal, partidas, dossiês concluídos e rankings anônimos por pontuação, XP e partidas.
- Concluído: PostgreSQL passou a registrar melhor pontuação e partidas iniciadas, com migração automática de esquema na inicialização.
- Concluído: a partida do piloto deriva a tela correta ao ser retomada no navegador.
- Em validação: clareza da jornada e interesse dos estudantes durante os testes de usabilidade.
- Pendente: separar as regras da partida das telas legadas de forma mais ampla e aplicar o modelo aos outros quatro dossiês.

## Critérios para aprovar o piloto

- Uma pessoa que nunca viu o jogo inicia e conclui o primeiro passo sem ajuda verbal.
- O jogador encontra a próxima ação e entende por que ela importa.
- O jogador consegue relatar o que mudou depois de uma decisão.
- O celular permite concluir toda a missão sem controles encobertos ou textos inacessíveis.
- Ao terminar, o jogador demonstra vontade de abrir outro caso.
