import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { faceData } from '../data/yinggeData'

function FaceRecognition() {
  const [selectedFace, setSelectedFace] = useState(null)
  const [filterColor, setFilterColor] = useState('全部')

  const faceColors = ['全部', '红面', '丹红面', '粉面', '绿面', '赭面', '青面', '黄面', '黑白花面', '黑面']

  const filteredFaces = filterColor === '全部' 
    ? faceData 
    : faceData.filter(face => face.faceColor === filterColor)

  const getTraitColor = (trait) => {
    const colors = {
      '勇武': 'bg-red-500',
      '果敢': 'bg-pink-500',
      '忠勇': 'bg-red-600',
      '沉稳': 'bg-blue-500',
      '骁勇': 'bg-orange-500',
      '宽厚': 'bg-green-500',
      '憨厚': 'bg-amber-600',
      '洒脱': 'bg-cyan-500',
      '迅捷': 'bg-yellow-500',
      '机敏': 'bg-purple-500',
      '豪爽': 'bg-indigo-500',
      '勇猛': 'bg-gray-700'
    }
    return colors[trait] || 'bg-gray-500'
  }

  return (
    <section className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gradient-gold mb-4">
            认识英歌舞脸谱
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            英歌舞脸谱色彩丰富，每种颜色代表不同的性格特征和人物身份
          </p>
        </motion.div>

        {/* 颜色筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {faceColors.map((color) => (
            <button
              key={color}
              onClick={() => setFilterColor(color)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterColor === color
                  ? 'bg-yingge-gold text-yingge-black'
                  : 'bg-yingge-dark border border-gray-700 text-gray-300 hover:border-yingge-gold/50'
              }`}
            >
              {color}
            </button>
          ))}
        </motion.div>

        {/* 脸谱网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredFaces.map((face, index) => (
            <motion.div
              key={face.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => setSelectedFace(face)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl bg-yingge-dark border border-gray-800 hover:border-yingge-gold/50 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={face.image}
                    alt={face.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-yingge-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{face.name}</h3>
                      <p className="text-xs text-gray-400">{face.alias}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs text-white ${getTraitColor(face.trait)}`}>
                      {face.trait}
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-yingge-gold/20 flex items-center justify-center">
                    <Info className="w-4 h-4 text-yingge-gold" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 详情弹窗 */}
        {selectedFace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedFace(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-yingge-dark border border-yingge-gold/30 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedFace(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* 图片 */}
                <div className="relative aspect-square md:aspect-auto md:h-full">
                  <img
                    src={selectedFace.image}
                    alt={selectedFace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-yingge-dark md:block hidden" />
                </div>

                {/* 内容 */}
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm text-white ${getTraitColor(selectedFace.trait)}`}>
                      {selectedFace.faceColor}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm text-white ${getTraitColor(selectedFace.trait)}`}>
                      {selectedFace.trait}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedFace.name}
                  </h2>
                  <p className="text-yingge-gold mb-4">{selectedFace.alias}</p>

                  <div className="flex-1">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedFace.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">人物出处</span>
                      <span className="text-gray-300">《水浒传》</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FaceRecognition
