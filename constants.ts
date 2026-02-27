import { PortfolioItem, FilterOption, Category, Order } from './types';

export const CATEGORIES: FilterOption[] = [
  { id: 'all', label: '전체', value: 'ALL' },
  { id: 'cover', label: '음악', value: 'COVER' },
  { id: 'wedding', label: '웨딩', value: 'WEDDING' },
  { id: 'event', label: '이벤트', value: 'EVENT' },
  { id: 'album', label: '음반제작', value: 'ALBUM' },
  { id: 'ai', label: 'AI서비스', value: 'AI' },
];

// Curated, 100% RELIABLE High-Quality Images
// Updated with verified, stable Unsplash IDs
const IMAGE_POOLS = {
  WEDDING: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Party (Stable)
    'https://images.unsplash.com/photo-1511285560982-1351c4a727bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Couple (Stable)
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Dress
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rings
    'https://images.unsplash.com/photo-1519225448526-0cb7849bc86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Cake
    'https://images.unsplash.com/photo-1520854221256-17451cc330e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Wedding Tie
  ],
  COVER: [
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mic (Stable)
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Recording
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // DJ
    'https://images.unsplash.com/photo-1520523839774-a8e646c36376?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Piano
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mic Stand
  ],
  EVENT: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Event
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Concert
    'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Confetti
    'https://images.unsplash.com/photo-1514525253440-b393452e3720?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Party Crowd
    'https://images.unsplash.com/photo-1459749411177-287ce63e3ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Hands
  ],
  ALBUM: [
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Vinyl
    'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Cassette
    'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Console
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Listening
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI Chip
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI Abstract
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Cyberpunk
    'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chip
  ]
};

const getRandomImage = (category: Category, index: number) => {
  let pool = IMAGE_POOLS.COVER;
  if (category === 'WEDDING') pool = IMAGE_POOLS.WEDDING;
  if (category === 'EVENT') pool = IMAGE_POOLS.EVENT;
  if (category === 'ALBUM') pool = IMAGE_POOLS.ALBUM;
  if (category === 'AI') pool = IMAGE_POOLS.AI;

  return pool[index % pool.length];
};

// Define Products per category
const PRODUCTS = {
    COVER: ['노래녹음', '음정보정', 'AI노래녹음', '커버영상 제작'],
    WEDDING: ['축가녹음', 'AI축가녹음', '셀프축가영상', 'AI 부모님감사영상', '단체축가영상', '축가 가사영상'],
    EVENT: ['프로포즈녹음', '프로포즈영상', 'AI 부모님감사영상', '단체이벤트영상'],
    ALBUM: ['AI음반제작', '베이직 음반제작', '프리미엄 음반제작', '마스터 음반제작'],
    AI: ['AI노래녹음', 'AI부모님감사영상', 'AI음반제작', 'AI뮤직비디오 제작']
};

const TITLES = {
    COVER: ['감성 발라드 커버', '파워풀한 고음 녹음', '달달한 어쿠스틱 편곡', '프로필 뮤비 촬영', '오디션 제출용 데모'],
    WEDDING: ['눈물의 감동 축가', '신랑신부 듀엣 무대', '친구들의 깜짝 이벤트', '식전 시네마틱 영상', '부모님을 위한 헌정곡'],
    EVENT: ['트렁크 프로포즈 성공!', '기념일 영상편지', '회사 장기자랑 연습', '동호회 단체곡 녹음', '서프라이즈 이벤트'],
    ALBUM: ['첫 싱글 앨범 발매', '인디밴드 정규 녹음', '나만의 자작곡 제작', '비트메이킹 프로젝트', '유튜브 배경음악 제작'],
    AI: ['AI로 복원한 목소리', '가상 아티스트 프로젝트', '텍스트로 만드는 음악', 'AI 뮤직비디오 생성', '돌아가신 부모님 영상']
};

