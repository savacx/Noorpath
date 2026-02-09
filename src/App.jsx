import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

function PromoBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <div className="promo-banner">
      <div className="promo-content">
        <span className="promo-icons">🔥 👑 🧠</span>
        <span className="promo-text">
          Unlock Premium Tests! Access exclusive cognitive challenges and advanced
          analytics
        </span>
      </div>
      <div className="promo-actions">
        <button className="promo-button" type="button">
          View Premium
        </button>
        <button
          className="promo-close"
          type="button"
          aria-label="Close"
          onClick={() => setVisible(false)}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

const useReactionSprint = () => {
  const [phase, setPhase] = useState('idle')
  const [lastTime, setLastTime] = useState(null)
  const [bestTime, setBestTime] = useState(null)
  const [history, setHistory] = useState([])
  const timerRef = useRef(null)
  const startRef = useRef(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const startReactionTest = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setPhase('waiting')
    const delay = 1200 + Math.random() * 2200
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('ready')
    }, delay)
  }

  const finishReactionTest = () => {
    const reactionTime = Math.max(0, Math.round(performance.now() - startRef.current))
    setLastTime(reactionTime)
    setBestTime((prev) => (prev === null ? reactionTime : Math.min(prev, reactionTime)))
    setHistory((prev) => {
      const next = [reactionTime, ...prev].slice(0, 5)
      return next
    })
    setPhase('result')
  }

  const handleReactionPad = () => {
    if (phase === 'idle') {
      startReactionTest()
      return
    }
    if (phase === 'waiting') {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      setPhase('too-soon')
      return
    }
    if (phase === 'ready') {
      finishReactionTest()
      return
    }
    if (phase === 'too-soon' || phase === 'result') {
      startReactionTest()
    }
  }

  const resetReactionTest = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setPhase('idle')
    setLastTime(null)
    setBestTime(null)
    setHistory([])
  }

  return {
    phase,
    lastTime,
    bestTime,
    history,
    startReactionTest,
    handleReactionPad,
    resetReactionTest,
  }
}

