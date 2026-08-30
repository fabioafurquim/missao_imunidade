import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import worldMapImage from './assets/mapa-mundi-interativo-3d.png'
import { missions, team, type Clue, type Intervention, type Mission, type Role } from './data/missions'
import './styles.css'

type Phase = 'investigation' | 'containment' | 'won' | 'lost'
type Notice = Clue | Intervention
type Modal = 'diagnosis' | 'endDay' | 'wrong' | 'win' | 'lost' | 'briefing' | null
type Student = { name: string; semester: string; focus: string }

const focusLabels: Record<string, string> = {
  clinica: 'raciocínio clínico e diferenciais',
  microbiologia: 'microbiologia e interpretação de exames',
  epidemiologia: 'epidemiologia e investigação de surtos',
  saudeColetiva: 'vigilância e resposta em saúde coletiva',
}

function App() {
  const [student, setStudent] = useState<Student | null>(() => {
    try { return JSON.parse(window.localStorage.getItem('missao-imunidade-estudante') || 'null') } catch { return null }
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [tutorialSeen, setTutorialSeen] = useState(() => window.localStorage.getItem('missao-imunidade-tutorial-v1') === 'true')
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [missionId, setMissionId] = useState<number | null>(null)
  const [completed, setCompleted] = useState<number[]>([])
  const [testMode, setTestMode] = useState(false)
  const [day, setDay] = useState(1)
  const [actions, setActions] = useState(3)
  const [cases, setCases] = useState(0)
  const [cluesFound, setCluesFound] = useState<Clue[]>([])
  const [interventionsDone, setInterventionsDone] = useState<Intervention[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('')
  const [selectedRationale, setSelectedRationale] = useState('')
  const [diagnosticError, setDiagnosticError] = useState('')
  const [phase, setPhase] = useState<Phase>('investigation')

  useEffect(() => {
    if (!student) return
    window.localStorage.setItem('missao-imunidade-estudante', JSON.stringify(student))
  }, [student])

  const selectedMission = missions.find((item) => item.id === missionId)
  const foundIds = useMemo(() => new Set(cluesFound.map((clue) => clue.id)), [cluesFound])
  const interventionIds = useMemo(() => new Set(interventionsDone.map((item) => item.id)), [interventionsDone])

  function saveProfile(profile: Student) { setStudent(profile); setEditingProfile(false) }
  function dismissTutorial() { window.localStorage.setItem('missao-imunidade-tutorial-v1', 'true'); setTutorialSeen(true); setTutorialOpen(false) }
  function startMission(nextMission: Mission) {
    setMissionId(nextMission.id); setDay(1); setActions(3); setCases(nextMission.initialCases)
    setCluesFound([]); setInterventionsDone([]); setNotice(null); setModal('briefing'); setSelectedDiagnosis(''); setSelectedRationale(''); setDiagnosticError(''); setPhase('investigation')
  }
  function returnToCampaign() { setMissionId(null); setModal(null); setNotice(null) }
  function resetMission() { if (selectedMission) startMission(selectedMission) }

  if (!student || editingProfile) return <ProfileSetup initial={student || undefined} onSave={saveProfile} />
  if (!selectedMission) return <Campaign student={student} completed={completed} testMode={testMode} showTutorial={!tutorialSeen || tutorialOpen} onDismissTutorial={dismissTutorial} onShowTutorial={() => setTutorialOpen(true)} onEditProfile={() => setEditingProfile(true)} onToggleTest={() => setTestMode((current) => !current)} onStart={startMission} />

  const mission: Mission = selectedMission
  const allClues = Object.values(mission.clues).flat()
  const alert = cases < mission.initialCases * 2.5 ? 'Moderado' : cases < mission.initialCases * 7 ? 'Alto' : 'Crítico'
  const inContainment = phase === 'containment'
  const isFinished = phase === 'won' || phase === 'lost'
  const requiredComplete = mission.requiredInterventions.every((id) => interventionIds.has(id))
  const evidenceTarget = allClues.length
  const objective = inContainment ? 'Coordene medidas proporcionais ao agente confirmado e proteja a rede de pacientes.' : 'Construa uma hipótese a partir de clínica, tempo, exposição e exames.'

  function investigate(role: Role) {
    const clue = mission.clues[role].find((item) => !foundIds.has(item.id))
    if (!clue || actions === 0 || phase !== 'investigation') return
    setActions((current) => current - 1)
    setCluesFound((current) => [...current, clue])
    setNotice(clue)
  }

  function contain(intervention: Intervention) {
    if (actions === 0 || interventionIds.has(intervention.id) || !inContainment) return
    const next = [...interventionsDone, intervention]
    setActions((current) => current - 1); setInterventionsDone(next); setCases((current) => Math.max(1, Math.round(current * intervention.factor))); setNotice(intervention)
    const hasEssentials = mission.requiredInterventions.every((id) => next.some((item) => item.id === id))
    if (hasEssentials && next.length >= 3) { setPhase('won'); setCompleted((current) => current.includes(mission.id) ? current : [...current, mission.id]); setModal('win') }
  }

  function endDay() {
    const multiplier = phase === 'investigation' ? mission.investigationGrowth : mission.containmentGrowth
    const nextCases = Math.round(cases * multiplier)
    setCases(nextCases); setDay((current) => current + 1); setActions(3); setModal(null); setNotice(null)
    if (nextCases >= mission.maxCases || day >= mission.maxDays) { setPhase('lost'); setModal('lost') }
  }

  function confirmDiagnosis() {
    if (!selectedDiagnosis || !selectedRationale) return
    if (selectedDiagnosis === mission.disease && selectedRationale === mission.diagnosticCheck.correctId) {
      setPhase('containment'); setActions(3); setNotice({ id: 'confirmed', role: 'laboratorio', category: 'Laboratório', level: 2, title: 'Hipótese confirmada', text: 'O agente foi confirmado. A equipe pode iniciar a resposta específica.' }); setModal(null)
      return
    }
    const diagnosisIsCorrect = selectedDiagnosis === mission.disease
    setDiagnosticError(diagnosisIsCorrect ? 'A hipótese foi nomeada corretamente, mas o achado selecionado não é o mais discriminativo. Revise a relação entre evidência e conclusão.' : 'A hipótese selecionada não explica melhor o conjunto de dados disponíveis. Revise cronologia, padrão clínico, exposição e laboratório.')
    const nextCases = Math.round(cases * mission.investigationGrowth)
    setCases(nextCases); setDay((current) => current + 1); setActions(3); setModal('wrong')
    if (nextCases >= mission.maxCases || day >= mission.maxDays) { setPhase('lost'); setModal('lost') }
  }

  return <main className="game-shell">
    <header className="topbar">
      <button className="brand brand-button" onClick={returnToCampaign}><span className="brand-mark">✦</span><span>MISSÃO <b>IMUNIDADE</b></span></button>
      <div className="mission-chip"><span>{mission.caseCode.toUpperCase()}</span><strong>{mission.shortName}</strong></div>
      <div className="phase-chip"><span>ETAPA</span><strong>{phase === 'investigation' ? 'Investigação' : inContainment ? 'Resposta' : phase === 'won' ? 'Concluída' : 'Encerrada'}</strong></div>
      <div className="day-chip"><span>Dia</span><strong>{day}</strong></div>
    </header>

    <section className="status-row">
      <div className="outbreak-summary"><span className="pulse-dot" /><div><small>CASO EM INVESTIGAÇÃO</small><strong>{mission.region}</strong></div><span className="summary-divider" /><div><small>CASOS SOB ANÁLISE</small><strong>{cases}</strong></div><span className="summary-divider" /><div><small>NÍVEL DE ALERTA</small><strong className={`alert ${alert.toLowerCase()}`}>{alert}</strong></div></div>
      {phase === 'investigation' && <button className="diagnose-button" disabled={cluesFound.length < 3} onClick={() => setModal('diagnosis')}>🧬 Defender hipótese <small>{cluesFound.length}/3 evidências</small></button>}
    </section>

    <section className="dashboard">
      <div className="map-panel panel">
        <div className="panel-heading"><div><span className="eyebrow">{mission.caseCode.toUpperCase()} · AGENTE NÃO REVELADO</span><h1>Operação: <em>{inContainment ? 'resposta direcionada' : 'caso em investigação'}</em></h1></div><span className="live">● EM ATUALIZAÇÃO</span></div>
        <div className="world-map" aria-label={`Mapa-múndi ilustrativo com foco em ${mission.region}`}><img src={worldMapImage} alt="Mapa-múndi ilustrativo" /><div className={`focus-line ${inContainment ? 'contained' : ''}`} style={{ left: `${mission.mapPosition.x}%`, top: `${mission.mapPosition.y}%` }} /><div className={`outbreak-pin ${inContainment ? 'contained' : ''}`} style={{ left: `${mission.mapPosition.x}%`, top: `${mission.mapPosition.y}%` }}><span className="pin-ring" /><span className="pin-core" /><div className="pin-label"><b>{inContainment ? 'RESPOSTA ATIVA' : 'FOCO EM ANÁLISE'}</b><br />{mission.location}</div></div><div className="map-scan" /><div className="map-legend"><span><i className={`legend-dot ${inContainment ? 'contained' : 'active'}`} /> {inContainment ? 'Resposta ativa' : 'Dossiê aberto'}</span><span><i className="legend-dot" /> {mission.caseCode}</span></div></div>
        <div className="map-footer"><span>{objective}</span><button onClick={() => setModal('endDay')} disabled={isFinished}>Encerrar dia <span>→</span></button></div>
      </div>

      <aside className="intel-panel panel">
        <div className="intel-heading"><div><span className="eyebrow">DOSSIÊ CLÍNICO-EPIDEMIOLÓGICO</span><h2>{inContainment ? 'Plano de resposta' : 'Evidências'}</h2></div><span>{inContainment ? `${interventionsDone.length}/4` : `${cluesFound.length}/${evidenceTarget}`}</span></div>
        <div className="evidence-list">
          {!inContainment && cluesFound.length === 0 && <div className="empty-state"><span>⌁</span><p>O dossiê contém dados iniciais.<br />Acione um médico para aprofundar a investigação.</p></div>}
          {!inContainment && cluesFound.map((clue) => <article className="evidence-card" key={clue.id}><span>{clue.category} · etapa {clue.level}</span><h3>{clue.title}</h3><p>{clue.text}</p></article>)}
          {inContainment && <div className="response-status"><div className="agent-confirmed">✓ <span>AGENTE CONFIRMADO</span><b>{mission.disease}</b></div><p>Para concluir, aplique três medidas, incluindo as duas essenciais para este cenário.</p>{interventionsDone.map((item) => <article className="evidence-card response-card" key={item.id}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>}
        </div>
        <div className="hypothesis"><span>{inContainment ? 'OBJETIVO' : 'MOMENTO DIAGNÓSTICO'}</span><b>{inContainment ? (requiredComplete ? 'Medidas essenciais aplicadas' : 'Medidas essenciais pendentes') : cluesFound.length >= 6 ? 'Dossiê robusto' : cluesFound.length >= 3 ? 'Hipótese pode ser defendida' : 'Colete ao menos 3 evidências'}</b></div>
      </aside>
    </section>

    {phase === 'investigation' && <section className="case-file"><span className="eyebrow">DADOS DISPONÍVEIS AO PLANTÃO</span><h2>{mission.openingSyndrome}</h2><p>{mission.brief}</p><div>{mission.initialData.map((item) => <span key={item.label}>{item.label}<b>{item.value}</b></span>)}</div></section>}

    <section className="team-section">
      <div className="team-heading"><div><span className="eyebrow">{inContainment ? 'PROTOCOLO DE RESPOSTA' : 'EQUIPE MÉDICA'}</span><h2>{inContainment ? 'Coordene as medidas prioritárias' : 'Defina o próximo eixo de investigação'}</h2></div><div className="action-counter"><b>{actions}</b> ações disponíveis hoje</div></div>
      {phase === 'investigation' && <div className="team-grid">{team.map((member) => { const roleClues = mission.clues[member.role]; const done = roleClues.filter((clue) => foundIds.has(clue.id)).length; const next = roleClues.find((clue) => !foundIds.has(clue.id)); return <article className={`member-card ${member.tone} ${done === roleClues.length ? 'used' : ''}`} key={member.role}><div className="member-icon">{member.icon}</div><div className="member-info"><span>{member.specialty}</span><h3>{member.name}</h3><p>{next ? next.title : 'Eixo concluído'}</p></div><button onClick={() => investigate(member.role)} disabled={!next || actions === 0}>{next ? `${member.action} · ${done + 1}/2` : 'Dados esgotados'}<span>→</span></button></article> })}</div>}
      {inContainment && <div className="team-grid containment-grid">{mission.interventions.map((item) => { const isUsed = interventionIds.has(item.id); const essential = mission.requiredInterventions.includes(item.id); return <article className={`member-card ${item.tone} ${isUsed ? 'used' : ''}`} key={item.id}><div className="member-icon">{item.icon}</div><div className="member-info"><span>{essential ? `${item.label} · essencial` : item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div><button onClick={() => contain(item)} disabled={isUsed || actions === 0}>{isUsed ? 'Medida aplicada' : 'Aplicar medida'}<span>→</span></button></article> })}</div>}
      {isFinished && <div className="finished-actions"><p>{phase === 'won' ? 'Caso concluído. Consulte o debriefing antes de seguir para o próximo dossiê.' : 'A situação ultrapassou o limite crítico deste caso. Revise o debriefing e tente novamente.'}</p><div><button className="secondary" onClick={() => setModal(phase === 'won' ? 'win' : 'lost')}>Ver debriefing</button><button className="primary" onClick={resetMission}>Reiniciar caso</button></div></div>}
    </section>

    {notice && <div className="toast"><div className="toast-icon">✓</div><div><span>{'category' in notice ? `${notice.category.toUpperCase()} · ETAPA ${notice.level}` : `${notice.label.toUpperCase()} APLICADA`}</span><b>{notice.title}</b><p>{notice.text}</p></div><button aria-label="Fechar" onClick={() => setNotice(null)}>×</button></div>}
    {modal && <ModalDialog modal={modal} mission={mission} student={student} day={day} cases={cases} cluesFound={cluesFound.length} selectedDiagnosis={selectedDiagnosis} selectedRationale={selectedRationale} diagnosticError={diagnosticError} onSelectDiagnosis={setSelectedDiagnosis} onSelectRationale={setSelectedRationale} onClose={() => setModal(null)} onConfirmDiagnosis={confirmDiagnosis} onEndDay={endDay} onRestart={resetMission} onCampaign={returnToCampaign} />}
  </main>
}

function ProfileSetup({ initial, onSave }: { initial?: Student; onSave: (student: Student) => void }) {
  const [name, setName] = useState(initial?.name || '')
  const [semester, setSemester] = useState(initial?.semester || '2')
  const [focus, setFocus] = useState(initial?.focus || 'clinica')
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const cleanName = name.trim(); if (cleanName.length < 2) { setError('Informe seu nome para personalizar a experiência.'); return } onSave({ name: cleanName, semester, focus }) }
  return <main className="profile-shell"><section className="profile-card"><div className="profile-mark">✦</div><span className="eyebrow">MISSÃO IMUNIDADE · AMBIENTE DE APRENDIZAGEM</span><h1>Antes do primeiro <em>plantão.</em></h1><p>Monte seu perfil de estudo. Ele adapta a linguagem dos briefings e destaca o eixo de raciocínio que você quer praticar.</p><form onSubmit={submit}><label>Como devemos chamar você?<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Seu nome" maxLength={60} /></label><div className="profile-row"><label>Semestre<select value={semester} onChange={(event) => setSemester(event.target.value)}>{Array.from({ length: 12 }, (_, index) => <option value={String(index + 1)} key={index + 1}>{index + 1}º semestre</option>)}</select></label><label>Eixo de estudo<select value={focus} onChange={(event) => setFocus(event.target.value)}><option value="clinica">Raciocínio clínico</option><option value="microbiologia">Microbiologia</option><option value="epidemiologia">Epidemiologia</option><option value="saudeColetiva">Saúde coletiva</option></select></label></div>{error && <p className="form-error">{error}</p>}<button className="primary" type="submit">Iniciar dossiês clínicos <span>→</span></button></form><small>Essas informações ficam somente neste navegador. Não há conta nem envio de dados nesta versão.</small></section></main>
}

function Campaign({ student, completed, testMode, showTutorial, onDismissTutorial, onShowTutorial, onEditProfile, onToggleTest, onStart }: { student: Student; completed: number[]; testMode: boolean; showTutorial: boolean; onDismissTutorial: () => void; onShowTutorial: () => void; onEditProfile: () => void; onToggleTest: () => void; onStart: (mission: Mission) => void }) {
  const firstName = student.name.split(' ')[0]
  const [mapMission, setMapMission] = useState(missions[0])
  return <main className="campaign-shell">
    <header className="campaign-header"><div className="brand"><span className="brand-mark">✦</span><span>MISSÃO <b>IMUNIDADE</b></span></div><div className="campaign-account"><button className="help-button" onClick={onShowTutorial}>Como jogar</button><button onClick={onEditProfile}>{firstName} · {student.semester}º semestre</button><button className={`test-toggle ${testMode ? 'active' : ''}`} onClick={onToggleTest}>{testMode ? 'Modo de teste ativo' : 'Liberar dossiês para teste'}</button></div></header>
    <section className="campaign-hero"><img src={worldMapImage} alt="Mapa-múndi com foco no dossiê selecionado" /><div className="campaign-map-focus" style={{ left: `${mapMission.mapPosition.x}%`, top: `${mapMission.mapPosition.y}%` }}><i /><span><b>{mapMission.location}</b>{mapMission.region}</span></div><div className="campaign-hero-copy"><span className="eyebrow">PLANTÃO DE INVESTIGAÇÃO · {student.semester}º SEMESTRE</span><h1>Olá, {firstName}.<br /><em>Decida com evidências.</em></h1><p>Em cada dossiê, há um diagnóstico ainda não confirmado. Você reúne dados, compara diferenciais e sustenta a conclusão. Foco atual: {focusLabels[student.focus]}.</p><div className="campaign-progress"><b>{completed.length}/5</b><span>dossiês concluídos</span></div></div></section>
    <section className="mission-select"><div className="campaign-title"><div><span className="eyebrow">CENTRAL DE CASOS</span><h2>Escolha o próximo dossiê</h2></div><p>Passe o cursor ou toque em um dossiê para localizar o caso no mapa. Os agentes só são revelados após uma defesa diagnóstica sustentada.</p></div><div className="mission-grid">{missions.map((mission) => { const unlocked = testMode || mission.id === 1 || completed.includes(mission.id - 1); const done = completed.includes(mission.id); return <article className={`mission-card ${unlocked ? '' : 'locked'} ${done ? 'done' : ''} ${mapMission.id === mission.id ? 'map-active' : ''}`} key={mission.id} onMouseEnter={() => setMapMission(mission)} onTouchStart={() => setMapMission(mission)}><div className="mission-number">{done ? '✓' : String(mission.id).padStart(2, '0')}</div><div className="mission-card-icon">⌁</div><span>{mission.caseCode.toUpperCase()}</span><h3>{mission.shortName}</h3><p>{mission.openingSyndrome} · {mission.region}</p><button disabled={!unlocked} onFocus={() => setMapMission(mission)} onClick={() => onStart(mission)}>{done ? 'Reabrir caso' : unlocked ? 'Abrir dossiê' : 'Conclua o anterior'} <b>→</b></button></article> })}</div></section>
    <footer className="campaign-footer">Conteúdo educacional. Para aprofundamento, use as referências oficiais no debriefing e os protocolos do seu serviço.</footer>
    {showTutorial && <Tutorial onClose={onDismissTutorial} />}
  </main>
}

function Tutorial({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop tutorial-backdrop" role="presentation"><section className="tutorial" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><span className="modal-kicker">GUIA RÁPIDO · PRIMEIRO ACESSO</span><h2 id="tutorial-title">Como funciona o plantão</h2><p>Você não precisa adivinhar. Cada caso foi pensado para ser resolvido pela combinação de evidências.</p><div className="tutorial-steps"><article><b>1</b><div><h3>Leia o dossiê</h3><p>Comece pelos dados de plantão: síndrome, cronologia e contexto.</p></div></article><article><b>2</b><div><h3>Acione médicos</h3><p>Cada médico revela duas camadas de informação. Compare clínica, exposição, vigilância e laboratório.</p></div></article><article><b>3</b><div><h3>Defenda sua hipótese</h3><p>Após três evidências, escolha um diferencial e o dado que melhor justifica a decisão. A resposta aparece somente no debriefing.</p></div></article></div><div className="tutorial-tip"><b>Dica:</b> no celular, toque em um dossiê para atualizar o mapa antes de abri-lo.</div><div className="modal-actions"><button className="primary" onClick={onClose}>Entendi, iniciar campanha</button></div></section></div>
}

function ModalDialog({ modal, mission, student, day, cases, cluesFound, selectedDiagnosis, selectedRationale, diagnosticError, onSelectDiagnosis, onSelectRationale, onClose, onConfirmDiagnosis, onEndDay, onRestart, onCampaign }: { modal: Modal; mission: Mission; student: Student; day: number; cases: number; cluesFound: number; selectedDiagnosis: string; selectedRationale: string; diagnosticError: string; onSelectDiagnosis: (value: string) => void; onSelectRationale: (value: string) => void; onClose: () => void; onConfirmDiagnosis: () => void; onEndDay: () => void; onRestart: () => void; onCampaign: () => void }) {
  const projected = Math.round(cases * mission.investigationGrowth)
  const score = Math.max(2200, 7000 - (day - 1) * 500 - (8 - cluesFound) * 100)
  const firstName = student.name.split(' ')[0]
  return <div className="modal-backdrop" role="presentation"><section className={`modal ${modal === 'briefing' ? 'briefing-modal' : ''} ${modal === 'diagnosis' ? 'diagnosis-modal' : ''}`} role="dialog" aria-modal="true">
    {modal === 'briefing' && <><span className="modal-kicker">{mission.caseCode.toUpperCase()} · AGENTE OCULTO</span><div className="briefing-icon">⌁</div><h2>{mission.shortName}</h2><p>{firstName}, você inicia este caso com três ações por dia. Leia o dossiê, escolha qual médico acionar e defenda uma hipótese quando houver evidência suficiente.</p><div className="briefing-case"><b>{mission.openingSyndrome}</b><p>{mission.brief}</p></div><div className="briefing-facts">{mission.initialData.map((item) => <span key={item.label}>{item.label}<b>{item.value}</b></span>)}</div><div className="modal-actions"><button className="primary" onClick={onClose}>Assumir caso</button></div></>}
    {modal === 'diagnosis' && <><span className="modal-kicker">DEFESA DE HIPÓTESE · {cluesFound} EVIDÊNCIAS</span><h2>Qual diagnóstico explica melhor o conjunto?</h2><p>Escolha uma hipótese e o achado que melhor a sustenta. Uma defesa incompleta consome um dia de investigação.</p><div className="diagnoses">{mission.diagnoses.map((diagnosis) => <button className={selectedDiagnosis === diagnosis ? 'selected' : ''} onClick={() => onSelectDiagnosis(diagnosis)} key={diagnosis}>{diagnosis}</button>)}</div><div className="rationale"><span>{mission.diagnosticCheck.question}</span>{mission.diagnosticCheck.options.map((option) => <button key={option.id} className={selectedRationale === option.id ? 'selected' : ''} onClick={() => onSelectRationale(option.id)}>{option.label}</button>)}</div><div className="modal-actions"><button className="secondary" onClick={onClose}>Voltar ao dossiê</button><button className="primary" disabled={!selectedDiagnosis || !selectedRationale} onClick={onConfirmDiagnosis}>Defender hipótese</button></div></>}
    {modal === 'endDay' && <><span className="modal-kicker">FIM DO DIA {day}</span><h2>Encerrar atividades?</h2><p>O caso continua evoluindo durante a noite. A projeção não é previsão clínica real: ela representa a pressão de tempo do cenário.</p><div className="projection"><span>Casos no próximo ciclo</span><b>{projected}</b></div><div className="modal-actions"><button className="secondary" onClick={onClose}>Continuar investigação</button><button className="primary" onClick={onEndDay}>Encerrar dia</button></div></>}
    {modal === 'wrong' && <><span className="modal-kicker danger-text">DEFESA NÃO SUSTENTADA</span><h2>Revise a hierarquia das evidências.</h2><p>{diagnosticError}</p><p className="wrong-note">Um ciclo se passou enquanto a investigação era reavaliada.</p><div className="modal-actions single"><button className="primary" onClick={onClose}>Voltar ao caso</button></div></>}
    {(modal === 'win' || modal === 'lost') && <><div className="trophy">{modal === 'win' ? '🏆' : '⚠️'}</div><span className={`modal-kicker ${modal === 'win' ? 'success-text' : 'danger-text'}`}>{modal === 'win' ? 'RESPOSTA CONCLUÍDA' : 'LIMITE CRÍTICO ATINGIDO'}</span><h2>{modal === 'win' ? `Debriefing: ${mission.disease}` : 'O caso exige uma nova tentativa'}</h2><p>{modal === 'win' ? mission.debrief : 'A pressão de tempo do cenário ultrapassou o limite antes da resposta adequada. Refaça o caso, colete dados de diferentes eixos e compare sua decisão com o debriefing educativo.'}</p>{modal === 'win' && <div className="score"><span>SCORE DE RACIOCÍNIO</span><b>{score} pts</b></div>}<div className="learning-box"><span>APRENDIZADOS-CHAVE</span><ul>{mission.learningPoints.map((item) => <li key={item}>{item}</li>)}</ul><a href={mission.source.url} target="_blank" rel="noreferrer">{mission.source.label} ↗</a></div><div className="modal-actions"><button className="secondary" onClick={onCampaign}>Central de casos</button><button className="primary" onClick={onRestart}>{modal === 'win' ? 'Reabrir caso' : 'Tentar novamente'}</button></div></>}
  </section></div>
}

createRoot(document.getElementById('root')!).render(<App />)
