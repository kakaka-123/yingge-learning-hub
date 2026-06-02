import express from 'express'
import cors from 'cors'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'
import { API_CONFIG } from './config/apiConfig.js'
import { initialNews } from './data/initialNews.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NEWS_STORAGE_FILE = path.join(__dirname, 'data', 'yinggeNews.json')

const app = express()

app.use(cors())
app.use(express.json())

let yinggeNews = []
let latestNews = []
let lastUpdate = null

const aiClient = new OpenAI({
  apiKey: API_CONFIG.DEEPSEEK.API_KEY,
  baseURL: API_CONFIG.DEEPSEEK.BASE_URL
})

const loadNewsFromFile = () => {
  try {
    if (fs.existsSync(NEWS_STORAGE_FILE)) {
      const data = fs.readFileSync(NEWS_STORAGE_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      yinggeNews = parsed.yinggeNews || []
      latestNews = parsed.latestNews || []
      lastUpdate = parsed.lastUpdate ? new Date(parsed.lastUpdate) : null
      console.log(`Loaded ${yinggeNews.length} yingge news, ${latestNews.length} latest news from storage`)
    } else {
      if (!fs.existsSync(path.dirname(NEWS_STORAGE_FILE))) {
        fs.mkdirSync(path.dirname(NEWS_STORAGE_FILE), { recursive: true })
      }
      yinggeNews = []
      latestNews = []
      lastUpdate = null
    }
  } catch (e) {
    console.error('Failed to load news from file:', e.message)
    yinggeNews = []
    latestNews = []
    lastUpdate = null
  }
}

const saveNewsToFile = () => {
  try {
    const data = {
      yinggeNews,
      latestNews,
      lastUpdate: lastUpdate?.toISOString() || new Date().toISOString()
    }
    fs.writeFileSync(NEWS_STORAGE_FILE, JSON.stringify(data, null, 2))
    console.log(`Saved ${yinggeNews.length} yingge news, ${latestNews.length} latest news to storage`)
  } catch (e) {
    console.error('Failed to save news to file:', e.message)
  }
}

const isNewsDuplicate = (newNews, existingNews) => {
  const newTitle = newNews.title?.trim().toLowerCase() || ''
  return existingNews.some(item => {
    const existingTitle = item.title?.trim().toLowerCase() || ''
    return newTitle === existingTitle || 
           existingTitle.includes(newTitle) || 
           newTitle.includes(existingTitle)
  })
}

const categorizeNews = (title, description) => {
  const text = `${title} ${description}`.toLowerCase()
  if (text.includes('电影') || text.includes('影片') || text.includes('导演') || text.includes('演员') || text.includes('上映')) {
    return '电影'
  }
  if (text.includes('活动') || text.includes('巡游') || text.includes('表演') || text.includes('演出') || text.includes('举行')) {
    return '活动'
  }
  if (text.includes('传承') || text.includes('非遗') || text.includes('文化') || text.includes('保护') || text.includes('项目')) {
    return '非遗'
  }
  if (text.includes('比赛') || text.includes('竞赛') || text.includes('冠军') || text.includes('大赛')) {
    return '赛事'
  }
  return '其他'
}

const CODE = 'oWjWF61OOKQz3QxkOsjvepeOtygM'

const fetchFreeNews = async () => {
  const sources = [
    { name: 'DailyHot', fetch: fetchDailyHot },
    { name: 'HackerNews', fetch: fetchHackerNews }
  ]

  for (const source of sources) {
    try {
      console.log(`Trying ${source.name}...`)
      const news = await source.fetch()
      if (news.length > 0) {
        console.log(`${source.name} success: ${news.length} items`)
        return news
      }
    } catch (e) {
      console.log(`${source.name} failed: ${e.message}`)
    }
  }
  return []
}

const fetchDailyHot = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'news-iota-liard-98.vercel.app',
      port: 443,
      path: '/toutiao',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    }

    console.log('Fetching DailyHot from Vercel...')
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          console.log('DailyHot status:', res.statusCode, 'data length:', data.length)

          if (parsed.code === 200 && parsed.data && Array.isArray(parsed.data)) {
            const news = parsed.data.slice(0, 20).map(item => ({
              title: item.title || '',
              link: item.url || '#',
              pubDate: parsed.updateTime || new Date().toISOString(),
              content: `热度: ${item.hot}`,
              summary: item.title || '',
              category: categorizeNews(item.title || '', '')
            }))
            console.log(`DailyHot found: ${news.length}`)
            resolve(news)
          } else {
            console.log('DailyHot API error:', parsed.message || 'Unknown')
            resolve([])
          }
        } catch (e) {
          console.error('DailyHot parse error:', e.message)
          resolve([])
        }
      })
    })
    req.on('error', (e) => {
      console.error('DailyHot request error:', e.message)
      resolve([])
    })
    req.setTimeout(20000, () => {
      console.log('DailyHot timeout, cancelling...')
      req.destroy()
      resolve([])
    })
    req.end()
  })
 }

 const fetchDailyHotDirect = () => {
   return new Promise((resolve) => {
     const options = {
       hostname: 'news-iota-liard-98.vercel.app',
       port: 443,
       path: '/toutiao',
       method: 'GET',
       headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
         'Accept': 'application/json'
       }
     }

     console.log('fetchDailyHotDirect: Fetching from Vercel...')
     const req = https.request(options, (res) => {
       let data = ''
       res.on('data', (chunk) => { data += chunk })
       res.on('end', () => {
         try {
           const parsed = JSON.parse(data)
           console.log('fetchDailyHotDirect status:', res.statusCode)

           if (parsed.code === 200 && parsed.data && Array.isArray(parsed.data)) {
             const news = parsed.data.slice(0, 20).map(item => ({
               title: item.title || '',
               link: item.url || '#',
               pubDate: parsed.updateTime || new Date().toISOString(),
               content: `热度: ${item.hot}`,
               summary: item.title || '',
               category: categorizeNews(item.title || '', '')
             }))
             console.log(`fetchDailyHotDirect found: ${news.length}`)
             resolve(news)
           } else {
             console.log('fetchDailyHotDirect error:', parsed.message)
             resolve([])
           }
         } catch (e) {
           console.error('fetchDailyHotDirect parse error:', e.message)
           resolve([])
         }
       })
     })
     req.on('error', (e) => {
      console.error('fetchDailyHotDirect request error:', e.message)
      resolve([])
    })
    req.setTimeout(15000, () => {
      console.log('fetchDailyHotDirect timeout')
      req.destroy()
      resolve([])
    })
    req.end()
   })
 }

