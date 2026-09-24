import type { Conversation, DayStat, Plan } from '@/types'

export const AVAILABLE_SKILLS = [
  'الرد على الاستفسارات',
  'عرض الأسعار والعروض',
  'حجز المواعيد',
  'تتبع الطلبات',
  'تحويل لموظف بشري',
  'جمع بيانات العملاء',
]

export const TONES = ['ودودة', 'رسمية', 'تسويقية', 'مختصرة ومباشرة']

export const VOICES = ['رفيقة — صوت هادئ', 'رفيقة — صوت حيوي', 'رفيق — صوت رسمي']

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'أساسية',
    price: 29,
    messages: 2000,
    features: ['مساعد واحد (رفيق)', 'ربط رقم واتساب واحد', 'تصنيف العملاء تلقائياً', 'دعم عبر البريد'],
  },
  {
    id: 'pro',
    name: 'احترافية',
    price: 79,
    messages: 10000,
    features: ['رفيق + رفيقة معاً', 'مكالمات صوتية ذكية', 'تخصيص كامل للتوجيهات', 'تقارير أسبوعية', 'دعم ذو أولوية'],
  },
  {
    id: 'business',
    name: 'أعمال',
    price: 199,
    messages: 50000,
    features: ['أرقام واتساب متعددة', 'نظام نقاط البيع (POS)', 'API مخصص', 'مدير حساب خاص', 'تكامل مع أنظمة CRM خارجية'],
  },
]

