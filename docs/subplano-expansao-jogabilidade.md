# Subplano — expansão de jogabilidade e conteúdo

## Objetivo

Levar a Missão Imunidade de uma campanha com vários conteúdos para uma campanha com diferentes formas de jogar. Cada nova doença deve acrescentar uma decisão, uma consequência ou uma leitura visual que não dependa apenas de visitar pontos e reunir cartas.

## Frente 1 — três novos dossiês

### Raiva — Operação Sentinela

- Mecânica principal: classificar visualmente o tipo de exposição.
- Decisão crítica: ordenar lavagem do ferimento, avaliação e profilaxia sem esperar sintomas.
- Consequência: atrasar a resposta faz o relógio de oportunidade avançar; a missão continua, mas perde domínio e aumenta a pressão.
- Linguagem visual: centro de zoonoses, unidade de cuidado, território e rede veterinária.

### Leptospirose — Baixada das Chuvas

- Mecânica principal: reconstruir uma rota segura em território alagado.
- Decisão crítica: diferenciar presença na enchente de exposição relevante e reconhecer sinais de gravidade.
- Consequência: uma rota mal protegida amplia pessoas expostas e pressiona o atendimento.
- Linguagem visual: bairro após a chuva, abrigo, unidade móvel, saneamento e vigilância ambiental.

### Tétano — Canteiro Horizonte

- Mecânica principal: combinar ferimento, cuidado local e histórico vacinal.
- Decisão crítica: reconhecer um risco individual que não se transmite entre pessoas.
- Consequência: campanhas de isolamento ou busca de contatos desperdiçam recursos; cuidado do ferimento e imunização adequada protegem o jogador.
- Linguagem visual: canteiro, pronto atendimento, sala de imunização e investigação do acidente.

## Frente 2 — consequências visuais

- Mostrar um estado territorial antes e depois da operação.
- Dar nome ao efeito de cada decisão: oportunidade preservada, exposição ampliada, rede protegida ou recurso desperdiçado.
- Fazer a Nina comentar a mudança observável sem entregar o diagnóstico.
- Registrar decisões frágeis na linha do tempo individual do debriefing.

## Frente 3 — campanha por rotas

- Organizar o Capítulo 2 em rotas vetoriais, respiratórias e ambientais.
- Permitir que o jogador veja qual competência cada rota desenvolve.
- Manter desbloqueio sequencial dentro de cada rota enquanto a navegação ramificada é refinada.
- Preparar selos de rota e uma conclusão visual do capítulo.

## Frente 4 — dados e acompanhamento

- Registrar início, conclusão e abandono aproximado de cada missão.
- Registrar fase alcançada, uso de dicas, escolhas táticas e diagnóstico defendido.
- Exibir no painel administrativo taxa de conclusão e pontos de abandono por missão.
- Manter e-mails restritos ao painel autorizado e não expor códigos de recuperação.

## Frente 5 — escala editorial e desempenho

- Separar novos dossiês em módulos próprios de conteúdo.
- Manter fonte oficial por missão e diagnóstico oculto antes do fechamento.
- Gerar assets sem texto e carregá-los somente quando a missão correspondente for aberta.
- Converter imagens grandes para formatos mais leves antes da próxima publicação.

## Ordem desta rodada

1. Construir os três dossiês completos.
2. Criar arte de paciente e exploração para cada um.
3. Integrar histórias, cenas, momentos táticos, lentes diagnósticas e missões diárias.
4. Acrescentar a primeira visualização de rotas no mapa.
5. Validar frontend, API, persistência e responsividade.

## Próxima rodada sugerida

Depois desta expansão, a prioridade será tornar as consequências animadas dentro dos cenários e registrar telemetria de funil por etapa. Isso permitirá descobrir onde os jogadores se confundem ou abandonam antes de acrescentar outra grande onda de doenças.


## Avanço da rodada — consequências, leitura de uso e desempenho móvel

- Concluído: a rota escolhida na Operação-chave passa a mudar visualmente a cena de resposta. Rotas protetoras, parciais e frágeis possuem cor, pulso, mensagem e consequência próprias.
- Concluído: o cenário reforça o avanço das prioridades aplicadas, permitindo perceber a proteção crescer antes do fechamento clínico.
- Concluído: cada partida recebe um identificador técnico efêmero e registra etapas alcançadas, dicas, escolha tática, tentativa diagnóstica e saída. O conteúdo clínico das respostas não é enviado.
- Concluído: o painel administrativo ganhou um funil por dossiê com partidas iniciadas, concluídas, em aberto, uso de dicas e chegada ao diagnóstico. Partidas em aberto são tratadas como estimativa, pois podem estar em andamento.
- Concluído: os marcadores do mapa foram compactados. O rótulo aparece no foco selecionado, no teclado ou ao passar o ponteiro, reduzindo sobreposição com 14 operações.
- Concluído: 36 artes usadas pelo jogo foram convertidas para WebP. As 12 artes mais recentes caíram de 27,7 MB para 2,6 MB; outras 24 artes antigas caíram de 45,3 MB para 4,0 MB.

## Próxima rodada sugerida

