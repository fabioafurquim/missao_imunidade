export type Role = 'emergencia' | 'infectologia' | 'epidemiologia' | 'laboratorio'

export type Clue = {
  id: string
  role: Role
  category: 'Clínica' | 'Exposição' | 'Laboratório' | 'Vigilância'
  level: 1 | 2
  title: string
  text: string
}

export type Intervention = {
  id: string
  icon: string
  label: string
  title: string
  text: string
  tone: 'blue' | 'orange' | 'green' | 'purple'
  factor: number
  teachingNote?: string
}

export type CycleEvent = {
  id: string
  title: string
  text: string
  options: {
    id: string
    label: string
    text: string
    pressureFactor: number
    teachingNote: string
  }[]
}

export type DiagnosticCheck = {
  question: string
  options: { id: string; label: string }[]
  correctId: string
}

export type Mission = {
  id: number
  caseCode: string
  shortName: string
  openingSyndrome: string
  region: string
  location: string
  mapPosition: { x: number; y: number }
  initialCases: number
  maxCases: number
  maxDays: number
  investigationGrowth: number
  preventionGrowth: number
  containmentGrowth: number
  brief: string
  initialData: { label: string; value: string }[]
  disease: string
  diagnoses: string[]
  diagnosticCheck: DiagnosticCheck
  clues: Record<Role, Clue[]>
  interventions: Intervention[]
  requiredInterventions: string[]
  cycleEvents: CycleEvent[]
  debrief: string
  learningPoints: string[]
  source: { label: string; url: string }
}

export const team: { role: Role; icon: string; specialty: string; name: string; action: string; tone: Intervention['tone'] }[] = [
  { role: 'emergencia', icon: '🩺', specialty: 'Medicina de emergência', name: 'Dra. Helena Rocha', action: 'Reavaliar casos-índice', tone: 'orange' },
  { role: 'infectologia', icon: '🧠', specialty: 'Infectologia', name: 'Dr. Rafael Nunes', action: 'Refinar hipóteses', tone: 'blue' },
  { role: 'epidemiologia', icon: '📈', specialty: 'Epidemiologia médica', name: 'Dra. Camila Torres', action: 'Reconstruir cadeia de exposição', tone: 'green' },
  { role: 'laboratorio', icon: '🔬', specialty: 'Patologia clínica', name: 'Dr. André Lima', action: 'Interpretar exames', tone: 'purple' },
]

