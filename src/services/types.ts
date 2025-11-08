import type { AdminUser } from './auth';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: PaginationMeta;
}

export interface CreateAdminUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateAdminUserResponse {
  user: AdminUser;
  temporaryPassword: string;
  emailSent: boolean;
}

export interface AdminPropertyMedia {
  id: string;
  url?: string;
  secureUrl?: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  order?: number | null;
  isActive?: boolean;
}

export interface AdminPropertyOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface AdminPropertyAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminPropertyBookingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface AdminPropertyBooking {
  id: string;
  bookingType: string;
  status: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  inspectionDate?: string | null;
  numberOfNights?: number | null;
  numberOfGuests?: number | null;
  totalPrice: number;
  currency: string;
  paymentStatus?: string;
  createdAt: string;
  user?: AdminPropertyBookingUser | null;
}

export interface AdminPropertyReview {
  id: string;
  reviewType: string;
  rating: number;
  title?: string | null;
  content: string;
  status: string;
  isVerified?: boolean;
  helpfulCount?: number;
  reportCount?: number;
  createdAt: string;
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
    role?: string | null;
  } | null;
  booking?: {
    id: string;
    bookingType: string;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    numberOfNights?: number | null;
    numberOfGuests?: number | null;
  } | null;
}

export interface AdminProperty {
  id: string;
  title: string;
  slug?: string;
  status: string;
  listingType: string;
  propertyType: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  pricePeriod?: string | null;
  city: string;
  state: string;
  country?: string;
  featured: boolean;
  featuredUntil?: string | null;
  viewCount?: number;
  favoriteCount?: number;
  contactCount?: number;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  moderationNotes?: string | null;
  instantBooking?: boolean;
  negotiable?: boolean;
  furnished?: boolean;
  petFriendly?: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: AdminPropertyOwner;
  agent?: AdminPropertyAgent | null;
  address?: string | null;
  neighborhood?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  amenities?: unknown;
  features?: unknown;
  media?: AdminPropertyMedia[];
  bookings?: AdminPropertyBooking[];
  reviews?: AdminPropertyReview[];
}

export interface AdminPropertySummary {
  totals: {
    totalProperties: number;
    pendingApproval: number;
    featuredProperties: number;
  };
  byStatus: Record<string, number>;
  byListingType: Record<string, number>;
  byPropertyType: Record<string, number>;
}

export interface AdminPropertiesResponse {
  properties: AdminProperty[];
  pagination: PaginationMeta;
  summary: AdminPropertySummary;
}

export type AdminPropertyDetail = AdminProperty;

export interface AdminPropertyStatusPayload {
  status: 'pending' | 'active' | 'inactive' | 'rejected' | 'archived' | 'sold' | 'rented';
  rejectionReason?: string;
  moderationNotes?: string;
}

export interface AdminPropertyFeaturePayload {
  featured: boolean;
  featuredUntil?: string | null;
}

export interface AdminUserListItem extends AdminUser {
  createdAt: string;
  lastLogin?: string;
}

export interface AdminUserOwnedProperty {
  id: string;
  title: string;
  listingType: string;
  status: string;
  city?: string | null;
  state?: string | null;
  createdAt: string;
}

export interface AdminUserBookingProperty {
  id: string;
  title: string;
  listingType: string;
  city?: string | null;
  state?: string | null;
}

export interface AdminUserBooking {
  id: string;
  bookingType: string;
  status: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  numberOfNights?: number | null;
  numberOfGuests?: number | null;
  totalPrice: number;
  currency: string;
  paymentStatus?: string | null;
  createdAt: string;
  property?: AdminUserBookingProperty | null;
}

export interface AdminUserSubscription {
  id: string;
  planType: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

export interface AdminUserKycDocument {
  id: string;
  documentType: string;
  status: string;
  verifiedAt?: string | null;
  createdAt: string;
}

export interface AdminUserReview {
  id: string;
  reviewType: string;
  rating: number;
  status: string;
  createdAt: string;
  property?: AdminUserBookingProperty | null;
}

export interface AdminUserProfile extends AdminUserListItem {
  phone?: string | null;
  avatarUrl?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycVerified: boolean;
  profileCompleted: boolean;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  language?: string | null;
  bio?: string | null;
  socialLinks?: Record<string, unknown> | null;
  preferences?: Record<string, unknown> | null;
  googleId?: string | null;
  loginCount?: number;
  ownedProperties?: AdminUserOwnedProperty[];
  userBookings?: AdminUserBooking[];
  subscriptions?: AdminUserSubscription[];
  kycDocuments?: AdminUserKycDocument[];
  reviews?: AdminUserReview[];
}

export interface AdminUserSummary {
  totalOwnedProperties: number;
  totalBookings: number;
  activeBookings: number;
  totalReviews: number;
  activeSubscriptions: number;
}

export interface AdminUserDetailResponse {
  user: AdminUserProfile;
  summary: AdminUserSummary;
}

export interface AdminUserProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  language?: string | null;
  bio?: string | null;
  socialLinks?: Record<string, unknown> | string | null;
  preferences?: Record<string, unknown> | string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycVerified?: boolean;
  profileCompleted?: boolean;
}

