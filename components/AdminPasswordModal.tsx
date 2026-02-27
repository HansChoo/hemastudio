import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertCircle, Loader2, Shield } from 'lucide-react';

interface AdminPasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onSuccess();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 500);
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
              <Shield size={32} className="text-[#0071e3]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">관리자 인증</h2>
            <p className="text-sm text-[#86868b]">
              관리자 페이지에 접속하려면<br/>비밀번호를 입력하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="관리자 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
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
                '접속하기'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminPasswordModal;
