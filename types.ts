
export enum CategoryId {
    ALL = 'all',
    CARS = 'cars',
    REAL_ESTATE = 'real_estate',
    ELECTRONICS = 'electronics',
    CLOTHES = 'clothes',
    FURNITURE = 'furniture',
    HOME_MADE = 'home_made',
    SERVICES = 'services',
    CARPETS = 'carpets',
}

export interface Category {
    id: CategoryId;
    name: string;
    icon: string;
}

export type UserRole = 'trader' | 'user' | 'admin' | 'guest' | 'worker';
export type FamilyStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type ActivityType = 'sales' | 'purchases' | 'services' | 'logistics' | 'general';

export interface UserProfile {
    id: string;
    fullName: string;
    emailOrPhone: string;
    password?: string;
    role: UserRole;
    familyStatus?: FamilyStatus; // حالة الأسرة المنتجة
    bio?: string;
    location: string;
    createdAt: string;
    balance: number;
    isVerified: boolean;
    avatar?: string;
    staff?: Worker[];
    activityType?: ActivityType;
    // New fields for Dashboard
    storeConfig?: {
        workingHours?: string;
        deliveryAreas?: string;
        socialLinks?: {
            whatsapp?: string;
            facebook?: string;
        };
    };
    settings?: {
        notifications?: boolean;
        publicProfile?: boolean;
    };
}

export interface Worker {
    id: string;
    name: string;
    phone: string;
    email?: string;
    permissions: string[];
    joinedAt: number;
    salesCount: number;
    totalRevenue: number;
    status: 'active' | 'inactive';
    traderId: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    timestamp: string;
    reply?: {
        text: string;
        timestamp: string;
    };
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    categoryId: CategoryId;
    imageUrl: string;
    images?: string[];
    location: string;
    lat?: number;
    lng?: number;
    sellerName: string;
    sellerPhone: string;
    sellerId: string;
    createdAt: string;
    likes: number;
    views: number;
    availableQuantity: number;
    attributes: Record<string, string>;
    
    isPromoted?: boolean;
    isAuction?: boolean;
    currentBid?: number;
    videoUrl?: string;
    uploadedBy?: string;
    uploadedByName?: string;
    isActive?: boolean; // New: To toggle product visibility
    carpetMetadata?: {
        origin: string;
        material: string;
        density: string;
    };
    reviews?: Review[];

    // بيانات العقارات السكنية
    squareNumber?: string;
    blockNumber?: string;
    areaSize?: string;
    housingType?: 'villa' | 'house' | 'apartment' | 'land';
    
    // بيانات المركبات
    vehicleType?: 'car' | 'bike' | 'engine' | 'cycle' | 'truck';
    brand?: string;
    model?: string;
    year?: string;
    mileage?: string;
    fuelType?: string;
    condition?: 'new' | 'used';
    
    // بيانات الإلكترونيات
    electronicsType?: 'laptop' | 'mobile' | 'screen' | 'appliance' | 'tool';
    storage?: string;
    ram?: string;
    
    // بيانات الأسر المنتجة
    familyBrand?: string;
    prepTime?: string;
    ingredients?: string;
}

export interface FamilyRequest {
    id: string;
    userId: string;
    familyName: string;
    specialty: string;
    phone: string;
    status: FamilyStatus;
    timestamp: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    timestamp: number;
    deliveryLocation: string;
    sellerIds: string[];
    shippingMethod?: string;
}

export interface Post {
    id: string;
    author: string;
    authorId: string;
    content: string;
    likes: number;
    comments: number;
    tag: 'news' | 'help' | 'event' | 'obituary' | 'congrats';
    time: string;
    timestamp?: number;
    metadata?: any;
    commentsList?: Record<string, PostComment>;
}

export interface PostComment {
    id: string;
    author: string;
    authorId: string;
    text: string;
    timestamp: number;
}

export interface Bid {
    id: string;
    user: string;
    userId: string;
    amount: number;
    time: string;
}

export interface MarketStory {
    id: string;
    sellerName: string;
    imageUrl: string;
    hasOffer: boolean;
    category: string;
}

export interface DynamicService {
    id: string;
    name: string;
    description: string;
    icon: string;
    route: string;
    color: string;
    type: 'featured' | 'standard' | 'small';
    isActive: boolean;
}

export interface AgriDiagnosis {
    issue: string;
    remedy: string;
    urgency: 'low' | 'medium' | 'high';
    sources: { title: string; uri: string }[];
    imageUrl: string;
    timestamp: string;
    userId: string;
}

export interface Auction {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    currentBid: number;
    bidsCount: number;
    type: 'crop' | 'livestock';
    minIncrement?: number;
}

export interface CropPrice {
    id: string;
    name: string;
    price: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    location: string;
    lastUpdate: string;
}

export interface LocalPlace {
    id: string;
    name: string;
    category: 'medical' | 'banking' | 'food' | 'shops';
    location: string;
    phone: string;
    isFeatured?: boolean;
}

export interface MarketDay {
    day: string;
    location: string;
    specialty: string;
}

export interface WalletTransaction {
    id: string;
    title: string;
    amount: number;
    type: 'credit' | 'debit';
    senderId?: string;
    receiverId?: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: number;
}

export interface TransportOption {
    id: string;
    from: string;
    to: string;
    type: 'bus' | 'hiace' | 'private';
    time: string;
    price: number;
    seatsLeft: number;
    driverName: string;
    driverPhone: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

export interface ChatThread {
    id: string;
    participants: string[];
    participantNames: Record<string, string>;
    lastMessage: string;
    lastTimestamp: number;
    productId?: string;
    productTitle?: string;
}

export interface AppNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'order' | 'review' | 'payment' | 'system';
    isRead: boolean;
    timestamp: number;
    link?: string;
}

export interface UserActivity {
    id: string;
    type: 'upload' | 'sale' | 'update';
    detail: string;
    timestamp: number;
}

export type ViewType = 'home' | 'hub' | 'notifications' | 'cart' | 'wallet' | 'favorites' | 'profile' | 'community' | 'logistics' | 'auction' | 'auction-details' | 'agri-ai' | 'places' | 'agri-market' | 'home-produce' | 'transport' | 'track-delivery' | 'marketing-studio' | 'telegram-bridge' | 'safety' | 'payment-gateway' | 'admin';
