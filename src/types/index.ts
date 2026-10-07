export type UserRole = 'buyer' | 'tenant' | 'owner' | 'agent' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl: string;
  token?: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  location: string;
  district: string;
  propertyType: 'Residential' | 'Commercial' | 'Investment' | 'Land';
  beds?: number;
  baths?: number;
  areaSqMeters?: number;
  areaSqFt?: number;
  areaHectares?: number;
  status: 'Active' | 'Pending Approval' | 'Reserved';
  views: number;
  leads: number;
  imageUrl: string;
  aiScore?: number;
  growthPotential?: string;
  riskLevel?: 'Very Low' | 'Low' | 'Moderate';
  description?: string;
  featured?: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'user' | 'agent';
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  aiScoreCard?: {
    score: number;
    growthPotential: string;
    riskLevel: string;
    rationale: string;
  };
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  online: boolean;
  propertyContext?: {
    id: string;
    title: string;
    price: string;
    image: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  tag?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'lead' | 'valuation' | 'message' | 'alert';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  reducedMotion: boolean;
  notificationsEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  currency: 'USD' | 'RWF' | 'EUR';
  priceRangeMax: number; // slider
  minRoiPercent: number; // slider
  maxDistanceKm: number; // slider
  fontSizeMultiplier: number; // slider
}
