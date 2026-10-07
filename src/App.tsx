/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Property, User, NotificationItem, UserPreferences } from './types/index.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { Dashboard } from './screens/Dashboard.js';
import { PublicPortal } from './screens/PublicPortal.js';
import { ChatScreen } from './screens/ChatScreen.js';
import { InsightsScreen } from './screens/InsightsScreen.js';
import { AuthScreen } from './screens/AuthScreen.js';
import { AddPropertyModal } from './components/AddPropertyModal.js';
import { ValuationModal } from './components/ValuationModal.js';
import { BookViewingModal } from './components/BookViewingModal.js';
import { SettingsModal } from './components/SettingsModal.js';
import { DocumentationModal } from './components/DocumentationModal.js';
import { PropertyDetailModal } from './components/PropertyDetailModal.js';
import { PropertyComparisonModal } from './components/PropertyComparisonModal.js';

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Kigali View Heights',
    price: 450000,
    formattedPrice: '$450,000',
    location: 'Rebero District, Kigali',
    district: 'Rebero',
    propertyType: 'Residential',
    beds: 4,
    baths: 4,
    areaSqMeters: 420,
    status: 'Active',
    views: 192,
    leads: 14,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
    aiScore: 94,
    growthPotential: '+12.4% /yr',
    riskLevel: 'Very Low',
    featured: true,
    description:
      'Ultra-modern luxury villa with infinity pool, floor-to-ceiling glass panoramic windows and smart climate engineering overlooking the Rebero hills.',
  },
  {
    id: 'prop-2',
    title: 'Bugesera Industrial Plot',
    price: 120000,
    formattedPrice: '$120,000',
    location: 'Bugesera Special Economic Zone',
    district: 'Bugesera',
    propertyType: 'Land',
    areaHectares: 1.2,
    status: 'Pending Approval',
    views: 84,
    leads: 3,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzX8KJ39U9HLMpeIoVllGed8qJ1WR-uqDyJxjsSVCEQ2TaEqOuzVbM92tynbPesQlFg8jpxkT0c2kfHFfHccOvvVzQ-X3dxZOZoalo6_1TxRiyvQDJCJcvcZEfM0Ghns-1qdMHjBkKlU9Of8lDCcQ_L-ibZjsw4b9LEkaIO_QmzXxlzY-ps5rlVMFIuJZ6stolQNU6fibjYs8eG7tVHlhC5bt4MM-AW0_Gu83p9vSOEkAKbG-1KtW81fISQanEbSMSoHIX4nMg6Vg',
    aiScore: 88,
    growthPotential: '+18.5% /yr',
    riskLevel: 'Low',
    featured: false,
    description:
      'Prime grade-A industrial development parcel near the upcoming Bugesera International Airport with dedicated road infrastructure.',
  },
  {
    id: 'prop-3',
    title: 'The Horizon Plaza',
    price: 2400000,
    formattedPrice: '$2.4M',
    location: 'City Center, Kigali',
    district: 'Nyarugenge',
    propertyType: 'Commercial',
    areaSqMeters: 2800,
    status: 'Active',
    views: 410,
    leads: 28,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7naNZ_oasi-90oPB6UL1QXQniwd0xxcTsefTzEz3AJXdb1Clzi6I_5O0pFX6APuUh9cld57-qBGzChnHG4war9Okas08IVa1Vxr2vlQjhIVGP6bIRuz08z966eXeS5kyioqCNAo3b07MaDdp6bSRZVY7bCw9Uku_KSLoGmMmB4kTspjOColMzW8kW65FbdFTHieOiPqlpMwRbjzTBV0HEaxZxdmjHxBMcQ7euF-4cz3P9WhHerMO0a5pMnxaEQ1DX30Xnm5z8RyXe',
    aiScore: 91,
    growthPotential: '+9.8% /yr',
    riskLevel: 'Very Low',
    featured: true,
    description:
      'Contemporary commercial tower in Kigali central business district featuring Class-A office suites and anchor bank tenancy.',
  },
  {
    id: 'prop-4',
    title: 'Lake Trail Estate',
    price: 1100000,
    formattedPrice: '$1.1M',
    location: 'Kibuye, Lake Kivu',
    district: 'Karongi',
    propertyType: 'Investment',
    beds: 5,
    baths: 5,
    areaSqMeters: 650,
    status: 'Active',
    views: 275,
    leads: 19,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeeZuGAHNWmlWYCWaRRf5wZxKB4lQaLOI-i65zMy3LuJIYYSmtu0VDaXJe5ZpTQFVGdYjWHKIAAkk5y6UKTNbUgvihKbypaz42uzz6UN86cG1ZsvDgrMiqV1sQ_Ntuqo116cG23GJyCHRcJwnyTQHwQjvZHns1J73vSNZuGi_Un9NYfuEdGg4_9YfXo4ATjznCQUUtAjy7Ot2UhrZHY8XhgfM68ePDMHkOM0ch86lrW2imQsXBNoAb4roUg8HcLBptn_-KBcJKfTwZ',
    aiScore: 96,
    growthPotential: '+14.2% /yr',
    riskLevel: 'Low',
    featured: true,
    description:
      'Boutique waterfront hospitality compound with private pontoon, lush indigenous gardens, and eco-sustainable solar systems.',
  },
  {
    id: 'prop-5',
    title: 'The Obsidian Pavilion',
    price: 850000,
    formattedPrice: '$850,000',
    location: 'Nyarutarama Estate, Kigali',
    district: 'Nyarutarama',
    propertyType: 'Residential',
    beds: 5,
    baths: 4,
    areaSqMeters: 550,
    status: 'Active',
    views: 312,
    leads: 22,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBPAT2iRLAu6TsJ8C9sklC6Nh7liAEVTnpqBYbUAN2_bLel1Jc8Ulk2rv0Q5_ryr4g1qFGVut8i6pl1dmG_1II34_Q-1eRdXwFL0ZMWKsHnrtKQ2jByLDXuSIp7d4Ds3XBaAQiZgFU_LsMwa6rqwbvDhxPbsQyb7XsIRg4l3CNRHLUT9bfW00bg8rw6Kyyd5-gmEJQJk8p0OBJdNiFSbeWvUY0LoIkgYeX0koQ2yzpSwprVWDwc_P0oWosEx-O4eM-ckiKRcsy4rN',
    aiScore: 97,
    growthPotential: '+13.5% /yr',
    riskLevel: 'Very Low',
    featured: true,
    description:
      'A masterclass in tropical modernism featuring integrated solar power, rain harvesting, and serene infinity pool overlooking Nyarutarama golf course.',
  },
  {
    id: 'prop-6',
    title: 'Terrace Heights Phase II',
    price: 320000,
    formattedPrice: '$320,000',
    location: 'Rebero Ridge, Kigali',
    district: 'Rebero',
    propertyType: 'Investment',
    beds: 3,
    baths: 2,
    areaSqMeters: 220,
    status: 'Active',
    views: 180,
    leads: 11,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOt6tlk3-Kt2y7_2EEdsC6MBgsZ36fl2KK_nOuaxCoswVSnL5OP-QH0PuJZGMyYTGg4reJxefEBAJ0uSSyg6tqUa63AU6caz9Ax-Z1_b8VlivM9QOUS6XL76YKQFQDxKN1qvImzzXjVMA74eH6TFHwT0jWFHxCQ7z6lRVUuBULMuwAVVlX3V2VG5vHpU5Q9t9zI4vFxyAWdVPaEacAmogzZkzYl7vkbtXSD_cstkm3y6ZulAexKUzry5fXbQjwAty_vFH1RAW1MU8x',
    aiScore: 93,
    growthPotential: '+8.0% Guaranteed',
    riskLevel: 'Very Low',
    featured: false,
    description:
      'Sustainable apartment living with panoramic views of Kigali city skyline, underground parking, and community fitness center.',
  },
  {
    id: 'prop-7',
    title: 'Slope House II',
    price: 840000,
    formattedPrice: '$840,000',
    location: 'Kigali Heights, District 4',
    district: 'Gasabo',
    propertyType: 'Residential',
    beds: 4,
    baths: 3,
    areaSqMeters: 380,
    status: 'Active',
    views: 164,
    leads: 9,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbLk0AYJjnlR-SSNMhaHaN9TbdEgGBK89HpcX1f4H9bu1UgO-Lv4KYzoelEfQVAM0HxpcXW4X4mGZnvFohAUoBOhEJXqK0ryvTKc3OTCnYLB1McFD-ocTTDTWgLaPSswE_oG6FbwOUNd8KoQBWvfs8yQLTXPbZEe0087PUy4gRZsgbVTS48QvMzgjxyrDdtjL4r5IRXiep5GKnsACtvRvZRippURtJfDLhAsvscooTRdBLMRNU7RaW0VGe_2AynFuyI-hzF3cAXzBP',
    aiScore: 92,
    growthPotential: '+11.2% /yr',
    riskLevel: 'Low',
    featured: true,
    description:
      'Architectural stone cantilever villa cascading down the natural topography with private terraced gardens and sunset lounge.',
  },
  {
    id: 'prop-8',
    title: 'The Gishushu Manor',
    price: 1200000,
    formattedPrice: '$1,200,000',
    location: 'Gishushu, Kigali',
    district: 'Gishushu',
    propertyType: 'Residential',
    beds: 6,
    baths: 7,
    areaSqMeters: 620,
    status: 'Active',
    views: 290,
    leads: 18,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAP8FumKAHmSQmZcqdW8vc6meGKqBVqlB1_EFWzgnp1Ia5fmUHjIO9AQQiyCrDhAt9zQM1sC1iW8u1VKh897Fwu6CbD0CTa3-OWQgnzLGWGGCtN5UE_213PhUaS_2dLIT1mmQ87u7Ys-nHlsp5b_-PfxFGVVTiij1osHUUFc31rf7K63TdCICYbitZBon2uSxwRz167_kQP3Tm4oFqR5LyxRNoM-ZEtn9dTx5ngIlmrG36EpHOGagwQr5coiel483GQFMnMFgnVvfB',
    aiScore: 95,
    growthPotential: '+10.5% /yr',
    riskLevel: 'Low',
    featured: true,
    description:
      'Classical neoclassical estate with sweeping terraces, swimming pool, separate guest lodge and private driveway in peaceful Gishushu diplomatic quarter.',
  },
];

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'portal' | 'chat' | 'insights' | 'auth'>('dashboard');
  const [sidebarTab, setSidebarTab] = useState<string>('estates');
  const [deviceMode, setDeviceMode] = useState<'fluid' | 'desktop' | 'tablet' | 'mobile'>('fluid');

  // Dark & Contrast Mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: isDark ? 'dark' : 'light',
    highContrast: false,
    reducedMotion: false,
    notificationsEnabled: true,
    aiRecommendationsEnabled: true,
    currency: 'USD',
    priceRangeMax: 2000000,
    minRoiPercent: 8,
    maxDistanceKm: 25,
    fontSizeMultiplier: 100,
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('digital_estate_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Properties State (Synchronous Instant Load + Backend Sync)
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeChatProperty, setActiveChatProperty] = useState<Property | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isBookViewingOpen, setIsBookViewingOpen] = useState(false);
  const [viewingTargetProperty, setViewingTargetProperty] = useState<Property | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);

  // Keyboard shortcut to close open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddOpen(false);
        setIsValuationOpen(false);
        setIsBookViewingOpen(false);
        setIsSettingsOpen(false);
        setIsDocsOpen(false);
        setIsDetailOpen(false);
        setIsComparisonOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Sync high-contrast class on document element
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [preferences.highContrast]);

  // Sync font size multiplier
  useEffect(() => {
    document.documentElement.style.fontSize = `${preferences.fontSizeMultiplier}%`;
  }, [preferences.fontSizeMultiplier]);

  // Background sync with API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.properties;
          if (Array.isArray(list) && list.length > 0) {
            setProperties(list);
          }
        }
      } catch {
        // Fallback already pre-seeded
      }
    };

    fetchProperties();
  }, []);

  // Notifications & Real-Time SSE
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.notifications)
            ? data.notifications
            : [];
          if (list.length > 0) {
            setNotifications(list);
            return;
          }
        }
      } catch {
        // Fallback default notifications
      }

      setNotifications([
        {
          id: 'notif-1',
          title: 'New VIP Lead Assigned',
          message: 'Jean-Luc Habimana requested a private chauffeur viewing for Kigali View Heights.',
          time: '10m ago',
          read: false,
          type: 'lead',
        },
        {
          id: 'notif-2',
          title: 'AI Valuation Complete',
          message: 'Rebero Ridge parcel appraised at $475,000 (+5.5% above list price).',
          time: '1h ago',
          read: false,
          type: 'valuation',
        },
        {
          id: 'notif-3',
          title: 'Direct Message from Dany',
          message: 'Dany verified the RLMIS cadastral deed for Bugesera Industrial Plot.',
          time: '3h ago',
          read: true,
          type: 'message',
        },
      ]);
    };

    fetchNotifications();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/notifications/stream');
      eventSource.onmessage = (event) => {
        try {
          const item = JSON.parse(event.data);
          if (item && item.id) {
            setNotifications((prev) => [item, ...(Array.isArray(prev) ? prev : [])]);
            showToast(`🔔 ${item.title}: ${item.message}`);
          }
        } catch {
          // ignore
        }
      };
      eventSource.onerror = () => {
        eventSource?.close();
      };
    } catch {
      // ignore
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const handleTriggerTestNotification = async () => {
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const item = data?.notification || data;
        if (item && item.id) {
          setNotifications((prev) => [item, ...(Array.isArray(prev) ? prev : [])]);
          showToast(`🔔 Test Notification: ${item.message}`);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const mockNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Instant Concierge Ping',
      message: 'A prospective diaspora buyer from Brussels inquired about Rebero listings.',
      time: 'Just now',
      read: false,
      type: 'alert',
    };
    setNotifications((prev) => [mockNotif, ...(Array.isArray(prev) ? prev : [])]);
    showToast('🔔 Instant Concierge Ping: Diaspora buyer inquiry received!');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      (Array.isArray(prev) ? prev : []).map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleAddProperty = async (newProp: Partial<Property>) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data?.property || data;
        setProperties((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
        showToast(`✨ Property "${created.title || 'Listing'}" successfully published!`);
        return;
      }
    } catch {
      // Local fallback
    }

    const fallback: Property = {
      id: `prop-${Date.now()}`,
      title: newProp.title || 'Untitled Villa',
      price: newProp.price || 500000,
      formattedPrice: `$${(newProp.price || 500000).toLocaleString()}`,
      location: newProp.location || 'Kigali, Rwanda',
      district: newProp.district || 'Rebero',
      propertyType: newProp.propertyType || 'Residential',
      beds: newProp.beds || 4,
      baths: newProp.baths || 3,
      areaSqMeters: newProp.areaSqMeters || 350,
      status: 'Active',
      views: 1,
      leads: 0,
      imageUrl:
        newProp.imageUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
      aiScore: 92,
      growthPotential: '+11.8% /yr',
      riskLevel: 'Very Low',
      description: newProp.description || 'Exclusive luxury architectural residence.',
    };

    setProperties((prev) => [fallback, ...prev]);
    showToast(`✨ Property "${fallback.title}" added to portfolio!`);
  };

  const handleRequestValuation = async (data: { propertyName: string; district: string; sizeSqM: number }) => {
    try {
      const res = await fetch('/api/valuations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const basePerSqM = data.district === 'Nyarugenge' ? 2400 : data.district === 'Rebero' ? 1100 : 700;
    const estimatedValue = Math.round(data.sizeSqM * basePerSqM);
    return {
      estimatedValue,
      confidenceScore: 95,
      comparablesCount: 18,
      appreciationForecast: '+13.2% CAGR',
      summary: `Automated RLMIS-aligned valuation for ${data.propertyName} in ${data.district}.`,
    };
  };

  const handleConfirmViewing = (booking: { date: string; time: string; chauffeur: boolean; notes: string }) => {
    setIsBookViewingOpen(false);
    showToast(
      `📅 Viewing confirmed for ${viewingTargetProperty?.title || 'Estate'} on ${booking.date} at ${booking.time}! ${
        booking.chauffeur ? 'Chauffeur pickup requested.' : ''
      }`
    );
  };

  // Robust screen switcher
  const handleNavigate = (screen: string) => {
    if (screen === 'signin' || screen === 'signup' || screen === 'auth') {
      setCurrentScreen('auth');
      return;
    }
    if (screen === 'portal') {
      setCurrentScreen('portal');
      setSidebarTab('portal');
      return;
    }
    if (screen === 'chat') {
      setCurrentScreen('chat');
      setSidebarTab('messages');
      return;
    }
    if (screen === 'insights') {
      setCurrentScreen('insights');
      setSidebarTab('growth');
      return;
    }
    setCurrentScreen('dashboard');
    setSidebarTab('estates');
  };

  const handleSelectSidebarTab = (tab: string) => {
    setSidebarTab(tab);
    if (tab === 'estates') setCurrentScreen('dashboard');
    if (tab === 'portal') setCurrentScreen('portal');
    if (tab === 'messages') setCurrentScreen('chat');
    if (tab === 'growth') setCurrentScreen('insights');
  };

  const getDeviceFrameStyles = () => {
    switch (deviceMode) {
      case 'desktop':
        return 'max-w-[1440px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] mx-auto border-x-4 border-slate-400 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-4';
      case 'mobile':
        return 'max-w-[390px] mx-auto border-8 border-slate-800 dark:border-slate-700 rounded-[48px] overflow-hidden shadow-2xl my-6 bg-slate-900';
      case 'fluid':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-body flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <span className="material-symbols-outlined text-blue-400 text-xl">info</span>
          <span className="text-xs sm:text-sm font-medium leading-snug flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={() => {
          localStorage.removeItem('digital_estate_jwt');
          localStorage.removeItem('digital_estate_user');
          setCurrentUser(null);
          showToast('Signed out of session');
        }}
        deviceMode={deviceMode}
        onSetDeviceMode={setDeviceMode}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onTriggerTestNotification={handleTriggerTestNotification}
      />

      {/* Responsive Preview Outer Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${getDeviceFrameStyles()}`}>
        {/* Main Layout Body */}
        <div className="flex-1 flex w-full relative">
          {/* Desktop/Tablet Sidebar (Hidden on Mobile mode or small screens) */}
          {deviceMode !== 'mobile' && (
            <div className="hidden md:block shrink-0">
              <Sidebar
                currentTab={sidebarTab}
                onSelectTab={handleSelectSidebarTab}
                onOpenAddProperty={() => setIsAddOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                currentUser={currentUser}
                collapsed={deviceMode === 'tablet'}
              />
            </div>
          )}

          {/* Primary Main Content Area */}
          <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 pb-28 md:pb-12 overflow-x-hidden">
            {currentScreen === 'dashboard' && (
              <Dashboard
                properties={properties}
                onOpenAddProperty={() => setIsAddOpen(true)}
                onOpenValuation={() => setIsValuationOpen(true)}
                onOpenChat={() => {
                  setCurrentScreen('chat');
                  setSidebarTab('messages');
                }}
                onSelectProperty={(prop) => {
                  setSelectedProperty(prop);
                  setIsDetailOpen(true);
                }}
              />
            )}

            {currentScreen === 'portal' && (
              <PublicPortal
                properties={properties}
                onSelectProperty={(prop) => {
                  setSelectedProperty(prop);
                  setIsDetailOpen(true);
                }}
                onBookViewing={(prop) => {
                  setViewingTargetProperty(prop);
                  setIsBookViewingOpen(true);
                }}
                onOpenValuation={() => setIsValuationOpen(true)}
                onOpenChatWithProperty={(prop) => {
                  setActiveChatProperty(prop);
                  setCurrentScreen('chat');
                  setSidebarTab('messages');
                }}
                onOpenComparison={(selected) => {
                  setComparisonProperties(selected);
                  setIsComparisonOpen(true);
                }}
                currency={preferences.currency}
                onSetCurrency={(curr) => setPreferences((prev) => ({ ...prev, currency: curr }))}
              />
            )}

            {currentScreen === 'chat' && (
              <ChatScreen
                currentUser={currentUser}
                activePropertyContext={activeChatProperty}
                onBookViewing={(prop) => {
                  setViewingTargetProperty(prop);
                  setIsBookViewingOpen(true);
                }}
                onOpenValuation={() => setIsValuationOpen(true)}
              />
            )}

            {currentScreen === 'insights' && (
              <InsightsScreen
                onOpenValuation={() => setIsValuationOpen(true)}
                onNavigateToPortal={() => {
                  setCurrentScreen('portal');
                  setSidebarTab('portal');
                }}
              />
            )}

            {currentScreen === 'auth' && (
              <AuthScreen
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentScreen('dashboard');
                  setSidebarTab('estates');
                  showToast(`Welcome back, ${user.name}!`);
                }}
                onCancel={() => {
                  setCurrentScreen('dashboard');
                }}
              />
            )}

            {/* Fallback to Dashboard if any unhandled state */}
            {!['dashboard', 'portal', 'chat', 'insights', 'auth'].includes(currentScreen) && (
              <Dashboard
                properties={properties}
                onOpenAddProperty={() => setIsAddOpen(true)}
                onOpenValuation={() => setIsValuationOpen(true)}
                onOpenChat={() => {
                  setCurrentScreen('chat');
                  setSidebarTab('messages');
                }}
                onSelectProperty={(prop) => {
                  setSelectedProperty(prop);
                  setIsDetailOpen(true);
                }}
              />
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Active on Mobile view or mobile preview mode) */}
        <div className={deviceMode === 'mobile' ? 'block' : 'md:hidden'}>
          <MobileBottomNav
            currentTab={sidebarTab}
            onSelectTab={handleSelectSidebarTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAdd={() => setIsAddOpen(true)}
          />
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AddPropertyModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddProperty}
      />

      <ValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        onRequestValuation={handleRequestValuation}
      />

      <BookViewingModal
        isOpen={isBookViewingOpen}
        propertyTitle={viewingTargetProperty?.title || 'Kigali View Heights'}
        onClose={() => setIsBookViewingOpen(false)}
        onConfirm={handleConfirmViewing}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        preferences={preferences}
        onClose={() => setIsSettingsOpen(false)}
        onUpdatePreferences={(updated) => {
          setPreferences((prev) => {
            const next = { ...prev, ...updated };
            if (updated.theme) {
              setIsDark(updated.theme === 'dark');
            }
            return next;
          });
        }}
        onResetPreferences={() => {
          setPreferences({
            theme: 'light',
            highContrast: false,
            reducedMotion: false,
            notificationsEnabled: true,
            aiRecommendationsEnabled: true,
            currency: 'USD',
            priceRangeMax: 2000000,
            minRoiPercent: 8,
            maxDistanceKm: 25,
            fontSizeMultiplier: 100,
          });
          setIsDark(false);
          showToast('Preferences restored to default settings');
        }}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookViewing={(prop) => {
          setViewingTargetProperty(prop);
          setIsBookViewingOpen(true);
        }}
        onOpenChat={(prop) => {
          setActiveChatProperty(prop);
          setCurrentScreen('chat');
          setSidebarTab('messages');
        }}
      />

      <PropertyComparisonModal
        isOpen={isComparisonOpen}
        properties={comparisonProperties}
        onClose={() => setIsComparisonOpen(false)}
        onRemoveProperty={(id) => {
          setComparisonProperties((prev) => {
            const next = prev.filter((p) => p.id !== id);
            if (next.length === 0) setIsComparisonOpen(false);
            return next;
          });
        }}
        onBookViewing={(prop) => {
          setViewingTargetProperty(prop);
          setIsBookViewingOpen(true);
        }}
        onOpenChat={(prop) => {
          setActiveChatProperty(prop);
          setCurrentScreen('chat');
          setSidebarTab('messages');
        }}
        currency={preferences.currency}
      />
    </div>
  );
}
