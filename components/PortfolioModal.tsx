import React, { useEffect } from 'react';
import { PortfolioItem } from '../types';
import { X, Heart, Star, CheckCircle, Clock, User, Sparkles, Users, ChevronRight, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
  onReservationClick?: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose, onTagClick, onReservationClick }) => {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  if (!item) return null;

  // Robust Fallback using Placehold.co to guarantee no broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     e.currentTarget.src = "https://placehold.co/800x600/f5f5f7/1d1d1f?text=HEMA+STUDIO";
  };

  // Reliable Images for blog content based on category
  const getContentImages = (itemId: string, category: string) => {
    // Using verified Unsplash IDs that are highly available
    const meetingImg = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; 
    const scene1 = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; 
    const scene2 = 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; 
    const resultImg = item.imageUrl; 

    return { meetingImg, scene1, scene2, resultImg };
  };

  const images = getContentImages(item.id, item.category);

  const renderBlogContent = () => {
    const paragraphs = item.description.split('\n\n');
    return paragraphs.map((para, index) => (
        <React.Fragment key={index}>
            <p className="mb-6 leading-[1.7] text-[#1d1d1f] font-normal text-[16px] md:text-[17px] whitespace-pre-wrap tracking-normal break-keep">
                {para}
            </p>
            
            {index === 1 && (
               <figure className="my-10 w-full group">
                 <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                    <img 
                        src={images.meetingImg} 
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="Meeting" 
                        onError={handleImageError}
                    />
                 </div>
                 <figcaption className="text-center text-xs text-[#86868b] mt-3 font-medium flex items-center justify-center gap-1.5">
                    <Sparkles size={12} className="text-[#0071e3]" />
                    디렉터와의 1:1 맞춤 상담 진행
                 </figcaption>
               </figure>
            )}

            {index === 2 && (
               <figure className="my-10 w-full">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-2xl overflow-hidden bg-gray-50 h-40 md:h-56 shadow-sm">
                        <img 
                            src={images.scene1} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                            alt="Scene 1" 
                            onError={handleImageError}
                        />
                     </div>
                     <div className="rounded-2xl overflow-hidden bg-gray-50 h-40 md:h-56 shadow-sm">
                        <img 
                            src={images.scene2} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                            alt="Scene 2" 
                            onError={handleImageError}
                        />
                     </div>
                 </div>
                 <figcaption className="text-center text-xs text-[#86868b] mt-3 font-medium">
                    생동감 넘치는 촬영 및 녹음 현장 스케치
                 </figcaption>
               </figure>
            )}

             {index === 4 && (
               <figure className="my-10 w-full">
                 <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <img 
                        src={images.resultImg} 
                        className="w-full object-cover" 
                        alt="Final Result" 
                        onError={handleImageError}
                    />
                 </div>
               </figure>
            )}
        </React.Fragment>
    ));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#323232]/30 backdrop-blur-xl transition-all"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white w-full h-[96vh] md:h-[90vh] md:max-w-[1280px] rounded-t-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row font-sans ring-1 ring-black/5"
        >
          {/* Close Button Desktop */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-[#e5e5ea]/80 hover:bg-[#d1d1d6] backdrop-blur-md p-2.5 rounded-full text-[#1d1d1f] transition-all hidden md:block"
          >
            <X size={20} />
          </button>
          
          {/* Mobile Close Indicator */}
          <div className="absolute top-0 left-0 right-0 h-8 flex justify-center items-center md:hidden bg-white z-50" onClick={onClose}>
             <div className="w-12 h-1.5 bg-[#e5e5ea] rounded-full" />
          </div>

          {/* LEFT SIDEBAR (Product Details) - Fixed on Desktop */}
          <div className="hidden md:flex w-[400px] shrink-0 bg-[#fbfbfd] border-r border-gray-200 flex-col h-full overflow-hidden z-10">
             <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-5">
                         <span className="text-[10px] font-bold text-white bg-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                            {item.category}
                         </span>
                         <span className="text-[13px] text-[#86868b] font-medium tracking-wide">{item.subcategory}</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-[#1d1d1f] leading-[1.15] mb-6 tracking-tight break-keep">
                        {item.title}
                    </h2>
                    
                    {/* Tags Desktop */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {item.tags.map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => onTagClick(tag)}
                                className="px-3 py-1.5 bg-white border border-[#d2d2d7] hover:border-[#0071e3] hover:text-[#0071e3] text-[#1d1d1f] text-[11px] font-semibold rounded-full transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 bg-[#f5f5f7] rounded-full"><User size={18} className="text-[#1d1d1f]"/></div>
                            <div>
                                <div className="text-[11px] font-bold text-[#86868b] mb-0.5">고객</div>
                                <div className="font-semibold text-[#1d1d1f] text-sm">{item.client}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 bg-[#f5f5f7] rounded-full"><Clock size={18} className="text-[#1d1d1f]"/></div>
                            <div>
                                <div className="text-[11px] font-bold text-[#86868b] mb-0.5">제작 기간</div>
                                <div className="font-semibold text-[#1d1d1f] text-sm">{item.period}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-2 bg-[#f5f5f7] rounded-full"><Users size={18} className="text-[#1d1d1f]"/></div>
                            <div>
                                <div className="text-[11px] font-bold text-[#86868b] mb-0.5">참여 인원</div>
                                <div className="font-semibold text-[#1d1d1f] text-sm">{item.capacity}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Director Profile - Mini */}
                <div className="mb-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.directorName}`} alt="Director" className="w-full h-full object-cover" onError={handleImageError}/>
                         </div>
                         <div>
                            <div className="text-[10px] font-bold text-[#86868b]">총괄 디렉터</div>
                            <div className="font-bold text-[#1d1d1f]">{item.directorName}</div>
                         </div>
                    </div>
                </div>
             </div>

             {/* Sticky Pricing Card Desktop */}
             <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-20">
                <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs font-semibold text-[#86868b]">상품 견적</span>
                    <div>
                        <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">{item.price.toLocaleString()}</span>
                        <span className="text-sm font-medium text-[#86868b] ml-1">원~</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={onReservationClick}
                        className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 text-[15px] flex justify-center items-center gap-2"
                    >
                        상담 예약하기 <ChevronRight size={16}/>
                    </button>
                    <button className="px-4 bg-[#f5f5f7] hover:bg-[#e5e5ea] rounded-xl text-[#1d1d1f] transition-colors">
                        <Heart size={20} />
                    </button>
                    <button className="px-4 bg-[#f5f5f7] hover:bg-[#e5e5ea] rounded-xl text-[#1d1d1f] transition-colors">
                        <Share size={20} />
                    </button>
                </div>
             </div>
          </div>

          {/* RIGHT CONTENT (Main Scrollable) */}
          <div className="flex-1 bg-white h-full overflow-y-auto custom-scrollbar relative">
               
               {/* Mobile Header (Shown only on Mobile) */}
               <div className="md:hidden p-6 pb-0 pt-12">
                   <div className="flex items-center gap-2 mb-3">
                         <span className="text-[10px] font-bold text-white bg-black px-2.5 py-1 rounded-full uppercase">
                            {item.category}
                         </span>
                         <span className="text-xs text-[#86868b] font-medium tracking-wide">{item.subcategory}</span>
                    </div>
                    <h2 className="text-[26px] font-bold text-[#1d1d1f] leading-[1.2] mb-5 tracking-tight break-keep">
                        {item.title}
                    </h2>

                    {/* Mobile Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags.map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => onTagClick(tag)}
                                className="px-3 py-1.5 bg-[#f5f5f7] border border-transparent active:bg-[#e5e5ea] text-[#1d1d1f] text-[11px] font-semibold rounded-full transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-8 bg-[#f9f9fb] p-4 rounded-2xl border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] text-[#86868b] font-bold mb-1">고객</span>
                            <span className="text-xs font-semibold text-[#1d1d1f] line-clamp-1">{item.client}</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-l border-gray-200 pl-3">
                            <span className="text-[10px] text-[#86868b] font-bold mb-1">기간</span>
                            <span className="text-xs font-semibold text-[#1d1d1f]">{item.period}</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-l border-gray-200 pl-3">
                            <span className="text-[10px] text-[#86868b] font-bold mb-1">인원</span>
                            <span className="text-xs font-semibold text-[#1d1d1f]">{item.capacity}</span>
                        </div>
                    </div>
               </div>

               <div className="pb-32">
                    <div className="w-full aspect-video bg-[#f5f5f7] relative mb-10 md:mb-12">
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>

                    <div className="max-w-[680px] mx-auto px-6 md:px-0">
                        {/* Editor's Note Style Header */}
                        <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#f5f5f7] rounded-full overflow-hidden border border-gray-100">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.directorName}`} alt="Director" className="w-full h-full object-cover" onError={handleImageError}/>
                                </div>
                                <div>
                                    <div className="text-[10px] text-[#86868b] font-bold mb-0.5 tracking-wider">담당 디렉터</div>
                                    <div className="font-bold text-[15px] text-[#1d1d1f]">{item.directorName}</div>
                                </div>
                             </div>
                             <div className="text-xs font-medium text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full">
                                 {item.date}
                             </div>
                        </div>

                        <article className="min-h-[300px] text-[#1d1d1f]">
                            {renderBlogContent()}
                        </article>

                        {/* Customer Review Section - Card Style */}
                        <section className="mt-16 mb-10">
                             <div className="bg-[#f5f5f7] rounded-[24px] p-8 md:p-10 text-center relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300" />
                                 <div className="flex justify-center text-[#ffcc00] mb-5 gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                 </div>
                                 <p className="text-lg md:text-xl font-semibold text-[#1d1d1f] leading-relaxed mb-6 break-keep italic">
                                     "{item.customerReview}"
                                 </p>
                                 <div className="flex items-center justify-center gap-2">
                                     <span className="font-bold text-[#1d1d1f] text-sm">{item.customerName} 님</span>
                                     <CheckCircle size={16} className="text-[#0071e3]" />
                                 </div>
                             </div>
                        </section>
                    </div>
               </div>

                {/* Mobile Floating Action Bar */}
                <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[24px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4">
                        <div className="pl-2">
                             <div className="text-[10px] font-bold text-[#86868b]">예상 견적</div>
                             <div className="text-lg font-bold text-[#1d1d1f]">{item.price.toLocaleString()}<span className="text-xs font-normal text-[#86868b]">원~</span></div>
                        </div>
                        <button 
                            onClick={onReservationClick}
                            className="bg-[#0071e3] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 text-sm flex items-center gap-1 active:scale-95 transition-transform"
                        >
                            예약하기 <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PortfolioModal;