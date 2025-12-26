import {
  BarChart3,
  Users,
  Building2,
  Shield,
  Wallet,
  FileText,
  TrendingUp,
  Settings,
  Layers,
  ArrowDownRight
} from 'lucide-react';

export const navigation = [
  { name: 'Overview', icon: BarChart3, path: '/', badge: 'Live' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Properties', icon: Building2, path: '/properties' },
  { name: 'Moderation', icon: Shield, path: '/moderation' },
  { name: 'Transactions', icon: Wallet, path: '/transactions' },
  { name: 'Withdrawals', icon: ArrowDownRight, path: '/withdrawals' },
  { name: 'Subscriptions', icon: FileText, path: '/subscriptions' },
  { name: 'Plans', icon: Layers, path: '/subscription-plans' },
  { name: 'Reports', icon: TrendingUp, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export const quickActions = [
  {
    title: 'Review Pending Properties',
    description: '12 listings require your decision',
    cta: 'Review queue',
    fallbackValue: 12
  },
  {
    title: 'Check New Reports',
    description: '5 new issues raised by users today',
    cta: 'Open reports',
    fallbackValue: 5
  }
];

export const systemHealth = [
  { name: 'Email service', status: 'Operational' },
  { name: 'Realtime messaging', status: 'Operational' },
  { name: 'Payments gateway', status: 'Degraded' },
  { name: 'Notification queue', status: 'Operational' }
];

export const activityFeed = [
  {
    id: 1,
    title: 'Property approved',
    description: '“Luxury Duplex, Lekki Phase 1” was approved by Admin Jane',
    timestamp: '8 minutes ago'
  },
  {
    id: 2,
    title: 'Host suspended',
    description: 'Landlord Michael Johnson was suspended for repeated policy violations',
    timestamp: '23 minutes ago'
  },
  {
    id: 3,
    title: 'Dispute resolved',
    description: 'Booking dispute #SH2043 was resolved in favour of the guest',
    timestamp: '1 hour ago'
  }
];

export const statCards = [
  {
    name: 'Total users',
    value: '24,532',
    change: '+4.6%',
    changeType: 'positive',
    icon: Users,
    key: 'totalUsers',
    formatter: (value: number) => value.toLocaleString()
  },
  {
    name: 'Active listings',
    value: '3,219',
    change: '+2.1%',
    changeType: 'positive',
    icon: Building2,
    key: 'totalProperties',
    formatter: (value: number) => value.toLocaleString()
  },
  {
    name: 'Today’s revenue',
    value: '₦2.3M',
    change: '+9.0%',
    changeType: 'positive',
    icon: Wallet,
    key: 'totalRevenue',
    formatter: (value: number) =>
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value)
  },
  {
    name: 'Open disputes',
    value: '14',
    change: '+1.8%',
    changeType: 'negative',
    icon: Shield,
    key: 'openDisputes',
    formatter: (value: number) => value.toLocaleString()
  }
];

export const moderationQueue = [
  {
    name: 'Luxury Duplex • Lekki Phase 1',
    host: 'Amina Yusuf',
    type: 'Shortlet',
    date: 'Today • 08:14',
    status: 'urgent'
  },
  {
    name: 'Cozy Studio • Victoria Island',
    host: 'Michael Johnson',
    type: 'Rental',
    date: 'Yesterday • 20:42',
    status: 'new'
  },
  {
    name: 'Seaside Apartment • Eko Atlantic',
    host: 'Fatima Bello',
    type: 'Shortlet',
    date: 'Yesterday • 17:21',
    status: 'review'
  }
];


