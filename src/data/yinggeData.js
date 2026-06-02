export const originData = {
  title: '起源与历史',
  content: [
    {
      period: '明末清初',
      description: '英歌舞起源于明末清初的潮汕地区，最初是一种驱鬼辟邪的祭祀舞蹈',
      icon: 'ghost'
    },
    {
      period: '清朝中期',
      description: '融合了武术、戏剧和民间舞蹈元素，形成独特风格',
      icon: 'swords'
    },
    {
      period: '民国时期',
      description: '英歌舞在潮汕地区广泛流传，成为春节重要的民俗活动',
      icon: 'calendar'
    },
    {
      period: '现代',
      description: '2006年被列入第一批国家级非物质文化遗产名录',
      icon: 'award'
    }
  ]
};

export const roleData = {
  title: '角色体系',
  roles: [
    {
      name: '头槌',
      description: '队伍的领导者，通常扮演宋江，负责指挥整个队伍的节奏和队形',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Chinese%20traditional%20opera%20character%20Song%20Jiang%20with%20red%20face%20paint%20holding%20drum%20stick&image_size=portrait_4_3',
      color: 'bg-red-800'
    },
    {
      name: '前棚',
      description: '由梁山好汉组成的主要表演队伍，负责展示武术动作和队形变化',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=group%20of%20Chinese%20traditional%20opera%20warriors%20with%20painted%20faces%20performing%20dance&image_size=portrait_4_3',
      color: 'bg-blue-800'
    },
    {
      name: '后棚',
      description: '由乐师和辅助人员组成，负责伴奏和后勤，保障演出顺利进行',
      image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Chinese%20traditional%20musicians%20playing%20drums%20and%20cymbals&image_size=portrait_4_3',
      color: 'bg-green-800'
    }
  ]
};

export const costumeData = {
  title: '服饰与脸谱',
  items: [
    {
      type: '脸谱',
      title: '红脸',
      description: '代表忠义勇敢，如关公关云长',
      color: '#DC2626'
    },
    {
      type: '脸谱',
      title: '黑脸',
      description: '代表刚正不阿，如包拯、张飞',
      color: '#374151'
    },
    {
      type: '脸谱',
      title: '白脸',
      description: '代表奸诈狡猾，如曹操',
      color: '#E5E7EB'
    },
    {
      type: '服饰',
      title: '战裙',
      description: '表演者穿着的传统战裙，象征武将身份',
      color: '#8B0000'
    },
    {
      type: '服饰',
      title: '头冠',
      description: '装饰华丽的头冠，体现角色身份地位',
      color: '#D4AF37'
    }
  ]
};

export const actionData = [
  {
    id: 1,
    name: '基本功',
    difficulty: 1,
    description: '英歌舞基础动作练习，包含基本站姿、手位和基本击打动作',
    videoUrl: '/video/基本功.mp4',
    drumPattern: '咚 咚 咚'
  },
  {
    id: 2,
    name: '三拜槌',
    difficulty: 2,
    description: '英歌舞特色动作，双手持槌向三个方向依次拜槌',
    videoUrl: '/video/三拜槌.mp4',
    drumPattern: '咚 咚 咚 锵'
  },
  {
    id: 3,
    name: '压腿',
    difficulty: 4,
    description: '英歌舞中的柔韧训练，压腿动作展示身体柔韧性',
    videoUrl: '/video/压腿.mp4',
    drumPattern: '咚咚 咚咚 锵'
  },
  {
    id: 4,
    name: '结束',
    difficulty: 3,
    description: '英歌舞表演的收尾动作，造型定格',
    videoUrl: '/video/结束.mp4',
    drumPattern: '咚 咚 咚 锵'
  }
];

export const drumPatterns = [
  {
    id: 1,
    name: '起鼓',
    type: 'audio',
    difficulty: 1,
    description: '英歌舞开场鼓点，沉稳有力',
    audioUrl: '/audio/起鼓.WAV'
  },
  {
    id: 2,
    name: '转槌',
    type: 'audio',
    difficulty: 2,
    description: '转槌动作配合的鼓点节奏',
    audioUrl: '/audio/转槌.WAV'
  },
  {
    id: 3,
    name: '三拜槌',
    type: 'audio',
    difficulty: 3,
    description: '三拜槌动作对应的鼓点',
    audioUrl: '/audio/三拜槌.WAV'
  },
  {
    id: 4,
    name: '完整鼓声',
    type: 'video',
    difficulty: 5,
    description: '完整的英歌舞鼓点示范视频',
    videoUrl: '/video/完整鼓声.mp4'
  }
];

