import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Music, Heart, Sparkles, Cpu, LayoutGrid, BookOpen } from 'lucide-react';

interface HeroProps {
    viewMode: 'HOME' | 'PRODUCT';
    setViewMode: (mode: 'HOME' | 'PRODUCT') => void;
}

const ROTATING_TITLES = [
  { text: "누구나 음악을 쉽고 재밌게!", highlight: "음악", type: 'MUSIC' },
  { text: "나만의 콘텐츠로 특별한 결혼식", highlight: "특별한 결혼식", type: 'WEDDING' },
  { text: "소중한 사람을 위한 나만의 이벤트!", highlight: "나만의 이벤트!", type: 'EVENT' },
  { text: "AI로 만드는 음악의 새로운 기준", highlight: "AI", type: 'AI' },
];

const ParticleEffect = ({ type }: { type: string }) => {
    // Generate random positions for particles
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 120 - 60, // Horizontal spread
        y: Math.random() * 40 - 20,   // Vertical spread origin
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 0.2, // Quick stagger
        duration: Math.random() * 1 + 1.5 
    }));

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 0, y: 10, scale: 0 }}
                    animate={{ 
                        opacity: [0, 1, 1, 0],
                        x: p.x, 
                        y: p.y - 100, 
                        scale: [0, p.scale, p.scale * 0.5], 
                        rotate: type === 'EVENT' ? [0, 180, 360] : 0
                    }}
                    transition={{ 
                        duration: p.duration, 
                        delay: p.delay, 
                        ease: "easeOut",
                        times: [0, 0.1, 0.6, 1]
                    }}
                    className="absolute top-1/2 left-1/2"
                >
                    {type === 'MUSIC' && <Music className="text-rose-400" size={24} fill="currentColor" />}
                    {type === 'WEDDING' && <Heart className="text-pink-500" size={20} fill="currentColor" />}
                    {type === 'EVENT' && <Sparkles className="text-yellow-400" size={24} fill="currentColor" />}
                    {type === 'AI' && <Cpu className="text-blue-500" size={20} />}
                </motion.div>
            ))}
        </div>
    );
};

const Hero: React.FC<HeroProps> = ({ viewMode, setViewMode }) => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentTitle = ROTATING_TITLES[currentTitleIndex];

  // Helper to split text and highlight parts with animation
  const renderHighlightedText = (text: string, highlight: string, type: string) => {
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-[#3182f6] inline-block relative">
            {highlight}
            <ParticleEffect type={type} />
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] md:min-h-[800px] bg-[#eff0f6] overflow-hidden">
      
      {/* 
        SPLINE BACKGROUND LAYER - COPIED EXACTLY FROM PRODUCTPAGE
        Strict Mobile Layout Maintenance:
        - top-[-75%], left-[-125%], w-[350%], h-[250%] on mobile
        - scale-[0.45] on mobile
      */}
      <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute top-[-75%] left-[-125%] w-[350%] h-[250%] md:top-[-15%] md:left-[-10%] md:w-[120%] md:h-[130%]">
              <iframe 
                  src='https://my.spline.design/logoanimation-toaRRyZuntUDrxq4gwivGtsN/' 
                  frameBorder='0' 
                  width='100%' 
                  height='100%'
                  className="w-full h-full pointer-events-none md:pointer-events-auto scale-[0.45] md:scale-[0.85]"
                  title="3D Logo Animation"
                  style={{ background: 'transparent' }}
              ></iframe>
          </div>
          {/* Gradient Overlay for seamless blend at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#eff0f6] via-[#eff0f6]/60 to-transparent pointer-events-none" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full h-full flex flex-col justify-start items-center px-6 pointer-events-none">
        
        {/* TOP: Title Section - Matching Padding */}
        <div className="pt-36 md:pt-40 flex items-center justify-center pointer-events-auto relative z-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTitleIndex}
              className="relative w-full flex justify-center"
            >
                <motion.h1
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(10px)', scale: 1.05 }}
                  transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1]
                  }}
                  className="text-[2.75rem] md:text-7xl font-black leading-tight text-[#191f28] text-center break-keep drop-shadow-sm tracking-tight"
                >
                  {renderHighlightedText(currentTitle.text, currentTitle.highlight, currentTitle.type)}
                </motion.h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MIDDLE: Spacer for 3D object on mobile */}
        <div className="h-[38vh] md:hidden w-full"></div>
        
        {/* BOTTOM: Buttons Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:mt-auto pb-10 md:pb-32 pointer-events-auto mt-6 flex flex-row gap-3 w-full max-w-lg md:w-auto justify-center items-center"
        >
            <button 
                onClick={() => {
                    setViewMode('HOME');
                    // Scroll to feed
                    setTimeout(() => {
                        const grid = document.getElementById('portfolio-grid');
                        if(grid) {
                            const offset = grid.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({top: offset, behavior: 'smooth'});
                        }
                    }, 100);
                }}
                className={`
                    relative flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-4 md:px-8 md:py-5 rounded-2xl text-[15px] md:text-lg font-bold transition-all duration-300 shadow-xl w-auto md:w-[240px]
                    ${viewMode === 'HOME' 
                        ? 'bg-[#3182f6] text-white hover:bg-[#2b72d7] shadow-blue-500/30 ring-2 ring-white/50' 
                        : 'bg-white text-[#1d1d1f] hover:bg-gray-50 hover:scale-[1.02]'}
                `}
            >
                <LayoutGrid size={18} className={`md:w-5 md:h-5 transition-colors ${viewMode === 'HOME' ? 'text-white' : 'text-[#3182f6]'}`} />
                <span className="whitespace-nowrap">스튜디오 피드</span>
                {viewMode === 'HOME' && <ChevronRight size={16} className="md:w-5 md:h-5 animate-pulse hidden sm:block" />}
            </button>

            <button 
                onClick={() => {
                    setViewMode('PRODUCT');
                    // Scroll to product content
                    setTimeout(() => {
                         const content = document.getElementById('product-section');
                         if(content) {
                             const offset = content.getBoundingClientRect().top + window.scrollY - 80;
                             window.scrollTo({top: offset, behavior: 'smooth'});
                         }
                    }, 100);
                }}
                className={`
                    relative flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-4 md:px-8 md:py-5 rounded-2xl text-[15px] md:text-lg font-bold transition-all duration-300 shadow-xl w-auto md:w-[240px]
                    ${viewMode === 'PRODUCT' 
                        ? 'bg-[#3182f6] text-white hover:bg-[#2b72d7] shadow-blue-500/30 ring-2 ring-white/50' 
                        : 'bg-white text-[#1d1d1f] hover:bg-gray-50 hover:scale-[1.02]'}
                `}
            >
                <BookOpen size={18} className={`md:w-5 md:h-5 transition-colors ${viewMode === 'PRODUCT' ? 'text-white' : 'text-[#3182f6]'}`} />
                <span className="whitespace-nowrap">서비스 가이드</span>
                {viewMode === 'PRODUCT' && <ChevronRight size={16} className="md:w-5 md:h-5 animate-pulse hidden sm:block" />}
            </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;