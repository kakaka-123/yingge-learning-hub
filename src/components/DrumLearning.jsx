import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Star, Music, Video } from 'lucide-react'
import { drumPatterns } from '../data/yinggeData'

function DrumLearning() {
  const [selectedPattern, setSelectedPattern] = useState(drumPatterns[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  // 处理视频播放速度变化
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed
    }
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // 处理静音状态变化
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const handlePlayPause = () => {
    if (selectedPattern.type === 'video') {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play().catch(() => {})
        }
      }
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch(() => {})
        }
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleReplay = () => {
    if (selectedPattern.type === 'video') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const getDifficultyStars = (level) => {
    return Array(5).fill(0).map((_, i) => (
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
            鼓点学习
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            掌握英歌舞的节奏基础，感受鼓点的力量与韵律
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：鼓点库 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4">鼓点库</h2>
            {drumPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (selectedPattern?.id === pattern.id) return
                  setSelectedPattern(pattern)
                  setIsPlaying(false)
                  if (videoRef.current) {
                    videoRef.current.pause()
                    videoRef.current.currentTime = 0
                  }
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPattern?.id === pattern.id
                    ? 'border-yingge-gold bg-yingge-dark'
                    : 'border-gray-700 bg-yingge-dark/30 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    pattern.type === 'video' ? 'bg-blue-500/20' : 'bg-green-500/20'
                  }`}>
                    {pattern.type === 'video' ? (
                      <Video className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Music className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{pattern.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getDifficultyStars(pattern.difficulty)}
                      <span className="text-xs text-gray-400">
                        {pattern.type === 'video' ? '视频' : '音频'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2 pl-16">{pattern.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 右侧：播放区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 overflow-hidden"
          >
            {selectedPattern ? (
              <div>
                {/* 视频播放区域 */}
                {selectedPattern.type === 'video' && (
                  <div className="relative h-64 bg-gray-900">
                    <video
                      ref={videoRef}
                      src={selectedPattern.videoUrl}
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
                )}

                {/* 音频播放区域 */}
                {selectedPattern.type === 'audio' && (
                  <div className="relative h-48 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 rounded-full bg-yingge-gold/20 flex items-center justify-center mx-auto mb-4"
                        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        <Music className="w-10 h-10 text-yingge-gold" />
                      </motion.div>
                      <p className="text-yingge-gold text-lg font-semibold">
                        {selectedPattern.name}
                      </p>
                      {!isPlaying && (
                        <motion.button
                          onClick={handlePlayPause}
                          className="w-16 h-16 rounded-full bg-yingge-gold/90 flex items-center justify-center mx-auto mt-4"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-8 h-8 text-yingge-black ml-1" />
                        </motion.button>
                      )}
                    </div>
                    <audio
                      ref={audioRef}
                      src={selectedPattern.audioUrl}
                      onEnded={handleAudioEnded}
                    />
                  </div>
                )}

                {/* 控制面板 */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedPattern.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        {getDifficultyStars(selectedPattern.difficulty)}
                        <span className="text-sm text-gray-400 ml-2">
                          {selectedPattern.type === 'video' ? '视频教程' : '音频示范'}
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

                  {/* 播放按钮 */}
                  <div className="flex items-center justify-center mb-4">
                    <motion.button
                      onClick={handlePlayPause}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isPlaying ? 'bg-red-600' : 'bg-yingge-gold'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-yingge-black ml-1" />
                      )}
                    </motion.button>
                  </div>

                  {/* 播放速度控制 */}
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
                        if (audioRef.current) {
                          audioRef.current.playbackRate = parseFloat(e.target.value)
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

                  {/* 说明文字 */}
                  <div className="bg-yingge-dark/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yingge-gold mb-2">内容说明</h3>
                    <p className="text-gray-300 text-sm">{selectedPattern.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-yingge-gold/20 flex items-center justify-center mb-4">
                  <Music className="w-10 h-10 text-yingge-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">选择一个鼓点开始学习</h3>
                <p className="text-gray-400 text-sm">点击左侧鼓点库中的内容</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DrumLearning
