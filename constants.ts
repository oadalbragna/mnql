
import { Category, CategoryId, Product, MarketStory } from './types';

export const CATEGORIES: Category[] = [
    { id: CategoryId.ALL, name: 'الكل', icon: 'LayoutGrid' },
    { id: CategoryId.CARS, name: 'مركبات ومحركات', icon: 'Car' },
    { id: CategoryId.REAL_ESTATE, name: 'عقارات سكنية', icon: 'Home' },
    { id: CategoryId.ELECTRONICS, name: 'إلكترونيات وأجهزة', icon: 'Smartphone' },
    { id: CategoryId.CARPETS, name: 'سجاد ومفروشات', icon: 'Layers' },
    { id: CategoryId.HOME_MADE, name: 'الأسر المنتجة', icon: 'ChefHat' },
    { id: CategoryId.SERVICES, name: 'خدمات', icon: 'Wrench' },
];

export const MANAQIL_LOCATIONS = [
    'السوق الكبير', 
    'السوق الشعبي', 
    'سوق المواسير', 
    'حي السينما', 
    'حي الموظفين', 
    'حي الثورة', 
    'حي النصر', 
    'حي بانت',
    'قرية شكابة', 
    'قرية الكريدة', 
    'عبود', 
    'كريمة',
    'أخرى (إدخال يدوي)'
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'car-1',
        title: 'تويوتا لاندكروزر V8 - موديل 2022',
        description: 'سيارة لاندكروزر GXR بحالة الوكالة، صيانة منتظمة، خالية من الحوادث. استخدام نظيف جداً في المناقل.',
        price: 45000000,
        currency: 'ج.س',
        categoryId: CategoryId.CARS,
        imageUrl: 'https://images.unsplash.com/photo-1594568284297-7c64464062b1?q=80&w=800',
        location: 'المناقل - حي الموظفين',
        lat: 14.235,
        lng: 32.978,
        sellerName: 'معرض الأمانة',
        sellerPhone: '249912345678',
        sellerId: 'trader-1',
        createdAt: new Date().toISOString(),
        likes: 240,
        views: 5600,
        availableQuantity: 1,
        vehicleType: 'car',
        brand: 'toyota',
        year: '2022',
        attributes: {
            'النوع': 'سيارة صالون',
            'الماركة': 'تويوتا',
            'الموديل': 'لاندكروزر',
            'السنة': '2022',
            'الحالة': 'ممتازة - كرت'
        }
    },
    {
        id: 'house-1',
        title: 'منزل ناصية - مربع 15 المناقل',
        description: 'منزل بموقع استراتيجي في حي الثورة مربع 15، مساحة كبيرة، جاهز للسكن، تتوفر به كافة الخدمات (كهرباء، مياه).',
        price: 120000000,
        currency: 'ج.س',
        categoryId: CategoryId.REAL_ESTATE,
        imageUrl: 'https://images.unsplash.com/photo-1580587767503-3997489ccd50?q=80&w=800',
        location: 'المناقل - حي الثورة',
        lat: 14.240,
        lng: 32.985,
        sellerName: 'عقارات النيل',
        sellerPhone: '249123456789',
        sellerId: 'trader-2',
        createdAt: new Date().toISOString(),
        likes: 85,
        views: 1200,
        availableQuantity: 1,
        squareNumber: '15',
        areaSize: '400',
        housingType: 'house',
        attributes: {
            'المربع': '15',
            'المساحة': '400 متر مربع',
            'نوع العقار': 'منزل سكني',
            'الحالة': 'ناصية - مسور بالكامل'
        }
    },
    {
        id: 'laptop-1',
        title: 'لابتوب HP Victus 15 - قيمنق',
        description: 'جهاز لابتوب قوي للألعاب والمونتاج، معالج i7، كرت شاشة RTX 3050، حالة ممتازة مع الكرتونة.',
        price: 850000,
        currency: 'ج.س',
        categoryId: CategoryId.ELECTRONICS,
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800',
        location: 'السوق الكبير',
        lat: 14.232,
        lng: 32.982,
        sellerName: 'تكنولوجيا المناقل',
        sellerPhone: '249911122233',
        sellerId: 'trader-3',
        createdAt: new Date().toISOString(),
        likes: 120,
        views: 2500,
        availableQuantity: 1,
        electronicsType: 'laptop',
        brand: 'HP',
        ram: '16GB',
        storage: '512GB SSD',
        attributes: {
            'النوع': 'لابتوب جيمنج',
            'المعالج': 'Core i7',
            'الرام': '16GB',
            'التخزين': '512GB SSD'
        }
    }
];

export const MOCK_STORIES: MarketStory[] = [
    { id: 's1', sellerName: 'مخبز الأمانة', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800', hasOffer: true, category: 'مخبوزات' },
    { id: 's2', sellerName: 'عطور مكة', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800', hasOffer: false, category: 'تجميل' },
    { id: 's3', sellerName: 'أحذية النيل', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', hasOffer: true, category: 'أحذية' },
    { id: 's4', sellerName: 'مطبخ أم سلمة', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', hasOffer: true, category: 'أسر منتجة' },
];