const fetchHackerNews = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'hacker-news.firebaseio.com',
      port: 443,
      path: '/v0/topstories.json',
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const ids = JSON.parse(data)
          const topIds = ids.slice(0, 30)

          let completed = 0
          const stories = []

          topIds.forEach(id => {
            const storyOptions = {
              hostname: 'hacker-news.firebaseio.com',
              port: 443,
              path: `/v0/item/${id}.json`,
              method: 'GET'
            }

            const storyReq = https.request(storyOptions, (storyRes) => {
              let storyData = ''
              storyRes.on('data', (chunk) => { storyData += chunk })
              storyRes.on('end', () => {
                try {
                  const story = JSON.parse(storyData)
                  if (story.title && story.url) {
                    stories.push({
                      title: story.title,
                      link: story.url,
                      pubDate: story.time ? new Date(story.time * 1000).toISOString() : new Date().toISOString(),
                      content: story.text || '',
                      summary: story.title,
                      category: '其他'
                    })
                  }
                } catch (e) {
                  console.error('HackerNews story parse error:', e.message)
                }
                completed++
                if (completed === topIds.length) {
                  console.log(`HackerNews found: ${stories.length}`)
                  resolve(stories)
                }
              })
            })
            storyReq.on('error', () => {
              completed++
              if (completed === topIds.length) {
                resolve(stories)
              }
            })
            storyReq.setTimeout(5000, () => {
              storyReq.destroy()
              completed++
              if (completed === topIds.length) {
                resolve(stories)
              }
            })
            storyReq.end()
          })
        } catch (e) {
          console.error('HackerNews parse error:', e.message)
          resolve([])
        }
      })
    })
    req.on('error', (e) => {
      console.error('HackerNews request error:', e.message)
      resolve([])
    })
    req.setTimeout(30000, () => {
      req.destroy()
      resolve([])
    })
    req.end()
  })
}

