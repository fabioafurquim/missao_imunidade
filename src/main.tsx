import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import globeImage from './assets/globo-sudeste-asiatico-3d.png'
import './styles.css'

type Role = 'cientista' | 'medico' | 'campo' | 'comunicacao'
type Phase = 'investigation' | 'containment' | 'won' | 'lost'

type Clue = { id: string; category: 'Clínica' | 'Epidemiológica' | 'Laboratorial' | 'Prevenção'; title: string; text: string }
type Intervention = { id: string; icon: string; label: string; title: string; text: string; tone: string; factor: number }

const team: { role: Role; icon: string; title: string; name: string; action: string; tone: string }[] = [
  { role: 'cientista', icon: '⚗️', title: 'Cientista', name: 'Dra. Marina', action: 'Analisar amostras', tone: 'blue' },
  { role: 'medico', icon: '🩺', title: 'Médico', name: 'Dr. Caio', action: 'Avaliar pacientes', tone: 'orange' },
  { role: 'campo', icon: '🧭', title: 'Campo', name: 'Lia Santos', action: 'Investigar origem', tone: 'green' },
  { role: 'comunicacao', icon: '📣', title: 'Comunicação', name: 'Noah Lima', action: 'Orientar população', tone: 'purple' },
]

const clues: Record<Role, Clue> = {
  medico: { id: 'clinical', category: 'Clínica', title: 'Relatório clínico', text: 'A maioria apresenta diarreia aquosa intensa, vômitos e sinais de desidratação.' },
  campo: { id: 'field', category: 'Epidemiológica', title: 'Investigação de campo', text: '14 dos 18 pacientes consumiram água da mesma fonte antes do início dos sintomas.' },
  cientista: { id: 'lab', category: 'Laboratorial', title: 'Resultado laboratorial', text: 'A análise inicial indica alta probabilidade de um agente bacteriano.' },
  comunicacao: { id: 'prevention', category: 'Prevenção', title: 'Ação comunitária', text: 'A equipe divulgou orientações sobre água segura e higiene; a transmissão foi desacelerada.' },
}

const interventions: Intervention[] = [
  { id: 'water', icon: '💧', label: 'Saneamento', title: 'Garantir água segura', text: 'Distribuir água tratada e interromper a fonte contaminada.', tone: 'blue', factor: 0.62 },
  { id: 'care', icon: '➕', label: 'Assistência', title: 'Organizar atendimento', text: 'Ampliar reidratação oral e atendimento aos casos graves.', tone: 'orange', factor: 0.72 },
  { id: 'mobilize', icon: '📣', label: 'Comunicação', title: 'Mobilizar comunidade', text: 'Orientar higiene, água segura e busca precoce por cuidado.', tone: 'purple', factor: 0.82 },
  { id: 'monitor', icon: '⌁', label: 'Vigilância', title: 'Monitorar novos focos', text: 'Rastrear casos e priorizar áreas com maior risco.', tone: 'green', factor: 0.88 },
]

const diagnoses = ['Cólera', 'Dengue', 'Influenza', 'Sarampo', 'Tuberculose']

