import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_PORTFOLIO } from './constants';
import { PortfolioItem, Category, User } from './types';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import PortfolioCard from './components/PortfolioCard';
import PortfolioModal from './components/PortfolioModal';
import ProductPage from './components/ProductPage';
import LoginModal from './components/LoginModal';
import PaymentModal from './components/PaymentModal';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Sparkles, MessageCircle, LogIn, User as UserIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

type ViewState = 'HOME' | 'PRODUCT' | 'ADMIN';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<Category | string>('ALL');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Auth & Admin State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');

  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Scroll Listener for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter Logic
  const allFilteredItems = useMemo(() => {
    let items = MOCK_PORTFOLIO;

    if (selectedCategory !== 'ALL') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
        items = items.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedTag) {
        items = items.filter(item => item.tags.includes(selectedTag) || item.subcategory === selectedTag);
    }

    return items;
  }, [selectedCategory, searchTerm, selectedTag]);

  const visibleItems = useMemo(() => {
    return allFilteredItems.slice(0, displayCount);
  }, [allFilteredItems, displayCount]);

  const hasMore = visibleItems.length < allFilteredItems.length;

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchTerm, selectedTag]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && currentView === 'HOME') {
        setTimeout(() => {
           setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        }, 300);
      }
    }, { threshold: 0.5 });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, currentView]);

  const handleTagClick = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    
    setTransitionMessage(`${tag.replace('#', '')}`);
    setIsTransitioning(true);

    setCurrentView('HOME');

    setTimeout(() => {
        setSelectedTag(formattedTag);
        setSelectedItem(null);
        setSelectedCategory('ALL');
        
        setTimeout(() => {
            const gridElement = document.getElementById('portfolio-grid');
            if (gridElement) {
                const headerHeight = 80;
                const elementPosition = gridElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
            
            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }, 100);
    }, 1200);
  };

  const clearTag = () => setSelectedTag(null);

  const navigateToHome = () => {
    setCurrentView('HOME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReservationClick = () => {
      if (!user) {
          setIsLoginModalOpen(true);
      } else {
          setIsPaymentModalOpen(true);
      }
  };

  // If Admin View
  if (currentView === 'ADMIN') {
      return <AdminDashboard onClose={() => setCurrentView('HOME')} />;
  }

  return (
    <div className="min-h-screen bg-[#eff0f6] font-sans text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white">
      
      {/* Auth & Payment Modals */}
      {isLoginModalOpen && (
          <LoginModal 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={(userData) => {
                setUser(userData);
                setIsLoginModalOpen(false);
            }} 
          />
      )}

      {isPaymentModalOpen && selectedItem && (
          <PaymentModal
            item={selectedItem}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={() => {
                setIsPaymentModalOpen(false);
                setSelectedItem(null);
            }}
          />
      )}


      {/* Floating KakaoTalk Button */}
      <motion.a 
        href="#" 
        target="_blank"
        rel="noopener noreferrer"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 md:w-16 md:h-16 bg-[#FEE500] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        title="카카오톡 문의하기"
      >
        <MessageCircle fill="#3C1E1E" className="text-[#3C1E1E] w-7 h-7 md:w-8 md:h-8" />
      </motion.a>

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-[#e5e5ea] border-t-[#0071e3] rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={20} className="text-[#0071e3]" />
                        </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-2 text-center px-4 tracking-tight">
                        <span className="text-[#0071e3]">{transitionMessage}</span>
                    </h3>
                    <p className="text-[#86868b] font-medium">관련 포트폴리오를 찾고 있습니다...</p>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
                ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 py-0 shadow-sm' 
                : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
            {/* Logo Area */}
            <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={navigateToHome}
            >
                 {/* Logo placeholder */}
            </div>
            
            {/* Menu Items */}
            <div className="flex items-center gap-3 md:gap-8">
                <button 
                    onClick={() => setCurrentView('PRODUCT')}
                    className={`text-xs md:text-[15px] font-medium transition-colors whitespace-nowrap ${currentView === 'PRODUCT' ? 'text-[#1d1d1f] font-semibold' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                >
                    서비스 가이드
                </button>
                <button 
                    onClick={() => setCurrentView('HOME')}
                    className={`text-xs md:text-[15px] font-medium transition-colors whitespace-nowrap ${currentView === 'HOME' ? 'text-[#1d1d1f] font-semibold' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                >
                    스튜디오 피드
                </button>
                
                {/* User Menu */}
                {user ? (
                    <div className="flex items-center gap-3">
                         {user.isAdmin && (
                            <button 
                                onClick={() => setCurrentView('ADMIN')}
                                className="hidden md:block text-xs font-semibold text-[#0071e3] bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                            >
                                관리자 모드
                            </button>
                         )}
                         <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#0071e3] transition-all">
                             <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                         </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-[#1d1d1f] text-white px-3 py-2 md:px-5 md:py-2 rounded-full text-xs md:text-[13px] font-semibold hover:bg-[#3a3a3c] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-1.5"
                    >
                        <LogIn size={14} />
                        로그인
                    </button>
                )}
            </div>
        </div>
      </nav>

      {/* Unified Hero Section */}
      <Hero viewMode={currentView === 'ADMIN' ? 'HOME' : currentView} setViewMode={setCurrentView as any} />

      {currentView === 'HOME' ? (
        <main className="relative min-h-screen bg-[#f5f5f7]">
                
                {/* Portfolio Section */}
                <div id="portfolio-grid" className="max-w-[1600px] mx-auto px-4 md:px-6 pt-10 md:pt-16">
                    
                    {/* 1. Title Section */}
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3 text-[#1d1d1f] break-keep">
                            헤마와 함께한 감동의 순간들을 확인해보세요
                        </h2>
                        <p className="text-[#86868b] font-normal text-sm md:text-lg">
                            영원히 기억될 당신만의 이야기를 만듭니다.
                        </p>
                    </div>

                    {/* 2. Sticky Filter Bar */}
                    <div className="sticky top-16 md:top-20 z-40 py-4 bg-[#f5f5f7]/90 backdrop-blur-md mb-6 transition-all flex justify-center">
                        <FilterBar 
                            selectedCategory={selectedCategory} 
                            onSelectCategory={(cat) => {
                                setSelectedCategory(cat);
                                setSelectedTag(null); 
                            }} 
                        />
                    </div>

                    {/* 3. Search & Active Tag (Centered) */}
                    <div className="flex flex-col items-center mb-10 md:mb-14">
                        <div className="relative group w-full md:w-[420px]">
                            <input 
                                type="text" 
                                placeholder="어떤 순간을 찾으시나요? (예: 축가, AI, 뮤비)"
                                className="w-full pl-11 pr-4 py-3.5 bg-white shadow-sm border border-transparent hover:border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/30 transition-all placeholder:text-[#86868b] text-[#1d1d1f] text-[15px] font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
                        </div>

                         {/* Active Tag Display */}
                        <AnimatePresence>
                            {selectedTag && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full flex justify-center"
                                >
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-sm text-[#86868b] font-medium">선택된 태그:</span>
                                        <div className="flex items-center gap-2 bg-[#1d1d1f] text-white pl-3 pr-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                                            <span>{selectedTag}</span>
                                            <button onClick={clearTag} className="hover:text-gray-300 transition-colors">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Portfolio Grid */}
                <section className="max-w-[1600px] mx-auto px-4 md:px-6 pb-32">
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                >
                    <AnimatePresence>
                        {visibleItems.length > 0 ? (
                            visibleItems.map((item) => (
                            <PortfolioCard 
                                key={item.id} 
                                item={item} 
                                onClick={setSelectedItem} 
                            />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full py-32 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                    <Search size={24} className="text-[#86868b]" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1 text-[#1d1d1f]">검색 결과가 없습니다</h3>
                                <p className="text-[#86868b] text-sm">다른 키워드로 검색해보시거나 카테고리를 변경해보세요.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Loader */}
                {allFilteredItems.length > 0 && hasMore && (
                    <div ref={loadMoreRef} className="w-full py-16 flex justify-center">
                        <div className="flex items-center gap-2 text-[#86868b]">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="text-sm font-medium tracking-wide">더 불러오는 중...</span>
                        </div>
                    </div>
                )}
                </section>
        </main>
      ) : (
        <ProductPage onProductClick={handleTagClick} />
      )}

      {/* Modern Minimal Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative z-10">
        <div className="max-w-[1600px] mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 mb-16">
                <div className="md:col-span-4">
                    <h3 className="font-bold text-2xl mb-6 text-[#1d1d1f]">HEMA STUDIO</h3>
                    <p className="text-[#86868b] leading-relaxed text-sm mb-6 break-keep">
                        헤마스튜디오는 고객의 소중한 순간을 최고의 기술과 감성으로 기록합니다.
                        웨딩부터 AI 솔루션까지, 당신만의 특별한 이야기를 만들어보세요.
                    </p>
                </div>
                
                <div className="md:col-span-2 md:col-start-7">
                    <h4 className="font-semibold text-xs text-[#1d1d1f] mb-4 uppercase tracking-wider">Services</h4>
                    <ul className="space-y-3 text-sm text-[#86868b]">
                        <li onClick={() => setCurrentView('PRODUCT')} className="hover:text-[#0071e3] cursor-pointer transition-colors">서비스 가이드</li>
                        <li onClick={() => setCurrentView('HOME')} className="hover:text-[#0071e3] cursor-pointer transition-colors">스튜디오 피드</li>
                        <li className="hover:text-[#0071e3] cursor-pointer transition-colors">예약 문의</li>
                    </ul>
                </div>

                <div className="md:col-span-4">
                     <h4 className="font-semibold text-xs text-[#1d1d1f] mb-4 uppercase tracking-wider">Contact</h4>
                     <ul className="space-y-3 text-sm text-[#86868b]">
                        <li>서울시 강남구 테헤란로 123, 헤마빌딩 B1</li>
                        <li>02-1234-5678 (10:00 - 20:00)</li>
                        <li>contact@hemastudio.com</li>
                     </ul>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-[#86868b] text-xs font-medium">
                <p>© 2024 HEMA STUDIO. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span className="cursor-pointer hover:text-[#1d1d1f]">이용약관</span>
                    <span className="cursor-pointer hover:text-[#1d1d1f]">개인정보처리방침</span>
                </div>
            </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <PortfolioModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)}
        onTagClick={handleTagClick}
        onReservationClick={handleReservationClick}
      />
    </div>
  );
};

export default App;