const fetchXujianNews = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.xujian.tech',
      port: 443,
      path: `/atlapi/data/c/news/latest/${CODE}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          console.log('Xujian API response:', JSON.stringify(parsed).substring(0, 500))
          
          if (parsed.code === 200 && parsed.data && Array.isArray(parsed.data)) {
            const news = parsed.data.map(item => ({
              title: item.title || '',
              link: item.link_info?.url || item.link_info?.share_url || '',
              pubDate: item.publish_time || item.update_time || new Date().toISOString(),
              content: item.desc || '',
              summary: item.desc || item.title || '',
              category: categorizeNews(item.title || '', item.desc || '')
            })).filter(item => item.title && item.title.length > 5)
            
            console.log(`Xujian news found: ${news.length}`)
            resolve(news)
          } else {
            console.log('API returned error:', parsed.msg || 'Unknown error')
            resolve([])
          }
        } catch (e) {
          console.error('Parse error:', e.message)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Request error:', e.message)
      resolve([])
    })

    req.setTimeout(15000, () => {
      req.destroy()
      resolve([])
    })

    req.end()
  })
}

const fetchSinaNews = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'search.sina.com.cn',
      port: 443,
      path: `/api/search?q=%E6%BD%AE%E6%B1%95+%E9%9D%9E%E9%81%97&c=news&from=&ie=utf-8&df=week&col=&source=&cate=&etime=&dtime=&x=0&y=0&count=20&page=1`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.result && parsed.result.list) {
            const news = parsed.result.list.map(item => ({
              title: item.title,
              link: item.url,
              pubDate: item.intime || item.ctime,
              content: item.intro || item.content || '',
              summary: item.intro || item.title,
              category: categorizeNews(item.title, item.intro || '')
            })).filter(item =>
              item.title.includes('英歌舞') ||
              item.content.includes('英歌舞') ||
              item.title.includes('英歌')
            )
            resolve(news)
          } else {
            resolve([])
          }
        } catch (e) {
          console.error('Parse error:', e.message)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Request error:', e.message)
      resolve([])
    })

    req.setTimeout(10000, () => {
      req.destroy()
      resolve([])
    })

    req.end()
  })
}

const fetchSogouNews = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'news.sogou.com',
      port: 443,
      path: '/news?query=%E8%8B%B1%E6%AD%8C%E8%88%9E&mode=1',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const news = []
          const items = data.match(/<h3[^>]*class="news-title[^"]*"[^>]*>[\s\S]*?<\/h3>/gi) || []
          for (const item of items.slice(0, 15)) {
            const titleMatch = item.match(/>([^<]*)</)
            const linkMatch = item.match(/href="(https?:\/\/[^"]*?)"/i)
            if (titleMatch && linkMatch) {
              const title = titleMatch[1].replace(/<[^>]*>/g, '').trim()
              if (title.includes('英歌舞') || title.includes('英歌')) {
                news.push({
                  title: title,
                  link: linkMatch[1],
                  pubDate: new Date().toISOString(),
                  content: '',
                  summary: title,
                  category: categorizeNews(title, '')
                })
              }
            }
          }
          console.log(`Sogou news found: ${news.length}`)
          resolve(news)
        } catch (e) {
          console.error('Sogou parse error:', e.message)
          resolve([])
        }
      })
    })
    req.on('error', (e) => {
      console.error('Sogou request error:', e.message)
      resolve([])
    })
    req.setTimeout(10000, () => { req.destroy(); resolve([]) })
    req.end()
  })
}

const fetchBaiduNews = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'news.baidu.com',
      port: 443,
      path: '/rss',
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const news = []
          const items = data.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []
          for (const item of items.slice(0, 20)) {
            const titleMatch = item.match(/<title>([^<]*)<\/title>/i)
            const linkMatch = item.match(/<link>([^<]*)<\/link>/i)
            const descMatch = item.match(/<description>([^<]*)<\/description>/i)
            if (titleMatch && linkMatch) {
              news.push({
                title: titleMatch[1],
                link: linkMatch[1],
                pubDate: new Date().toISOString(),
                content: descMatch ? descMatch[1] : '',
                summary: titleMatch[1],
                category: '其他'
              })
            }
          }
          console.log(`Baidu news found: ${news.length}`)
          resolve(news)
        } catch (e) {
          resolve([])
        }
      })
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); resolve([]) })
    req.end()
  })
}

const fetchBilibiliHot = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.bilibili.com',
      port: 443,
      path: '/x/web-interface/ranking/v2?rid=0&type=all',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.data && parsed.data.list) {
            const news = parsed.data.list.slice(0, 20).map(item => ({
              title: item.title,
              link: `https://www.bilibili.com/video/${item.bvid}`,
              pubDate: new Date().toISOString(),
              content: '',
              summary: item.title,
              category: categorizeNews(item.title, '')
            })).filter(item => item.title.includes('英歌舞'))
            console.log(`Bilibili news found: ${news.length}`)
            resolve(news)
          } else {
            resolve([])
          }
        } catch (e) {
          console.error('Parse error:', e.message)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Request error:', e.message)
      resolve([])
    })

    req.setTimeout(10000, () => {
      req.destroy()
      resolve([])
    })

    req.end()
  })
}

