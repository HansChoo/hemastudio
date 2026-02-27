import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mic2, Heart, Music, Cpu, Sparkles, MousePointerClick } from 'lucide-react';

interface ProductPageProps {
  onProductClick: (tag: string) => void;
}

const SECTIONS = [
  {
    id: 1,
    category: 'MUSIC',
    shortTitle: '음악',
    title: '당신의 목소리,\n가장 완벽한 순간으로.',
    description: '전문 프로듀서의 1:1 디렉팅과 정밀한 음정 보정으로 누구나 가수처럼 노래할 수 있습니다. 커버 영상 제작으로 당신의 재능을 세상에 보여주세요.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: <Mic2 size={20} />,
    color: 'text-rose-600',
    products: ['노래녹음', '음정보정', 'AI노래녹음', '커버영상 제작']
  },
  {
    id: 2,
    category: 'WEDDING',
    shortTitle: '웨딩',
    title: '세상에 단 하나뿐인,\n우리만의 웨딩 스토리.',
    description: '떨리는 목소리의 셀프 축가부터 친구들과 함께하는 단체 영상, 그리고 부모님께 바치는 눈물의 감사 영상까지. 결혼식의 모든 순간을 영화처럼 담아드립니다.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: <Heart size={20} />,
    color: 'text-pink-600',
    products: ['축가녹음', 'AI축가녹음', '셀프축가영상', 'AI 부모님감사영상', '단체축가영상', '축가 가사영상']
  },
  {
    id: 3,
    category: 'EVENT',
    shortTitle: '이벤트',
    title: '잊지 못할 서프라이즈,\n감동의 깊이를 더하다.',
    description: '평생 기억될 프로포즈와 기념일. 진심을 담은 편지 녹음과 시네마틱한 영상 제작으로 사랑하는 사람에게 잊지 못할 감동을 선물하세요.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: <Sparkles size={20} />,
    color: 'text-orange-500',
    products: ['프로포즈녹음', '프로포즈영상', 'AI 부모님감사영상', '단체이벤트영상']
  },
  {
    id: 4,
    category: 'ALBUM',
    shortTitle: '음반제작',
    title: '상상이 현실이 되는\n나만의 앨범 발매.',
    description: '작곡을 몰라도 괜찮습니다. 베이직 제작부터 마스터링까지, 당신의 이야기가 세상에 울려 퍼질 수 있도록 전문가가 모든 과정을 함께합니다.',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: <Music size={20} />,
    color: 'text-purple-600',
    products: ['AI음반제작', '베이직 음반제작', '프리미엄 음반제작', '마스터 음반제작']
  },
  {
    id: 5,
    category: 'AI TECH',
    shortTitle: 'AI서비스',
    title: '기술이 선사하는\n마법 같은 경험.',
    description: '헤마스튜디오만의 독보적인 AI 서비스로 그리운 목소리를 복원하고, 상상 속의 이미지를 영상으로 구현합니다. 불가능을 감동으로 바꿔드립니다.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    icon: <Cpu size={20} />,
    color: 'text-blue-600',
    products: ['AI노래녹음', 'AI부모님감사영상', 'AI음반제작', 'AI뮤직비디오 제작']
  },
];

const ProductPage: React.FC<ProductPageProps> = ({ onProductClick }) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeSection = SECTIONS[activeTab];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Robust Fallback using Placehold.co to guarantee no broken images
    e.currentTarget.src = `https://placehold.co/1200x800/f5f5f7/1d1d1f?text=${encodeURIComponent(activeSection.shortTitle)}`;
  };

  return (
    <div id="product-section" className="w-full bg-[#f5f5f7] overflow-x-hidden font-sans">
      
      {/* Apple-style Interactive Tab Section */}
      <section className="w-full bg-[#f5f5f7] px-4 py-20 md:py-32">
        <div className="max-w-[1050px] mx-auto">
            
            {/* 1. Header & Navigation */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-8">
                    지금 나에게 필요한 서비스는?
                </h2>
                
                {/* Custom Tab Bar */}
                <div className="inline-flex flex-wrap justify-center bg-white p-1.5 rounded-2xl md:rounded-full shadow-sm border border-gray-200/60">
                    {SECTIONS.map((section, index) => {
                        const isActive = activeTab === index;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(index)}
                                className={`
                                    relative px-5 py-2.5 rounded-xl md:rounded-full text-sm md:text-base font-medium transition-all duration-300
                                    flex items-center gap-2 z-10 group
                                    ${isActive ? 'text-black' : 'text-gray-500 hover:text-gray-900'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#eff0f6] rounded-xl md:rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`transition-colors duration-300 ${isActive ? section.color : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    {section.icon}
                                </span>
                                {section.shortTitle}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. The "Box" - Dynamic Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-[30px] md:rounded-[48px] overflow-hidden shadow-sm border border-white flex flex-col md:flex-row min-h-[600px] md:min-h-[540px]"
                >
                    {/* Left: Text & Specs */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                        <div>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/80 text-xs font-bold uppercase tracking-wider mb-6 ${activeSection.color}`}
                            >
                                <Sparkles size={12} fill="currentColor" />
                                {activeSection.category}
                            </motion.div>
                            
                            <motion.h3 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] leading-[1.1] mb-5 tracking-tight whitespace-pre-wrap"
                            >
                                {activeSection.title}
                            </motion.h3>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg md:text-[17px] text-[#86868b] font-medium leading-relaxed mb-8 max-w-lg break-keep"
                            >
                                {activeSection.description}
                            </motion.p>
                        </div>

                        {/* Product List Grid - Bento Style */}
                        <div className={`grid grid-cols-2 gap-3 mt-auto ${activeSection.products.length > 4 ? '' : 'md:grid-cols-2'}`}>
                            {activeSection.products.map((product, i) => (
                                <motion.div
                                    key={product}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    onClick={() => onProductClick(product)}
                                    className="bg-[#f5f5f7] rounded-xl p-3 flex items-center justify-center text-center h-full min-h-[50px] transition-all hover:bg-[#e8e8ed] hover:scale-[1.02] cursor-pointer group/item"
                                >
                                    <span className="text-sm font-semibold text-[#1d1d1f] break-keep leading-tight group-hover/item:text-black">{product}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center gap-2">
                             <div className="p-1.5 bg-gray-100 rounded-full text-gray-400">
                                <MousePointerClick size={16} />
                             </div>
                             <p className="text-sm text-gray-400 font-medium">
                                원하는 상품을 선택하면 포트폴리오로 이동합니다.
                             </p>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="flex-1 relative bg-gray-100 min-h-[300px] md:min-h-full">
                        <motion.img 
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={activeSection.image} 
                            alt={activeSection.title}
                            onError={handleImageError}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                         {/* Subtle Inner Border/Shadow */}
                        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] pointer-events-none rounded-r-[30px] md:rounded-r-[48px]" />
                    </div>
                </motion.div>
            </AnimatePresence>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#f5f5f7] py-32 px-6 border-t border-gray-200">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
            당신의 이야기가 시작되는 곳.
          </h2>
          <p className="text-xl md:text-2xl text-[#1d1d1f] mb-10 font-normal">
            지금 바로 상담을 신청하고 특별한 혜택을 받아보세요.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
               <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-base md:text-lg font-medium px-8 py-3 rounded-full transition-all hover:scale-105 min-w-[160px] shadow-lg shadow-blue-500/30">
                상담 예약하기
              </button>
              <button className="text-[#06c] hover:underline text-base md:text-lg font-medium flex items-center gap-1 px-6 py-3">
                제작 비용 알아보기 <ChevronRight size={18} />
              </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default ProductPage;