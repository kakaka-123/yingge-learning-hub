export const API_CONFIG = {
  DEEPSEEK: {
    API_KEY: process.env.DEEPSEEK_API_KEY || '',
    BASE_URL: 'https://api.deepseek.com/v1',
    MODEL: 'deepseek-chat'
  },
  NEWS: {
    RSS_URL: process.env.RSS_URL || 'mock',
    UPDATE_INTERVAL: 30 * 60 * 1000,
    MAX_NEWS: 20
  },
  SERVER: {
    PORT: process.env.PORT || 3001
  }
}

export const getAIConfig = (provider = 'deepseek') => {
  return {
    baseURL: API_CONFIG.DEEPSEEK.BASE_URL,
    apiKey: API_CONFIG.DEEPSEEK.API_KEY,
    model: API_CONFIG.DEEPSEEK.MODEL
  }
}
