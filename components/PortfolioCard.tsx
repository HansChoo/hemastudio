import React from 'react';
import { PortfolioItem } from '../types';
import { Users, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // 2-Step Fallback:
    // If the image fails, load a guaranteed valid placeholder from Placehold.co
    // This is the "Nuclear Option" to ensure no broken images appear.
    e.currentTarget.src = `https://placehold.co/800x600/f5f5f7/1d1d1f?text=${encodeURIComponent(item.category)}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(item)}
      className="group cursor-pointer bg-white rounded-[24px] md:rounded-[32px] p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-[18px] md:rounded-[24px] overflow-hidden bg-gray-100 isolate mb-4">
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge - Minimalist */}
        <div className="absolute top-3 left-3">
             <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide uppercase text-[#1d1d1f] shadow-sm">
                {item.category}
             </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-[15px] md:text-[17px] font-bold text-[#1d1d1f] leading-snug tracking-tight line-clamp-2 break-keep group-hover:text-[#0071e3] transition-colors">
            {item.title}
            </h3>
            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-[#0071e3] transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300" />
        </div>
        
        <div className="mb-3 md:mb-4">
             <span className="text-[11px] md:text-xs font-semibold text-[#86868b] uppercase tracking-wide">
                {item.subcategory}
             </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 group-hover:border-gray-100 transition-colors">
            <div className="flex items-center gap-3 text-[#86868b] text-[11px] md:text-xs font-medium">
                <span className="flex items-center gap-1">
                    <Users size={12} className="md:w-[14px] md:h-[14px]"/>
                    {item.capacity}
                </span>
                <span className="flex items-center gap-1">
                    <Heart size={12} className="md:w-[14px] md:h-[14px]"/>
                    {item.likes}
                </span>
            </div>
            <div className="text-sm md:text-[15px] font-bold text-[#1d1d1f]">
                {item.price.toLocaleString()}원
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;