export const regionData = [
  {
    name: '汕头',
    description: '汕头英歌舞以豪放刚劲著称，动作幅度大，节奏感强',
    color: '#DC2626'
  },
  {
    name: '潮州',
    description: '潮州英歌舞注重细腻的表情和队形变化，更具戏剧性',
    color: '#2563EB'
  },
  {
    name: '揭阳',
    description: '揭阳英歌舞融合了武术元素，动作刚柔并济',
    color: '#16A34A'
  }
];

export const faceData = [
  {
    id: 1,
    name: '武松',
    alias: '行者',
    faceColor: '丹红面',
    trait: '勇武',
    description: '武松是《水浒传》中的重要人物，以景阳冈打虎闻名。丹红面象征其勇猛果敢的性格。',
    image: '/images/丹红面：武松（行者）｜勇武.jpg'
  },
  {
    id: 2,
    name: '顾大嫂',
    alias: '母大虫',
    faceColor: '粉面',
    trait: '果敢',
    description: '顾大嫂是梁山一百单八将中三位女将之一，性格豪爽，武艺高强。粉面体现其巾帼不让须眉的气质。',
    image: '/images/粉面：顾大嫂（母大虫）｜果敢.jpg'
  },
  {
    id: 3,
    name: '关胜',
    alias: '大刀',
    faceColor: '红面',
    trait: '忠勇',
    description: '关胜是三国名将关羽的后裔，精通兵法，善使青龙偃月刀。红面象征其忠义勇敢的品格。',
    image: '/images/红面：关胜（大刀）｜忠勇.jpg'
  },
  {
    id: 4,
    name: '宋江',
    alias: '及时雨',
    faceColor: '红面',
    trait: '沉稳',
    description: '宋江是梁山起义军的领袖，以仗义疏财、知人善任著称。红面表现其领袖气质和沉稳性格。',
    image: '/images/红面：宋江（及时雨）｜沉稳.jpg'
  },
  {
    id: 5,
    name: '秦明',
    alias: '霹雳火',
    faceColor: '红面',
    trait: '骁勇',
    description: '秦明性格急躁，声如雷震，作战勇猛无比。红面彰显其火爆的性格和骁勇善战的特质。',
    image: '/images/红面：秦明（霹雳火）｜骁勇.jpg'
  },
  {
    id: 6,
    name: '朱仝',
    alias: '美髯公',
    faceColor: '绿面',
    trait: '宽厚',
    description: '朱仝面如重枣，美髯过腹，为人仗义疏财。绿面象征其宽厚仁慈的性格。',
    image: '/images/绿面：朱仝（美髯公）｜宽厚.jpg'
  },
  {
    id: 7,
    name: '石勇',
    alias: '石将军',
    faceColor: '赭面',
    trait: '憨厚',
    description: '石勇出身贫寒，性格憨厚耿直，对宋江忠心耿耿。赭面表现其朴实忠厚的形象。',
    image: '/images/赭面：石勇（石将军）｜憨厚.jpg'
  },
  {
    id: 8,
    name: '孙二娘',
    alias: '母夜叉',
    faceColor: '青面',
    trait: '洒脱',
    description: '孙二娘与丈夫张青在十字坡开设酒店，性格泼辣洒脱。青面体现其豪放不羁的个性。',
    image: '/images/青面：孙二娘（母夜叉）｜洒脱.jpg'
  },
  {
    id: 9,
    name: '戴宗',
    alias: '神行太保',
    faceColor: '黄面',
    trait: '迅捷',
    description: '戴宗有道术神行法，能日行八百里。黄面象征其行动迅捷如飞的特点。',
    image: '/images/黄面：戴宗（神行太保）｜迅捷.jpg'
  },
  {
    id: 10,
    name: '时迁',
    alias: '鼓上蚤',
    faceColor: '黑白花面',
    trait: '机敏',
    description: '时迁擅长飞檐走壁，偷盗技巧出神入化。黑白花面表现其机智灵活的特质。',
    image: '/images/黑白花面：时迁（鼓上蚤）｜机敏.jpg'
  },
  {
    id: 11,
    name: '鲁智深',
    alias: '花和尚',
    faceColor: '黑白花面',
    trait: '豪爽',
    description: '鲁智深力大无穷，性格豪爽，好打抱不平。黑白花面彰显其粗犷豪放的性格。',
    image: '/images/黑白花面：鲁智深（花和尚）｜豪爽.jpg'
  },
  {
    id: 12,
    name: '李逵',
    alias: '黑旋风',
    faceColor: '黑面',
    trait: '勇猛',
    description: '李逵力大如牛，性格暴躁，作战勇猛。黑面象征其刚猛无畏的气势。',
    image: '/images/黑面：李逵（黑旋风）｜勇猛.jpg'
  }
];
