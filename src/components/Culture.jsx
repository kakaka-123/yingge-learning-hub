import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Film, Calendar, Award, Trophy, MoreHorizontal, Clock, ExternalLink, History } from 'lucide-react'
import { yinggeHistoryNews } from '../data/yinggeHistoryNews'

const categorizeNews = (title, content) => {
  const text = (title + content).toLowerCase()
  if (text.includes('电影') || text.includes('影片') || text.includes('导演') || text.includes('演员')) return '电影'
  if (text.includes('活动') || text.includes('演出') || text.includes('巡游') || text.includes('表演')) return '活动'
  if (text.includes('非遗') || text.includes('传承') || text.includes('文化') || text.includes('传统')) return '非遗'
  if (text.includes('比赛') || text.includes('冠军') || text.includes('赛事') || text.includes('竞技')) return '赛事'
  return '其他'
}

const categoryIcons = {
  '电影': Film,
  '活动': Calendar,
  '非遗': Award,
  '赛事': Trophy,
  '其他': MoreHorizontal
}

const categoryColors = {
  '电影': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  '活动': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '非遗': 'bg-yingge-gold/20 text-yingge-gold border-yingge-gold/30',
  '赛事': 'bg-red-500/20 text-red-400 border-red-500/30',
  '其他': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

function Culture() {
  const [yinggeNews, setYinggeNews] = useState({})
  const [latestNews, setLatestNews] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const categorizeAndGroupNews = (news) => {
    const categories = { '电影': [], '活动': [], '非遗': [], '赛事': [], '其他': [] }
    news.forEach(item => {
      const category = item.category || '其他'
      if (categories[category]) {
        categories[category].push(item)
      } else {
        categories['其他'].push(item)
      }
    })
    return categories
  }

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const url = isRefresh ? '/api/news/refresh' : '/api/news'
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setYinggeNews(result.yinggeNews || {})
        setLatestNews(result.latestNews || {})
        setLastUpdate(new Date(result.lastUpdate))
        setError(null)
      } else {
        console.log('API returned error, using fallback data')
        setYinggeNews(categorizeAndGroupNews(yinggeHistoryNews))
        setLatestNews({})
        setLastUpdate(new Date())
        setError(null)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      console.log('Using fallback news data')
      setYinggeNews(categorizeAndGroupNews(yinggeHistoryNews))
      setLatestNews({})
      setLastUpdate(new Date())
      setError(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleRefresh = () => {
    fetchNews(true)
  }

  const formatTime = (date) => {
    if (!date) return ''
    const now = new Date()
    const diff = Math.floor((now - new Date(date)) / 1000 / 60)
    if (diff < 1) return '刚刚'
    if (diff < 60) return `${diff}分钟前`
    const hours = Math.floor(diff / 60)
    if (hours < 24) return `${hours}小时前`
    return new Date(date).toLocaleDateString('zh-CN')
  }

  const categories = ['电影', '活动', '非遗', '赛事', '其他']

  return (
    <section className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gradient-gold mb-4">
            英歌舞最新动态
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            实时追踪英歌舞相关新闻资讯，AI智能筛选摘要
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-yingge-dark text-gray-300 rounded-lg hover:bg-yingge-dark/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '刷新中...' : '刷新新闻'}
            </button>
            {lastUpdate && (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {formatTime(lastUpdate)}
              </span>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">正在获取英歌舞最新资讯...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-yingge-gold text-yingge-black rounded-lg hover:bg-yingge-gold/80 transition-colors"
              >
                重试
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.keys(yinggeNews).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-yingge-gold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    英歌舞相关资讯
                  </h2>
                  {categories.map((category) => {
                    const items = yinggeNews[category] || []
                    if (items.length === 0) return null

                    const Icon = categoryIcons[category]

                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yingge-dark/50 rounded-xl p-6 border border-yingge-gold/20 mb-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[category]}`}>
                            <Icon className="w-4 h-4" />
                            {category}
                          </span>
                          <span className="text-sm text-gray-500">{items.length}条资讯</span>
                        </div>

                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <motion.a
                              key={index}
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="block p-4 bg-yingge-black/30 rounded-lg hover:bg-yingge-black/50 transition-colors group"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-yingge-gold font-medium mb-1 group-hover:text-yingge-gold/80 transition-colors">
                                    {item.summary || item.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {formatTime(item.pubDate)}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-yingge-gold transition-colors flex-shrink-0 mt-1" />
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {Object.keys(latestNews).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    最新热门资讯
                  </h2>
                  {categories.map((category) => {
                    const items = latestNews[category] || []
                    if (items.length === 0) return null

                    const Icon = categoryIcons[category]

                    return (
                      <motion.div
                        key={`latest-${category}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yingge-dark/30 rounded-xl p-6 border border-gray-500/20 mb-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[category]}`}>
                            <Icon className="w-4 h-4" />
                            {category}
                          </span>
                          <span className="text-sm text-gray-500">{items.length}条资讯</span>
                        </div>

                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <motion.a
                              key={`latest-${index}`}
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="block p-4 bg-yingge-black/30 rounded-lg hover:bg-yingge-black/50 transition-colors group"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-gray-300 font-medium mb-1 group-hover:text-yingge-gold/80 transition-colors">
                                    {item.summary || item.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {formatTime(item.pubDate)}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-yingge-gold transition-colors flex-shrink-0 mt-1" />
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {Object.keys(yinggeNews).length === 0 && Object.keys(latestNews).length === 0 && !loading && (
                <div className="text-center py-20">
                  <p className="text-gray-400">暂无相关新闻</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Culture
