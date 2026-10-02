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
- A partida ativa deve poder ser retomada com a mesma identidade em outro dispositivo. O código recuperável segue como caminho padrão; o vínculo Google é opcional e o e-mail só é guardado depois de uma autorização explícita, com acesso restrito ao painel administrativo.
- Separar XP de missão, XP de domínio, moedas de resposta e bônus opcionais. O erro reduz a parcela ligada ao domínio; não apaga todo o progresso de aprendizagem.
- A Central de Evolução já oferece títulos, conquistas e emblemas cosméticos adquiridos com moedas, sem bloquear conteúdo clínico.

## Comunidade, recordes e privacidade

- A central de recordes mostra atividade coletiva e rankings de melhor pontuação, XP e partidas iniciadas.
- Cada participante aparece pelo nome de exibição informado com aviso no perfil. Códigos de jogador não são devolvidos pela consulta pública de recordes; o código recuperável continua sendo a identidade da jornada.
- O PostgreSQL registra total de partidas, melhor pontuação e progresso agregado. Esses dados permitem acompanhar adesão e engajamento sem transformar o perfil didático em cadastro.
- O vínculo opcional com Google está implementado: a API valida o token de identidade e associa a conta à jornada. Com consentimento explícito, guarda o e-mail para o acompanhamento administrativo; foto, senha e token não são persistidos. O estudante continua podendo usar o código recuperável sem Google.
- A interface mostra **Google vinculado** junto ao nome e no perfil, oculta a opção de vincular novamente e recupera esse estado ao reabrir o jogo. O vínculo serve para reencontrar a mesma jornada em outro dispositivo; não altera semestre nem eixo de estudo.
- A tela de recordes não expõe códigos internos. O identificador continua necessário para reunir progresso, histórico e partidas da mesma pessoa, mas permanece fora da lista pública.

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

1. Fazer testes de usabilidade da Base de Operações, da Jornada e da recuperação com código/Google em computador e celular.
2. Testar os seis episódios do Capítulo 2 e registrar ajustes de sinais discriminativos, diferenciais, medidas, consequências e fontes.
3. Ampliar o Capítulo 2 com novas rotas da planilha, preservando mecânicas próprias e referências oficiais.
4. Validar a retomada de partidas entre navegadores e dispositivos, incluindo interrupção no meio de um caso e retorno pela mesma identidade.
5. Usar as opiniões dos estudantes para ajustar clareza, legibilidade, feedback e ritmo antes de ampliar a quantidade de conteúdo.

## Ciclo de aprofundamento aprovado pela equipe

- Concluído: os episódios abrem com uma **história humana curta**, separada das cartas de evidência, que cria contexto sem antecipar o diagnóstico.
- Concluído: uma defesa frágil não bloqueia o avanço por tentativa e erro. A pressão aumenta, a equipe procura outra lente e o debriefing explica a lacuna e os diferenciais ao final.
- Concluído: as etapas já visitadas podem ser consultadas pelo cabeçalho do episódio sem desfazer recursos ou escolhas. A Nina oferece dicas contextuais em camadas, sem custo ou punição por pedir ajuda.
- Planejado para o mesmo modelo: duas decisões de resposta entre três opções por vez, com alternativas inadequadas e consequências operacionais claras; a defesa diagnóstica ocorrerá no fechamento da missão, depois das primeiras medidas sindrômicas de proteção.
- Planejado: o resultado exibirá uma linha do tempo de acertos, escolhas frágeis, efeito no cenário, XP de participação e XP de domínio; a aba opcional **Conheça a doença** apresentará diferenciais e porquês após o encerramento.
- Planejado: o mapa da campanha passará a usar geografia real como contexto, deixando explícito que os episódios são simulações educativas. Marcadores e painéis devem se afastar do ponto geográfico selecionado; no celular, a ficha da missão sobe abaixo do mapa.

## Progresso da implementação