function App() {
  const [day, setDay] = useState(1)
  const [actions, setActions] = useState(3)
  const [cases, setCases] = useState(18)
  const [cluesFound, setCluesFound] = useState<Clue[]>([])
  const [interventionsDone, setInterventionsDone] = useState<Intervention[]>([])
  const [notice, setNotice] = useState<Clue | Intervention | null>(null)
  const [modal, setModal] = useState<'diagnosis' | 'endDay' | 'wrong' | 'win' | 'lost' | null>(null)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('')
  const [phase, setPhase] = useState<Phase>('investigation')

  const foundIds = useMemo(() => new Set(cluesFound.map((clue) => clue.id)), [cluesFound])
  const interventionIds = useMemo(() => new Set(interventionsDone.map((action) => action.id)), [interventionsDone])
  const alert = cases < 45 ? 'Moderado' : cases < 130 ? 'Alto' : 'Crítico'

  function investigate(role: Role) {
    const clue = clues[role]
    if (actions === 0 || foundIds.has(clue.id) || phase !== 'investigation') return
    setActions((current) => current - 1)
    setCluesFound((current) => [...current, clue])
    setNotice(clue)
  }

  function contain(intervention: Intervention) {
    if (actions === 0 || interventionIds.has(intervention.id) || phase !== 'containment') return
    const completed = [...interventionsDone, intervention]
    setActions((current) => current - 1)
    setInterventionsDone(completed)
    setCases((current) => Math.max(8, Math.round(current * intervention.factor)))
    setNotice(intervention)
    if (completed.length >= 3 && completed.some((item) => item.id === 'water') && completed.some((item) => item.id === 'care')) {
      setPhase('won')
      setModal('win')
    }
  }

  function endDay() {
    const preventionDone = foundIds.has('prevention')
    const multiplier = phase === 'investigation' ? (preventionDone ? 1.3 : 1.65) : 1.18
    const nextCases = Math.round(cases * multiplier)
    setCases(nextCases); setDay((current) => current + 1); setActions(3); setModal(null); setNotice(null)
    if (nextCases >= 500 || day >= 7) { setPhase('lost'); setModal('lost') }
  }

  function confirmDiagnosis() {
    if (!selectedDiagnosis) return
    if (selectedDiagnosis === 'Cólera') {
      setPhase('containment'); setActions(3)
      setNotice({ id: 'confirmed', category: 'Laboratorial', title: 'Cólera confirmada', text: 'Medidas específicas de contenção foram liberadas.' })
      setModal(null)
      return
    }
    const nextCases = Math.round(cases * 1.65)
    setCases(nextCases); setDay((current) => current + 1); setActions(3); setModal('wrong')
    if (nextCases >= 500 || day >= 7) { setPhase('lost'); setModal('lost') }
  }

  function restart() { setDay(1); setActions(3); setCases(18); setCluesFound([]); setInterventionsDone([]); setNotice(null); setModal(null); setSelectedDiagnosis(''); setPhase('investigation') }

  const inContainment = phase === 'containment'
  const objective = inContainment ? 'Interrompa a transmissão e proteja os pacientes.' : 'Identifique o agente antes que o surto se expanda.'

  return <main className="game-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">✦</span><span>MISSÃO <b>IMUNIDADE</b></span></div>
      <div className="mission-chip"><span>MISSÃO 01</span><strong>Surto no Sudeste Asiático</strong></div>
      <div className="phase-chip"><span>ETAPA</span><strong>{phase === 'investigation' ? 'Investigação' : inContainment ? 'Contenção' : phase === 'won' ? 'Concluída' : 'Encerrada'}</strong></div>
      <div className="day-chip"><span>Dia</span><strong>{day}</strong></div>
    </header>

    <section className="status-row">
      <div className="outbreak-summary"><span className="pulse-dot" /><div><small>SURTO ATIVO</small><strong>Sudeste Asiático</strong></div><span className="summary-divider" /><div><small>CASOS SUSPEITOS</small><strong>{cases}</strong></div><span className="summary-divider" /><div><small>NÍVEL DE ALERTA</small><strong className={`alert ${alert.toLowerCase()}`}>{alert}</strong></div></div>
      {phase === 'investigation' && <button className="diagnose-button" onClick={() => setModal('diagnosis')}>🧬 Propor diagnóstico</button>}
    </section>

    <section className="dashboard">
      <div className="map-panel panel">
        <div className="panel-heading"><div><span className="eyebrow">SITUAÇÃO GLOBAL</span><h1>Operação: <em>{inContainment ? 'conter a transmissão' : 'origem desconhecida'}</em></h1></div><span className="live">● AO VIVO</span></div>
        <div className="world-map" aria-label="Globo terrestre 3D centrado no Sudeste Asiático"><img src={globeImage} alt="Globo 3D com foco no Sudeste Asiático" /><div className={`focus-line ${inContainment ? 'contained' : ''}`} /><div className={`outbreak-pin ${inContainment ? 'contained' : ''}`}><span className="pin-ring" /><span className="pin-core" /><div className="pin-label"><b>{inContainment ? 'CONTENÇÃO ATIVA' : 'FOCO ATIVO'}</b><br />Sudeste Asiático</div></div><div className="map-scan" /><div className="map-legend"><span><i className={`legend-dot ${inContainment ? 'contained' : 'active'}`} /> {inContainment ? 'Contenção ativa' : 'Foco ativo'}</span><span><i className="legend-dot" /> Sem alertas</span></div></div>
        <div className="map-footer"><span>{objective}</span><button onClick={() => setModal('endDay')} disabled={phase === 'won' || phase === 'lost'}>Encerrar dia <span>→</span></button></div>
      </div>

      <aside className="intel-panel panel">
        <div className="intel-heading"><div><span className="eyebrow">CENTRAL DE INTELIGÊNCIA</span><h2>{inContainment ? 'Plano de resposta' : 'Evidências'}</h2></div><span>{inContainment ? `${interventionsDone.length}/4` : `${cluesFound.length}/4`}</span></div>
        <div className="evidence-list">
          {!inContainment && cluesFound.length === 0 && <div className="empty-state"><span>⌁</span><p>Nenhuma evidência coletada.<br />Acione sua equipe.</p></div>}
          {!inContainment && cluesFound.map((clue) => <article className="evidence-card" key={clue.id}><span>{clue.category}</span><h3>{clue.title}</h3><p>{clue.text}</p></article>)}
          {inContainment && <div className="response-status"><div className="agent-confirmed">✓ <span>AGENTE CONFIRMADO</span><b>Cólera</b></div><p>Para vencer, execute pelo menos três medidas, incluindo água segura e organização do atendimento.</p>{interventionsDone.map((item) => <article className="evidence-card response-card" key={item.id}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>}
        </div>
        <div className="hypothesis"><span>{inContainment ? 'OBJETIVO' : 'HIPÓTESE ATUAL'}</span><b>{inContainment ? `${interventionsDone.length}/3 medidas essenciais` : 'Agente desconhecido'}</b></div>
      </aside>
    </section>

    <section className="team-section">
      <div className="team-heading"><div><span className="eyebrow">{inContainment ? 'PROTOCOLO DE CONTENÇÃO' : 'SUA EQUIPE'}</span><h2>{inContainment ? 'Aplique medidas de contenção' : 'Escolha a próxima investigação'}</h2></div><div className="action-counter"><b>{actions}</b> ações disponíveis hoje</div></div>
      {phase === 'investigation' && <div className="team-grid">{team.map((member) => { const isUsed = foundIds.has(clues[member.role].id); return <article className={`member-card ${member.tone} ${isUsed ? 'used' : ''}`} key={member.role}><div className="member-icon">{member.icon}</div><div className="member-info"><span>{member.title}</span><h3>{member.name}</h3></div><button onClick={() => investigate(member.role)} disabled={isUsed || actions === 0}>{isUsed ? 'Ação concluída' : member.action}<span>→</span></button></article> })}</div>}
      {inContainment && <div className="team-grid containment-grid">{interventions.map((item) => { const isUsed = interventionIds.has(item.id); return <article className={`member-card ${item.tone} ${isUsed ? 'used' : ''}`} key={item.id}><div className="member-icon">{item.icon}</div><div className="member-info"><span>{item.label}</span><h3>{item.title}</h3></div><button onClick={() => contain(item)} disabled={isUsed || actions === 0}>{isUsed ? 'Medida aplicada' : 'Aplicar medida'}<span>→</span></button></article> })}</div>}
      {(phase === 'won' || phase === 'lost') && <div className="finished-actions"><p>{phase === 'won' ? 'Missão concluída. Você pode iniciar uma nova simulação.' : 'A situação ultrapassou a capacidade de resposta desta missão.'}</p><button className="primary" onClick={restart}>Reiniciar missão</button></div>}
    </section>

    {notice && <div className="toast"><div className="toast-icon">✓</div><div><span>{'category' in notice ? `${notice.category.toUpperCase()} DESBLOQUEADA` : `${notice.label.toUpperCase()} APLICADA`}</span><b>{notice.title}</b><p>{notice.text}</p></div><button aria-label="Fechar" onClick={() => setNotice(null)}>×</button></div>}

    {modal && <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true">
      {modal === 'diagnosis' && <><span className="modal-kicker">FORMULE UMA HIPÓTESE</span><h2>Qual doença explica o surto?</h2><p>Diagnosticar cedo rende mais pontos, mas uma hipótese incorreta custa um dia de investigação.</p><div className="diagnoses">{diagnoses.map((diagnosis) => <button className={selectedDiagnosis === diagnosis ? 'selected' : ''} onClick={() => setSelectedDiagnosis(diagnosis)} key={diagnosis}>{diagnosis}</button>)}</div><div className="modal-actions"><button className="secondary" onClick={() => setModal(null)}>Voltar</button><button className="primary" disabled={!selectedDiagnosis} onClick={confirmDiagnosis}>Confirmar diagnóstico</button></div></>}
      {modal === 'endDay' && <><span className="modal-kicker">FIM DO DIA {day}</span><h2>Encerrar as atividades?</h2><p>O surto continuará evoluindo durante a noite. Você pode usar as ações restantes ou avançar agora.</p><div className="projection"><span>Casos estimados amanhã</span><b>{Math.round(cases * (phase === 'investigation' ? (foundIds.has('prevention') ? 1.3 : 1.65) : 1.18))}</b></div><div className="modal-actions"><button className="secondary" onClick={() => setModal(null)}>Continuar na missão</button><button className="primary" onClick={endDay}>Encerrar dia</button></div></>}
      {modal === 'wrong' && <><span className="modal-kicker danger-text">HIPÓTESE NÃO CONFIRMADA</span><h2>A investigação precisa continuar.</h2><p>A hipótese selecionada não é compatível com as evidências. Um dia se passou enquanto o surto evoluía.</p><div className="modal-actions single"><button className="primary" onClick={() => { setModal(null); setSelectedDiagnosis('') }}>Voltar à missão</button></div></>}
      {modal === 'win' && <><div className="trophy">🏆</div><span className="modal-kicker success-text">SURTO CONTIDO</span><h2>Missão concluída!</h2><p>Você identificou a cólera e aplicou as medidas essenciais para conter a transmissão e reduzir os danos do surto.</p><div className="score"><span>SCORE FINAL</span><b>{Math.max(2200, 6200 - (day - 1) * 500)} pts</b></div><div className="modal-actions"><button className="secondary" onClick={() => setModal(null)}>Ver cenário</button><button className="primary" onClick={restart}>Jogar novamente</button></div></>}
      {modal === 'lost' && <><span className="modal-kicker danger-text">ALERTA MÁXIMO</span><h2>O surto saiu de controle.</h2><p>A resposta não foi suficiente antes que o número de casos atingisse um nível crítico. Reveja as pistas, priorize o diagnóstico e tente novamente.</p><div className="modal-actions single"><button className="primary" onClick={restart}>Tentar novamente</button></div></>}
    </section></div>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
