export type Category = 'ALL' | 'WEDDING' | 'COVER' | 'EVENT' | 'ALBUM' | 'AI';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    isAdmin: boolean;
    joinDate?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
    date: string;
    paymentMethod: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: Category;
  subcategory: string; // e.g., 'Classical', 'Pop', 'Corporate'
  location: string;
  price: number;
  priceUnit: string; // e.g., 'package' or 'hour'
  capacity: string; // e.g., 'Max 8 people' or '5 people'
  imageUrl: string;
  videoUrl?: string; // For the modal
  tags: string[];
  likes: number;
  comments: number;
  directorReview: string;
  directorName: string;
  customerReview: string;
  customerName: string;
  description: string;
  date: string;
  // Updated fields for detailed layout
  client?: string;
  period?: string; // Production Duration
  tools?: string[]; // Equipment or Software used
}

export interface FilterOption {
  id: string;
  label: string;
  value: Category | string;
}