1. Transformar as rotas do Capítulo 2 em progressão ramificada, com selo próprio e escolha visual do percurso.
2. Usar o funil para criar um painel de dificuldade por etapa e semestre, sem expor respostas individuais.
3. Adicionar uma segunda interação exclusiva a cada rota: cronologia, classificação de exposição, cadeia de contatos ou montagem de barreiras.
4. Fazer carregamento sob demanda dos episódios para reduzir também o JavaScript inicial.
5. Testar a campanha completa em celular e ajustar os pontos revelados pela telemetria.


## Avanço da rodada — rotas de especialização

- Concluído: o Capítulo 2 deixou de usar uma fila linear única e passou a oferecer quatro caminhos: Vetorial, Respiratório, Uma Só Saúde e Ambiental.
- Concluído: a primeira operação de cada rota fica disponível quando o capítulo abre. As etapas seguintes dependem apenas do progresso dentro da rota escolhida.
- Concluído: a central mostra objetivo, progresso, missões e selo de cada caminho. O selo é conquistado quando todas as operações daquela rota são controladas.
- Concluído: cada missão do Capítulo 2 identifica sua rota no chamado, reforçando qual competência está sendo praticada.
- Concluído: a missão diária e os marcadores do mapa respeitam o novo desbloqueio ramificado.
- Concluído: o modo de teste permite inspecionar e iniciar as rotas sem alterar o progresso real da campanha.

## Próxima rodada sugerida

A próxima evolução deve levar a identidade das rotas para dentro da jogabilidade. Cada caminho receberá uma interação exclusiva reutilizável: mapa de cobertura na rota vetorial, cadeia de contatos na respiratória, classificação de exposição em Uma Só Saúde e montagem de rota segura na ambiental.

## Avanço — desafios exclusivos das rotas

As seis operações do Capítulo 2 agora trazem um desafio opcional no mapa de exploração. As escolhas são específicas ao tema: localizar lacunas de cobertura, priorizar contatos próximos vulneráveis, cruzar sinais ambientais, classificar a exposição a um animal, planejar deslocamento seguro após enchente e avaliar ferimento com histórico de vacinação.

Cada escolha recebe feedback imediato e contextualizado. Uma priorização adequada concede um pequeno bônus operacional simulado; uma resposta menos adequada fica registrada para o debriefing, mas não interrompe a missão. O resultado é salvo junto com o Diário da Equipe. A interface deixa explícito que se trata de uma simulação educativa.

## Próxima rodada sugerida

1. Dar resposta visual do território para cada consequência, com animações breves e acessíveis.
2. Acrescentar variações de desafio por operação sem alterar o diagnóstico ou as evidências clínicas no meio da partida.
3. Rever o equilíbrio do bônus de recurso após observar partidas reais no painel de funil.
4. Fazer uma passada de usabilidade móvel para confirmar que o desafio não empurra as pistas ou os locais de exploração para fora do alcance.

## Avanço — reação do mapa e ordem de leitura no celular

- A escolha no desafio de rota agora acende uma camada de consequência no próprio mapa de exploração: verde-água quando a frente foi reforçada, âmbar quando a rota precisa de revisão. Um aviso curto explica o estado sem encobrir os pontos de investigação.
- No celular, a cena e a lista de locais investigáveis aparecem antes do desafio opcional. Assim, a próxima ação principal fica ao alcance do jogador mesmo que ele ignore a interação adicional.
- O painel recebeu texto e alvos de toque maiores. A animação é breve e obedece à preferência de redução de movimento do dispositivo.

## Próxima rodada sugerida

Criar variações persistidas para o desafio de cada operação e observar partidas reais antes de ajustar recompensas. Uma revisão visual em aparelhos móveis deve confirmar se os avisos do mapa não competem com a cena.

## Avanço — duas aberturas por operação e revisão das escolhas

- As seis operações do Capítulo 2 passaram a ter duas situações de abertura. O sorteio ocorre ao iniciar e usa o `variantId` já salvo na partida local e no PostgreSQL. Ao retomar, a mesma situação e o mesmo desafio reaparecem.
- O desafio alternativo acompanha a história específica. Em Corredor Andino, por exemplo, a abertura pela linha materna pergunta sobre história familiar; a abertura domiciliar pergunta sobre território e vetores.
- O debriefing agora inclui a escolha de rota no quadro individual e oferece uma revisão opcional com as três alternativas e a explicação de cada uma.
- A boa priorização concede um recurso adicional de investigação. Ela não diminui instantaneamente o número de pessoas doentes, preservando o sentido epidemiológico dos indicadores.
- Os três cartões de escolha agora têm símbolos e composição visual próprios da rota. A ordem é embaralhada no início da partida e salva para permanecer igual depois de recarregar ou retomar em outro dispositivo.
- Uma partida local completa de Canteiro Horizonte confirmou a retomada da escolha, o bônus de recurso e a revisão das três alternativas no encerramento. A inspeção também levou à correção de uma pista que citava o diagnóstico cedo demais e da pluralização no quadro final.

## Próxima rodada sugerida

Observar estudantes jogando ambas as aberturas de cada operação, ajustar a clareza das pistas que sustentam as escolhas e criar um sinal visual de conclusão das rotas na Base de Operações.
