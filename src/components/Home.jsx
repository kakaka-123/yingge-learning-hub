import { motion } from 'framer-motion'
import { Play, BookOpen, MessageCircle, ChevronDown } from 'lucide-react'

function Home({ onNavigate }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yingge-black via-yingge-dark/50 to-yingge-black" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yingge-red rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yingge-gold rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yingge-gold" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full border border-yingge-gold/30 bg-yingge-gold/10 text-yingge-gold text-sm mb-4"
          >
            国家级非物质文化遗产
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif">
            <span className="text-gradient-gold">潮汕英歌舞</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
            通过互动、节奏与AI学习，走近英歌舞文化
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={() => onNavigate('action')}
              className="w-full sm:w-auto px-8 py-4 bg-yingge-gold text-yingge-black font-semibold rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              开始学习
            </motion.button>

            <motion.button
              onClick={() => onNavigate('game')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-yingge-gold text-yingge-gold font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-yingge-gold/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5" />
              体验游戏
            </motion.button>

            <motion.button
              onClick={() => onNavigate('ai')}
              className="w-full sm:w-auto px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
              AI问答
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => onNavigate('culture')}
          className="cursor-pointer"
        >
          <ChevronDown className="w-8 h-8 text-yingge-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Home