export const WEEK_STATS: DayStat[] = [
  { day: 'السبت', messages: 142, customers: 38 },
  { day: 'الأحد', messages: 168, customers: 45 },
  { day: 'الاثنين', messages: 121, customers: 31 },
  { day: 'الثلاثاء', messages: 195, customers: 52 },
  { day: 'الأربعاء', messages: 233, customers: 61 },
  { day: 'الخميس', messages: 187, customers: 49 },
  { day: 'الجمعة', messages: 96, customers: 24 },
]

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    customerName: 'أحمد الخطيب',
    phone: '+963 944 123 456',
    category: 'مهتم للشراء',
    lastMessage: 'تمام، بدي اطلب قطعتين. كيف بيصير الدفع؟',
    lastTime: '10:42',
    unread: true,
    messages: [
      { id: 'm1', from: 'customer', text: 'مرحبا، شفت عرضكن عالإنستا. في خصم على الجاكيتات؟', time: '10:38', via: 'rafiq' },
      { id: 'm2', from: 'bot', text: 'أهلاً أحمد! نعم، عندنا خصم ٢٥٪ على كل الجاكيتات الشتوية حتى نهاية الأسبوع. حابب تشوف الموديلات المتوفرة؟', time: '10:38', via: 'rafiq' },
      { id: 'm3', from: 'customer', text: 'إي أكيد، وإذا في توصيل لدمشق؟', time: '10:40', via: 'rafiq' },
      { id: 'm4', from: 'bot', text: 'التوصيل متوفر لكل المحافظات خلال ٢٤-٤٨ ساعة، والدفع عند الاستلام. أي موديل عجبك؟', time: '10:40', via: 'rafiq' },
      { id: 'm5', from: 'customer', text: 'تمام، بدي اطلب قطعتين. كيف بيصير الدفع؟', time: '10:42', via: 'rafiq' },
    ],
  },
  {
    id: 'c2',
    customerName: 'سارة العبدالله',
    phone: '+963 955 234 567',
    category: 'اعتراض على السعر',
    lastMessage: 'بصراحة غالي كتير مقارنة بالسوق',
    lastTime: '09:15',
    unread: true,
    messages: [
      { id: 'm1', from: 'customer', text: 'شو سعر الباقة الشهرية؟', time: '09:10', via: 'rafiq' },
      { id: 'm2', from: 'bot', text: 'الباقة الشهرية بـ ٤٥ ألف ليرة وبتشمل كل الجلسات + خطة تغذية مجانية.', time: '09:11', via: 'rafiq' },
      { id: 'm3', from: 'customer', text: 'بصراحة غالي كتير مقارنة بالسوق', time: '09:15', via: 'rafiq' },
    ],
  },
  {
    id: 'c3',
    customerName: 'محمد نجار',
    phone: '+963 933 345 678',
    category: 'شكوى',
    lastMessage: 'الطلب وصل ناقص وللأسف هيك صار مرتين',
    lastTime: 'أمس',
    unread: false,
    messages: [
      { id: 'm1', from: 'customer', text: 'السلام عليكم، طلبي رقم 1042 وصل اليوم', time: 'أمس 18:02', via: 'rafiq' },
      { id: 'm2', from: 'bot', text: 'أهلاً محمد، هل كل شيء تمام مع الطلب؟', time: 'أمس 18:02', via: 'rafiq' },
      { id: 'm3', from: 'customer', text: 'الطلب وصل ناقص وللأسف هيك صار مرتين', time: 'أمس 18:05', via: 'rafiq' },
      { id: 'm4', from: 'bot', text: 'نعتذر منك كثيراً على هالتجربة. حوّلت ملاحظتك فوراً للقسم المختص ورح يتواصلوا معك اليوم لتعويضك.', time: 'أمس 18:05', via: 'rafiq' },
    ],
  },
  {
    id: 'c4',
    customerName: 'ليان حسن',
    phone: '+963 988 456 789',
    category: 'استفسار عام',
    lastMessage: 'شكراً كتير، هيك واضح كلشي',
    lastTime: 'أمس',
    unread: false,
    messages: [
      { id: 'm1', from: 'customer', text: 'شو أوقات دوامكن؟', time: 'أمس 14:20', via: 'rafiq' },
      { id: 'm2', from: 'bot', text: 'من السبت للخميس، ٩ صباحاً لـ ٩ مساءً. ويوم الجمعة من ٢ الضهر لـ ٩ المسا.', time: 'أمس 14:20', via: 'rafiq' },
      { id: 'm3', from: 'customer', text: 'شكراً كتير، هيك واضح كلشي', time: 'أمس 14:22', via: 'rafiq' },
    ],
  },
  {
    id: 'c5',
    customerName: 'خالد منصور',
    phone: '+963 991 567 890',
    category: 'مهتم للشراء',
    lastMessage: 'حجزت موعد المعاينة لبكرا، شكراً',
    lastTime: 'أمس',
    unread: false,
    messages: [
      { id: 'm1', from: 'customer', text: 'بدي استفسر عن الشقق المعروضة بالمزة', time: 'أمس 12:01', via: 'rafiqa' },
      { id: 'm2', from: 'bot', text: 'أهلاً خالد! عندنا ٣ شقق متاحة حالياً بالمزة، مساحات بين ١٢٠ و١٨٠ متر. حابب تحجز موعد معاينة؟', time: 'أمس 12:02', via: 'rafiqa' },
      { id: 'm3', from: 'customer', text: 'حجزت موعد المعاينة لبكرا، شكراً', time: 'أمس 12:08', via: 'rafiqa' },
    ],
  },
  {
    id: 'c6',
    customerName: 'نور عثمان',
    phone: '+963 955 678 901',
    category: 'اعتراض على السعر',
    lastMessage: 'طيب فكري بالموضوع ورح رد عليكم',
    lastTime: 'قبل يومين',
    unread: false,
    messages: [
      { id: 'm1', from: 'customer', text: 'وصلني عرضكن، بس السعر أعلى من ميزانيتي', time: 'قبل يومين', via: 'rafiq' },
      { id: 'm2', from: 'bot', text: 'منقدر نعرض عليكي خطة تقسيط على ٣ دفعات بدون فوائد، أو باقة مبسطة بتناسب ميزانيتك. شو رأيك؟', time: 'قبل يومين', via: 'rafiq' },
      { id: 'm3', from: 'customer', text: 'طيب فكري بالموضوع ورح رد عليكم', time: 'قبل يومين', via: 'rafiq' },
    ],
  },
]

export const DEFAULT_PROMPTS = {
  rafiq:
    'أنت "رفيق"، مساعد ذكي لمتجرنا على واتساب. جاوب بلهجة سورية بيضاء، كون مختصر وودود. ساعد الزبون بالأسعار والتوصيل وحجز الطلبات، وإذا كان الموضوع حساس حوّله لموظف بشري.',
  rafiqa:
    'أنتِ "رفيقة"، مساعدة صوتية للرد على مكالمات الزبائن. رحّبي بالمتصل، افهمي طلبه بسرعة، وجاوبي باختصار ووضوح. عند الحاجة، حوّلي المكالمة لموظف.',
}
