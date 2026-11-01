// Generated from the canvas by scripts/sync-from-canvas.js — edit the canvas, then re-run.
var MAX_ATTEMPTS = 5;
var RESEND_SECONDS = 60;
var CORRECT_CODE = '1234';
var EXPIRED_CODE = '0000';
var GRACE_SECONDS = 15 * 60;
// Assumptions until the client confirms (logged in BRD section 11):
var COMMISSION = 0.10;          // platform commission (BR-20), set by the admin
var PRICE_SPREAD = 0.25;        // route min/max price = base ±25% (BR-26)
var MIN_LEAD_HOURS = 2;         // earliest departure from now (BR-28 publishing window)
var MAX_AHEAD_DAYS = 14;        // latest departure date
var EXPIRY_WARN_DAYS = 30;      // warn before an ID or licence expires

var BRAND = { accessible: '#0062CC', original: '#007AFF' };
var C = {
  brand: '#007AFF', soft: '#EBF4FF', softBorder: '#B8D9FF', ink: '#121212', body: '#4B4B4B', secondary: '#5D5D5D',
  placeholder: '#8A8A8A', stroke: '#E6E6E6', strokeMedium: '#D0D0D0', white: '#FFFFFF', line: '#F0F0F0',
  bgSecondary: '#FAFAFA', grey100: '#F5F5F5', error: '#FF4E64', errorText: '#BF3B4B', success: '#03A853'
};
// Status colours from the designer's status components (background, text)
var TONES = {
  blue: { bg: '#E6F2FF', dot: '#007AFF' }, purple: { bg: '#EFEBFA', dot: '#5C33CF' }, orange: { bg: '#FFF1E6', dot: '#FF6B00' },
  amber: { bg: '#FEFCE8', dot: '#A16207' }, green: { bg: '#E6FBF0', dot: '#04D268' }, red: { bg: '#FFEDF0', dot: '#FF4E64' },
  grey: { bg: '#F0F0F0', dot: '#5D5D5D' }, white: { bg: '#FFFFFF', dot: '#8A8A8A' }
};

// One-way routes enabled by the admin (BR-26, BR-32): base price per seat and driving hours.
var ROUTES = [
  ['الرياض', 'جدة', 180, 9.5], ['جدة', 'الرياض', 180, 9.5], ['الرياض', 'الدمام', 90, 4], ['الدمام', 'الرياض', 90, 4],
  ['الرياض', 'القصيم', 80, 3.5], ['القصيم', 'الرياض', 80, 3.5], ['جدة', 'مكة المكرمة', 40, 1.25], ['مكة المكرمة', 'جدة', 40, 1.25],
  ['جدة', 'المدينة المنورة', 90, 4.5], ['المدينة المنورة', 'جدة', 90, 4.5]
];
var POINTS = {
  'الرياض': [['حي الملقا', 'مواقف طريق أنس بن مالك'], ['حي النرجس', 'محطة الوقود على طريق الملك سلمان'], ['حي العليا', 'مواقف برج المملكة']],
  'جدة': [['حي الروضة', 'مواقف شارع الأمير سلطان'], ['حي السلامة', 'محطة طريق المدينة'], ['حي الحمدانية', 'بوابة طريق الحرمين']],
  'الدمام': [['حي الشاطئ', 'مواقف كورنيش الدمام'], ['حي الفيصلية', 'محطة طريق الملك فهد']],
  'القصيم': [['بريدة، حي الريان', 'مواقف طريق الملك عبدالعزيز'], ['عنيزة، حي الخليج', 'محطة الوقود الرئيسية']],
  'مكة المكرمة': [['حي العزيزية', 'مواقف الشارع العام'], ['حي الشوقية', 'محطة طريق جدة السريع']],
  'المدينة المنورة': [['حي قباء', 'مواقف طريق قباء'], ['حي العزيزية', 'محطة طريق الهجرة']]
};
var CITIES = ['الرياض', 'جدة', 'الدمام', 'القصيم', 'مكة المكرمة', 'المدينة المنورة'];
var VEH_TYPES = [['sedan', 'سيدان', 4], ['suv', 'SUV عائلية', 6], ['van', 'فان', 7]];
var SIZES = [['small', 'صغيرة'], ['medium', 'متوسطة'], ['large', 'كبيرة']];
var DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
var DAY_SHORT = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
var BANKS = { '80': 'مصرف الراجحي', '10': 'البنك الأهلي السعودي', '20': 'بنك الرياض', '45': 'البنك السعودي البريطاني (ساب)', '05': 'مصرف الإنماء', '15': 'بنك البلاد', '55': 'البنك السعودي الفرنسي', '30': 'البنك العربي الوطني' };
var STAGES = ['السائق في الطريق', 'وصل السائق', 'تسجيل الحضور', 'جارية', 'مكتملة'];

