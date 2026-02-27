import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PaymentModalProps {
  item: PortfolioItem;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ item, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');

  const handlePayment = () => {
    setIsProcessing(true);
    setStep('PROCESSING');
    
    // Simulate API call to Toss Payments
    setTimeout(() => {
        setIsProcessing(false);
        setStep('SUCCESS');
        setTimeout(() => {
            onSuccess();
        }, 2000);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center p-0 md:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative w-full md:max-w-md bg-white rounded-t-[32px] md:rounded-[32px] p-6 md:p-8 shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
        >
            {step !== 'SUCCESS' && (
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>
            )}

            {step === 'SELECT' && (
                <>
                    <h3 className="text-xl font-bold text-[#1d1d1f] mb-1">결제하기</h3>
                    <p className="text-sm text-[#86868b] mb-6">{item.title}</p>

                    <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#86868b]">상품 금액</span>
                            <span className="text-base font-bold text-[#1d1d1f]">{item.price.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-[#86868b]">부가세(VAT)</span>
                            <span className="text-base font-bold text-[#1d1d1f]">{(item.price * 0.1).toLocaleString()}원</span>
                        </div>
                        <div className="border-t border-gray-200 my-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-[#1d1d1f]">총 결제금액</span>
                            <span className="text-2xl font-bold text-[#0071e3]">{(item.price * 1.1).toLocaleString()}원</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-auto">
                        <button onClick={handlePayment} className="w-full p-4 border rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-gray-400 group-hover:text-[#0071e3]" />
                                <span className="font-semibold text-[#1d1d1f]">신용/체크카드</span>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-[#0071e3]" />
                        </button>
                        <button onClick={handlePayment} className="w-full p-4 border rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Smartphone className="text-gray-400 group-hover:text-[#0071e3]" />
                                <span className="font-semibold text-[#1d1d1f]">토스페이</span>
                            </div>
                             <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</div>
                        </button>
                    </div>

                    <button 
                        onClick={handlePayment}
                        className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-lg mt-6 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                    >
                        결제하기
                    </button>
                </>
            )}

            {step === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center h-full flex-1">
                    <Loader2 size={48} className="text-[#0071e3] animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-[#1d1d1f]">결제 진행 중입니다...</h3>
                    <p className="text-sm text-[#86868b] mt-2">창을 닫지 마세요.</p>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center h-full flex-1 text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle size={40} className="text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2">결제가 완료되었습니다!</h3>
                    <p className="text-[#86868b] mb-8">
                        예약 내역은 카카오톡으로 발송되었습니다.<br/>
                        담당 디렉터가 1시간 이내로 연락드릴 예정입니다.
                    </p>
                    <div className="w-full bg-gray-50 rounded-xl p-4 mb-4 text-left">
                        <div className="text-xs text-[#86868b] mb-1">예약번호</div>
                        <div className="text-sm font-bold text-[#1d1d1f]">ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    </div>
                </div>
            )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;