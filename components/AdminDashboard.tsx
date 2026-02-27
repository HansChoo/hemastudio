import React, { useState, useEffect } from 'react';
import { PortfolioItem, Order, Category } from '../types';
import { 
    getPortfolios, addPortfolio, updatePortfolio, deletePortfolio, togglePortfolioVisibility,
    getOrders, updateOrderStatus, deleteOrder
} from '../lib/firestore';
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
    Package,
    Loader2,
    Trash2,
    Edit3,
    Eye,
    EyeOff,
    X,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'USERS' | 'SETTINGS';

const CATEGORY_OPTIONS: { label: string; value: Category }[] = [
  { label: '음악', value: 'COVER' },
  { label: '웨딩', value: 'WEDDING' },
  { label: '이벤트', value: 'EVENT' },
  { label: '음반제작', value: 'ALBUM' },
  { label: 'AI서비스', value: 'AI' },
];

interface PortfolioFormData {
  title: string;
  category: Category;
  subcategory: string;
  location: string;
  price: number;
  priceUnit: string;
  capacity: string;
  imageUrl: string;
  videoUrl: string;
  tags: string;
  description: string;
  directorReview: string;
  directorName: string;
  customerReview: string;
  customerName: string;
  client: string;
  period: string;
  tools: string;
}

