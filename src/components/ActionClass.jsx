import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Star } from 'lucide-react'
import { actionData } from '../data/yinggeData'

function ActionClass() {
  const [selectedAction, setSelectedAction] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const videoRef = useRef(null)

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  const getDifficultyStars = (level) => {
    return Array(3).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < level ? 'text-yingge-gold fill-yingge-gold' : 'text-gray-600'}`}
      />
    ))
  }

  return (
    <section className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gradient-gold mb-4">
            动作课堂
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            英歌舞动作拆解学习，从基础到进阶，一步步掌握
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4">动作库</h2>
            {actionData.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (selectedAction?.id === action.id) return
                  setSelectedAction(action)
                  setIsPlaying(false)
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedAction?.id === action.id
                    ? 'border-yingge-gold bg-yingge-dark'
                    : 'border-gray-700 bg-yingge-dark/30 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yingge-gold/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-yingge-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{action.name}</h3>
                      <div className="flex items-center gap-1">
                        {getDifficultyStars(action.difficulty)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{action.drumPattern}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 overflow-hidden"
          >
            {selectedAction ? (
              <div>
                <div
                  className="relative h-64 bg-gray-900"
                  style={{ minHeight: '256px' }}
                >
                  <video
                    ref={videoRef}
                    src={selectedAction.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    loop
                    playsInline
                    muted={isMuted}
                    playbackRate={playbackSpeed}
                    onEnded={handleVideoEnded}
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <motion.button
                        onClick={handlePlayPause}
                        className="w-16 h-16 rounded-full bg-yingge-gold/90 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="w-8 h-8 text-yingge-black ml-1" />
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedAction.name}</h2>
                      <div className="flex items-center gap-1 mt-1">
                        {getDifficultyStars(selectedAction.difficulty)}
                        <span className="text-sm text-gray-400 ml-2">
                          {selectedAction.difficulty === 1 ? '初级' : selectedAction.difficulty === 2 ? '中级' : '高级'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-lg bg-yingge-dark hover:bg-yingge-dark/80"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-yingge-gold" />
                        )}
                      </button>
                      <button
                        onClick={handleReplay}
                        className="p-2 rounded-lg bg-yingge-dark hover:bg-yingge-dark/80"
                      >
                        <RotateCcw className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-2 block">播放速度</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.25"
                      value={playbackSpeed}
                      onChange={(e) => {
                        setPlaybackSpeed(parseFloat(e.target.value))
                        if (videoRef.current) {
                          videoRef.current.playbackRate = parseFloat(e.target.value)
                        }
                      }}
                      className="w-full h-2 bg-yingge-dark rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5x</span>
                      <span>{playbackSpeed}x</span>
                      <span>2x</span>
                    </div>
                  </div>

                  <div className="bg-yingge-dark/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yingge-gold mb-2">动作说明</h3>
                    <p className="text-gray-300 text-sm">{selectedAction.description}</p>
                  </div>

                  <div className="mt-4 bg-yingge-dark/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yingge-gold mb-2">对应鼓点</h3>
                    <div className="flex items-center gap-2">
                      {selectedAction.drumPattern.split('').filter(c => c !== ' ').map((note, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 bg-yingge-gold/20 rounded text-yingge-gold font-medium"
                          animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: Infinity, delay: i * 0.3 }}
                        >
                          {note}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-yingge-gold/20 flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-yingge-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">选择一个动作开始学习</h3>
                <p className="text-gray-400 text-sm">点击左侧动作库中的动作，查看详细教学内容</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ActionClass