const fetchWeiboHot = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'weibo.com',
      port: 443,
      path: '/ajax/side/hotSearch',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://weibo.com'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          console.log('Weibo response:', JSON.stringify(parsed.data)?.substring(0, 200))
          const hotList = parsed.data?.realtime || parsed.data?.hotgov || []
          if (Array.isArray(hotList)) {
            const news = hotList.map(item => ({
              title: item.word || item.note || item.topic?.star_name || '',
              link: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || item.note || '')}`,
              pubDate: new Date().toISOString(),
              content: '',
              summary: item.word || item.note || '',
              category: '其他'
            })).filter(item => item.title && item.title.includes('英歌舞'))
            resolve(news)
          } else {
            console.log('Weibo hotList is not an array:', typeof hotList)
            resolve([])
          }
        } catch (e) {
          console.error('Parse error:', e.message)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Request error:', e.message)
      resolve([])
    })

    req.setTimeout(10000, () => {
      req.destroy()
      resolve([])
    })

    req.end()
  })
}

const fetch163News = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'news.163.com',
      port: 443,
      path: '/search/?keyword=%E8%8B%B1%E6%AD%8C%E8%88%9E',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const news = []
          const items = data.match(/<li[^>]*class="[^"]*news[^"]*"[^>]*>.*?<\/li>/gi) || []
          for (const item of items.slice(0, 15)) {
            const titleMatch = item.match(/<h3[^>]*>(.*?)<\/h3>/i)
            const linkMatch = item.match(/href="(https?:\/\/[^"]*?)"/i)
            if (titleMatch && linkMatch) {
              const title = titleMatch[1].replace(/<[^>]*>/g, '')
              if (title.includes('英歌舞')) {
                news.push({
                  title: title,
                  link: linkMatch[1],
                  pubDate: new Date().toISOString(),
                  content: '',
                  summary: title,
                  category: categorizeNews(title, '')
                })
              }
            }
          }
          console.log(`163 news found: ${news.length}`)
          resolve(news)
        } catch (e) {
          console.error('Parse error:', e.message)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Request error:', e.message)
      resolve([])
    })

    req.setTimeout(10000, () => {
      req.destroy()
      resolve([])
    })

    req.end()
  })
}

const summarizeWithAI = async (news) => {
  if (!API_CONFIG.DEEPSEEK.API_KEY || news.length === 0) {
    return news
  }

  try {
    const newsText = news.map((n, i) => `${i + 1}. ${n.title}`).join('\n')

    const response = await aiClient.chat.completions.create({
      model: API_CONFIG.DEEPSEEK.MODEL,
      messages: [
        {
          role: 'system',
          content: `你是一个非遗文化新闻编辑。请为以下英歌舞相关新闻判断类别并生成一句话摘要。类别包括：电影、活动、非遗、赛事、其他。格式：序号|类别|摘要（15字内）`
        },
        {
          role: 'user',
          content: newsText
        }
      ],
      temperature: 0.7
    })

    const aiOutput = response.choices[0].message.content.trim()
    const lines = aiOutput.split('\n')

    return news.map((item, index) => {
      const aiLine = lines[index] || ''
      const parts = aiLine.split('|')
      const category = parts[1]?.trim() || item.category
      const summary = parts[2]?.trim() || item.title

      return {
        ...item,
        summary,
        category
      }
    })
  } catch (error) {
    console.error('AI summarization error:', error)
    return news
  }
}

const updateNews = async () => {
  console.log('Updating news...')

  let rawNews = await fetchFreeNews()

  if (rawNews.length === 0) {
    console.log('Free news failed, trying Xujian...')
    rawNews = await fetchXujianNews()
  }

  if (rawNews.length === 0) {
    console.log('Xujian news failed, trying Sina...')
    rawNews = await fetchSinaNews()
  }

  if (rawNews.length === 0) {
    console.log('Sina news failed, trying Sogou...')
    rawNews = await fetchSogouNews()
  }

  if (rawNews.length === 0) {
    console.log('Sogou failed, trying Bilibili...')
    rawNews = await fetchBilibiliHot()
  }

  if (rawNews.length === 0) {
    console.log('Bilibili failed, trying Baidu...')
    rawNews = await fetchBaiduNews()
  }

  if (rawNews.length === 0) {
    console.log('Baidu failed, trying Weibo...')
    rawNews = await fetchWeiboHot()
  }

  if (rawNews.length === 0) {
    console.log('Weibo failed, trying 163...')
    rawNews = await fetch163News()
  }

  const yinggeKeywords = ['英歌舞', '英歌', '潮汕英歌舞', '普宁英歌舞', '揭阳英歌']
  
  try {
    console.log('Fetching latest news from DailyHot directly...')
    let dailyHotNews = await fetchDailyHotDirect()
    
    if (dailyHotNews.length === 0) {
      console.log('DailyHot returned no news, trying HackerNews...')
      dailyHotNews = await fetchHackerNews()
    }
    
    if (dailyHotNews.length > 0) {
      const newLatestNews = dailyHotNews.filter(item => !isNewsDuplicate(item, latestNews))
      
      if (newLatestNews.length > 0) {
        console.log(`Found ${newLatestNews.length} new latest news items`)
        latestNews = [...newLatestNews, ...latestNews].slice(0, 50)
      } else {
        console.log('No new latest news found')
      }
    } else {
      console.log('All latest news sources returned no news')
    }
  } catch (e) {
    console.log('Latest news fetch failed:', e.message)
  }
  
  if (rawNews.length > 0) {
    const newYinggeNews = rawNews.filter(item => {
      const text = (item.title || '') + (item.summary || '') + (item.content || '')
      return yinggeKeywords.some(keyword => text.includes(keyword))
    }).filter(item => !isNewsDuplicate(item, yinggeNews))
    
    if (newYinggeNews.length > 0) {
      console.log(`Found ${newYinggeNews.length} new yingge news items`)
      const summarizedNews = await summarizeWithAI(newYinggeNews)
      yinggeNews = [...summarizedNews, ...yinggeNews].slice(0, 50)
    } else {
      console.log('No new yingge news found')
      if (yinggeNews.length === 0) {
        console.log('Using initial yingge news data')
        yinggeNews = initialNews
      }
    }
    
    if (newYinggeNews.length > 0 || latestNews.length > 0 || yinggeNews.length > 0) {
      lastUpdate = new Date()
      saveNewsToFile()
      console.log(`News updated: ${yinggeNews.length} yingge, ${latestNews.length} latest`)
    } else {
      console.log('No updates, keeping existing cache')
      lastUpdate = new Date()
    }
  } else {
    console.log('All yingge news sources failed')
    if (yinggeNews.length === 0) {
      console.log('Using initial yingge news data')
      yinggeNews = initialNews
      lastUpdate = new Date()
      saveNewsToFile()
    }
  }
}

const categorizeAndGroup = (news) => {
  const categories = {
    '电影': [],
    '活动': [],
    '非遗': [],
    '赛事': [],
    '其他': []
  }

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

app.get('/api/dailyhot', async (req, res) => {
  try {
    const data = await fetchDailyHotDirect()
    res.json({
      success: true,
      data,
      source: 'dailyhot'
    })
  } catch (error) {
    console.error('DailyHot API error:', error)
    res.status(500).json({
      success: false,
      error: '获取失败'
    })
  }
})

app.get('/api/news', async (req, res) => {
  try {
    if (yinggeNews.length === 0 && latestNews.length === 0) {
      await updateNews()
    }

    const yinggeGrouped = categorizeAndGroup(yinggeNews)
    const latestGrouped = categorizeAndGroup(latestNews)

    res.json({
      success: true,
      yinggeNews: yinggeGrouped,
      latestNews: latestGrouped,
      lastUpdate,
      yinggeTotal: yinggeNews.length,
      latestTotal: latestNews.length
    })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({
      success: false,
      error: '获取新闻失败'
    })
  }
})

app.post('/api/news/refresh', async (req, res) => {
  try {
    await updateNews()
    const yinggeGrouped = categorizeAndGroup(yinggeNews)
    const latestGrouped = categorizeAndGroup(latestNews)

    res.json({
      success: true,
      yinggeNews: yinggeGrouped,
      latestNews: latestGrouped,
      lastUpdate,
      yinggeTotal: yinggeNews.length,
      latestTotal: latestNews.length
    })
  } catch (error) {
    console.error('Refresh error:', error)
    res.status(500).json({
      success: false,
      error: '刷新失败'
    })
  }
})

loadNewsFromFile()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