const emptyForm: PortfolioFormData = {
  title: '',
  category: 'COVER',
  subcategory: '',
  location: '헤마 스튜디오',
  price: 0,
  priceUnit: '건',
  capacity: '1명',
  imageUrl: '',
  videoUrl: '',
  tags: '',
  description: '',
  directorReview: '',
  directorName: '',
  customerReview: '',
  customerName: '',
  client: '',
  period: '',
  tools: '',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [portfolioData, orderData] = await Promise.all([
        getPortfolios(),
        getOrders(),
      ]);
      setPortfolios(portfolioData);
      setOrders(orderData);
    } catch (err) {
      showToast('데이터를 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    onClose();
  };

  const handleFormChange = (field: keyof PortfolioFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category === 'ALL' ? 'COVER' : item.category,
      subcategory: item.subcategory,
      location: item.location,
      price: item.price,
      priceUnit: item.priceUnit,
      capacity: item.capacity,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl || '',
      tags: item.tags.join(', '),
      description: item.description,
      directorReview: item.directorReview,
      directorName: item.directorName,
      customerReview: item.customerReview,
      customerName: item.customerName,
      client: item.client || '',
      period: item.period || '',
      tools: item.tools?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSavePortfolio = async () => {
    if (!formData.title || !formData.imageUrl) {
      showToast('제목과 이미지 URL은 필수입니다.', 'error');
      return;
    }

    setSaving(true);
    try {
      const baseData = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        location: formData.location,
        price: Number(formData.price),
        priceUnit: formData.priceUnit,
        capacity: formData.capacity,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: formData.description,
        directorReview: formData.directorReview,
        directorName: formData.directorName,
        customerReview: formData.customerReview,
        customerName: formData.customerName,
        client: formData.client,
        period: formData.period,
        tools: formData.tools.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingId) {
        await updatePortfolio(editingId, baseData);
        showToast('포트폴리오가 수정되었습니다.', 'success');
      } else {
        await addPortfolio({
          ...baseData,
          likes: 0,
          comments: 0,
          date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        } as Omit<PortfolioItem, 'id'>);
        showToast('포트폴리오가 등록되었습니다.', 'success');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      await loadData();
    } catch (err) {
      showToast('저장에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePortfolio(id);
      showToast('포트폴리오가 삭제되었습니다.', 'success');
      await loadData();
    } catch (err) {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      await togglePortfolioVisibility(id, !currentVisible);
      setPortfolios(prev => prev.map(p => p.id === id ? { ...p, visible: !currentVisible } as any : p));
    } catch (err) {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast('주문 상태가 변경되었습니다.', 'success');
    } catch (err) {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteOrder(id);
      showToast('주문이 삭제되었습니다.', 'success');
      await loadData();
    } catch (err) {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const DashboardHome = () => {
    const totalSales = orders.filter(o => o.status === 'PAID' || o.status === 'COMPLETED').reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '총 매출', value: `${totalSales.toLocaleString()}원`, color: 'text-blue-600' },
            { label: '총 주문', value: `${orders.length}건`, color: 'text-green-600' },
            { label: '대기 중', value: `${pendingOrders}건`, color: 'text-yellow-600' },
            { label: '포트폴리오', value: `${portfolios.length}건`, color: 'text-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold text-[#1d1d1f]`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#1d1d1f] mb-6">최근 주문</h3>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">아직 주문이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#1d1d1f]">{order.productName}</p>
                      <p className="text-xs text-gray-400">{order.customerName} · {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{order.amount.toLocaleString()}원</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#1d1d1f] mb-6">카테고리별 포트폴리오</h3>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const count = portfolios.filter(p => p.category === cat.value).length;
                return (
                  <div key={cat.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span className="text-sm font-bold text-[#0071e3]">{count}건</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderManagement = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-[#1d1d1f] text-lg">예약/주문 관리</h3>
      </div>
      {orders.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
          <p>아직 주문이 없습니다.</p>
        </div>
      ) : (
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
                <th className="px-6 py-4 font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#1d1d1f]">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{order.productName}</td>
                  <td className="px-6 py-4 text-sm text-[#1d1d1f]">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1d1d1f]">{order.amount.toLocaleString()}원</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold px-2 py-1 rounded-full border-none cursor-pointer
                        ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                        ${order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
                      `}
                    >
                      <option value="PENDING">입금대기</option>
                      <option value="PAID">결제완료</option>
                      <option value="COMPLETED">작업완료</option>
                      <option value="CANCELLED">취소됨</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const PortfolioForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#1d1d1f] text-lg">
          {editingId ? '포트폴리오 수정' : '새 포트폴리오 등록'}
        </h3>
        <button onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">제목 *</label>
          <input type="text" value={formData.title} onChange={(e) => handleFormChange('title', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="포트폴리오 제목" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">카테고리</label>
          <select value={formData.category} onChange={(e) => handleFormChange('category', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm">
            {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">서브카테고리</label>
          <input type="text" value={formData.subcategory} onChange={(e) => handleFormChange('subcategory', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="예: 축가녹음" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">가격</label>
          <input type="number" value={formData.price} onChange={(e) => handleFormChange('price', Number(e.target.value))} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">단위</label>
          <input type="text" value={formData.priceUnit} onChange={(e) => handleFormChange('priceUnit', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="건" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">인원</label>
          <input type="text" value={formData.capacity} onChange={(e) => handleFormChange('capacity', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="1명" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">장소</label>
          <input type="text" value={formData.location} onChange={(e) => handleFormChange('location', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">이미지 URL *</label>
          <input type="url" value={formData.imageUrl} onChange={(e) => handleFormChange('imageUrl', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">영상 URL</label>
          <input type="url" value={formData.videoUrl} onChange={(e) => handleFormChange('videoUrl', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="https://youtube.com/..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">태그 (쉼표로 구분)</label>
          <input type="text" value={formData.tags} onChange={(e) => handleFormChange('tags', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="#축가녹음, #웨딩" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">상세 설명</label>
          <textarea value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} rows={5} className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none" placeholder="포트폴리오에 대한 상세 설명을 입력하세요" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">디렉터 이름</label>
          <input type="text" value={formData.directorName} onChange={(e) => handleFormChange('directorName', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">디렉터 리뷰</label>
          <input type="text" value={formData.directorReview} onChange={(e) => handleFormChange('directorReview', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">고객 이름</label>
          <input type="text" value={formData.customerName} onChange={(e) => handleFormChange('customerName', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">고객 리뷰</label>
          <input type="text" value={formData.customerReview} onChange={(e) => handleFormChange('customerReview', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">작업 기간</label>
          <input type="text" value={formData.period} onChange={(e) => handleFormChange('period', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="3일" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1d1d1f] mb-1">사용 장비 (쉼표 구분)</label>
          <input type="text" value={formData.tools} onChange={(e) => handleFormChange('tools', e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="Sony FX3, Premiere Pro" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }} className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          취소
        </button>
        <button onClick={handleSavePortfolio} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0071e3] rounded-lg hover:bg-[#0077ed] disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editingId ? '수정하기' : '등록하기'}
        </button>
      </div>
    </motion.div>
  );

  const ProductManagement = () => (
    <div>
      {showForm && <PortfolioForm />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-[#1d1d1f] text-lg">포트폴리오 관리 ({portfolios.length}건)</h3>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
              className="flex items-center gap-2 bg-[#0071e3] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0077ed]"
            >
              <Plus size={16} />
              상품 등록
            </button>
          )}
        </div>
        {portfolios.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p>등록된 포트폴리오가 없습니다.</p>
            <p className="text-sm mt-1">위의 '상품 등록' 버튼을 눌러 첫 포트폴리오를 추가해보세요.</p>
          </div>
        ) : (
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
                {portfolios.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#1d1d1f] text-sm line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.subcategory}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                        {CATEGORY_OPTIONS.find(c => c.value === item.category)?.label || item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{item.price?.toLocaleString()}원</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVisibility(item.id, item.visible !== false)}
                        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${item.visible !== false ? 'bg-[#34c759]' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item.visible !== false ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditPortfolio(item)} className="text-gray-400 hover:text-[#0071e3] transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeletePortfolio(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">회원 관리 페이지</h3>
      <p className="text-gray-500 mb-6">Firebase Authentication에서 등록된 회원을 관리할 수 있습니다.</p>
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
          <h4 className="font-bold text-[#1d1d1f] mb-4">Firebase 연동 상태</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-medium text-sm">Firebase Authentication</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">연동 완료</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-medium text-sm">Cloud Firestore</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">연동 완료</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-blue-500" />
                <span className="font-medium text-sm">토스페이먼츠 연동</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">연동 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#0071e3] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex font-sans text-[#1d1d1f]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            관리자 로그아웃
          </button>
        </div>
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <LayoutDashboard size={20} />
            </button>
            <span className="font-medium text-[#1d1d1f]">{
              activeTab === 'DASHBOARD' ? '대시보드' :
              activeTab === 'ORDERS' ? '예약/주문 관리' :
              activeTab === 'PRODUCTS' ? '포트폴리오 관리' :
              activeTab === 'USERS' ? '회원 관리' : '환경설정'
            }</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="새로고침">
              <Loader2 size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                A
              </div>
              <span className="text-sm font-semibold hidden md:block">Admin</span>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1">
            {[
              { id: 'DASHBOARD', label: '대시보드' },
              { id: 'ORDERS', label: '예약/주문 관리' },
              { id: 'PRODUCTS', label: '포트폴리오 관리' },
              { id: 'USERS', label: '회원 관리' },
              { id: 'SETTINGS', label: '환경설정' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as Tab); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeTab === item.id ? 'bg-blue-50 text-[#0071e3]' : 'text-gray-600'}`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-500">로그아웃</button>
          </div>
        )}

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
