// Generated from the canvas by scripts/sync-from-canvas.js — edit the canvas, then re-run.
var MAX_ATTEMPTS = 5;
var RESEND_SECONDS = 60;
var CORRECT_CODE = '1234';
var EXPIRED_CODE = '0000';
var HOLD_SECONDS = 600;

// Hopon DS (hopon/DESIGN-SYSTEM.md) with the carpool brand blue #007AFF as primary.
// "accessible" swaps the blue that carries text or a white label for a darker
// shade of the same hue so it passes 4.5:1 on white and on the #EBF4FF tint.
var BRAND = { accessible: '#0062CC', original: '#007AFF' };
var C = {
  brand: '#007AFF', soft: '#EBF4FF', ink: '#121212', body: '#4B4B4B', secondary: '#5D5D5D',
  placeholder: '#8A8A8A', stroke: '#E6E6E6', strokeMedium: '#D0D0D0', white: '#FFFFFF',
  bgSecondary: '#FAFAFA', grey100: '#F5F5F5', error: '#FF4E64', errorText: '#BF3B4B'
};

var CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الأحساء', 'القصيم', 'الطائف', 'أبها', 'تبوك', 'حائل', 'جازان', 'نجران', 'ينبع'];
var RARE = { 'نجران': 1, 'جازان': 1, 'تبوك': 1 };
var FROM_RIYADH = { 'جدة': 9.5, 'مكة المكرمة': 9, 'المدينة المنورة': 9.5, 'الدمام': 4, 'الخبر': 4.5, 'الأحساء': 3.5, 'القصيم': 3.5, 'الطائف': 8, 'أبها': 10, 'تبوك': 13, 'حائل': 6.5, 'جازان': 12, 'نجران': 10, 'ينبع': 10 };
var PAIR_HOURS = { 'جدة|مكة المكرمة': 1.25, 'جدة|المدينة المنورة': 4.5, 'جدة|الطائف': 2.5, 'الدمام|الخبر': 0.5, 'الدمام|الأحساء': 1.75, 'مكة المكرمة|الطائف': 1.5, 'مكة المكرمة|المدينة المنورة': 4.5 };
// Sample content (drivers, vehicles, meeting points, reviews) so no screen shows a placeholder.
var DRIVERS = [
  { name: 'فهد العتيبي', rating: '4.9', reviews: 212, car: 'تويوتا كامري 2023 · أبيض', plate: 'أ ب ج 4521', prefs: 'ممنوع التدخين · مكيّفة' },
  { name: 'سعد القحطاني', rating: '4.8', reviews: 167, car: 'هيونداي سوناتا 2022 · فضي', plate: 'ر س ك 7314', prefs: 'ممنوع التدخين · شاحن جوال' },
  { name: 'ماجد الحربي', rating: '4.7', reviews: 98, car: 'كيا K5 2023 · رمادي', plate: 'ح ط د 2096', prefs: 'ممنوع التدخين' },
  { name: 'عبدالرحمن الغامدي', rating: '4.9', reviews: 305, car: 'نيسان ألتيما 2022 · أسود', plate: 'ل ن م 5180', prefs: 'ممنوع التدخين · توقف للصلاة' },
  { name: 'تركي الدوسري', rating: '4.6', reviews: 74, car: 'هيونداي ستاريا 2023 · أبيض', plate: 'ب ص ع 8842', prefs: 'ممنوع التدخين · مساحة أمتعة كبيرة' },
  { name: 'بندر الزهراني', rating: '4.8', reviews: 139, car: 'تويوتا هايلاندر 2022 · كحلي', plate: 'و ه ي 3367', prefs: 'ممنوع التدخين · مكيّفة' }
];
var POINTS = {
  'الرياض': 'حي الملقا، مواقف طريق أنس بن مالك',
  'جدة': 'حي الروضة، مواقف شارع التحلية',
  'مكة المكرمة': 'حي العزيزية، مواقف الشارع العام',
  'المدينة المنورة': 'حي قربان، مواقف طريق الملك عبدالله',
  'الدمام': 'حي الشاطئ، مواقف طريق الخليج',
  'الخبر': 'حي العقربية، مواقف شارع الأمير بندر',
  'الأحساء': 'حي المحاسن، مواقف طريق الملك فهد',
  'القصيم': 'بريدة، حي الريان، مواقف طريق الملك عبدالعزيز',
  'الطائف': 'حي شهار، مواقف طريق الجنوب',
  'أبها': 'حي المنسك، مواقف طريق الملك فيصل',
  'تبوك': 'حي المروج، مواقف طريق الملك خالد',
  'حائل': 'حي النقرة، مواقف طريق الملك عبدالعزيز',
  'جازان': 'حي الشاطئ، مواقف الكورنيش',
  'نجران': 'حي الفيصلية، مواقف طريق الملك عبدالعزيز',
  'ينبع': 'حي الصريف، مواقف طريق الملك عبدالعزيز'
};
var REVIEWS = [
  { name: 'محمد ع.', stars: 5, text: 'ملتزم بالموعد والسيارة نظيفة ومريحة.', when: 'قبل أسبوع' },
  { name: 'نوف س.', stars: 4, text: 'قيادة هادئة، تأخر 5 دقائق عن نقطة التجمع.', when: 'قبل أسبوعين' },
  { name: 'عبدالله م.', stars: 5, text: 'تعامل راقٍ وتوقف للاستراحة في منتصف الطريق.', when: 'قبل 3 أسابيع' },
  { name: 'ريم ح.', stars: 5, text: 'وصلنا قبل الوقت المتوقع، والأمتعة رُتّبت بعناية.', when: 'قبل شهر' }
];
var TERMS = {
  'من نحن': [
    ['من نحن', 'منصة سعودية لرحلات مشتركة مجدولة بين المدن. يعرض السائقون المعتمدون مقاعدهم الشاغرة، ويحجز الركاب ويدفعون إلكترونياً بسعر واضح وبدون رسوم على الراكب.'],
    ['كيف نعمل', 'نعتمد كل سائق ومركبته قبل نشر أي رحلة، ونحدد المسارات وحدود الأسعار، ونتابع الحجوزات والإلغاءات والاستردادات حتى اكتمال الرحلة.'],
    ['تواصل معنا', 'من «الدعم الفني والشكاوى» في حسابك، أو عبر البريد support@example.sa.']
  ],
  'الشروط والأحكام': [
    ['الحجز والدفع', 'يتأكد الحجز تلقائياً بعد نجاح الدفع الإلكتروني، ولا يوجد دفع نقدي. إجمالي الحجز = عدد المقاعد × سعر المقعد.'],
    ['الإلغاء والاسترداد', 'الإلغاء قبل الموعد بـ 6 ساعات أو أكثر يسترد المبلغ كاملاً، وأقل من ذلك يسترد 80% وتذهب 20% للسائق. لا إلغاء من التطبيق بعد موعد الانطلاق، ويعود المبلغ لوسيلة الدفع الأصلية.'],
    ['الحضور', 'ينتظر السائق 15 دقيقة بعد الموعد، ثم يمكنه تسجيل الراكب «لم يحضر» ولا يُسترد مبلغ مقعده. ويمكن للراكب الإبلاغ عن عدم حضور السائق بعد 15 دقيقة من الموعد.'],
    ['السلوك', 'المحادثة مع السائق نصية وخاصة بالحجز فقط، ويُمنع استخدامها لتغيير شروط الرحلة. يحق للمنصة إيقاف أي حساب يخالف هذه الشروط.']
  ],
  'سياسة الخصوصية': [
    ['البيانات التي نجمعها', 'الاسم ورقم الجوال، وبيانات الركاب الذين تحجز لهم، وتفاصيل الحجوزات والمدفوعات. لا نحفظ بيانات بطاقتك، فالدفع يتم عبر بوابة الدفع المعتمدة.'],
    ['كيف نستخدمها', 'لتأكيد حجوزاتك، والتواصل معك بشأنها، وإرسال الإشعارات والتذكيرات، ومعالجة الاستردادات والشكاوى.'],
    ['مع من نشاركها', 'نشارك مع السائق اسم الراكب وما يلزم لتنفيذ الرحلة فقط، ولا نبيع بياناتك لأي جهة.'],
    ['حقوقك', 'يمكنك تعديل اسمك ورقم جوالك من «المعلومات الشخصية»، وطلب حذف حسابك من «حسابي».']
  ]
};
function driverFor(from, to, depMin) {
  var key = from + to + depMin, h = 0;
  for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 9973;
  return DRIVERS[h % DRIVERS.length];
}
function reviewsFor(driver) { var i = DRIVERS.indexOf(driver); return [REVIEWS[(i < 0 ? 0 : i) % REVIEWS.length], REVIEWS[((i < 0 ? 0 : i) + 1) % REVIEWS.length]]; }

var DEPARTURES = [{ m: 390, seats: 3, adj: 0 }, { m: 540, seats: 1, adj: 15 }, { m: 840, seats: 4, adj: -10 }, { m: 1170, seats: 2, adj: 5 }];
var POPULAR = [['الرياض', 'جدة'], ['الرياض', 'الدمام'], ['جدة', 'مكة المكرمة'], ['جدة', 'المدينة المنورة']];
// Popular-route card photos, keyed by route and showing the destination. Routes without a photo get a brand gradient.
var ROUTE_PHOTOS = {
  'الرياض→جدة': ['assets/city-jeddah.jpg', '50% 60%'],
  'جدة→مكة المكرمة': ['assets/city-makkah.jpg', '50% 50%'],
  'الرياض→الدمام': ['assets/city-dammam.webp', '88% 50%'],
  'جدة→المدينة المنورة': ['assets/city-madinah.jpg', '40% 50%']
};
var TIME_PREFS = [['any', 'أي وقت'], ['morning', 'صباحاً'], ['noon', 'ظهراً'], ['evening', 'مساءً']];
var BAG_SIZES = [['small', 'صغيرة'], ['medium', 'متوسطة'], ['large', 'كبيرة']];
var BAGS_PER_SEAT = 2;
var PAY_METHODS = [
  { id: 'mada', name: 'مدى', desc: 'بطاقة مدى البنكية' },
  { id: 'applepay', name: 'Apple Pay', desc: 'الدفع من محفظة Apple' },
  { id: 'card', name: 'بطاقة ائتمانية', desc: 'Visa أو Mastercard' }
];
var DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
var DATE_RANGE = 14;

