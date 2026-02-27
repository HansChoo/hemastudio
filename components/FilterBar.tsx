import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { motion } from 'framer-motion';
import { Mic2, Heart, Sparkles, Music, Cpu, Layers } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: Category | string;
  onSelectCategory: (category: Category | string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, onSelectCategory }) => {
  
  const getIcon = (catValue: string) => {
      switch(catValue) {
          case 'ALL': return <Layers size={16} />;
          case 'COVER': return <Mic2 size={16} />;
          case 'WEDDING': return <Heart size={16} />;
          case 'EVENT': return <Sparkles size={16} />;
          case 'ALBUM': return <Music size={16} />;
          case 'AI': return <Cpu size={16} />;
          default: return null;
      }
  };

  const getActiveColorClass = (catValue: string) => {
      switch(catValue) {
          case 'COVER': return 'text-rose-600';
          case 'WEDDING': return 'text-pink-600';
          case 'EVENT': return 'text-orange-500';
          case 'ALBUM': return 'text-purple-600';
          case 'AI': return 'text-blue-600';
          default: return 'text-gray-900';
      }
  };

  const renderButton = (catValue: string, isFullWidthMobile = false) => {
    const cat = CATEGORIES.find(c => c.value === catValue);
    if (!cat) return null;

    const isActive = selectedCategory === cat.value;
    const icon = getIcon(cat.value as string);
    const activeTextColor = getActiveColorClass(cat.value as string);

    return (
        <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.value)}
            className={`
                relative px-4 py-2 md:py-2.5 rounded-full text-[13px] md:text-[15px] font-medium transition-all duration-300 z-10 flex items-center justify-center gap-1.5 group
                ${isFullWidthMobile ? 'w-full md:w-auto' : ''}
                ${isActive 
                ? 'text-[#1d1d1f]' 
                : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-50'}
            `}
        >
            {isActive && (
                <motion.span 
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-[#eff0f6] rounded-full -z-10" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className={`transition-colors duration-300 ${isActive ? activeTextColor : 'text-[#9ca3af] group-hover:text-[#6b7280]'}`}>
                {icon}
            </span>
            <span className="whitespace-nowrap">{cat.label}</span>
        </button>
    );
  };

  const otherCategories = CATEGORIES.filter(c => c.value !== 'ALL');

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div className="bg-white/90 backdrop-blur-xl p-1.5 md:p-2 rounded-[20px] md:rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-200/60 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-1 max-w-full md:w-auto">
         
         {/* Top Section (Mobile): ALL */}
         <div className="flex justify-center w-full md:w-auto">
            {renderButton('ALL', true)}
         </div>

         {/* Divider (Mobile Only) */}
         <div className="w-full h-[1px] bg-gray-100 md:hidden" />
         
         {/* Divider (Desktop Only) - Vertical Separator */}
         <div className="hidden md:block w-[1px] h-6 bg-gray-200 mx-1" />

         {/* Bottom Section (Mobile): Others */}
         <div className="flex flex-wrap justify-center gap-1 md:gap-1 w-full md:w-auto">
            {otherCategories.map(cat => renderButton(cat.value as string))}
         </div>
         
      </div>
    </div>
  );
};

export default FilterBar;