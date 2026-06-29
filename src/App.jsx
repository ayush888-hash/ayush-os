import React, { useState, useEffect, useCallback } from 'react'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PIN = '2342'
const MAX_SCORE = 15
const METRICS = [
  { id: 'wakeup',  label: 'Woke up by 7:00 AM',                     pts: 1, cat: 'Morning' },
  { id: 'goals',   label: 'Wrote 3 daily goals in morning',          pts: 1, cat: 'Morning' },
  { id: 'dsa1',    label: 'DSA Block 1 completed (90 min)',           pts: 3, cat: 'DSA' },
  { id: 'dsa2',    label: 'DSA Block 2 completed (practice)',         pts: 3, cat: 'DSA' },
  { id: 'leet',    label: 'LeetCode / problem attempted (≥1)',        pts: 2, cat: 'DSA' },
  { id: 'webdev',  label: 'Web Dev session completed',                pts: 2, cat: 'Dev' },
  { id: 'college', label: 'College subjects studied (30 min+)',       pts: 1, cat: 'Academic' },
  { id: 'phone',   label: 'Phone face-down during study blocks',      pts: 1, cat: 'Discipline' },
  { id: 'card',    label: 'Scorecard filled (you are doing it now)',  pts: 1, cat: 'Discipline' },
  { id: 'sleep',   label: 'Slept by 10:30 PM last night',            pts: 1, cat: 'Health' },
]
const RECOVERY_METRICS = [
  { id: 'dsa1',   label: 'DSA Block 1 (75 min minimum)',  pts: 5, cat: 'DSA' },
  { id: 'card',   label: 'Scorecard filled',               pts: 3, cat: 'Discipline' },
  { id: 'wakeup', label: 'Woke up by 7:30 AM',            pts: 2, cat: 'Morning' },
]
const CAT_COLORS = { Morning: '#F59E0B', DSA: '#3B82F6', Dev: '#A78BFA', Academic: '#22C55E', Discipline: '#94A3B8', Health: '#EF4444' }
const DSA_TOPICS = [
  { id: 'cpp_basics', label: 'C++ Basics (syntax, loops, functions, arrays)', phase: 'Foundation', time: 'Jun 26 – Jul 15' },
  { id: 'cpp_oop', label: 'C++ OOP (classes, inheritance, polymorphism)', phase: 'Foundation', time: 'Jul 3 – Jul 20' },
  { id: 'complexity', label: 'Time & Space Complexity (Big O)', phase: 'Foundation', time: 'Jul 10 – Jul 15' },
  { id: 'recursion', label: 'Recursion & Backtracking', phase: 'Foundation', time: 'Jul 16 – Aug 5' },
  { id: 'arrays', label: 'Arrays & Strings', phase: 'Core', time: 'Aug 1 – Aug 20' },
  { id: 'sorting', label: 'Sorting Algorithms (all 6)', phase: 'Core', time: 'Aug 15 – Aug 25' },
  { id: 'searching', label: 'Binary Search & Variations', phase: 'Core', time: 'Aug 20 – Sep 5' },
  { id: 'twoptr', label: 'Two Pointer & Sliding Window', phase: 'Core', time: 'Sep 1 – Sep 15' },
  { id: 'hashing', label: 'Hashing (HashMap, HashSet)', phase: 'Core', time: 'Sep 10 – Sep 20' },
  { id: 'linkedlist', label: 'Linked List (Singly, Doubly, Circular)', phase: 'Core', time: 'Sep 15 – Oct 5' },
  { id: 'stacks', label: 'Stacks & Queues', phase: 'Core', time: 'Oct 1 – Oct 20' },
  { id: 'trees', label: 'Trees (Binary, BST, Traversals)', phase: 'Core', time: 'Oct 15 – Nov 10' },
  { id: 'heaps', label: 'Heaps & Priority Queues', phase: 'Core', time: 'Nov 5 – Nov 25' },
  { id: 'graphs', label: 'Graphs (BFS, DFS, Dijkstra, MST)', phase: 'Advanced', time: 'Dec 26 – Jan 27' },
  { id: 'dp', label: 'Dynamic Programming (1D, 2D, DP on Trees)', phase: 'Advanced', time: 'Feb – Apr 27' },
  { id: 'tries', label: 'Tries, Segment Trees, Bit Manipulation', phase: 'Advanced', time: 'May – Jun 27' },
  { id: 'revision', label: 'Full SDE Sheet Revision + Mock Interviews', phase: 'Revision', time: 'Jul – Sep 27' },
  { id: 'company', label: 'Company-Specific Question Preparation', phase: 'Placement', time: 'Oct 27 onwards' },
]
const WEB_TOPICS = [
  { id: 'html', label: 'HTML5 — structure, semantic tags, forms', phase: 'Frontend 1', time: 'Jun 30 – Jul 10', del: 'Personal webpage' },
  { id: 'css', label: 'CSS3 — box model, flexbox, grid, animations', phase: 'Frontend 1', time: 'Jul 10 – Jul 25', del: 'Styled webpage' },
  { id: 'js1', label: 'JavaScript — DOM, events, functions, fetch', phase: 'Frontend 2', time: 'Jul 20 – Aug 20', del: 'To-do list app' },
  { id: 'js2', label: 'JavaScript ES6+, async/await, promises', phase: 'Frontend 2', time: 'Aug 15 – Sep 5', del: 'Weather API app' },
  { id: 'react1', label: 'React — components, props, state, hooks', phase: 'Framework', time: 'Sep 1 – Oct 15', del: 'React to-do on GitHub' },
  { id: 'react2', label: 'React — routing, context API, forms', phase: 'Framework', time: 'Oct 10 – Nov 10', del: 'Multi-page React project' },
  { id: 'node', label: 'Node.js + Express — REST APIs, routing', phase: 'Backend', time: 'Dec 26 – Jan 27', del: 'Simple REST API' },
  { id: 'mongo', label: 'MongoDB + Mongoose — CRUD operations', phase: 'Backend', time: 'Jan – Feb 27', del: 'DB-connected backend' },
  { id: 'fs1', label: 'Full Stack Project 1 — MERN (small, complete)', phase: 'Full Stack', time: 'Feb – Apr 27', del: 'GitHub project w/ README' },
  { id: 'fs2', label: 'Full Stack Project 2 — auth, deployment', phase: 'Full Stack', time: 'May – Jul 27', del: 'Deployed on Vercel/Render' },
  { id: 'polish', label: 'Portfolio website, project docs, LinkedIn', phase: 'Polish', time: 'Aug – Sep 27', del: 'Resume-ready portfolio' },
]
const SUBJECTS = [
  { id: 'bc', label: 'Bridge Course — C', diff: 'Low', target: 'A+', tip: 'Bridges directly to DSA' },
  { id: 'bm', label: 'Bridge Course — Mathematics', diff: 'Medium', target: 'A', tip: 'Foundation for Discrete Math' },
  { id: 'cm', label: 'Computational Mathematics', diff: 'Medium', target: 'A', tip: 'Weekly problem sets' },
  { id: 'dm', label: 'Discrete Mathematics', diff: 'High', target: 'A', tip: 'Biggest CGPA risk — start NPTEL early' },
  { id: 'dl', label: 'Digital Logic & Circuit Design', diff: 'Medium', target: 'A', tip: 'Past papers from Week 8' },
  { id: 'ds', label: 'Data Structures', diff: 'High', target: 'A+', tip: 'Your DSA prep is a gift here' },
  { id: 'oop', label: 'OOP in C++', diff: 'Medium', target: 'A+', tip: 'C++ parallel study makes this easy' },
]
const MENTOR_MSGS = [
  "The 12th standard pattern starts with silence. Don't disappear — especially on bad days. Show up, even broken.",
  "You need validation to commit. So here it is: filling this scorecard tonight means you didn't give up. That is enough for today.",
  "The girl who got Microsoft at 53 LPA started exactly where you are. The difference is not intelligence. It is consistency over time.",
  "Missing one day is normal. Missing two is a warning. Missing three triggers recovery protocol.",
  "Fear-based avoidance is your enemy — not laziness. When you don't want to sit down, it feels like evidence of inadequacy. It isn't. Just sit down.",
  "Your 10-minute rule: set a timer for 10 minutes. Just 10. You almost always continue after.",
  "The floor at BPIT is Accenture at 4.5 LPA. Dozens land there every year with zero preparation. You are not building toward the floor.",
  "You said you'd stay committed if you could see honest growth. Look at your streak. That is honest growth.",
  "DSA is a language. You become fluent by showing up every day and tolerating being bad at it longer than feels comfortable.",
  "Your worst enemy is the story you tell yourself when you fail — that it means something permanent. It doesn't.",
]
const PHASE_COLORS = { Foundation: '#22C55E', Core: '#3B82F6', Advanced: '#A78BFA', Revision: '#F59E0B', Placement: '#EF4444' }
const WEB_COLORS = { 'Frontend 1': '#F59E0B', 'Frontend 2': '#22C55E', Framework: '#3B82F6', Backend: '#A78BFA', 'Full Stack': '#EF4444', Polish: '#94A3B8' }
const PSTATUS = ['Planning', 'In Progress', 'Completed', 'Deployed']
const PCOLORS = { Planning: '#64748B', 'In Progress': '#F59E0B', Completed: '#3B82F6', Deployed: '#22C55E' }
const ISTATUS = ['Applied', 'OA Received', 'Interview', 'Offer', 'Rejected', 'Withdrawn']
const ICOLORS = { Applied: '#3B82F6', 'OA Received': '#A78BFA', Interview: '#F59E0B', Offer: '#22C55E', Rejected: '#EF4444', Withdrawn: '#64748B' }

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0')
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}` }
const subDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() - n); return r }
const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const fmtShort = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const fmtFull = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const scoreColor = s => { const p = s / MAX_SCORE; return p >= .87 ? '#22C55E' : p >= .67 ? '#3B82F6' : p >= .47 ? '#F59E0B' : '#EF4444' }
const scoreLabel = s => { const p = s / MAX_SCORE; return p >= .87 ? 'Excellent' : p >= .67 ? 'Good' : p >= .47 ? 'Acceptable' : 'Warning' }

function getStreak(logs) {
  let s = 0, d = new Date()
  if (!logs[dayKey(d)]) d = subDays(d, 1)
  while (true) {
    const k = dayKey(d), l = logs[k]
    if (!l) break
    if (l.life || typeof l.score === 'number') { s++; d = subDays(d, 1) } else break
  }
  return s
}

function getLast30(logs) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = subDays(new Date(), 29 - i)
    const k = dayKey(d), log = logs[k]
    return { date: k, label: fmtShort(d), isToday: i === 29, log, status: !log ? (i === 29 ? 'today' : 'missed') : log.life ? 'excused' : log.score >= 10 ? 'done' : 'low' }
  })
}

// ─── STYLES (CSS-in-JS object) ────────────────────────────────────────────────
const S = {
  // layout
  shell: { display: 'flex', minHeight: '100vh', background: '#0A0D12' },
  sidebar: { width: 210, minHeight: '100vh', background: '#0F1318', borderRight: '1px solid #1E2736', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto' },
  main: { marginLeft: 210, flex: 1, padding: '1.75rem 2rem', maxWidth: 'calc(100vw - 210px)', minHeight: '100vh' },
  // cards
  card: { background: '#0F1318', border: '1px solid #1E2736', borderRadius: 12, padding: '1.1rem 1.2rem', marginBottom: '1rem' },
  cardsm: { background: '#151A22', border: '1px solid #1E2736', borderRadius: 8, padding: '.875rem 1rem' },
  // text
  t1: { fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-.02em', color: '#E2E8F0' },
  t2: { fontSize: '.8rem', color: '#64748B', marginTop: 3 },
  t3: { fontSize: '.875rem', color: '#94A3B8' },
  label: { fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: 6 },
  // buttons
  btnP: { background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: '.45rem .9rem', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  btnG: { background: 'transparent', color: '#94A3B8', border: '1px solid #1E2736', borderRadius: 8, padding: '.45rem .9rem', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  // inputs
  input: { background: '#151A22', border: '1px solid #1E2736', borderRadius: 8, color: '#E2E8F0', padding: '.45rem .7rem', fontSize: '.875rem', width: '100%', outline: 'none', fontFamily: 'inherit' },
  textarea: { background: '#151A22', border: '1px solid #1E2736', borderRadius: 8, color: '#E2E8F0', padding: '.45rem .7rem', fontSize: '.875rem', width: '100%', outline: 'none', fontFamily: 'inherit', resize: 'vertical' },
  select: { background: '#151A22', border: '1px solid #1E2736', borderRadius: 8, color: '#E2E8F0', padding: '.4rem .6rem', fontSize: '.82rem', outline: 'none', fontFamily: 'inherit' },
  // misc
  divider: { border: 'none', borderTop: '1px solid #1E2736', margin: '.875rem 0' },
  badge: (c) => ({ background: c + '20', color: c, borderRadius: 4, padding: '.18rem .5rem', fontSize: '.68rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }),
  pbar: { height: 4, background: '#1C2230', borderRadius: 2, overflow: 'hidden' },
  pfill: (w, c) => ({ height: '100%', borderRadius: 2, width: w + '%', background: c, transition: 'width .4s' }),
}

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────────
const Stat = ({ label, value, color, sub }) => (
  <div style={{ ...S.card, marginBottom: 0 }}>
    <div style={S.label}>{label}</div>
    <div style={{ fontSize: '1.7rem', fontWeight: 700, fontFamily: 'monospace', color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: '.7rem', color: '#64748B', marginTop: 4 }}>{sub}</div>}
  </div>
)

const Grid = ({ cols = 2, children, style = {} }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem', ...style }}>{children}</div>
)

const Alert = ({ type = 'info', children }) => {
  const colors = { info: '#3B82F6', warn: '#F59E0B', danger: '#EF4444', success: '#22C55E' }
  const c = colors[type]
  return <div style={{ background: c + '18', border: `1px solid ${c}35`, borderRadius: 8, padding: '.8rem .95rem', fontSize: '.82rem', color: '#94A3B8', marginBottom: '.875rem', lineHeight: 1.5 }}>{children}</div>
}

const CheckItem = ({ label, pts, checked, color, onChange }) => (
  <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '.55rem .7rem', background: checked ? color + '14' : '#151A22', border: `1px solid ${checked ? color : '#1E2736'}`, borderRadius: 8, cursor: 'pointer', marginBottom: 6, transition: 'all .12s', userSelect: 'none' }}>
    <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? color : '#2A3547'}`, background: checked ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .12s' }}>
      {checked && <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
    </div>
    <span style={{ flex: 1, fontSize: '.82rem', fontWeight: 500, color: checked ? '#E2E8F0' : '#94A3B8' }}>{label}</span>
    <span style={{ fontSize: '.7rem', fontFamily: 'monospace', fontWeight: 600, color: checked ? color : '#475569' }}>+{pts}</span>
  </div>
)