export interface ModerationOverview {
  pendingProperties: number;
  pendingReviews: number;
  flaggedReviews: number;
  pendingKyc: number;
  reportedListings: number;
  paymentDisputes: number;
}

export interface ModerationOverviewResponse extends ModerationOverview {}

export interface ModerationReviewItem {
  id: string;
  reviewType: string;
  rating: number;
  status: string;
  title?: string | null;
  content?: string | null;
  reportCount?: number;
  helpfulCount?: number;
  createdAt: string;
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
    role?: string | null;
  } | null;
  property?: {
    id: string;
    title: string;
    listingType: string;
    city?: string | null;
    state?: string | null;
  } | null;
  booking?: {
    id: string;
    bookingType: string;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    numberOfNights?: number | null;
    numberOfGuests?: number | null;
  } | null;
}

export interface ModerationReviewsResponse {
  reviews: ModerationReviewItem[];
  pagination: PaginationMeta;
}

export interface ModerationListingItem {
  id: string;
  title: string;
  listingType: string;
  status: string;
  city?: string | null;
  state?: string | null;
  rejectionReason?: string | null;
  moderationNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string | null;
  } | null;
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ModerationListingsResponse {
  listings: ModerationListingItem[];
  pagination: PaginationMeta;
}

export interface ModerationKycItem {
  id: string;
  documentType: string;
  status: string;
  documentUrl: string;
  documentNumber?: string | null;
  documentThumbnail?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
  verificationNotes?: string | null;
  rejectionReason?: string | null;
  expiresAt?: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string | null;
  } | null;
  verifier?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ModerationKycResponse {
  documents: ModerationKycItem[];
  pagination: PaginationMeta;
}

export interface ModerationKycUpdatePayload {
  status?: 'pending' | 'approved' | 'rejected' | 'expired';
  verificationNotes?: string | null;
  rejectionReason?: string | null;
}

export interface ModerationKycUpdateResponse {
  document: ModerationKycItem;
}

export interface ModerationPaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentType: string;
  paymentMethod: string;
  transactionId?: string | null;
  reference?: string | null;
  description?: string | null;
  failureReason?: string | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  property?: {
    id: string;
    title: string;
    listingType: string;
  } | null;
  booking?: {
    id: string;
    bookingType: string;
    status: string;
  } | null;
}

export interface ModerationPaymentsResponse {
  payments: ModerationPaymentItem[];
  pagination: PaginationMeta;
}

export interface AdminTransaction {
  id: string;
  userId: string;
  bookingId?: string | null;
  propertyId?: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentType: string;
  paymentMethod: string;
  gateway?: string | null;
  transactionId?: string | null;
  reference?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  processingFee?: number | null;
  taxAmount?: number | null;
  discountAmount?: number | null;
  failureReason?: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  property?: {
    id: string;
    title: string;
    listingType: string;
  } | null;
  booking?: {
    id: string;
    bookingType: string;
    status: string;
  } | null;
}

export interface AdminTransactionSummary {
  totalAmount: number;
  completedAmount: number;
  totalCount: number;
  statusBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  filters: {
    status: string | null;
    paymentType: string | null;
    paymentMethod: string | null;
    gateway: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}

export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  pagination: PaginationMeta;
  summary: AdminTransactionSummary;
}

export interface AdminSubscription {
  id: string;
  userId: string;
  planName: string;
  planType: 'basic' | 'premium' | 'enterprise' | 'custom';
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate?: string | null;
  trialEndDate?: string | null;
  maxProperties: number;
  maxPhotosPerProperty: number;
  featuredProperties: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  monthlyPrice: number;
  yearlyPrice?: number | null;
  currency: string;
  discountPercentage?: number | null;
  billingCycle: 'monthly' | 'yearly' | 'custom';
  nextBillingDate?: string | null;
  autoRenew: boolean;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  features?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
}