function dayAt(i) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }
function dateLabel(i) { var d = dayAt(i); return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function hoursBetween(a, b) {
  if (a === 'الرياض') return FROM_RIYADH[b] || 6;
  if (b === 'الرياض') return FROM_RIYADH[a] || 6;
  return PAIR_HOURS[a + '|' + b] || PAIR_HOURS[b + '|' + a] || 6;
}
function basePrice(from, to) { return Math.round((40 + hoursBetween(from, to) * 14) / 5) * 5; }
function money(n) { return n + ' ر.س'; }
function fmtTime(min) {
  var m = ((min % 1440) + 1440) % 1440;
  var h = Math.floor(m / 60), mm = m % 60;
  var h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ':' + String(mm).padStart(2, '0') + ' ' + (h < 12 ? 'ص' : 'م');
}
// Sample timestamps for the booking status stepper, anchored on the trip's departure.
var STEP_OFFSETS = { confirmed: -1570, enroute: -35, arrived: -5, ongoing: 0 };
function stepWhen(trip, key) {
  var min = key === 'completed' ? trip.depMin + Math.round(hoursBetween(trip.from, trip.to) * 60) : trip.depMin + STEP_OFFSETS[key];
  var day = trip.dateIdx + Math.floor(min / 1440);
  var dayText = day === 0 ? 'اليوم' : day === -1 ? 'أمس' : day === 1 ? 'غداً' : dateLabel(day);
  return dayText + ' · ' + fmtTime(min);
}
function fmtDur(hours) {
  var t = Math.round(hours * 60), h = Math.floor(t / 60), m = t % 60;
  return (h ? h + ' س' : '') + (m ? (h ? ' ' : '') + m + ' د' : '');
}
function fmtClock(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function timeBucket(min) { return min < 720 ? 'morning' : min < 1020 ? 'noon' : 'evening'; }
function inTimePref(min, pref) { return !pref || pref === 'any' || timeBucket(min) === pref; }
function seatsText(n) { return n === 1 ? 'مقعد واحد متاح' : n === 2 ? 'مقعدان متاحان' : n + ' مقاعد متاحة'; }
function seatsWord(n) { return n === 1 ? 'مقعد واحد' : n === 2 ? 'مقعدان' : n + ' مقاعد'; }
function tripsWord(n) { return n === 1 ? 'رحلة واحدة' : n === 2 ? 'رحلتان' : n + ' رحلات'; }
function makeTrips(from, to, dateIdx, pref) {
  if (!from || !to || from === to) return [];
  if ((RARE[from] || RARE[to]) && dateIdx === 0) return [];
  var hrs = hoursBetween(from, to);
  var base = basePrice(from, to);
  return DEPARTURES.filter(function (d) { return inTimePref(d.m, pref); }).map(function (d, i) {
    var arr = d.m + Math.round(hrs * 60);
    return {
      id: from + to + dateIdx + d.m, from: from, to: to, dateIdx: dateIdx, depMin: d.m,
      dep: fmtTime(d.m), arr: fmtTime(arr) + (arr >= 1440 ? ' +1' : ''), duration: fmtDur(hrs),
      seats: d.seats, price: base + d.adj, driver: driverFor(from, to, d.m)
    };
  });
}
function routeErrorFor(from, to) {
  if (!from && !to) return 'both';
  if (!from) return 'from';
  if (!to) return 'to';
  if (from === to) return 'same';
  return '';
}
var ROUTE_ERRORS = {
  both: 'اختر مدينة الانطلاق ومدينة الوصول للبحث',
  from: 'اختر مدينة الانطلاق',
  to: 'اختر مدينة الوصول',
  same: 'اختر مدينة وصول مختلفة عن مدينة الانطلاق'
};
function applyFilters(trips, times, max, sortBy) {
  var out = trips.filter(function (t) {
    return (!times.length || times.indexOf(timeBucket(t.depMin)) !== -1) && (!max || t.price <= max);
  });
  return out.sort(function (a, b) { return sortBy === 'price' ? a.price - b.price : a.depMin - b.depMin; });
}
function resizePassengers(list, count) {
  var out = list.slice(0, Math.max(0, count));
  while (out.length < count) out.push({ name: '', phone: '' });
  return out;
}
function bagsSummaryText(bags) {
  if (!bags.length) return 'بدون أمتعة';
  var sizes = bags.map(function (b) { return (BAG_SIZES.filter(function (s) { return s[0] === b.size; })[0] || BAG_SIZES[1])[1]; }).join('، ');
  var n = bags.length;
  var head = n === 1 ? 'حقيبة واحدة' : n === 2 ? 'حقيبتان' : n + ' حقائب';
  return head + ': ' + sizes;
}

var BASE_STATE = {
  screen: 'home', sheet: '', origin: 'home', loggedIn: false, userName: '',
  phone: '', phoneError: '', loading: false, isNew: false,
  otp: '', otpError: '', otpFocused: false, attempts: 0, seconds: RESEND_SECONDS,
  name: '', nameError: '', agree: false, agreeError: false,
  toast: '', seats: 1, termsTitle: 'الشروط والأحكام', termsBackTo: 'profileSetup',
  from: '', to: '', dateIdx: 0, timePref: 'any', routeError: '',
  cityTarget: 'from', cityQuery: '', trip: null, tripBack: 'home', stubKind: 'chats',
  sortBy: 'time', filterTimes: [], filterMax: 0, fTimes: [], fMax: 0,
  bStep: 1, selfTravel: true, passengers: [], pErrors: [], bags: [],
  holdSeconds: 0, payMethod: 'mada', payState: '', bookingRef: '', bookings: [], bookingsTab: 'upcoming',
  detailRef: '', detailBack: 'bookings', cancelSel: [], cancelErr: false, reportNote: '', rateStars: 0, rateComment: '', lastCancel: null,
  chats: {}, chatUnread: {}, chatRef: '', chatBack: 'bookingDetail', chatDraft: '', typingRef: '', notifs: [], banner: null,
  profileName: '', profileErr: false, pendingPhone: '', cpError: '', otpPurpose: 'login', deleteAck: false, deleteErr: false,
  notifPrefs: { trips: true, chat: true, refunds: true, promos: false }, lang: 'ar',
  tickets: [], ticketRef: '', tForm: { type: '', bookingRef: '', subject: '', desc: '' }, tErr: {}, faqOpen: [], faqBack: 'account', supportBack: 'account'
};

var USER = { loggedIn: true, userName: 'عبدالله الشهري', phone: '501234567', from: 'الرياض', to: 'جدة', dateIdx: 1 };
var BOOK = Object.assign({}, USER, { screen: 'booking', origin: 'trip', seats: 2, passengers: [{ name: 'نورة الشهري', phone: '0551234567' }], bags: [{ size: 'medium' }, { size: 'small' }] });
// ---- bookings after payment (CUS-08, CUS-10, CUS-11) ----
var FULL_REFUND_MINUTES = 360;   // BR-07 / BR-08: 6 hours
var LATE_FEE_RATE = 0.2;         // BR-08: 20% to the driver
var NO_SHOW_MINUTES = 15;        // BR-15
var STATUS_STEPS = [['confirmed', 'مؤكدة'], ['enroute', 'السائق في الطريق'], ['arrived', 'وصل السائق'], ['ongoing', 'جارية'], ['completed', 'مكتملة']];
var RATE_LABELS = ['', 'سيئة', 'مقبولة', 'جيدة', 'جيدة جداً', 'ممتازة'];
var ACTIVE_RIDE = { enroute: 1, arrived: 1, ongoing: 1 };

function nowMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function tripAt(from, to, dateIdx, depMin) {
  var hrs = hoursBetween(from, to);
  var arr = depMin + Math.round(hrs * 60);
  return { id: from + to + dateIdx + depMin, from: from, to: to, dateIdx: dateIdx, depMin: depMin, dep: fmtTime(depMin), arr: fmtTime(arr) + (arr >= 1440 ? ' +1' : ''), duration: fmtDur(hrs), seats: 3, price: basePrice(from, to), driver: driverFor(from, to, depMin) };
}
function minutesTo(trip) { return trip.dateIdx * 1440 + trip.depMin - nowMin(); }
function fmtLeft(m) {
  var h = Math.floor(m / 60), mm = m % 60;
  var hours = h === 1 ? 'ساعة' : h === 2 ? 'ساعتين' : h <= 10 ? h + ' ساعات' : h + ' ساعة';
  if (!h) return mm + ' دقيقة';
  return hours + (mm ? ' و' + mm + ' دقيقة' : '');
}
function pax(name, phone, self, attendance) { return { name: name, phone: phone, self: !!self, status: 'active', attendance: attendance || null }; }
function makeBooking(ref, trip, passengers, bags, method, status) {
  return { ref: ref, trip: trip, passengers: passengers, bags: bags || [], method: method || 'mada', status: status || 'confirmed', total: trip.price * passengers.length, refunds: [], rating: null, report: null };
}
function activePax(b) { return b.passengers.filter(function (p) { return p.status === 'active'; }); }
function methodName(id) { return (PAY_METHODS.filter(function (m) { return m.id === id; })[0] || PAY_METHODS[0]).name; }
function refundCalc(b, count) {
  var gross = count * b.trip.price;
  var full = minutesTo(b.trip) >= FULL_REFUND_MINUTES;
  var fee = full ? 0 : Math.round(gross * LATE_FEE_RATE);
  return { gross: gross, fee: fee, net: gross - fee, full: full };
}
function tabOf(b) {
  if (b.status === 'completed' || b.status === 'cancelled') return 'past';
  if (ACTIVE_RIDE[b.status] || minutesTo(b.trip) <= 0) return 'current';
  return 'upcoming';
}
function canCancel(b) { return (b.status === 'confirmed' || b.status === 'enroute' || b.status === 'arrived') && minutesTo(b.trip) > 0; }
function lateMinutes(b) { return -minutesTo(b.trip); }
function canReport(b) { return (b.status === 'confirmed' || b.status === 'enroute') && !b.report && lateMinutes(b) >= NO_SHOW_MINUTES; }
function canRate(b) { return b.status === 'completed' && !b.rating && b.passengers.some(function (p) { return p.status === 'active' && p.attendance === 'present'; }); }
function statusInfo(b) {
  var partial = b.status !== 'cancelled' && activePax(b).length < b.passengers.length;
  if (b.status === 'cancelled') return { label: 'ملغى', bg: '#FFEDF0', dot: '#FF4E64' };
  if (b.status === 'completed') return { label: 'مكتملة', bg: '#E6FBF0', dot: '#04D268' };
  if (ACTIVE_RIDE[b.status]) return { label: (STATUS_STEPS.filter(function (s) { return s[0] === b.status; })[0] || [])[1], bg: '#FFF1E6', dot: '#FF6B00' };
  if (partial) return { label: 'مؤكد · ملغى جزئياً', bg: '#FEFCE8', dot: '#A16207' };
  return { label: 'مؤكد', bg: '#E6F2FF', dot: '#007AFF' };
}
var REFUND_STATUS = {
  processing: { label: 'قيد المعالجة', bg: '#FEFCE8', dot: '#A16207' },
  completed: { label: 'مكتمل', bg: '#E6FBF0', dot: '#04D268' },
  failed: { label: 'فشل', bg: '#FFEDF0', dot: '#FF4E64' }
};
function sampleBookings() {
  var n = nowMin();
  var me = function (att) { return pax('عبدالله الشهري', '501234567', true, att); };
  var upcoming = makeBooking('BK-48107', tripAt('الرياض', 'جدة', 1, 390), [me(), pax('نورة الشهري', '551234567')], [{ size: 'medium' }, { size: 'small' }], 'mada');
  var soon = makeBooking('BK-48012', tripAt('الرياض', 'الطائف', 0, n + 150), [me(), pax('نورة الشهري', '551234567'), pax('سلمان الشهري', '559876543')], [{ size: 'large' }], 'applepay');
  var enroute = makeBooking('BK-47960', tripAt('الرياض', 'الدمام', 0, n + 25), [me()], [], 'applepay', 'enroute');
  var late = makeBooking('BK-47988', tripAt('جدة', 'مكة المكرمة', 0, n - 18), [me()], [], 'mada');
  var completed = makeBooking('BK-46512', tripAt('المدينة المنورة', 'جدة', -5, 600), [me('present'), pax('خالد الشهري', '503334444', false, 'noshow')], [{ size: 'large' }], 'mada', 'completed');
  var cancelled = makeBooking('BK-46201', tripAt('الرياض', 'القصيم', -12, 480), [me()], [], 'mada', 'cancelled');
  cancelled.passengers[0].status = 'cancelled';
  cancelled.refunds = [{ ref: 'RF-46201-1', seats: 1, gross: cancelled.total, fee: 0, net: cancelled.total, status: 'completed' }];
  var failed = makeBooking('BK-46877', tripAt('الدمام', 'الرياض', -3, 1020), [me()], [], 'card', 'cancelled');
  failed.passengers[0].status = 'cancelled';
  var ff = Math.round(failed.total * LATE_FEE_RATE);
  failed.refunds = [{ ref: 'RF-46877-1', seats: 1, gross: failed.total, fee: ff, net: failed.total - ff, status: 'failed' }];
  var rated = makeBooking('BK-46034', tripAt('جدة', 'الرياض', -16, 420), [me('present')], [], 'applepay', 'completed');
  rated.rating = { stars: 5, comment: '' };
  return [upcoming, soon, enroute, late, completed, cancelled, failed, rated];
}

// ---- chat (CUS-09) and notifications (CUS-12) ----
var QUICK_REPLIES = ['وصلت لنقطة التجمع', 'سأتأخر 5 دقائق', 'أين أنت الآن؟', 'معي حقيبة صغيرة إضافية'];
var DRIVER_REPLIES = ['تمام، وصلت رسالتك.', 'حسناً، أنتظرك في نقطة التجمع.', 'شكراً لإبلاغي.'];
var NOTIF_STYLE = {
  message: { icon: 'isMsg', bg: '#EBF4FF', color: '#0062CC' },
  status: { icon: 'isCar', bg: '#EBF4FF', color: '#0062CC' },
  reminder: { icon: 'isTimer', bg: '#FFF7E6', color: '#121212' },
  confirmed: { icon: 'isTick', bg: '#E6FBF0', color: '#03A853' },
  refund: { icon: 'isMoney', bg: '#E6FBF0', color: '#03A853' },
  refundFailed: { icon: 'isMoney', bg: '#FFEDF0', color: '#BF3B4B' },
  cancelled: { icon: 'isAlert', bg: '#FFEDF0', color: '#BF3B4B' },
  report: { icon: 'isAlert', bg: '#FFF7E6', color: '#121212' },
  admin: { icon: 'isAdmin', bg: '#F5F5F5', color: '#4B4B4B' }
};
var DAY_LABELS = { today: 'اليوم', yesterday: 'أمس', earlier: 'سابقاً' };
NOTIF_STYLE.support = { icon: 'isMsg', bg: '#F5F5F5', color: '#4B4B4B' };

// ---- account and support (CUS-13 → CUS-15) ----
var TICKET_TYPES = [
  ['inquiry', 'استفسار عام', 'سؤال عن الحجز أو الدفع أو استخدام التطبيق'],
  ['complaint', 'شكوى على سائق', 'سلوك السائق، أو المركبة، أو الالتزام بالموعد'],
  ['objection', 'اعتراض على حجز', 'مثل تسجيل «لم يحضر» أو مبلغ مسترد غير صحيح']
];
var TICKET_STATUS = {
  'new': { label: 'جديدة', bg: '#E6F2FF', dot: '#007AFF', step: 0 },
  review: { label: 'قيد المراجعة', bg: '#FEFCE8', dot: '#A16207', step: 1 },
  resolved: { label: 'تم الحل', bg: '#E6FBF0', dot: '#04D268', step: 2 },
  closed: { label: 'مغلقة', bg: '#F0F0F0', dot: '#5D5D5D', step: 3 }
};
var TAKEN_PREFIX = '56';   // demo: numbers starting 56 already belong to another account
var FAQ = [
  ['كيف أحجز رحلة؟', 'ابحث بمدينة الانطلاق والوصول والتاريخ، واختر رحلة، ثم حدّد المقاعد وبيانات الركاب والأمتعة وادفع إلكترونياً. يتأكد الحجز تلقائياً بعد نجاح الدفع.'],
  ['هل يمكنني الدفع نقداً؟', 'لا، كل المدفوعات إلكترونية عبر بوابة الدفع، ولا توجد رسوم إضافية على الراكب.'],
  ['كم أسترد إذا ألغيت الحجز؟', 'الإلغاء قبل الموعد بـ 6 ساعات أو أكثر يسترد المبلغ كاملاً. وقبل أقل من 6 ساعات يُسترد 80%، و20% تذهب للسائق رسوم إلغاء. لا يمكن الإلغاء من التطبيق بعد موعد الانطلاق.'],
  ['ماذا يحدث إذا لم يحضر السائق؟', 'بعد 15 دقيقة من موعد الانطلاق يمكنك الإبلاغ من تفاصيل الحجز. إذا ثبت عدم حضوره تُلغى الرحلة ويُسترد المبلغ كاملاً.'],
  ['ماذا لو تأخرت عن موعد الرحلة؟', 'ينتظر السائق 15 دقيقة بعد موعد الانطلاق، وبعدها يمكنه تسجيلك «لم يحضر» ولا يُسترد مبلغ المقعد. يمكنك الاعتراض عبر الدعم الفني.'],
  ['هل يمكنني الحجز لشخص آخر؟', 'نعم، أدخل اسمه ورقم جواله في بيانات الركاب، ولا يلزم أن تكون من الركاب.'],
  ['متى يمكنني تقييم السائق؟', 'بعد اكتمال الرحلة، تقييم واحد لكل حجز، ولا يمكن تعديله أو حذفه بعد الإرسال.']
];
function sampleTickets() {
  return [
    { ref: 'TK-2041', type: 'objection', bookingRef: 'BK-46512', subject: 'اعتراض على تسجيل غياب راكب', desc: 'سُجّل خالد الشهري «لم يحضر» رغم أنه وصل نقطة التجمع في الموعد.', status: 'review', at: minsAgoAt(4 * 1440 + 30),
      replies: [{ text: 'استلمنا اعتراضك، وعلّقنا المبلغ محل الاعتراض لحين مراجعته مع السائق.', at: minsAgoAt(3 * 1440 + 200) }] },
    { ref: 'TK-1987', type: 'inquiry', bookingRef: '', subject: 'هل يمكن تغيير وسيلة الدفع بعد الحجز؟', desc: 'دفعت بمدى وأريد معرفة إن كان يمكن تغيير الوسيلة.', status: 'resolved', at: minsAgoAt(9 * 1440),
      replies: [{ text: 'لا يمكن تغيير وسيلة الدفع بعد التأكيد، وأي استرداد يعود لنفس الوسيلة الأصلية.', at: minsAgoAt(9 * 1440 - 120) }] },
    { ref: 'TK-1902', type: 'complaint', bookingRef: 'BK-46201', subject: 'تأخر السائق في الرد على المحادثة', desc: 'لم يرد السائق على رسائلي قبل الرحلة.', status: 'closed', at: minsAgoAt(13 * 1440),
      replies: [{ text: 'تواصلنا مع السائق ونبهناه للالتزام بالرد. نغلق الطلب الآن، ويمكنك فتح طلب جديد عند الحاجة.', at: minsAgoAt(12 * 1440) }] }
  ];
}

function minsAgoAt(m) { return Date.now() - m * 60000; }
function clockOf(at) { var d = new Date(at); return fmtTime(d.getHours() * 60 + d.getMinutes()); }
function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
function dayKey(at) { var t0 = startOfToday(); return at >= t0 ? 'today' : at >= t0 - 86400000 ? 'yesterday' : 'earlier'; }
function agoText(at) {
  var m = Math.max(0, Math.round((Date.now() - at) / 60000));
  if (m < 1) return 'الآن';
  if (m < 60) return 'قبل ' + m + ' د';
  var key = dayKey(at);
  if (key === 'today') return clockOf(at);
  if (key === 'yesterday') return 'أمس';
  var d = new Date(at);
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}
function chatIsOpen(b) { return b.status !== 'completed' && b.status !== 'cancelled'; }
function msg(from, text, minsAgo) { return { from: from, text: text, at: minsAgoAt(minsAgo) }; }
function sampleChats() {
  return {
    'BK-47960': [msg('me', 'السلام عليكم، هل الموعد ثابت؟', 40), msg('driver', 'وعليكم السلام، نعم الموعد ثابت.', 38), msg('driver', 'أنا في الطريق لنقطة التجمع، أصل خلال 20 دقيقة تقريباً.', 3)],
    'BK-48107': [msg('me', 'هل يمكن إضافة حقيبة كبيرة؟', 1500), msg('driver', 'المسموح حقيبتان لكل مقعد، والكبيرة لا مانع منها.', 1490)],
    'BK-47988': [msg('me', 'وصلت لنقطة التجمع، أين أنت الآن؟', 5)],
    'BK-48012': [],
    'BK-46512': [msg('driver', 'أنا عند نقطة التجمع، تفضّل.', 5 * 1440 + 12), msg('me', 'تمام، دقيقتين وأكون عندك.', 5 * 1440 + 10)]
  };
}
function sampleNotifs(bookings) {
  var find = function (ref) { return bookings.filter(function (b) { return b.ref === ref; })[0]; };
  var enr = find('BK-47960'), soon = find('BK-48012'), failed = find('BK-46877'), canc = find('BK-46201'), up = find('BK-48107');
  return [
    { id: 'n1', type: 'message', ref: 'BK-47960', title: 'رسالة جديدة من ' + enr.trip.driver.name, body: 'أنا في الطريق لنقطة التجمع، أصل خلال 20 دقيقة تقريباً.', at: minsAgoAt(3), read: false },
    { id: 'n2', type: 'status', ref: 'BK-47960', title: 'السائق في الطريق إليك', body: enr.trip.from + ' ← ' + enr.trip.to + ' · الانطلاق ' + enr.trip.dep, at: minsAgoAt(8), read: false },
    { id: 'n3', type: 'reminder', ref: 'BK-48012', title: 'تذكير برحلتك القادمة', body: soon.trip.from + ' ← ' + soon.trip.to + ' تنطلق اليوم الساعة ' + soon.trip.dep + '. كن في نقطة التجمع قبل الموعد.', at: minsAgoAt(30), read: false },
    { id: 'n4', type: 'refundFailed', ref: 'BK-46877', title: 'تعذّر استرداد ' + money(failed.refunds[0].net), body: 'سنعيد المحاولة تلقائياً · حجز ' + failed.ref, at: minsAgoAt(1500), read: false },
    { id: 'n5', type: 'confirmed', ref: 'BK-48107', title: 'تم تأكيد حجزك', body: up.trip.from + ' ← ' + up.trip.to + ' · ' + dateLabel(up.trip.dateIdx) + ' ' + up.trip.dep, at: minsAgoAt(1560), read: true },
    { id: 'n6', type: 'refund', ref: 'BK-46201', title: 'اكتمل استرداد ' + money(canc.refunds[0].net), body: 'إلى ' + methodName(canc.method) + ' · حجز ' + canc.ref, at: minsAgoAt(3 * 1440), read: true },
    { id: 'n7', type: 'admin', ref: null, title: 'رحلات إضافية في إجازة منتصف العام', body: 'أضفنا رحلات يومية بين الرياض وجدة والدمام خلال الإجازة. احجز مبكراً لضمان مقعدك.', at: minsAgoAt(4 * 1440 + 100), read: true }
  ];
}

var PRESETS = {
  'live': { screen: 'launcher' },
  'launcher': { screen: 'launcher' },
  'splash': { screen: 'splash' },
  'onboarding': { screen: 'onboarding' },
  'home-guest': {},
  'home-user': Object.assign({}, USER, { bookings: 'samples', bookingsOnly: ['BK-48012', 'BK-48107', 'BK-46512'], noNotifSeed: true }),
  'search-from': { screen: 'search', cityTarget: 'from' },
  'search-to': { screen: 'search', from: 'الرياض', cityTarget: 'to' },
  'date-sheet': { screen: 'search', from: 'الرياض', to: 'جدة', cityTarget: 'to', sheet: 'date', dateIdx: 3, timePref: 'morning' },
  'results': { screen: 'results', from: 'الرياض', to: 'جدة', dateIdx: 1 },
  'no-results': { screen: 'results', from: 'نجران', to: 'الرياض', dateIdx: 0 },
  'gate': { screen: 'trip', sheet: 'gate', origin: 'trip', from: 'الرياض', to: 'جدة', dateIdx: 1, tripBack: 'results' },
  'phone-empty': { screen: 'phone', origin: 'trip' },
  'phone-error': { screen: 'phone', origin: 'trip', phone: '0412345678', phoneError: 'invalid' },
  'phone-loading': { screen: 'phone', origin: 'trip', phone: '0501234567', loading: true },
  'otp-default': { screen: 'otp', origin: 'trip', phone: '501234567', otp: '12', otpFocused: true, seconds: 42 },
  'otp-wrong': { screen: 'otp', origin: 'trip', phone: '501234567', otpError: 'wrong', attempts: 2, seconds: 31 },
  'otp-expired': { screen: 'otp', origin: 'trip', phone: '501234567', otpError: 'expired', seconds: 0 },
  'otp-locked': { screen: 'otp', origin: 'trip', phone: '501234567', otpError: 'locked', attempts: 5, seconds: 0 },
  'profile-errors': { screen: 'profileSetup', origin: 'trip', phone: '551234567', isNew: true, nameError: 'short', name: 'سارة', agreeError: true },
  'booking': Object.assign({}, USER, { screen: 'booking', origin: 'trip', toast: 'تم تسجيل الدخول بنجاح' }),
  'results-filter': { screen: 'results', from: 'الرياض', to: 'جدة', dateIdx: 1, sortBy: 'price', sheet: 'filter', fTimes: ['morning', 'noon'], fMax: 0 },
  'trip-details': Object.assign({}, USER, { screen: 'trip', tripBack: 'results' }),
  'book-passengers': Object.assign({}, BOOK, { bStep: 1 }),
  'book-errors': Object.assign({}, BOOK, { bStep: 1, seats: 3, passengers: [{ name: '', phone: '' }, { name: 'خالد الشهري', phone: '05012' }], pErrors: [{ name: 'empty', phone: 'empty' }, { name: '', phone: 'invalid' }] }),
  'book-luggage': Object.assign({}, BOOK, { bStep: 2 }),
  'book-summary': Object.assign({}, BOOK, { bStep: 3 }),
  'payment': Object.assign({}, BOOK, { screen: 'payment', holdSeconds: 582, payMethod: 'mada' }),
  'payment-processing': Object.assign({}, BOOK, { screen: 'payment', holdSeconds: 547, payMethod: 'applepay', payState: 'processing' }),
  'payment-failed': Object.assign({}, BOOK, { screen: 'payment', holdSeconds: 431, payMethod: 'card', payState: 'failed' }),
  'payment-expired': Object.assign({}, BOOK, { screen: 'expired' }),
  'confirmed': Object.assign({}, BOOK, { screen: 'confirmed', bookingRef: 'BK-48213', seedNew: true }),
  'my-bookings': Object.assign({}, USER, { screen: 'bookings', bookingsTab: 'upcoming', bookings: 'samples', seedNew: true }),
  'bk-current': Object.assign({}, USER, { screen: 'bookings', bookingsTab: 'current', bookings: 'samples' }),
  'bk-past': Object.assign({}, USER, { screen: 'bookings', bookingsTab: 'past', bookings: 'samples' }),
  'bk-detail-upcoming': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-48107' }),
  'bk-detail-enroute': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-47960', bookingsTab: 'current' }),
  'bk-detail-late': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-47988', bookingsTab: 'current' }),
  'bk-report': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-47988', bookingsTab: 'current', sheet: 'report', reportNote: 'انتظرت في نقطة التجمع ولم يصل السائق ولم يرد على المحادثة' }),
  'bk-report-sent': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-47988', bookingsTab: 'current', patch: { ref: 'BK-47988', report: { ref: 'RP-47988', note: '' } } }),
  'bk-cancel-select': Object.assign({}, USER, { screen: 'cancel', bookings: 'samples', detailRef: 'BK-48012', cancelSel: [2] }),
  'bk-cancel-confirm': Object.assign({}, USER, { screen: 'cancel', bookings: 'samples', detailRef: 'BK-48012', cancelSel: [2], sheet: 'cancelConfirm' }),
  'bk-cancel-done': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-48012', sheet: 'cancelDone', applyCancel: [2] }),
  'bk-refund-failed': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-46877', bookingsTab: 'past' }),
  'bk-completed': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-46512', bookingsTab: 'past' }),
  'bk-rate': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-46512', bookingsTab: 'past', sheet: 'rate', rateStars: 4, rateComment: 'سائق ملتزم بالموعد والسيارة نظيفة' }),
  'bk-rated': Object.assign({}, USER, { screen: 'bookingDetail', bookings: 'samples', detailRef: 'BK-46512', bookingsTab: 'past', patch: { ref: 'BK-46512', rating: { stars: 4, comment: 'سائق ملتزم بالموعد والسيارة نظيفة' } } }),
  'chat-open': Object.assign({}, USER, { screen: 'chat', bookings: 'samples', chatRef: 'BK-47960', chatDraft: 'تمام، أنا في الطريق لنقطة التجمع' }),
  'chat-empty': Object.assign({}, USER, { screen: 'chat', bookings: 'samples', chatRef: 'BK-48012' }),
  'chat-typing': Object.assign({}, USER, { screen: 'chat', bookings: 'samples', chatRef: 'BK-47988', typingRef: 'BK-47988' }),
  'chat-closed': Object.assign({}, USER, { screen: 'chat', bookings: 'samples', chatRef: 'BK-46512' }),
  'push-banner': Object.assign({}, USER, { screen: 'bookings', bookingsTab: 'current', bookings: 'samples', banner: { ref: 'BK-47960', title: '', body: 'أنا في الطريق لنقطة التجمع، أصل خلال 20 دقيقة تقريباً.' } }),
  'notifs': Object.assign({}, USER, { screen: 'notifications', bookings: 'samples' }),
  'notifs-empty': Object.assign({}, USER, { screen: 'notifications', bookings: 'samples', noNotifSeed: true }),
  'home-notif': Object.assign({}, USER, { bookings: 'samples' }),
  'account': Object.assign({}, USER, { screen: 'account', bookings: 'samples' }),
  'profile': Object.assign({}, USER, { screen: 'profile', bookings: 'samples', profileName: 'عبدالله الشهري' }),
  'profile-error': Object.assign({}, USER, { screen: 'profile', bookings: 'samples', profileName: 'عبدالله', profileErr: true }),
  'change-phone': Object.assign({}, USER, { screen: 'changePhone', bookings: 'samples', pendingPhone: '0561112222', cpError: 'taken' }),
  'change-phone-otp': Object.assign({}, USER, { screen: 'otp', bookings: 'samples', otpPurpose: 'changePhone', pendingPhone: '598765432', otp: '12', otpFocused: true, seconds: 37 }),
  'settings': Object.assign({}, USER, { screen: 'settings', bookings: 'samples' }),
  'delete-blocked': Object.assign({}, USER, { screen: 'deleteAccount', bookings: 'samples' }),
  'delete-eligible': Object.assign({}, USER, { screen: 'deleteAccount', userName: 'سارة العتيبي', phone: '551234567', deleteErr: true }),
  'delete-confirm': Object.assign({}, USER, { screen: 'deleteAccount', userName: 'سارة العتيبي', phone: '551234567', deleteAck: true, sheet: 'deleteConfirm' }),
  'support': Object.assign({}, USER, { screen: 'support', bookings: 'samples' }),
  'ticket-new': Object.assign({}, USER, { screen: 'ticketNew', bookings: 'samples', tForm: { type: 'objection', bookingRef: '', subject: 'تسجيل غياب', desc: 'حضرت متأخراً' }, tErr: { booking: true, desc: true } }),
  'ticket-detail': Object.assign({}, USER, { screen: 'ticket', bookings: 'samples', ticketRef: 'TK-2041' }),
  'faq': Object.assign({}, USER, { screen: 'faq', bookings: 'samples', faqOpen: [2] }),
  'about': Object.assign({}, USER, { screen: 'terms', bookings: 'samples', termsTitle: 'من نحن', termsBackTo: 'account' })
};

var DESTINATION = { onboarding: 'home', trip: 'booking', account: 'account', bookings: 'bookings', chats: 'chats', home: 'home' };
// Screens whose white top bar sits right under the status bar.
var WHITE_HEADER = { bookings: 1, results: 1, trip: 1, booking: 1, payment: 1, bookingDetail: 1, cancel: 1, notifications: 1, profile: 1, deleteAccount: 1, support: 1, ticketNew: 1, ticket: 1, faq: 1 };
var GREY_SCREENS = { home: 1, search: 1, settings: 1, results: 1, trip: 1, booking: 1, payment: 1, chats: 1, account: 1, bookings: 1, bookingDetail: 1, cancel: 1, notifications: 1, deleteAccount: 1, support: 1, ticketNew: 1, ticket: 1, faq: 1 };

function bookingFromState(s, ref) {
  var trip = s.trip || makeTrips(s.from || 'الرياض', s.to || 'جدة', s.dateIdx, 'any')[0];
  var list = (s.selfTravel ? [pax(s.userName || 'عبدالله الشهري', normalizePhone(s.phone), true)] : [])
    .concat(s.passengers.map(function (p) { return pax(p.name, normalizePhone(p.phone)); }));
  return makeBooking(ref, trip, list.length ? list : [pax(s.userName || 'عبدالله الشهري', normalizePhone(s.phone), true)], s.bags, s.payMethod);
}
function applyCancelTo(b, sel) {
  var calc = refundCalc(b, sel.length);
  var nb = Object.assign({}, b);
  nb.passengers = b.passengers.map(function (p, i) { return sel.indexOf(i) !== -1 ? Object.assign({}, p, { status: 'cancelled' }) : p; });
  nb.refunds = b.refunds.concat([{ ref: 'RF-' + b.ref.slice(3) + '-' + (b.refunds.length + 1), seats: sel.length, gross: calc.gross, fee: calc.fee, net: calc.net, status: 'processing' }]);
  if (!activePax(nb).length) nb.status = 'cancelled';
  return { booking: nb, calc: calc };
}

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
  return {
    border: on ? C.brand : C.stroke,
    bg: on ? C.soft : C.white,
    color: on ? action : C.ink,
    weight: on ? 700 : 500,
    pressed: on ? 'true' : 'false'
  };
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var preset = (props && props.preset) || 'live';
    this.frozen = preset !== 'live';
    var s = Object.assign({}, BASE_STATE, PRESETS[preset] || {});
    var needsTrip = { trip: 1, booking: 1, payment: 1, expired: 1, confirmed: 1 };
    if (needsTrip[s.screen] && !s.trip) s.trip = makeTrips(s.from || 'الرياض', s.to || 'جدة', s.dateIdx, 'any')[0];
    if (s.screen === 'booking') s.passengers = resizePassengers(s.passengers, s.seats - (s.selfTravel ? 1 : 0));
    if (s.bookings === 'samples') {
      s.bookings = sampleBookings();
      s.chats = sampleChats();
      s.chatUnread = { 'BK-47960': 1 };
      s.notifs = s.noNotifSeed ? [] : sampleNotifs(s.bookings);
      s.tickets = sampleTickets();
    }
    // Canvas presets can keep only some sample bookings (e.g. home with just upcoming trips).
    if (s.bookingsOnly) {
      s.bookings = s.bookings.filter(function (b) { return s.bookingsOnly.indexOf(b.ref) !== -1; });
      Object.keys(s.chatUnread).forEach(function (ref) { if (s.bookingsOnly.indexOf(ref) === -1) delete s.chatUnread[ref]; });
    }
    if (s.banner && !s.banner.title) {
      var bb = s.bookings.filter(function (b) { return b.ref === s.banner.ref; })[0];
      s.banner = Object.assign({}, s.banner, { title: 'رسالة جديدة من ' + (bb ? bb.trip.driver.name : 'السائق') });
    }
    if (s.screen === 'chat' && s.chatRef) {
      s.chatUnread = Object.assign({}, s.chatUnread);
      s.chatUnread[s.chatRef] = 0;
      s.notifs = s.notifs.map(function (n) { return n.type === 'message' && n.ref === s.chatRef ? Object.assign({}, n, { read: true }) : n; });
    }
    if (s.seedNew) s.bookings = [bookingFromState(s, 'BK-48213')].concat(s.bookings);
    if (s.patch) {
      var patch = s.patch;
      s.bookings = s.bookings.map(function (b) { return b.ref === patch.ref ? Object.assign({}, b, patch) : b; });
    }
    if (s.applyCancel) {
      var target = s.bookings.filter(function (b) { return b.ref === s.detailRef; })[0];
      if (target) {
        var res = applyCancelTo(target, s.applyCancel);
        s.bookings = s.bookings.map(function (b) { return b.ref === s.detailRef ? res.booking : b; });
        s.lastCancel = { seats: s.applyCancel.length, net: res.calc.net, method: target.method, full: res.booking.status === 'cancelled' };
      }
    }
    this.state = s;
  }

  currentBooking() {
    var ref = this.state.detailRef;
    return this.state.bookings.filter(function (b) { return b.ref === ref; })[0] || null;
  }

  // Demo helper: moves the open booking along its lifecycle and sends the push the customer would get.
  // Trip times shift so the new step happens "now".
  simBooking(kind) {
    var self = this;
    var b = this.currentBooking();
    if (!b) return;
    var now = nowMin();
    var rideMin = Math.round(hoursBetween(b.trip.from, b.trip.to) * 60);
    var retime = function (trip, dep) {
      var day = Math.floor(dep / 1440), m = dep - day * 1440, arr = m + rideMin;
      return Object.assign({}, trip, { dateIdx: day, depMin: m, dep: fmtTime(m), arr: fmtTime(arr) + (arr >= 1440 ? ' +1' : '') });
    };
    var push = {
      enroute: ['status', 'السائق في الطريق إليك', 'كن في نقطة التجمع قبل الانطلاق.'],
      late: ['status', 'لم يصل السائق بعد؟', 'مرّ موعد الانطلاق، يمكنك الإبلاغ عن عدم حضور السائق.'],
      arrived: ['status', 'وصل السائق إلى نقطة التجمع', 'توجّه إلى السيارة وأبلغ السائق باسمك.'],
      ongoing: ['status', 'بدأت رحلتك', b.trip.from + ' ← ' + b.trip.to],
      completed: ['status', 'وصلت بالسلامة', 'شاركنا تقييمك للسائق.'],
      refundDone: ['refund', 'تم استرداد المبلغ', 'أُعيد المبلغ إلى ' + methodName(b.method) + '.'],
      refundFail: ['refund', 'تعذّر استرداد المبلغ', 'سنعيد المحاولة تلقائياً.']
    }[kind];
    this.updateBooking(b.ref, function (x) {
      if (kind === 'late') { x.trip = retime(x.trip, now - NO_SHOW_MINUTES - 3); x.status = 'confirmed'; }
      if (kind === 'enroute') { x.trip = retime(x.trip, now - STEP_OFFSETS.enroute); x.status = 'enroute'; }
      if (kind === 'arrived') { x.trip = retime(x.trip, now - STEP_OFFSETS.arrived); x.status = 'arrived'; }
      if (kind === 'ongoing') {
        x.trip = retime(x.trip, now); x.status = 'ongoing';
        x.passengers = x.passengers.map(function (p) { return p.status === 'active' ? Object.assign({}, p, { attendance: 'present' }) : p; });
      }
      if (kind === 'completed') { x.trip = retime(x.trip, now - rideMin); x.status = 'completed'; }
      if (kind === 'refundDone' || kind === 'refundFail') {
        x.refunds = x.refunds.map(function (r) { return r.status === 'processing' ? Object.assign({}, r, { status: kind === 'refundDone' ? 'completed' : 'failed' }) : r; });
      }
      return x;
    });
    this.setState({ notifs: [this.notif(push[0], b.ref, push[1], push[2])].concat(this.state.notifs), banner: { ref: b.ref, title: push[1], body: push[2] } });
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(function () { self.setState({ banner: null }); }, 5000);
  }

  updateBooking(ref, fn) {
    this.setState({ bookings: this.state.bookings.map(function (b) { return b.ref === ref ? fn(Object.assign({}, b)) : b; }) });
  }

  confirmCancel() {
    var self = this;
    var b = this.currentBooking();
    var sel = this.state.cancelSel;
    if (!b || !sel.length) return;
    var res = applyCancelTo(b, sel);
    var refundRef = res.booking.refunds[res.booking.refunds.length - 1].ref;
    this.setState({
      bookings: this.state.bookings.map(function (x) { return x.ref === b.ref ? res.booking : x; }),
      screen: 'bookingDetail', sheet: 'cancelDone', cancelSel: [], cancelErr: false,
      lastCancel: { seats: sel.length, net: res.calc.net, method: b.method, full: res.booking.status === 'cancelled' },
      notifs: [this.notif('cancelled', b.ref, res.booking.status === 'cancelled' ? 'تم إلغاء حجزك' : 'تم إلغاء ' + seatsWord(sel.length), 'بدأ استرداد ' + money(res.calc.net) + ' إلى ' + methodName(b.method) + ' · حجز ' + b.ref)].concat(this.state.notifs)
    });
    if (this.frozen) return;
    clearTimeout(this.refundTimer);
    this.refundTimer = setTimeout(function () {
      self.updateBooking(b.ref, function (x) {
        x.refunds = x.refunds.map(function (r) { return r.ref === refundRef ? Object.assign({}, r, { status: 'completed' }) : r; });
        return x;
      });
      self.flash({ notifs: [self.notif('refund', b.ref, 'اكتمل استرداد ' + money(res.calc.net), 'إلى ' + methodName(b.method) + ' · حجز ' + b.ref)].concat(self.state.notifs) }, 'اكتمل استرداد ' + money(res.calc.net));
    }, 8000);
  }

  submitReport() {
    var b = this.currentBooking();
    if (!b) return;
    var note = this.state.reportNote.trim();
    this.updateBooking(b.ref, function (x) { x.report = { ref: 'RP-' + b.ref.slice(3), note: note }; return x; });
    this.flash({ sheet: '', reportNote: '', notifs: [this.notif('report', b.ref, 'استلمنا بلاغك', 'بلاغ عدم حضور السائق RP-' + b.ref.slice(3) + ' قيد المراجعة')].concat(this.state.notifs) }, 'أرسلنا بلاغك للمراجعة');
  }

  submitRating() {
    var b = this.currentBooking();
    var stars = this.state.rateStars;
    if (!b || !stars) return;
    var comment = this.state.rateComment.trim();
    this.updateBooking(b.ref, function (x) { x.rating = { stars: stars, comment: comment }; return x; });
    this.flash({ sheet: '', rateStars: 0, rateComment: '' }, 'شكراً لتقييمك');
  }

  notif(type, ref, title, body) {
    return { id: 'n' + Date.now() + Math.random().toString(36).slice(2, 6), type: type, ref: ref, title: title, body: body, at: Date.now(), read: false };
  }

  openChat(ref, back) {
    var unread = Object.assign({}, this.state.chatUnread);
    unread[ref] = 0;
    this.setState({
      screen: 'chat', chatRef: ref, chatBack: back || 'bookingDetail', chatDraft: '', banner: null, sheet: '', chatUnread: unread,
      notifs: this.state.notifs.map(function (n) { return n.type === 'message' && n.ref === ref ? Object.assign({}, n, { read: true }) : n; })
    });
  }

  sendMessage(e) {
    if (e && e.preventDefault) e.preventDefault();
    var self = this;
    var s = this.state;
    var ref = s.chatRef;
    var text = s.chatDraft.trim();
    if (!text || !ref) return;
    var chats = Object.assign({}, s.chats);
    chats[ref] = (chats[ref] || []).concat([{ from: 'me', text: text, at: Date.now() }]);
    this.setState({ chats: chats, chatDraft: '' });
    if (this.frozen) return;
    clearTimeout(this.typingTimer);
    clearTimeout(this.replyTimer);
    this.typingTimer = setTimeout(function () { self.setState({ typingRef: ref }); }, 1200);
    this.replyTimer = setTimeout(function () {
      var st = self.state;
      var reply = DRIVER_REPLIES[(st.chats[ref] || []).length % DRIVER_REPLIES.length];
      var next = Object.assign({}, st.chats);
      next[ref] = (next[ref] || []).concat([{ from: 'driver', text: reply, at: Date.now() }]);
      var patch = { chats: next, typingRef: '' };
      if (st.screen !== 'chat' || st.chatRef !== ref) {
        var unread = Object.assign({}, st.chatUnread);
        unread[ref] = (unread[ref] || 0) + 1;
        patch.chatUnread = unread;
        var drvName = ((st.bookings.filter(function (b) { return b.ref === ref; })[0] || {}).trip || {}).driver;
        var msgTitle = 'رسالة جديدة من ' + (drvName ? drvName.name : 'السائق');
        patch.notifs = [self.notif('message', ref, msgTitle, reply)].concat(st.notifs);
        patch.banner = { ref: ref, title: msgTitle, body: reply };
        clearTimeout(self.bannerTimer);
        self.bannerTimer = setTimeout(function () { self.setState({ banner: null }); }, 5000);
      }
      self.setState(patch);
    }, 4200);
  }

  submitNewPhone(e) {
    if (e && e.preventDefault) e.preventDefault();
    var self = this;
    var p = normalizePhone(this.state.pendingPhone);
    var err = !p ? 'empty' : !/^5\d{8}$/.test(p) ? 'invalid' : p === normalizePhone(this.state.phone) ? 'same' : p.indexOf(TAKEN_PREFIX) === 0 ? 'taken' : '';
    if (err) { this.setState({ cpError: err }); return; }
    this.setState({ pendingPhone: p, cpError: '', loading: true });
    this.later(900, function () {
      self.setState({ loading: false, screen: 'otp', otpPurpose: 'changePhone', otp: '', otpError: '', attempts: 0, seconds: RESEND_SECONDS, otpFocused: false });
    });
  }

  saveName(e) {
    if (e && e.preventDefault) e.preventDefault();
    var name = this.state.profileName.trim().replace(/\s+/g, ' ');
    if (!name || name.split(' ').length < 2) { this.setState({ profileErr: true }); return; }
    this.flash({ userName: name, profileName: name, profileErr: false }, 'تم حفظ الاسم');
  }

  deleteBlockers() {
    var self = this;
    var s = this.state;
    var items = [];
    var active = s.bookings.filter(function (b) { return b.status !== 'completed' && b.status !== 'cancelled'; });
    var n = active.length;
    if (n) items.push({ text: 'لديك ' + (n === 1 ? 'حجز واحد قادم أو حالي' : n === 2 ? 'حجزان قادمان أو حاليان' : n + ' حجوزات قادمة أو حالية') + '. ألغها أو انتظر اكتمالها.', cta: 'حجوزاتي', go: function () { self.setState({ screen: 'bookings', bookingsTab: 'upcoming' }); } });
    var pending = s.bookings.filter(function (b) { return b.refunds.some(function (r) { return r.status !== 'completed'; }); });
    if (pending.length) items.push({ text: 'لديك استرداد لم يكتمل بعد (حجز ' + pending[0].ref + ').', cta: 'عرض', go: function () { self.setState({ screen: 'bookingDetail', detailRef: pending[0].ref, detailBack: 'deleteAccount' }); } });
    var open = s.tickets.filter(function (t) { return t.status === 'new' || t.status === 'review'; });
    if (open.length) items.push({ text: 'لديك طلب دعم أو اعتراض مفتوح (' + open[0].ref + ').', cta: 'الدعم', go: function () { self.setState({ screen: 'support', supportBack: 'deleteAccount' }); } });
    return items;
  }

  submitTicket(e) {
    if (e && e.preventDefault) e.preventDefault();
    var self = this;
    var f = this.state.tForm;
    var err = {
      type: !f.type,
      booking: !!f.type && f.type !== 'inquiry' && !f.bookingRef,
      subject: f.subject.trim().length < 3,
      desc: f.desc.trim().length < 20
    };
    if (err.type || err.booking || err.subject || err.desc) { this.setState({ tErr: err }); return; }
    this.setState({ tErr: {}, loading: true });
    this.later(800, function () {
      var s = self.state;
      var t = { ref: 'TK-' + (2100 + s.tickets.length), type: f.type, bookingRef: f.type === 'inquiry' ? '' : f.bookingRef, subject: f.subject.trim(), desc: f.desc.trim(), status: 'new', at: Date.now(), replies: [] };
      self.flash({
        loading: false, tickets: [t].concat(s.tickets), screen: 'ticket', ticketRef: t.ref,
        tForm: { type: '', bookingRef: '', subject: '', desc: '' },
        notifs: [self.notif('support', null, 'استلمنا طلبك ' + t.ref, t.subject)].concat(s.notifs)
      }, 'أرسلنا طلبك ' + t.ref);
    });
  }

  openNotif(n) {
    var notifs = this.state.notifs.map(function (x) { return x.id === n.id ? Object.assign({}, x, { read: true }) : x; });
    this.setState({ notifs: notifs });
    if (!n.ref) return;
    if (n.type === 'message') { this.openChat(n.ref, 'notifications'); return; }
    this.setState({ screen: 'bookingDetail', detailRef: n.ref, detailBack: 'notifications', sheet: '' });
  }

  componentDidMount() {
    var self = this;
    this.iv = setInterval(function () {
      var s = self.state;
      if (self.frozen) return;
      if (s.screen === 'otp' && s.seconds > 0 && s.otpError !== 'locked') self.setState({ seconds: s.seconds - 1 });
      if (s.holdSeconds > 0 && (s.screen === 'payment' || s.screen === 'booking') && s.payState !== 'processing') {
        var left = s.holdSeconds - 1;
        if (left === 0) self.setState({ holdSeconds: 0, screen: 'expired', payState: '' });
        else self.setState({ holdSeconds: left });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.iv);
    clearTimeout(this.toastTimer);
    clearTimeout(this.workTimer);
    clearTimeout(this.refundTimer);
    clearTimeout(this.typingTimer);
    clearTimeout(this.replyTimer);
    clearTimeout(this.bannerTimer);
  }

  flash(patch, msg) {
    var self = this;
    this.setState(Object.assign({}, patch, { toast: msg }));
    if (this.frozen) return;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(function () { self.setState({ toast: '' }); }, 2800);
  }

  later(ms, fn) {
    clearTimeout(this.workTimer);
    this.workTimer = setTimeout(fn, ms);
  }

  setRoute(patch) {
    var next = Object.assign({}, this.state, patch);
    var err = this.state.routeError ? routeErrorFor(next.from, next.to) : '';
    this.setState(Object.assign({}, patch, { routeError: err }));
  }

  bookingStart() {
    return { screen: 'booking', bStep: 1, seats: 1, selfTravel: true, passengers: [], pErrors: [], bags: [], holdSeconds: 0, payState: '', sheet: '' };
  }

  openGateOrGo(origin) {
    if (this.state.loggedIn) {
      var patch = { screen: DESTINATION[origin], origin: origin, stubKind: origin, sheet: '' };
      if (origin === 'trip') patch = Object.assign(patch, this.bookingStart());
      if (origin === 'bookings') patch.bookingsTab = 'upcoming';
      this.setState(patch);
    } else {
      this.setState({ sheet: 'gate', origin: origin });
    }
  }

  submitSearch(e) {
    if (e && e.preventDefault) e.preventDefault();
    var err = routeErrorFor(this.state.from, this.state.to);
    if (err) { this.setState({ routeError: err }); return; }
    var tp = this.state.timePref;
    this.setState({ routeError: '', screen: 'results', sheet: '', sortBy: 'time', filterMax: 0, filterTimes: tp === 'any' ? [] : [tp] });
  }

  setSeats(n) {
    var s = this.state;
    this.setState({ seats: n, passengers: resizePassengers(s.passengers, n - (s.selfTravel ? 1 : 0)), pErrors: [], bags: s.bags.slice(0, n * BAGS_PER_SEAT) });
  }

  validatePassengers() {
    var errs = this.state.passengers.map(function (p) {
      var ph = normalizePhone(p.phone);
      return { name: p.name.trim() ? '' : 'empty', phone: !ph ? 'empty' : (/^5\d{8}$/.test(ph) ? '' : 'invalid') };
    });
    var bad = errs.some(function (e) { return e.name || e.phone; });
    this.setState({ pErrors: bad ? errs : [] });
    return !bad;
  }

  bookingNext() {
    var self = this;
    var s = this.state;
    if (s.bStep === 1) { if (this.validatePassengers()) this.setState({ bStep: 2 }); return; }
    if (s.bStep === 2) { this.setState({ bStep: 3 }); return; }
    if (s.loading) return;
    this.setState({ loading: true });
    this.later(900, function () {
      self.setState({ loading: false, screen: 'payment', payState: '', holdSeconds: self.state.holdSeconds > 0 ? self.state.holdSeconds : HOLD_SECONDS });
    });
  }

  pay() {
    var self = this;
    if (this.state.payState === 'processing') return;
    this.setState({ payState: 'processing' });
    this.later(1600, function () {
      var s = self.state;
      if (s.payMethod === 'card') { self.setState({ payState: 'failed' }); return; }
      var booking = bookingFromState(s, 'BK-' + (48213 + s.bookings.length));
      var chats = Object.assign({}, s.chats);
      chats[booking.ref] = [];
      var n = self.notif('confirmed', booking.ref, 'تم تأكيد حجزك', booking.trip.from + ' ← ' + booking.trip.to + ' · ' + dateLabel(booking.trip.dateIdx) + ' ' + booking.trip.dep);
      self.setState({ payState: '', holdSeconds: 0, screen: 'confirmed', bookingRef: booking.ref, bookings: [booking].concat(s.bookings), chats: chats, notifs: [n].concat(s.notifs) });
    });
  }

  submitPhone(e) {
    if (e && e.preventDefault) e.preventDefault();
    var self = this;
    var p = normalizePhone(this.state.phone);
    if (!p) { this.setState({ phoneError: 'empty' }); return; }
    if (!/^5\d{8}$/.test(p)) { this.setState({ phoneError: 'invalid' }); return; }
    this.setState({ phone: p, phoneError: '', loading: true });
    this.later(900, function () {
      self.setState({ loading: false, screen: 'otp', otp: '', otpError: '', attempts: 0, seconds: RESEND_SECONDS, isNew: p.indexOf('55') === 0, otpFocused: false });
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
          self.flash({ phone: self.state.pendingPhone, pendingPhone: '', otpPurpose: 'login', screen: 'profile' }, 'تم تغيير رقم الجوال');
          return;
        }
        if (self.state.isNew) self.setState({ screen: 'profileSetup', name: '', nameError: '', agree: false, agreeError: false });
        else self.completeLogin('عبدالله الشهري', 'تم تسجيل الدخول بنجاح');
        return;
      }
      if (code === EXPIRED_CODE) { self.setState({ loading: false, otp: '', otpError: 'expired', seconds: 0 }); return; }
      var attempts = self.state.attempts + 1;
      self.setState({ loading: false, otp: '', attempts: attempts, otpError: attempts >= MAX_ATTEMPTS ? 'locked' : 'wrong' });
    });
  }

  completeLogin(userName, msg) {
    var origin = this.state.origin;
    var patch = { loggedIn: true, userName: userName, screen: DESTINATION[origin] || 'home', stubKind: origin, sheet: '', loading: false };
    if (!this.state.bookings.length && !this.state.isNew) {
      patch.bookings = sampleBookings();
      patch.chats = sampleChats();
      patch.chatUnread = { 'BK-47960': 1 };
      patch.notifs = sampleNotifs(patch.bookings);
      patch.tickets = sampleTickets();
    }
    if (origin === 'trip') patch = Object.assign(patch, this.bookingStart());
    if (origin === 'bookings') patch.bookingsTab = 'upcoming';
    this.flash(patch, msg);
  }

  submitProfile(e) {
    if (e && e.preventDefault) e.preventDefault();
    var self = this;
    var name = this.state.name.trim().replace(/\s+/g, ' ');
    var nameError = !name ? 'empty' : (name.split(' ').length < 2 ? 'short' : '');
    var agreeError = !this.state.agree;
    this.setState({ nameError: nameError, agreeError: agreeError });
    if (nameError || agreeError) return;
    this.setState({ loading: true });
    this.later(800, function () { self.completeLogin(name, 'تم إنشاء حسابك بنجاح'); });
  }

  openTermsPage(title) {
    this.setState({ screen: 'terms', termsTitle: title, termsBackTo: this.state.screen });
  }

  renderVals() {
    var self = this;
    var s = this.state;
    var screen = s.screen;
    var action = BRAND[this.props.brandColor] || BRAND.original;
    var phoneDisplay = displayPhone(s.phone);
    var locked = s.otpError === 'locked';
    var firstName = s.userName ? s.userName.split(' ')[0] : '';
    var trip = s.trip || makeTrips('الرياض', 'جدة', 1, 'any')[0];
    var total = trip.price * s.seats;

    var openTrip = function (t) { return function () { self.setState({ screen: 'trip', trip: t, tripBack: self.state.screen, sheet: '' }); }; };
    var decorate = function (t) {
      return Object.assign({}, t, {
        seatsText: seatsText(t.seats),
        seatsColor: t.seats === 1 ? C.errorText : C.secondary,
        seatsWeight: t.seats === 1 ? 700 : 400,
        priceText: money(t.price),
        driverName: t.driver.name, driverRating: t.driver.rating,
        open: openTrip(t)
      });
    };

    // home
    var timeChips = TIME_PREFS.map(function (tp) {
      return Object.assign(chipStyle(s.timePref === tp[0], action), { label: tp[1], pick: function () { self.setState({ timePref: tp[0] }); } });
    });
    var popular = POPULAR.map(function (r) {
      var ph = ROUTE_PHOTOS[r[0] + '→' + r[1]];
      var price = money(basePrice(r[0], r[1])), dur = fmtDur(hoursBetween(r[0], r[1]));
      return {
        label: r[1], price: price, duration: dur,
        hasPhoto: !!ph, noPhoto: !ph, photo: ph ? ph[0] : '', focus: ph ? ph[1] : '50% 50%',
        bg: ph ? '#1A1512' : 'linear-gradient(160deg, #007AFF 0%, #0062CC 100%)',
        aria: 'مسار شائع: ' + r[0] + ' إلى ' + r[1] + '، من ' + price + '، ' + dur,
        pick: function () { self.setState({ from: r[0], to: r[1], routeError: '', sheet: 'date' }); }
      };
    });
    // Next trip the user booked: a ride in progress first, otherwise the nearest one that hasn't left yet.
    var ahead = s.loggedIn ? s.bookings.filter(function (b) {
      return activePax(b).length && (ACTIVE_RIDE[b.status] || (b.status === 'confirmed' && minutesTo(b.trip) > 0));
    }).sort(function (a, b) {
      return (ACTIVE_RIDE[b.status] ? 1 : 0) - (ACTIVE_RIDE[a.status] ? 1 : 0) || minutesTo(a.trip) - minutesTo(b.trip);
    }) : [];
    var upcomingCount = ahead.length;
    var up = null;
    if (ahead.length) {
      var nb = ahead[0], nsi = statusInfo(nb), left = minutesTo(nb.trip);
      up = {
        active: !!ACTIVE_RIDE[nb.status], ref: nb.ref, status: nsi.label, pillBg: nsi.bg, pillDot: nsi.dot,
        when: ACTIVE_RIDE[nb.status] ? nsi.label + (left > 0 ? ' · بعد ' + fmtLeft(left) : '')
          : left > 0 && left < 12 * 60 ? 'تنطلق بعد ' + fmtLeft(left) : dateLabel(nb.trip.dateIdx) + ' · ' + nb.trip.dep,
        whenColor: ACTIVE_RIDE[nb.status] || (left > 0 && left <= 60) ? '#5EAEFF' : 'rgba(255, 255, 255, 0.72)',
        dep: nb.trip.dep, arr: nb.trip.arr, from: nb.trip.from, to: nb.trip.to, duration: nb.trip.duration,
        driverName: nb.trip.driver.name, driverRating: nb.trip.driver.rating,
        car: nb.trip.driver.car + ' · ' + nb.trip.driver.plate,
        seats: seatsWord(activePax(nb).length),
        aria: (ACTIVE_RIDE[nb.status] ? 'رحلتك الحالية: ' : 'رحلتك القادمة: ') + nb.trip.from + ' إلى ' + nb.trip.to + '، ' + nsi.label + '، حجز ' + nb.ref,
        open: function () { self.setState({ screen: 'bookingDetail', detailRef: nb.ref, bookingsTab: tabOf(nb), sheet: '' }); },
        canChat: chatIsOpen(nb), unread: s.chatUnread[nb.ref] || 0, hasUnread: !!s.chatUnread[nb.ref],
        chatAria: 'محادثة السائق ' + nb.trip.driver.name + (s.chatUnread[nb.ref] ? '، ' + s.chatUnread[nb.ref] + ' رسائل جديدة' : ''),
        chat: function () { self.openChat(nb.ref, 'home'); }
      };
    }
    var soonTrips = makeTrips('الرياض', 'الدمام', 0, 'any').slice(2, 3).concat(makeTrips('الرياض', 'جدة', 0, 'any').slice(3, 4)).map(decorate);

    // results + filter
    var baseTrips = screen === 'results' ? makeTrips(s.from, s.to, s.dateIdx, 'any') : [];
    var results = applyFilters(baseTrips, s.filterTimes, s.filterMax, s.sortBy).map(decorate);
    var filterCount = s.filterTimes.length + (s.filterMax ? 1 : 0);
    var base = s.from && s.to ? basePrice(s.from, s.to) : 0;
    var draftCount = applyFilters(baseTrips, s.fTimes, s.fMax, s.sortBy).length;
    var sortChips = [['time', 'الأقرب موعداً'], ['price', 'الأقل سعراً']].map(function (o) {
      return Object.assign(chipStyle(s.sortBy === o[0], action), { label: o[1], pick: function () { self.setState({ sortBy: o[0] }); } });
    });
    var fTimeChips = TIME_PREFS.slice(1).map(function (tp) {
      var on = s.fTimes.indexOf(tp[0]) !== -1;
      return Object.assign(chipStyle(on, action), {
        label: tp[1],
        pick: function () {
          var cur = self.state.fTimes;
          self.setState({ fTimes: cur.indexOf(tp[0]) !== -1 ? cur.filter(function (x) { return x !== tp[0]; }) : cur.concat([tp[0]]) });
        }
      });
    });
    var fPriceChips = [[0, 'أي سعر'], [base, 'حتى ' + money(base)], [base + 10, 'حتى ' + money(base + 10)]].map(function (o) {
      return Object.assign(chipStyle(s.fMax === o[0], action), { label: o[1], pick: function () { self.setState({ fMax: o[0] }); } });
    });
    var timeLabels = s.filterTimes.length
      ? s.filterTimes.map(function (k) { return (TIME_PREFS.filter(function (tp) { return tp[0] === k; })[0] || TIME_PREFS[0])[1]; }).join(' و')
      : 'أي وقت';

    // city sheet
    var otherCity = s.cityTarget === 'from' ? s.to : s.from;
    var current = s.cityTarget === 'from' ? s.from : s.to;
    var q = s.cityQuery.trim();
    var cityOptions = CITIES.filter(function (c) { return !q || c.indexOf(q) !== -1; }).map(function (c) {
      var disabled = c === otherCity;
      var selected = c === current;
      return {
        name: c, disabled: disabled, selected: selected, pressed: selected ? 'true' : 'false',
        hasNote: disabled, note: s.cityTarget === 'from' ? 'مدينة الوصول' : 'مدينة الانطلاق',
        bg: selected ? C.soft : 'transparent',
        color: disabled ? C.placeholder : (selected ? action : C.ink),
        weight: selected ? 700 : 500,
        pick: function () {
          // Fill the active field, move to the other one, and open the date sheet once both are set.
          var st = self.state;
          var patch = { cityQuery: '', cityEditing: false, routeError: '' }; patch[st.cityTarget] = c;
          var next = Object.assign({}, st, patch);
          if (next.from && next.to) patch.sheet = 'date';
          else patch.cityTarget = next.from ? 'to' : 'from';
          self.setState(patch);
        }
      };
    });

    // date sheet
    var dateOptions = [];
    for (var i = 0; i < DATE_RANGE; i++) {
      (function (idx) {
        var d = dayAt(idx);
        var on = s.dateIdx === idx;
        dateOptions.push({
          dayName: idx === 0 ? 'اليوم' : idx === 1 ? 'غداً' : DAYS[d.getDay()],
          num: d.getDate(), month: MONTHS[d.getMonth()], aria: dateLabel(idx),
          border: on ? C.brand : C.stroke, bg: on ? C.soft : C.white, color: on ? action : C.ink,
          pressed: on ? 'true' : 'false',
          pick: function () { self.setState({ dateIdx: idx }); }
        });
      })(i);
    }

    // booking
    var stepNames = ['الركاب', 'الأمتعة', 'المراجعة'];
    var stepBars = [1, 2, 3].map(function (n) { return { color: n <= s.bStep ? C.brand : C.stroke }; });
    var passengerForms = s.passengers.map(function (p, idx) {
      var err = s.pErrors[idx] || {};
      var num = idx + (s.selfTravel ? 2 : 1);
      var update = function (field) {
        return function (e) {
          var list = self.state.passengers.slice();
          var item = Object.assign({}, list[idx]);
          item[field] = field === 'phone' ? toWesternDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 12) : e.target.value;
          list[idx] = item;
          var errs = self.state.pErrors.slice();
          if (errs[idx]) { errs[idx] = Object.assign({}, errs[idx]); errs[idx][field] = ''; }
          self.setState({ passengers: list, pErrors: errs });
        };
      };
      return {
        title: 'الراكب ' + num,
        name: p.name, phone: p.phone,
        nameId: 'p-name-' + idx, phoneId: 'p-phone-' + idx,
        nameMsgId: 'p-name-msg-' + idx, phoneMsgId: 'p-phone-msg-' + idx,
        nameInvalid: !!err.name, phoneInvalid: !!err.phone,
        nameClass: err.name ? 'is-error' : '', phoneClass: err.phone ? 'is-error' : '',
        phoneErrText: err.phone === 'empty' ? 'أدخل رقم جوال الراكب' : 'أدخل رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام',
        onName: update('name'), onPhone: update('phone')
      };
    });
    var maxBags = s.seats * BAGS_PER_SEAT;
    var bagRows = s.bags.map(function (b, idx) {
      return {
        title: 'حقيبة ' + (idx + 1),
        removeAria: 'حذف الحقيبة ' + (idx + 1),
        sizeAria: 'حجم الحقيبة ' + (idx + 1),
        remove: function () { self.setState({ bags: self.state.bags.filter(function (_, j) { return j !== idx; }) }); },
        sizes: BAG_SIZES.map(function (sz) {
          return Object.assign(chipStyle(b.size === sz[0], action), {
            label: sz[1],
            pick: function () {
              var list = self.state.bags.slice();
              list[idx] = { size: sz[0] };
              self.setState({ bags: list });
            }
          });
        })
      };
    });
    var bagsFull = s.bags.length >= maxBags;
    var summaryPassengers = (s.selfTravel ? [{ name: (s.userName || 'عبدالله الشهري') + ' (أنت)', phone: phoneDisplay }] : [])
      .concat(s.passengers.map(function (p) { return { name: p.name || '—', phone: p.phone ? displayPhone(p.phone) : '—' }; }));
    var payMethodName = (PAY_METHODS.filter(function (m) { return m.id === s.payMethod; })[0] || PAY_METHODS[0]).name;
    var payMethods = PAY_METHODS.map(function (m) {
      var on = s.payMethod === m.id;
      return {
        id: 'pay-' + m.id, name: m.name, desc: m.desc, checked: on,
        isMada: m.id === 'mada', isApple: m.id === 'applepay', isCard: m.id === 'card',
        border: on ? C.brand : C.stroke, bg: on ? C.soft : C.white,
        pick: function () { self.setState({ payMethod: m.id, payState: self.state.payState === 'failed' ? 'failed' : '' }); }
      };
    });

    // my bookings
    // The running trip is pinned on top of «القادمة» instead of having its own tab
    var listTab = s.bookingsTab === 'past' ? 'past' : 'upcoming';
    var listOf = function (b) { return tabOf(b) === 'past' ? 'past' : 'upcoming'; };
    var tabDefs = [['upcoming', 'القادمة'], ['past', 'السابقة']];
    var bookingTabs = tabDefs.map(function (t) {
      var on = listTab === t[0];
      return {
        label: t[1], color: on ? action : C.secondary, weight: on ? 700 : 500, line: on ? action : 'transparent', pressed: on ? 'true' : 'false',
        pick: function () { self.setState({ bookingsTab: t[0] }); }
      };
    });
    var tabItems = s.bookings.filter(function (b) { return listOf(b) === listTab; }).sort(function (a, b) {
      var ca = tabOf(a) === 'current' ? 0 : 1, cb = tabOf(b) === 'current' ? 0 : 1;
      if (ca !== cb) return ca - cb;
      var ka = a.trip.dateIdx * 1440 + a.trip.depMin, kb = b.trip.dateIdx * 1440 + b.trip.depMin;
      return listTab === 'past' ? kb - ka : ka - kb;
    });
    var hasCurrent = tabItems.some(function (b) { return tabOf(b) === 'current'; });
    var bookingCards = tabItems.map(function (b, i) {
      var si = statusInfo(b);
      var isCurrent = tabOf(b) === 'current';
      var prevCurrent = i > 0 && tabOf(tabItems[i - 1]) === 'current';
      var header = !hasCurrent ? '' : i === 0 ? 'الحالية' : prevCurrent && !isCurrent ? 'القادمة' : '';
      var toRate = canRate(b), stars = b.rating ? b.rating.stars : 0;
      return {
        ref: b.ref, status: si.label, pillBg: si.bg, pillDot: si.dot,
        from: b.trip.from, to: b.trip.to, dep: b.trip.dep, arr: b.trip.arr, date: dateLabel(b.trip.dateIdx),
        seats: seatsWord(activePax(b).length || b.passengers.length), total: money(b.total),
        dateColor: C.secondary, duration: b.trip.duration,
        driverName: b.trip.driver.name, driverRating: b.trip.driver.rating, car: b.trip.driver.car + ' · ' + b.trip.driver.plate,
        hasRating: toRate || !!b.rating, rateLabel: b.rating ? 'تقييمك للسائق' : 'قيّم السائق',
        rateAria: b.rating ? 'تقييمك ' + stars + ' من 5' : 'لم تقيّم السائق بعد',
        rateStars: [1, 2, 3, 4, 5].map(function (n) { var on = n <= stars; return { fill: on ? '#F4B400' : 'none', color: on ? '#F4B400' : C.strokeMedium }; }),
        isCurrent: isCurrent, notCurrent: !isCurrent, hasHeader: !!header, header: header, headerPad: i === 0 ? '0' : '8px',
        aria: 'حجز ' + b.ref + '، ' + b.trip.from + ' إلى ' + b.trip.to + '، ' + si.label,
        open: function () { self.setState({ screen: 'bookingDetail', detailRef: b.ref, sheet: '' }); }
      };
    });

    // booking details
    var bk = this.currentBooking();
    var d = { steps: [], passengers: [], refunds: [], ratingStars: [], sims: [] };
    var cx = { rows: [] };
    if (bk) {
      var si = statusInfo(bk);
      var mins = minutesTo(bk.trip);
      var stepIdx = STATUS_STEPS.map(function (x) { return x[0]; }).indexOf(bk.status);
      var act = activePax(bk);
      var failed = bk.refunds.filter(function (r) { return r.status === 'failed'; })[0];
      var late = lateMinutes(bk);
      var titles = {
        confirmed: mins > 0 ? ['حجزك مؤكد', 'الانطلاق ' + dateLabel(bk.trip.dateIdx) + ' الساعة ' + bk.trip.dep + '. سنذكّرك قبل الموعد.'] : ['بانتظار وصول السائق', 'حان موعد الانطلاق ولم يحدّث السائق حالة الرحلة بعد.'],
        enroute: ['السائق في الطريق إليك', 'كن في نقطة التجمع قبل موعد الانطلاق ' + bk.trip.dep + '.'],
        arrived: ['وصل السائق إلى نقطة التجمع', 'توجّه إلى السيارة وأبلغ السائق باسمك.'],
        ongoing: ['الرحلة جارية', 'الوصول المتوقع ' + bk.trip.arr + ' إلى ' + bk.trip.to + '.'],
        completed: ['اكتملت الرحلة', 'وصلت إلى ' + bk.trip.to + ' ' + dateLabel(bk.trip.dateIdx) + '.'],
        cancelled: ['تم إلغاء الحجز', 'أُلغيت كل المقاعد، وأُغلقت المحادثة مع السائق.']
      }[bk.status];
      var refundedTotal = bk.refunds.reduce(function (sum, r) { return sum + r.net; }, 0);
      var rated = !!bk.rating;
      var noPresent = bk.status === 'completed' && !bk.passengers.some(function (p) { return p.status === 'active' && p.attendance === 'present'; });
      var sims = [];
      if (bk.status === 'confirmed') {
        sims.push(['تحرّك السائق', 'enroute']);
        if (!bk.report && !canReport(bk)) sims.push(['تأخّر السائق', 'late']);
      }
      if (bk.status === 'enroute') sims.push(['وصل السائق', 'arrived']);
      if (bk.status === 'arrived') sims.push(['بدأت الرحلة', 'ongoing']);
      if (bk.status === 'ongoing') sims.push(['انتهت الرحلة', 'completed']);
      if (bk.refunds.some(function (r) { return r.status === 'processing'; })) sims.push(['نجح الاسترداد', 'refundDone'], ['فشل الاسترداد', 'refundFail']);
      d = {
        ref: bk.ref, statusLabel: si.label, pillBg: si.bg, pillDot: si.dot,
        hasSims: sims.length > 0, scrollPad: sims.length ? '72px' : '16px',
        sims: sims.map(function (x) { return { label: 'محاكاة: ' + x[0], run: function () { self.simBooking(x[1]); } }; }),
        statusTitle: titles[0], statusBody: titles[1],
        showTimeline: bk.status !== 'cancelled',
        steps: STATUS_STEPS.map(function (x, i) {
          var done = i < stepIdx || bk.status === 'completed';
          var cur = i === stepIdx && bk.status !== 'completed';
          return {
            label: x[1], current: cur ? 'step' : undefined,
            ring: done || cur ? C.brand : C.strokeMedium, fill: done ? C.brand : C.white,
            // current step: dashed brand ring; the dashed connector turns brand once the next step is reached
            ringStyle: cur ? 'dashed' : 'solid',
            // a status shows when it happened only after it is done
            hasTime: done, time: done ? stepWhen(bk.trip, x[0]) : '',
            hasLine: i < STATUS_STEPS.length - 1, line: i < stepIdx || bk.status === 'completed' ? C.brand : C.strokeMedium,
            weight: cur ? 700 : 500, color: done || cur ? C.ink : C.secondary
          };
        }),
        from: bk.trip.from, to: bk.trip.to, dep: bk.trip.dep, arr: bk.trip.arr, date: dateLabel(bk.trip.dateIdx), duration: bk.trip.duration,
        driverName: bk.trip.driver.name, driverRating: bk.trip.driver.rating, car: bk.trip.driver.car, plate: bk.trip.driver.plate,
        pickup: POINTS[bk.trip.from] || bk.trip.from, dropoff: POINTS[bk.trip.to] || bk.trip.to,
        chatLabel: bk.status === 'completed' || bk.status === 'cancelled' ? 'عرض سجل المحادثة (مغلقة)' : 'محادثة السائق',
        passengerCount: act.length,
        passengers: bk.passengers.map(function (p) {
          var pill = p.status === 'cancelled' ? ['ملغى', '#FFEDF0', '#FF4E64']
            : p.attendance === 'noshow' ? ['لم يحضر', '#FFEDF0', '#FF4E64']
            : p.attendance === 'present' ? ['حضر', '#E6FBF0', '#04D268']
            : null;
          return {
            name: p.name + (p.self ? ' (أنت)' : ''), phone: displayPhone(p.phone),
            nameColor: p.status === 'cancelled' ? C.secondary : C.ink,
            hasPill: !!pill, pill: pill ? pill[0] : '', pillBg: pill ? pill[1] : '', pillColor: pill ? pill[2] : ''
          };
        }),
        bagsText: bagsSummaryText(bk.bags),
        methodName: methodName(bk.method), paidText: money(bk.total),
        refunds: bk.refunds.map(function (r) {
          var st = REFUND_STATUS[r.status];
          return {
            title: 'استرداد ' + seatsWord(r.seats), netText: money(r.net), ref: r.ref,
            hasFee: r.fee > 0, feeText: 'خُصم ' + money(r.fee) + ' رسوم إلغاء للسائق (إلغاء قبل الموعد بأقل من 6 ساعات)',
            statusLabel: st.label, statusBg: st.bg, statusDot: st.dot
          };
        }),
        canReport: canReport(bk),
        lateText: 'مرّت ' + late + ' دقيقة على موعد الانطلاق (' + bk.trip.dep + '). إذا لم يحضر السائق يمكنك الإبلاغ، وسنراجع البلاغ ونعلّق مستحقات الرحلة.',
        reportSoon: (bk.status === 'confirmed' || bk.status === 'enroute') && !bk.report && late >= 0 && late < NO_SHOW_MINUTES,
        reportSoonText: 'إذا تأخر السائق، يظهر زر الإبلاغ عن عدم حضوره بعد ' + (NO_SHOW_MINUTES - Math.max(0, late)) + ' دقيقة من الآن.',
        reportSent: !!bk.report, reportRef: bk.report ? bk.report.ref : '',
        reportIntro: 'مرّت ' + late + ' دقيقة على موعد الانطلاق (' + bk.trip.dep + '). سنراجع البلاغ مع السائق، ولا يُعد عدم تحديث السائق لحالة الرحلة وحده دليلاً على عدم حضوره.',
        refundFailed: !!failed, failedTitle: failed ? 'تعذّر استرداد ' + money(failed.net) : '', failedRef: failed ? failed.ref : '',
        rated: rated, ratingComment: rated ? bk.rating.comment : '', hasRatingComment: rated && !!bk.rating.comment,
        ratingAria: rated ? 'تقييمك ' + bk.rating.stars + ' من 5' : '',
        ratingStars: [1, 2, 3, 4, 5].map(function (n) { var on = rated && n <= bk.rating.stars; return { fill: on ? '#F4B400' : 'none', color: on ? '#F4B400' : C.strokeMedium }; }),
        hasNoRateReason: noPresent, noRateReason: 'لا يمكن تقييم السائق لأن كل ركاب الحجز سُجّلوا «لم يحضر».',
        canRate: canRate(bk),
        canCancel: canCancel(bk),
        cancelHint: mins >= FULL_REFUND_MINUTES ? 'الإلغاء الآن يسترد المبلغ كاملاً (قبل الموعد بـ 6 ساعات أو أكثر).' : 'الإلغاء الآن يسترد 80% من قيمة المقاعد (باقٍ أقل من 6 ساعات).',
        cancelClosed: !canCancel(bk) && (bk.status === 'confirmed' || ACTIVE_RIDE[bk.status]) && mins <= 0,
        refundedText: money(refundedTotal)
      };
      d.hasActions = d.canRate || d.canCancel || d.cancelClosed;

      var calc = refundCalc(bk, s.cancelSel.length);
      var activeIdx = bk.passengers.map(function (p, i) { return p.status === 'active' ? i : -1; }).filter(function (i) { return i !== -1; });
      var allSel = activeIdx.length > 0 && activeIdx.every(function (i) { return s.cancelSel.indexOf(i) !== -1; });
      cx = {
        tierFull: calc.full, tierLate: !calc.full, leftText: fmtLeft(Math.max(0, mins)),
        allLabel: allSel ? 'إلغاء التحديد' : 'تحديد الكل',
        rows: activeIdx.map(function (i) {
          var p = bk.passengers[i];
          var on = s.cancelSel.indexOf(i) !== -1;
          return {
            id: 'cancel-seat-' + i, name: p.name + (p.self ? ' (أنت)' : ''), phone: displayPhone(p.phone), priceText: money(bk.trip.price),
            checked: on, border: on ? C.errorText : C.stroke, bg: on ? '#FFF8F7' : C.white,
            toggle: function () {
              var cur = self.state.cancelSel;
              self.setState({ cancelErr: false, cancelSel: cur.indexOf(i) !== -1 ? cur.filter(function (x) { return x !== i; }) : cur.concat([i]) });
            }
          };
        }),
        err: s.cancelErr, hasSel: s.cancelSel.length > 0,
        selWord: seatsWord(s.cancelSel.length || 1),
        grossText: money(calc.gross), feeText: calc.fee ? '− ' + money(calc.fee) : 'لا توجد', netText: money(calc.net),
        scopeText: allSel ? 'سيُلغى الحجز بالكامل وتُغلق المحادثة مع السائق.' : 'باقي المقاعد تظل مؤكدة.',
        cta: s.cancelSel.length ? 'إلغاء ' + seatsWord(s.cancelSel.length) : 'اختر المقاعد للمتابعة',
        confirmTitle: allSel ? 'إلغاء الحجز بالكامل؟' : 'إلغاء ' + seatsWord(s.cancelSel.length) + '؟',
        confirmBody: 'سيُسترد ' + money(calc.net) + ' إلى ' + methodName(bk.method) + (calc.fee ? '، بعد خصم ' + money(calc.fee) + ' رسوم إلغاء للسائق' : '') + '. لا يمكن التراجع عن الإلغاء.',
        activeIdx: activeIdx, allSel: allSel
      };
    }
    // chats + notifications
    var chatBookings = s.bookings.filter(function (b) { return chatIsOpen(b) || (s.chats[b.ref] || []).length; });
    var lastAt = function (b) { var list = s.chats[b.ref] || []; return list.length ? list[list.length - 1].at : 0; };
    var chatRows = chatBookings.slice().sort(function (a, b) { return lastAt(b) - lastAt(a); }).map(function (b) { // kept for unread counts
      var list = s.chats[b.ref] || [];
      var last = list[list.length - 1];
      var unread = s.chatUnread[b.ref] || 0;
      return {
        ref: b.ref, route: b.trip.from + ' ← ' + b.trip.to, driver: b.trip.driver.name,
        time: last ? agoText(last.at) : '',
        preview: last ? (last.from === 'me' ? 'أنت: ' : '') + last.text : 'لا توجد رسائل بعد',
        previewWeight: unread ? 700 : 400, previewColor: unread ? C.ink : C.body,
        unread: unread, hasUnread: unread > 0, closed: !chatIsOpen(b),
        aria: 'محادثة حجز ' + b.ref + (unread ? '، ' + unread + ' رسائل غير مقروءة' : '') + (chatIsOpen(b) ? '' : '، مغلقة'),
        open: function () { self.openChat(b.ref, 'bookingDetail'); }
      };
    });
    var unreadChats = Object.keys(s.chatUnread).reduce(function (sum, k) { return sum + (s.chatUnread[k] || 0); }, 0);
    var cb = s.bookings.filter(function (b) { return b.ref === s.chatRef; })[0];
    var cv = {};
    if (cb) {
      var msgs = s.chats[cb.ref] || [];
      var items = [];
      var prevKey = '';
      var lastMineIdx = -1;
      msgs.forEach(function (m, i) { if (m.from === 'me') lastMineIdx = i; });
      msgs.forEach(function (m, i) {
        var k = dayKey(m.at);
        var label = k === 'earlier' ? dateLabel(Math.round((new Date(m.at).setHours(12, 0, 0, 0) - dayAt(0).getTime()) / 86400000)) : DAY_LABELS[k];
        if (label !== prevKey) { items.push({ isDay: true, isMsg: false, label: label }); prevKey = label; }
        var mine = m.from === 'me';
        items.push({
          isDay: false, isMsg: true, text: m.text,
          justify: mine ? 'flex-end' : 'flex-start',
          radius: mine ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          bg: mine ? action : C.white, border: mine ? action : C.stroke, color: mine ? C.white : C.ink,
          meta: clockOf(m.at) + (mine && i === lastMineIdx ? ' · تم الإرسال' : ''),
          metaColor: mine ? C.white : C.secondary
        });
      });
      var open = chatIsOpen(cb);
      cv = {
        ref: cb.ref, route: cb.trip.from + ' ← ' + cb.trip.to, status: statusInfo(cb).label, driver: cb.trip.driver.name,
        items: items, empty: msgs.length === 0, open: open, closed: !open,
        showQuick: open && !s.chatDraft,
        closedText: cb.status === 'completed'
          ? 'المحادثة مغلقة لأن الرحلة اكتملت. يمكنك قراءة الرسائل السابقة فقط.'
          : 'المحادثة مغلقة لأن الحجز أُلغي بالكامل. يمكنك قراءة الرسائل السابقة فقط.'
      };
    }
    var unreadNotifs = s.notifs.filter(function (n) { return !n.read; }).length;
    var notifGroups = ['today', 'yesterday', 'earlier'].map(function (k) {
      var items = s.notifs.filter(function (n) { return dayKey(n.at) === k; }).sort(function (a, b) { return b.at - a.at; }).map(function (n) {
        var st = NOTIF_STYLE[n.type] || NOTIF_STYLE.admin;
        var flags = { isMsg: false, isCar: false, isTimer: false, isTick: false, isMoney: false, isAlert: false, isAdmin: false };
        flags[st.icon] = true;
        return Object.assign(flags, {
          title: n.title, body: n.body, time: agoText(n.at), unread: !n.read,
          bg: n.read ? C.white : C.soft, border: n.read ? C.stroke : '#B8D9FF',
          titleWeight: n.read ? 500 : 700, iconBg: st.bg, iconColor: st.color,
          aria: (n.read ? '' : 'غير مقروء: ') + n.title + '. ' + n.body,
          open: function () { self.openNotif(n); }
        });
      });
      return { label: DAY_LABELS[k], items: items };
    }).filter(function (g) { return g.items.length; });

    // account + support
    var blockers = this.deleteBlockers();
    var dx = { items: blockers, blocked: blockers.length > 0, eligible: blockers.length === 0 };
    var tf = s.tForm;
    var typeLabel = function (t) { return (TICKET_TYPES.filter(function (x) { return x[0] === t; })[0] || TICKET_TYPES[0])[1]; };
    var ticketRows = s.tickets.slice().sort(function (a, b) { return b.at - a.at; }).map(function (t) {
      var st = TICKET_STATUS[t.status];
      return {
        ref: t.ref, status: st.label, statusBg: st.bg, statusDot: st.dot, subject: t.subject,
        meta: typeLabel(t.type) + (t.bookingRef ? ' · ' + t.bookingRef : '') + ' · ' + agoText(t.at),
        open: function () { self.setState({ screen: 'ticket', ticketRef: t.ref }); }
      };
    });
    var ticketTypes = TICKET_TYPES.map(function (tt) {
      var on = tf.type === tt[0];
      return {
        label: tt[1], desc: tt[2], checked: on ? 'true' : 'false',
        border: on ? C.brand : (s.tErr.type ? C.error : C.stroke), bg: on ? C.soft : C.white,
        ring: on ? C.brand : C.strokeMedium, dot: on ? C.brand : 'transparent',
        pick: function () { self.setState({ tForm: Object.assign({}, self.state.tForm, { type: tt[0] }), tErr: Object.assign({}, self.state.tErr, { type: false, booking: false }) }); }
      };
    });
    var ticketBookingOptions = s.bookings.slice().sort(function (a, b) { return (b.trip.dateIdx * 1440 + b.trip.depMin) - (a.trip.dateIdx * 1440 + a.trip.depMin); }).map(function (b) {
      var on = tf.bookingRef === b.ref;
      return {
        route: b.trip.from + ' ← ' + b.trip.to, meta: dateLabel(b.trip.dateIdx) + ' · ' + b.ref + ' · ' + statusInfo(b).label,
        checked: on ? 'true' : 'false', bg: on ? C.soft : 'transparent', ring: on ? C.brand : C.strokeMedium, dot: on ? C.brand : 'transparent',
        pick: function () { self.setState({ tForm: Object.assign({}, self.state.tForm, { bookingRef: b.ref }), tErr: Object.assign({}, self.state.tErr, { booking: false }) }); }
      };
    });
    var ct = s.tickets.filter(function (t) { return t.ref === s.ticketRef; })[0];
    var tx = { steps: [], thread: [] };
    if (ct) {
      var tst = TICKET_STATUS[ct.status];
      tx = {
        ref: ct.ref, subject: ct.subject, status: tst.label, statusBg: tst.bg, statusDot: tst.dot,
        meta: typeLabel(ct.type) + ' · ' + agoText(ct.at),
        hasBooking: !!ct.bookingRef, bookingRef: ct.bookingRef,
        steps: ['جديدة', 'قيد المراجعة', 'تم الحل', 'مغلقة'].map(function (label, i) {
          return { label: label, bar: i <= tst.step ? C.brand : C.stroke, color: i <= tst.step ? C.ink : C.secondary, weight: i === tst.step ? 700 : 500, current: i === tst.step ? 'step' : undefined };
        }),
        thread: [{ who: 'أنت', text: ct.desc, time: agoText(ct.at), bg: C.white, border: C.stroke }].concat(ct.replies.map(function (r) {
          return { who: 'فريق الدعم', text: r.text, time: agoText(r.at), bg: C.soft, border: '#B8D9FF' };
        })),
        footer: ct.status === 'closed' ? 'الطلب مغلق. افتح طلباً جديداً إذا احتجت مساعدة إضافية.'
          : ct.status === 'resolved' ? 'تم حل الطلب. إذا لم تُحل المشكلة افتح طلباً جديداً واذكر رقم هذا الطلب.'
          : 'سنرد عليك هنا، وسيصلك إشعار عند أي تحديث.'
      };
    }
    var faqItems = FAQ.map(function (f, i) {
      var open = s.faqOpen.indexOf(i) !== -1;
      return {
        q: f[0], a: f[1], id: 'faq-' + i, open: open, expanded: open ? 'true' : 'false',
        border: open ? '#B8D9FF' : C.stroke, rotate: open ? 'rotate(180deg)' : 'none',
        toggle: function () { var cur = self.state.faqOpen; self.setState({ faqOpen: open ? cur.filter(function (x) { return x !== i; }) : cur.concat([i]) }); }
      };
    });
    var openTickets = s.tickets.filter(function (t) { return t.status === 'new' || t.status === 'review'; }).length;
    var nameChanged = s.profileName.trim().replace(/\s+/g, ' ') !== (s.userName || '');
    var cpErrors = {
      empty: 'أدخل رقم الجوال الجديد',
      invalid: 'أدخل رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام',
      same: 'هذا هو رقمك الحالي. أدخل رقماً مختلفاً.',
      taken: 'هذا الرقم مسجل بحساب آخر. استخدم رقماً مختلفاً أو تواصل مع الدعم.'
    };

    var lc = s.lastCancel;
    var rateBtns = [1, 2, 3, 4, 5].map(function (n) {
      var on = n <= s.rateStars;
      return {
        aria: n + ' من 5', checked: s.rateStars === n ? 'true' : 'false',
        fill: on ? '#F4B400' : 'none', color: on ? '#F4B400' : C.strokeMedium,
        pick: function () { self.setState({ rateStars: n }); }
      };
    });
    var emptyCopy = {
      upcoming: ['لا توجد حجوزات قادمة', 'ابحث عن رحلة من الصفحة الرئيسية واحجز مقعدك.'],
      past: ['لا توجد حجوزات سابقة', 'تظهر هنا الرحلات المكتملة والملغاة.']
    }[listTab];

    // nav
    var activeTab = screen === 'home' ? 'home' : screen === 'account' ? 'account' : screen === 'bookings' ? 'bookings' : '';
    var nav = {};
    var navOn = screen === 'home' || screen === 'account' || screen === 'bookings';
    ['home', 'bookings', 'account'].forEach(function (k) {
      var on = activeTab === k;
      nav[k + 'Icon'] = on ? action : '#4B4B4B';
      nav[k + 'Bg'] = on ? '#EDEDED' : 'transparent';
      nav[k + 'Weight'] = on ? 700 : 500;
      nav[k + 'On'] = on;
      nav[k + 'Off'] = !on;
      nav[k + 'Current'] = on ? 'page' : 'false';
    });

    var otpBoxes = [0, 1, 2, 3].map(function (idx) {
      var ch = s.otp.charAt(idx);
      var active = s.otpFocused && !locked && idx === Math.min(s.otp.length, 3);
      var err = s.otpError === 'wrong' || s.otpError === 'expired';
      return {
        char: ch,
        bg: locked ? C.grey100 : C.white,
        border: err ? C.error : (active ? C.brand : (ch ? C.strokeMedium : C.stroke)),
        shadow: active ? '0 0 0 1px ' + C.brand : 'none'
      };
    });
    var otpReady = s.otp.length === 4 && !s.loading;
    var gateTitles = {
      trip: 'سجّل دخولك لإكمال الحجز',
      account: 'سجّل دخولك للوصول إلى حسابك',
      bookings: 'سجّل دخولك لعرض حجوزاتك',
      chats: 'سجّل دخولك لعرض محادثاتك',
      home: 'سجّل دخولك'
    };

    return {
      c: { action: action },
      pageBg: screen === 'splash' ? '#007AFF' : GREY_SCREENS[screen] ? C.bgSecondary : C.white,
      isLauncher: screen === 'launcher',
      isSplash: screen === 'splash',
      isOnboarding: screen === 'onboarding',
      statusFg: screen === 'splash' ? '#FFFFFF' : '#000000',
      statusBg: screen === 'splash' ? '#007AFF' : GREY_SCREENS[screen] && !WHITE_HEADER[screen] ? C.bgSecondary : C.white,

      isHome: screen === 'home',
      isResults: screen === 'results',
      isTrip: screen === 'trip',
      isPhone: screen === 'phone',
      isOtp: screen === 'otp',
      isProfileSetup: screen === 'profileSetup',
      isTerms: screen === 'terms',
      isBooking: screen === 'booking',
      isPayment: screen === 'payment',
      isExpired: screen === 'expired',
      isConfirmed: screen === 'confirmed',
      isBookings: screen === 'bookings',
      isProfile: screen === 'profile',
      isChangePhone: screen === 'changePhone',
      isDelete: screen === 'deleteAccount',
      isSupport: screen === 'support',
      isTicketNew: screen === 'ticketNew',
      isTicket: screen === 'ticket' && !!ct,
      isFaq: screen === 'faq',
      isDeleteSheet: s.sheet === 'deleteConfirm',
      profileName: s.profileName,
      profileNameInvalid: !!s.profileErr,
      profileNameClass: s.profileErr ? 'is-error' : '',
      saveNameDisabled: !nameChanged,
      saveNameBg: nameChanged ? action : C.grey100,
      saveNameColor: nameChanged ? C.white : C.placeholder,
      pendingPhone: s.pendingPhone,
      newPhoneInvalid: !!s.cpError,
      newPhoneClass: s.cpError ? 'is-error' : '',
      newPhoneErrText: cpErrors[s.cpError] || '',
      otpTitle: s.otpPurpose === 'changePhone' ? 'تأكيد رقمك الجديد' : 'أدخل رمز التحقق',
      otpPhoneDisplay: s.otpPurpose === 'changePhone' ? displayPhone(s.pendingPhone) : phoneDisplay,
      dx: dx,
      deleteAck: s.deleteAck,
      deleteErr: !!s.deleteErr,
      ticketRows: ticketRows,
      noTickets: ticketRows.length === 0,
      ticketTypes: ticketTypes,
      needsBooking: !!tf.type && tf.type !== 'inquiry',
      ticketBookingOptions: ticketBookingOptions,
      tForm: tf,
      tErr: { type: !!s.tErr.type, booking: !!s.tErr.booking, subject: !!s.tErr.subject, desc: !!s.tErr.desc },
      tBookingBorder: s.tErr.booking ? C.error : C.stroke,
      tSubjectClass: s.tErr.subject ? 'is-error' : '',
      tDescClass: s.tErr.desc ? 'is-error' : '',
      tDescCount: tf.desc.length + ' / 1000',
      ticketBtnLabel: s.loading ? 'جارٍ الإرسال…' : 'إرسال الطلب',
      tx: tx,
      faqItems: faqItems,
      hasOpenTickets: openTickets > 0,
      openTicketsText: openTickets === 1 ? 'طلب مفتوح' : openTickets === 2 ? 'طلبان مفتوحان' : openTickets + ' طلبات مفتوحة',
      isBookingDetail: screen === 'bookingDetail' && !!bk,
      isCancel: screen === 'cancel' && !!bk,
      isReportSheet: s.sheet === 'report',
      isRateSheet: s.sheet === 'rate',
      isCancelConfirmSheet: s.sheet === 'cancelConfirm',
      isCancelDoneSheet: s.sheet === 'cancelDone',
      d: d,
      cx: cx,
      reportNote: s.reportNote,
      rateComment: s.rateComment,
      rateStarBtns: rateBtns,
      rateLabel: s.rateStars ? RATE_LABELS[s.rateStars] : 'اختر عدد النجوم',
      rateCount: s.rateComment.length + ' / 300',
      rateDisabled: !s.rateStars,
      rateBtnBg: s.rateStars ? action : C.grey100,
      rateBtnColor: s.rateStars ? C.white : C.placeholder,
      doneTitle: lc ? (lc.full ? 'تم إلغاء الحجز' : 'تم إلغاء ' + seatsWord(lc.seats)) : '',
      doneBody: lc ? 'بدأنا استرداد ' + money(lc.net) + ' إلى ' + methodName(lc.method) + '. حالة الاسترداد الآن «قيد المعالجة»، وسيصلك إشعار عند اكتماله.' : '',
      isStub: screen === 'stub',
      isAccount: screen === 'account',
      isSettings: screen === 'settings',
      np: (function () {
        var o = {};
        ['trips', 'chat', 'refunds', 'promos'].forEach(function (k) {
          var on = !!s.notifPrefs[k];
          o[k + 'Checked'] = on ? 'true' : 'false';
          o[k + 'Bg'] = on ? '#34C759' : '#E5E5EA';
          o[k + 'Knob'] = on ? '-20px' : '0px'; // RTL: on slides the knob to the left, like iOS in Arabic
        });
        return o;
      })(),
      tripsOff: !s.notifPrefs.trips,
      lang: { arOn: s.lang === 'ar', enOn: s.lang === 'en', arChecked: s.lang === 'ar' ? 'true' : 'false', enChecked: s.lang === 'en' ? 'true' : 'false' },
      showNav: navOn,
      appClass: navOn ? 'with-nav' : '',
      showSheet: !!s.sheet,
      isGateSheet: s.sheet === 'gate',
      isDateSheet: s.sheet === 'date',
      isFilterSheet: s.sheet === 'filter',
      isLogoutSheet: s.sheet === 'logout',
      hasToast: !!s.toast,
      toast: s.toast,

      // home
      isGuest: !s.loggedIn,
      isUser: s.loggedIn,
      hello: firstName ? 'أهلاً ' + firstName : 'أهلاً بك',
      fromLabel: s.from || 'اختر مدينة الانطلاق',
      fromColor: s.from ? C.ink : C.placeholder,
      fromWeight: s.from ? 700 : 400,
      toLabel: s.to || 'اختر مدينة الوصول',
      toColor: s.to ? C.ink : C.placeholder,
      toWeight: s.to ? 700 : 400,
      hasUpcoming: !!up,
      up: up || {},
      upcomingTitle: up && up.active ? 'رحلتك الحالية' : 'رحلتك القادمة',
      upcomingAllLabel: upcomingCount > 1 ? 'كل الحجوزات' : 'حجوزاتي',

      // search
      isSearch: screen === 'search',
      fromPressed: s.cityTarget === 'from' ? 'true' : 'false',
      toPressed: s.cityTarget === 'to' ? 'true' : 'false',
      fromRowBg: s.cityTarget === 'from' ? C.soft : 'transparent',
      toRowBg: s.cityTarget === 'to' ? C.soft : 'transparent',
      fromCaptionColor: s.cityTarget === 'from' ? action : C.secondary,
      toCaptionColor: s.cityTarget === 'to' ? action : C.secondary,
      cityListTitle: s.cityTarget === 'from' ? 'اختر مدينة الانطلاق' : 'اختر مدينة الوصول',
      // The active row is where the user types; the other row shows the city already picked.
      fromInput: s.cityTarget === 'from' && s.cityEditing ? s.cityQuery : s.from,
      toInput: s.cityTarget === 'to' && s.cityEditing ? s.cityQuery : s.to,
      fromPlaceholder: s.cityTarget === 'from' ? (s.from || 'اكتب اسم مدينة الانطلاق') : 'اختر مدينة الانطلاق',
      toPlaceholder: s.cityTarget === 'to' ? (s.to || 'اكتب اسم مدينة الوصول') : 'اختر مدينة الوصول',
      routeReady: !!(s.from && s.to) && s.from !== s.to,
      routeSummary: s.from && s.to ? s.from + ' ← ' + s.to : '',
      dateFull: dateLabel(s.dateIdx) + ' ' + dayAt(s.dateIdx).getFullYear(),
      timeChips: timeChips,
      popular: popular,
      todayLabel: dateLabel(0),
      soonTrips: soonTrips,
      nav: nav,

      // results
      routeTitle: (s.from || '') + ' ← ' + (s.to || ''),
      resultsSub: dateLabel(s.dateIdx) + ' · ' + timeLabels,
      results: results,
      hasBaseResults: baseTrips.length > 0,
      hasResults: results.length > 0,
      filteredEmpty: screen === 'results' && baseTrips.length > 0 && results.length === 0,
      noResults: screen === 'results' && baseTrips.length === 0,
      resultsCount: results.length === 1 ? 'رحلة واحدة متاحة' : results.length === 2 ? 'رحلتان متاحتان' : results.length + ' رحلات متاحة',
      noResultsBody: 'لم نجد رحلات من ' + s.from + ' إلى ' + s.to + ' يوم ' + dateLabel(s.dateIdx) + '. جرّب تاريخاً آخر أو وقتاً مختلفاً.',
      filteredEmptyBody: 'في هذا اليوم ' + tripsWord(baseTrips.length) + '، لكن لا شيء منها يطابق التصفية المختارة.',
      sortChips: sortChips,
      hasFilters: filterCount > 0,
      filterCount: filterCount,
      filterAria: filterCount ? 'تصفية، ' + filterCount + ' مفعّلة' : 'تصفية',
      filterBorder: filterCount ? C.brand : C.stroke,
      filterBg: filterCount ? C.soft : C.white,
      fTimeChips: fTimeChips,
      fPriceChips: fPriceChips,
      applyLabel: draftCount === 0 ? 'لا توجد نتائج' : 'عرض ' + (draftCount === 1 ? 'رحلة واحدة' : draftCount === 2 ? 'رحلتين' : draftCount + ' رحلات'),

      // trip
      tripFrom: trip.from, tripTo: trip.to, tripDep: trip.dep, tripArr: trip.arr,
      tripDate: dateLabel(trip.dateIdx), tripDuration: trip.duration, tripSeatsText: seatsText(trip.seats),
      tripPriceText: money(trip.price),
      tripCarLine: trip.driver.car + ' · ' + trip.driver.plate,

      // booking
      isStep1: s.bStep === 1, isStep2: s.bStep === 2, isStep3: s.bStep === 3,
      stepBars: stepBars,
      stepLabel: 'الخطوة ' + s.bStep + ' من 3 · ' + stepNames[s.bStep - 1],
      seats: s.seats,
      seatsMax: s.seats >= trip.seats,
      seatsMin: s.seats <= 1,
      seatsUpColor: s.seats >= trip.seats ? C.placeholder : C.ink,
      seatsDownColor: s.seats <= 1 ? C.placeholder : C.ink,
      selfTravel: s.selfTravel,
      passengerForms: passengerForms,
      bagRule: 'المسموح في هذه الرحلة حتى حقيبتين لكل مقعد، أي ' + maxBags + ' حقائب لـ' + seatsWord(s.seats) + '.',
      bagRows: bagRows,
      noBags: s.bags.length === 0,
      bagsFull: bagsFull,
      addBagBorder: bagsFull ? C.stroke : action,
      addBagColor: bagsFull ? C.placeholder : action,
      summaryPassengers: summaryPassengers,
      bagsSummary: bagsSummaryText(s.bags),
      totalText: money(total),
      totalSub: seatsWord(s.seats) + ' × ' + money(trip.price),
      seatsWordText: seatsWord(s.seats),
      bCta: s.bStep === 3 ? (s.loading ? 'جارٍ حجز المقاعد…' : 'المتابعة للدفع') : 'التالي',

      // payment
      holdText: fmtClock(s.holdSeconds),
      holdMinutes: HOLD_SECONDS / 60,
      payMethods: payMethods,
      payFailed: s.payState === 'failed',
      payProcessing: s.payState === 'processing',
      payCta: s.payState === 'failed' ? 'إعادة المحاولة · ' + money(total) : 'ادفع ' + money(total),
      payMethodName: payMethodName,
      bookingRef: s.bookingRef,

      // my bookings
      bookingTabs: bookingTabs,
      bookingCards: bookingCards,
      tabHasItems: bookingCards.length > 0,
      tabEmpty: bookingCards.length === 0,
      tabEmptyTitle: emptyCopy[0],
      tabEmptyBody: emptyCopy[1],
      tabEmptyCta: listTab === 'upcoming',

      // sheets
      gateTitle: gateTitles[s.origin] || gateTitles.home,
      cityQuery: s.cityQuery,
      cityOptions: cityOptions,
      noCityMatch: cityOptions.length === 0,
      dateOptions: dateOptions,
      dateSheetRange: 'من اليوم حتى ' + dateLabel(DATE_RANGE - 1) + '، ولا يمكن اختيار تاريخ سابق.',

      // phone
      phone: s.phone,
      phoneInvalid: !!s.phoneError,
      phoneValidUi: !s.phoneError,
      phoneFieldClass: s.phoneError ? 'is-error' : '',
      phoneErrorText: s.phoneError === 'empty' ? 'أدخل رقم جوالك' : 'أدخل رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام',
      phoneSubmitDisabled: s.loading,
      phoneBtnLabel: s.loading ? 'جارٍ إرسال الرمز…' : 'إرسال رمز التحقق',
      loading: s.loading,

      // otp
      phoneDisplay: phoneDisplay,
      otp: s.otp,
      otpBoxes: otpBoxes,
      isLocked: locked,
      notLocked: !locked,
      otpInvalid: s.otpError === 'wrong' || s.otpError === 'expired',
      otpErrorText: s.otpError === 'expired' ? 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.' : 'الرمز غير صحيح. ' + remainingText(MAX_ATTEMPTS - s.attempts),
      otpInputDisabled: locked || s.loading,
      showTimer: !locked && s.seconds > 0,
      canResend: !locked && s.seconds === 0,
      timerText: fmtClock(s.seconds),
      otpSubmitDisabled: !otpReady,
      otpBtnBg: s.loading || otpReady ? action : C.grey100,
      otpBtnColor: s.loading || otpReady ? C.white : C.placeholder,
      otpBtnLabel: s.loading ? 'جارٍ التحقق…' : 'تحقق',

      // profile
      name: s.name,
      nameInvalid: !!s.nameError,
      nameFieldClass: s.nameError ? 'is-error' : '',
      nameErrorText: s.nameError === 'empty' ? 'أدخل اسمك الكامل' : 'أدخل اسمك الكامل (الاسم الأول واسم العائلة)',
      agree: s.agree,
      agreeError: !!s.agreeError,
      profileBtnLabel: s.loading ? 'جارٍ إنشاء الحساب…' : 'إنشاء الحساب',

      termsTitle: s.termsTitle,

      // chats / account
      isChat: screen === 'chat' && !!cv.ref,
      cv: cv,
      chatDraft: s.chatDraft,
      typingNow: !!s.typingRef && s.typingRef === s.chatRef,
      quickReplies: QUICK_REPLIES.map(function (q) { return { label: q, pick: function () { self.setState({ chatDraft: q }); } }; }),
      sendDisabled: !s.chatDraft.trim(),
      sendBg: s.chatDraft.trim() ? action : C.grey100,
      sendColor: s.chatDraft.trim() ? C.white : C.placeholder,
      unreadChats: unreadChats,
      hasUnreadChats: unreadChats > 0,
      bookingsNavAria: unreadChats ? 'حجوزاتي، ' + unreadChats + ' رسائل غير مقروءة من السائق' : 'حجوزاتي',
      isNotifs: screen === 'notifications',
      notifGroups: notifGroups,
      hasNotifs: s.notifs.length > 0,
      noNotifs: s.notifs.length === 0,
      unreadNotifs: unreadNotifs,
      hasUnreadNotifs: unreadNotifs > 0,
      bellAria: unreadNotifs ? 'الإشعارات، ' + unreadNotifs + ' غير مقروءة' : 'الإشعارات',
      hasBanner: !!s.banner,
      bannerTitle: s.banner ? s.banner.title : '',
      bannerBody: s.banner ? s.banner.body : '',
      displayName: s.userName || 'عبدالله الشهري',
      termsSections: (TERMS[s.termsTitle] || TERMS['الشروط والأحكام']).map(function (x) { return { h: x[0], p: x[1] }; }),
      tripDriverName: trip.driver.name,
      tripDriverRating: trip.driver.rating,
      tripDriverReviews: trip.driver.reviews,
      tripCar: trip.driver.car,
      tripPlate: trip.driver.plate,
      tripPrefs: trip.driver.prefs,
      tripPickup: POINTS[trip.from] || trip.from,
      tripDropoff: POINTS[trip.to] || trip.to,
      tripReviews: reviewsFor(trip.driver),

      // handlers
      noop: function () {},
      goHome: function () { self.setState({ screen: 'home', sheet: '' }); },
      // Tapping the app icon shows the splash, then lands on home.
      driverHref: (typeof window !== 'undefined' && window.DRIVER_APP_URL) || 'https://claude.ai/artifact/Xo4hcTutN78xEDCEp8SVxy',
      driverTarget: typeof window !== 'undefined' && window.DRIVER_APP_URL ? '_self' : '_blank',
      // Demo helpers for the sign-up steps (new-user number, OTP 1234, sample name)
      simPhone: function () { if (!self.state.loading) self.setState({ phone: '0551234567', phoneError: '' }); },
      simOtp: function () { if (self.state.otpError === 'locked' || self.state.loading) return; self.setState({ otp: '1234', otpError: '' }); self.verify('1234'); },
      simProfile: function () { self.setState({ name: 'محمد سعد العتيبي', nameError: '', agree: true, agreeError: false }); },
      openApp: function () { self.setState({ screen: 'splash', sheet: '' }); self.later(1400, function () { self.setState({ screen: self.state.loggedIn ? 'home' : 'onboarding' }); }); },
      // Onboarding: "start" goes to phone login (back returns here), "browse" opens home as a guest.
      onbStart: function () { self.setState({ screen: 'phone', origin: 'onboarding', phoneError: '' }); },
      onbGuest: function () { self.setState({ screen: 'home', sheet: '' }); },
      headerLogin: function () { self.setState({ screen: 'phone', origin: 'home', phoneError: '' }); },
      openSearch: function () { self.setState({ screen: 'search', sheet: '', cityQuery: '', cityTarget: self.state.from ? 'to' : 'from' }); },
      openFrom: function () { self.setState({ cityTarget: 'from', cityQuery: '', cityEditing: true }); },
      openTo: function () { self.setState({ cityTarget: 'to', cityQuery: '', cityEditing: true }); },
      openDate: function () { self.setState({ sheet: 'date' }); },
      backFromResults: function () { self.setState({ screen: 'search', sheet: '', cityQuery: '' }); },
      swap: function () { self.setRoute({ from: self.state.to, to: self.state.from }); },
      onCityQuery: function (e) { self.setState({ cityQuery: e.target.value, cityEditing: true }); },
      submitSearch: function (e) { self.submitSearch(e); },
      searchNextDay: function () { self.setState({ dateIdx: Math.min(DATE_RANGE - 1, self.state.dateIdx + 1) }); },
      openFilter: function () { self.setState({ sheet: 'filter', fTimes: self.state.filterTimes.slice(), fMax: self.state.filterMax }); },
      clearDraft: function () { self.setState({ fTimes: [], fMax: 0 }); },
      applyFilter: function () { self.setState({ filterTimes: self.state.fTimes.slice(), filterMax: self.state.fMax, sheet: '' }); },
      clearFilterNow: function () { self.setState({ filterTimes: [], filterMax: 0 }); },
      backFromTrip: function () { self.setState({ screen: self.state.tripBack === 'results' ? 'results' : 'home', sheet: '' }); },
      openTripAgain: function () { self.setState({ screen: 'trip', sheet: '', holdSeconds: 0, payState: '' }); },
      bookNow: function () { self.openGateOrGo('trip'); },
      bookingBack: function () {
        if (self.state.loading) return;
        if (self.state.bStep > 1) self.setState({ bStep: self.state.bStep - 1 });
        else self.setState({ screen: 'trip' });
      },
      bNext: function () { self.bookingNext(); },
      editStep1: function () { self.setState({ bStep: 1 }); },
      editStep2: function () { self.setState({ bStep: 2 }); },
      toggleSelf: function (e) {
        var on = !!e.target.checked;
        self.setState({ selfTravel: on, pErrors: [], passengers: resizePassengers(self.state.passengers, self.state.seats - (on ? 1 : 0)) });
      },
      addBag: function () {
        if (self.state.bags.length >= self.state.seats * BAGS_PER_SEAT) return;
        self.setState({ bags: self.state.bags.concat([{ size: 'medium' }]) });
      },
      payBack: function () { if (self.state.payState !== 'processing') self.setState({ screen: 'booking', bStep: 3 }); },
      pay: function () { self.pay(); },
      goBookings: function () { self.setState({ screen: 'bookings', bookingsTab: 'upcoming', sheet: '' }); },
      backToBookings: function () { self.setState({ screen: self.state.detailBack || 'bookings', detailBack: 'bookings', sheet: '' }); },
      openNotifs: function () { self.setState({ screen: 'notifications', sheet: '', banner: null }); },
      markAllRead: function () { self.setState({ notifs: self.state.notifs.map(function (n) { return Object.assign({}, n, { read: true }); }) }); },
      chatBack: function () {
        var back = self.state.chatBack || 'bookingDetail';
        var patch = { screen: back, typingRef: '' };
        if (back === 'bookingDetail') patch.detailRef = self.state.chatRef;
        self.setState(patch);
      },
      openDetailFromChat: function () { self.setState({ screen: 'bookingDetail', detailRef: self.state.chatRef, detailBack: 'bookings', sheet: '' }); },
      openChatFromDetail: function () { self.openChat(self.state.detailRef, 'bookingDetail'); },
      onChatDraft: function (e) { self.setState({ chatDraft: e.target.value.slice(0, 500) }); },
      sendMessage: function (e) { self.sendMessage(e); },
      openBanner: function () {
        var b = self.state.banner;
        if (!b) return;
        var back = { home: 1, bookings: 1, notifications: 1, account: 1, bookingDetail: 1 }[self.state.screen] ? self.state.screen : 'bookingDetail';
        self.openChat(b.ref, back);
      },
      backToDetail: function () { self.setState({ screen: 'bookingDetail', sheet: '', cancelErr: false }); },
      openReport: function () { self.setState({ sheet: 'report' }); },
      onReportNote: function (e) { self.setState({ reportNote: e.target.value.slice(0, 300) }); },
      submitReport: function () { self.submitReport(); },
      openRate: function () { self.setState({ sheet: 'rate', rateStars: 0, rateComment: '' }); },
      onRateComment: function (e) { self.setState({ rateComment: e.target.value.slice(0, 300) }); },
      submitRating: function () { self.submitRating(); },
      startCancel: function () { self.setState({ screen: 'cancel', cancelSel: [], cancelErr: false, sheet: '' }); },
      toggleAllSeats: function () { self.setState({ cancelErr: false, cancelSel: cx.allSel ? [] : cx.activeIdx.slice() }); },
      cancelNext: function () {
        if (!self.state.cancelSel.length) { self.setState({ cancelErr: true }); return; }
        self.setState({ sheet: 'cancelConfirm' });
      },
      confirmCancel: function () { self.confirmCancel(); },
      openSupport: function () { self.setState({ screen: 'support', supportBack: self.state.screen, sheet: '' }); },
      tabHome: function () { self.setState({ screen: 'home', sheet: '' }); },
      tabBookings: function () { self.openGateOrGo('bookings'); },
      tabAccount: function () { self.openGateOrGo('account'); },
      gateContinue: function () { self.setState({ sheet: '', screen: 'phone', phoneError: '' }); },
      closeSheet: function () { self.setState({ sheet: '' }); },
      phoneBack: function () {
        if (self.state.loading) return;
        self.setState({ screen: self.state.origin === 'trip' ? 'trip' : self.state.origin === 'onboarding' ? 'onboarding' : 'home', phoneError: '' });
      },
      onPhone: function (e) {
        var v = toWesternDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 12);
        self.setState({ phone: v, phoneError: '' });
      },
      submitPhone: function (e) { self.submitPhone(e); },
      onOtp: function (e) {
        if (self.state.otpError === 'locked') return;
        var v = toWesternDigits(e.target.value).replace(/\D/g, '').slice(0, 4);
        self.setState({ otp: v, otpError: v ? '' : self.state.otpError });
        if (v.length === 4) self.verify(v);
      },
      otpFocus: function () { self.setState({ otpFocused: true }); },
      otpBlur: function () { self.setState({ otpFocused: false }); },
      submitOtp: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (self.state.otp.length === 4) self.verify(self.state.otp);
      },
      resend: function () {
        if (self.state.seconds > 0 || self.state.otpError === 'locked') return;
        self.flash({ seconds: RESEND_SECONDS, otp: '', otpError: '' }, 'أرسلنا رمزاً جديداً إلى جوالك');
      },
      editNumber: function () {
        if (self.state.loading) return;
        self.setState({ screen: self.state.otpPurpose === 'changePhone' ? 'changePhone' : 'phone', otp: '', otpError: '' });
      },
      useOtherNumber: function () {
        if (self.state.otpPurpose === 'changePhone') { self.setState({ screen: 'changePhone', pendingPhone: '', otp: '', otpError: '', attempts: 0 }); return; }
        self.setState({ screen: 'phone', phone: '', otp: '', otpError: '', attempts: 0 });
      },
      openProfile: function () { self.setState({ screen: 'profile', profileName: self.state.userName, profileErr: false, otpPurpose: 'login', cpError: '' }); },
      onProfileName: function (e) { self.setState({ profileName: e.target.value, profileErr: false }); },
      saveName: function (e) { self.saveName(e); },
      startChangePhone: function () { self.setState({ screen: 'changePhone', pendingPhone: '', cpError: '' }); },
      onNewPhone: function (e) { self.setState({ pendingPhone: toWesternDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 12), cpError: '' }); },
      submitNewPhone: function (e) { self.submitNewPhone(e); },
      openDelete: function () { self.setState({ screen: 'deleteAccount', deleteAck: false, deleteErr: false }); },
      openSettings: function () { self.setState({ screen: 'settings', sheet: '' }); },
      settingsBack: function () { self.setState({ screen: 'account', sheet: '' }); },
      deleteBack: function () { self.setState({ screen: 'settings', sheet: '' }); },
      toggle_trips: function () { var p = Object.assign({}, self.state.notifPrefs); p.trips = !p.trips; self.setState({ notifPrefs: p }); },
      toggle_chat: function () { var p = Object.assign({}, self.state.notifPrefs); p.chat = !p.chat; self.setState({ notifPrefs: p }); },
      toggle_refunds: function () { var p = Object.assign({}, self.state.notifPrefs); p.refunds = !p.refunds; self.setState({ notifPrefs: p }); },
      toggle_promos: function () { var p = Object.assign({}, self.state.notifPrefs); p.promos = !p.promos; self.setState({ notifPrefs: p }); },
      lang_ar: function () { self.setState({ lang: 'ar' }); },
      // The prototype is Arabic only; picking English is recorded but the UI stays Arabic.
      lang_en: function () { self.flash({ lang: 'en' }, 'سيتم عرض التطبيق بالإنجليزية (غير متاح في النموذج التجريبي)'); },
      toggleDeleteAck: function (e) { self.setState({ deleteAck: !!e.target.checked, deleteErr: false }); },
      deleteNext: function () {
        if (!self.state.deleteAck) { self.setState({ deleteErr: true }); return; }
        self.setState({ sheet: 'deleteConfirm' });
      },
      confirmDelete: function () { self.flash(Object.assign({}, BASE_STATE, { screen: 'home' }), 'استلمنا طلب حذف حسابك'); },
      openSupportHub: function () { self.setState({ screen: 'support', sheet: '' }); },
      supportBack: function () { self.setState({ screen: self.state.supportBack || 'account', supportBack: 'account' }); },
      newTicket: function () { self.setState({ screen: 'ticketNew', tErr: {}, tForm: { type: '', bookingRef: '', subject: '', desc: '' } }); },
      onTicketSubject: function (e) { var f = Object.assign({}, self.state.tForm, { subject: e.target.value }); self.setState({ tForm: f, tErr: Object.assign({}, self.state.tErr, { subject: false }) }); },
      onTicketDesc: function (e) { var f = Object.assign({}, self.state.tForm, { desc: e.target.value.slice(0, 1000) }); self.setState({ tForm: f, tErr: Object.assign({}, self.state.tErr, { desc: false }) }); },
      submitTicket: function (e) { self.submitTicket(e); },
      openTicketBooking: function () {
        var t = self.state.tickets.filter(function (x) { return x.ref === self.state.ticketRef; })[0];
        if (t && t.bookingRef) self.setState({ screen: 'bookingDetail', detailRef: t.bookingRef, detailBack: 'ticket' });
      },
      openFaq: function () { self.setState({ screen: 'faq', faqBack: self.state.screen === 'support' ? 'support' : 'account' }); },
      faqBack: function () { self.setState({ screen: self.state.faqBack || 'account' }); },
      openSupportFromFaq: function () { self.setState({ screen: 'support', supportBack: 'faq' }); },
      openAbout: function () { self.openTermsPage('من نحن'); },
      onName: function (e) { self.setState({ name: e.target.value, nameError: '' }); },
      toggleAgree: function (e) { self.setState({ agree: !!e.target.checked, agreeError: false }); },
      submitProfile: function (e) { self.submitProfile(e); },
      openTerms: function () { self.openTermsPage('الشروط والأحكام'); },
      openPrivacy: function () { self.openTermsPage('سياسة الخصوصية'); },
      termsBack: function () { self.setState({ screen: self.state.termsBackTo }); },
      seatsUp: function () { self.setSeats(Math.min(trip.seats, self.state.seats + 1)); },
      seatsDown: function () { self.setSeats(Math.max(1, self.state.seats - 1)); },
      askLogout: function () { self.setState({ sheet: 'logout' }); },
      confirmLogout: function () { self.flash(Object.assign({}, BASE_STATE, { screen: 'home' }), 'تم تسجيل الخروج'); }
    };
  }
}