const TopicCheck = ({ done, color, onToggle, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '.55rem 0', borderBottom: '1px solid #1E2736' }}>
    <div onClick={onToggle} style={{ width: 19, height: 19, borderRadius: 4, border: `1.5px solid ${done ? color : '#2A3547'}`, background: done ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', marginTop: 2, transition: 'all .15s' }}>
      {done && <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
)

const ScoreRing = ({ score, max }) => {
  const pct = Math.round((score / max) * 100)
  const r = 46, circ = 2 * Math.PI * r
  const c = scoreColor(score)
  return (
    <div style={{ textAlign: 'center', padding: '.75rem 0 1.1rem' }}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#1C2230" strokeWidth={7} />
        <circle cx={55} cy={55} r={r} fill="none" stroke={c} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" transform="rotate(-90 55 55)" style={{ transition: 'stroke-dashoffset .4s, stroke .3s' }} />
        <text x={55} y={52} textAnchor="middle" fill={c} fontSize={21} fontWeight={700} fontFamily="monospace">{score}</text>
        <text x={55} y={68} textAnchor="middle" fill="#64748B" fontSize={10} fontFamily="monospace">/ {max}</text>
      </svg>
      <div style={{ fontWeight: 600, color: c, marginTop: 4 }}>{scoreLabel(score)}</div>
      <div style={{ fontSize: '.72rem', color: '#64748B', marginTop: 2 }}>{pct}% of maximum</div>
    </div>
  )
}

const MentorMsg = ({ msg }) => (
  <div style={{ background: 'linear-gradient(135deg,#151A22,#0F1318)', border: '1px solid #1E2736', borderLeft: '3px solid #3B82F6', borderRadius: 12, padding: '.9rem 1.1rem', fontSize: '.84rem', color: '#94A3B8', lineHeight: 1.65, fontStyle: 'italic' }}>
    "{msg}"
    <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#3B82F6', marginTop: 6, fontStyle: 'normal', letterSpacing: '.04em' }}>— YOUR MENTOR</div>
  </div>
)

// ─── PIN SCREEN ───────────────────────────────────────────────────────────────
function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [shake, setShake] = useState(false)

  const press = (k) => {
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    setErr('')
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PIN) onUnlock()
        else { setShake(true); setTimeout(() => { setShake(false); setPin(''); setErr('Incorrect PIN') }, 450) }
      }, 120)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0D12' }}>
      <div style={{ background: '#0F1318', border: '1px solid #1E2736', borderRadius: 12, padding: '2.25rem', width: 320, textAlign: 'center', animation: shake ? 'shake .4s ease' : 'none' }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}`}</style>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Ayush OS</div>
        <div style={{ fontSize: '.72rem', color: '#64748B', fontFamily: 'monospace' }}>Enter PIN to continue</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '1.25rem 0' }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${pin.length > i ? '#3B82F6' : '#2A3547'}`, background: pin.length > i ? '#3B82F6' : 'transparent', transition: 'all .15s' }} />)}
        </div>
        {err && <div style={{ color: '#EF4444', fontSize: '.78rem', marginBottom: 8 }}>{err}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            k === '' ? <div key={i} /> :
            <button key={i} onClick={() => k === '⌫' ? setPin(p => p.slice(0,-1)) : press(k)}
              style={{ background: '#151A22', border: '1px solid #1E2736', borderRadius: 8, color: '#E2E8F0', fontSize: '1.1rem', fontWeight: 500, padding: '.85rem', cursor: 'pointer', fontFamily: 'monospace', transition: 'all .1s' }}>
              {k}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '1.1rem', fontSize: '.68rem', color: '#475569' }}>Your personal execution system</div>
      </div>
    </div>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { sec: 'Overview' }, { id: 'dashboard', label: 'Dashboard' }, { id: 'checkin', label: 'Daily Check-in' }, { id: 'progress', label: 'Progress' },
  { sec: 'Build' }, { id: 'dsa', label: 'DSA Tracker' }, { id: 'webdev', label: 'Web Dev' }, { id: 'cgpa', label: 'CGPA' },
  { sec: 'Career' }, { id: 'projects', label: 'Projects' }, { id: 'internships', label: 'Internships' }, { id: 'portfolio', label: 'Portfolio' },
  { sec: 'Plan' }, { id: 'schedule', label: 'Schedule' }, { id: 'roadmap', label: 'Roadmap' }, { id: 'notes', label: 'Journal' }, { id: 'why', label: 'My Why' },
]

