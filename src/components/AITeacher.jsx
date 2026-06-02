import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Bot, User, Sparkles, BookOpen, Music, Gamepad2, HelpCircle, Settings, AlertCircle } from 'lucide-react'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `你是一位经验丰富的英歌舞师傅，负责教授英歌舞文化、动作技巧和鼓点节奏。

角色设定：
- 你是潮汕英歌舞的传承人和导师
- 你说话风格像一位亲切的师傅带徒弟，不死板，生动有趣
- 你熟悉英歌舞的历史、文化、动作套路和鼓点节奏
- 你可以回答关于英歌舞的一切问题，包括但不限于：
  * 英歌舞的起源、历史和文化背景
  * 梁山108好汉与英歌舞的关系
  * 英歌舞的角色体系（头槌、前棚、后棚）
  * 服饰和脸谱的含义
  * 各种动作的要领和技巧（左锤、右锤、双槌合击等）
  * 鼓点节奏的分类和特点
  * 练习方法和学习路径建议
  * 英歌舞在潮汕地区（汕头、潮州、揭阳）的差异

请用亲切、鼓励、有逻辑的语气回答问题，适当使用实例，让学习者感受到英歌舞的魅力。`

function AITeacher() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '你好！我是你的英歌舞AI师傅。有什么想了解的，尽管问吧！不管是文化知识、动作技巧还是鼓点节奏，我都可以教你。',
      avatar: <Bot className="w-6 h-6" />
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickQuestions = [
    { id: 'culture', label: '英歌舞为什么源于梁山文化？', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'action', label: '左锤怎么打？', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'drum', label: '为什么这个鼓点听起来更激烈？', icon: <Music className="w-4 h-4" /> },
    { id: 'game', label: '我老是打错怎么办？', icon: <Gamepad2 className="w-4 h-4" /> }
  ]

  const callDeepSeekAPI = async (userMessage) => {
    const apiKey = 'sk-0443e69f461b4318a6dfb1b0ffb4c66c'

    const conversationHistory = messages
      .filter(m => m.type === 'user' || m.type === 'bot')
      .map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }))

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API请求失败 (${response.status})`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('网络连接失败，请检查您的网络设置。')
      }
      throw err
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setError(null)

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      avatar: <User className="w-6 h-6" />
    }])

    setInputValue('')
    setIsTyping(true)

    try {
      const response = await callDeepSeekAPI(userMessage)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        avatar: <Bot className="w-6 h-6" />
      }])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: `抱歉，出了点问题：${err.message}`,
        avatar: <Bot className="w-6 h-6" />
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputValue(question)
  }

  return (
    <section className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gradient-gold mb-4">
            AI老师
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            英歌舞AI师傅，为你解答文化知识、动作技巧和练习问题
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            DeepSeek AI 已连接
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={question.id}
              onClick={() => handleQuickQuestion(question.label)}
              className="p-4 bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 text-left hover:border-yingge-gold/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yingge-gold/20 flex items-center justify-center text-yingge-gold flex-shrink-0">
                  {question.icon}
                </div>
                <span className="text-sm text-gray-300">{question.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 overflow-hidden"
        >
          <div className="p-4 border-b border-yingge-gold/20 bg-yingge-dark/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yingge-gold/20 flex items-center justify-center text-yingge-gold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">英歌师傅</h3>
                <p className="text-sm text-gray-400">DeepSeek AI 驱动 · 潮汕英歌舞专家</p>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-yingge-gold/20 text-yingge-gold'
                  }`}>
                    {message.avatar}
                  </div>
                  <div className={`max-w-xs sm:max-w-md ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-yingge-dark text-gray-200 rounded-bl-md'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-yingge-gold/20 flex items-center justify-center text-yingge-gold flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-yingge-dark rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-yingge-gold/20">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入你的问题..."
                  className="w-full px-4 py-3 bg-yingge-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yingge-gold/50"
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  inputValue.trim() && !isTyping
                    ? 'bg-yingge-gold text-yingge-black'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={inputValue.trim() && !isTyping ? { scale: 1.05 } : {}}
                whileTap={inputValue.trim() && !isTyping ? { scale: 0.95 } : {}}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid md:grid-cols-2 gap-4"
        >
          <div className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-6 h-6 text-yingge-gold" />
              <h3 className="font-semibold text-white">学习路径推荐</h3>
            </div>
            <p className="text-gray-400 text-sm">
              根据你的学习进度，AI师傅会为你推荐个性化的学习路径：
            </p>
            <div className="mt-4 space-y-2">
              {['认识文化 →', '学基础鼓 →', '学动作 →', '玩游戏'].map((step, index) => (
                <div key={step} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-yingge-gold/20 text-yingge-gold flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yingge-dark/50 rounded-xl border border-yingge-gold/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-yingge-gold" />
              <h3 className="font-semibold text-white">AI师傅功能</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yingge-gold" />
                DeepSeek大模型驱动
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yingge-gold" />
                英歌舞专业知识问答
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yingge-gold" />
                动作技巧指导
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yingge-gold" />
                个性化学习建议
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AITeacher