function routeOf(from, to) { return ROUTES.filter(function (r) { return r[0] === from && r[1] === to; })[0]; }
function round5(n) { return Math.round(n / 5) * 5; }
function priceBounds(r) { return [round5(r[2] * (1 - PRICE_SPREAD)), round5(r[2] * (1 + PRICE_SPREAD))]; }
function money(n) { return (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ر.س'; }
function pad2(n) { return String(n).padStart(2, '0'); }
function dayAt(off) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + off); return d; }
function dateLabel(off) {
  if (off === 0) return 'اليوم';
  if (off === 1) return 'غداً';
  if (off === -1) return 'أمس';
  var d = dayAt(off);
  return DAY_NAMES[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
}
function dateLong(off) { var d = dayAt(off); return DAY_NAMES[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
function fmtTime(min) {
  min = ((Math.round(min) % 1440) + 1440) % 1440;
  var h = Math.floor(min / 60), m = min % 60;
  return (h % 12 || 12) + ':' + pad2(m) + ' ' + (h < 12 ? 'ص' : 'م');
}
function fmtDur(hours) {
  var t = Math.round(hours * 60), h = Math.floor(t / 60), m = t % 60;
  return (h ? h + ' س' : '') + (m ? (h ? ' ' : '') + m + ' د' : '');
}
function fmtClock(sec) { return Math.floor(sec / 60) + ':' + pad2(sec % 60); }
function nowMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function isoDay(off) { var d = dayAt(off); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function daysUntil(iso) {
  if (!iso) return null;
  var p = iso.split('-');
  var d = new Date(+p[0], +p[1] - 1, +p[2], 12);
  return Math.round((d - dayAt(0)) / 86400000);
}
function isoLabel(iso) { if (!iso) return '—'; var p = iso.split('-'); return +p[2] + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }
function seatsWord(n) { return n === 1 ? 'مقعد واحد' : n === 2 ? 'مقعدان' : n + ' مقاعد'; }
function bagsWord(n) { return n === 0 ? 'بدون حقائب' : n === 1 ? 'حقيبة واحدة' : n === 2 ? 'حقيبتان' : n + ' حقائب'; }
function initialOf(name) { return (name || '؟').trim().charAt(0); }
function toWesternDigits(s) {
  return String(s || '')
    .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
    .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
}
function normalizePhone(raw) {
  var p = toWesternDigits(raw).replace(/\D/g, '');
  if (p.indexOf('966') === 0) p = p.slice(3);
  if (p.indexOf('0') === 0) p = p.slice(1);
  return p;
}
function displayPhone(raw) {
  var p = normalizePhone(raw);
  return '+966 ' + p.slice(0, 2) + ' ' + p.slice(2, 5) + ' ' + p.slice(5);
}
function remainingText(n) {
  if (n >= 3) return 'متبقٍ لك ' + n + ' محاولات.';
  if (n === 2) return 'متبقٍ لك محاولتان.';
  return 'متبقية لك محاولة واحدة.';
}
function chipStyle(on, action) {
  return { border: on ? C.brand : C.stroke, bg: on ? C.soft : C.white, color: on ? action : C.ink, weight: on ? 700 : 500, pressed: on ? 'true' : 'false' };
}
function clockOf(ms) { var d = new Date(ms); return fmtTime(d.getHours() * 60 + d.getMinutes()); }
function agoText(ms) {
  var diff = Math.max(0, Date.now() - ms), m = Math.round(diff / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return 'قبل ' + m + ' د';
  var h = Math.round(m / 60);
  if (h < 24) return 'قبل ' + h + ' س';
  var d = Math.round(h / 24);
  return d === 1 ? 'أمس' : 'قبل ' + d + ' أيام';
}
function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ---------- sample data (driver فهد العتيبي, Toyota Camry, 4 passenger seats)
function pax(name, phone, att) { return { name: name, phone: phone, att: att || '', cancelled: false }; }
function sampleData() {
  var base = Math.min(nowMin() + 90, 23 * 60 + 30);
  var depToday = Math.ceil(base / 15) * 15;
  var H = 3600000, now = Date.now();
  var trips = [
    { id: 'TR-3101', from: 'الرياض', to: 'جدة', day: 0, dep: depToday, pickup: 0, dropoff: 0, seats: 4, price: 180, bags: 1, sizes: ['small', 'medium'], smoking: false, status: 'upcoming', stage: 0, stamps: [] },
    { id: 'TR-3108', from: 'الرياض', to: 'الدمام', day: 1, dep: 7 * 60 + 30, pickup: 1, dropoff: 0, seats: 3, price: 90, bags: 1, sizes: ['small', 'medium', 'large'], smoking: false, status: 'upcoming', stage: 0, stamps: [] },
    { id: 'TR-3115', from: 'الرياض', to: 'القصيم', day: 3, dep: 16 * 60, pickup: 2, dropoff: 0, seats: 4, price: 80, bags: 2, sizes: ['small', 'medium'], smoking: false, status: 'upcoming', stage: 0, stamps: [] },
    { id: 'TR-3044', from: 'جدة', to: 'الرياض', day: -4, dep: 6 * 60, pickup: 0, dropoff: 1, seats: 4, price: 175, bags: 1, sizes: ['small', 'medium'], smoking: false, status: 'completed', stage: 5, stamps: [], payout: 'payable' },
    { id: 'TR-3031', from: 'الرياض', to: 'الدمام', day: -9, dep: 8 * 60, pickup: 0, dropoff: 1, seats: 3, price: 90, bags: 1, sizes: ['small'], smoking: false, status: 'completed', stage: 5, stamps: [], payout: 'paid' },
    { id: 'TR-3020', from: 'الدمام', to: 'الرياض', day: -12, dep: 17 * 60, pickup: 1, dropoff: 2, seats: 3, price: 95, bags: 1, sizes: ['small', 'medium'], smoking: false, status: 'completed', stage: 5, stamps: [], payout: 'pending', hold: 'اعتراض راكب على تسجيل غيابه قيد المراجعة (BR-19)' },
    { id: 'TR-2987', from: 'الرياض', to: 'جدة', day: -38, dep: 5 * 60 + 30, pickup: 0, dropoff: 0, seats: 4, price: 185, bags: 1, sizes: ['small', 'medium'], smoking: false, status: 'completed', stage: 5, stamps: [], payout: 'paid' },
    { id: 'TR-3012', from: 'الرياض', to: 'جدة', day: -15, dep: 6 * 60, pickup: 0, dropoff: 0, seats: 4, price: 180, bags: 1, sizes: ['small'], smoking: false, status: 'cancelled', stage: 0, stamps: [], cancelNote: 'ألغيتها قبل وجود أي حجز، فحُذفت من نتائج البحث مباشرة.' }
  ];
  var bookings = [
    { ref: 'BK-50211', tripId: 'TR-3101', owner: 'نورة القحطاني', pax: [pax('نورة القحطاني', '553214587'), pax('ريم القحطاني', '554412098')], bags: 2, status: 'confirmed', at: now - 26 * H },
    { ref: 'BK-50218', tripId: 'TR-3101', owner: 'خالد الشمري', pax: [pax('خالد الشمري', '502278431')], bags: 1, status: 'confirmed', at: now - 3 * H },
    { ref: 'BK-50230', tripId: 'TR-3108', owner: 'عبدالله الحربي', pax: [pax('عبدالله الحربي', '561137720'), Object.assign(pax('سلمان الحربي', '561137721'), { cancelled: true })], bags: 1, status: 'partial', at: now - 30 * H },
    { ref: 'BK-49870', tripId: 'TR-3044', owner: 'ماجد الدوسري', pax: [pax('ماجد الدوسري', '505551234', 'present'), pax('فيصل الدوسري', '505551235', 'present')], bags: 2, status: 'completed', at: now - 7 * 24 * H },
    { ref: 'BK-49874', tripId: 'TR-3044', owner: 'هند الزهراني', pax: [pax('هند الزهراني', '558820011', 'present')], bags: 1, status: 'completed', at: now - 6 * 24 * H },
    { ref: 'BK-49881', tripId: 'TR-3044', owner: 'تركي العنزي', pax: [pax('تركي العنزي', '509917745', 'absent')], bags: 1, status: 'completed', at: now - 5 * 24 * H },
    { ref: 'BK-49640', tripId: 'TR-3031', owner: 'سعود المطيري', pax: [pax('سعود المطيري', '502210984', 'present'), pax('بدر المطيري', '502210985', 'present'), pax('نايف المطيري', '502210986', 'present')], bags: 3, status: 'completed', at: now - 11 * 24 * H },
    { ref: 'BK-49512', tripId: 'TR-3020', owner: 'أحمد الغامدي', pax: [pax('أحمد الغامدي', '551009874', 'present')], bags: 1, status: 'completed', at: now - 14 * 24 * H },
    { ref: 'BK-49515', tripId: 'TR-3020', owner: 'يوسف العمري', pax: [pax('يوسف العمري', '556677001', 'absent')], bags: 1, status: 'completed', at: now - 14 * 24 * H },
    { ref: 'BK-48802', tripId: 'TR-2987', owner: 'منى السبيعي', pax: [pax('منى السبيعي', '553300112', 'present'), pax('لمى السبيعي', '553300113', 'present')], bags: 2, status: 'completed', at: now - 41 * 24 * H },
    { ref: 'BK-48806', tripId: 'TR-2987', owner: 'راكان البقمي', pax: [pax('راكان البقمي', '507771200', 'present'), pax('مشعل البقمي', '507771201', 'present')], bags: 2, status: 'completed', at: now - 40 * 24 * H }
  ];
  var chats = {
    'BK-50211': [{ from: 'them', text: 'السلام عليكم، معنا حقيبتان متوسطتان، هل فيه مكان؟', at: now - 5 * H }, { from: 'me', text: 'وعليكم السلام، نعم المكان يكفي إن شاء الله', at: now - 4.8 * H }, { from: 'them', text: 'ممتاز، نكون في نقطة التجمع قبل الموعد بعشر دقائق', at: now - 0.4 * H }],
    'BK-50218': [],
    'BK-50230': [{ from: 'them', text: 'ألغيت مقعد أخي لأنه ما يقدر يسافر، أنا مستمر', at: now - 20 * H }],
    'BK-49870': [{ from: 'them', text: 'وصلنا، شكراً على الرحلة', at: now - 4 * 24 * H }]
  };
  var notifs = [
    { id: 'n1', kind: 'chat', ref: 'BK-50211', title: 'رسالة جديدة من نورة القحطاني', body: 'ممتاز، نكون في نقطة التجمع قبل الموعد بعشر دقائق', at: now - 0.4 * H, read: false },
    { id: 'n2', kind: 'booking', ref: 'BK-50218', title: 'حجز جديد مؤكد', body: 'خالد الشمري حجز مقعداً واحداً في رحلة الرياض ← جدة اليوم', at: now - 3 * H, read: false },
    { id: 'n3', kind: 'cancel', ref: 'BK-50230', title: 'إلغاء جزئي لحجز', body: 'ألغى عبدالله الحربي مقعداً واحداً من حجزه في رحلة الغد. المقعد متاح للحجز مجدداً', at: now - 20 * H, read: true },
    { id: 'n4', kind: 'rating', ref: '', title: 'تقييم جديد ★ 5', body: 'هند الزهراني: «التزام بالموعد وقيادة هادئة»', at: now - 3.5 * 24 * H, read: true },
    { id: 'n5', kind: 'money', ref: '', title: 'تم صرف مستحقات', body: 'حوّلنا 243 ر.س إلى حسابك المنتهي بـ 4471. المرجع TRF-88213', at: now - 6 * 24 * H, read: true },
    { id: 'n6', kind: 'money', ref: 'TR-3020', title: 'تعليق مبلغ متنازع عليه', body: 'علّقنا مستحق مقعد واحد في رحلة TR-3020 لحين مراجعة اعتراض الراكب', at: now - 11 * 24 * H, read: true },
    { id: 'n7', kind: 'admin', ref: '', title: 'تحديث من الإدارة', body: 'تم تفعيل مسار جدة ← المدينة المنورة. يمكنك نشر رحلاتك عليه الآن', at: now - 16 * 24 * H, read: true }
  ];
  var reviews = [
    { name: 'هند الزهراني', stars: 5, comment: 'التزام بالموعد وقيادة هادئة', trip: 'TR-3044', at: now - 3.5 * 24 * H },
    { name: 'ماجد الدوسري', stars: 5, comment: 'السيارة نظيفة ومكيّفة والسائق محترم', trip: 'TR-3044', at: now - 3.8 * 24 * H },
    { name: 'سعود المطيري', stars: 4, comment: 'رحلة مريحة، تأخر الانطلاق قليلاً', trip: 'TR-3031', at: now - 8 * 24 * H },
    { name: 'أحمد الغامدي', stars: 5, comment: '', trip: 'TR-3020', at: now - 11 * 24 * H },
    { name: 'منى السبيعي', stars: 2, comment: 'كلام غير لائق لا علاقة له بالرحلة', trip: 'TR-2987', at: now - 37 * 24 * H }
  ];
  var payouts = [
    { ref: 'TRF-88213', amount: 243, at: now - 6 * 24 * H, status: 'paid' },
    { ref: 'TRF-86017', amount: 666, at: now - 34 * 24 * H, status: 'paid' }
  ];
  var tickets = [
    { ref: 'SP-2210', type: 'payout', subject: 'اعتراض على تعليق مستحقات', link: 'TR-3020', at: now - 10 * 24 * H, status: 'review', msgs: [
      { from: 'me', text: 'الراكب لم يحضر لنقطة التجمع، وانتظرته 20 دقيقة وتواصلت معه بالمحادثة.', at: now - 10 * 24 * H },
      { from: 'support', text: 'شكراً لتواصلك. نراجع سجل الرحلة والمحادثة وسنرد عليك خلال 48 ساعة.', at: now - 9.8 * 24 * H }] }
  ];
  return { trips: trips, bookings: bookings, chats: chats, chatUnread: { 'BK-50211': 1 }, notifs: notifs, reviews: reviews, payouts: payouts, tickets: tickets };
}
function emptyData() { return { trips: [], bookings: [], chats: {}, chatUnread: {}, notifs: [], reviews: [], payouts: [], tickets: [] }; }
function approvedDocs() {
  return { idType: 'national', idNumber: '1098765432', idExpiry: isoDay(870), licExpiry: isoDay(22), idFile: 'national-id.jpg', licFile: 'driving-licence.jpg' };
}
function approvedVehicle() {
  return { type: 'sedan', make: 'تويوتا', model: 'كامري', year: '2023', color: 'أبيض', plateLetters: 'أ ب ج', plateNumbers: '4521', seats: 4, istFile: 'istimara.jpg', carFile: 'car-photos.jpg' };
}
function blankDocs() { return { idType: 'national', idNumber: '', idExpiry: '', licExpiry: '', idFile: '', licFile: '' }; }
function blankVehicle() { return { type: 'sedan', make: '', model: '', year: '', color: '', plateLetters: '', plateNumbers: '', seats: 4, istFile: '', carFile: '' }; }

var BASE_STATE = {
  screen: 'splash', sheet: '', prev: {}, toast: '', loading: false,
  phone: '', phoneError: '', otp: '', otpError: '', attempts: 0, seconds: RESEND_SECONDS, otpFocused: false, otpPurpose: 'login', kind: 'approved',
  driverName: 'فهد العتيبي', accStatus: 'approved', rejectReason: '', personalDone: true, vehicleDone: true, fresh: false,
  suName: '', suNameErr: '', suAgree: false, suAgreeErr: false,
  docs: null, docsErr: {}, docsMode: 'activation', docsDraft: null, docsPending: false,
  veh: null, vehErr: {}, vehDraft: null, vehPending: false,
  bank: { holder: '', iban: '' }, bankDraft: null, bankErr: {}, bankSaved: false,
  pfName: '', pfErr: '', pendingPhone: '', cpError: '',
  data: null, tripsTab: 'upcoming', tripId: '', bkFilter: 'all', bookingRef: '', chatRef: '', chatDraft: '', typing: false,
  cr: null, crErr: {}, cityTarget: 'from', pubId: '',
  graceLeft: GRACE_SECONDS, doneTripId: '',
  earnPeriod: 'month', earnTab: 'ledger', reportIdx: -1, reportReason: '',
  ticketId: '', tn: null, tnErr: {},
  prefs: { bookings: true, chat: true, money: true, admin: true }, lang: 'ar',
  staticKind: 'terms', ratingReported: {}
};

function presetState(name) {
  var s = clone(BASE_STATE);
  var approved = function (extra) {
    var d = sampleData();
    Object.assign(s, { screen: 'home', data: d, docs: approvedDocs(), veh: approvedVehicle(), phone: '501234567',
      bank: { holder: '', iban: '' }, accStatus: 'approved' }, extra || {});
    return s;
  };
  var activation = function (status, extra) {
    Object.assign(s, { screen: 'activation', data: emptyData(), fresh: true, phone: '551234567', driverName: 'محمد الشهري', accStatus: status,
      docs: blankDocs(), veh: blankVehicle(), personalDone: false, vehicleDone: false });
    if (status !== 'draft') { s.docs = approvedDocs(); s.veh = approvedVehicle(); s.personalDone = true; s.vehicleDone = true; }
    Object.assign(s, extra || {});
    return s;
  };
  var withTrip = function (id, patch) {
    s.data.trips = s.data.trips.map(function (t) { return t.id === id ? Object.assign(t, patch) : t; });
  };
  var running = function (stage) {
    approved({ screen: 'run', tripId: 'TR-3101' });
    var t0 = Date.now();
    var stamps = [t0 - 50 * 60000, t0 - 8 * 60000, t0 - 2 * 60000, t0 - 60000].slice(0, stage);
    withTrip('TR-3101', { status: stage ? 'current' : 'upcoming', stage: stage, stamps: stamps });
    if (stage >= 3) s.data.bookings.forEach(function (b) { if (b.tripId === 'TR-3101') b.pax.forEach(function (p, i) { p.att = b.ref === 'BK-50218' ? 'absent' : 'present'; }); });
    return s;
  };
  var crBase = function (step, extra) {
    approved({ screen: 'create' });
    s.cr = Object.assign(newCreate(s), { step: step, from: 'الرياض', to: 'جدة', day: 2, time: '06:30', pickup: 0, dropoff: 1 }, extra || {});
    return s;
  };
  var P = {
    'live': function () { return s; },
    'splash': function () { return s; },
    'phone': function () { s.screen = 'phone'; return s; },
    'phone-error': function () { Object.assign(s, { screen: 'phone', phone: '05123', phoneError: 'invalid' }); return s; },
    'otp': function () { Object.assign(s, { screen: 'otp', phone: '501234567', otp: '12', otpFocused: true, seconds: 42 }); return s; },
    'otp-wrong': function () { Object.assign(s, { screen: 'otp', phone: '501234567', otpError: 'wrong', attempts: 2, seconds: 18 }); return s; },
    'signup': function () { Object.assign(s, { screen: 'signup', phone: '551234567', kind: 'new' }); return s; },
    'signup-errors': function () { Object.assign(s, { screen: 'signup', phone: '551234567', kind: 'new', suName: 'محمد', suNameErr: 'short', suAgreeErr: true }); return s; },
    'docs-personal': function () { activation('draft', { screen: 'docsPersonal', docsMode: 'activation' }); s.docsDraft = Object.assign(blankDocs(), { idNumber: '1098', idFile: 'national-id.jpg' }); s.docsErr = { idNumber: 'short', idExpiry: 'empty', licExpiry: 'empty', licFile: true }; return s; },
    'docs-vehicle': function () { activation('draft', { screen: 'docsVehicle', docsMode: 'activation', personalDone: true, docs: approvedDocs() }); s.vehDraft = Object.assign(approvedVehicle(), { carFile: '' }); return s; },
    'act-review': function () { activation('draft', { screen: 'actReview', docsMode: 'activation', personalDone: true, vehicleDone: true, docs: approvedDocs(), veh: approvedVehicle() }); return s; },
    'act-rejected-edit': function () { activation('rejected', { screen: 'docsVehicle', docsMode: 'activation', vehicleDone: false, rejectReason: 'صورة الاستمارة غير واضحة.' }); s.vehDraft = Object.assign(approvedVehicle(), { istFile: '' }); s.vehErr = { ist: true }; return s; },
    'act-pending': function () { return activation('pending'); },
    'act-rejected': function () { return activation('rejected', { rejectReason: 'صورة الاستمارة غير واضحة، وتاريخ انتهائها غير مقروء. أعد رفعها بصورة أوضح.', vehicleDone: false }); },
    'act-approved': function () { return activation('approved'); },
    'act-suspended': function () { activation('suspended'); s.phone = '581234567'; s.driverName = 'فهد العتيبي'; return s; },
    'home': function () { return approved(); },
    'home-new': function () { approved({ data: emptyData(), fresh: true }); return s; },
    'create-route': function () { approved({ screen: 'create' }); s.cr = newCreate(s); s.cr.from = 'الرياض'; return s; },
    'create-city': function () { approved({ screen: 'create', sheet: 'city', cityTarget: 'to' }); s.cr = newCreate(s); s.cr.from = 'الرياض'; return s; },
    'create-errors': function () { crBase(1, { to: 'الدمام', day: 0, time: pad2(Math.floor(nowMin() / 60)) + ':00' }); s.crErr = { time: 'soon' }; return s; },
    'create-points': function () { return crBase(2); },
    'create-seats': function () { return crBase(3, { seats: 3, price: 175 }); },
    'create-review': function () { return crBase(4, { seats: 3, price: 175 }); },
    'published': function () { crBase(4, { seats: 3, price: 175 }); this_publish(s); return s; },
    'trips': function () { return approved({ screen: 'trips', tripsTab: 'upcoming' }); },
    'trips-completed': function () { return approved({ screen: 'trips', tripsTab: 'completed' }); },
    'trips-cancelled': function () { return approved({ screen: 'trips', tripsTab: 'cancelled' }); },
    'trips-current-empty': function () { return approved({ screen: 'trips', tripsTab: 'current' }); },
    'trip-booked': function () { return approved({ screen: 'tripDetail', tripId: 'TR-3101' }); },
    'trip-tomorrow': function () { return approved({ screen: 'tripDetail', tripId: 'TR-3108' }); },
    'trip-open': function () { return approved({ screen: 'tripDetail', tripId: 'TR-3115' }); },
    'trip-cancel-sheet': function () { return approved({ screen: 'tripDetail', tripId: 'TR-3101', sheet: 'cancelTrip' }); },
    'trip-edit': function () { approved({ screen: 'create', tripId: 'TR-3115' }); s.cr = createFromTrip(s, tripById(s, 'TR-3115')); s.cr.step = 3; return s; },
    'trip-completed': function () { return approved({ screen: 'tripDetail', tripId: 'TR-3044' }); },
    'trip-cancelled': function () { approved({ screen: 'tripDetail', tripId: 'TR-3012' }); return s; },
    'bookings': function () { return approved({ screen: 'bookings' }); },
    'booking-detail': function () { return approved({ screen: 'bookingDetail', bookingRef: 'BK-50211' }); },
    'booking-partial': function () { return approved({ screen: 'bookingDetail', bookingRef: 'BK-50230' }); },
    'run-start': function () { return running(0); },
    'run-confirm': function () { running(0); s.sheet = 'run'; return s; },
    'run-enroute': function () { return running(1); },
    'run-attendance': function () { running(2); s.graceLeft = 754; s.data.bookings[0].pax[0].att = 'present'; return s; },
    'run-grace-over': function () { running(2); s.graceLeft = 0; s.data.bookings[0].pax[0].att = 'present'; s.data.bookings[0].pax[1].att = 'present'; s.data.bookings[1].pax[0].att = 'absent'; return s; },
    'run-started': function () { return running(3); },
    'run-done': function () { running(3); finishTrip(s, 'TR-3101'); s.screen = 'runDone'; s.doneTripId = 'TR-3101'; return s; },
    'chat': function () { approved({ screen: 'chat', chatRef: 'BK-50211' }); s.data.chatUnread = {}; return s; },
    'chat-closed': function () { return approved({ screen: 'chat', chatRef: 'BK-49870' }); },
    'earnings': function () { return approved({ screen: 'earnings' }); },
    'earnings-payouts': function () { return approved({ screen: 'earnings', earnTab: 'payouts', bank: { holder: 'فهد سعد العتيبي', iban: '0380000000608010167519' } }); },
    'ratings': function () { return approved({ screen: 'ratings' }); },
    'rating-report': function () { return approved({ screen: 'ratings', sheet: 'report', reportIdx: 4, reportReason: 'abuse' }); },
    'notifs': function () { return approved({ screen: 'notifications' }); },
    'notifs-empty': function () { approved({ screen: 'notifications' }); s.data.notifs = []; return s; },
    'account': function () { return approved({ screen: 'account' }); },
    'profile': function () { return approved({ screen: 'profile', pfName: 'فهد العتيبي' }); },
    'change-phone': function () { return approved({ screen: 'changePhone', pendingPhone: '0556', cpError: 'invalid' }); },
    'docs-view': function () { return approved({ screen: 'docsView' }); },
    'docs-update': function () { approved({ screen: 'docsPersonal', docsMode: 'update' }); s.docsDraft = clone(s.docs); s.docsDraft.licExpiry = isoDay(1460); s.docsDraft.licFile = 'driving-licence-new.jpg'; return s; },
    'docs-pending': function () { return approved({ screen: 'docsView', docsPending: true }); },
    'vehicle-view': function () { return approved({ screen: 'vehicleView' }); },
    'bank': function () { return approved({ screen: 'bank', bankDraft: { holder: 'فهد سعد العتيبي', iban: '038000000060801016751' }, bankErr: { iban: 'length' } }); },
    'support': function () { return approved({ screen: 'support' }); },
    'ticket-new': function () { approved({ screen: 'ticketNew' }); s.tn = { type: 'rating', link: 'TR-2987', desc: 'تقييم يحتوي ألفاظاً لا علاقة لها بالرحلة', files: ['screenshot-1.jpg'] }; return s; },
    'ticket': function () { return approved({ screen: 'ticket', ticketId: 'SP-2210' }); },
    'settings': function () { return approved({ screen: 'settings' }); },
    'terms': function () { return approved({ screen: 'static', staticKind: 'terms' }); },
    'logout': function () { return approved({ screen: 'account', sheet: 'logout' }); }
  };
  (P[name] || P.live)();
  return s;
}

function tripById(s, id) { return (s.data ? s.data.trips : []).filter(function (t) { return t.id === id; })[0]; }
function bookingByRef(s, ref) { return (s.data ? s.data.bookings : []).filter(function (b) { return b.ref === ref; })[0]; }
function activePax(b) { return b.pax.filter(function (p) { return !p.cancelled; }); }
function tripBookings(s, id, all) { return s.data.bookings.filter(function (b) { return b.tripId === id && (all || b.status !== 'cancelled'); }); }
function bookedSeats(s, id) { return tripBookings(s, id).reduce(function (n, b) { return n + activePax(b).length; }, 0); }
function vehSeats(s) { return (s.veh && s.veh.seats) || 4; }
function tripEarn(s, t) {
  var seats = bookedSeats(s, t.id);
  var gross = seats * t.price, fee = Math.round(gross * COMMISSION * 100) / 100;
  var absent = tripBookings(s, t.id).reduce(function (n, b) { return n + activePax(b).filter(function (p) { return p.att === 'absent'; }).length; }, 0);
  return { seats: seats, absent: absent, gross: gross, fee: fee, net: gross - fee };
}
function newCreate(s) {
  return { step: 1, editId: '', from: '', to: '', day: 1, time: '07:00', pickup: 0, dropoff: 0, seats: Math.min(3, vehSeats(s)), price: 0, bags: 1, sizes: ['small', 'medium'], smoking: false };
}
function createFromTrip(s, t) {
  return { step: 1, editId: t.id, from: t.from, to: t.to, day: t.day, time: pad2(Math.floor(t.dep / 60)) + ':' + pad2(t.dep % 60), pickup: t.pickup, dropoff: t.dropoff, seats: t.seats, price: t.price, bags: t.bags, sizes: t.sizes.slice(), smoking: t.smoking };
}
function depMinOf(time) { var p = (time || '').split(':'); return p.length === 2 ? (+p[0]) * 60 + (+p[1]) : NaN; }
function validateStep1(cr) {
  var e = {};
  if (!cr.from || !cr.to) e.route = 'missing';
  else if (cr.from === cr.to) e.route = 'same';
  else if (!routeOf(cr.from, cr.to)) e.route = 'disabled';
  var m = depMinOf(cr.time);
  if (isNaN(m)) e.time = 'empty';
  else if (cr.day === 0 && m < nowMin() + MIN_LEAD_HOURS * 60) e.time = 'soon';
  return e;
}
function this_publish(s) {
  var cr = s.cr, r = routeOf(cr.from, cr.to);
  var num = 3116 + s.data.trips.filter(function (t) { return +t.id.slice(3) > 3115; }).length;
  var t = { id: 'TR-' + num, from: cr.from, to: cr.to, day: cr.day, dep: depMinOf(cr.time), pickup: cr.pickup, dropoff: cr.dropoff, seats: cr.seats, price: cr.price || r[2], bags: cr.bags, sizes: cr.sizes.slice(), smoking: cr.smoking, status: 'upcoming', stage: 0, stamps: [] };
  s.data.trips = [t].concat(s.data.trips);
  s.pubId = t.id;
  s.screen = 'published';
  return t;
}
function finishTrip(s, id) {
  var stamp = Date.now();
  s.data.trips = s.data.trips.map(function (t) {
    if (t.id !== id) return t;
    return Object.assign({}, t, { status: 'completed', stage: 5, stamps: t.stamps.concat([stamp]), payout: 'payable' });
  });
  s.data.bookings = s.data.bookings.map(function (b) {
    if (b.tripId !== id || b.status === 'cancelled') return b;
    return Object.assign({}, b, { status: 'completed' });
  });
}
function chatIsOpen(b) { return b && (b.status === 'confirmed' || b.status === 'partial'); }

var TICKET_TYPES = [['booking', 'حجز أو راكب'], ['attendance', 'إثبات الحضور'], ['payout', 'المستحقات'], ['rating', 'تقييم غير لائق'], ['account', 'الحساب والمستندات'], ['other', 'أخرى']];
var TICKET_STATUS = { new: ['جديدة', 'blue'], review: ['قيد المراجعة', 'amber'], solved: ['تم الحل', 'green'], closed: ['مغلقة', 'grey'] };
var REPORT_REASONS = [['abuse', 'ألفاظ أو إساءة'], ['false', 'معلومات غير صحيحة'], ['unrelated', 'لا يخص الرحلة']];
var STATIC = {
  terms: { title: 'الشروط والأحكام للسائقين', sections: [
    ['التفعيل والمستندات', 'لا يمكنك نشر الرحلات أو استقبال الحجوزات قبل اعتماد هويتك ورخصتك ومركبتك من الإدارة. أي تحديث للمستندات أو المركبة يحتاج اعتماداً جديداً.'],
    ['نشر الرحلات', 'تنشر على المسارات المفعّلة فقط، وبسعر ضمن حدود المسار، وعدد مقاعد لا يتجاوز مقاعد الركاب في مركبتك المعتمدة.'],
    ['الالتزام بالرحلة', 'بمجرد وجود حجز مؤكد واحد تصبح ملزماً بتنفيذ الرحلة. وإلغاؤها يسترد للركاب 100% ويُسجَّل لدى الإدارة.'],
    ['عدم حضور الراكب', 'تنتظر 15 دقيقة بعد موعد الانطلاق قبل تسجيل «لم يحضر». ويحتفظ السائق بصافي مستحق مقعد الراكب الغائب.'],
    ['العمولة والمستحقات', 'تُخصم عمولة المنصة من قيمة المقاعد المدفوعة غير المستردة، وتصبح المستحقات قابلة للصرف بعد اكتمال الرحلة، ويتم الصرف يدوياً بتحويل بنكي.']] },
  privacy: { title: 'سياسة الخصوصية', sections: [
    ['البيانات التي نجمعها', 'اسمك ورقم جوالك وصور مستنداتك ومركبتك وبياناتك البنكية، لأغراض التحقق وتشغيل الرحلات وصرف المستحقات فقط.'],
    ['ما يراه الركاب', 'اسمك وتقييمك وبيانات مركبتك ولوحتها لمن حجز معك. ولا يرى الركاب مستنداتك أو بياناتك البنكية.'],
    ['المحادثات', 'نصية ومرتبطة بالحجز، ولا تطّلع عليها الإدارة إلا عند وجود نزاع.']] }
};

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var preset = (props && props.preset) || 'live';
    this.frozen = preset !== 'live';
    this.state = presetState(preset);
  }

  componentDidMount() {
    var self = this;
    if (this.frozen) return;
    if (this.state.screen === 'splash') this.later(1600, function () { self.setState({ screen: 'phone' }); });
    this.iv = setInterval(function () {
      var s = self.state;
      if (s.screen === 'otp' && s.seconds > 0 && s.otpError !== 'locked') self.setState({ seconds: s.seconds - 1 });
      if (s.screen === 'run' && s.graceLeft > 0) { var t = tripById(s, s.tripId); if (t && t.stage === 2) self.setState({ graceLeft: s.graceLeft - 1 }); }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.iv);
    clearTimeout(this.toastTimer);
    clearTimeout(this.workTimer);
    clearTimeout(this.replyTimer);
  }

  flash(patch, msg) {
    var self = this;
    this.setState(Object.assign({}, patch, { toast: msg }));
    if (this.frozen) return;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(function () { self.setState({ toast: '' }); }, 2800);
  }
  later(ms, fn) { clearTimeout(this.workTimer); this.workTimer = setTimeout(fn, ms); }

  // Navigate and remember where we came from, so every back button returns to the caller.
  go(screen, patch) {
    var prev = Object.assign({}, this.state.prev);
    if (screen !== this.state.screen) prev[screen] = this.state.screen;
    this.setState(Object.assign({ screen: screen, sheet: '', prev: prev }, patch || {}));
  }
  back(fallback) {
    var s = this.state;
    this.setState({ screen: s.prev[s.screen] || fallback, sheet: '' });
  }
  setData(fn, extra, msg) {
    var d = clone(this.state.data);
    fn(d);
    var patch = Object.assign({ data: d }, extra || {});
    if (msg) this.flash(patch, msg); else this.setState(patch);
  }
  addNotif(d, kind, ref, title, body) {
    d.notifs = [{ id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5), kind: kind, ref: ref, title: title, body: body, at: Date.now(), read: false }].concat(d.notifs);
  }

  // ---------- auth (same flow as the customer app, BR-34)
  submitPhone() {
    var self = this;
    var p = normalizePhone(this.state.phone);
    if (!p) { this.setState({ phoneError: 'empty' }); return; }
    if (!/^5\d{8}$/.test(p)) { this.setState({ phoneError: 'invalid' }); return; }
    var kind = p.indexOf('55') === 0 ? 'new' : p.indexOf('56') === 0 ? 'pending' : p.indexOf('57') === 0 ? 'rejected' : p.indexOf('58') === 0 ? 'suspended' : 'approved';
    this.setState({ phone: p, phoneError: '', loading: true, kind: kind });
    this.later(900, function () {
      self.setState({ loading: false, screen: 'otp', otp: '', otpError: '', attempts: 0, seconds: RESEND_SECONDS, otpFocused: false, otpPurpose: 'login' });
    });
  }
  verify(code) {
    var self = this;
    var s = this.state;
    if (s.otpError === 'locked' || s.loading) return;
    this.setState({ loading: true });
    this.later(700, function () {
      if (code === CORRECT_CODE) {
        self.setState({ loading: false, otp: '', otpError: '' });
        if (self.state.otpPurpose === 'changePhone') {
          self.flash({ phone: normalizePhone(self.state.pendingPhone), pendingPhone: '', otpPurpose: 'login', screen: 'profile' }, 'تم تغيير رقم الجوال');
          return;
        }
        self.login();
        return;
      }
      if (code === EXPIRED_CODE) { self.setState({ loading: false, otp: '', otpError: 'expired', seconds: 0 }); return; }
      var attempts = self.state.attempts + 1;
      self.setState({ loading: false, otp: '', attempts: attempts, otpError: attempts >= MAX_ATTEMPTS ? 'locked' : 'wrong' });
    });
  }
  login() {
    var k = this.state.kind;
    if (k === 'new') { this.setState({ screen: 'signup', suName: '', suNameErr: '', suAgree: false, suAgreeErr: false, prev: {} }); return; }
    if (k === 'approved') {
      this.flash({ screen: 'home', prev: {}, accStatus: 'approved', driverName: 'فهد العتيبي', data: sampleData(), docs: approvedDocs(), veh: approvedVehicle(), personalDone: true, vehicleDone: true, fresh: false }, 'أهلاً فهد، تم تسجيل الدخول');
      return;
    }
    var patch = { screen: 'activation', prev: {}, accStatus: k, driverName: 'محمد الشهري', data: emptyData(), fresh: true, docs: approvedDocs(), veh: approvedVehicle(), personalDone: true, vehicleDone: k !== 'rejected' };
    if (k === 'rejected') patch.rejectReason = 'صورة الاستمارة غير واضحة، وتاريخ انتهائها غير مقروء. أعد رفعها بصورة أوضح.';
    if (k === 'suspended') patch.driverName = 'فهد العتيبي';
    this.setState(patch);
  }
  submitSignup() {
    var self = this;
    var name = this.state.suName.trim().replace(/\s+/g, ' ');
    var nameErr = !name ? 'empty' : name.split(' ').length < 2 ? 'short' : '';
    var agreeErr = !this.state.suAgree;
    this.setState({ suNameErr: nameErr, suAgreeErr: agreeErr });
    if (nameErr || agreeErr) return;
    this.setState({ loading: true });
    this.later(800, function () {
      self.flash({ loading: false, screen: 'docsPersonal', docsMode: 'activation', prev: {}, driverName: name, accStatus: 'draft', data: emptyData(), fresh: true,
        docs: blankDocs(), veh: blankVehicle(), docsDraft: blankDocs(), docsErr: {}, personalDone: false, vehicleDone: false }, 'تم إنشاء حسابك. أكمل الخطوات لتفعيله');
    });
  }

  // ---------- documents + vehicle (DRV-02, DRV-13)
  openDocs(mode) {
    this.go('docsPersonal', { docsMode: mode, docsDraft: clone(this.state.docs || blankDocs()), docsErr: {} });
  }
  openVehicle(mode) {
    this.go('docsVehicle', { docsMode: mode, vehDraft: clone(this.state.veh || blankVehicle()), vehErr: {} });
  }
  savePersonal() {
    var d = this.state.docsDraft, e = {};
    if (!/^\d{10}$/.test(d.idNumber)) e.idNumber = d.idNumber ? 'short' : 'empty';
    else if (d.idType === 'national' && d.idNumber.charAt(0) !== '1') e.idNumber = 'nationalPrefix';
    else if (d.idType === 'iqama' && d.idNumber.charAt(0) !== '2') e.idNumber = 'iqamaPrefix';
    var ie = daysUntil(d.idExpiry), le = daysUntil(d.licExpiry);
    if (ie === null) e.idExpiry = 'empty'; else if (ie < 0) e.idExpiry = 'past';
    if (le === null) e.licExpiry = 'empty'; else if (le < 0) e.licExpiry = 'past';
    if (!d.idFile) e.idFile = true;
    if (!d.licFile) e.licFile = true;
    this.setState({ docsErr: e });
    if (Object.keys(e).length) return;
    if (this.state.docsMode === 'update') {
      this.flash({ screen: 'docsView', docsPending: true, docsDraft: null }, 'أرسلنا التحديث لمراجعة الإدارة');
      return;
    }
    this.setState({ screen: 'docsVehicle', docs: clone(d), personalDone: true, docsDraft: null, vehDraft: clone(this.state.veh || blankVehicle()), vehErr: {} });
  }
  saveVehicle() {
    var v = this.state.vehDraft, e = {};
    if (!v.make.trim()) e.make = 'empty';
    if (!v.model.trim()) e.model = 'empty';
    var y = +v.year, maxY = new Date().getFullYear() + 1;
    if (!/^\d{4}$/.test(v.year)) e.year = v.year ? 'format' : 'empty'; else if (y < 2010 || y > maxY) e.year = 'range';
    if (!v.color.trim()) e.color = 'empty';
    var letters = v.plateLetters.replace(/\s/g, '');
    if (!/^[ء-ي]{1,3}$/.test(letters) || !/^\d{1,4}$/.test(v.plateNumbers)) e.plate = true;
    if (!v.istFile) e.ist = true;
    if (!v.carFile) e.car = true;
    this.setState({ vehErr: e });
    if (Object.keys(e).length) return;
    if (this.state.docsMode === 'update') {
      this.flash({ screen: 'vehicleView', vehPending: true, vehDraft: null }, 'أرسلنا تحديث المركبة لمراجعة الإدارة');
      return;
    }
    var fixed = this.state.accStatus === 'rejected';
    this.setState({ screen: 'actReview', veh: clone(v), vehicleDone: true, vehDraft: null, vehFixed: fixed });
  }
  submitActivation() {
    var s = this.state;
    if (!(s.personalDone && s.vehicleDone)) return;
    this.flash({ screen: 'activation', accStatus: 'pending', vehFixed: false, prev: {} }, 'أرسلنا طلبك للمراجعة');
  }

  // ---------- create / edit trip (DRV-05, DRV-06)
  createNext() {
    var s = this.state, cr = clone(s.cr);
    if (cr.step === 1) {
      var e = validateStep1(cr);
      this.setState({ crErr: e });
      if (Object.keys(e).length) return;
      var r = routeOf(cr.from, cr.to), b = priceBounds(r);
      if (!cr.price || cr.price < b[0] || cr.price > b[1]) cr.price = r[2];
      var pts = POINTS;
      if (cr.pickup >= pts[cr.from].length) cr.pickup = 0;
      if (cr.dropoff >= pts[cr.to].length) cr.dropoff = 0;
    }
    if (cr.step === 3) {
      if (!cr.sizes.length) { this.setState({ crErr: { sizes: true } }); return; }
      var rb = priceBounds(routeOf(cr.from, cr.to));
      if (cr.price < rb[0] || cr.price > rb[1]) { this.setState({ crErr: { price: true } }); return; }
    }
    if (cr.step < 4) { cr.step += 1; this.setState({ cr: cr, crErr: {} }); return; }
    // step 4 → publish (BR-28) or save the edit (BR-29)
    var e1 = validateStep1(cr);
    if (Object.keys(e1).length) { cr.step = 1; this.setState({ cr: cr, crErr: e1 }); return; }
    if (cr.editId) {
      var id = cr.editId, self = this;
      var t0 = tripById(s, id);
      if (!t0 || bookedSeats(s, id) > 0) { this.flash({ screen: 'tripDetail', tripId: id }, 'لا يمكن التعديل بعد وجود حجز مؤكد'); return; }
      this.setData(function (d) {
        d.trips = d.trips.map(function (t) { return t.id === id ? Object.assign({}, t, { from: cr.from, to: cr.to, day: cr.day, dep: depMinOf(cr.time), pickup: cr.pickup, dropoff: cr.dropoff, seats: cr.seats, price: cr.price, bags: cr.bags, sizes: cr.sizes.slice(), smoking: cr.smoking }) : t; });
      }, { screen: 'tripDetail', tripId: id, cr: null }, 'تم تحديث الرحلة');
      return;
    }
    var ns = clone(s);
    var t = this_publish(ns);
    this.addNotif(ns.data, 'trip', t.id, 'تم نشر رحلتك', t.from + ' ← ' + t.to + ' · ' + dateLabel(t.day) + ' ' + fmtTime(t.dep));
    this.flash({ data: ns.data, pubId: ns.pubId, screen: 'published', cr: null, prev: Object.assign({}, s.prev, { published: 'home' }) }, 'نُشرت الرحلة وتظهر الآن في البحث');
  }
  createBack() {
    var cr = this.state.cr;
    if (cr && cr.step > 1) { var c = clone(cr); c.step -= 1; this.setState({ cr: c, crErr: {}, sheet: '' }); return; }
    this.back(cr && cr.editId ? 'tripDetail' : 'home');
  }
  setCr(patch, errPatch) {
    var cr = Object.assign(clone(this.state.cr), patch);
    var e = Object.assign({}, this.state.crErr, errPatch || {});
    this.setState({ cr: cr, crErr: e });
  }

  // ---------- trip run (DRV-09). Every step notifies the passengers; no going back (BR-31).
  runNext() {
    var s = this.state, t = tripById(s, s.tripId);
    if (!t) return;
    if (t.stage === 2) {
      var pending = this.paxOf(t.id).filter(function (p) { return !p.att; }).length;
      if (pending) return;
    }
    this.setState({ sheet: 'run' });
  }
  confirmRun() {
    var s = this.state, t = tripById(s, s.tripId), self = this;
    if (!t) return;
    var stage = t.stage, id = t.id;
    if (stage === 3) {
      var ns = clone(s);
      finishTrip(ns, id);
      var tt = tripById(ns, id), e = tripEarn(ns, tt);
      this.addNotif(ns.data, 'money', id, 'مستحق جديد ' + money(e.net), 'اكتملت رحلة ' + tt.from + ' ← ' + tt.to + ' وأصبح صافي مستحقك قابلاً للصرف');
      this.flash({ data: ns.data, sheet: '', screen: 'runDone', doneTripId: id }, 'أرسلنا للركاب: اكتملت الرحلة');
      return;
    }
    var msgs = ['أرسلنا للركاب: السائق في الطريق', 'أرسلنا للركاب: وصل السائق', 'أرسلنا للركاب: بدأت الرحلة'];
    this.setData(function (d) {
      d.trips = d.trips.map(function (x) { return x.id === id ? Object.assign({}, x, { status: 'current', stage: stage + 1, stamps: x.stamps.concat([Date.now()]) }) : x; });
    }, { sheet: '', graceLeft: stage === 1 ? GRACE_SECONDS : s.graceLeft }, msgs[stage]);
  }
  paxOf(tripId) {
    var out = [];
    tripBookings(this.state, tripId).forEach(function (b) { b.pax.forEach(function (p, i) { if (!p.cancelled) out.push(Object.assign({ ref: b.ref, owner: b.owner, idx: i }, p)); }); });
    return out;
  }
  markAtt(ref, idx, att) {
    if (att === 'absent' && this.state.graceLeft > 0) return; // BR-16
    this.setData(function (d) {
      d.bookings = d.bookings.map(function (b) {
        if (b.ref !== ref) return b;
        var nb = clone(b);
        nb.pax[idx].att = nb.pax[idx].att === att ? '' : att;
        return nb;
      });
    });
  }

  cancelTrip() {
    var s = this.state, id = s.tripId, t = tripById(s, id);
    if (!t || t.status !== 'upcoming') return;
    var bks = tripBookings(s, id), self = this;
    this.setData(function (d) {
      d.trips = d.trips.map(function (x) { return x.id === id ? Object.assign({}, x, { status: 'cancelled', cancelNote: bks.length ? 'ألغيتها وعليها ' + bks.length + ' حجز مؤكد. استُرد للركاب 100% ولا أرباح عنها، وسُجّلت الواقعة لدى الإدارة (BR-14).' : 'ألغيتها قبل وجود أي حجز، فحُذفت من نتائج البحث مباشرة.' }) : x; });
      d.bookings = d.bookings.map(function (b) { return b.tripId === id && b.status !== 'cancelled' ? Object.assign({}, b, { status: 'cancelled', byDriver: true }) : b; });
    }, { sheet: '' }, bks.length ? 'أُلغيت الرحلة وأُبلغ الركاب بالاسترداد الكامل' : 'أُلغيت الرحلة وحُذفت من البحث');
  }

  // ---------- chat (DRV-08)
  sendMessage(text) {
    var self = this, s = this.state, ref = s.chatRef;
    var msg = (text || s.chatDraft || '').trim();
    var b = bookingByRef(s, ref);
    if (!msg || !chatIsOpen(b)) return;
    var d = clone(s.data);
    d.chats[ref] = (d.chats[ref] || []).concat([{ from: 'me', text: msg, at: Date.now() }]);
    this.setState({ data: d, chatDraft: '' });
    if (this.frozen) return;
    clearTimeout(this.replyTimer);
    this.replyTimer = setTimeout(function () {
      self.setState({ typing: true });
      self.replyTimer = setTimeout(function () {
        var dd = clone(self.state.data);
        dd.chats[ref] = (dd.chats[ref] || []).concat([{ from: 'them', text: 'تمام، شكراً لك', at: Date.now() }]);
        self.setState({ data: dd, typing: false });
      }, 1600);
    }, 900);
  }
  openChat(ref) {
    var d = clone(this.state.data);
    d.chatUnread[ref] = 0;
    d.notifs = d.notifs.map(function (n) { return n.kind === 'chat' && n.ref === ref ? Object.assign({}, n, { read: true }) : n; });
    this.go('chat', { chatRef: ref, chatDraft: '', data: d, typing: false });
  }
  openNotif(n) {
    var d = clone(this.state.data);
    d.notifs = d.notifs.map(function (x) { return x.id === n.id ? Object.assign({}, x, { read: true }) : x; });
    this.setState({ data: d });
    if (n.kind === 'chat') { this.openChat(n.ref); return; }
    if ((n.kind === 'booking' || n.kind === 'cancel') && bookingByRef(this.state, n.ref)) { this.go('bookingDetail', { bookingRef: n.ref }); return; }
    if (n.kind === 'rating') { this.go('ratings'); return; }
    if (n.kind === 'money') { this.go('earnings', { earnTab: n.ref ? 'ledger' : 'payouts' }); return; }
    if (n.kind === 'trip' && tripById(this.state, n.ref)) { this.go('tripDetail', { tripId: n.ref }); return; }
    if (n.kind === 'account') { this.go('docsView'); return; }
  }

  saveBank() {
    var b = this.state.bankDraft, e = {};
    var holder = b.holder.trim().replace(/\s+/g, ' ');
    if (!holder) e.holder = 'empty'; else if (holder.split(' ').length < 2) e.holder = 'short';
    if (!b.iban) e.iban = 'empty'; else if (b.iban.length !== 22) e.iban = 'length'; else if (!BANKS[b.iban.slice(2, 4)]) e.iban = 'bank';
    this.setState({ bankErr: e });
    if (Object.keys(e).length) return;
    this.flash({ bank: { holder: holder, iban: b.iban }, bankDraft: null, screen: this.state.prev.bank || 'account' }, 'تم حفظ البيانات البنكية');
  }
  submitTicket() {
    var self = this, tn = this.state.tn, e = {};
    if (!tn.type) e.type = true;
    if (tn.desc.trim().length < 10) e.desc = true;
    this.setState({ tnErr: e });
    if (Object.keys(e).length) return;
    this.setState({ loading: true });
    this.later(700, function () {
      var d = clone(self.state.data);
      var ref = 'SP-' + (2211 + d.tickets.length);
      var subject = TICKET_TYPES.filter(function (x) { return x[0] === tn.type; })[0][1];
      d.tickets = [{ ref: ref, type: tn.type, subject: subject, link: tn.link, at: Date.now(), status: 'new', files: tn.files.slice(), msgs: [{ from: 'me', text: tn.desc.trim(), at: Date.now() }] }].concat(d.tickets);
      self.flash({ loading: false, data: d, tn: null, screen: 'ticket', ticketId: ref, prev: Object.assign({}, self.state.prev, { ticket: 'support' }) }, 'أرسلنا تذكرتك ' + ref);
    });
  }

  renderVals() {
    var self = this, s = this.state, screen = s.screen;
    var action = BRAND[this.props.brandColor] || BRAND.original;
    var d = s.data || emptyData();
    var locked = s.otpError === 'locked';
    var tone = function (k) { return TONES[k]; };

    // ---------- trips
    var tripStatus = function (t) {
      if (t.status === 'cancelled') return ['ملغاة', 'red'];
      if (t.status === 'completed') return ['مكتملة', 'green'];
      if (t.status === 'current') return [STAGES[t.stage === 3 ? 3 : Math.max(0, t.stage - 1)], 'orange'];
      return bookedSeats(s, t.id) ? ['مؤكدة', 'blue'] : ['منشورة', 'purple'];
    };
    var tripView = function (t, dark) {
      var r = routeOf(t.from, t.to) || [t.from, t.to, t.price, 4];
      var booked = bookedSeats(s, t.id), st = tripStatus(t);
      return {
        dep: fmtTime(t.dep), arr: fmtTime(t.dep + r[3] * 60), from: t.from, to: t.to, duration: fmtDur(r[3]),
        date: dateLabel(t.day) + ' · ' + fmtTime(t.dep), price: money(t.price),
        bookedText: booked ? seatsWord(booked) + ' محجوزة' : 'لا حجوزات بعد',
        freeText: (t.seats - booked) ? 'متاح ' + seatsWord(t.seats - booked) : 'مكتملة الحجز',
        fill: Math.round(booked / t.seats * 100) + '%', status: st[0], pillBg: tone(st[1]).bg, pillDot: tone(st[1]).dot,
        aria: 'رحلة ' + t.from + ' إلى ' + t.to + '، ' + dateLabel(t.day) + ' ' + fmtTime(t.dep) + '، ' + st[0],
        open: function () { self.go('tripDetail', { tripId: t.id }); }
      };
    };
    var byTab = { upcoming: [], current: [], completed: [], cancelled: [] };
    d.trips.forEach(function (t) { byTab[t.status].push(t); });
    byTab.upcoming.sort(function (a, b) { return a.day - b.day || a.dep - b.dep; });
    byTab.completed.sort(function (a, b) { return b.day - a.day; });
    byTab.cancelled.sort(function (a, b) { return b.day - a.day; });
    var tabLabels = { upcoming: 'قادمة', current: 'جارية', completed: 'مكتملة', cancelled: 'ملغاة' };
    var tripTabs = ['upcoming', 'current', 'completed', 'cancelled'].map(function (k) {
      return Object.assign(chipStyle(s.tripsTab === k, action), { label: tabLabels[k] + (byTab[k].length ? ' ' + byTab[k].length : ''), pick: function () { self.setState({ tripsTab: k }); } });
    });
    var tripCards = (byTab[s.tripsTab] || []).map(function (t) { return tripView(t); });
    var emptyCopy = {
      upcoming: ['لا توجد رحلات قادمة', 'انشر رحلة على أحد المسارات المفعّلة ليجدها الركاب في البحث فوراً.'],
      current: ['لا توجد رحلة جارية', 'عند بدء تنفيذ رحلة قادمة تظهر هنا حتى تكتمل.'],
      completed: ['لا توجد رحلات مكتملة', 'الرحلات المنفّذة وأرباحها تظهر هنا.'],
      cancelled: ['لا توجد رحلات ملغاة', 'الرحلات التي ألغيتها تبقى هنا للقراءة فقط.']
    }[s.tripsTab];

    // ---------- home
    var nextTrip = byTab.current[0] || byTab.upcoming.filter(function (t) { return bookedSeats(s, t.id); })[0] || byTab.upcoming[0];
    var unreadChats = Object.keys(d.chatUnread).reduce(function (n, k) { return n + (d.chatUnread[k] || 0); }, 0);
    var unreadNotifs = d.notifs.filter(function (n) { return !n.read; }).length;
    var activeBookings = d.bookings.filter(function (b) { return b.status === 'confirmed' || b.status === 'partial'; });
    var activeSeats = activeBookings.reduce(function (n, b) { return n + activePax(b).length; }, 0);
    var homeNext = {};
    if (nextTrip) {
      var nv = tripView(nextTrip, true), nb = bookedSeats(s, nextTrip.id), cur = nextTrip.status === 'current';
      homeNext = Object.assign(nv, {
        when: dateLabel(nextTrip.day) + ' · ' + fmtTime(nextTrip.dep), whenColor: nextTrip.day === 0 ? '#5EAEFF' : 'rgba(255, 255, 255, 0.72)',
        bookedText: nb + ' من ' + nextTrip.seats + ' مقاعد محجوزة',
        pickup: POINTS[nextTrip.from][nextTrip.pickup][0] + '، ' + POINTS[nextTrip.from][nextTrip.pickup][1],
        cta: cur ? 'متابعة التنفيذ' : nextTrip.day === 0 && nb ? 'ابدأ الرحلة' : 'التفاصيل',
        open: function () { if (cur || (nextTrip.day === 0 && nb)) self.go('run', { tripId: nextTrip.id }); else self.go('tripDetail', { tripId: nextTrip.id }); }
      });
    }
    // Rolling 30-day window: a calendar month would be empty on the 1st, which breaks the demo
    var monthStart = -29;
    var earnOf = function (list) {
      return list.reduce(function (a, t) { var e = tripEarn(s, t); a.gross += e.gross; a.fee += e.fee; a.net += e.net; return a; }, { gross: 0, fee: 0, net: 0 });
    };
    var completed = byTab.completed;
    var inMonth = completed.filter(function (t) { return t.day >= monthStart; });
    var sumBy = function (k) { return completed.filter(function (t) { return t.payout === k; }).reduce(function (n, t) { return n + tripEarn(s, t).net; }, 0); };
    var periodSum = earnOf(s.earnPeriod === 'month' ? inMonth : completed);
    var bankSet = !!(s.bank && s.bank.iban);
    var earn = {
      rate: Math.round(COMMISSION * 100) + '%', feeNeg: '⁦−' + money(periodSum.fee).replace(' ر.س', '') + '⁩' /* LRI…PDI keeps the minus on the number's left in RTL */, netPct: Math.round((1 - COMMISSION) * 100) + '%', netShare: (periodSum.gross ? Math.round(periodSum.net / periodSum.gross * 1000) / 10 : 0) + '%', shareAria: 'صافيك ' + Math.round((1 - COMMISSION) * 100) + '% وعمولة المنصة ' + Math.round(COMMISSION * 100) + '% من إجمالي الإيرادات',
      net: money(periodSum.net), subline: 'من ' + money(periodSum.gross) + ' بعد عمولة المنصة ' + Math.round(COMMISSION * 100) + '%', netLabel: s.earnPeriod === 'month' ? 'صافي أرباح آخر 30 يوماً' : 'صافي الأرباح منذ البداية', gross: money(periodSum.gross), fee: money(periodSum.fee), monthNet: money(earnOf(inMonth).net),
      pending: money(sumBy('pending')), payable: money(sumBy('payable')), paid: money(sumBy('paid')),
      needBank: !bankSet, bankText: bankSet ? (BANKS[s.bank.iban.slice(2, 4)] || 'حسابك') + ' · الحساب المنتهي بـ ' + s.bank.iban.slice(-4) : 'حسابك البنكي بعد إضافته'
    };
    var payoutTone = { pending: ['معلّق', 'amber'], payable: ['مستحق', 'green'], paid: ['تم الصرف', 'grey'] };
    var ledger = (s.earnPeriod === 'month' ? inMonth : completed).map(function (t) {
      var e = tripEarn(s, t), pt = payoutTone[t.payout || 'payable'];
      return { id: t.id, route: t.from + ' ← ' + t.to, date: dateLabel(t.day), seats: String(e.seats), gross: money(e.gross), fee: money(e.fee), net: money(e.net),
        status: pt[0], pillBg: tone(pt[1]).bg, pillDot: tone(pt[1]).dot, open: function () { self.go('tripDetail', { tripId: t.id }); } };
    });
    var payouts = d.payouts.map(function (p) {
      var dd = new Date(p.at);
      return { amount: money(p.amount), ref: p.ref, date: dd.getDate() + ' ' + MONTHS[dd.getMonth()], status: 'تم الصرف', pillBg: tone('grey').bg, pillDot: tone('green').dot };
    });

    // ---------- latest transactions: trip earnings credited + bank transfers, newest first
    var txStatus = { pending: ['معلّق', TONES.amber.dot, TONES.amber.bg], payable: ['مستحق للصرف', TONES.green.dot, TONES.green.bg], paid: ['تم الصرف', TONES.grey.dot, TONES.grey.bg] };
    var txList = (s.earnPeriod === 'month' ? inMonth : completed).map(function (t) {
      var e = tripEarn(s, t), ts = txStatus[t.payout || 'payable'];
      return { at: dayAt(t.day).getTime() + t.dep * 60000, isTrip: true, isPayout: false, iconBg: '#E6FBF0', iconColor: '#03A853',
        title: 'أرباح رحلة ' + t.from + ' ← ' + t.to, sub: dateLabel(t.day) + ' · ' + t.id, amount: '⁦+' + money(e.net) + '⁩', amountColor: '#121212',
        status: ts[0], statusColor: ts[1], statusBg: ts[2], open: function () { self.go('tripDetail', { tripId: t.id }); } };
    }).concat(d.payouts.filter(function (p) { return s.earnPeriod !== 'month' || p.at >= dayAt(monthStart).setHours(0, 0, 0, 0); }).map(function (p) {
      var pd = new Date(p.at);
      return { at: p.at, isTrip: false, isPayout: true, iconBg: '#EBF4FF', iconColor: '#007AFF', title: 'تحويل إلى حسابك البنكي',
        sub: pd.getDate() + ' ' + MONTHS[pd.getMonth()] + ' · ' + p.ref, amount: money(p.amount), amountColor: '#121212', status: 'تم التحويل', statusColor: TONES.blue.dot, statusBg: TONES.blue.bg,
        open: function () { self.flash({}, 'حوالة ' + p.ref + ' بمبلغ ' + money(p.amount)); } };
    })).sort(function (a, b) { return b.at - a.at; }).slice(0, 6);

    // ---------- activation
    var st = s.accStatus;
    var actMap = {
      draft: ['أكمل بياناتك لتفعيل حسابك', 'حسابك غير مفعّل بعد. أكمل الخطوتين ثم أرسل الطلب لمراجعة الإدارة.', 'غير مفعّل', '#EBF4FF', '#007AFF'],
      pending: ['طلبك قيد المراجعة', 'تراجع الإدارة مستنداتك ومركبتك عادة خلال 24 إلى 48 ساعة، وسنرسل لك إشعاراً بالنتيجة.', 'قيد المراجعة', '#FFF7E6', '#D99100'],
      rejected: ['يحتاج طلبك إلى تعديل', 'عدّل البيانات المطلوبة ثم أعد إرسال الطلب.', 'مرفوض', '#FFEDF0', '#BF3B4B'],
      approved: ['تم تفعيل حسابك', 'وافقت الإدارة على مستنداتك ومركبتك.', 'مفعّل', '#E6FBF0', '#03A853'],
      suspended: ['حسابك موقوف', 'لا يمكنك إنشاء رحلات أو استقبال حجوزات حالياً. تتعامل الإدارة مع رحلاتك القادمة المحجوزة. تواصل مع الدعم لمعرفة التفاصيل.', 'موقوف', '#F0F0F0', '#4B4B4B']
    }[st] || [];
    var stepState = function (done, key) {
      var fixedVeh = key === 'vehicle' && st === 'rejected';
      if (fixedVeh && !done) return { Bg: '#FFEDF0', Color: '#BF3B4B', Done: false, Todo: true, State: 'يحتاج تعديل', StateColor: '#BF3B4B' };
      if (fixedVeh && s.vehFixed) return { Bg: '#E6FBF0', Color: '#03A853', Done: true, Todo: false, State: 'تم التعديل', StateColor: '#03A853' };
      return done ? { Bg: '#E6FBF0', Color: '#03A853', Done: true, Todo: false, State: st === 'pending' ? 'قيد المراجعة' : 'مكتمل', StateColor: st === 'pending' ? '#8A5A00' : '#03A853' }
        : { Bg: '#F5F5F5', Color: '#4B4B4B', Done: false, Todo: true, State: 'ابدأ', StateColor: action };
    };
    var act = { isDraft: st === 'draft', isPending: st === 'pending', isRejected: st === 'rejected', isApproved: st === 'approved', isSuspended: st === 'suspended',
      bannerTitle: actMap[0], bannerBody: actMap[1], statusLabel: actMap[2], bannerBg: actMap[3], bannerColor: actMap[4], rejectReason: s.rejectReason,
      showSteps: st === 'draft' || st === 'rejected' || st === 'pending', showFooter: true, locked: st === 'pending' || st === 'suspended' || st === 'approved',
      progressText: ((s.personalDone ? 1 : 0) + (s.vehicleDone ? 1 : 0)) + ' من 2 مكتملة' };
    var ps = stepState(s.personalDone, 'personal'), vs = stepState(s.vehicleDone, 'vehicle');
    Object.keys(ps).forEach(function (k) { act['personal' + k] = ps[k]; act['vehicle' + k] = vs[k]; });
    var ready = s.personalDone && s.vehicleDone;
    Object.assign(act, { canSubmit: st === 'draft' || st === 'rejected', submitLabel: st === 'rejected' ? 'إعادة إرسال الطلب' : 'إرسال طلب التفعيل',
      submitDisabled: !ready, submitBg: ready ? action : C.grey100, submitColor: ready ? C.white : C.placeholder });

    // ---------- activation stepper (personal → vehicle → review)
    var wizIdx = { docsPersonal: 0, docsVehicle: 1, actReview: 2 }[screen];
    var wizOn = s.docsMode !== 'update' && wizIdx !== undefined;
    var wiz = { show: wizOn, showBack: s.docsMode === 'update',
      personalLabel: s.docsMode === 'update' ? 'إرسال التحديث للمراجعة' : 'التالي', vehicleLabel: s.docsMode === 'update' ? 'إرسال التحديث للمراجعة' : 'التالي',
      submitLabel: st === 'rejected' ? 'إعادة إرسال الطلب' : 'إرسال طلب التفعيل',
      steps: ['البيانات الشخصية', 'المركبة', 'المراجعة والإرسال'].map(function (label, i) {
        var done = i < wizIdx, cur = i === wizIdx;
        return { label: label, num: i + 1, done: done, notDone: !done, notFirst: i > 0, ariaCurrent: cur ? 'step' : 'false',
          ring: done || cur ? '0' : '2px solid ' + C.strokeMedium, bg: done ? C.success : cur ? action : C.white, color: done || cur ? C.white : C.secondary,
          line: i <= wizIdx ? (i < wizIdx ? C.success : action) : C.strokeMedium, weight: cur ? 700 : 500, labelColor: cur || done ? C.ink : C.secondary };
      }) };
    var rd = s.docs || blankDocs(), rvh = s.veh || blankVehicle();
    var rvType = VEH_TYPES.filter(function (x) { return x[0] === rvh.type; })[0] || VEH_TYPES[0];
    var rvw = { name: s.driverName, idType: rd.idType === 'iqama' ? 'رقم الإقامة' : 'رقم الهوية', idNumber: rd.idNumber || '—', idExpiry: isoLabel(rd.idExpiry), licExpiry: isoLabel(rd.licExpiry),
      docFiles: [rd.idFile, rd.licFile].filter(Boolean).length + ' من 2', vehicle: (rvh.make + ' ' + rvh.model + ' ' + rvh.year).trim() || '—', vehType: rvType[1], color: rvh.color || '—',
      plate: (rvh.plateLetters + ' ' + rvh.plateNumbers).trim() || '—', seats: seatsWord(rvh.seats), vehFiles: [rvh.istFile, rvh.carFile].filter(Boolean).length + ' من 2' };

    // ---------- documents / vehicle forms
    var dd0 = s.docsDraft || s.docs || blankDocs(), de = s.docsErr || {};
    var idErr = { empty: 'أدخل رقم الهوية أو الإقامة', short: 'الرقم يتكون من 10 أرقام', nationalPrefix: 'رقم الهوية الوطنية يبدأ بـ 1', iqamaPrefix: 'رقم الإقامة يبدأ بـ 2' };
    var dateErr = { empty: 'اختر تاريخ الانتهاء', past: 'المستند منتهي. حدّثه قبل المتابعة' };
    var docs = { idNumber: dd0.idNumber, idExpiry: dd0.idExpiry, licExpiry: dd0.licExpiry, idFile: dd0.idFile, licFile: dd0.licFile,
      isUpdate: s.docsMode === 'update', saveLabel: s.docsMode === 'update' ? 'إرسال التحديث للمراجعة' : 'حفظ',
      idFileMissing: !!de.idFile, licFileMissing: !!de.licFile };
    [['idNumber', idErr], ['idExpiry', dateErr], ['licExpiry', dateErr]].forEach(function (f) {
      docs[f[0] + 'Invalid'] = !!de[f[0]]; docs[f[0] + 'Class'] = de[f[0]] ? 'is-error' : ''; docs[f[0] + 'Err'] = f[1][de[f[0]]] || '';
    });
    var idTypeChips = [['national', 'هوية وطنية'], ['iqama', 'إقامة']].map(function (x) {
      return Object.assign(chipStyle(dd0.idType === x[0], action), { label: x[1], pick: function () { self.setState({ docsDraft: Object.assign(clone(dd0), { idType: x[0] }), docsErr: Object.assign({}, de, { idNumber: '' }) }); } });
    });
    var vd = s.vehDraft || s.veh || blankVehicle(), ve = s.vehErr || {};
    var vtype = VEH_TYPES.filter(function (x) { return x[0] === vd.type; })[0] || VEH_TYPES[0];
    var veh = { make: vd.make, model: vd.model, year: vd.year, color: vd.color, plateLetters: vd.plateLetters, plateNumbers: vd.plateNumbers,
      seats: vd.seats, maxSeats: vtype[2], seatsMin: vd.seats <= 1, seatsMax: vd.seats >= vtype[2], istFile: vd.istFile, carFile: vd.carFile,
      istMissing: !!ve.ist, carMissing: !!ve.car, plateInvalid: !!ve.plate, plateLettersClass: ve.plate ? 'is-error' : '', plateNumbersClass: ve.plate ? 'is-error' : '' };
    var vErr = { make: { empty: 'أدخل الشركة المصنّعة' }, model: { empty: 'أدخل الموديل' }, year: { empty: 'أدخل سنة الصنع', format: 'أدخل السنة بأربعة أرقام', range: 'سنة الصنع من 2010 فأحدث' }, color: { empty: 'أدخل اللون' } };
    Object.keys(vErr).forEach(function (k) { veh[k + 'Invalid'] = !!ve[k]; veh[k + 'Class'] = ve[k] ? 'is-error' : ''; veh[k + 'Err'] = vErr[k][ve[k]] || ''; });
    var vehTypeChips = VEH_TYPES.map(function (x) {
      return Object.assign(chipStyle(vd.type === x[0], action), { label: x[1], pick: function () { self.setState({ vehDraft: Object.assign(clone(vd), { type: x[0], seats: Math.min(vd.seats, x[2]) }) }); } });
    });

    // ---------- create wizard
    var cr = s.cr || newCreate(s), ce = s.crErr || {};
    var route = routeOf(cr.from, cr.to), bounds = route ? priceBounds(route) : [0, 0];
    var crDates = [];
    for (var di = 0; di < MAX_AHEAD_DAYS; di++) {
      (function (off) {
        var dt = dayAt(off);
        crDates.push(Object.assign(chipStyle(cr.day === off, action), { day: off === 0 ? 'اليوم' : off === 1 ? 'غداً' : DAY_SHORT[dt.getDay()], num: dt.getDate(), month: MONTHS[dt.getMonth()],
          pick: function () { self.setCr({ day: off }, { time: '' }); } }));
      })(di);
    }
    var pointsList = function (city, sel, key) {
      return (POINTS[city] || []).map(function (p, i) {
        var on = sel === i;
        return { name: p[0], sub: p[1], checked: on ? 'true' : 'false', border: on ? C.brand : C.stroke, bg: on ? C.soft : C.white, icon: on ? action : C.secondary, ring: on ? C.brand : C.strokeMedium, dot: on ? C.brand : 'transparent',
          pick: function () { var o = {}; o[key] = i; self.setCr(o); } };
      });
    };
    var etaMin = route ? depMinOf(cr.time) + route[3] * 60 : NaN;
    var netSeat = cr.price - Math.round(cr.price * COMMISSION * 100) / 100;
    var routeErr = { missing: 'اختر مدينتي الانطلاق والوصول', same: 'مدينة الوصول يجب أن تختلف عن الانطلاق', disabled: 'هذا المسار غير مفعّل حالياً. اختر مساراً آخر' };
    var timeErr = { empty: 'اختر ساعة الانطلاق', soon: 'موعد الانطلاق يجب أن يكون بعد ساعتين على الأقل من الآن' };
    var pickField = function (city) {
      return { label: city || 'اختر المدينة', Border: C.stroke, Weight: city ? 700 : 400, Color: city ? C.ink : C.placeholder };
    };
    var fl = pickField(cr.from), tl = pickField(cr.to);
    var stepTitles = ['المسار والموعد', 'نقاط التجمع والوصول', 'المقاعد والسعر والأمتعة', 'المراجعة والنشر'];
    var crView = {
      title: cr.editId ? 'تعديل الرحلة' : 'إنشاء رحلة', step1: cr.step === 1, step2: cr.step === 2, step3: cr.step === 3, step4: cr.step === 4,
      progress: { bars: [1, 2, 3, 4].map(function (i) { return { color: i <= cr.step ? action : '#E6E6E6' }; }), text: 'الخطوة ' + cr.step + ' من 4 · ' + stepTitles[cr.step - 1] },
      fromLabel: fl.label, fromLabelBorder: ce.route && !cr.from ? C.error : fl.Border, fromLabelWeight: fl.Weight, fromLabelColor: fl.Color,
      toLabel: tl.label, toLabelBorder: ce.route && ce.route !== 'missing' || (ce.route && !cr.to) ? C.error : tl.Border, toLabelWeight: tl.Weight, toLabelColor: tl.Color,
      routeInvalid: !!ce.route, routeErr: routeErr[ce.route] || '', dates: crDates, time: cr.time, timeInvalid: !!ce.time, timeClass: ce.time ? 'is-error' : '', timeErr: timeErr[ce.time] || '',
      windowHint: 'يمكنك النشر قبل الموعد بساعتين على الأقل، وحتى ' + MAX_AHEAD_DAYS + ' يوماً مقدماً.',
      from: cr.from, to: cr.to, pickups: pointsList(cr.from, cr.pickup, 'pickup'), dropoffs: pointsList(cr.to, cr.dropoff, 'dropoff'),
      etaText: isNaN(etaMin) ? '—' : fmtTime(etaMin) + (etaMin >= 1440 ? ' (اليوم التالي)' : '') + ' · ' + fmtDur(route[3]),
      vehSeats: vehSeats(s), seats: cr.seats, seatsMin: cr.seats <= 1, seatsMax: cr.seats >= vehSeats(s),
      priceText: money(cr.price), priceMin: cr.price <= bounds[0], priceMax: cr.price >= bounds[1],
      priceRange: route ? 'الحد المسموح لهذا المسار ' + bounds[0] + ' – ' + bounds[1] + ' ر.س' : '',
      netHint: 'صافيك عن كل مقعد بعد عمولة المنصة (' + Math.round(COMMISSION * 100) + '%): ' + money(netSeat),
      bags: cr.bags, bagsMin: cr.bags <= 0, bagsMax: cr.bags >= 3, sizeInvalid: !!ce.sizes,
      sizeChips: SIZES.map(function (z) {
        var on = cr.sizes.indexOf(z[0]) !== -1;
        return Object.assign(chipStyle(on, action), { label: z[1], pick: function () { var list = on ? cr.sizes.filter(function (x) { return x !== z[0]; }) : cr.sizes.concat([z[0]]); self.setCr({ sizes: list }, { sizes: false }); } });
      }),
      smokeChips: [[false, 'ممنوع التدخين'], [true, 'مسموح التدخين']].map(function (x) {
        return Object.assign(chipStyle(cr.smoking === x[0], action), { label: x[1], pick: function () { self.setCr({ smoking: x[0] }); } });
      }),
      canBack: cr.step > 1, nextLabel: cr.step < 4 ? 'التالي' : cr.editId ? 'حفظ التعديلات' : 'نشر الرحلة'
    };
    if (route) {
      var gross = cr.seats * cr.price, fee = Math.round(gross * COMMISSION * 100) / 100;
      crView.sum = { dep: fmtTime(depMinOf(cr.time)), arr: fmtTime(etaMin), from: cr.from, to: cr.to, duration: fmtDur(route[3]), date: dateLong(cr.day),
        pickup: (POINTS[cr.from][cr.pickup] || [])[0] + '، ' + (POINTS[cr.from][cr.pickup] || [])[1], dropoff: (POINTS[cr.to][cr.dropoff] || [])[0] + '، ' + (POINTS[cr.to][cr.dropoff] || [])[1],
        seats: seatsWord(cr.seats), price: money(cr.price), bags: bagsWord(cr.bags) + ' للمقعد · ' + SIZES.filter(function (z) { return cr.sizes.indexOf(z[0]) !== -1; }).map(function (z) { return z[1]; }).join('، '),
        smoke: cr.smoking ? 'مسموح التدخين' : 'ممنوع التدخين', vehicle: s.veh ? s.veh.make + ' ' + s.veh.model + ' ' + s.veh.year + ' · ' + s.veh.color : '—',
        gross: money(gross), rate: Math.round(COMMISSION * 100) + '%', fee: money(fee), net: money(gross - fee) };
    } else {
      crView.sum = { dep: '', arr: '', from: '', to: '', duration: '', date: '', pickup: '', dropoff: '', seats: '', price: '', bags: '', smoke: '', vehicle: '', gross: '', rate: '', fee: '', net: '' };
    }
    var cityOptions = (s.cityTarget === 'from' ? CITIES.filter(function (c) { return ROUTES.some(function (r) { return r[0] === c; }); })
      : CITIES.filter(function (c) { return cr.from ? !!routeOf(cr.from, c) : ROUTES.some(function (r) { return r[1] === c; }); })).map(function (c) {
      var r = s.cityTarget === 'to' && cr.from ? routeOf(cr.from, c) : null, on = (s.cityTarget === 'from' ? cr.from : cr.to) === c;
      return { name: c, sub: r ? fmtDur(r[3]) + ' · ' + priceBounds(r)[0] + ' – ' + priceBounds(r)[1] + ' ر.س' : '', hasSub: !!r, check: on,
        pick: function () {
          var patch = {}; patch[s.cityTarget] = c;
          if (s.cityTarget === 'from' && cr.to && !routeOf(c, cr.to)) patch.to = '';
          self.setState({ cr: Object.assign(clone(cr), patch), crErr: Object.assign({}, ce, { route: '' }), sheet: s.cityTarget === 'from' && !(patch.to === undefined ? cr.to : patch.to) ? 'city' : '', cityTarget: s.cityTarget === 'from' ? 'to' : 'to' });
        } };
    });

    // ---------- trip detail
    var td = {}, tdt = tripById(s, s.tripId);
    if (tdt) {
      var tv = tripView(tdt), tbk = tripBookings(s, tdt.id, true), tbkActive = tripBookings(s, tdt.id), tseats = bookedSeats(s, tdt.id);
      var te = tripEarn(s, tdt), r0 = routeOf(tdt.from, tdt.to);
      var bkTone = { confirmed: ['مؤكد', 'blue'], partial: ['إلغاء جزئي', 'amber'], cancelled: ['ملغى', 'red'], completed: ['مكتمل', 'green'] };
      td = Object.assign(tv, {
        id: tdt.id, titleText: tdt.from + ' ← ' + tdt.to, date: dateLong(tdt.day) + ' · ' + fmtTime(tdt.dep), dayText: dateLong(tdt.day),
        isCancelled: tdt.status === 'cancelled', cancelNote: tdt.cancelNote || '', isCompleted: tdt.status === 'completed',
        lockedNote: tdt.status === 'upcoming' && tseats > 0,
        pickup: POINTS[tdt.from][tdt.pickup].join('، '), dropoff: POINTS[tdt.to][tdt.dropoff].join('، '),
        bags: bagsWord(tdt.bags) + ' للمقعد · ' + SIZES.filter(function (z) { return tdt.sizes.indexOf(z[0]) !== -1; }).map(function (z) { return z[1]; }).join('، '),
        smoke: tdt.smoking ? 'مسموح التدخين' : 'ممنوع التدخين', vehicle: s.veh ? s.veh.make + ' ' + s.veh.model + ' · ' + s.veh.plateLetters + ' ' + s.veh.plateNumbers : '—',
        presentText: (te.seats - te.absent) + ' من ' + te.seats + (te.absent ? ' (لم يحضر ' + te.absent + ')' : ''), gross: money(te.gross), fee: money(te.fee), net: money(te.net),
        payout: (payoutTone[tdt.payout || 'payable'] || [''])[0] + (tdt.hold ? ' · ' + tdt.hold : ''),
        bookingCount: tbk.length, seatsSummary: seatsWord(tseats) + ' من ' + tdt.seats, noBookings: tbk.length === 0, noBookingsText: tdt.status === 'upcoming' ? 'لا توجد حجوزات بعد. الحجوزات تتأكد تلقائياً بعد دفع الراكب.' : 'لم تُحجز مقاعد في هذه الرحلة.',
        bookings: tbk.map(function (b) {
          var bt = bkTone[b.status];
          return { initial: initialOf(b.owner), owner: b.owner, ref: b.ref, seats: seatsWord(activePax(b).length), status: bt[0], pillBg: tone(bt[1]).bg, pillDot: tone(bt[1]).dot,
            open: function () { self.go('bookingDetail', { bookingRef: b.ref }); } };
        }),
        canRun: (tdt.status === 'upcoming' && tseats > 0 && tdt.day === 0) || tdt.status === 'current',
        runLabel: tdt.status === 'current' ? 'متابعة التنفيذ' : 'بدء تنفيذ الرحلة',
        canEdit: tdt.status === 'upcoming' && tseats === 0, canCancel: tdt.status === 'upcoming'
      });
      td.hasActions = td.canRun || td.canEdit;
    }

    // ---------- bookings
    var bkTone2 = { confirmed: ['مؤكد', 'blue'], partial: ['إلغاء جزئي', 'amber'], cancelled: ['ملغى', 'red'], completed: ['مكتمل', 'green'] };
    var filterTrips = byTab.current.concat(byTab.upcoming).filter(function (t) { return tripBookings(s, t.id, true).length; });
    var bkFilters = [{ k: 'all', label: 'الكل' }].concat(filterTrips.map(function (t) { return { k: t.id, label: t.from + ' ← ' + t.to + ' · ' + dateLabel(t.day) }; })).map(function (f) {
      return Object.assign(chipStyle(s.bkFilter === f.k, action), { label: f.label, pick: function () { self.setState({ bkFilter: f.k }); } });
    });
    var order = { confirmed: 0, partial: 0, completed: 1, cancelled: 2 };
    var bkCards = d.bookings.filter(function (b) { return s.bkFilter === 'all' || b.tripId === s.bkFilter; }).slice().sort(function (a, b) {
      var ta = tripById(s, a.tripId), tb = tripById(s, b.tripId);
      return order[a.status] - order[b.status] || (order[a.status] ? tb.day - ta.day : ta.day - tb.day) || b.at - a.at;
    }).map(function (b) {
      var t = tripById(s, b.tripId), bt = bkTone2[b.status];
      return { ref: b.ref, initial: initialOf(b.owner), owner: b.owner, route: t.from + ' ← ' + t.to, date: dateLabel(t.day) + ' ' + fmtTime(t.dep), seats: String(activePax(b).length),
        status: bt[0], pillBg: tone(bt[1]).bg, pillDot: tone(bt[1]).dot, open: function () { self.go('bookingDetail', { bookingRef: b.ref }); } };
    });
    var bd = {}, bdb = bookingByRef(s, s.bookingRef);
    if (bdb) {
      var bt0 = tripById(s, bdb.tripId), btone = bkTone2[bdb.status], cancelledSeats = bdb.pax.filter(function (p) { return p.cancelled; }).length;
      var bat = new Date(bdb.at);
      bd = { ref: bdb.ref, status: btone[0], pillBg: tone(btone[1]).bg, pillDot: tone(btone[1]).dot, bookedAt: 'حُجز ' + bat.getDate() + ' ' + MONTHS[bat.getMonth()],
        initial: initialOf(bdb.owner), owner: bdb.owner, seats: seatsWord(activePax(bdb).length), chatOpen: chatIsOpen(bdb) || !!(d.chats[bdb.ref] || []).length,
        openChat: function () { self.openChat(bdb.ref); },
        partial: bdb.status === 'partial' || bdb.status === 'cancelled',
        partialText: bdb.status === 'cancelled' ? (bdb.byDriver ? 'أُلغي الحجز بإلغائك للرحلة واسترد الراكب 100%.' : 'ألغى صاحب الحجز كل المقاعد.') : 'ألغى صاحب الحجز ' + seatsWord(cancelledSeats) + '، وعاد للحجز في رحلتك. باقي الحجز مؤكد وأنت ملزم به.',
        pax: bdb.pax.map(function (p) {
          var at = p.cancelled ? ['ملغى', 'red'] : p.att === 'present' ? ['حضر', 'green'] : p.att === 'absent' ? ['لم يحضر', 'amber'] : null;
          return { initial: initialOf(p.name), name: p.name + (p.name === bdb.owner ? ' (صاحب الحجز)' : ''), phone: displayPhone(p.phone), hasAtt: !!at, att: at ? at[0] : '', attBg: at ? tone(at[1]).bg : '', attDot: at ? tone(at[1]).dot : '' };
        }),
        tripId: bt0.id, route: bt0.from + ' ← ' + bt0.to, when: dateLabel(bt0.day) + ' · ' + fmtTime(bt0.dep), pickup: POINTS[bt0.from][bt0.pickup].join('، '),
        bags: bagsWord(bdb.bags), paid: money(activePax(bdb).length * bt0.price),
        openTrip: function () { self.go('tripDetail', { tripId: bt0.id }); } };
    }

    // ---------- run
    var run = {}, rt = tripById(s, s.tripId);
    if (rt && (screen === 'run' || s.sheet === 'run')) {
      var rpax = this.paxOf(rt.id), stage = Math.min(rt.stage, 4);
      var marked = rpax.filter(function (p) { return p.att; }).length, present = rpax.filter(function (p) { return p.att === 'present'; }).length;
      var ctas = ['أنا في الطريق', 'وصلت لنقطة التجمع', 'بدء الرحلة', 'إنهاء الرحلة'];
      var blocked = stage === 2 && marked < rpax.length;
      run = { id: rt.id, from: rt.from, to: rt.to, date: dateLabel(rt.day) + ' · ' + fmtTime(rt.dep),
        statusLabel: stage === 0 ? 'مؤكدة · لم تبدأ' : STAGES[stage === 3 ? 3 : stage - 1], pillBg: TONES[stage === 0 ? 'blue' : 'orange'].bg, pillColor: TONES[stage === 0 ? 'blue' : 'orange'].dot,
        target: stage >= 3 ? 'الوصول: ' + POINTS[rt.to][rt.dropoff].join('، ') : 'التجمع: ' + POINTS[rt.from][rt.pickup].join('، '),
        steps: STAGES.map(function (label, i) {
          var done = i < stage || (i === 2 && stage >= 3), cur = i === stage && !done;
          var stampIdx = i < 2 ? i : i === 2 ? -1 : i - 1;
          var time = done && stampIdx >= 0 && rt.stamps[stampIdx] ? clockOf(rt.stamps[stampIdx]) : done && i === 2 ? present + ' حضروا من ' + rpax.length : '';
          return { label: label, current: cur ? 'step' : 'false',
            ring: done || cur ? C.brand : C.strokeMedium, fill: done ? C.brand : C.white, ringStyle: cur ? 'dashed' : 'solid',
            hasTime: done && !!time, time: time, hasLine: i < STAGES.length - 1, line: i < stage ? C.brand : C.strokeMedium,
            weight: cur ? 700 : 500, color: done || cur ? C.ink : C.secondary };
        }),
        isAttendance: stage === 2, absentLocked: s.graceLeft > 0, graceText: fmtClock(s.graceLeft),
        attSummary: marked + ' من ' + rpax.length + ' · ' + present + ' حضروا',
        pax: rpax.map(function (p) {
          var pOn = p.att === 'present', aOn = p.att === 'absent';
          return { name: p.name, ref: p.ref, owner: p.owner, callAria: 'اتصال بـ ' + p.name, groupAria: 'حضور ' + p.name,
            presentOn: pOn ? 'true' : 'false', absentOn: aOn ? 'true' : 'false',
            presentBorder: pOn ? C.success : C.stroke, presentBg: pOn ? '#E6FBF0' : C.white, presentColor: pOn ? '#027E3E' : C.ink,
            absentBorder: aOn ? C.errorText : C.stroke, absentBg: aOn ? '#FFEDF0' : C.white, absentColor: aOn ? C.errorText : (s.graceLeft > 0 ? C.placeholder : C.ink),
            present: function () { self.markAtt(p.ref, p.idx, 'present'); }, absent: function () { self.markAtt(p.ref, p.idx, 'absent'); },
            call: function () { self.flash({}, 'فتح الاتصال بـ ' + displayPhone(p.phone)); } };
        }),
        showPaxSummary: stage !== 2, paxText: seatsWord(rpax.length), presentText: stage >= 3 ? String(present) : 'بعد الوصول',
        bagsText: bagsWord(tripBookings(s, rt.id).reduce(function (n, b) { return n + b.bags; }, 0)),
        cta: ctas[Math.min(stage, 3)], ctaDisabled: blocked, ctaBg: blocked ? C.grey100 : action, ctaColor: blocked ? C.placeholder : C.white,
        ctaHintShow: blocked, ctaHint: 'سجّل حضور كل الركاب أولاً (متبقٍ ' + (rpax.length - marked) + ')' };
    }
    var runSheets = [
      ['إبلاغ الركاب أنك في الطريق؟', 'سيصل للركاب إشعار «السائق في الطريق». لا يمكن التراجع عن هذه الخطوة.', 'نعم، أنا في الطريق'],
      ['تأكيد الوصول لنقطة التجمع؟', 'سيصل للركاب إشعار «وصل السائق»، وتبدأ مهلة الانتظار قبل تسجيل الغياب.', 'وصلت'],
      ['بدء الرحلة؟', 'تتحول الرحلة إلى «جارية» ولا يمكن تعديل الحضور بعدها.', 'بدء الرحلة'],
      ['إنهاء الرحلة؟', 'تأكد أنك وصلت ' + (rt ? rt.to : '') + '. تتحول الرحلة إلى «مكتملة» وتُحسب مستحقاتك.', 'إنهاء الرحلة']
    ][rt ? Math.min(rt.stage, 3) : 0];
    var done = {}, dt0 = tripById(s, s.doneTripId);
    if (dt0) {
      var de0 = tripEarn(s, dt0);
      done = { route: dt0.to, seats: seatsWord(de0.seats), absent: String(de0.absent), gross: money(de0.gross), rate: Math.round(COMMISSION * 100) + '%', fee: money(de0.fee), net: money(de0.net), needBank: !bankSet };
    }

    // ---------- chats
    var chatRefs = d.bookings.filter(function (b) { return chatIsOpen(b) || (d.chats[b.ref] || []).length; }).map(function (b) { return b.ref; });
    var lastAt = function (ref) { var m = d.chats[ref] || []; return m.length ? m[m.length - 1].at : bookingByRef(s, ref).at; };
    chatRefs.sort(function (a, b) { return lastAt(b) - lastAt(a); });
    var chatRows = chatRefs.map(function (ref) {
      var b = bookingByRef(s, ref), t = tripById(s, b.tripId), m = d.chats[ref] || [], last = m[m.length - 1], un = d.chatUnread[ref] || 0;
      return { initial: initialOf(b.owner), name: b.owner, route: t.from + ' ← ' + t.to + ' · ' + dateLabel(t.day), time: last ? agoText(last.at) : '',
        timeColor: un ? action : C.secondary, last: last ? (last.from === 'me' ? 'أنت: ' : '') + last.text : 'ابدأ المحادثة مع صاحب الحجز',
        lastColor: un ? C.ink : C.secondary, lastWeight: un ? 700 : 400, hasUnread: un > 0, unread: un, unreadAria: un + ' رسائل غير مقروءة', closed: !chatIsOpen(b),
        open: function () { self.openChat(ref); } };
    });
    var cv = {}, cb = bookingByRef(s, s.chatRef);
    if (cb) {
      var msgs = d.chats[cb.ref] || [], items = [], prevDay = '', ctrip = tripById(s, cb.tripId);
      var lastMine = -1;
      msgs.forEach(function (m, i) { if (m.from === 'me') lastMine = i; });
      msgs.forEach(function (m, i) {
        var off = Math.round((new Date(m.at).setHours(12, 0, 0, 0) - dayAt(0).getTime()) / 86400000), lbl = dateLabel(off);
        if (lbl !== prevDay) { items.push({ isDay: true, isMsg: false, label: lbl }); prevDay = lbl; }
        var mine = m.from === 'me';
        items.push({ isDay: false, isMsg: true, label: '', text: m.text, justify: mine ? 'flex-end' : 'flex-start', radius: mine ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          bg: mine ? action : C.white, border: mine ? action : C.stroke, color: mine ? C.white : C.ink,
          meta: clockOf(m.at) + (mine && i === lastMine ? ' · تم الإرسال' : ''), metaColor: mine ? C.white : C.secondary });
      });
      var copen = chatIsOpen(cb);
      cv = { initial: initialOf(cb.owner), name: cb.owner, ref: cb.ref, route: ctrip.from + ' ← ' + ctrip.to, seats: seatsWord(activePax(cb).length), items: items, open: copen, closed: !copen,
        closedText: cb.status === 'completed' ? 'المحادثة مغلقة لأن الرحلة اكتملت. يمكنك قراءة الرسائل السابقة فقط.' : 'المحادثة مغلقة لأن الحجز أُلغي بالكامل. يمكنك قراءة الرسائل السابقة فقط.' };
    }
    var quickReplies = ['أنا في الطريق', 'وصلت نقطة التجمع', 'سأتأخر 5 دقائق', 'هل معكم أمتعة إضافية؟'].map(function (q) { return { label: q, pick: function () { self.sendMessage(q); } }; });
    var draftOk = !!s.chatDraft.trim();

    // ---------- notifications
    var notifRows = d.notifs.slice().sort(function (a, b) { return b.at - a.at; }).map(function (n) {
      var iconTone = { booking: 'blue', cancel: 'red', chat: 'blue', rating: 'amber', money: 'green', trip: 'blue', account: 'green', admin: 'grey' }[n.kind];
      var row = { title: n.title, body: n.body, time: agoText(n.at), unread: !n.read, weight: n.read ? 500 : 700, bg: n.read ? C.white : '#F7FAFF',
        iconBg: tone(iconTone).bg, iconColor: tone(iconTone).dot, open: function () { self.openNotif(n); } };
      ['Booking', 'Cancel', 'Chat', 'Rating', 'Money', 'Trip', 'Account', 'Admin'].forEach(function (k) { row['k' + k] = n.kind === k.toLowerCase(); });
      return row;
    });

    // ---------- ratings
    var revs = d.reviews.slice().sort(function (a, b) { return b.at - a.at; });
    var baseCount = s.fresh ? 0 : 212;
    var rtv = { avg: s.fresh ? '—' : '4.9', count: s.fresh ? 'لا توجد تقييمات بعد' : baseCount + ' تقييماً',
      dist: [[5, 86], [4, 10], [3, 2], [2, 1], [1, 1]].map(function (x) { return { n: x[0], w: (s.fresh ? 0 : x[1]) + '%' }; }),
      items: revs.map(function (r, i) {
        var dd2 = new Date(r.at), rep = !!s.ratingReported[r.trip + r.name];
        return { name: r.name, stars: r.stars, comment: r.comment, hasComment: !!r.comment, date: dd2.getDate() + ' ' + MONTHS[dd2.getMonth()],
          trip: (function () { var t = tripById(s, r.trip); return t ? t.from + ' ← ' + t.to + ' · ' + r.trip : r.trip; })(),
          canReport: !rep, reported: rep, report: function () { self.setState({ sheet: 'report', reportIdx: i, reportReason: '' }); } };
      }) };

    // ---------- account
    var acctTone = { approved: ['مفعّل', 'green'], pending: ['قيد المراجعة', 'amber'], rejected: ['مرفوض', 'red'], draft: ['غير مفعّل', 'grey'], suspended: ['موقوف', 'grey'] }[st] || ['', 'grey'];
    var dc = s.docs || blankDocs(), lic = daysUntil(dc.licExpiry), idd = daysUntil(dc.idExpiry);
    var expiring = (lic !== null && lic <= EXPIRY_WARN_DAYS) || (idd !== null && idd <= EXPIRY_WARN_DAYS);
    var docBadge = function (days, pending) {
      if (pending) return ['قيد المراجعة', 'amber', '#5D5D5D'];
      if (days !== null && days < 0) return ['منتهية', 'red', C.errorText];
      if (days !== null && days <= EXPIRY_WARN_DAYS) return ['تنتهي قريباً', 'amber', '#8A5A00'];
      return ['معتمدة', 'green', '#5D5D5D'];
    };
    var idB = docBadge(idd, s.docsPending), licB = docBadge(lic, s.docsPending);
    var acc = { initial: initialOf(s.driverName), name: s.driverName, phone: s.phone ? displayPhone(s.phone) : '', status: acctTone[0], statusBg: tone(acctTone[1]).bg, statusDot: tone(acctTone[1]).dot,
      statusSub: st === 'approved' ? 'يمكنك نشر الرحلات واستقبال الحجوزات' : '', rating: s.fresh ? 'جديد' : '4.9',
      docsSub: 'الهوية والرخصة وتواريخ انتهائها', docsHas: s.docsPending || expiring, docsLabel: s.docsPending ? 'قيد المراجعة' : 'تنتهي قريباً', docsBg: tone('amber').bg, docsDot: tone('amber').dot,
      vehSub: s.veh ? s.veh.make + ' ' + s.veh.model + ' ' + s.veh.year + ' · ' + s.veh.plateLetters + ' ' + s.veh.plateNumbers : '', vehHas: s.vehPending, vehLabel: 'قيد المراجعة', vehBg: tone('amber').bg, vehDot: tone('amber').dot,
      bankSub: bankSet ? (BANKS[s.bank.iban.slice(2, 4)] || '') + ' · ••••' + s.bank.iban.slice(-4) : 'مطلوبة قبل أول صرف', ratingSub: s.fresh ? 'لا توجد تقييمات بعد' : '4.9 من 5 · 212 تقييماً' };
    var dv = { docsPending: s.docsPending, vehPending: s.vehPending, expiring: expiring && !s.docsPending,
      expiringText: lic !== null && lic <= EXPIRY_WARN_DAYS ? 'رخصة القيادة تنتهي خلال ' + lic + ' يوماً. حدّثها قبل انتهائها حتى لا يتوقف نشر رحلاتك.' : 'الهوية تنتهي خلال ' + idd + ' يوماً. حدّثها قبل انتهائها.',
      idType: dc.idType === 'iqama' ? 'الإقامة' : 'الهوية الوطنية', idNumber: dc.idNumber ? dc.idNumber.slice(0, 2) + '••••••' + dc.idNumber.slice(-2) : '—', idExpiry: isoLabel(dc.idExpiry), licExpiry: isoLabel(dc.licExpiry),
      idLabel: idB[0], idBg: tone(idB[1]).bg, idDot: tone(idB[1]).dot, idSubColor: idB[2], licLabel: licB[0], licBg: tone(licB[1]).bg, licDot: tone(licB[1]).dot, licSubColor: licB[2] };
    var vv0 = s.veh || blankVehicle(), vvType = VEH_TYPES.filter(function (x) { return x[0] === vv0.type; })[0] || VEH_TYPES[0];
    var vv = { title: vv0.make + ' ' + vv0.model + ' ' + vv0.year, type: vvType[1], color: vv0.color, plate: vv0.plateLetters + ' ' + vv0.plateNumbers, seats: seatsWord(vv0.seats) + ' للركاب', ist: 'مرفوعة · معتمدة',
      label: s.vehPending ? 'تحديث قيد المراجعة' : 'معتمدة', bg: tone(s.vehPending ? 'amber' : 'green').bg, dot: tone(s.vehPending ? 'amber' : 'green').dot };
    var bkD = s.bankDraft || s.bank || { holder: '', iban: '' }, be = s.bankErr || {};
    var bankV = { holder: bkD.holder, iban: bkD.iban, holderInvalid: !!be.holder, holderClass: be.holder ? 'is-error' : '', holderErr: { empty: 'أدخل اسم صاحب الحساب', short: 'أدخل الاسم الكامل كما في البنك' }[be.holder] || '',
      ibanInvalid: !!be.iban, ibanClass: be.iban ? 'is-error' : '', ibanErr: { empty: 'أدخل رقم الآيبان', length: 'الآيبان السعودي SA متبوعاً بـ 22 رقماً (أدخلت ' + (bkD.iban || '').length + ')', bank: 'رمز البنك غير معروف. تحقق من الرقم' }[be.iban] || '',
      bankName: bkD.iban && bkD.iban.length >= 4 && BANKS[bkD.iban.slice(2, 4)] ? 'البنك: ' + BANKS[bkD.iban.slice(2, 4)] : 'يظهر اسم البنك تلقائياً من الرقم', saveLabel: bankSet ? 'حفظ التعديلات' : 'حفظ' };
    var pfChanged = s.pfName.trim() && s.pfName.trim() !== s.driverName;
    var cpErrors = { empty: 'أدخل رقم الجوال الجديد', invalid: 'أدخل رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام', same: 'هذا رقمك الحالي', taken: 'هذا الرقم مسجل بحساب سائق آخر' };

    // ---------- support
    var ticketRows = d.tickets.map(function (t) {
      var ts = TICKET_STATUS[t.status], dt = new Date(t.at);
      return { subject: t.subject, ref: t.ref, date: dt.getDate() + ' ' + MONTHS[dt.getMonth()], status: ts[0], bg: tone(ts[1]).bg, dot: tone(ts[1]).dot, open: function () { self.go('ticket', { ticketId: t.ref }); } };
    });
    var tn = s.tn || { type: '', link: '', desc: '', files: [] }, tne = s.tnErr || {};
    var linkOptions = byTab.completed.slice(0, 3).concat(byTab.upcoming.slice(0, 1)).map(function (t) { return [t.id, t.from + ' ← ' + t.to + ' · ' + t.id]; });
    var tkTypes = TICKET_TYPES.map(function (x) { return Object.assign(chipStyle(tn.type === x[0], action), { label: x[1], pick: function () { self.setState({ tn: Object.assign(clone(tn), { type: x[0] }), tnErr: Object.assign({}, tne, { type: false }) }); } }); });
    var tkLinks = linkOptions.map(function (x) { return Object.assign(chipStyle(tn.link === x[0], action), { label: x[1], pick: function () { self.setState({ tn: Object.assign(clone(tn), { link: tn.link === x[0] ? '' : x[0] }) }); } }); });
    var tnView = { typeErr: !!tne.type, desc: tn.desc, descInvalid: !!tne.desc, descClass: tne.desc ? 'is-error' : '', canAdd: tn.files.length < 3, submitLabel: s.loading ? 'جارٍ الإرسال…' : 'إرسال التذكرة',
      files: tn.files.map(function (f, i) { return { name: f, remove: function () { self.setState({ tn: Object.assign(clone(tn), { files: tn.files.filter(function (_, j) { return j !== i; }) }) }); } }; }) };
    var tvt = d.tickets.filter(function (t) { return t.ref === s.ticketId; })[0], tvv = {};
    if (tvt) {
      var tst = TICKET_STATUS[tvt.status], tdd = new Date(tvt.at), lt = tripById(s, tvt.link);
      tvv = { subject: tvt.subject, ref: tvt.ref, status: tst[0], bg: tone(tst[1]).bg, dot: tone(tst[1]).dot, type: (TICKET_TYPES.filter(function (x) { return x[0] === tvt.type; })[0] || ['', ''])[1],
        link: lt ? lt.from + ' ← ' + lt.to + ' · ' + lt.id : 'لا يوجد', date: tdd.getDate() + ' ' + MONTHS[tdd.getMonth()],
        msgs: tvt.msgs.concat(tvt.status === 'new' ? [{ from: 'support', text: 'استلمنا تذكرتك وسنرد عليك خلال 48 ساعة.', at: tvt.at }] : []).map(function (m) {
          return { from: m.from === 'me' ? 'أنت' : 'فريق الدعم', bg: m.from === 'me' ? '#EBF4FF' : C.white, time: agoText(m.at), text: m.text + (m.from === 'me' && tvt.files && tvt.files.length ? ' (' + tvt.files.length + ' مرفقات)' : '') };
        }) };
    }

    // ---------- settings
    var np = {};
    ['bookings', 'chat', 'money', 'admin'].forEach(function (k) { var on = !!s.prefs[k]; np[k + 'Checked'] = on ? 'true' : 'false'; np[k + 'Bg'] = on ? C.success : '#E6E6E6'; np[k + 'Knob'] = on ? '-20px' : '0'; });
    var langChips = [['ar', 'العربية'], ['en', 'English']].map(function (x) { return Object.assign(chipStyle(s.lang === x[0], action), { label: x[1], pick: function () { if (x[0] === 'en') self.flash({}, 'الواجهة الإنجليزية خارج نطاق هذا النموذج'); else self.setState({ lang: 'ar' }); } }); });
    var stc = STATIC[s.staticKind] || STATIC.terms;

    // ---------- nav + chrome
    var NAV = { home: 'home', trips: 'trips', earnings: 'earnings', account: 'account' };
    var navOn = !!NAV[screen];
    var nav = {};
    ['home', 'trips', 'earnings', 'account'].forEach(function (k) {
      var on = screen === k;
      nav[k + 'Icon'] = on ? action : '#4B4B4B'; nav[k + 'Bg'] = on ? '#EDEDED' : 'transparent'; nav[k + 'Weight'] = on ? 700 : 500;
      nav[k + 'On'] = on; nav[k + 'Off'] = !on; nav[k + 'Current'] = on ? 'page' : 'false';
    });
    var GREY = { home: 1, trips: 1, tripDetail: 1, create: 1, published: 1, bookings: 1, bookingDetail: 1, run: 1, runDone: 1, chats: 1, earnings: 1, ratings: 1, notifications: 1, account: 1, activation: 1, actReview: 1, docsPersonal: 1, docsVehicle: 1, docsView: 1, vehicleView: 1, bank: 1, support: 1, ticketNew: 1, ticket: 1, settings: 1 };
    var blue = screen === 'splash';
    var otpBoxes = [0, 1, 2, 3].map(function (idx) {
      var ch = s.otp.charAt(idx), active = s.otpFocused && !locked && idx === Math.min(s.otp.length, 3), err = s.otpError === 'wrong' || s.otpError === 'expired';
      return { char: ch, bg: locked ? C.grey100 : C.white, border: err ? C.error : (active ? C.brand : (ch ? C.strokeMedium : C.stroke)), shadow: active ? '0 0 0 1px ' + C.brand : 'none' };
    });
    var otpReady = s.otp.length === 4 && !s.loading;
    var su = s.suNameErr;

    return {
      c: { action: action },
      appClass: navOn ? 'with-nav' : '',
      pageBg: blue ? '#121212' : GREY[screen] ? C.bgSecondary : C.white,
      statusBg: blue ? '#121212' : GREY[screen] && !{ tripDetail: 1, create: 1, run: 1, bookingDetail: 1 }[screen] ? C.bgSecondary : C.white,
      statusFg: blue ? '#FFFFFF' : '#000000',
      isSplash: screen === 'splash', isPhone: screen === 'phone', isOtp: screen === 'otp', isSignup: screen === 'signup',
      isActivation: screen === 'activation', isDocsPersonal: screen === 'docsPersonal', isDocsVehicle: screen === 'docsVehicle', isActReview: screen === 'actReview',
      isHome: screen === 'home', isCreate: screen === 'create', isPublished: screen === 'published', isTrips: screen === 'trips', isTripDetail: screen === 'tripDetail' && !!tdt,
      isBookings: screen === 'bookings', isBookingDetail: screen === 'bookingDetail' && !!bdb, isRun: screen === 'run' && !!rt, isRunDone: screen === 'runDone' && !!dt0,
      isChats: screen === 'chats', isChat: screen === 'chat' && !!cb, isEarnings: screen === 'earnings', isRatings: screen === 'ratings', isNotifs: screen === 'notifications',
      isAccount: screen === 'account', isProfile: screen === 'profile', isChangePhone: screen === 'changePhone', isDocsView: screen === 'docsView', isVehicleView: screen === 'vehicleView',
      isBank: screen === 'bank', isSupport: screen === 'support', isTicketNew: screen === 'ticketNew', isTicket: screen === 'ticket' && !!tvt, isSettings: screen === 'settings', isStatic: screen === 'static',

      // phone + otp (customer blocks)
      phone: s.phone, phoneInvalid: !!s.phoneError, phoneValidUi: !s.phoneError, phoneFieldClass: s.phoneError ? 'is-error' : '',
      phoneErrorText: s.phoneError === 'empty' ? 'أدخل رقم جوالك' : 'أدخل رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام',
      phoneSubmitDisabled: s.loading, phoneBtnLabel: s.loading ? 'جارٍ إرسال الرمز…' : 'إرسال رمز التحقق', loading: s.loading,
      otp: s.otp, otpBoxes: otpBoxes, isLocked: locked, notLocked: !locked, otpInvalid: s.otpError === 'wrong' || s.otpError === 'expired',
      otpErrorText: s.otpError === 'expired' ? 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.' : 'الرمز غير صحيح. ' + remainingText(MAX_ATTEMPTS - s.attempts),
      otpInputDisabled: locked || s.loading, showTimer: !locked && s.seconds > 0, canResend: !locked && s.seconds === 0, timerText: fmtClock(s.seconds),
      otpSubmitDisabled: !otpReady, otpBtnBg: s.loading || otpReady ? action : C.grey100, otpBtnColor: s.loading || otpReady ? C.white : C.placeholder,
      otpBtnLabel: s.loading ? 'جارٍ التحقق…' : 'تحقق', otpTitle: s.otpPurpose === 'changePhone' ? 'تأكيد رقمك الجديد' : 'أدخل رمز التحقق',
      otpPhoneDisplay: displayPhone(s.otpPurpose === 'changePhone' ? s.pendingPhone : s.phone),

      // signup + activation
      suName: s.suName, suNameInvalid: !!su, suNameClass: su ? 'is-error' : '', suNameErr: su === 'empty' ? 'أدخل اسمك الكامل' : 'أدخل اسمك كما في الهوية (الاسم الأول واسم العائلة على الأقل)',
      suAgree: s.suAgree, suAgreeErr: !!s.suAgreeErr, act: act, wiz: wiz, rv: rvw,
      docs: docs, idTypeChips: idTypeChips, upId: !!dd0.idFile, not_upId: !dd0.idFile, upLic: !!dd0.licFile, not_upLic: !dd0.licFile,
      veh: veh, vehTypeChips: vehTypeChips, upIst: !!vd.istFile, not_upIst: !vd.istFile, upCar: !!vd.carFile, not_upCar: !vd.carFile,

      // home / trips / create
      home: { hello: 'مرحباً ' + s.driverName.split(' ')[0], upcoming: byTab.upcoming.length, current: byTab.current.length, done: byTab.completed.length,
        upcomingOpen: function () { self.go('trips', { tripsTab: 'upcoming' }); }, currentOpen: function () { self.go('trips', { tripsTab: 'current' }); }, doneOpen: function () { self.go('trips', { tripsTab: 'completed' }); },
        wallet: money(earnOf(inMonth).net).replace(' ر.س', ''), walletAria: 'صافي أرباح آخر 30 يوماً ' + money(earnOf(inMonth).net) + '، افتح الأرباح', bellAria: 'الإشعارات' + (unreadNotifs ? '، ' + unreadNotifs + ' غير مقروءة' : ''),
        hasNext: !!nextTrip, noNext: !nextTrip, nextTitle: nextTrip && nextTrip.status === 'current' ? 'رحلتك الجارية' : 'رحلتك القادمة', next: homeNext,
        bookingsText: activeBookings.length ? activeBookings.length + ' حجوزات مؤكدة · ' + seatsWord(activeSeats) : 'لا توجد حجوزات مؤكدة',
        bookingsSub: activeBookings.length ? 'على ' + filterTrips.length + ' رحلات قادمة' : 'تظهر هنا بعد دفع الركاب' },
      hasUnreadChats: unreadChats > 0, unreadChats: unreadChats, hasUnreadNotifs: unreadNotifs > 0, unreadNotifs: unreadNotifs,
      earn: earn, cr: crView, cityOptions: cityOptions, citySheetTitle: s.cityTarget === 'from' ? 'مدينة الانطلاق' : 'مدينة الوصول' + (cr.from ? ' من ' + cr.from : ''),
      pub: (function () { var t = tripById(s, s.pubId); if (!t) return {}; var r = routeOf(t.from, t.to);
        return { title: 'نُشرت رحلتك', body: 'تظهر الآن للركاب في نتائج البحث. سنرسل لك إشعاراً مع كل حجز مؤكد.', id: t.id, route: t.from + ' ← ' + t.to, when: dateLabel(t.day) + ' · ' + fmtTime(t.dep), seats: seatsWord(t.seats) + ' · ' + money(t.price) }; })(),
      tripTabs: tripTabs, tripCards: tripCards, tripsHasItems: tripCards.length > 0, tripsEmpty: tripCards.length === 0, tripsEmptyTitle: emptyCopy[0], tripsEmptyBody: emptyCopy[1],
      td: td,

      // bookings / run / chat
      bkFilters: bkFilters, bkCards: bkCards, bkHasItems: bkCards.length > 0, bkEmpty: bkCards.length === 0, bd: bd,
      run: run, done: done, runSheet: { title: runSheets[0], body: runSheets[1], cta: runSheets[2] },
      chatRows: chatRows, chatsHasItems: chatRows.length > 0, chatsEmpty: chatRows.length === 0, cv: cv, quickReplies: quickReplies,
      chatDraft: s.chatDraft, sendDisabled: !draftOk, sendBg: draftOk ? action : C.grey100, sendColor: draftOk ? C.white : C.placeholder, typingNow: !!s.typing,

      // money / ratings / notifs
      earnPeriods: [['month', 'آخر 30 يوماً'], ['all', 'الكل']].map(function (x) { var on = s.earnPeriod === x[0]; return { label: x[1], pressed: on ? 'true' : 'false', bg: on ? '#FFFFFF' : 'transparent', color: on ? '#121212' : '#5D5D5D', shadow: on ? '0 1px 3px rgba(18, 18, 18, 0.12)' : 'none', pick: function () { self.setState({ earnPeriod: x[0] }); } }; }),
      earnTabs: [['ledger', 'سجل الرحلات'], ['payouts', 'عمليات الصرف']].map(function (x) { var on = s.earnTab === x[0]; return { label: x[1], pressed: on ? 'true' : 'false', bg: on ? '#FFFFFF' : 'transparent', color: on ? '#121212' : '#5D5D5D', shadow: on ? '0 1px 3px rgba(18, 18, 18, 0.12)' : 'none', pick: function () { self.setState({ earnTab: x[0] }); } }; }),
      txns: txList, txHasItems: txList.length > 0, txEmpty: txList.length === 0,
      rt: rtv, reportReasons: REPORT_REASONS.map(function (x) { return Object.assign(chipStyle(s.reportReason === x[0], action), { label: x[1], pick: function () { self.setState({ reportReason: x[0] }); } }); }),
      reportDisabled: !s.reportReason, reportBg: s.reportReason ? C.errorText : C.grey100, reportColor: s.reportReason ? C.white : C.placeholder,
      notifRows: notifRows, notifsHasItems: notifRows.length > 0, notifsEmpty: notifRows.length === 0,

      // account
      acc: acc, dv: dv, vv: vv, bk: bankV,
      pfName: s.pfName, pfNameInvalid: !!s.pfErr, pfNameClass: s.pfErr ? 'is-error' : '', pfNameErr: 'أدخل اسمك الكامل (الاسم الأول واسم العائلة)',
      pfSaveDisabled: !pfChanged, pfSaveBg: pfChanged ? action : C.grey100, pfSaveColor: pfChanged ? C.white : C.placeholder,
      pendingPhone: s.pendingPhone, newPhoneInvalid: !!s.cpError, newPhoneClass: s.cpError ? 'is-error' : '', newPhoneErrText: cpErrors[s.cpError] || '',
      hasTickets: ticketRows.length > 0, noTickets: ticketRows.length === 0, ticketRows: ticketRows, tkTypes: tkTypes, tkLinks: tkLinks, tn: tnView, tv: tvv,
      np: np, langChips: langChips, st: { title: stc.title, sections: stc.sections.map(function (x) { return { h: x[0], p: x[1] }; }), updated: '1 أكتوبر 2026' },

      // chrome
      showNav: navOn, nav: nav, hasToast: !!s.toast, toast: s.toast,
      showSheet: !!s.sheet, isCitySheet: s.sheet === 'city', isCancelTripSheet: s.sheet === 'cancelTrip' && !!tdt, isRunSheet: s.sheet === 'run' && !!rt,
      isReportSheet: s.sheet === 'report', isLogoutSheet: s.sheet === 'logout',
      cancelSheet: { title: tdt && bookedSeats(s, tdt.id) ? 'إلغاء رحلة عليها حجوزات؟' : 'إلغاء الرحلة؟',
        body: tdt && bookedSeats(s, tdt.id) ? 'عليها حجوزات مؤكدة، لذلك لا يمكن تعديلها وأنت ملزم بتنفيذها. لو ألغيتها ستُلغى كل الحجوزات (' + tripBookings(s, tdt.id).length + ') ويُسترد للركاب 100%، ولا أرباح لك عنها، وتُسجَّل الواقعة لدى الإدارة.' : 'لا توجد حجوزات عليها، فستُحذف من نتائج البحث فوراً.' },

      // ---------- handlers
      closeSheet: function () { self.setState({ sheet: '' }); },
      onPhone: function (e) { self.setState({ phone: toWesternDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 12), phoneError: '' }); },
      submitPhone: function (e) { if (e && e.preventDefault) e.preventDefault(); self.submitPhone(); },
      onOtp: function (e) {
        if (self.state.otpError === 'locked') return;
        var v = toWesternDigits(e.target.value).replace(/\D/g, '').slice(0, 4);
        self.setState({ otp: v, otpError: v ? '' : self.state.otpError });
        if (v.length === 4) self.verify(v);
      },
      otpFocus: function () { self.setState({ otpFocused: true }); },
      otpBlur: function () { self.setState({ otpFocused: false }); },
      submitOtp: function (e) { if (e && e.preventDefault) e.preventDefault(); if (self.state.otp.length === 4) self.verify(self.state.otp); },
      resend: function () { if (self.state.seconds > 0 || self.state.otpError === 'locked') return; self.flash({ seconds: RESEND_SECONDS, otp: '', otpError: '' }, 'أرسلنا رمزاً جديداً إلى جوالك'); },
      editNumber: function () { if (s.loading) return; self.setState({ screen: s.otpPurpose === 'changePhone' ? 'changePhone' : 'phone', otp: '', otpError: '' }); },
      useOtherNumber: function () {
        if (s.otpPurpose === 'changePhone') { self.setState({ screen: 'changePhone', pendingPhone: '', otp: '', otpError: '', attempts: 0 }); return; }
        self.setState({ screen: 'phone', phone: '', otp: '', otpError: '', attempts: 0 });
      },
      // Demo helpers for the sign-up steps (new-driver number, OTP 1234, sample documents and vehicle)
      simPhone: function () { if (!s.loading) self.setState({ phone: '0551234567', phoneError: '' }); },
      simOtp: function () { if (s.otpError === 'locked' || s.loading) return; self.setState({ otp: '1234', otpError: '' }); self.verify('1234'); },
      simSignup: function () { self.setState({ suName: 'محمد سعد الشهري', suNameErr: '', suAgree: true, suAgreeErr: false }); },
      simPersonal: function () { self.setState({ docsDraft: { idType: 'national', idNumber: '1098765432', idExpiry: isoDay(870), licExpiry: isoDay(1200), idFile: 'national-id.jpg', licFile: 'driving-licence.jpg' }, docsErr: {} }); },
      simVehicle: function () { self.setState({ vehDraft: approvedVehicle(), vehErr: {} }); },
      onSuName: function (e) { self.setState({ suName: e.target.value, suNameErr: '' }); },
      toggleSuAgree: function () { self.setState({ suAgree: !self.state.suAgree, suAgreeErr: false }); },
      openTermsSignup: function () { self.go('static', { staticKind: 'terms' }); },
      openPrivacySignup: function () { self.go('static', { staticKind: 'privacy' }); },
      submitSignup: function () { self.submitSignup(); },
      signupBack: function () { self.setState({ screen: 'phone', phone: '' }); },
      openDocsPersonal: function () { if (!act.locked) self.openDocs('activation'); },
      openDocsVehicle: function () { if (!act.locked) self.openVehicle('activation'); },
      submitActivation: function () { self.submitActivation(); },
      simApprove: function () {
        var dd = clone(self.state.data); self.addNotif(dd, 'account', '', 'تم تفعيل حسابك', 'وافقت الإدارة على مستنداتك ومركبتك. يمكنك نشر رحلتك الأولى الآن');
        self.flash({ accStatus: 'approved', data: dd }, 'وصلك إشعار: تم تفعيل حسابك');
      },
      simReject: function () { self.flash({ accStatus: 'rejected', vehicleDone: false, vehFixed: false, rejectReason: 'صورة الاستمارة غير واضحة، وتاريخ انتهائها غير مقروء. أعد رفعها بصورة أوضح.' }, 'وصلك إشعار: يحتاج طلبك إلى تعديل'); },
      goHomeFromActivation: function () { self.setState({ screen: 'home', prev: {} }); },
      openSupportFromActivation: function () { self.go('support'); },
      docsBack: function () {
        if (s.docsMode === 'update') { self.back('account'); return; }
        if (screen === 'docsVehicle') self.setState({ screen: 'docsPersonal', docsDraft: clone(s.docs || blankDocs()), docsErr: {} });
      },
      reviewBack: function () { self.setState({ screen: 'docsVehicle', vehDraft: clone(s.veh || blankVehicle()), vehErr: {} }); },
      reviewEditPersonal: function () { self.setState({ screen: 'docsPersonal', docsDraft: clone(s.docs || blankDocs()), docsErr: {} }); },
      reviewEditVehicle: function () { self.setState({ screen: 'docsVehicle', vehDraft: clone(s.veh || blankVehicle()), vehErr: {} }); },
      editRejected: function () { self.setState({ screen: 'docsVehicle', docsMode: 'activation', vehDraft: clone(s.veh || blankVehicle()), vehErr: {}, sheet: '' }); },
      onIdNumber: function (e) { self.setState({ docsDraft: Object.assign(clone(dd0), { idNumber: toWesternDigits(e.target.value).replace(/\D/g, '').slice(0, 10) }), docsErr: Object.assign({}, de, { idNumber: '' }) }); },
      onIdExpiry: function (e) { self.setState({ docsDraft: Object.assign(clone(dd0), { idExpiry: e.target.value }), docsErr: Object.assign({}, de, { idExpiry: '' }) }); },
      onLicExpiry: function (e) { self.setState({ docsDraft: Object.assign(clone(dd0), { licExpiry: e.target.value }), docsErr: Object.assign({}, de, { licExpiry: '' }) }); },
      uploadId: function () { self.setState({ docsDraft: Object.assign(clone(dd0), { idFile: dd0.idFile ? 'national-id-2.jpg' : 'national-id.jpg' }), docsErr: Object.assign({}, de, { idFile: false }) }); },
      uploadLic: function () { self.setState({ docsDraft: Object.assign(clone(dd0), { licFile: dd0.licFile ? 'driving-licence-2.jpg' : 'driving-licence.jpg' }), docsErr: Object.assign({}, de, { licFile: false }) }); },
      savePersonal: function () { self.savePersonal(); },
      onVehMake: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { make: e.target.value }), vehErr: Object.assign({}, ve, { make: '' }) }); },
      onVehModel: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { model: e.target.value }), vehErr: Object.assign({}, ve, { model: '' }) }); },
      onVehYear: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { year: toWesternDigits(e.target.value).replace(/\D/g, '').slice(0, 4) }), vehErr: Object.assign({}, ve, { year: '' }) }); },
      onVehColor: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { color: e.target.value }), vehErr: Object.assign({}, ve, { color: '' }) }); },
      onPlateLetters: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { plateLetters: e.target.value.slice(0, 5) }), vehErr: Object.assign({}, ve, { plate: false }) }); },
      onPlateNumbers: function (e) { self.setState({ vehDraft: Object.assign(clone(vd), { plateNumbers: toWesternDigits(e.target.value).replace(/\D/g, '').slice(0, 4) }), vehErr: Object.assign({}, ve, { plate: false }) }); },
      vehSeatsDown: function () { if (vd.seats > 1) self.setState({ vehDraft: Object.assign(clone(vd), { seats: vd.seats - 1 }) }); },
      vehSeatsUp: function () { if (vd.seats < vtype[2]) self.setState({ vehDraft: Object.assign(clone(vd), { seats: vd.seats + 1 }) }); },
      uploadIst: function () { self.setState({ vehDraft: Object.assign(clone(vd), { istFile: vd.istFile ? 'istimara-2.jpg' : 'istimara.jpg' }), vehErr: Object.assign({}, ve, { ist: false }) }); },
      uploadCar: function () { self.setState({ vehDraft: Object.assign(clone(vd), { carFile: vd.carFile ? 'car-photos-2.jpg' : 'car-photos.jpg' }), vehErr: Object.assign({}, ve, { car: false }) }); },
      saveVehicle: function () { self.saveVehicle(); },
      askLogout: function () { self.setState({ sheet: 'logout' }); },
      confirmLogout: function () {
        self.flash(Object.assign(clone(BASE_STATE), { screen: 'phone', phone: '' }), 'تم تسجيل الخروج');
      },

      tabHome: function () { self.setState({ screen: 'home', sheet: '', prev: {} }); },
      tabTrips: function () { self.setState({ screen: 'trips', sheet: '', prev: {} }); },
      tabEarnings: function () { self.setState({ screen: 'earnings', sheet: '', prev: {} }); },
      tabAccount: function () { self.setState({ screen: 'account', sheet: '', prev: {} }); },
      goHome: function () { self.setState({ screen: 'home', sheet: '', prev: {} }); },
      openChats: function () { self.go('chats'); },
      openNotifs: function () { self.go('notifications'); },
      openBookings: function () { self.go('bookings', { bkFilter: 'all' }); },
      openCreate: function () { self.go('create', { cr: newCreate(self.state), crErr: {} }); },
      createBack: function () { self.createBack(); },
      createNext: function () { self.createNext(); },
      pickFrom: function () { self.setState({ sheet: 'city', cityTarget: 'from' }); },
      pickTo: function () { self.setState({ sheet: 'city', cityTarget: 'to' }); },
      onCrTime: function (e) { self.setCr({ time: e.target.value }, { time: '' }); },
      crSeatsDown: function () { if (cr.seats > 1) self.setCr({ seats: cr.seats - 1 }); },
      crSeatsUp: function () { if (cr.seats < vehSeats(s)) self.setCr({ seats: cr.seats + 1 }); },
      crPriceDown: function () { if (cr.price > bounds[0]) self.setCr({ price: Math.max(bounds[0], cr.price - 5) }, { price: false }); },
      crPriceUp: function () { if (cr.price < bounds[1]) self.setCr({ price: Math.min(bounds[1], cr.price + 5) }, { price: false }); },
      crBagsDown: function () { if (cr.bags > 0) self.setCr({ bags: cr.bags - 1 }); },
      crBagsUp: function () { if (cr.bags < 3) self.setCr({ bags: cr.bags + 1 }); },
      openPublishedTrip: function () { self.setState({ screen: 'tripDetail', tripId: s.pubId, prev: Object.assign({}, s.prev, { tripDetail: 'trips' }), tripsTab: 'upcoming' }); },
      tripBack: function () { self.back('trips'); },
      editTrip: function () { var t = tripById(s, s.tripId); if (t && !bookedSeats(s, t.id)) self.go('create', { cr: createFromTrip(s, t), crErr: {} }); },
      askCancelTrip: function () { self.setState({ sheet: 'cancelTrip' }); },
      confirmCancelTrip: function () { self.cancelTrip(); },
      openRun: function () { self.go('run', { tripId: s.tripId }); },
      runBack: function () { self.back('tripDetail'); },
      runNext: function () { self.runNext(); },
      confirmRun: function () { self.confirmRun(); },
      skipGrace: function () { self.setState({ graceLeft: 0 }); },
      openDirections: function () { self.flash({}, 'يفتح Google Maps للاتجاهات فقط، بدون تتبع مباشر'); },
      openBankFromDone: function () { self.go('bank', { bankDraft: clone(self.state.bank), bankErr: {} }); },
      bookingsBack: function () { self.back('home'); },
      bookingDetailBack: function () { self.back('bookings'); },
      chatsBack: function () { self.back('home'); },
      chatBack: function () { self.back('bookingDetail'); },
      onChatDraft: function (e) { self.setState({ chatDraft: e.target.value }); },
      sendMessage: function () { self.sendMessage(); },
      openBookingFromChat: function () { self.go('bookingDetail', { bookingRef: s.chatRef }); },
      openBank: function () { self.go('bank', { bankDraft: clone(self.state.bank), bankErr: {} }); },
      ratingsBack: function () { self.back('account'); },
      confirmReport: function () {
        var r = revs[s.reportIdx]; if (!r || !s.reportReason) return;
        var rep = Object.assign({}, s.ratingReported); rep[r.trip + r.name] = true;
        self.flash({ sheet: '', ratingReported: rep, reportReason: '' }, 'أرسلنا البلاغ لمراجعة الإدارة');
      },
      notifsBack: function () { self.back('home'); },
      readAllNotifs: function () { self.setData(function (dd) { dd.notifs = dd.notifs.map(function (n) { return Object.assign({}, n, { read: true }); }); }); },

      openProfile: function () { self.go('profile', { pfName: s.driverName, pfErr: '' }); },
      profileBack: function () { self.back('account'); },
      onPfName: function (e) { self.setState({ pfName: e.target.value, pfErr: '' }); },
      saveProfile: function () {
        var n = s.pfName.trim().replace(/\s+/g, ' ');
        if (n.split(' ').length < 2) { self.setState({ pfErr: 'short' }); return; }
        self.flash({ driverName: n, pfName: n }, 'تم حفظ الاسم');
      },
      startChangePhone: function () { self.go('changePhone', { pendingPhone: '', cpError: '' }); },
      changePhoneBack: function () { self.back('profile'); },
      onNewPhone: function (e) { self.setState({ pendingPhone: toWesternDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 12), cpError: '' }); },
      submitNewPhone: function () {
        var p = normalizePhone(s.pendingPhone);
        var err = !p ? 'empty' : !/^5\d{8}$/.test(p) ? 'invalid' : p === normalizePhone(s.phone) ? 'same' : p.indexOf('56') === 0 ? 'taken' : '';
        if (err) { self.setState({ cpError: err }); return; }
        self.setState({ loading: true });
        self.later(800, function () { self.setState({ loading: false, screen: 'otp', otpPurpose: 'changePhone', otp: '', otpError: '', attempts: 0, seconds: RESEND_SECONDS }); });
      },
      openDocs: function () { self.go('docsView'); },
      openVehicle: function () { self.go('vehicleView'); },
      docsViewBack: function () { self.back('account'); },
      updateDocs: function () { if (s.docsPending) { self.flash({}, 'لديك تحديث قيد المراجعة بالفعل'); return; } self.openDocs('update'); },
      updateVehicle: function () { if (s.vehPending) { self.flash({}, 'لديك تحديث قيد المراجعة بالفعل'); return; } self.openVehicle('update'); },
      bankBack: function () { self.back('account'); },
      onBankHolder: function (e) { self.setState({ bankDraft: Object.assign({}, bkD, { holder: e.target.value }), bankErr: Object.assign({}, be, { holder: '' }) }); },
      onBankIban: function (e) { var v = toWesternDigits(e.target.value).toUpperCase().replace(/^SA/, '').replace(/[^\d]/g, '').slice(0, 22); self.setState({ bankDraft: Object.assign({}, bkD, { iban: v }), bankErr: Object.assign({}, be, { iban: '' }) }); },
      saveBank: function () { self.saveBank(); },
      openBookingsFromAccount: function () { self.go('bookings', { bkFilter: 'all' }); },
      openChatsFromAccount: function () { self.go('chats'); },
      openRatings: function () { self.go('ratings'); },
      openSupport: function () { self.go('support'); },
      supportBack: function () { self.back('account'); },
      callSupport: function () { self.flash({}, 'فتح الاتصال بالرقم 920000000'); },
      openTicketNew: function () { self.go('ticketNew', { tn: { type: '', link: '', desc: '', files: [] }, tnErr: {} }); },
      ticketNewBack: function () { self.back('support'); },
      onTkDesc: function (e) { self.setState({ tn: Object.assign(clone(tn), { desc: e.target.value }), tnErr: Object.assign({}, tne, { desc: false }) }); },
      addTkFile: function () { if (tn.files.length < 3) self.setState({ tn: Object.assign(clone(tn), { files: tn.files.concat(['photo-' + (tn.files.length + 1) + '.jpg']) }) }); },
      submitTicket: function () { self.submitTicket(); },
      ticketBack: function () { self.back('support'); },
      openSettings: function () { self.go('settings'); },
      settingsBack: function () { self.back('account'); },
      toggle_bookings: function () { var p = Object.assign({}, s.prefs); p.bookings = !p.bookings; self.setState({ prefs: p }); },
      toggle_chat: function () { var p = Object.assign({}, s.prefs); p.chat = !p.chat; self.setState({ prefs: p }); },
      toggle_money: function () { var p = Object.assign({}, s.prefs); p.money = !p.money; self.setState({ prefs: p }); },
      toggle_admin: function () { var p = Object.assign({}, s.prefs); p.admin = !p.admin; self.setState({ prefs: p }); },
      openTermsAccount: function () { self.go('static', { staticKind: 'terms' }); },
      openPrivacyAccount: function () { self.go('static', { staticKind: 'privacy' }); },
      staticBack: function () { self.back('account'); }
    };
  }
}