export interface AdminSubscriptionSummary {
  totals: {
    totalSubscriptions: number;
    active: number;
    pending: number;
    cancelled: number;
    expired: number;
    inactive: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
  };
  breakdown: {
    byPlanType: Record<string, number>;
    byStatus: Record<string, number>;
    byBillingCycle: Record<string, number>;
    autoRenew: {
      enabled: number;
      disabled: number;
    };
  };
  filters: {
    status: string | null;
    planType: string | null;
    billingCycle: string | null;
    autoRenew: boolean | null;
  };
}

export interface AdminSubscriptionsResponse {
  subscriptions: AdminSubscription[];
  pagination: PaginationMeta;
  summary: AdminSubscriptionSummary;
}

export interface AdminSubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  planType: 'basic' | 'premium' | 'enterprise' | 'custom' | 'other';
  description?: string | null;
  monthlyPrice: number;
  yearlyPrice?: number | null;
  currency: string;
  maxProperties?: number | null;
  maxPhotosPerProperty?: number | null;
  featuredProperties?: number | null;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  supportLevel?: string | null;
  trialPeriodDays: number;
  isRecommended: boolean;
  isActive: boolean;
  features?: string[] | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubscriptionPlanListResponse {
  plans: AdminSubscriptionPlan[];
  pagination: PaginationMeta;
  stats?: {
    totalPlans: number;
    totalActiveSubscriptions: number;
  } | null;
}

export interface AdminSubscriptionPlanPayload {
  name: string;
  slug?: string;
  planType?: 'basic' | 'premium' | 'enterprise' | 'custom' | 'other';
  description?: string;
  monthlyPrice: number;
  yearlyPrice?: number | null;
  currency?: string;
  maxProperties?: number | null;
  maxPhotosPerProperty?: number | null;
  featuredProperties?: number | null;
  prioritySupport?: boolean;
  analyticsAccess?: boolean;
  supportLevel?: string | null;
  trialPeriodDays?: number;
  isRecommended?: boolean;
  isActive?: boolean;
  features?: string[] | string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AdminSubscriptionPlanStatusPayload {
  isActive: boolean;
}

export interface ReportsMetricsParams {
  months?: number;
  endDate?: string;
}

export interface ReportsMetricPoint {
  month: string;
  label: string;
}

export interface ReportsUserGrowthPoint extends ReportsMetricPoint {
  count: number;
}

export interface ReportsRevenuePoint extends ReportsMetricPoint {
  amount: number;
}

export interface ReportsBookingPoint extends ReportsMetricPoint {
  shortlet: number;
  rental: number;
  saleInspection: number;
  total: number;
}

export interface ReportsBreakdown {
  bookingStatus: Record<string, number>;
  propertyStatus: Record<string, number>;
  propertyByListingType: Record<string, number>;
  subscriptionStatus: Record<string, number>;
  subscriptionPlans: Record<string, number>;
  revenueByType: Record<string, number>;
}

export interface ReportsInsightTotals {
  totalUsers: number;
  newUsers: number;
  totalProperties: number;
  activeProperties: number;
  totalRevenue: number;
  activePlans: number;
  totalPlans: number;
  activeSubscriptions: number;
}

export interface ReportsModerationInsight {
  flaggedReviews: number;
  pendingReviews: number;
}

export interface ReportsMetricsResponse {
  timeframe: {
    months: number;
    startDate: string;
    endDate: string;
  };
  charts: {
    userGrowth: ReportsUserGrowthPoint[];
    revenueTrend: ReportsRevenuePoint[];
    bookingTrend: ReportsBookingPoint[];
  };
  breakdowns: ReportsBreakdown;
  insights: {
    totals: ReportsInsightTotals;
    reviewModeration: ReportsModerationInsight;
  };
}

export interface AdminSubscriptionDetail extends AdminSubscription {
  payments?: AdminTransaction[];
}

export interface AdminSubscriptionCreatePayload {
  userId: string;
  planId?: string;
  planSlug?: string;
  planType?: 'basic' | 'premium' | 'enterprise' | 'custom' | 'other';
  billingCycle?: 'monthly' | 'yearly' | 'custom';
  autoRenew?: boolean;
  customPlan?: Record<string, unknown> | null;
}

export interface AdminSubscriptionUpdatePayload {
  status?: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  autoRenew?: boolean;
  billingCycle?: 'monthly' | 'yearly' | 'custom';
  nextBillingDate?: string | null;
}

export interface AdminSubscriptionCancelPayload {
  cancellationReason?: string | null;
}

export interface AdminSubscriptionRenewPayload {
  billingCycle?: 'monthly' | 'yearly' | 'custom';
}



