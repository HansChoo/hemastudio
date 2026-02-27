import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { PortfolioItem, Order } from '../types';

const portfolioRef = collection(db, 'portfolios');
const ordersRef = collection(db, 'orders');

export async function getPortfolios(): Promise<PortfolioItem[]> {
  const q = query(portfolioRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as PortfolioItem[];
}

export async function getPortfoliosByCategory(category: string): Promise<PortfolioItem[]> {
  const q = query(portfolioRef, where('category', '==', category), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as PortfolioItem[];
}

export async function addPortfolio(item: Omit<PortfolioItem, 'id'>): Promise<string> {
  const docRef = await addDoc(portfolioRef, {
    ...item,
    createdAt: Timestamp.now(),
    visible: true,
  });
  return docRef.id;
}

export async function updatePortfolio(id: string, data: Partial<PortfolioItem>): Promise<void> {
  await updateDoc(doc(db, 'portfolios', id), data);
}

export async function deletePortfolio(id: string): Promise<void> {
  await deleteDoc(doc(db, 'portfolios', id));
}

export async function togglePortfolioVisibility(id: string, visible: boolean): Promise<void> {
  await updateDoc(doc(db, 'portfolios', id), { visible });
}

export async function getOrders(): Promise<Order[]> {
  const q = query(ordersRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Order[];
}

export async function addOrder(order: Omit<Order, 'id'>): Promise<string> {
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, 'orders', id));
}
