import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';
import { signIn, signUp } from '../lib/auth';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user: UserType;
      if (isSignUp) {
        user = await signUp(email, password, name);
      } else {
        user = await signIn(email, password);
      }
      onLogin(user);
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (code === 'auth/weak-password') {
        setError('비밀번호는 6자 이상이어야 합니다.');
      } else if (code === 'auth/invalid-email') {
        setError('올바른 이메일 형식을 입력해주세요.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
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

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">
                    {isSignUp ? '회원가입' : '환영합니다!'}
                </h2>
                <p className="text-sm text-[#86868b]">
                    {isSignUp 
                        ? '계정을 만들고 서비스를 이용하세요.' 
                        : '로그인하고 헤마스튜디오의\n특별한 서비스를 이용해보세요.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {isSignUp && (
                    <div className="relative">
                        <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/30 transition-all"
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/30 transition-all"
                    />
                </div>
                <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/30 transition-all"
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#1d1d1f] hover:bg-[#3a3a3c] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        isSignUp ? '가입하기' : '로그인'
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    className="text-sm text-[#0071e3] hover:underline font-medium"
                >
                    {isSignUp ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
                </button>
            </div>

            <p className="text-[11px] text-[#86868b] text-center mt-4">
                로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
