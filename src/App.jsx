import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Culture from './components/Culture'
import ActionClass from './components/ActionClass'
import DrumLearning from './components/DrumLearning'
import AITeacher from './components/AITeacher'
import RhythmGame from './components/RhythmGame'
import FaceRecognition from './components/FaceRecognition'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  const sections = {
    home: <Home onNavigate={setActiveSection} />,
    culture: <Culture />,
    face: <FaceRecognition />,
    action: <ActionClass />,
    drum: <DrumLearning />,
    ai: <AITeacher />,
    game: <RhythmGame />
  }

  return (
    <div className="min-h-screen bg-yingge-black">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {sections[activeSection]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App