function Sidebar({ page, setPage, streak, recoveryMode, onLock }) {
  return (
    <nav style={{ ...S.sidebar, padding: '1.25rem 0' }}>
      <div style={{ padding: '0 1.1rem 1.1rem', borderBottom: '1px solid #1E2736', marginBottom: 8 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ayush OS</div>
        <div style={{ fontSize: '.65rem', color: '#64748B', fontFamily: 'monospace', marginTop: 2 }}>v1.0 · 2026–2029</div>
      </div>
      <div style={{ margin: '0 1rem 6px', background: streak > 0 ? 'rgba(59,130,246,.12)' : '#151A22', border: `1px solid ${streak > 0 ? 'rgba(59,130,246,.3)' : '#1E2736'}`, borderRadius: 8, padding: '.35rem .65rem', fontSize: '.78rem', fontWeight: 700, color: streak > 0 ? '#3B82F6' : '#64748B', fontFamily: 'monospace' }}>
        🔥 {streak} day streak
      </div>
      {recoveryMode && <div style={{ margin: '0 1rem 6px', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 8, padding: '.3rem .65rem', fontSize: '.7rem', fontWeight: 600, color: '#F59E0B' }}>⚠ Recovery Mode</div>}
      {NAV_ITEMS.map((item, i) =>
        item.sec
          ? <div key={i} style={{ padding: '.2rem .75rem', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#64748B', marginTop: 10, marginBottom: 2 }}>{item.sec}</div>
          : <div key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.45rem 1.1rem', fontSize: '.82rem', fontWeight: 500, color: page === item.id ? '#3B82F6' : '#94A3B8', cursor: 'pointer', borderLeft: `2px solid ${page === item.id ? '#3B82F6' : 'transparent'}`, background: page === item.id ? 'rgba(59,130,246,.1)' : 'transparent', transition: 'all .12s' }}>
              {item.label}
            </div>
      )}
      <div style={{ marginTop: 'auto', padding: '.75rem 1.1rem 0', borderTop: '1px solid #1E2736' }}>
        <div onClick={onLock} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.45rem 0', fontSize: '.72rem', color: '#475569', cursor: 'pointer' }}>Lock</div>
      </div>
    </nav>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ logs, data, setData, saveLogs, setPage, recoveryMode, setRecoveryMode }) {
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const todayLog = logs[todayKey()]
  const streak = getStreak(logs)
  const last30 = getLast30(logs)
  const mentorMsg = MENTOR_MSGS[(new Date().getDate() + new Date().getMonth()) % MENTOR_MSGS.length]

  const week7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    return { k: dayKey(d), log: logs[dayKey(d)], label: ['S','M','T','W','T','F','S'][d.getDay()] }
  })
  const wLogged = week7.filter(d => d.log && !d.log.life)
  const wAvg = wLogged.length ? Math.round(wLogged.reduce((s, d) => s + (d.log.score || 0), 0) / wLogged.length) : 0

  const markLife = () => {
    const reason = window.prompt('What happened today? (Your streak will be protected)')
    if (!reason) return
    const newLogs = { ...logs, [todayKey()]: { life: true, lifeReason: reason, savedAt: new Date().toISOString() } }
    saveLogs(newLogs)
  }

  const dotColor = d => d.status === 'done' ? '#3B82F6' : d.status === 'excused' ? '#F59E0B' : d.isToday ? 'transparent' : '#1C2230'
  const dsaDone = Object.values(data.dsaTopics || {}).filter(Boolean).length

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={S.t1}>Good {greet}, Ayush.</div>
          <div style={S.t2}>{fmtFull()}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!todayLog && <button style={S.btnG} onClick={markLife}>Life Happened</button>}
          <button style={{ ...S.btnG, color: recoveryMode ? '#F59E0B' : undefined }} onClick={() => setRecoveryMode(r => !r)}>
            {recoveryMode ? 'Exit Recovery' : 'Recovery Mode'}
          </button>
        </div>
      </div>

      {recoveryMode && <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 12, padding: '.9rem 1.1rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, color: '#F59E0B', marginBottom: 4 }}>Recovery Mode Active</div>
        <div style={{ fontSize: '.82rem', color: '#94A3B8' }}>Minimum: DSA Block 1 + Scorecard + Wake up. Rebuild 3 days, then exit.</div>
      </div>}

      {!todayLog && hour >= 21 && <Alert type="warn">⚠ Scorecard not filled — it's past 9 PM. <span onClick={() => setPage('checkin')} style={{ color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}>Fill now →</span></Alert>}
      {todayLog && !todayLog.life && <Alert type="success">✓ Today logged — <strong>{todayLog.score}/{MAX_SCORE}</strong> pts ({scoreLabel(todayLog.score)}). {todayLog.score >= 13 ? 'Strong day.' : todayLog.score >= 10 ? 'Good. Identify what\'s missing.' : 'Something slipped. What will you fix tomorrow?'}</Alert>}
      {todayLog?.life && <Alert type="info">Life Happened — "{todayLog.lifeReason}". Streak protected.</Alert>}

      <Grid cols={4} style={{ marginBottom: '1rem' }}>
        <Stat label="Current Streak" value={streak} color={streak > 0 ? '#3B82F6' : '#475569'} sub="days in a row 🔥" />
        <Stat label="LeetCode Solved" value={data.lc || 0} color="#22C55E" sub="target: 100 by Year 1" />
        <Stat label="DSA Topics" value={`${dsaDone}/18`} color="#A78BFA" sub={`${Math.round(dsaDone/18*100)}% complete`} />
        <Stat label="Projects Built" value={(data.projects || []).length} color="#F59E0B" sub="target: 2 by Year 1 end" />
      </Grid>

      <Grid cols={2} style={{ marginBottom: '1rem' }}>
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom: 8 }}>Last 30 Days</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, fontSize: '.62rem', color: '#64748B', marginBottom: 8 }}>
            <span>🟦 Done</span><span>🟡 Excused</span><span>⬜ Missed</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {last30.map((d, i) => (
              <div key={i} title={`${d.date}${d.log ? ` — ${d.log.score || 0} pts` : ''}`} style={{ aspectRatio: '1', borderRadius: 3, background: dotColor(d), border: d.isToday ? '1.5px solid #3B82F6' : 'none' }} />
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ ...S.label, marginBottom: 8 }}>This Week</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {week7.map((d, i) => {
              const log = d.log, score = log?.score || 0, pct = score / MAX_SCORE
              const color = !log ? '#1C2230' : log.life ? '#F59E0B' : pct >= .8 ? '#22C55E' : pct >= .5 ? '#3B82F6' : '#EF4444'
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: 52, background: '#151A22', borderRadius: 4, position: 'relative', overflow: 'hidden', marginBottom: 3 }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: log ? `${Math.max(pct * 100, 8)}%` : '0%', background: color, borderRadius: '3px 3px 0 0', transition: 'height .3s' }} />
                  </div>
                  <div style={{ fontSize: '.6rem', color: '#64748B', fontFamily: 'monospace' }}>{d.label}</div>
                  {log && !log.life && <div style={{ fontSize: '.6rem', color, fontFamily: 'monospace', fontWeight: 600 }}>{score}</div>}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem' }}>
            <span style={{ color: '#64748B' }}>Avg: <span style={{ fontWeight: 600, color: scoreColor(wAvg) }}>{wAvg}/{MAX_SCORE}</span></span>
            <span style={{ color: '#64748B' }}>Logged: <span style={{ fontWeight: 600, color: '#3B82F6' }}>{wLogged.length}/7</span></span>
          </div>
        </div>
      </Grid>

      <Grid cols={2} style={{ marginBottom: '1rem' }}>
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom: 10 }}>Quick Actions</div>
          {[['checkin', "Fill today's check-in", '#3B82F6'], ['dsa', 'Update DSA progress', '#A78BFA'], ['projects', 'Log a new project', '#22C55E'], ['internships', 'Log internship application', '#F59E0B'], ['notes', 'Write in journal', '#94A3B8']].map(([pg, lbl, c]) => (
            <button key={pg} onClick={() => setPage(pg)} style={{ ...S.btnG, width: '100%', justifyContent: 'flex-start', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: c, fontFamily: 'monospace', width: 14, textAlign: 'center' }}>→</span>{lbl}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ ...S.label, marginBottom: 10 }}>LeetCode Progress</div>
          {[['Easy', data.lcE || 0, '#22C55E', 80], ['Medium', data.lcM || 0, '#F59E0B', 60], ['Hard', data.lcH || 0, '#EF4444', 10]].map(([l, v, c, t]) => (
            <div key={l} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '.75rem', color: '#94A3B8' }}>{l}</span>
                <span style={{ fontSize: '.75rem', fontFamily: 'monospace', color: c }}>{v}</span>
              </div>
              <div style={S.pbar}><div style={S.pfill(Math.min((v / t) * 100, 100), c)} /></div>
            </div>
          ))}
          <button onClick={() => {
            const t = parseInt(window.prompt('Total LeetCode solved:', data.lc || 0)); if (isNaN(t)) return
            const e = parseInt(window.prompt('Easy:', data.lcE || 0)) || 0
            const m = parseInt(window.prompt('Medium:', data.lcM || 0)) || 0
            setData(d => ({ ...d, lc: t, lcE: e, lcM: m, lcH: Math.max(0, t - e - m) }))
          }} style={{ ...S.btnG, width: '100%', fontSize: '.75rem', marginTop: 4 }}>Update Count</button>
        </div>
      </Grid>

      <MentorMsg msg={mentorMsg} />
    </div>
  )
}

// ─── DAILY CHECK-IN ───────────────────────────────────────────────────────────
function CheckIn({ logs, data, setData, saveLogs, recoveryMode }) {
  const today = todayKey()
  const existing = logs[today]
  const metrics = recoveryMode ? RECOVERY_METRICS : METRICS
  const maxS = metrics.reduce((s, m) => s + m.pts, 0)

  const [checked, setChecked] = useState(existing?.metrics || {})
  const [note, setNote] = useState(existing?.note || '')
  const [leet, setLeet] = useState(existing?.leetAdded || 0)
  const [saved, setSaved] = useState(!!existing && !existing.life)

  const score = metrics.reduce((s, m) => s + (checked[m.id] ? m.pts : 0), 0)
  const cats = [...new Set(metrics.map(m => m.cat))]

  const toggle = id => { setChecked(c => ({ ...c, [id]: !c[id] })); setSaved(false) }

  const doSave = () => {
    const newLogs = { ...logs, [today]: { metrics: { ...checked }, score, note, leetAdded: leet, savedAt: new Date().toISOString() } }
    saveLogs(newLogs)
    setData(d => ({ ...d, lc: (d.lc || 0) + leet }))
    setSaved(true)
    setLeet(0)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={S.t1}>Daily Check-in</div>
          <div style={S.t2}>{fmtFull()}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '.72rem', color: '#22C55E' }}>✓ Saved</span>}
          <button onClick={() => { if (window.confirm('Reset today?')) { setChecked({}); setNote(''); setLeet(0); setSaved(false) } }} style={S.btnG}>Reset</button>
          <button onClick={doSave} style={S.btnP}>Save Check-in</button>
        </div>
      </div>

      {recoveryMode && <Alert type="warn">Recovery Mode: Only 3 metrics tonight. Just show up.</Alert>}

      <Grid cols={2} style={{ gap: '1.5rem' }}>
        <div>
          {cats.map(cat => (
            <div key={cat} style={{ marginBottom: '1.1rem' }}>
              <div style={{ ...S.label, color: CAT_COLORS[cat] || '#64748B', marginBottom: 6 }}>{cat}</div>
              {metrics.filter(m => m.cat === cat).map(m => (
                <CheckItem key={m.id} label={m.label} pts={m.pts} checked={!!checked[m.id]} color={CAT_COLORS[m.cat] || '#3B82F6'} onChange={() => toggle(m.id)} />
              ))}
            </div>
          ))}

          <div style={{ marginBottom: '1.1rem' }}>
            <div style={{ ...S.label, color: '#3B82F6', marginBottom: 6 }}>LeetCode Today</div>
            <div style={{ ...S.cardsm, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ flex: 1, fontSize: '.82rem', color: '#94A3B8' }}>Problems solved today</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setLeet(l => Math.max(0, l - 1))} style={{ background: '#1C2230', border: '1px solid #1E2736', borderRadius: 4, color: '#E2E8F0', width: 28, height: 28, cursor: 'pointer', fontSize: '1.1rem' }}>−</button>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: '#3B82F6', minWidth: 28, textAlign: 'center' }}>{leet}</span>
                <button onClick={() => setLeet(l => l + 1)} style={{ background: '#1C2230', border: '1px solid #1E2736', borderRadius: 4, color: '#E2E8F0', width: 28, height: 28, cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
              </div>
            </div>
          </div>

          <div>
            <div style={{ ...S.label, marginBottom: 6 }}>Today's Note</div>
            <textarea value={note} onChange={e => { setNote(e.target.value); setSaved(false) }} placeholder="What went well? What slipped? What will you change tomorrow?" style={{ ...S.textarea, height: 90 }} />
          </div>
        </div>

        <div>
          <div style={{ ...S.card, position: 'sticky', top: '1rem' }}>
            <ScoreRing score={score} max={maxS} />
            <hr style={S.divider} />
            {cats.map(cat => {
              const items = metrics.filter(m => m.cat === cat)
              const cs = items.reduce((s, m) => s + (checked[m.id] ? m.pts : 0), 0)
              const cm = items.reduce((s, m) => s + m.pts, 0)
              return (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '.3rem 0', borderBottom: '1px solid #1E2736', fontSize: '.78rem' }}>
                  <span style={{ color: '#94A3B8' }}>{cat}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: cs === cm ? (CAT_COLORS[cat] || '#3B82F6') : '#475569' }}>{cs}/{cm}</span>
                </div>
              )
            })}
            <hr style={S.divider} />
            {[[13, 15, 'Excellent — strong day', '#22C55E'], [10, 12, 'Good — keep it up', '#3B82F6'], [7, 9, 'Acceptable', '#F59E0B'], [0, 6, 'Warning', '#EF4444']].map(([lo, hi, msg, c]) => (
              <div key={lo} style={{ padding: '.32rem .5rem', borderRadius: 5, marginBottom: 4, background: score >= lo && score <= hi ? c + '20' : 'transparent', border: score >= lo && score <= hi ? `1px solid ${c}50` : '1px solid transparent' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: c, marginRight: 6 }}>{lo}–{hi}</span>
                <span style={{ color: '#64748B', fontSize: '.75rem' }}>{msg}</span>
              </div>
            ))}
            <button onClick={doSave} style={{ ...S.btnP, width: '100%', justifyContent: 'center', marginTop: 12 }}>
              {saved ? '✓ Saved' : 'Save Check-in'}
            </button>
          </div>
        </div>
      </Grid>
    </div>
  )
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function Progress({ logs, data }) {
  const last30 = getLast30(logs)
  const logged = last30.filter(d => d.log && !d.log.life)
  const avg = logged.length ? Math.round(logged.reduce((s, d) => s + (d.log.score || 0), 0) / logged.length) : 0
  const best = logged.length ? Math.max(...logged.map(d => d.log.score || 0)) : 0
  const consistency = Math.round(logged.length / 30 * 100)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>Progress</div><div style={S.t2}>30-day consistency and growth</div></div>
      <Grid cols={4} style={{ marginBottom: '1rem' }}>
        <Stat label="Avg Score" value={`${avg}/${MAX_SCORE}`} color="#3B82F6" sub="last 30 days" />
        <Stat label="Best Score" value={best} color="#22C55E" sub="personal best" />
        <Stat label="Consistency" value={consistency + '%'} color="#A78BFA" sub={`${logged.length}/30 days`} />
        <Stat label="Excused" value={last30.filter(d => d.log?.life).length} color="#F59E0B" sub="life happened" />
      </Grid>

      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 12 }}>Daily Score — Last 30 Days</div>
        {logged.length === 0
          ? <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#151A22', borderRadius: 8, color: '#64748B', fontSize: '.82rem' }}>Fill your first check-in to see data here.</div>
          : <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 150, background: '#151A22', borderRadius: 8, padding: '8px 6px 0', overflowX: 'auto' }}>
              {last30.filter(d => d.log && !d.log.life).map((d, i) => {
                const s = d.log.score || 0, pct = s / MAX_SCORE
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 12, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${Math.max(pct * 134, 2)}px`, background: scoreColor(s), borderRadius: '3px 3px 0 0', transition: 'height .4s' }} />
                    <div style={{ fontSize: '.5rem', color: '#475569', marginTop: 2, overflow: 'hidden' }}>{d.label}</div>
                  </div>
                )
              })}
            </div>
        }
      </div>

      <Grid cols={2}>
        <div style={S.card}>
          <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 12 }}>LeetCode Growth</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: '#64748B', marginBottom: 8 }}>
            <span>Current: <strong style={{ color: '#22C55E', fontFamily: 'monospace' }}>{data.lc || 0}</strong></span>
            <span>Year 1: <strong style={{ color: '#94A3B8' }}>100</strong></span>
            <span>Year 2: <strong style={{ color: '#94A3B8' }}>250</strong></span>
          </div>
          <div style={S.pbar}><div style={S.pfill(Math.min(((data.lc || 0) / 100) * 100, 100), '#22C55E')} /></div>
          <div style={{ fontSize: '.72rem', color: '#64748B', marginTop: 6 }}>{data.lc || 0}/100 Year 1 target</div>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Weekly Performance</div>
          {[0, 1, 2, 3].map(wo => {
            const wd = Array.from({ length: 7 }, (_, i) => { const d = subDays(new Date(), wo * 7 + (6 - i)); return logs[dayKey(d)] })
            const wl = wd.filter(d => d && !d.life)
            const wa = wl.length ? Math.round(wl.reduce((s, d) => s + (d.score || 0), 0) / wl.length) : null
            const lbl = wo === 0 ? 'This week' : wo === 1 ? 'Last week' : `${wo} weeks ago`
            return (
              <div key={wo} style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem 0', borderBottom: '1px solid #1E2736', fontSize: '.78rem' }}>
                <span style={{ color: '#94A3B8' }}>{lbl}</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: '#64748B' }}>{wl.length}/7 days</span>
                  {wa !== null && <span style={{ fontFamily: 'monospace', fontWeight: 600, color: wa >= 12 ? '#22C55E' : wa >= 9 ? '#3B82F6' : wa >= 6 ? '#F59E0B' : '#EF4444' }}>{wa} avg</span>}
                </div>
              </div>
            )
          })}
        </div>
      </Grid>
    </div>
  )
}

// ─── DSA TRACKER ──────────────────────────────────────────────────────────────
function DSATracker({ data, setData }) {
  const dt = data.dsaTopics || {}
  const [expanded, setExpanded] = useState({ Foundation: true, Core: true })
  const phases = ['Foundation', 'Core', 'Advanced', 'Revision', 'Placement']
  const grouped = DSA_TOPICS.reduce((acc, t) => { if (!acc[t.phase]) acc[t.phase] = []; acc[t.phase].push(t); return acc }, {})
  const totalDone = DSA_TOPICS.filter(t => dt[t.id]).length

  const toggle = id => setData(d => ({ ...d, dsaTopics: { ...d.dsaTopics, [id]: d.dsaTopics?.[id] ? undefined : { done: true } } }))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>DSA Tracker</div><div style={S.t2}>3-year algorithms curriculum</div></div>
      <Grid cols={4} style={{ marginBottom: '1rem' }}>
        <Stat label="Topics Done" value={`${totalDone}/18`} color="#3B82F6" sub={`${Math.round(totalDone/18*100)}% complete`} />
        <Stat label="Total Solved" value={data.lc || 0} color="#22C55E" sub="all platforms" />
        <Stat label="Easy / Med / Hard" value={`${data.lcE||0}/${data.lcM||0}/${data.lcH||0}`} color="#F59E0B" sub="breakdown" />
        <div style={{ ...S.card, marginBottom: 0, cursor: 'pointer' }} onClick={() => {
          const t = parseInt(window.prompt('Total:', data.lc || 0)); if (isNaN(t)) return
          const e = parseInt(window.prompt('Easy:', data.lcE || 0)) || 0
          const m = parseInt(window.prompt('Medium:', data.lcM || 0)) || 0
          setData(d => ({ ...d, lc: t, lcE: e, lcM: m, lcH: Math.max(0, t - e - m) }))
        }}>
          <div style={S.label}>Update Count</div>
          <div style={{ fontSize: '.82rem', color: '#3B82F6', marginTop: 4 }}>Click to update →</div>
        </div>
      </Grid>

      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Phase Progress</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {phases.map(ph => {
            const items = grouped[ph] || [], done = items.filter(t => dt[t.id]).length, c = PHASE_COLORS[ph]
            return (
              <div key={ph} style={{ flex: 1, textAlign: 'center' }}>
                <div style={S.pbar}><div style={S.pfill(items.length ? (done / items.length) * 100 : 0, c)} /></div>
                <div style={{ fontSize: '.6rem', color: '#64748B', marginTop: 4 }}>{ph}</div>
                <div style={{ fontSize: '.65rem', fontFamily: 'monospace', color: c }}>{done}/{items.length}</div>
              </div>
            )
          })}
        </div>
      </div>

      {phases.map(ph => {
        const items = grouped[ph] || [], done = items.filter(t => dt[t.id]).length, c = PHASE_COLORS[ph], isOpen = !!expanded[ph]
        return (
          <div key={ph} style={S.card}>
            <div onClick={() => setExpanded(e => ({ ...e, [ph]: !e[ph] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, color: c }}>{ph}</span>
                <span style={{ fontSize: '.72rem', color: '#64748B' }}>{done}/{items.length} complete</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 72, ...S.pbar }}><div style={S.pfill(items.length ? (done/items.length)*100 : 0, c)} /></div>
                <span style={{ color: '#64748B' }}>{isOpen ? '▾' : '▸'}</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E2736' }}>
                {items.map(t => (
                  <TopicCheck key={t.id} done={!!dt[t.id]} color={c} onToggle={() => toggle(t.id)}>
                    <div style={{ fontSize: '.82rem', color: dt[t.id] ? '#475569' : '#E2E8F0', textDecoration: dt[t.id] ? 'line-through' : 'none' }}>{t.label}</div>
                    <div style={{ fontSize: '.68rem', color: '#64748B', marginTop: 1 }}>{t.time}</div>
                  </TopicCheck>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <Alert type="info"><strong>Golden Rule:</strong> Never look at a solution before 25 minutes. After solving, read the top 2 Discuss solutions to learn the better approach.</Alert>
    </div>
  )
}

// ─── WEB DEV ──────────────────────────────────────────────────────────────────
function WebDev({ data, setData }) {
  const wt = data.webTopics || {}
  const [expanded, setExpanded] = useState({ 'Frontend 1': true, 'Frontend 2': true })
  const phases = [...new Set(WEB_TOPICS.map(t => t.phase))]
  const grouped = WEB_TOPICS.reduce((acc, t) => { if (!acc[t.phase]) acc[t.phase] = []; acc[t.phase].push(t); return acc }, {})
  const totalDone = WEB_TOPICS.filter(t => wt[t.id]).length
  const toggle = id => setData(d => ({ ...d, webTopics: { ...d.webTopics, [id]: d.webTopics?.[id] ? undefined : { done: true } } }))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>Web Dev Tracker</div><div style={S.t2}>Frontend → Backend → Full Stack · Apna College Sigma 11</div></div>
      <Grid cols={4} style={{ marginBottom: '1rem' }}>
        <Stat label="Topics Done" value={`${totalDone}/${WEB_TOPICS.length}`} color="#3B82F6" sub={`${Math.round(totalDone/WEB_TOPICS.length*100)}%`} />
        <Stat label="GitHub Projects" value={(data.projects || []).filter(p => p.githubUrl).length} color="#22C55E" sub="target: 2 by Year 1" />
        <Stat label="Course Start" value="Jun 30" color="#F59E0B" sub="Apna College Sigma 11" />
        <Stat label="Current Phase" value={phases.find(p => (grouped[p] || []).some(t => !wt[t.id])) || 'Complete'} color="#A78BFA" sub="active phase" />
      </Grid>
      {phases.map(ph => {
        const items = grouped[ph] || [], done = items.filter(t => wt[t.id]).length, c = WEB_COLORS[ph] || '#94A3B8', isOpen = !!expanded[ph]
        return (
          <div key={ph} style={S.card}>
            <div onClick={() => setExpanded(e => ({ ...e, [ph]: !e[ph] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, color: c }}>{ph}</span>
                <span style={{ fontSize: '.72rem', color: '#64748B' }}>{done}/{items.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 72, ...S.pbar }}><div style={S.pfill((done/items.length)*100, c)} /></div>
                <span style={{ color: '#64748B' }}>{isOpen ? '▾' : '▸'}</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E2736' }}>
                {items.map(t => (
                  <TopicCheck key={t.id} done={!!wt[t.id]} color={c} onToggle={() => toggle(t.id)}>
                    <div style={{ fontSize: '.82rem', color: wt[t.id] ? '#475569' : '#E2E8F0', textDecoration: wt[t.id] ? 'line-through' : 'none' }}>{t.label}</div>
                    <div style={{ fontSize: '.68rem', color: '#64748B', marginTop: 1 }}>{t.time}</div>
                    <div style={{ fontSize: '.68rem', color: c, marginTop: 1 }}>→ {t.del}</div>
                  </TopicCheck>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <Alert type="info"><strong>Rule:</strong> Every project on GitHub. Write README.md. Never watch tutorials without coding along.</Alert>
    </div>
  )
}

// ─── CGPA ─────────────────────────────────────────────────────────────────────
function CGPA({ data, setData }) {
  const marks = data.semMarks || {}
  const dc = { Low: '#22C55E', Medium: '#F59E0B', High: '#EF4444' }
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>CGPA Tracker</div><div style={S.t2}>Target: 8.6+ · Never drop below B+ in any subject</div></div>
      <Grid cols={3} style={{ marginBottom: '1rem' }}>
        <Stat label="Semester 1" value={data.sem1 || 7.6} color="#F59E0B" />
        <Stat label="Semester 2" value={data.sem2 || 8.3} color="#3B82F6" />
        <Stat label="Target CGPA" value="8.6+" color="#22C55E" />
      </Grid>
      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Semester 3 Subjects</div>
        {SUBJECTS.map(sub => (
          <div key={sub.id} style={{ padding: '.65rem 0', borderBottom: '1px solid #1E2736', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.84rem', fontWeight: 500 }}>{sub.label}</div>
              <div style={{ fontSize: '.7rem', color: '#64748B', marginTop: 2 }}>{sub.tip}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '.7rem', color: dc[sub.diff] }}>{sub.diff}</span>
              <span style={S.badge('#22C55E')}>{sub.target}</span>
              <input type="number" min={0} max={100} placeholder="Marks" value={marks[sub.id] || ''} onChange={e => setData(d => ({ ...d, semMarks: { ...d.semMarks, [sub.id]: e.target.value } }))} style={{ ...S.input, width: 60, textAlign: 'center', fontFamily: 'monospace' }} />
            </div>
          </div>
        ))}
      </div>
      <Alert type="warn"><strong>Critical:</strong> Data Structures and OOP are easy A+s — your DSA self-study gives you an edge. Discrete Math is your biggest CGPA risk — start NPTEL before college begins.</Alert>
    </div>
  )
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ data, setData }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', tech: '', githubUrl: '', liveUrl: '', status: 'Planning' })
  const projects = data.projects || []

  const add = () => {
    if (!form.name.trim()) return
    setData(d => ({ ...d, projects: [...(d.projects || []), { ...form, id: Date.now() + '', createdAt: new Date().toISOString() }] }))
    setForm({ name: '', description: '', tech: '', githubUrl: '', liveUrl: '', status: 'Planning' })
    setShowForm(false)
  }
  const upd = (id, patch) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...patch } : p) }))
  const del = id => { if (window.confirm('Delete project?')) setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) })) }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><div style={S.t1}>Projects</div><div style={S.t2}>Target: 2 deployed by Year 1 · Every project on GitHub</div></div>
        <button style={S.btnP} onClick={() => setShowForm(s => !s)}>+ Add Project</button>
      </div>

      {showForm && (
        <div style={S.card}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>New Project</div>
          <Grid cols={2}>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Project Name *</div><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. To-Do App" style={S.input} /></div>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Status</div><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...S.select, width: '100%' }}>{PSTATUS.map(s => <option key={s}>{s}</option>)}</select></div>
          </Grid>
          <div style={{ marginBottom: 10 }}><div style={S.label}>Description</div><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does it do?" style={{ ...S.textarea, height: 70 }} /></div>
          <Grid cols={2}>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Tech Stack</div><input value={form.tech} onChange={e => setForm(f => ({ ...f, tech: e.target.value }))} placeholder="React, Node.js, MongoDB" style={S.input} /></div>
            <div style={{ marginBottom: 10 }}><div style={S.label}>GitHub URL</div><input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." style={S.input} /></div>
          </Grid>
          <div style={{ marginBottom: 12 }}><div style={S.label}>Live URL</div><input value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." style={S.input} /></div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button style={S.btnG} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={S.btnP} onClick={add}>Save Project</button>
          </div>
        </div>
      )}

      {projects.length === 0
        ? <div style={{ ...S.card, textAlign: 'center', padding: '2.5rem' }}><div style={{ fontSize: '1.5rem', marginBottom: 10 }}>◆</div><div style={{ fontWeight: 600 }}>No projects yet</div><div style={{ fontSize: '.82rem', color: '#64748B', marginTop: 4 }}>Start with a simple HTML/CSS page this week.</div></div>
        : <Grid cols={2}>{projects.map(p => (
            <div key={p.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '.68rem', color: PCOLORS[p.status], fontWeight: 600 }}>{p.status}</span>
                  <button style={{ ...S.btnG, padding: '.2rem .4rem', fontSize: '.72rem' }} onClick={() => del(p.id)}>✕</button>
                </div>
              </div>
              {p.description && <div style={{ fontSize: '.78rem', color: '#94A3B8', marginBottom: 8, lineHeight: 1.5 }}>{p.description}</div>}
              {p.tech && <div style={{ marginBottom: 8 }}>{p.tech.split(',').map(t => <span key={t} style={{ ...S.badge('#94A3B8'), marginRight: 4, marginBottom: 4 }}>{t.trim()}</span>)}</div>}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ ...S.btnG, fontSize: '.72rem', padding: '.22rem .55rem', textDecoration: 'none' }}>GitHub ↗</a>}
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ ...S.btnG, fontSize: '.72rem', padding: '.22rem .55rem', textDecoration: 'none' }}>Live ↗</a>}
                <select value={p.status} onChange={e => upd(p.id, { status: e.target.value })} style={{ ...S.select, fontSize: '.72rem', padding: '.22rem .4rem' }}>
                  {PSTATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}</Grid>
      }
    </div>
  )
}

// ─── INTERNSHIPS ──────────────────────────────────────────────────────────────
function Internships({ data, setData }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company: '', role: '', platform: '', appliedDate: '', status: 'Applied', notes: '' })
  const ints = data.internships || []

  const add = () => {
    if (!form.company.trim()) return
    setData(d => ({ ...d, internships: [...(d.internships || []), { ...form, id: Date.now() + '', createdAt: new Date().toISOString() }] }))
    setForm({ company: '', role: '', platform: '', appliedDate: '', status: 'Applied', notes: '' })
    setShowForm(false)
  }
  const upd = (id, patch) => setData(d => ({ ...d, internships: d.internships.map(i => i.id === id ? { ...i, ...patch } : i) }))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><div style={S.t1}>Internship Tracker</div><div style={S.t2}>Target: 1 secured by Summer 2027</div></div>
        <button style={S.btnP} onClick={() => setShowForm(s => !s)}>+ Log Application</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {ISTATUS.map(s => (
          <div key={s} style={{ flexShrink: 0, background: '#0F1318', border: '1px solid #1E2736', borderRadius: 8, padding: '.45rem .65rem', textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: ICOLORS[s] }}>{ints.filter(i => i.status === s).length}</div>
            <div style={{ fontSize: '.62rem', color: '#64748B', marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={S.card}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Log Application</div>
          <Grid cols={2}>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Company *</div><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Google" style={S.input} /></div>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Role</div><input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="SDE Intern" style={S.input} /></div>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Platform</div><input value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} placeholder="LinkedIn / Internshala" style={S.input} /></div>
            <div style={{ marginBottom: 10 }}><div style={S.label}>Applied Date</div><input type="date" value={form.appliedDate} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} style={S.input} /></div>
          </Grid>
          <div style={{ marginBottom: 12 }}><div style={S.label}>Notes</div><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes..." style={{ ...S.textarea, height: 60 }} /></div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button style={S.btnG} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={S.btnP} onClick={add}>Save</button>
          </div>
        </div>
      )}

      {ints.length === 0
        ? <div style={{ ...S.card, textAlign: 'center', padding: '2.5rem' }}><div style={{ fontWeight: 600 }}>No applications yet</div><div style={{ fontSize: '.82rem', color: '#64748B', marginTop: 4 }}>Start applying Jan–Feb 2027. Create Internshala and LinkedIn now.</div></div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...ints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(app => (
              <div key={app.id} style={{ ...S.cardsm, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{app.company}</div>
                  {(app.role || app.platform) && <div style={{ fontSize: '.72rem', color: '#64748B' }}>{[app.role, app.platform].filter(Boolean).join(' · ')}</div>}
                  {app.notes && <div style={{ fontSize: '.75rem', color: '#94A3B8', marginTop: 2 }}>{app.notes}</div>}
                </div>
                <select value={app.status} onChange={e => upd(app.id, { status: e.target.value })} style={{ ...S.select, color: ICOLORS[app.status] }}>
                  {ISTATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio({ data, setData }) {
  const prof = data.profile || { name: 'Ayush', college: 'BPIT Delhi', branch: 'BTech CSE', target: '10 LPA', gradYear: '2029' }
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(prof)
  const resumeChecks = data.resumeChecks || {}
  const autoChecks = {
    'First project on GitHub': (data.projects || []).some(p => p.githubUrl),
    'First deployed project': (data.projects || []).some(p => p.status === 'Deployed'),
    'Internship experience added': (data.internships || []).some(i => i.status === 'Offer'),
  }
  const checkLabels = ['GitHub account created', 'LinkedIn profile complete', 'First project on GitHub', 'Resume draft created', 'First deployed project', 'Internship experience added']

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>Portfolio</div><div style={S.t2}>Grows as you build. Start empty, fill over time.</div></div>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: '.875rem' }}>Profile</div>
          <button style={S.btnG} onClick={() => { if (editing) { setData(d => ({ ...d, profile: form })); setEditing(false) } else setEditing(true) }}>{editing ? 'Save' : 'Edit'}</button>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>A</div>
          {editing
            ? <Grid cols={2} style={{ flex: 1 }}>
                {['name','college','branch','target','gradYear'].map(k => (
                  <div key={k} style={{ marginBottom: 8 }}><div style={S.label}>{k}</div><input value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={S.input} /></div>
                ))}
              </Grid>
            : <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{prof.name}</div>
                <div style={{ fontSize: '.84rem', color: '#94A3B8' }}>{prof.branch} · {prof.college}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <span style={S.badge('#3B82F6')}>Graduation {prof.gradYear}</span>
                  <span style={S.badge('#22C55E')}>Target: {prof.target}</span>
                </div>
              </div>
          }
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Projects ({(data.projects||[]).length})</div>
        {(data.projects||[]).length === 0
          ? <div style={{ fontSize: '.82rem', color: '#64748B' }}>No projects yet. Build your first HTML/CSS page this week.</div>
          : (data.projects||[]).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '.45rem 0', borderBottom: '1px solid #1E2736' }}>
                <div><span style={{ fontWeight: 500, fontSize: '.84rem' }}>{p.name}</span>{p.tech && <span style={{ fontSize: '.72rem', color: '#64748B' }}> · {p.tech}</span>}</div>
                <span style={{ fontSize: '.68rem', color: PCOLORS[p.status] }}>{p.status}</span>
              </div>
            ))
        }
      </div>

      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Resume Readiness</div>
        {checkLabels.map(label => {
          const isAuto = autoChecks[label] !== undefined
          const done = isAuto ? autoChecks[label] : (resumeChecks[label] || false)
          const toggle = () => { if (isAuto) return; setData(d => ({ ...d, resumeChecks: { ...d.resumeChecks, [label]: !d.resumeChecks?.[label] } })) }
          return (
            <div key={label} onClick={toggle} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '.35rem 0', borderBottom: '1px solid #1E2736', cursor: isAuto ? 'default' : 'pointer' }}>
              <div style={{ width: 17, height: 17, borderRadius: 4, background: done ? '#22C55E' : '#1C2230', border: `1.5px solid ${done ? '#22C55E' : '#2A3547'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                {done && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <span style={{ fontSize: '.82rem', color: done ? '#475569' : '#E2E8F0', textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
              {!isAuto && <span style={{ fontSize: '.65rem', color: '#475569', marginLeft: 'auto' }}>click to toggle</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
const SUMMER_SCHEDULE = [
  { time: '6:50 AM', block: 'Wake Up', desc: 'Alarm — 1 snooze max (10 min). Up by 7:00 AM.', color: '#F59E0B' },
  { time: '7:00–7:30', block: 'Morning Routine', desc: 'Freshen up · water · light breakfast. PHONE STAYS DOWN.', color: '#F59E0B' },
  { time: '7:30–7:45', block: 'Primer', desc: 'Write 3 goals for today in notebook. 2 min fantasy writing allowed.', color: '#F59E0B' },
  { time: '7:45–9:45', block: '★ DSA BLOCK 1', desc: 'C++ / DSA topic study — Apna College. Active coding only. PEAK WINDOW.', color: '#3B82F6' },
  { time: '9:45–10:00', block: 'Break', desc: 'Walk outside PG · water · no phone.', color: '#475569' },
  { time: '10:00–12:00', block: '★ DSA BLOCK 2', desc: 'Practice problems on today\'s topic. Attempt → struggle → attempt again. 25 min before looking at hint.', color: '#3B82F6' },
  { time: '12:00–12:45', block: 'Lunch', desc: 'Eat properly. Rest. Short fantasy writing if needed.', color: '#475569' },
  { time: '12:45–1:00', block: 'Rest', desc: 'Eyes closed 15 min max. Not more.', color: '#475569' },
  { time: '1:00–2:30', block: 'Web Dev', desc: 'Apna College Sigma 11 — HTML/CSS/JS (starts Jun 30). Before Jun 30: extra C++ practice.', color: '#A78BFA' },
  { time: '2:30–3:00', block: 'Review', desc: 'Re-read today\'s DSA notes. Write 3 things learned.', color: '#22C55E' },
  { time: '3:00–5:00', block: '★ FREE TIME', desc: 'Rest · social · entertainment · fantasy writing. Guilt-free. This is designed recovery.', color: '#334155' },
  { time: '5:00–6:30', block: 'DSA BLOCK 3', desc: 'Revisit unsolved problems. Read editorial only if stuck 30+ min. Optional but powerful.', color: '#3B82F6' },
  { time: '6:30–7:30', block: 'Walk / Exercise', desc: 'Get outside. Any movement counts. Non-negotiable for energy.', color: '#22C55E' },
  { time: '7:30–9:00', block: 'Evening Study', desc: 'Web Dev (odd days) OR Discrete/Comp Math revision (even days). Alternate.', color: '#A78BFA' },
  { time: '9:00–9:30', block: 'Dinner + Unwind', desc: 'Eat. Music. No heavy content.', color: '#475569' },
  { time: '9:30–10:00', block: '★ SCORECARD', desc: 'Fill daily check-in. Rate the day. Plan tomorrow. NON-NEGOTIABLE.', color: '#EF4444' },
  { time: '10:00–10:30', block: 'Fantasy / Reading', desc: 'Your creative outlet. ChatGPT stories, reading. Earned reward.', color: '#334155' },
  { time: '10:30 PM', block: 'LIGHTS OUT', desc: 'Phone on charge across the room. Sleep. 8 hour target.', color: '#0F172A' },
]
const COLLEGE_LIGHT_SCHEDULE = [
  { time: '6:50 AM', block: 'Wake Up', desc: 'Alarm — 1 snooze max (10 min).', color: '#F59E0B' },
  { time: '7:00–7:30', block: 'Morning Routine', desc: 'Freshen up · 3 goals written · no phone.', color: '#F59E0B' },
  { time: '7:30–9:00', block: '★ DSA BLOCK 1', desc: '90 min focused DSA before college. SACRED — never skip even on college days.', color: '#3B82F6' },
  { time: '9:30–2:30', block: 'COLLEGE', desc: 'Attend everything. Take notes actively. Ask questions. This is your CGPA.', color: '#22C55E' },
  { time: '2:30–3:00', block: 'Lunch + Rest', desc: 'Decompress after college. Eat properly.', color: '#475569' },
  { time: '3:00–5:00', block: 'DSA Practice', desc: 'Apply what was studied in the morning. LeetCode problems on current topic.', color: '#3B82F6' },
  { time: '5:00–6:30', block: 'Web Dev', desc: 'Apna College Sigma 11 — follow curriculum strictly.', color: '#A78BFA' },
  { time: '6:30–7:30', block: 'Walk + Dinner', desc: 'Get outside. Eat. No study.', color: '#475569' },
  { time: '7:30–8:30', block: 'College Subjects', desc: 'Discrete Math / OOP / Data Structures — stay current with lectures.', color: '#22C55E' },
  { time: '8:30–9:00', block: 'Light DSA Review', desc: 'Re-read today\'s notes only. No new problems. Retention without strain.', color: '#3B82F6' },
  { time: '9:00–9:30', block: '★ SCORECARD', desc: 'Fill daily check-in. Plan tomorrow.', color: '#EF4444' },
  { time: '10:30 PM', block: 'LIGHTS OUT', desc: 'Sleep.', color: '#0F172A' },
]
const COLLEGE_HEAVY_SCHEDULE = [
  { time: '6:50 AM', block: 'Wake Up', desc: 'Alarm. Goals written before phone.', color: '#F59E0B' },
  { time: '7:30–8:45', block: '★ DSA BLOCK 1', desc: '75 min — shorter but PRESENT. Never skip even on heavy days.', color: '#3B82F6' },
  { time: '9:30–5:10', block: 'COLLEGE (Tue)', desc: 'Full day — complete attention in class. Or 9:30–3:20 (Thu/Fri).', color: '#22C55E' },
  { time: '5:30–6:30', block: 'Walk + Dinner', desc: 'Mandatory recovery after heavy college day.', color: '#475569' },
  { time: '6:30–8:00', block: 'Web Dev OR College', desc: 'Alternate days. Do NOT do both on heavy days. Pick one.', color: '#A78BFA' },
  { time: '8:00–8:30', block: 'Light Review', desc: 'Re-read today\'s notes only. No new problems.', color: '#3B82F6' },
  { time: '8:30–9:00', block: '★ SCORECARD', desc: 'Fill daily check-in.', color: '#EF4444' },
  { time: '10:30 PM', block: 'LIGHTS OUT', desc: 'Sleep.', color: '#0F172A' },
]
const WEEK_PLAN = [
  { week: 'Week 1', dates: 'Jun 26 – Jul 2', dsa: 'C++ complete basics: variables, loops, functions, arrays, strings, pointers', dev: 'HTML structure and tags (Sigma 11 starts Jun 30)', goal: 'Build coding habit. Hit 6/7 days. Write first 10 C++ programs.' },
  { week: 'Week 2', dates: 'Jul 3 – Jul 9', dsa: 'C++ OOP: classes, objects, constructors, inheritance, polymorphism', dev: 'CSS: selectors, box model, flexbox, basic responsive design', goal: 'Write 3 OOP programs daily. Create GitHub account. First push.' },
  { week: 'Week 3', dates: 'Jul 10 – Jul 16', dsa: 'Arrays, Strings, Time Complexity (Big O), Recursion basics', dev: 'CSS continued + intro JavaScript variables, functions, DOM', goal: 'Create LeetCode account. Solve 5 easy array problems.' },
  { week: 'Week 4', dates: 'Jul 17 – Jul 23', dsa: 'Recursion deep dive + Searching & Sorting intro', dev: 'JavaScript: events, DOM manipulation, first mini-project', goal: '10 LeetCode Easy total. Mini project on GitHub.' },
  { week: 'Buffer', dates: 'Jul 24 – Jul 27', dsa: 'Revise all 4 weeks. Re-attempt unsolved problems.', dev: 'Complete mini-project. Deploy on GitHub Pages.', goal: 'Enter college with a streak and a deployed project.' },
]

function Schedule() {
  const [tab, setTab] = useState('summer')
  const schedules = { summer: SUMMER_SCHEDULE, light: COLLEGE_LIGHT_SCHEDULE, heavy: COLLEGE_HEAVY_SCHEDULE }
  const tabs = [['summer', 'Summer Break', 'Jun 26 – Jul 27'], ['light', 'College Light Day', 'Mon/Wed'], ['heavy', 'College Heavy Day', 'Tue/Thu/Fri']]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>Daily Schedule</div><div style={S.t2}>Hour-by-hour · Colour-coded · Summer Break then College</div></div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tabs.map(([id, label, sub]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '.4rem .75rem', borderRadius: 8, fontSize: '.78rem', fontWeight: 500, cursor: 'pointer', border: `1px solid ${tab === id ? '#3B82F6' : '#1E2736'}`, background: tab === id ? '#3B82F6' : 'transparent', color: tab === id ? '#fff' : '#94A3B8', transition: 'all .15s' }}>
            {label}<br /><span style={{ fontSize: '.65rem', opacity: .75 }}>{sub}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: '1.5rem' }}>
        {schedules[tab].map((b, i) => (
          <div key={i} style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #1E2736' }}>
            <div style={{ background: b.color, color: b.color === '#0F172A' ? '#94A3B8' : '#fff', padding: '.45rem .7rem', minWidth: 120, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '.6rem', fontFamily: 'monospace', opacity: .85 }}>{b.time}</div>
              <div style={{ fontSize: '.78rem', fontWeight: 600, marginTop: 1 }}>{b.block}</div>
            </div>
            <div style={{ background: '#151A22', padding: '.45rem .8rem', flex: 1, fontSize: '.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {tab === 'summer' && (
        <>
          <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Week-by-Week Summer Plan</div>
          {WEEK_PLAN.map(w => (
            <div key={w.week} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#3B82F6' }}>{w.week}</div>
                  <div style={{ fontSize: '.7rem', color: '#64748B', fontFamily: 'monospace' }}>{w.dates}</div>
                </div>
              </div>
              <Grid cols={2} style={{ marginBottom: 8 }}>
                <div><div style={S.label}>DSA</div><div style={{ fontSize: '.8rem', color: '#94A3B8' }}>{w.dsa}</div></div>
                <div><div style={S.label}>Dev</div><div style={{ fontSize: '.8rem', color: '#94A3B8' }}>{w.dev}</div></div>
              </Grid>
              <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 6, padding: '.4rem .65rem', fontSize: '.78rem', color: '#94A3B8' }}>
                <strong style={{ color: '#3B82F6' }}>Week Goal: </strong>{w.goal}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── ROADMAP ──────────────────────────────────────────────────────────────────
function Roadmap() {
  const years = [
    { year: 'Year 1', period: 'Jun 2026 – May 2027', color: '#3B82F6', tech: ['C++ complete', 'DSA foundations (Arrays → Trees)', 'Web Dev frontend (HTML/CSS/JS/React)', '100 LeetCode problems'], career: ['GitHub profile created', '2 projects deployed', 'LinkedIn complete', 'First internship applications'], target: 'CGPA 8.5+ · 100 LC · 2 GitHub projects · Basic resume ready' },
    { year: 'Year 2', period: 'Jun 2027 – May 2028', color: '#A78BFA', tech: ['DSA advanced (Graphs, DP, Tries)', 'Full Stack MERN', 'System Design basics', '250 LeetCode'], career: ['Apply for internships aggressively', 'Target: 1 internship secured', '3–4 GitHub projects', 'Strong resume'], target: '1 internship completed · 250 LC · 4 projects · Interview-ready' },
    { year: 'Year 3', period: 'Jun 2028 – Placement', color: '#22C55E', tech: ['DSA revision + company-specific prep', 'Mock interviews weekly', 'System Design', 'CP contests'], career: ['Campus placement season', 'Apply to every target company', 'Off-campus parallel'], target: 'On-campus placement at 8–15 LPA' },
  ]
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>3-Year Roadmap</div><div style={S.t2}>June 2026 → Placement 2028–29</div></div>
      {years.map(y => (
        <div key={y.year} style={{ ...S.card, borderLeft: `3px solid ${y.color}` }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: y.color, marginBottom: 2 }}>{y.year}</div>
          <div style={{ fontSize: '.72rem', color: '#64748B', fontFamily: 'monospace', marginBottom: 12 }}>{y.period}</div>
          <Grid cols={2} style={{ marginBottom: 10 }}>
            <div><div style={S.label}>Technical</div>{y.tech.map(t => <div key={t} style={{ fontSize: '.79rem', color: '#94A3B8', marginBottom: 2 }}>· {t}</div>)}</div>
            <div><div style={S.label}>Career</div>{y.career.map(c => <div key={c} style={{ fontSize: '.79rem', color: '#94A3B8', marginBottom: 2 }}>· {c}</div>)}</div>
          </Grid>
          <div style={{ background: y.color + '12', border: `1px solid ${y.color}28`, borderRadius: 6, padding: '.45rem .7rem', fontSize: '.79rem', color: '#94A3B8' }}>
            <strong style={{ color: y.color }}>End Target: </strong>{y.target}
          </div>
        </div>
      ))}
      <div style={S.card}>
        <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 10 }}>Target Companies at BPIT</div>
        {[{ tier: 'Primary (8–17 LPA)', companies: 'ZS Associates, Hashedin, Cvent, ION Group, RTDS, Chaayos', color: '#3B82F6' }, { tier: 'Solid Backup (6–8 LPA)', companies: 'Compro, Josh Technology, Daffodil, Avalon, Gemini Solutions', color: '#22C55E' }, { tier: 'Stretch Goal (20–50 LPA)', companies: 'Juspay, Amazon, Microsoft, FNZ Group', color: '#A78BFA' }].map(({ tier, companies, color }) => (
          <div key={tier} style={{ padding: '.55rem 0', borderBottom: '1px solid #1E2736', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 140, fontSize: '.72rem', color, fontWeight: 600, flexShrink: 0 }}>{tier}</div>
            <div style={{ fontSize: '.79rem', color: '#94A3B8' }}>{companies}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── NOTES / JOURNAL ──────────────────────────────────────────────────────────
function Notes({ data, setData }) {
  const [text, setText] = useState('')
  const [mood, setMood] = useState('neutral')
  const notes = data.notes || []
  const moodColors = { great: '#22C55E', good: '#3B82F6', neutral: '#64748B', tough: '#F59E0B', bad: '#EF4444' }

  const add = () => {
    if (!text.trim()) return
    setData(d => ({ ...d, notes: [{ id: Date.now() + '', text: text.trim(), mood, createdAt: new Date().toISOString() }, ...(d.notes || [])] }))
    setText('')
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>Journal</div><div style={S.t2}>Private notes. Think out loud. No one's watching.</div></div>
      <div style={S.card}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {Object.entries(moodColors).map(([m, c]) => (
            <button key={m} onClick={() => setMood(m)} style={{ padding: '.25rem .55rem', borderRadius: 6, fontSize: '.72rem', cursor: 'pointer', border: `1px solid ${mood === m ? c : '#1E2736'}`, background: mood === m ? c : 'transparent', color: mood === m ? '#fff' : '#64748B', textTransform: 'capitalize', transition: 'all .15s' }}>{m}</button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind? What happened today? What are you avoiding and why?" style={{ ...S.textarea, height: 110, fontSize: '.875rem', lineHeight: 1.6 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button style={S.btnP} onClick={add}>Save Entry</button>
        </div>
      </div>
      {notes.length === 0
        ? <div style={{ color: '#64748B', fontSize: '.82rem', textAlign: 'center', padding: '1.5rem' }}>No entries yet. Write something.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {notes.map(n => (
              <div key={n.id} style={S.cardsm}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '.68rem', color: '#64748B', fontFamily: 'monospace' }}>{(n.createdAt || '').slice(0, 10)}</span>
                  {n.mood && <span style={{ fontSize: '.68rem', color: moodColors[n.mood] || '#64748B', textTransform: 'capitalize' }}>{n.mood}</span>}
                </div>
                <div style={{ fontSize: '.82rem', color: '#94A3B8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{n.text}</div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

// ─── WHY ──────────────────────────────────────────────────────────────────────
function Why({ data, setData }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(data.whyText || '')
  const truths = [
    { title: 'The Reality', body: 'The floor at BPIT is Accenture at 4.5 LPA. Dozens land there every year with zero preparation. You are not building toward the floor.' },
    { title: 'Your Reference Point', body: "The girl who cracked Microsoft in 3rd year and converted to PPO at 53 LPA — she started exactly where you are. The difference between her story and yours is not intelligence. It is consistency over time. You don't need her number. You need your baseline secured." },
    { title: 'The Math', body: 'Follow 80%+ → 8–15 LPA. Follow 60–70% → 6–9 LPA. Follow less than 40% → Accenture floor. The math is not against you. Time is not against you. Only unchecked drift is.' },
    { title: 'What You Said', body: '"If I decide something and commit fully, I can do things." You said that. Class 10: 86%, Semester 2: 8.3+. The conditions are engineered into this system. Show up and it works.' },
  ]
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}><div style={S.t1}>My Why</div><div style={S.t2}>Read this when motivation drops. Especially then.</div></div>
      <MentorMsg msg="You told me you'd stay committed if you could see honest growth. You told me you'd quit if you couldn't see daily progress. Both of those things live here — in what you're building toward and what you check every night." />
      <div style={{ height: '1rem' }} />
      {truths.map(({ title, body }) => (
        <div key={title} style={{ ...S.card, borderLeft: '3px solid #3B82F6' }}>
          <div style={{ fontWeight: 600, color: '#3B82F6', marginBottom: 6, fontSize: '.875rem' }}>{title}</div>
          <div style={{ fontSize: '.82rem', color: '#94A3B8', lineHeight: 1.65 }}>{body}</div>
        </div>
      ))}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 600, fontSize: '.875rem' }}>In My Own Words</div>
          <button style={S.btnG} onClick={() => { if (editing) { setData(d => ({ ...d, whyText: text })); setEditing(false) } else setEditing(true) }}>{editing ? 'Save' : 'Write'}</button>
        </div>
        {editing
          ? <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Why does this matter to you? Who are you doing this for? What are you building toward?" style={{ ...S.textarea, height: 130, fontSize: '.875rem', lineHeight: 1.6 }} />
          : <div style={{ fontSize: '.875rem', color: data.whyText ? '#94A3B8' : '#475569', lineHeight: 1.65, fontStyle: data.whyText ? 'italic' : 'normal', whiteSpace: 'pre-wrap' }}>{data.whyText || "You haven't written this yet. Write it when you're ready. It's the most important thing on this page."}</div>
        }
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [locked, setLocked] = useState(() => {
    const last = localStorage.getItem('aos_unlocked')
    return !last || Date.now() - parseInt(last) > 8 * 60 * 60 * 1000
  })
  const [page, setPage] = useState('dashboard')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [data, setDataRaw] = useState(() => ls.get('aos_data', { lc: 0, lcE: 0, lcM: 0, lcH: 0, dsaTopics: {}, webTopics: {}, projects: [], internships: [], notes: [], semMarks: {}, sem1: 7.6, sem2: 8.3, profile: { name: 'Ayush', college: 'BPIT Delhi', branch: 'BTech CSE', target: '10 LPA', gradYear: '2029' }, whyText: '', resumeChecks: {} }))
  const [logs, setLogsRaw] = useState(() => ls.get('aos_logs', {}))

  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      ls.set('aos_data', next)
      return next
    })
  }, [])

  const saveLogs = useCallback((newLogs) => {
    setLogsRaw(newLogs)
    ls.set('aos_logs', newLogs)
  }, [])

  const unlock = () => { localStorage.setItem('aos_unlocked', Date.now() + ''); setLocked(false) }
  const lock = () => { localStorage.removeItem('aos_unlocked'); setLocked(true) }
  const streak = getStreak(logs)

  useEffect(() => {
    document.body.style.background = '#0A0D12'
    document.body.style.color = '#E2E8F0'
    document.body.style.margin = '0'
  }, [])

  // Mobile sidebar responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (locked) return <PinScreen onUnlock={unlock} />

  const pageProps = { data, setData, logs, saveLogs, page, setPage, recoveryMode, setRecoveryMode }
  const pages = { dashboard: <Dashboard {...pageProps} />, checkin: <CheckIn {...pageProps} />, progress: <Progress {...pageProps} />, dsa: <DSATracker {...pageProps} />, webdev: <WebDev {...pageProps} />, cgpa: <CGPA {...pageProps} />, projects: <Projects {...pageProps} />, internships: <Internships {...pageProps} />, portfolio: <Portfolio {...pageProps} />, schedule: <Schedule />, roadmap: <Roadmap />, notes: <Notes {...pageProps} />, why: <Why {...pageProps} /> }

  const sidebarEl = <Sidebar page={page} setPage={(p) => { setPage(p); setSidebarOpen(false) }} streak={streak} recoveryMode={recoveryMode} onLock={lock} />

  if (isMobile) {
    return (
      <div style={{ background: '#0A0D12', minHeight: '100vh' }}>
        {/* Mobile top bar */}
        <div style={{ background: '#0F1318', borderBottom: '1px solid #1E2736', padding: '.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 200 }}>
          <div style={{ fontWeight: 700 }}>Ayush OS</div>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'transparent', border: '1px solid #1E2736', borderRadius: 6, color: '#E2E8F0', padding: '.3rem .6rem', cursor: 'pointer', fontSize: '.8rem' }}>☰ Menu</button>
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 300 }} onClick={() => setSidebarOpen(false)}>
            <div style={{ ...S.sidebar, width: 240, boxShadow: '4px 0 24px rgba(0,0,0,.5)' }} onClick={e => e.stopPropagation()}>
              {sidebarEl}
            </div>
          </div>
        )}
        <div style={{ padding: '1rem' }}>{pages[page] || pages.dashboard}</div>
      </div>
    )
  }

  return (
    <div style={S.shell}>
      {sidebarEl}
      <main style={S.main}>{pages[page] || pages.dashboard}</main>
    </div>
  )
}