- Concluído no ciclo mais recente: a Jornada reúne resumos individuais das partidas encerradas e permite retomar uma partida em andamento pela mesma identidade, com dados espelhados no PostgreSQL.
- Concluído no ciclo mais recente: o vínculo opcional com Google foi integrado à jornada recuperável. O servidor valida o token; a tela identifica a conta conectada junto ao nome e no perfil, e não oferece um segundo vínculo quando ele já existe.
- Concluído no ciclo mais recente: a resposta pública de Recordes apresenta nomes e resultados sem expor os códigos internos dos jogadores.
- Concluído no ciclo mais recente: o Capítulo 2 foi aberto com Rota Dourada (febre amarela), Vila Horizonte (coqueluche) e Corredor Andino (doença de Chagas). Os três possuem episódios completos, escolhas territoriais, consequências, diferenciais, medidas e fontes oficiais.
- Concluído no ciclo mais recente: o Capítulo 1 mantém seus oito dossiês e uma cerimônia própria. Após controlá-los, o mapa libera sequencialmente seis operações do Capítulo 2.
- Concluído no ciclo mais recente: visitas por sessão, atividade por jogador e desempenho por missão passaram a ser registrados no PostgreSQL. Um painel administrativo protegido por autenticação Google reúne essas informações.
- Concluído no ciclo mais recente: o vínculo Google passou a pedir autorização explícita para guardar o e-mail. O e-mail não aparece nos Recordes e fica restrito ao painel administrativo.
- Concluído no ciclo mais recente: as três missões do Capítulo 2 receberam cenários de exploração e histórias de pacientes exclusivos. Rota Dourada usa um corredor florestal com resposta regional; Vila Horizonte apresenta a rede pediátrica, os contatos e a coleta; Corredor Andino articula visita domiciliar, comunidade, unidade e laboratório móvel.
- Concluído no ciclo mais recente: os assets narrativos do chamado foram separados dos mapas exploráveis. A abertura aproxima o jogador da pessoa e a exploração amplia o olhar para o território, sem texto embutido nem revelação visual do diagnóstico.
- Concluído no ciclo mais recente: Rota Dourada, Vila Horizonte e Corredor Andino passaram a sortear duas aberturas persistentes por missão. A variação altera história, indicadores e rota operacional sem trocar o diagnóstico durante a partida.
- Concluído no ciclo mais recente: Operação Sentinela (raiva), Baixada das Chuvas (leptospirose) e Canteiro Horizonte (tétano) ampliaram a campanha para 14 dossiês. Cada missão acrescenta uma lógica própria: classificação de exposição, rota segura após enchente e emergência individual sem transmissão interpessoal.
- Concluído no ciclo mais recente: as três novas operações possuem histórias de pacientes e cenários territoriais próprios, além de momento tático, diferenciais, consequências e missão diária.
- Concluído no ciclo mais recente: tabelas de partida ativa, histórico de partidas e vínculo de identidade são criadas automaticamente pela aplicação quando o PostgreSQL está configurado.

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
- Em validação: clareza do fluxo completo, da retomada entre dispositivos e do vínculo Google opcional durante testes com estudantes.
- Em validação: conteúdo e ritmo dos três novos dossiês, que poderão ser ajustados quando houver retorno da equipe e revisão médica posterior.
- Pendente: testar em condições reais de celular a consulta das etapas, o painel de Jornada e o retorno a uma partida interrompida.

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

1. Testar a vinculação Google e a retomada da Jornada em outro navegador, verificando que o perfil e as partidas correspondem à mesma identidade.
2. Fazer uma rodada de teste da Base de Operações e do debriefing em celular, registrando pontos de confusão e problemas de acessibilidade.
3. Testar Rota Dourada, Vila Horizonte e Corredor Andino do início ao debriefing, registrando pontos de confusão e equilíbrio.
4. Selecionar a próxima onda da planilha por variedade de mecânica, incluindo água, vetores, contato próximo, ferimentos e exposições ambientais.
5. Definir o processo de suporte, correção de e-mail e exclusão dos dados vinculados ao Google.

## Capítulo 2 jogável

O Capítulo 2 reúne febre amarela, coqueluche, doença de Chagas, raiva, leptospirose e tétano, temas presentes na planilha fornecida pela equipe. A matriz editorial permanece como registro de autoria e pontos que podem ser aprimorados. A equipe decidiu permitir testes jogáveis antes da revisão docente formal, aceitando ajustes posteriores.

## Expansão de conteúdo em desenvolvimento

- A Base de Operações agora possui uma cerimônia de encerramento visual do Capítulo 1. Quando todos os oito territórios são controlados, o mapa reconhece a conquista, entrega o selo **Guardião da Resposta** e apresenta a próxima transmissão da Central.
- Abaixo da cerimônia, o Capítulo 2 mostra o progresso das seis operações e passa a agrupá-las conceitualmente por rotas vetoriais, respiratórias, ambientais e de Uma Só Saúde.
- Os novos dossiês contam para XP, moedas, Jornada e Recordes. A missão diária também pode selecioná-los.


