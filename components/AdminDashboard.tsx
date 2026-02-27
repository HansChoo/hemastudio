import React, { useState } from 'react';
import { MOCK_PORTFOLIO, MOCK_ORDERS } from '../constants';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Users, 
    Settings, 
    LogOut, 
    Search, 
    Bell, 
    Plus, 
    MoreHorizontal, 
    ChevronDown, 
    TrendingUp,
    CreditCard,
    Package
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'USERS' | 'SETTINGS';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

  // --- Components for each Tab ---

  const DashboardHome = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: '오늘 매출', value: '850,000원', trend: '+12%', color: 'text-blue-600' },
                { label: '신규 주문', value: '12건', trend: '+4%', color: 'text-green-600' },
                { label: '방문자 수', value: '1,284명', trend: '+22%', color: 'text-purple-600' },
                { label: '전체 회원', value: '4,302명', trend: '+1%', color: 'text-gray-600' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                        <span className={`text-xs font-bold bg-gray-50 px-2 py-1 rounded-full ${stat.color}`}>{stat.trend}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#1d1d1f]">{stat.value}</div>
                </div>
            ))}
        </div>

        {/* Charts Section (Simulated) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#1d1d1f]">매출 통계</h3>
                    <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 px-3 py-1">
                        <option>이번 주</option>
                        <option>이번 달</option>
                    </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="absolute bottom-0 w-full bg-[#0071e3] rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute -bottom-6 w-full text-center text-xs text-gray-400">
                                {['월', '화', '수', '목', '금', '토', '일'][i]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1d1d1f] mb-6">최근 알림</h3>
                <div className="space-y-4">
                    {[
                        { text: '새로운 예약이 접수되었습니다.', time: '5분 전', type: 'order' },
                        { text: '김철수님이 회원가입했습니다.', time: '1시간 전', type: 'user' },
                        { text: '포트폴리오 이미지가 업로드되었습니다.', time: '2시간 전', type: 'system' },
                        { text: '문의글에 답변이 필요합니다.', time: '어제', type: 'alert' },
                    ].map((notif, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <div className={`w-2 h-2 mt-2 rounded-full ${notif.type === 'order' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                            <div>
                                <p className="text-sm text-[#1d1d1f] font-medium leading-snug">{notif.text}</p>
                                <span className="text-xs text-gray-400">{notif.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const OrderManagement = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#1d1d1f] text-lg">예약/주문 관리</h3>
            <div className="flex gap-2">
                 <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">엑셀 다운로드</button>
                 <button className="px-4 py-2 text-sm font-medium text-white bg-[#1d1d1f] rounded-lg hover:bg-[#333]">필터</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#f9f9fb] text-[#86868b] text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 font-semibold">주문번호</th>
                        <th className="px-6 py-4 font-semibold">상품정보</th>
                        <th className="px-6 py-4 font-semibold">주문자</th>
                        <th className="px-6 py-4 font-semibold">결제금액</th>
                        <th className="px-6 py-4 font-semibold">상태</th>
                        <th className="px-6 py-4 font-semibold">결제일시</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {MOCK_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">{order.orderNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{order.productName}</td>
                            <td className="px-6 py-4 text-sm text-[#1d1d1f]">{order.customerName}</td>
                            <td className="px-6 py-4 text-sm font-bold text-[#1d1d1f]">{order.amount.toLocaleString()}원</td>
                            <td className="px-6 py-4">
                                <span className={`
                                    px-2.5 py-1 rounded-full text-xs font-bold
                                    ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                                    ${order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
                                `}>
                                    {order.status === 'PAID' && '결제완료'}
                                    {order.status === 'PENDING' && '입금대기'}
                                    {order.status === 'CANCELLED' && '취소됨'}
                                    {order.status === 'COMPLETED' && '작업완료'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const ProductManagement = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#1d1d1f] text-lg">포트폴리오 관리</h3>
            <button className="flex items-center gap-2 bg-[#0071e3] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0077ed]">
                <Plus size={16} />
                상품 등록
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#f9f9fb] text-[#86868b] text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 font-semibold">이미지</th>
                        <th className="px-6 py-4 font-semibold">상품명</th>
                        <th className="px-6 py-4 font-semibold">카테고리</th>
                        <th className="px-6 py-4 font-semibold">가격</th>
                        <th className="px-6 py-4 font-semibold">노출상태</th>
                        <th className="px-6 py-4 font-semibold text-right">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {MOCK_PORTFOLIO.slice(0, 10).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-[#1d1d1f] text-sm line-clamp-1">{item.title}</div>
                                <div className="text-xs text-gray-400">{item.id}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{item.category}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">{item.price.toLocaleString()}원</td>
                            <td className="px-6 py-4">
                                <div className="w-8 h-4 bg-[#34c759] rounded-full relative cursor-pointer">
                                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-[#1d1d1f] transition-colors"><MoreHorizontal size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const UserManagement = () => (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">회원 관리 페이지</h3>
          <p className="text-gray-500 mb-6">가입한 회원의 목록을 조회하고 등급을 관리할 수 있습니다.</p>
          <button className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-lg font-medium hover:bg-[#333]">회원 목록 불러오기 (데모)</button>
      </div>
  );

  const SettingsPage = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-[#1d1d1f] mb-6">사이트 설정</h3>
        <div className="space-y-6 max-w-2xl">
            <div>
                <label className="block text-sm font-bold text-[#1d1d1f] mb-2">사이트 이름</label>
                <input type="text" value="HEMA STUDIO" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50" readOnly />
            </div>
            <div>
                <label className="block text-sm font-bold text-[#1d1d1f] mb-2">대표 이메일</label>
                <input type="email" value="contact@hemastudio.com" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50" readOnly />
            </div>
            <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-[#1d1d1f] mb-4">결제 설정 (PG)</h4>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl mb-3">
                    <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-blue-500" />
                        <span className="font-medium text-sm">토스페이먼츠 연동</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">연동 완료</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex font-sans text-[#1d1d1f]">
        
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex fixed h-full z-50">
            <div className="h-20 flex items-center px-6 border-b border-gray-100">
                <span className="font-black text-xl tracking-tighter text-[#1d1d1f]">HEMA ADMIN</span>
            </div>
            
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {[
                    { id: 'DASHBOARD', label: '대시보드', icon: LayoutDashboard },
                    { id: 'ORDERS', label: '예약/주문 관리', icon: ShoppingBag },
                    { id: 'PRODUCTS', label: '포트폴리오 관리', icon: Package },
                    { id: 'USERS', label: '회원 관리', icon: Users },
                    { id: 'SETTINGS', label: '환경설정', icon: Settings },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all
                            ${activeTab === item.id 
                                ? 'bg-[#f5f5f7] text-[#0071e3]' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1d1d1f]'}
                        `}
                    >
                        <item.icon size={20} strokeWidth={2} />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={20} />
                    관리자 로그아웃
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
            
            {/* Header */}
            <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm breadcrumbs text-gray-500">
                    <span className="font-medium text-[#1d1d1f]">{
                        activeTab === 'DASHBOARD' ? '대시보드' :
                        activeTab === 'ORDERS' ? '예약/주문 관리' :
                        activeTab === 'PRODUCTS' ? '포트폴리오 관리' :
                        activeTab === 'USERS' ? '회원 관리' : '환경설정'
                    }</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                        <Search size={16} className="text-gray-400" />
                        <input type="text" placeholder="검색..." className="bg-transparent border-none outline-none text-sm w-40" />
                    </div>
                    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Bell size={20} className="text-gray-500" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                            A
                        </div>
                        <span className="text-sm font-semibold hidden md:block">Admin</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <main className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'DASHBOARD' && <DashboardHome />}
                    {activeTab === 'ORDERS' && <OrderManagement />}
                    {activeTab === 'PRODUCTS' && <ProductManagement />}
                    {activeTab === 'USERS' && <UserManagement />}
                    {activeTab === 'SETTINGS' && <SettingsPage />}
                </motion.div>
            </main>
        </div>
    </div>
  );
};

export default AdminDashboard;