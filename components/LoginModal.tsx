import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  
  const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
    // In a real app, this would trigger Firebase Auth
    // Here we simulate a successful login
    const mockUser: UserType = {
        id: 'user_123',
        name: '헤마 고객님',
        email: 'customer@hema.com',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`,
        isAdmin: true // Set to true to demonstrate Admin features
    };
    
    setTimeout(() => {
        onLogin(mockUser);
        onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
        >
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">환영합니다!</h2>
                <p className="text-sm text-[#86868b]">
                    로그인하고 헤마스튜디오의<br/>특별한 서비스를 이용해보세요.
                </p>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={() => handleSocialLogin('kakao')}
                    className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <span className="font-bold">Kakao</span>로 계속하기
                </button>
                <button 
                    onClick={() => handleSocialLogin('naver')}
                    className="w-full h-12 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <span className="font-bold">Naver</span>로 계속하기
                </button>
                <button 
                    onClick={() => handleSocialLogin('google')}
                    className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-[#1d1d1f] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <span className="font-bold">Google</span>로 계속하기
                </button>
            </div>

            <p className="text-[11px] text-[#86868b] text-center mt-6">
                로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;