## Instrumentação e desempenho da campanha

- A cena de resposta representa visualmente a consequência da Operação-chave e o avanço das medidas prioritárias. A animação deve comunicar mudança e respeitar a preferência de redução de movimento.
- O PostgreSQL registra um funil técnico por partida: início, etapa alcançada, uso de dica, escolha tática, tentativa de fechamento e saída. O painel administrativo apresenta dados agregados por missão.
- “Partidas em aberto” é uma estimativa e pode incluir jogadores que ainda estão jogando; não deve ser apresentada como abandono definitivo.
- O mapa mantém todos os focos acessíveis, mas revela o rótulo apenas na seleção, no foco de teclado ou no ponteiro para reduzir sobreposição.
- As artes importadas pela aplicação usam WebP otimizado. Os PNGs de autoria podem permanecer no repositório como fonte, mas não devem ser entregues no pacote de produção quando houver versão WebP equivalente.


## Avanço da rodada — rotas de especialização

- Concluído: o Capítulo 2 deixou de usar uma fila linear única e passou a oferecer quatro caminhos: Vetorial, Respiratório, Uma Só Saúde e Ambiental.
- Concluído: a primeira operação de cada rota fica disponível quando o capítulo abre. As etapas seguintes dependem apenas do progresso dentro da rota escolhida.
- Concluído: a central mostra objetivo, progresso, missões e selo de cada caminho. O selo é conquistado quando todas as operações daquela rota são controladas.
- Concluído: cada missão do Capítulo 2 identifica sua rota no chamado, reforçando qual competência está sendo praticada.
- Concluído: a missão diária e os marcadores do mapa respeitam o novo desbloqueio ramificado.
- Concluído: o modo de teste permite inspecionar e iniciar as rotas sem alterar o progresso real da campanha.

## Próxima rodada sugerida

A próxima evolução deve levar a identidade das rotas para dentro da jogabilidade. Cada caminho receberá uma interação exclusiva reutilizável: mapa de cobertura na rota vetorial, cadeia de contatos na respiratória, classificação de exposição em Uma Só Saúde e montagem de rota segura na ambiental.

## Avanço da rodada — desafios interativos por rota

- Concluído: as seis missões do Capítulo 2 possuem desafios opcionais no mapa de exploração, com mecânicas coerentes com a rota: cobertura territorial, cadeia de contatos, exposição vetorial, classificação de contato com animal, planejamento ambiental e avaliação individual de ferimento.
- Concluído: cada alternativa recebe uma explicação didática no momento da escolha. A interação não bloqueia o avanço nem revela o diagnóstico.
- Concluído: uma priorização adequada concede um recurso simulado e reduz levemente a pressão do cenário; uma escolha frágil continua a partida e fica registrada no Diário da Equipe para revisão individual.
- Concluído: escolhas e resultados usam o estado persistido da partida, então permanecem após retomada local ou entre dispositivos quando a persistência está configurada.

## Próxima rodada sugerida

Dar resposta visual do território para cada consequência, variar os desafios dentro dos limites de cada operação e validar se o painel funciona bem em celular sem empurrar pistas e locais de exploração para fora do alcance.

## Avanço da rodada — o território reage

O resultado do desafio de rota passa a aparecer também sobre a arte do mapa, com cor, pulso breve e frase de estado. A mudança deve ser legível sem depender da animação; a preferência por redução de movimento continua respeitada. Em celular, os locais investigáveis precedem o desafio opcional para preservar a ação principal.

## Avanço da rodada — rejogabilidade coerente

Cada uma das seis operações do Capítulo 2 oferece duas aberturas operacionais e um desafio correspondente. A situação é sorteada no início e persistida com a partida, sem trocar a hipótese clínica ou as evidências no meio da investigação. O resultado final registra a escolha individual e oferece revisão opcional de todos os caminhos do desafio. O bônus por boa priorização aumenta apenas o recurso de investigação simulado; não reduz imediatamente os casos acompanhados.

Os cartões do desafio receberam símbolos associados à rota e uma ordem sorteada por partida. Essa ordem integra o estado salvo e não muda ao retomar, evitando que uma posição fixa denuncie a melhor resposta.

Na verificação do episódio completo, a ordem de descoberta das pistas passou a ser preservada ao restaurar a partida. Uma pista do Canteiro Horizonte foi reescrita para não revelar o nome do diagnóstico antes da defesa final.