function ReactionSprintSection({ reaction, showOpenLink }) {
  return (
    <section id="reaction" className="section reaction">
      <div className="section-heading">
        <div>
          <p className="eyebrow">🔥 Reaction Sprint</p>
          <h2>Tap fast when the panel turns orange.</h2>
        </div>
        <div className="reaction-metrics">
          <div>
            <p className="stat-label">Last</p>
            <h3>{reaction.lastTime ? `${reaction.lastTime} ms` : '--'}</h3>
          </div>
          <div>
            <p className="stat-label">Best</p>
            <h3>{reaction.bestTime ? `${reaction.bestTime} ms` : '--'}</h3>
          </div>
        </div>
      </div>
      <div className="reaction-grid">
        <button
          type="button"
          className={`reaction-pad ${reaction.phase}`}
          onClick={reaction.handleReactionPad}
        >
          <span className="reaction-title">
            {reaction.phase === 'idle' && '👆 Click to begin'}
            {reaction.phase === 'waiting' && '⏳ Wait for orange...'}
            {reaction.phase === 'ready' && '🟧 Tap now!'}
            {reaction.phase === 'too-soon' && '⚠ Too soon -- tap to retry'}
            {reaction.phase === 'result' && '✨ Great! Tap to go again'}
          </span>
          <span className="reaction-subtitle">
            {reaction.phase === 'idle' && 'A random delay keeps you guessing.'}
            {reaction.phase === 'waiting' && "Stay focused and don't click early."}
            {reaction.phase === 'ready' && 'React as quickly as you can.'}
            {reaction.phase === 'too-soon' && "We'll restart with a new delay."}
            {reaction.phase === 'result' && 'Compare your score and beat your best.'}
          </span>
        </button>
        <div className="reaction-panel">
          <h3>How it works</h3>
          <p>
            Reaction Sprint measures your visual response time. Tap only after
            the panel turns orange to log a valid result.
          </p>
          <div className="history">
            <p className="stat-label">Recent attempts</p>
            <div className="history-list">
              {reaction.history.length === 0 && (
                <span>Complete a run to see results.</span>
              )}
              {reaction.history.map((time, index) => (
                <span key={`${time}-${index}`}>{time} ms</span>
              ))}
            </div>
          </div>
          <div className="reaction-actions">
            <button className="secondary" onClick={reaction.startReactionTest}>
              ▶ Start Test
            </button>
            {showOpenLink && (
              <Link className="ghost" to="/reaction-sprint">
                Open Full Page
              </Link>
            )}
            <button className="ghost" onClick={reaction.resetReactionTest}>
              ♻ Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  const navigate = useNavigate()
  const reaction = useReactionSprint()

  const coreTests = [
    {
      title: 'Reaction Sprint',
      description: 'Measure response speed to visual cues and track micro-improvements.',
      level: 'Easy',
      duration: '2 min',
      icon: '⏱️',
    },
    {
      title: 'Focus Aim',
      description: 'Sharpen precision and hand-eye timing with moving targets.',
      level: 'Medium',
      duration: '3 min',
      icon: '🎯',
    },
    {
      title: 'Number Recall',
      description: 'Remember growing sequences and build working memory stamina.',
      level: 'Medium',
      duration: '4 min',
      icon: '🔢',
    },
    {
      title: 'Verbal Map',
      description: 'Train rapid word retention and long-term vocabulary recall.',
      level: 'Hard',
      duration: '5 min',
      icon: '🔤',
    },
    {
      title: 'Pattern Grid',
      description: 'Recreate spatial patterns and expand visual memory range.',
      level: 'Medium',
      duration: '4 min',
      icon: '👁️',
    },
    {
      title: 'Logic Pulse',
      description: 'Solve timed reasoning puzzles under light pressure.',
      level: 'Hard',
      duration: '6 min',
      icon: '🧠',
    },
  ]

  const newTests = [
    {
      title: 'Emotion Scan',
      description: 'Identify expressions and read subtle facial cues.',
      level: 'Medium',
    },
    {
      title: 'Audio Thread',
      description: 'Match tones, rhythm, and spoken phrases with accuracy.',
      level: 'Medium',
    },
    {
      title: 'Pattern Shift',
      description: 'Spot micro-changes in moving sequences.',
      level: 'Hard',
    },
  ]

  return (
    <div className="app">
      <PromoBanner />
      <header className="hero" id="top">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark">N</span>
            <div>
              <p className="brand-title">Noorpath</p>
              <p className="brand-tag">Brain Test Studio</p>
            </div>
          </div>
          <div className="nav-links">
            <a href="#tests">Tests</a>
            <Link to="/reaction-sprint">Reaction</Link>
            <a href="#progress">Progress</a>
            <a href="#plans">Plans</a>
            <button className="ghost">Sign In</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">⚡ Cognitive training for real life</p>
            <h1>Build sharper focus with guided brain tests.</h1>
            <p className="lead">
              Noorpath blends micro-tests, adaptive challenges, and progress insights
              so you can train clarity, memory, and speed in just a few minutes a day.
            </p>
            <div className="hero-actions">
              <button className="primary">🚀 Start a Free Session</button>
              <button className="secondary">🧠 Explore Test Library</button>
            </div>
            <div className="hero-metrics">
              <div>
                <h3>8</h3>
                <p>🧩 Core test types</p>
              </div>
              <div>
                <h3>12 min</h3>
                <p>⏱ Average session</p>
              </div>
              <div>
                <h3>98%</h3>
                <p>✅ Completion rate</p>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <p className="card-title">🎯 Today's Focus Path</p>
              <span className="pill">Personalized</span>
            </div>
            <div className="hero-card-body">
              <div className="mini-row">
                <span className="mini-title">Warm-up</span>
                <span className="mini-value">Reaction Sprint - 2 min</span>
              </div>
              <div className="mini-row">
                <span className="mini-title">Core Block</span>
                <span className="mini-value">Pattern Grid - 4 min</span>
              </div>
              <div className="mini-row">
                <span className="mini-title">Challenge</span>
                <span className="mini-value">Logic Pulse - 6 min</span>
              </div>
              <div className="progress">
                <div className="progress-track">
                  <div className="progress-fill" />
                </div>
                <p>Weekly goal: 3 of 5 sessions completed</p>
              </div>
              <button className="primary full">▶ Resume Session</button>
            </div>
          </div>
        </div>
      </header>

      <section id="tests" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">🧪 Core Brain Tests</p>
            <h2>Train the essentials with science-backed routines.</h2>
          </div>
          <button className="ghost">👀 View All Tests</button>
        </div>
        <div className="card-grid">
          {coreTests.map((test) => (
            <article
              key={test.title}
              className={`test-card ${test.title === 'Reaction Sprint' ? 'clickable' : ''}`}
              onClick={() => {
                if (test.title === 'Reaction Sprint') {
                  navigate('/reaction-sprint')
                }
              }}
              role={test.title === 'Reaction Sprint' ? 'button' : undefined}
              tabIndex={test.title === 'Reaction Sprint' ? 0 : undefined}
              onKeyDown={(event) => {
                if (
                  test.title === 'Reaction Sprint' &&
                  (event.key === 'Enter' || event.key === ' ')
                ) {
                  navigate('/reaction-sprint')
                }
              }}
            >
              <div className="test-header">
                <div className="test-icon">{test.icon}</div>
                <div>
                  <h3>{test.title}</h3>
                  <p>{test.description}</p>
                </div>
              </div>
              <div className="test-divider" />
              <div className="test-footer">
                <div className={`test-level ${test.level.toLowerCase()}`}>
                  <span className="level-dot" />
                  {test.level}
                </div>
                <button className="share-pill" type="button">
                  ♡ Share
                </button>
                {test.title === 'Reaction Sprint' ? (
                  <button
                    className="start-pill"
                    type="button"
                    onClick={() => navigate('/reaction-sprint')}
                  >
                    Start Test
                  </button>
                ) : (
                  <button className="start-pill" type="button">
                    Start Test
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ReactionSprintSection reaction={reaction} showOpenLink />

      <section className="section alt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">🧬 New & Unique</p>
            <h2>Fresh challenges for advanced focus.</h2>
          </div>
          <span className="pill">Premium Preview</span>
        </div>
        <div className="split">
          <div className="stack">
            {newTests.map((test) => (
              <div key={test.title} className="mini-card">
                <div>
                  <h3>{test.title}</h3>
                  <p>{test.description}</p>
                </div>
                <span className="pill">{test.level}</span>
              </div>
            ))}
          </div>
          <div className="insight-card">
            <h3>Unlock deeper analytics</h3>
            <p>
              Track cognitive balance, trend lines, and personalized pacing tips
              with Noorpath Premium.
            </p>
            <ul className="ticks">
              <li>📈 Adaptive difficulty curves</li>
              <li>🎯 Focus stability scoring</li>
              <li>🗓 Weekly brain age insights</li>
            </ul>
            <button className="primary">⭐ Upgrade to Premium</button>
          </div>
        </div>
      </section>

      <section id="progress" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">📊 Progress Snapshot</p>
            <h2>See your growth in one clean dashboard.</h2>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Brain age</p>
            <h3>24.1 yrs</h3>
            <p className="stat-note">Based on last 5 sessions</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Consistency</p>
            <h3>6 day streak</h3>
            <p className="stat-note">Next milestone in 1 day</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Focus balance</p>
            <h3>82%</h3>
            <p className="stat-note">Strong memory and speed trend</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Global rank</p>
            <h3>#48,210</h3>
            <p className="stat-note">Up 12% this month</p>
          </div>
        </div>
        <div className="progress-panel">
          <div>
            <h3>Guided focus plan</h3>
            <p>
              Mix quick reaction work with deeper memory training. Noorpath
              automatically tunes the balance each week.
            </p>
          </div>
          <button className="secondary">📍 Open Dashboard</button>
        </div>
      </section>

      <section id="plans" className="section alt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">💳 Plans</p>
            <h2>Choose the pace that fits your routine.</h2>
          </div>
        </div>
        <div className="plans">
          <article className="plan-card">
            <div>
              <h3>Starter</h3>
              <p className="price">$0</p>
              <p className="plan-note">Perfect to explore core tests.</p>
              <ul>
                <li>8 core tests</li>
                <li>Weekly goals</li>
                <li>Community rankings</li>
              </ul>
            </div>
            <button className="secondary">✅ Start Free</button>
          </article>
          <article className="plan-card featured">
            <div className="plan-tag">Most popular</div>
            <div>
              <h3>Premium</h3>
              <p className="price">$2.10<span>/week</span></p>
              <p className="plan-note">Unlock deeper insight and new tests.</p>
              <ul>
                <li>All tests + early access</li>
                <li>Personalized insights</li>
                <li>Detailed progress reports</li>
                <li>Priority support</li>
              </ul>
            </div>
            <button className="primary">⬆ Upgrade</button>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="blog-card">
          <div>
            <p className="eyebrow">📚 Knowledge Lab</p>
            <h2>Learn the science behind brain testing.</h2>
            <p>
              Weekly guides on focus, memory, and habit formation from the
              Noorpath research desk.
            </p>
            <button className="secondary">🗞 Read the Field Notes</button>
          </div>
          <div className="blog-visual">
            <div className="orb" />
            <div className="orb small" />
            <p>Brain clarity starts with the right ritual.</p>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div>
          <h2>Ready to test your brain today?</h2>
          <p>Try a five-minute session and see your baseline instantly.</p>
        </div>
        <button className="primary">⚡ Get Started</button>
      </section>

      <footer className="footer">
        <div>
          <p className="brand-title">Noorpath</p>
          <p className="footer-note">
            Crafted for curious minds. Train with intention.
          </p>
        </div>
        <div className="footer-links">
          <a href="#tests">Tests</a>
          <a href="#progress">Progress</a>
          <a href="#plans">Plans</a>
          <a href="#top">Contact</a>
        </div>
      </footer>
    </div>
  )
}

function ReactionSprintPage() {
  const reaction = useReactionSprint()

  return (
    <div className="app">
      <PromoBanner />
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark">N</span>
            <div>
              <p className="brand-title">Noorpath</p>
              <p className="brand-tag">Brain Test Studio</p>
            </div>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/reaction-sprint">Reaction</Link>
          </div>
        </nav>
        <div className="reaction-page" />
      </header>

      <ReactionSprintSection reaction={reaction} showOpenLink={false} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reaction-sprint" element={<ReactionSprintPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