export const missions: Mission[] = [
  {
    id: 1,
    caseCode: 'Dossiê 01',
    shortName: 'Porto de Mahan',
    openingSyndrome: 'Síndrome diarreica aguda em agrupamento',
    region: 'Faixa costeira do Sul da Ásia',
    location: 'Distrito portuário de Mahan',
    mapPosition: { x: 71, y: 51 },
    initialCases: 17,
    maxCases: 500,
    maxDays: 7,
    investigationGrowth: 1.62,
    preventionGrowth: 1.29,
    containmentGrowth: 1.16,
    brief: 'Após chuvas intensas, a unidade de pronto atendimento notificou adultos e crianças com início abrupto de diarreia e vômitos. Há uma fonte de água coletiva no bairro, mas os primeiros relatos ainda são incompletos.',
    initialData: [
      { label: 'Janela de início', value: '12–48 h' },
      { label: 'Óbitos notificados', value: '0' },
      { label: 'Evento recente', value: 'Alagamento' },
    ],
    disease: 'Cólera',
    diagnoses: ['Cólera', 'Gastroenterite por norovírus', 'Shigelose', 'Febre tifoide', 'Leptospirose'],
    diagnosticCheck: {
      question: 'Qual dado tem maior peso para diferenciar as hipóteses deste dossiê?',
      options: [
        { id: 'a', label: 'Diarreia aquosa profusa com desidratação rapidamente progressiva em vários casos.' },
        { id: 'b', label: 'Febre alta sustentada por mais de sete dias.' },
        { id: 'c', label: 'Icterícia e insuficiência renal após exposição à lama.' },
        { id: 'd', label: 'Diarreia com sangue e tenesmo predominantes.' },
      ],
      correctId: 'a',
    },
    clues: {
      emergencia: [
        { id: 'm1-em1', role: 'emergencia', category: 'Clínica', level: 1, title: 'Avaliação de gravidade', text: 'Seis pacientes apresentam diarreia aquosa de grande volume, taquicardia, hipotensão postural e mucosas secas. Febre é ausente ou baixa.' },
        { id: 'm1-em2', role: 'emergencia', category: 'Clínica', level: 2, title: 'Padrão sindrômico', text: 'Não predominam dor abdominal intensa, tenesmo ou fezes visivelmente sanguinolentas. O risco imediato é hipovolemia.' },
      ],
      infectologia: [
        { id: 'm1-in1', role: 'infectologia', category: 'Vigilância', level: 1, title: 'Definição operacional', text: 'A curva de casos cresce em horas, concentrada em domicílios de três quarteirões contíguos.' },
        { id: 'm1-in2', role: 'infectologia', category: 'Vigilância', level: 2, title: 'Hipóteses em disputa', text: 'O padrão favorece uma exposição comum. Doenças invasivas com disenteria e febre sustentada explicam menos bem o conjunto inicial.' },
      ],
      epidemiologia: [
        { id: 'm1-ep1', role: 'epidemiologia', category: 'Exposição', level: 1, title: 'Entrevista de exposição', text: '14 dos 17 casos usaram água de uma torneira comunitária após interrupção do abastecimento regular.' },
        { id: 'm1-ep2', role: 'epidemiologia', category: 'Exposição', level: 2, title: 'Inspeção ambiental', text: 'A tubulação provisória passa próxima a uma área alagada; não há cloração documentada desde a enchente.' },
      ],
      laboratorio: [
        { id: 'm1-la1', role: 'laboratorio', category: 'Laboratório', level: 1, title: 'Triagem microbiológica', text: 'A amostra de fezes não mostra padrão inflamatório marcante. O laboratório recomenda coleta apropriada para cultura e confirmação.' },
        { id: 'm1-la2', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Resultado preliminar', text: 'Cultura em andamento sugere bacilo curvo, oxidase-positivo, compatível com um agente entérico não invasivo.' },
      ],
    },
    interventions: [
      { id: 'water', icon: '💧', label: 'WASH', title: 'Interromper fonte insegura', text: 'Disponibilizar água tratada, monitorar qualidade e bloquear a distribuição na fonte suspeita.', tone: 'blue', factor: 0.62 },
      { id: 'rehydration', icon: '➕', label: 'Assistência', title: 'Organizar reidratação', text: 'Estruturar pontos de reidratação oral e encaminhar rapidamente pacientes com desidratação grave.', tone: 'orange', factor: 0.68 },
      { id: 'surveillance', icon: '📋', label: 'Vigilância', title: 'Notificar e buscar casos', text: 'Aplicar definição de caso, mapear domicílios e coletar amostras para confirmação.', tone: 'green', factor: 0.82, teachingNote: 'Medida complementar: torna a resposta mais precisa ao mostrar onde o risco persiste e orientar o acompanhamento.' },
      { id: 'communication', icon: '📣', label: 'Comunicação', title: 'Orientar práticas protetoras', text: 'Comunicar água segura, higiene e procura precoce de atendimento.', tone: 'purple', factor: 0.88, teachingNote: 'Medida complementar: ajuda a converter a resposta técnica em práticas que a comunidade consegue adotar.' },
    ],
    requiredInterventions: ['water', 'rehydration'],
    cycleEvents: [
      { id: 'm1-water-access', title: 'Abastecimento alternativo sob pressão', text: 'O ponto de distribuição provisório terá capacidade limitada no próximo ciclo. Escolha onde concentrar a coordenação inicial.', options: [{ id: 'm1-water-priority', label: 'Priorizar água segura', text: 'A equipe concentra a distribuição em áreas com maior exposição relatada.', pressureFactor: 1.03, teachingNote: 'Reduz a pressão ao agir mais perto da fonte de exposição, mas exige coordenação territorial.' }, { id: 'm1-care-priority', label: 'Priorizar fluxo assistencial', text: 'A equipe amplia primeiro a organização do atendimento para absorver a procura.', pressureFactor: 1.07, teachingNote: 'Protege a capacidade de cuidado, mas deixa a exposição comunitária mais tempo sem resposta direta.' }] },
      { id: 'm1-report-delay', title: 'Notificações chegam com atraso', text: 'Parte dos atendimentos ainda não entrou no consolidado do território. Escolha como a equipe reduz a incerteza inicial.', options: [{ id: 'm1-map', label: 'Mapear notificações pendentes', text: 'A equipe reconcilia registros e localiza lacunas no território.', pressureFactor: 1.03, teachingNote: 'Melhora a leitura do foco e ajuda a orientar a resposta seguinte.' }, { id: 'm1-message', label: 'Reforçar orientação pública', text: 'A equipe antecipa uma comunicação simples enquanto os registros são revisados.', pressureFactor: 1.06, teachingNote: 'Pode reduzir comportamentos de risco, mas não substitui saber onde os casos estão.' }] },
    ],
    debrief: 'O caso descreve cólera: diarreia aquosa aguda, desidratação rápida e vínculo com água potencialmente contaminada. A resposta combina reidratação imediata, vigilância e medidas de água, saneamento e higiene.',
    learningPoints: ['A apresentação pode evoluir rapidamente por perda de volume.', 'Água segura, saneamento e higiene reduzem transmissão.', 'A confirmação laboratorial orienta a vigilância, mas não deve atrasar suporte clínico e resposta inicial.'],
    source: { label: 'OMS — Cólera', url: 'https://www.who.int/news-room/fact-sheets/detail/cholera' },
  },
  {
    id: 2,
    caseCode: 'Dossiê 02',
    shortName: 'Distrito Alvorada',
    openingSyndrome: 'Síndrome febril aguda em área urbana',
    region: 'América do Sul',
    location: 'Distrito urbano Alvorada',
    mapPosition: { x: 31, y: 61 },
    initialCases: 26,
    maxCases: 760,
    maxDays: 7,
    investigationGrowth: 1.55,
    preventionGrowth: 1.27,
    containmentGrowth: 1.14,
    brief: 'Prontos atendimentos de um mesmo distrito registram aumento de febre aguda com cefaleia e mialgia. É período quente e chuvoso; ainda não se sabe se há uma única causa.',
    initialData: [
      { label: 'Mediana de idade', value: '24 anos' },
      { label: 'Início dos sintomas', value: '4–7 dias' },
      { label: 'Contexto', value: 'Chuvas recorrentes' },
    ],
    disease: 'Dengue',
    diagnoses: ['Dengue', 'Chikungunya', 'Zika', 'Leptospirose', 'Influenza'],
    diagnosticCheck: {
      question: 'Qual conjunto de dados tem maior valor discriminativo entre os diferenciais listados?',
      options: [
        { id: 'a', label: 'Febre alta, dor retro-orbitária, mialgia, exantema e exposição a Aedes.' },
        { id: 'b', label: 'Artralgia incapacitante como manifestação predominante por meses.' },
        { id: 'c', label: 'Conjuntivite não purulenta e prurido como queixa central em todos os casos.' },
        { id: 'd', label: 'Tosse produtiva e infiltrado lobar ao exame de imagem.' },
      ],
      correctId: 'a',
    },
    clues: {
      emergencia: [
        { id: 'm2-em1', role: 'emergencia', category: 'Clínica', level: 1, title: 'Primeira avaliação', text: 'Febre alta, cefaleia, dor retro-orbitária, mialgia e náusea são frequentes. Parte dos pacientes apresenta exantema.' },
        { id: 'm2-em2', role: 'emergencia', category: 'Clínica', level: 2, title: 'Estratificação de risco', text: 'Dois pacientes relatam dor abdominal intensa e vômitos persistentes após queda da febre; demandam reavaliação imediata.' },
      ],
      infectologia: [
        { id: 'm2-in1', role: 'infectologia', category: 'Vigilância', level: 1, title: 'Diferenciais arbovirais', text: 'O quadro é compatível com arbovirose, mas sintomas isolados não diferenciam de modo confiável dengue, chikungunya e Zika.' },
        { id: 'm2-in2', role: 'infectologia', category: 'Vigilância', level: 2, title: 'Momento clínico', text: 'O intervalo desde o início permite considerar métodos de detecção direta conforme capacidade e protocolo laboratorial local.' },
      ],
      epidemiologia: [
        { id: 'm2-ep1', role: 'epidemiologia', category: 'Exposição', level: 1, title: 'Mapa territorial', text: 'Os casos se concentram em áreas com armazenamento intermitente de água e numerosos recipientes descobertos.' },
        { id: 'm2-ep2', role: 'epidemiologia', category: 'Exposição', level: 2, title: 'Busca vetorial', text: 'A inspeção identifica alta presença de criadouros domésticos. Não há elo de exposição alimentar comum entre os casos.' },
      ],
      laboratorio: [
        { id: 'm2-la1', role: 'laboratorio', category: 'Laboratório', level: 1, title: 'Hemograma inicial', text: 'Há leucopenia em parte dos casos e plaquetas em tendência de queda; os resultados precisam ser interpretados no contexto clínico.' },
        { id: 'm2-la2', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Teste direcionado', text: 'A detecção direta para arbovírus na fase inicial sustenta infecção por vírus transmitido por Aedes.' },
      ],
    },
    interventions: [
      { id: 'vector', icon: '🦟', label: 'Vetores', title: 'Eliminar criadouros', text: 'Remover e manejar recipientes com água, com ação territorial focalizada.', tone: 'green', factor: 0.62 },
      { id: 'triage', icon: '🩺', label: 'Assistência', title: 'Implantar triagem de risco', text: 'Reconhecer sinais de alarme, organizar observação e encaminhar casos graves.', tone: 'orange', factor: 0.7 },
      { id: 'surveillance', icon: '📈', label: 'Vigilância', title: 'Atualizar curva de casos', text: 'Monitorar tendência, distribuição espacial e capacidade dos serviços.', tone: 'blue', factor: 0.83, teachingNote: 'Medida complementar: permite redistribuir recursos e perceber mudanças na tendência antes que a rede fique sobrecarregada.' },
      { id: 'communication', icon: '📣', label: 'Comunicação', title: 'Mobilizar o território', text: 'Orientar eliminação de criadouros e procura rápida diante de sinais de alarme.', tone: 'purple', factor: 0.88, teachingNote: 'Medida complementar: amplia a adesão territorial, mas não substitui o manejo ambiental nem a triagem de risco.' },
    ],
    requiredInterventions: ['vector', 'triage'],
    cycleEvents: [
      { id: 'm2-rain', title: 'Chuva muda o mapa de risco', text: 'Moradores relatam novos recipientes expostos à água após a chuva. Escolha a primeira frente territorial.', options: [{ id: 'm2-block', label: 'Agir nos quarteirões prioritários', text: 'A equipe focaliza os relatos com maior concentração de recipientes expostos.', pressureFactor: 1.03, teachingNote: 'Foco territorial pode reduzir a pressão mais cedo onde o risco é maior.' }, { id: 'm2-broadcast', label: 'Mobilizar toda a região', text: 'A equipe inicia mensagem ampla de eliminação de criadouros.', pressureFactor: 1.07, teachingNote: 'Amplia alcance, mas a resposta tende a ser menos imediata nos pontos prioritários.' }] },
      { id: 'm2-triage-load', title: 'Unidade recebe mais procura', text: 'A procura por febre aumenta durante o próximo ciclo. Escolha como proteger a capacidade de resposta.', options: [{ id: 'm2-risk-flow', label: 'Organizar fila por risco', text: 'A equipe separa a avaliação inicial por sinais que exigem prioridade.', pressureFactor: 1.03, teachingNote: 'Organizar o fluxo torna a resposta mais segura quando a demanda aumenta.' }, { id: 'm2-general-flow', label: 'Ampliar orientação de chegada', text: 'A equipe reforça orientações gerais antes da entrada na unidade.', pressureFactor: 1.06, teachingNote: 'Ajuda a ordenar a procura, mas não substitui uma triagem estruturada.' }] },
    ],
    debrief: 'O caso é dengue. O diagnóstico exige integrar síndrome febril compatível, contexto de Aedes, vigilância e testes apropriados ao momento da doença. O cuidado inclui estratificação de risco, e o controle depende de vigilância e manejo contínuo de criadouros.',
    learningPoints: ['Arboviroses compartilham achados clínicos; o contexto e os exames orientam o diferencial.', 'Sinais de alarme podem surgir quando a febre diminui.', 'O controle vetorial depende de ação ambiental e participação comunitária continuadas.'],
    source: { label: 'OMS — Dengue', url: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue' },
  },
  {
    id: 3,
    caseCode: 'Dossiê 03',
    shortName: 'Campus Norte',
    openingSyndrome: 'Exantema febril em rede de contatos',
    region: 'Europa',
    location: 'Campus universitário Norte',
    mapPosition: { x: 52, y: 31 },
    initialCases: 12,
    maxCases: 680,
    maxDays: 6,
    investigationGrowth: 1.78,
    preventionGrowth: 1.3,
    containmentGrowth: 1.15,
    brief: 'Um serviço de saúde universitário identifica estudantes com febre, sintomas respiratórios e exantema. Os primeiros pacientes frequentaram eventos fechados em dias próximos.',
    initialData: [
      { label: 'Casos ligados', value: '12' },
      { label: 'Ambiente comum', value: 'Auditório' },
      { label: 'Cobertura vacinal', value: 'Heterogênea' },
    ],
    disease: 'Sarampo',
    diagnoses: ['Sarampo', 'Rubéola', 'Parvovirose B19', 'Escarlatina', 'Dengue'],
    diagnosticCheck: {
      question: 'Qual elemento aumenta mais a probabilidade da sua principal hipótese neste agrupamento?',
      options: [
        { id: 'a', label: 'Febre alta, tosse, coriza, conjuntivite e exantema após exposição em ambiente fechado.' },
        { id: 'b', label: 'Artralgia predominante com adenopatia occipital isolada.' },
        { id: 'c', label: 'Faringite intensa com exantema áspero e cultura positiva para estreptococo.' },
        { id: 'd', label: 'Eritema em “face esbofeteada” após quadro leve.' },
      ],
      correctId: 'a',
    },
    clues: {
      emergencia: [
        { id: 'm3-em1', role: 'emergencia', category: 'Clínica', level: 1, title: 'Sequência de sintomas', text: 'Os casos evoluem com febre alta, tosse, coriza e conjuntivite; o exantema surge após o pródromo.' },
        { id: 'm3-em2', role: 'emergencia', category: 'Clínica', level: 2, title: 'Exame dirigido', text: 'Em dois pacientes, observam-se pequenas lesões esbranquiçadas na mucosa oral antes do exantema disseminado.' },
      ],
      infectologia: [
        { id: 'm3-in1', role: 'infectologia', category: 'Vigilância', level: 1, title: 'Potencial de transmissão', text: 'A transmissão respiratória em ambientes compartilhados é compatível com crescimento rápido de contatos suscetíveis.' },
        { id: 'm3-in2', role: 'infectologia', category: 'Vigilância', level: 2, title: 'Prioridade clínica', text: 'A combinação de exantema e pródromo respiratório exige notificação e orientação para reduzir novas exposições enquanto se investiga.' },
      ],
      epidemiologia: [
        { id: 'm3-ep1', role: 'epidemiologia', category: 'Exposição', level: 1, title: 'Linha do tempo', text: 'Os primeiros casos participaram do mesmo evento em espaço fechado. Há contatos sem comprovação de vacinação atualizada.' },
        { id: 'm3-ep2', role: 'epidemiologia', category: 'Exposição', level: 2, title: 'Rede de suscetíveis', text: 'A busca de contatos identifica cadeias entre moradia estudantil, aulas e um ambulatório frequentado pelos casos-índice.' },
      ],
      laboratorio: [
        { id: 'm3-la1', role: 'laboratorio', category: 'Laboratório', level: 1, title: 'Amostras prioritárias', text: 'Foram coletadas amostras conforme fluxo de vigilância para investigação de vírus exantemático.' },
        { id: 'm3-la2', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Resultado de referência', text: 'O teste de referência detecta material compatível com vírus respiratório altamente transmissível do grupo do sarampo.' },
      ],
    },
    interventions: [
      { id: 'vaccination', icon: '💉', label: 'Imunização', title: 'Avaliar vacinação de contatos', text: 'Organizar atualização vacinal de elegíveis conforme protocolos locais e de vigilância.', tone: 'blue', factor: 0.62 },
      { id: 'contacts', icon: '📈', label: 'Vigilância', title: 'Rastrear contatos', text: 'Identificar exposições e acompanhar pessoas suscetíveis.', tone: 'green', factor: 0.7 },
      { id: 'precautions', icon: '🛡️', label: 'Proteção', title: 'Reduzir exposições', text: 'Orientar precauções e fluxos assistenciais para diminuir transmissão em serviços e ambientes coletivos.', tone: 'orange', factor: 0.82, teachingNote: 'Medida complementar: reduz oportunidades imediatas de exposição enquanto as ações essenciais são organizadas.' },
      { id: 'communication', icon: '📣', label: 'Comunicação', title: 'Comunicar risco com clareza', text: 'Combater desinformação e orientar procura de cuidado sem criar pânico.', tone: 'purple', factor: 0.88, teachingNote: 'Medida complementar: favorece decisões informadas e reduz ruído, mas precisa estar alinhada à vigilância.' },
    ],
    requiredInterventions: ['vaccination', 'contacts'],
    cycleEvents: [
      { id: 'm3-campus-event', title: 'Evento do campus mantém a circulação', text: 'Uma atividade coletiva prevista para o próximo ciclo amplia a necessidade de reconhecer contatos e comunicar medidas de proteção.', options: [{ id: 'm3-contact-priority', label: 'Priorizar contatos do evento', text: 'A equipe direciona a busca às pessoas com exposição mais recente.', pressureFactor: 1.03, teachingNote: 'A priorização ajuda a reduzir incerteza onde a exposição é mais relevante.' }, { id: 'm3-campus-message', label: 'Comunicar a todo o campus', text: 'A equipe emite orientação ampla antes de completar a busca direcionada.', pressureFactor: 1.06, teachingNote: 'A mensagem alcança mais pessoas, mas não substitui a investigação ativa de contatos.' }] },
      { id: 'm3-contact-list', title: 'Lista de contatos ainda está incompleta', text: 'A equipe recebe relatos de pessoas que não foram localizadas na primeira busca. Escolha o próximo movimento.', options: [{ id: 'm3-network', label: 'Reconstruir a rede', text: 'A equipe cruza horários, ambientes e vínculos de convivência.', pressureFactor: 1.03, teachingNote: 'Reconstruir a rede torna a vigilância mais dirigida.' }, { id: 'm3-open-channel', label: 'Abrir canal de autorrelato', text: 'A equipe convida possíveis expostos a se identificarem.', pressureFactor: 1.06, teachingNote: 'Pode ampliar o alcance, mas depende de adesão e não resolve toda a lacuna de contatos.' }] },
    ],
    debrief: 'O caso é sarampo. Febre, tosse, coriza, conjuntivite e exantema em uma rede de contatos suscetíveis sustentam a hipótese. A resposta exige vigilância ágil, redução de exposições e vacinação conforme orientações locais.',
    learningPoints: ['Exantema deve ser interpretado junto à cronologia do pródromo.', 'Doenças exantemáticas têm diferenciais clínicos relevantes.', 'Em doenças muito transmissíveis, a rede de contatos muda a urgência da resposta.'],
    source: { label: 'OMS — Sarampo', url: 'https://www.who.int/news-room/fact-sheets/detail/measles' },
  },
  {
    id: 4,
    caseCode: 'Dossiê 04',
    shortName: 'Pavilhão 7',
    openingSyndrome: 'Síndrome respiratória subaguda em adultos',
    region: 'África Austral',
    location: 'Distrito urbano Pavilhão 7',
    mapPosition: { x: 55, y: 64 },
    initialCases: 9,
    maxCases: 340,
    maxDays: 8,
    investigationGrowth: 1.33,
    preventionGrowth: 1.17,
    containmentGrowth: 1.1,
    brief: 'A atenção primária registra diversos adultos com tosse prolongada e perda ponderal. Os casos não começaram no mesmo dia, mas compartilham locais fechados e pouco ventilados.',
    initialData: [
      { label: 'Duração mediana', value: '5 semanas' },
      { label: 'Ambiente comum', value: 'Pouca ventilação' },
      { label: 'Curso', value: 'Progressivo' },
    ],
    disease: 'Tuberculose pulmonar',
    diagnoses: ['Tuberculose pulmonar', 'Pneumonia bacteriana comunitária', 'Histoplasmose', 'Influenza', 'Sarcoidose'],
    diagnosticCheck: {
      question: 'Qual combinação tem maior poder para separar uma síndrome respiratória subaguda dos outros diferenciais?',
      options: [
        { id: 'a', label: 'Tosse persistente, sintomas constitucionais, evolução por semanas e convivência em ambiente pouco ventilado.' },
        { id: 'b', label: 'Início súbito em 24 horas com febre alta e dor pleurítica isolada.' },
        { id: 'c', label: 'Artralgia migratória sem sintomas respiratórios.' },
        { id: 'd', label: 'Quadro autolimitado de dois dias após refeição coletiva.' },
      ],
      correctId: 'a',
    },
    clues: {
      emergencia: [
        { id: 'm4-em1', role: 'emergencia', category: 'Clínica', level: 1, title: 'História dirigida', text: 'Tosse persistente, fadiga, emagrecimento e febre baixa vespertina são recorrentes. Alguns relatam sudorese noturna.' },
        { id: 'm4-em2', role: 'emergencia', category: 'Clínica', level: 2, title: 'Padrão temporal', text: 'O quadro evolui há semanas, não como uma infecção respiratória aguda de início único; há pacientes com hemoptise discreta.' },
      ],
      infectologia: [
        { id: 'm4-in1', role: 'infectologia', category: 'Vigilância', level: 1, title: 'Risco de transmissão', text: 'A suspeita de doença pulmonar transmissível pelo ar exige reduzir exposições em locais fechados enquanto o diagnóstico é esclarecido.' },
        { id: 'm4-in2', role: 'infectologia', category: 'Vigilância', level: 2, title: 'Estratégia diagnóstica', text: 'A prioridade é identificar rapidamente casos com doença pulmonar ativa e organizar a avaliação de contatos conforme protocolo local.' },
      ],
      epidemiologia: [
        { id: 'm4-ep1', role: 'epidemiologia', category: 'Exposição', level: 1, title: 'Mapa de convivência', text: 'Há sobreposição entre trabalho, transporte coletivo e uma residência compartilhada mal ventilada.' },
        { id: 'm4-ep2', role: 'epidemiologia', category: 'Exposição', level: 2, title: 'Busca de sintomáticos', text: 'A busca ativa encontra mais pessoas com tosse prolongada na mesma rede, sem uma exposição alimentar ou evento pontual comum.' },
      ],
      laboratorio: [
        { id: 'm4-la1', role: 'laboratorio', category: 'Laboratório', level: 1, title: 'Imagem inicial', text: 'O exame de imagem mostra alterações predominantes em lobos superiores em pacientes selecionados; o achado não confirma etiologia isoladamente.' },
        { id: 'm4-la2', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Teste molecular', text: 'Amostra respiratória apresenta resultado compatível com complexo Mycobacterium tuberculosis em teste molecular rápido.' },
      ],
    },
    interventions: [
      { id: 'testing', icon: '🧪', label: 'Diagnóstico', title: 'Ampliar avaliação e testes', text: 'Facilitar avaliação de sintomáticos e exames recomendados pelo protocolo local.', tone: 'blue', factor: 0.64 },
      { id: 'contacts', icon: '📈', label: 'Vigilância', title: 'Investigar contatos', text: 'Priorizar contatos expostos e organizar seguimento.', tone: 'green', factor: 0.72 },
      { id: 'ventilation', icon: '↗', label: 'Ambiente', title: 'Reduzir exposição em locais fechados', text: 'Melhorar ventilação e reduzir permanência em ambientes compartilhados pouco ventilados.', tone: 'orange', factor: 0.83, teachingNote: 'Medida complementar: reduz exposição no ambiente, mas não substitui a identificação oportuna de casos e contatos.' },
      { id: 'support', icon: '📣', label: 'Comunicação', title: 'Reduzir estigma e apoiar cuidado', text: 'Orientar procura de atendimento e vínculo com serviços de saúde.', tone: 'purple', factor: 0.9, teachingNote: 'Medida complementar: melhora acesso e continuidade do cuidado, contribuindo para uma resposta sustentável.' },
    ],
    requiredInterventions: ['testing', 'contacts'],
    cycleEvents: [
      { id: 'm4-ventilation', title: 'Ambientes compartilhados seguem ocupados', text: 'A manutenção de um espaço de convivência foi adiada. Escolha a ação operacional mais imediata.', options: [{ id: 'm4-redistribute', label: 'Redistribuir atividades', text: 'A equipe reduz a concentração de pessoas nos espaços mais fechados.', pressureFactor: 1.03, teachingNote: 'Reduzir exposição no ambiente complementa a identificação de casos.' }, { id: 'm4-advice', label: 'Reforçar orientação individual', text: 'A equipe comunica recomendações, mantendo a rotina do espaço.', pressureFactor: 1.06, teachingNote: 'A orientação ajuda, mas não altera sozinha o contexto compartilhado.' }] },
      { id: 'm4-delayed-care', title: 'Sintomáticos adiaram a procura por cuidado', text: 'Novos relatos indicam que parte das pessoas aguardou antes de buscar avaliação. Escolha como aproximar a resposta.', options: [{ id: 'm4-active-search', label: 'Fazer busca de sintomáticos', text: 'A equipe procura ativamente pessoas com relato compatível na rede afetada.', pressureFactor: 1.03, teachingNote: 'A busca ativa diminui a dependência de que a pessoa procure cuidado por conta própria.' }, { id: 'm4-general-message', label: 'Difundir mensagem de procura', text: 'A equipe reforça uma comunicação geral sobre onde buscar avaliação.', pressureFactor: 1.06, teachingNote: 'Reduz barreiras de informação, mas pode deixar casos sem identificação imediata.' }] },
    ],
    debrief: 'O caso é tuberculose pulmonar. O tempo de evolução, os sintomas constitucionais, o contexto de exposição e o teste molecular formam a base da hipótese. A resposta combina diagnóstico oportuno, investigação de contatos e redução de exposições, seguindo protocolos locais.',
    learningPoints: ['A cronologia é tão importante quanto um sintoma isolado no diferencial.', 'Tuberculose pulmonar ativa pode demandar medidas para reduzir exposição aérea.', 'A investigação de contatos é parte do cuidado e da vigilância.'],
    source: { label: 'OMS — Tuberculose', url: 'https://www.who.int/news-room/fact-sheets/detail/tuberculosis' },
  },
  {
    id: 5,
    caseCode: 'Dossiê 05',
    shortName: 'UTI Aurora',
    openingSyndrome: 'Agrupamento de culturas incomuns em unidade crítica',
    region: 'Mediterrâneo Oriental',
    location: 'UTI de hospital de alta complexidade',
    mapPosition: { x: 61, y: 43 },
    initialCases: 6,
    maxCases: 180,
    maxDays: 8,
    investigationGrowth: 1.4,
    preventionGrowth: 1.21,
    containmentGrowth: 1.09,
    brief: 'O laboratório alerta para isolados de levedura em pacientes internados na mesma unidade. Nem todos os pacientes têm sinais claros de infecção, e a identificação inicial é inconsistente.',
    initialData: [
      { label: 'Unidade afetada', value: 'UTI adulto' },
      { label: 'Dispositivos invasivos', value: 'Frequentes' },
      { label: 'Padrão', value: 'Persistente' },
    ],
    disease: 'Candida auris',
    diagnoses: ['Candida auris', 'Candida albicans', 'Staphylococcus aureus resistente à meticilina', 'Aspergilose invasiva', 'Clostridioides difficile'],
    diagnosticCheck: {
      question: 'Qual achado muda mais a resposta de controle de infecção neste agrupamento?',
      options: [
        { id: 'a', label: 'Levedura de identificação difícil, possível multirresistência, colonização e persistência ambiental em unidade crítica.' },
        { id: 'b', label: 'Diarreia associada a antibiótico com toxina detectada nas fezes.' },
        { id: 'c', label: 'Cavitação pulmonar em paciente neutropênico como achado dominante.' },
        { id: 'd', label: 'Celulite purulenta de início comunitário em atletas.' },
      ],
      correctId: 'a',
    },
    clues: {
      emergencia: [
        { id: 'm5-em1', role: 'emergencia', category: 'Clínica', level: 1, title: 'Revisão de prontuários', text: 'Os pacientes têm longa internação, dispositivos invasivos e múltiplas comorbidades. Os sinais clínicos não distinguem a espécie isolada.' },
        { id: 'm5-em2', role: 'emergencia', category: 'Clínica', level: 2, title: 'Colonização versus infecção', text: 'Há pacientes colonizados sem doença invasiva aparente, o que não elimina o risco de transmissão dentro da unidade.' },
      ],
      infectologia: [
        { id: 'm5-in1', role: 'infectologia', category: 'Vigilância', level: 1, title: 'Sinal de alerta hospitalar', text: 'O agrupamento em unidade crítica e a persistência de isolados demandam coordenação imediata entre controle de infecção e laboratório.' },
        { id: 'm5-in2', role: 'infectologia', category: 'Vigilância', level: 2, title: 'Risco operacional', text: 'Transferências entre setores sem comunicação do status podem ampliar a cadeia de transmissão e retardar precauções.' },
      ],
      epidemiologia: [
        { id: 'm5-ep1', role: 'epidemiologia', category: 'Exposição', level: 1, title: 'Linha de cuidado', text: 'Os casos passaram por leitos próximos e compartilharam equipamentos de monitorização e cuidado em diferentes turnos.' },
        { id: 'm5-ep2', role: 'epidemiologia', category: 'Exposição', level: 2, title: 'Busca de contatos', text: 'A triagem dirigida identifica colonização em pacientes expostos, inclusive em um paciente sem sintomas clínicos.' },
      ],
      laboratorio: [
        { id: 'm5-la1', role: 'laboratorio', category: 'Laboratório', level: 1, title: 'Identificação inconsistente', text: 'Métodos usuais produzem identificação incerta de uma levedura; o laboratório solicita confirmação por método especializado.' },
        { id: 'm5-la2', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Confirmação especializada', text: 'O método de referência confirma Candida auris, espécie associada a surtos em serviços de saúde e resistência a múltiplos antifúngicos.' },
      ],
    },
    interventions: [
      { id: 'screening', icon: '🧪', label: 'Triagem', title: 'Rastrear colonização', text: 'Realizar triagem de expostos conforme protocolo do serviço para orientar precauções.', tone: 'blue', factor: 0.64 },
      { id: 'cleaning', icon: '🧼', label: 'Ambiente', title: 'Reforçar desinfecção', text: 'Desinfetar superfícies de alto toque e equipamentos compartilhados com produto apropriado.', tone: 'green', factor: 0.71 },
      { id: 'precautions', icon: '🧤', label: 'Proteção', title: 'Aplicar precauções de contato', text: 'Reforçar higiene das mãos, equipamentos de proteção e fluxos na unidade.', tone: 'orange', factor: 0.82, teachingNote: 'Medida complementar: diminui oportunidades de transmissão no cuidado cotidiano, mas precisa acompanhar triagem e desinfecção.' },
      { id: 'handoff', icon: '📣', label: 'Coordenação', title: 'Comunicar transferências', text: 'Garantir comunicação do status entre setores e serviços envolvidos.', tone: 'purple', factor: 0.9, teachingNote: 'Medida complementar: evita quebra de informação entre setores e sustenta as precauções já iniciadas.' },
    ],
    requiredInterventions: ['screening', 'cleaning'],
    cycleEvents: [
      { id: 'm5-transfer', title: 'Transferência exige coordenação', text: 'Um paciente exposto precisa mudar de setor no próximo ciclo. Escolha como proteger a continuidade da informação.', options: [{ id: 'm5-handoff', label: 'Confirmar passagem de caso', text: 'A equipe registra e confirma o status antes da transferência.', pressureFactor: 1.03, teachingNote: 'A passagem estruturada reduz perda de informação entre equipes.' }, { id: 'm5-alert', label: 'Enviar alerta geral', text: 'A equipe avisa os setores, mas sem confirmação individual do fluxo.', pressureFactor: 1.06, teachingNote: 'O alerta amplia consciência, mas pode não garantir continuidade em cada transição.' }] },
      { id: 'm5-equipment', title: 'Equipamento compartilhado entra em uso', text: 'A unidade reorganiza equipamentos entre leitos. Escolha a primeira barreira de segurança.', options: [{ id: 'm5-dedicate', label: 'Priorizar equipamentos dedicados', text: 'A equipe separa equipamentos para o grupo de maior risco enquanto reorganiza o setor.', pressureFactor: 1.03, teachingNote: 'Reduzir compartilhamento torna a resposta ambiental mais consistente.' }, { id: 'm5-reminder', label: 'Reforçar lembretes de fluxo', text: 'A equipe reforça a rotina existente sem alterar a organização dos equipamentos.', pressureFactor: 1.06, teachingNote: 'Lembretes ajudam a adesão, mas não eliminam a complexidade do compartilhamento.' }] },
    ],
    debrief: 'O caso é Candida auris. A identificação pode exigir métodos especializados; colonização assintomática, persistência ambiental e transmissão em serviços de saúde são elementos importantes. A resposta envolve triagem, precauções e desinfecção ambiental orientadas pelo controle de infecção.',
    learningPoints: ['Colonização não é sinônimo de infecção, mas pode sustentar transmissão.', 'A identificação laboratorial correta muda a resposta de controle de infecção.', 'Medidas devem seguir o protocolo do serviço e a orientação de especialistas.'],
    source: { label: 'CDC — Candida auris', url: 'https://www.cdc.gov/candida-auris/about/index.html' },
  },
]