const generatePortfolio = (): PortfolioItem[] => {
  const items: PortfolioItem[] = [];
  const directorNames = ['박성진', '정창식', '한규혁', '연예지', '김태호'];
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전'];
  const categories: Category[] = ['COVER', 'WEDDING', 'EVENT', 'ALBUM', 'AI'];
  
  // We need 100 items total, 20 per category
  let idCounter = 1;

  categories.forEach(cat => {
      const productList = PRODUCTS[cat];
      const titleList = TITLES[cat];
      
      for (let i = 0; i < 20; i++) {
        const product = productList[i % productList.length];
        const randomTitle = titleList[Math.floor(Math.random() * titleList.length)];
        const director = directorNames[Math.floor(Math.random() * directorNames.length)];
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const clientName = `${surname}OO`; // Example: 김OO
        const likes = Math.floor(Math.random() * 500) + 50;
        const comments = Math.floor(Math.random() * 80) + 5;
        const price = (Math.floor(Math.random() * 10) + 1) * 50000 + 100000;
        const people = `${Math.floor(Math.random() * 5) + 1}명`;
        
        let tools: string[] = [];
        if (cat === 'WEDDING') tools = ["Sony FX3", "Premiere Pro", "Gimbal"];
        if (cat === 'COVER') tools = ["Neumann U87", "Pro Tools", "Logic Pro"];
        if (cat === 'EVENT') tools = ["Drone", "Multi-Cam", "After Effects"];
        if (cat === 'ALBUM') tools = ["SSL Console", "Outboard Gear", "Mastering"];
        if (cat === 'AI') tools = ["Stable Diffusion", "Sora", "RVC"];

        const blogDescription = `안녕하세요. 여러분의 상상을 현실로 만들어드리는 헤마스튜디오의 ${director}입니다. 😊
    
이번 포스팅에서는 최근 저희 스튜디오에서 진행했던 '${product}' 프로젝트, [${randomTitle}] 작업 후기를 들려드리려 합니다.

[상담 및 기획]
고객님께서는 '${product}' 상품에 관심이 많으셨고, 특히 원하는 분위기가 명확하셨습니다. 저희는 고객님의 니즈를 파악하여 맞춤형 솔루션을 제안해드렸습니다.

[제작 과정]
작업은 시종일관 즐거운 분위기 속에서 진행되었습니다. 최신 장비인 ${tools[0]}를 활용하여 퀄리티를 높였고, 디테일한 부분까지 놓치지 않으려 노력했습니다.

[결과물]
최종 완성된 결과물을 보시고 고객님께서 매우 만족해하셨습니다. "${randomTitle}"라는 제목에 걸맞게 감동적이고 완성도 높은 작품이 탄생했습니다.

${product}에 대해 궁금하시다면 언제든 헤마스튜디오로 문의주세요!`;

        items.push({
            id: idCounter.toString(),
            title: `[${product}] ${randomTitle} - ${idCounter}번째 이야기`,
            category: cat,
            subcategory: product, // This is the specific product name
            location: '헤마 스튜디오',
            price: price,
            priceUnit: '건',
            capacity: people,
            imageUrl: getRandomImage(cat, i),
            tags: [`#${product}`, `#${cat}`], // Removed director tag and #헤마스튜디오
            likes: likes,
            comments: comments,
            directorReview: "최선을 다해 작업했습니다.",
            directorName: director,
            customerReview: "기대 이상의 퀄리티입니다!",
            customerName: clientName,
            description: blogDescription,
            date: `2024.${Math.floor(Math.random() * 12) + 1}.${Math.floor(Math.random() * 28) + 1}`,
            client: clientName,
            period: '3일',
            tools: tools
        });
        idCounter++;
      }
  });

  return items;
};

export const MOCK_PORTFOLIO: PortfolioItem[] = generatePortfolio();

// Mock Orders for Admin Dashboard
export const MOCK_ORDERS: Order[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `ord_${i}`,
    orderNumber: `ORD-${20240000 + i}`,
    customerName: ['김철수', '이영희', '박민수', '최지우', '정다은'][i % 5],
    productName: MOCK_PORTFOLIO[i % MOCK_PORTFOLIO.length].title,
    amount: MOCK_PORTFOLIO[i % MOCK_PORTFOLIO.length].price,
    status: (['PAID', 'PENDING', 'COMPLETED', 'CANCELLED'][i % 4]) as any,
    date: `2024-03-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
    paymentMethod: i % 2 === 0 ? '신용카드' : '토스페이'
}));