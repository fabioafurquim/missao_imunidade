export type ChapterTwoDraft = {
  code: string
  title: string
  region: string
  theme: string
  mechanic: string
  storyHook: string
  skills: string[]
  reviewItems: string[]
  source: { label: string; url: string }
}

// Conteúdo editorial. Não é importado para `missions` e não pode ser iniciado
// até existir uma validação docente registrada na matriz de revisão.
export const chapterTwoDrafts: ChapterTwoDraft[] = [
  {
    code: 'RASCUNHO 09',
    title: 'Rota Dourada',
    region: 'América do Sul',
    theme: 'Febre amarela',
    mechanic: 'Mapa de cobertura e busca de pessoas não vacinadas',
    storyHook: 'Uma agente de saúde encontra famílias recém-chegadas em uma área onde os alertas de febre aumentaram depois de falhas na cobertura vacinal.',
    skills: ['Distinguir síndrome febril inicial de sinais de gravidade', 'Relacionar vigilância vetorial, confirmação e vacinação', 'Priorizar resposta sem transformar uma pista isolada em diagnóstico'],
    reviewItems: ['Sinais discriminativos e diferenciais', 'Redação das medidas de vacinação e controle vetorial', 'Coerência entre território, risco e cronologia'],
    source: { label: 'OMS — Febre amarela', url: 'https://www.who.int/news-room/fact-sheets/detail/yellow-fever' },
  },
  {
    code: 'RASCUNHO 10',
    title: 'Vila Horizonte',
    region: 'Contexto urbano',
    theme: 'Coqueluche',
    mechanic: 'Linha do tempo de tosse e rede de contatos vulneráveis',
    storyHook: 'Uma família procura orientação porque um bebê pequeno passou a ter crises de tosse após visitas de pessoas com sintomas respiratórios persistentes.',
    skills: ['Reconhecer duração e padrão de tosse como pistas', 'Diferenciar contato amplo de contato prioritário', 'Organizar proteção de grupos vulneráveis e comunicação'],
    reviewItems: ['Critérios de exposição e vulnerabilidade', 'Redação das mensagens sobre vacinação e procura de cuidado', 'Diferenciais respiratórios adequados ao semestre'],
    source: { label: 'OMS — Coqueluche', url: 'https://www.who.int/health-topics/pertussis' },
  },
  {
    code: 'RASCUNHO 11',
    title: 'Corredor Andino',
    region: 'América Latina',
    theme: 'Doença de Chagas',
    mechanic: 'Leitura de moradia, vetores e rotas de exposição',
    storyHook: 'Durante uma visita comunitária, a equipe encontra relatos de insetos noturnos em casas com frestas e uma pessoa com quadro recente ainda pouco específico.',
    skills: ['Separar exposição vetorial de confirmação diagnóstica', 'Reconhecer que a fase inicial pode ser pouco específica', 'Planejar vigilância, melhoria ambiental e cuidado de forma integrada'],
    reviewItems: ['Sinais característicos sem supervalorizar um único achado', 'Diferenciais e fluxos de confirmação', 'Linguagem segura sobre vetores, habitação e cuidado'],
    source: { label: 'OMS — Doença de Chagas', url: 'https://www.who.int/health-topics/chagas-disease' },
  },
]
