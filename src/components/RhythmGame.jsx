import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, Star, Zap } from 'lucide-react'
import { drumPatterns } from '../data/yinggeData'

const NOTE_KEYS = ['d', 'f', 'j', 'k']
const NOTE_LABELS = ['咚', '锵', '咚', '锵']

function RhythmGame() {
  const [gameState, setGameState] = useState('idle')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [notes, setNotes] = useState([])
  const [pressedKeys, setPressedKeys] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  
  const gameLoopRef = useRef(null)
  const spawnIntervalRef = useRef(null)

  const difficultySettings = {
    easy: { spawnRate: 2000, noteSpeed: 3, duration: 30 },
    medium: { spawnRate: 1500, noteSpeed: 4, duration: 45 },
    hard: { spawnRate: 1000, noteSpeed: 5, duration: 60 }
  }

  const spawnNote = useCallback(() => {
    const settings = difficultySettings[selectedDifficulty]
    const lane = Math.floor(Math.random() * 4)
    const newNote = {
      id: Date.now() + Math.random(),
      lane,
      y: -50,
      hit: false
    }
    setNotes(prev => [...prev, newNote])
    spawnIntervalRef.current = setTimeout(spawnNote, settings.spawnRate)
  }, [selectedDifficulty])

  const handleKeyPress = useCallback((key) => {
    if (gameState !== 'playing') return
    
    const keyIndex = NOTE_KEYS.indexOf(key.toLowerCase())
    if (keyIndex === -1) return
    
    setPressedKeys(prev => ({ ...prev, [key]: true }))
    
    setNotes(prev => {
      const laneNotes = prev.filter(n => n.lane === keyIndex && !n.hit && Math.abs(n.y - 85) < 30)
      if (laneNotes.length > 0) {
        const note = laneNotes[0]
        const distance = Math.abs(note.y - 85)
        let points = 100
        
        if (distance < 10) {
          points = 300
          setFeedback({ type: 'perfect', lane: keyIndex })
        } else if (distance < 20) {
          points = 200
          setFeedback({ type: 'good', lane: keyIndex })
        } else {
          setFeedback({ type: 'ok', lane: keyIndex })
        }
        
        setTimeout(() => setFeedback(null), 300)
        
        setScore(s => s + points * (1 + combo * 0.1))
        setCombo(c => {
          const newCombo = c + 1
          setMaxCombo(m => Math.max(m, newCombo))
          return newCombo
        })
        
        return prev.map(n => n.id === note.id ? { ...n, hit: true } : n)
      } else {
        setCombo(0)
        return prev
      }
    })
    
    setTimeout(() => {
      setPressedKeys(prev => ({ ...prev, [key]: false }))
    }, 100)
  }, [gameState, combo])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pressedKeys[e.key]) {
        handleKeyPress(e.key)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress, pressedKeys])

  useEffect(() => {
    let timer
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    const settings = difficultySettings[selectedDifficulty]
    if (timeElapsed >= settings.duration && gameState === 'playing') {
      setGameState('ended')
    }
  }, [timeElapsed, gameState, selectedDifficulty])

  useEffect(() => {
    if (gameState === 'playing') {
      const settings = difficultySettings[selectedDifficulty]
      
      gameLoopRef.current = setInterval(() => {
        setNotes(prev => {
          const updated = prev.map(n => ({
            ...n,
            y: n.y + settings.noteSpeed
          }))
          
          const missed = updated.filter(n => !n.hit && n.y > 100)
          if (missed.length > 0) {
            setCombo(0)
          }
          
          return updated.filter(n => n.y <= 110 && (!n.hit || n.y <= 100))
        })
      }, 16)
      
      spawnIntervalRef.current = setTimeout(spawnNote, 1000)
    }
    
    return () => {
      clearInterval(gameLoopRef.current)
      clearTimeout(spawnIntervalRef.current)
    }
  }, [gameState, selectedDifficulty, spawnNote])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setNotes([])
    setTimeElapsed(0)
  }

  const pauseGame = () => {
    setGameState('paused')
    clearInterval(gameLoopRef.current)
    clearTimeout(spawnIntervalRef.current)
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const restartGame = () => {
    setGameState('idle')
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setNotes([])
    setTimeElapsed(0)
  }

  const getScoreRank = () => {
    const maxScore = difficultySettings[selectedDifficulty].duration * 150
    const percentage = (score / maxScore) * 100
    
    if (percentage >= 90) return { rank: 'S', color: 'text-yellow-400' }
    if (percentage >= 80) return { rank: 'A', color: 'text-green-400' }
    if (percentage >= 70) return { rank: 'B', color: 'text-blue-400' }
    if (percentage >= 60) return { rank: 'C', color: 'text-purple-400' }
    return { rank: 'D', color: 'text-gray-400' }
  }

  return (
    <section className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gradient-gold mb-4">
            节奏游戏
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            使用键盘 D F J K 键，跟随节奏击打鼓点！
          </p>
        </motion.div>

        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 p-8 text-center"
          >
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
                {NOTE_KEYS.map((key, index) => (
                  <div
                    key={key}
                    className="h-16 rounded-lg bg-yingge-dark border-2 border-yingge-gold/50 flex items-center justify-center"
                  >
                    <span className="text-2xl font-bold text-yingge-gold">{key.toUpperCase()}</span>
                    <span className="block text-xs text-gray-400">{NOTE_LABELS[index]}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">按对应按键击打下落的鼓点</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">选择难度</h3>
              <div className="flex justify-center gap-4">
                {['easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-yingge-gold text-yingge-black'
                        : 'bg-yingge-dark text-gray-300 hover:bg-yingge-dark/80'
                    }`}
                  >
                    {diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '困难'}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={startGame}
              className="px-8 py-4 bg-yingge-gold text-yingge-black font-bold text-lg rounded-xl flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" />
              开始游戏
            </motion.button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yingge-gold">{Math.floor(score)}</div>
                  <div className="text-xs text-gray-400">分数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{combo}x</div>
                  <div className="text-xs text-gray-400">连击</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timeElapsed}s</div>
                  <div className="text-xs text-gray-400">时间</div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={gameState === 'playing' ? pauseGame : resumeGame}
                    className="p-3 rounded-lg bg-yingge-dark hover:bg-yingge-dark/80"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {gameState === 'playing' ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={restartGame}
                    className="p-3 rounded-lg bg-yingge-dark hover:bg-yingge-dark/80"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="relative h-80 bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-4">
                {[0, 1, 2, 3].map((lane) => (
                  <div
                    key={lane}
                    className="border-x border-yingge-gold/20 relative"
                  >
                    {notes
                      .filter(n => n.lane === lane && !n.hit)
                      .map(note => (
                        <motion.div
                          key={note.id}
                          className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-lg bg-yingge-gold/80 flex items-center justify-center text-2xl font-bold text-yingge-black"
                          style={{ top: `${note.y}%` }}
                        >
                          {NOTE_LABELS[lane]}
                        </motion.div>
                      ))}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-16 bg-yingge-red/30 border-t-4 border-yingge-gold">
                <div className="grid grid-cols-4 h-full">
                  {NOTE_KEYS.map((key, index) => (
                    <div
                      key={key}
                      className={`flex items-center justify-center transition-all ${
                        pressedKeys[key] ? 'bg-yingge-gold/50' : ''
                      }`}
                    >
                      <span className={`text-xl font-bold ${
                        pressedKeys[key] ? 'text-yingge-black' : 'text-yingge-gold'
                      }`}>
                        {key.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl font-bold"
                    style={{ left: `${(feedback.lane + 0.5) * 25}%` }}
                  >
                    {feedback.type === 'perfect' && <span className="text-yellow-400">Perfect!</span>}
                    {feedback.type === 'good' && <span className="text-green-400">Good!</span>}
                    {feedback.type === 'ok' && <span className="text-blue-400">OK</span>}
                  </motion.div>
                )}
              </AnimatePresence>

              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">游戏暂停</h2>
                    <motion.button
                      onClick={resumeGame}
                      className="px-8 py-3 bg-yingge-gold text-yingge-black font-bold rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      继续游戏
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-yingge-dark text-gray-300 hover:bg-yingge-dark/80"
                onClick={() => handleKeyPress('d')}
              >D</button>
              <button
                className="px-4 py-2 rounded-lg bg-yingge-dark text-gray-300 hover:bg-yingge-dark/80"
                onClick={() => handleKeyPress('f')}
              >F</button>
              <button
                className="px-4 py-2 rounded-lg bg-yingge-dark text-gray-300 hover:bg-yingge-dark/80"
                onClick={() => handleKeyPress('j')}
              >J</button>
              <button
                className="px-4 py-2 rounded-lg bg-yingge-dark text-gray-300 hover:bg-yingge-dark/80"
                onClick={() => handleKeyPress('k')}
              >K</button>
            </div>
          </motion.div>
        )}

        {gameState === 'ended' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-yingge-gold/20 flex items-center justify-center mx-auto mb-6"
            >
              <Trophy className="w-12 h-12 text-yingge-gold" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-6">游戏结束！</h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-yingge-dark rounded-lg p-4">
                <div className="text-3xl font-bold text-yingge-gold">{Math.floor(score)}</div>
                <div className="text-sm text-gray-400">最终分数</div>
              </div>
              <div className="bg-yingge-dark rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{maxCombo}x</div>
                <div className="text-sm text-gray-400">最大连击</div>
              </div>
              <div className="bg-yingge-dark rounded-lg p-4">
                <div className={`text-4xl font-bold ${getScoreRank().color}`}>
                  {getScoreRank().rank}
                </div>
                <div className="text-sm text-gray-400">评级</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                onClick={startGame}
                className="px-8 py-3 bg-yingge-gold text-yingge-black font-bold rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                再来一局
              </motion.button>
              <motion.button
                onClick={restartGame}
                className="px-8 py-3 bg-yingge-dark text-white font-bold rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5" />
                返回首页
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default RhythmGame