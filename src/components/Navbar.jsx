import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Music } from 'lucide-react'

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'culture', label: '英歌舞资讯' },
  { id: 'face', label: '脸谱识别' },
  { id: 'action', label: '动作课堂' },
  { id: 'drum', label: '鼓点学习' },
  { id: 'ai', label: 'AI老师' },
  { id: 'game', label: '节奏游戏' }
]

function Navbar({ activeSection, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-yingge-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate('home')}
              whileHover={{ scale: 1.02 }}
            >
              <Music className="w-8 h-8 text-yingge-gold" />
              <span className="text-xl font-bold text-yingge-gold font-serif">英歌舞</span>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-yingge-gold text-yingge-black'
                      : 'text-white hover:bg-yingge-dark'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden pt-16"
          >
            <div className="absolute inset-0 bg-yingge-black/98 backdrop-blur-md" />
            <div className="relative px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-yingge-gold text-yingge-black'
                      : 'text-white hover:bg-yingge-dark'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar