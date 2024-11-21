import { createI18n } from 'vue-i18n'  

const messages = {  
  'zh-CN': {
    site_title:'AI聊天系统', 
    settings: '设置',  
    language: '语言',  
    theme: '主题',  
    light: '浅色',  
    dark: '深色',  
    system: '跟随系统',  
    enterApiKey: '请输入 API Key',  
    model: '模型',  
    temperature: '温度',  
    temperatureDescription: '较高的值会使输出更加随机，较低的值会使其更加集中和确定',  
    newChat: '新建对话',  
    clearConversations: '清除所有对话',  
    enterMessage: '输入消息...',  
    send: '发送',  
    stop: '停止生成',  
    regenerate: '重新生成',  
    delete: '删除',  
    copy: '复制',  
    copied: '已复制',  
    error: {  
      apiKey: '请先设置 API Key',  
      network: '网络错误，请稍后重试',  
      unknown: '发生错误，请稍后重试'  
    }  
  },  
  'en-US': {  
    site_title: 'AI CHAT',
    settings: 'Settings',  
    language: 'Language',  
    theme: 'Theme',  
    light: 'Light',  
    dark: 'Dark',  
    system: 'System',  
    enterApiKey: 'Enter API Key',  
    model: 'Model',  
    temperature: 'Temperature',  
    temperatureDescription: 'Higher values make the output more random, while lower values make it more focused and deterministic',  
    newChat: 'New Chat',  
    clearConversations: 'Clear conversations',  
    enterMessage: 'Type a message...',  
    send: 'Send',  
    stop: 'Stop generating',  
    regenerate: 'Regenerate response',  
    delete: 'Delete',  
    copy: 'Copy',  
    copied: 'Copied',  
    error: {  
      apiKey: 'Please set API Key first',  
      network: 'Network error, please try again later',  
      unknown: 'An error occurred, please try again later'  
    }  
  },  
  'ug-CN': {  
    site_title: 'ئەقلى ئىقتىدارلىق ماشىنا',
    settings: 'تەڭشەك',  
    language: 'تىل',  
    theme: 'باش تېما',  
    light: ' يورۇق',  
    dark: 'قاراڭغۇ',  
    system: 'سىستېما',  
    enterApiKey: 'API Key كىرگۈزۈڭ',  
    model: 'مودېل',  
    temperature: 'تىمپۇراتۇرا',  
    temperatureDescription: 'بىر قەدەر يۇقىرى قىممەت تېخىمۇ ئىختىيارىي چىقىدۇ.',  
    newChat: 'يىڭى سۆھبەت',  
    clearConversations: 'سۆھبەتلەرنى تازىلاش',  
    enterMessage: '...يوللىماقچى بولغان مەزمۇننى كىرگۈزۈڭ',  
    send: 'يوللاش',  
    stop: 'ياساشنى توختىتىش',  
    regenerate: 'قايتا ياساش',  
    delete: 'ئۆچۈرۈش',  
    copy: 'كۆچۈرۈش',  
    copied: 'كۆچۈرۈلدى',  
    error: {  
      apiKey: 'ئالدى بىلەن APIنى تەڭشەڭ',  
      network: 'توردا خاتالىق ، قايتا سىناڭ',  
      unknown: 'خاتالىق پەيدا بولدى ، قايتا سىناڭ'  
    }  
  }  
}  

export const i18n = createI18n({  
  legacy: false,  
  locale: 'zh-CN', // 默认语言  
  fallbackLocale: ['en-US', 'ug-CN'], // 添加维吾尔语作为回退语言  
  messages  
})