'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Brand } from './components/ui'

// ─── Language context ──────────────────────────────────────────────────────────

type Lang = 'en' | 'ar'
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en', setLang: () => {},
})

// ─── All copy — English + Arabic ──────────────────────────────────────────────

const COPY = {
  en: {
    nav: { reel: 'Reel', compare: 'Compare', features: 'Features', pricing: 'Pricing', signIn: 'Sign In', langBtn: 'عربي' },
    hero: {
      label: 'AI-Powered Hairstyle & Makeup Preview',
      h1a: 'See the Look', h1b: 'Before', h1c: 'the Chair',
      sub: 'SalonAI generates photorealistic AI previews of hairstyles and makeup for your clients — in seconds, before they commit.',
      cta1: 'Start Free Trial →', cta2: 'See the Reel ↓', aiPreview: 'AI Preview',
    },
    stats: [
      { value: '100+', label: 'Style Options' },
      { value: '30s',  label: 'Avg. Result Time' },
      { value: '2',    label: 'Genders Supported' },
    ],
    reel: {
      label: '30 Signature AI Looks',
      h2: 'Every look your clients dream of',
      sub: 'From natural beauty to high-fashion editorial — our AI catalog covers every style, every occasion, every client.',
      cta: 'Try It Free →',
    },
    demo: {
      label: 'How It Works',
      h2: ['Pick a style.', 'See it on your client.'],
      sub: 'Choose hairstyle, hair color, and makeup in seconds. Our AI merges all your selections into a photorealistic preview — before anyone sits in the chair.',
      steps: [
        'Select hairstyle from 100+ catalog options',
        'Choose hair color from a full swatch palette',
        'Layer on any makeup look — glam, natural, or editorial',
        'AI merges everything into one photorealistic result',
      ],
      cta: 'Try It Free →',
      windowTitle: 'SalonAI — Style Preview',
      step1: 'Step 1 of 3', step2: 'Step 2 of 3', step3: 'Step 3 of 3',
      chooseHair: 'Choose hairstyle', pickColor: 'Pick hair color', selectMakeup: 'Select makeup style',
      selectedLabel: 'Selected:',
      hairOptions: ['Natural Waves', 'Sleek Bob', 'Soft Curls', 'French Braid'],
      colorNames:  ['Dark Brown', 'Blonde', 'Black', 'Auburn', 'Caramel'],
      makeupOptions: ['Soft Glam', 'Smokey Eye', 'Arabic Glam', 'Korean Glow'],
      generating: 'Generating AI preview...',
      mergeTags: ['Soft Curls', '⬤ Blonde', 'Arabic Glam'],
      aiGenerated: 'AI Generated', resultName: 'Arabic Glam',
      previewReady: '✓ Preview ready in 24 seconds',
    },
    catalog: { label: 'Browse the Catalog', h2: 'Every style, instantly' },
    splitMorph: {
      label: 'AI Transformation',
      h2: ['One photo.', 'Any look imaginable.'],
      sub: 'Every style, generated in real time.',
    },
    compare: {
      label: 'See The Difference', h2: 'Drag to compare looks',
      sub: 'Slide the handle to reveal any look side by side.',
      labels: ['Natural Beauty', 'Arabic Glam', 'Korean Soft', 'Red Carpet'],
    },
    features: {
      label: 'Platform Features', h2: 'Everything your salon needs',
      cards: [
        { icon: '✦', title: 'AI Style Preview', body: 'Upload a client photo, pick a style, and get a photorealistic AI preview in under 30 seconds.' },
        { icon: '◈', title: 'Men & Women',       body: '100+ styles — catalog, signature, bridal, and smart AI mode for both men and women.' },
        { icon: '◇', title: 'Credit-Based',      body: 'No subscriptions. Buy credits when you need them, use them at your own pace.' },
      ],
    },
    testimonials: [
      { quote: 'SalonAI changed how we consult. Clients love seeing results before committing to a look.',     author: 'Ahmad K.', role: 'Salon Owner, Amman' },
      { quote: 'The previews are incredibly realistic. Far fewer clients change their mind after styling.',     author: 'Lina S.',  role: 'Beauty Salon, Zarqa' },
      { quote: 'Fast, easy, and the credit system fits perfectly for our daily session volume.',               author: 'Rami T.',  role: 'Hair Studio, Irbid' },
    ],
    pricing: {
      label: 'Simple Credit Packages', h2: 'Pay Only For What You Use',
      sub: 'No subscriptions. Buy credits when you need them, use them at your own pace.',
      cta: 'Contact via WhatsApp',
      note: 'Exact package prices set by your account manager. Pay by CliQ transfer or cash.',
      tiers: [
        { name: 'Bronze', tag: 'Starter',    desc: 'Perfect for new salons testing AI styling with their clients.',             featured: false },
        { name: 'Silver', tag: 'Best Value', desc: 'Our most popular package for growing salons with daily sessions.',          featured: true  },
        { name: 'Gold',   tag: 'Studio',     desc: 'For high-volume studios running multiple AI sessions every day.',           featured: false },
      ],
    },
    faq: {
      label: 'FAQ', h2: 'Common Questions',
      items: [
        { q: 'What is SalonAI?',                 a: 'SalonAI is an AI-powered hairstyle and makeup preview platform for salons. Clients see realistic previews of any style before committing.' },
        { q: 'How does the AI preview work?',    a: 'Upload a client photo, choose a style from our catalog (or let smart AI suggest one), and receive a photorealistic preview in under 30 seconds.' },
        { q: "Is my client's photo stored?",     a: "Photos are used only for AI generation and are not permanently stored or shared. Your clients' privacy is fully protected." },
        { q: 'How do I pay for credits?',        a: 'Credits are purchased via CliQ transfer or cash. Send your transfer screenshot on WhatsApp and our team confirms your top-up — usually within minutes.' },
        { q: 'Does it work for both genders?',   a: 'Yes. Full catalogs for men and women including signature looks, bridal styles, catalog cuts, and smart AI mode.' },
      ],
    },
    footer: { copyright: '© 2025 SalonAI. All rights reserved.', whatsapp: 'WhatsApp', signIn: 'Sign In' },
  },

  ar: {
    nav: { reel: 'معرض', compare: 'مقارنة', features: 'المميزات', pricing: 'الأسعار', signIn: 'تسجيل الدخول', langBtn: 'EN' },
    hero: {
      label: 'معاينة الشعر والمكياج بالذكاء الاصطناعي',
      h1a: 'شاهدي الإطلالة', h1b: 'قبل', h1c: 'الكرسي',
      sub: 'يُنشئ SalonAI معاينات واقعية للشعر والمكياج لعملائك — في ثوانٍ، قبل أن يلتزموا بأي تغيير.',
      cta1: 'ابدأي التجربة المجانية ←', cta2: '↓ شاهدي المعرض', aiPreview: 'معاينة AI',
    },
    stats: [
      { value: '١٠٠+', label: 'خيار تسريحة' },
      { value: '٣٠ث',  label: 'متوسط وقت النتيجة' },
      { value: '٢',    label: 'جنسان مدعومان' },
    ],
    reel: {
      label: '٣٠ إطلالة AI مميزة',
      h2: 'كل إطلالة تحلم بها عميلتك',
      sub: 'من الجمال الطبيعي إلى الموضة الراقية — يغطي كتالوج الذكاء الاصطناعي كل تسريحة، لكل مناسبة، لكل عميلة.',
      cta: '← جرّبيه مجاناً',
    },
    demo: {
      label: 'كيف يعمل',
      h2: ['اختاري الإطلالة.', 'شاهديها على عميلتك.'],
      sub: 'اختاري تسريحة الشعر ولونه والمكياج في ثوانٍ. يدمج الذكاء الاصطناعي جميع اختياراتك في معاينة واقعية — قبل أن يجلس أحد على الكرسي.',
      steps: [
        'اختاري تسريحة من أكثر من ١٠٠ خيار في الكتالوج',
        'اختاري لون الشعر من لوحة ألوان كاملة',
        'أضيفي أي إطلالة مكياج — جلام أو طبيعي أو تحريري',
        'يدمج الذكاء الاصطناعي كل شيء في نتيجة واقعية واحدة',
      ],
      cta: '← جرّبيه مجاناً',
      windowTitle: 'SalonAI — معاينة الإطلالة',
      step1: 'الخطوة ١ من ٣', step2: 'الخطوة ٢ من ٣', step3: 'الخطوة ٣ من ٣',
      chooseHair: 'اختاري تسريحة الشعر', pickColor: 'اختاري لون الشعر', selectMakeup: 'اختاري أسلوب المكياج',
      selectedLabel: 'المختار:',
      hairOptions: ['تموجات طبيعية', 'قصة بوب أنيقة', 'تجعيدات ناعمة', 'ضفيرة فرنسية'],
      colorNames:  ['بني غامق', 'أشقر', 'أسود', 'كستنائي', 'كراميل'],
      makeupOptions: ['جلام ناعم', 'عيون دخانية', 'جلام عربي', 'إشراقة كورية'],
      generating: 'جاري إنشاء معاينة الذكاء الاصطناعي...',
      mergeTags: ['تجعيدات ناعمة', '⬤ أشقر', 'جلام عربي'],
      aiGenerated: 'تم بالذكاء الاصطناعي', resultName: 'جلام عربي',
      previewReady: '✓ المعاينة جاهزة في ٢٤ ثانية',
    },
    catalog: { label: 'تصفّحي الكتالوج', h2: 'كل تسريحة، فوراً' },
    splitMorph: {
      label: 'تحويل بالذكاء الاصطناعي',
      h2: ['صورة واحدة.', 'أي إطلالة تخيلتِها.'],
      sub: 'كل تسريحة، تُولَّد في الوقت الفعلي.',
    },
    compare: {
      label: 'اكتشفي الفارق', h2: 'اسحبي للمقارنة بين الإطلالات',
      sub: 'حرّكي المقبض للكشف عن أي إطلالة جنباً إلى جنب.',
      labels: ['جمال طبيعي', 'جلام عربي', 'ناعمة كورية', 'السجادة الحمراء'],
    },
    features: {
      label: 'مميزات المنصة', h2: 'كل ما يحتاجه صالونك',
      cards: [
        { icon: '✦', title: 'معاينة الإطلالة بـ AI', body: 'ارفعي صورة العميلة، اختاري التسريحة، واحصلي على معاينة واقعية في أقل من ٣٠ ثانية.' },
        { icon: '◈', title: 'رجال ونساء',            body: 'أكثر من ١٠٠ تسريحة — كتالوج، إطلالات مميزة، عرائس، ووضع الذكاء الاصطناعي الذكي للجنسين.' },
        { icon: '◇', title: 'نظام الرصيد',           body: 'لا اشتراكات. اشترِ أرصدة عند الحاجة، استخدمها بوتيرتك الخاصة.' },
      ],
    },
    testimonials: [
      { quote: 'غيّر SalonAI طريقة استشارتنا. العملاء يحبون رؤية النتيجة قبل الالتزام بالإطلالة.',    author: 'أحمد ك.', role: 'صاحب صالون، عمّان' },
      { quote: 'المعاينات واقعية بشكل لافت. عدد أقل بكثير من العملاء يغيرون رأيهم بعد التصفيف.',    author: 'لينا س.',  role: 'صالون تجميل، الزرقاء' },
      { quote: 'سريع وسهل، ونظام الرصيد يناسب تماماً حجم جلساتنا اليومية.',                          author: 'رامي ت.',  role: 'استوديو شعر، إربد' },
    ],
    pricing: {
      label: 'باقات رصيد بسيطة', h2: 'ادفعي فقط ما تستخدمين',
      sub: 'لا اشتراكات. اشترِ أرصدة عند الحاجة، استخدمها بوتيرتك الخاصة.',
      cta: 'تواصل عبر واتساب',
      note: 'أسعار الباقات محددة من قِبَل مدير حسابك. الدفع عبر CliQ أو نقداً.',
      tiers: [
        { name: 'برونز', tag: 'مبتدئ',       desc: 'مثالي للصالونات الجديدة التي تختبر خدمة AI.',                     featured: false },
        { name: 'فضي',  tag: 'الأفضل قيمة', desc: 'باقتنا الأكثر شيوعاً للصالونات المتنامية ذات الجلسات اليومية.',  featured: true  },
        { name: 'ذهبي', tag: 'استوديو',      desc: 'للاستوديوهات عالية الحجم التي تُشغّل جلسات AI متعددة يومياً.',  featured: false },
      ],
    },
    faq: {
      label: 'الأسئلة الشائعة', h2: 'أسئلة شائعة',
      items: [
        { q: 'ما هو SalonAI؟',                      a: 'SalonAI هو منصة AI لمعاينة تسريحات الشعر والمكياج. يرى العملاء معاينات واقعية لأي تسريحة قبل الالتزام بها.' },
        { q: 'كيف تعمل معاينة الذكاء الاصطناعي؟',  a: 'ارفعي صورة العميلة، اختاري تسريحة من الكتالوج أو اتركي الذكاء الاصطناعي يقترح، وستحصلين على معاينة واقعية في أقل من ٣٠ ثانية.' },
        { q: 'هل يتم حفظ صورة عميلتي؟',             a: 'الصور تُستخدم لإنشاء الذكاء الاصطناعي فقط ولا تُخزَّن أو تُشارَك بشكل دائم. خصوصية عميلاتك محمية تماماً.' },
        { q: 'كيف أدفع مقابل الأرصدة؟',             a: 'يتم شراء الأرصدة عبر تحويل CliQ أو نقداً. أرسل صورة التحويل على واتساب وسيقوم فريقنا بتأكيد الشحن في غضون دقائق.' },
        { q: 'هل يعمل للرجال والنساء؟',              a: 'نعم. كتالوج كامل للرجال والنساء يشمل الإطلالات المميزة وتسريحات العرائس وقصات الكتالوج ووضع الذكاء الاصطناعي الذكي.' },
      ],
    },
    footer: { copyright: '© ٢٠٢٥ SalonAI. جميع الحقوق محفوظة.', whatsapp: 'واتساب', signIn: 'تسجيل الدخول' },
  },
} as const

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_URL = 'https://wa.me/962795080561'

const ALL_LOOKS = [
  { src: '/women_signature/01_Clean_Natural_Beauty.png', label: 'Natural Beauty' },
  { src: '/women_signature/02_Soft_Glam_Classic.png',   label: 'Soft Glam Classic' },
  { src: '/women_signature/03_Bridal_Rose_Glam.png',    label: 'Bridal Rose Glam' },
  { src: '/women_signature/04_Luxury_Bridal_Glow.png',  label: 'Luxury Bridal Glow' },
  { src: '/women_signature/05_Arabic_Glam.png',         label: 'Arabic Glam' },
  { src: '/women_signature/06_Red_Carpet_Red_Lip.png',  label: 'Red Carpet Red Lip' },
  { src: '/women_signature/07_Smokey_Evening.png',      label: 'Smokey Evening' },
  { src: '/women_signature/08_Peachy_Day_Glam.png',     label: 'Peachy Day Glam' },
  { src: '/women_signature/09_Korean_Soft_Makeup.png',  label: 'Korean Soft Makeup' },
  { src: '/women_signature/10_Editorial_Berry.png',     label: 'Editorial Berry' },
  { src: '/women_signature/11_Warm_Bronze_Glam.png',    label: 'Warm Bronze Glam' },
  { src: '/women_signature/12_Nude_Sculpted_Glam.png',  label: 'Nude Sculpted Glam' },
  { src: '/women_signature/13_Fresh_Pink_Salon_Look.png', label: 'Fresh Pink Salon' },
  { src: '/women_signature/14_Mocha_Soft_Glam.png',    label: 'Mocha Soft Glam' },
  { src: '/women_signature/15_High_Fashion_Matte.png',  label: 'High Fashion Matte' },
  { src: '/women_signature/16_Sun-Kissed_Summer.png',   label: 'Sun-Kissed Summer' },
  { src: '/women_signature/17_Soft_Plum_Evening.png',   label: 'Soft Plum Evening' },
  { src: '/women_signature/18_Minimal_No-Makeup.png',   label: 'Minimal No-Makeup' },
  { src: '/women_signature/19_Full_Glam_Salon.png',     label: 'Full Glam Salon' },
  { src: '/women_signature/20_Elegant_Mature_Glam.png', label: 'Elegant Mature Glam' },
  { src: '/women_signature/21_Glossy_Espresso_Chic.png', label: 'Glossy Espresso Chic' },
  { src: '/women_signature/22_Champagne_Blonde_Glam.png', label: 'Champagne Blonde Glam' },
  { src: '/women_signature/23_Copper_Peach_Glow.png',  label: 'Copper Peach Glow' },
  { src: '/women_signature/24_Cool_Taupe_Smokey.png',  label: 'Cool Taupe Smokey' },
  { src: '/women_signature/25_Rosy_French_Bob.png',    label: 'Rosy French Bob' },
  { src: '/women_signature/26_Caramel_Balayage_Nude.png', label: 'Caramel Balayage' },
  { src: '/women_signature/27_Icy_Silver_Editorial.png', label: 'Icy Silver Editorial' },
  { src: '/women_signature/28_Soft_Burgundy_Waves.png', label: 'Soft Burgundy Waves' },
  { src: '/women_signature/29_Golden_Bridal_Updo.png', label: 'Golden Bridal Updo' },
  { src: '/women_signature/30_Clean_Copper_Bob.png',   label: 'Clean Copper Bob' },
]

const MARQUEE_A   = ALL_LOOKS.filter((_, i) => i % 3 === 0)
const MARQUEE_B   = ALL_LOOKS.filter((_, i) => i % 3 === 1)
const SPLIT_LEFT  = ALL_LOOKS.filter((_, i) => i % 2 === 0)
const SPLIT_RIGHT = ALL_LOOKS.filter((_, i) => i % 2 === 1)

const DEMO_COLORS = [
  { hex: '#2C1810' },
  { hex: '#C9993F' },
  { hex: '#111111' },
  { hex: '#B87878' },
  { hex: '#7B5230' },
]

const DEMO_SEQ: { phase: 'hair' | 'color' | 'makeup' | 'merge' | 'result'; ms: number }[] = [
  { phase: 'hair',   ms: 3000 },
  { phase: 'color',  ms: 2600 },
  { phase: 'makeup', ms: 2800 },
  { phase: 'merge',  ms: 2700 },
  { phase: 'result', ms: 3800 },
]

// ─── Animation helpers ─────────────────────────────────────────────────────────

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

function mount(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: 'easeOut' as const },
  }
}

// ─── Ken-Burns reel ───────────────────────────────────────────────────────────

function useReel(total: number, ms: number) {
  const [state, setState] = useState({ curr: 0, prev: -1 })
  useEffect(() => {
    const t = setInterval(() => setState(s => ({ curr: (s.curr + 1) % total, prev: s.curr })), ms)
    return () => clearInterval(t)
  }, [total, ms])
  return state
}

function ReelFrame({ images, intervalMs = 3000, className = '' }: { images: { src: string; label: string }[]; intervalMs?: number; className?: string }) {
  const { curr, prev } = useReel(images.length, intervalMs)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {prev >= 0 && (
        <motion.div key={`prev-${prev}`} className="absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.0, ease: 'easeInOut' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[prev].src} alt={images[prev].label} className="h-full w-full object-cover" loading="lazy" />
        </motion.div>
      )}
      <motion.div key={`curr-${curr}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.0 }} animate={{ opacity: 1, scale: 1.04 }}
        transition={{ opacity: { duration: 2.0, ease: 'easeInOut' }, scale: { duration: intervalMs / 1000 + 0.5, ease: 'linear' } }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[curr].src} alt={images[curr].label} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={`label-${curr}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}
          className="absolute bottom-0 inset-x-0 flex items-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 pt-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">AI Preview</p>
            <p className="mt-1 text-lg font-semibold text-white">{images[curr].label}</p>
          </div>
          <div className="ms-auto flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-500 ${i === curr ? 'w-4 h-1.5 bg-fuchsia-300' : 'w-1.5 h-1.5 bg-white/30'}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Demo phase components ────────────────────────────────────────────────────

function HairPhase() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  const [selIdx, setSelIdx] = useState<number | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelIdx(2), 1800)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: 'easeOut' as const }} className="w-full">
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">{d.step1}</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">{d.chooseHair}</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {d.hairOptions.map((opt, i) => {
          const active = selIdx === i
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.13, duration: 0.35, ease: 'easeOut' as const }}
              className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-500 ${active ? 'border-amber-300/60 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-950/40' : 'border-white/10 bg-white/[0.05] text-zinc-400'}`}>
              {active && <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="me-1 text-amber-300">✓</motion.span>}
              {opt}
              {active && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} className="absolute inset-x-0 bottom-0 h-0.5 origin-start bg-fuchsia-400/60" />}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function ColorPhase() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  const [selIdx, setSelIdx] = useState<number | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelIdx(1), 1600)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: 'easeOut' as const }} className="w-full">
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">{d.step2}</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">{d.pickColor}</h3>
      <div className="flex justify-center gap-3">
        {DEMO_COLORS.map((c, i) => {
          const active = selIdx === i
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.35, ease: 'easeOut' as const }} className="flex flex-col items-center gap-1.5">
              <div className={`relative h-10 w-10 rounded-full transition-all duration-500 ${active ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-zinc-950' : 'ring-1 ring-white/10'}`} style={{ background: c.hex }}>
                {active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center text-xs text-white drop-shadow">✓</motion.span>}
              </div>
              <span className={`text-[9px] font-medium transition-colors ${active ? 'text-amber-200' : 'text-zinc-600'}`}>{d.colorNames[i]}</span>
            </motion.div>
          )
        })}
      </div>
      {selIdx !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-center text-[11px] text-zinc-500">
          {d.selectedLabel} <span className="font-semibold text-amber-200">{d.colorNames[selIdx]}</span>
        </motion.p>
      )}
    </motion.div>
  )
}

function MakeupPhase() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  const [selIdx, setSelIdx] = useState<number | null>(null)
  useEffect(() => {
    const t = setTimeout(() => setSelIdx(2), 1900)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: 'easeOut' as const }} className="w-full">
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">{d.step3}</p>
      <h3 className="mb-5 text-center text-sm font-semibold text-white">{d.selectMakeup}</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {d.makeupOptions.map((opt, i) => {
          const active = selIdx === i
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.13, duration: 0.35, ease: 'easeOut' as const }}
              className={`relative overflow-hidden rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-500 ${active ? 'border-amber-300/60 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-950/40' : 'border-white/10 bg-white/[0.05] text-zinc-400'}`}>
              {active && <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="me-1 text-amber-300">✓</motion.span>}
              {opt}
              {active && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} className="absolute inset-x-0 bottom-0 h-0.5 origin-start bg-fuchsia-400/60" />}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function MergePhase() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  const [converging, setConverging] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setConverging(true), 900)
    return () => clearTimeout(t)
  }, [])
  const TAGS = [
    { idx: 0, x: -90, y: -55 },
    { idx: 1, x: 90,  y: -55 },
    { idx: 2, x: 0,   y: 75  },
  ]
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      className="relative flex w-full flex-col items-center justify-center" style={{ minHeight: 240 }}>
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: converging ? 1 : 0.4, opacity: converging ? 1 : 0.3 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        className="absolute h-20 w-20 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,153,63,0.9) 0%, rgba(201,153,63,0.4) 50%, transparent 70%)' }} />
      <AnimatePresence>
        {converging && (
          <motion.div key="ring" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: 360 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ scale: { duration: 0.3 }, opacity: { duration: 0.3 }, rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' } }}
            className="absolute h-28 w-28 rounded-full border-2 border-amber-400/20 border-t-amber-300/80" />
        )}
      </AnimatePresence>
      {TAGS.map((tag, i) => (
        <motion.div key={i} initial={{ x: tag.x, y: tag.y, opacity: 1, scale: 1 }}
          animate={converging ? { x: 0, y: 0, opacity: 0, scale: 0.2 } : { x: tag.x, y: tag.y, opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeIn' as const }}
          className="absolute rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 text-[11px] font-semibold text-amber-200 backdrop-blur-sm">
          {d.mergeTags[tag.idx]}
        </motion.div>
      ))}
      <AnimatePresence>
        {converging && (
          <motion.p key="gen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-0 text-center text-xs font-medium text-amber-200">{d.generating}</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ResultPhase() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex flex-col items-center">
      <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="relative">
        <div className="absolute -inset-3 rounded-[1.8rem] opacity-60" style={{ background: 'radial-gradient(circle, rgba(201,153,63,0.5) 0%, transparent 70%)' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/women_signature/05_Arabic_Glam.png" alt="AI result" className="relative h-[240px] w-[160px] rounded-[1.4rem] object-cover shadow-2xl shadow-amber-950/50" />
        <div className="absolute inset-x-0 bottom-0 rounded-b-[1.4rem] bg-gradient-to-t from-black/95 to-transparent px-3 pb-3 pt-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-300">{d.aiGenerated}</p>
          <p className="mt-0.5 text-xs font-semibold text-white">{d.resultName}</p>
        </div>
      </motion.div>
      {[{ x: -16, y: -14, d: 0.15 }, { x: 14, y: -18, d: 0.3 }, { x: 20, y: 18, d: 0.45 }].map((sp, i) => (
        <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }} transition={{ delay: sp.d, duration: 0.7 }}
          className="absolute text-amber-300" style={{ left: `calc(50% + ${sp.x}px)`, top: sp.y, fontSize: 12 }}>✦</motion.span>
      ))}
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="mt-3 text-[11px] font-semibold text-emerald-400">
        {d.previewReady}
      </motion.p>
    </motion.div>
  )
}

function StyleDemo() {
  const { lang } = useContext(LangCtx)
  const d = COPY[lang].demo
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setIdx(i => (i + 1) % DEMO_SEQ.length), DEMO_SEQ[idx].ms)
    return () => clearTimeout(t)
  }, [idx])
  const phase = DEMO_SEQ[idx].phase
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-red-400/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
        <div className="h-2 w-2 rounded-full bg-green-400/60" />
        <span className="ms-2 text-[10px] text-zinc-600">{d.windowTitle}</span>
        <div className="ms-auto flex gap-1">
          {DEMO_SEQ.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === idx ? 'w-4 bg-fuchsia-400' : 'w-1 bg-white/20'}`} />
          ))}
        </div>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === 'hair'   && <HairPhase   key="hair" />}
          {phase === 'color'  && <ColorPhase  key="color" />}
          {phase === 'makeup' && <MakeupPhase key="makeup" />}
          {phase === 'merge'  && <MergePhase  key="merge" />}
          {phase === 'result' && <ResultPhase key="result" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function LandingNav() {
  const { lang, setLang } = useContext(LangCtx)
  const c = COPY[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const close = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/10 bg-black/50 backdrop-blur-xl' : ''}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex">
          {[['#reel', c.reel], ['#compare', c.compare], ['#features', c.features], ['#pricing', c.pricing]].map(([href, label]) => (
            <a key={href} href={href} className="text-sm text-zinc-400 transition hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.12] hover:text-white">
            {c.langBtn}
          </button>
          <Link href="/login" className="rounded-2xl bg-gradient-to-r from-amber-200 via-white to-amber-100 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-950/30 transition hover:brightness-110">
            {c.signIn}
          </Link>
          <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-sm text-zinc-400 transition hover:text-white md:hidden">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/70 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1 px-4 py-4">
              {[['#reel', c.reel], ['#compare', c.compare], ['#features', c.features], ['#pricing', c.pricing]].map(([href, label]) => (
                <a key={href} href={href} onClick={close} className="rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white">{label}</a>
              ))}
              <Link href="/login" onClick={close} className="mt-2 rounded-xl px-4 py-3 text-sm font-bold text-amber-200 transition hover:bg-white/[0.06]">{c.signIn} →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Before/After slider ───────────────────────────────────────────────────────

function BeforeAfterSlider({ left, right, leftLabel, rightLabel }: { left: string; right: string; leftLabel: string; rightLabel: string }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)))
  }, [])
  useEffect(() => {
    const onMove  = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX) }
    const onTouch = (e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX) }
    const stop    = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', stop)
    }
  }, [updatePos])
  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-3xl border border-white/10 select-none cursor-ew-resize" style={{ aspectRatio: '3/4' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={right} alt={rightLabel} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={left} alt={leftLabel} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, zIndex: 10 }} loading="lazy" />
      <div className="absolute inset-y-0" style={{ left: `${pos}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
        <div className="h-full w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <button type="button" aria-label="Drag to compare"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-2xl text-zinc-900 text-base font-bold ring-2 ring-amber-300/40"
          onMouseDown={() => { dragging.current = true }} onTouchStart={() => { dragging.current = true }}>↔</button>
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{leftLabel}</span>
      <span className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-full bg-fuchsia-300 px-3 py-1.5 text-xs font-bold text-zinc-950">{rightLabel}</span>
    </div>
  )
}

// ─── Infinite marquee ──────────────────────────────────────────────────────────

function InfiniteMarquee({ items, speed = 35, reverse = false }: { items: { src: string; label: string }[]; speed?: number; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4" animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }} style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div key={i} className="group relative shrink-0 overflow-hidden rounded-2xl border border-white/10" style={{ width: '180px', aspectRatio: '3/4' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
              <p className="truncate text-xs font-semibold text-white">{item.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button type="button" onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between py-5 text-start">
        <span className="text-sm font-semibold text-white">{q}</span>
        <span className={`ms-4 shrink-0 text-amber-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>↓</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <p className="pb-5 text-sm leading-6 text-zinc-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en')
  const c = COPY[lang]

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <div className="page-bg overflow-x-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        <LandingNav />

        {/* ── Hero ── */}
        <section className="relative px-4 py-16 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-start">
              {/* Logo icon with glow */}
              <motion.div {...mount(0)} className="mb-6 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full opacity-60" style={{ boxShadow: '0 0 48px 12px rgba(201,153,63,0.35)' }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="SalonAI" className="relative h-20 w-20 rounded-full object-cover ring-2 ring-amber-300/30" />
                </div>
              </motion.div>
              <motion.p {...mount(0.05)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                {c.hero.label}
              </motion.p>
              <motion.h1 {...mount(0.15)} className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {c.hero.h1a}{' '}
                <span className="bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">{c.hero.h1b}</span>
                <br />{c.hero.h1c}
              </motion.h1>
              <motion.p {...mount(0.25)} className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-400 lg:mx-0">
                {c.hero.sub}
              </motion.p>
              <motion.div {...mount(0.35)} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-amber-200 via-white to-amber-100 px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-xl shadow-amber-950/30 transition hover:brightness-110">
                  {c.hero.cta1}
                </Link>
                <a href="#reel" className="rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
                  {c.hero.cta2}
                </a>
              </motion.div>
              <motion.div {...mount(0.4)} className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
                {c.stats.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-semibold tracking-tight text-amber-200">{s.value}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Floating image stack */}
            <motion.div {...mount(0.15)} className="relative mx-auto h-[420px] w-full max-w-md lg:max-w-none lg:h-[500px]">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute start-0 top-8 h-[280px] w-[180px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40" style={{ rotate: -8, zIndex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/women_signature/07_Smokey_Evening.png" alt="Smokey Evening" className="h-full w-full object-cover" />
              </motion.div>
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute left-1/2 top-0 h-[340px] w-[210px] -translate-x-1/2 overflow-hidden rounded-3xl border border-amber-300/20 shadow-2xl shadow-amber-950/30" style={{ zIndex: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/women_signature/05_Arabic_Glam.png" alt="Arabic Glam" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-200">{c.hero.aiPreview}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{c.demo.resultName}</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute end-0 top-12 h-[260px] w-[170px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40" style={{ rotate: 7, zIndex: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/women_signature/06_Red_Carpet_Red_Lip.png" alt="Red Carpet" className="h-full w-full object-cover" />
              </motion.div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(201,153,63,0.5) 0%, transparent 70%)', zIndex: 0 }} />
            </motion.div>
          </div>
        </section>

        {/* ── AI Reel ── */}
        <section id="reel" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <ReelFrame images={ALL_LOOKS} intervalMs={3200} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/80 via-transparent to-[#07070a]/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/60 via-transparent to-[#07070a]/60" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-36 text-center">
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">{c.reel.label}</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{c.reel.h2}</motion.h2>
            <motion.p {...reveal(0.2)} className="mx-auto mt-5 max-w-lg text-base leading-7 text-zinc-300">{c.reel.sub}</motion.p>
            <motion.div {...reveal(0.3)} className="mt-9">
              <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-amber-200 via-white to-amber-100 px-10 py-4 text-sm font-bold text-zinc-950 shadow-2xl shadow-amber-950/50 transition hover:brightness-110">
                {c.reel.cta}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Style Demo ── */}
        <section id="demo" className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{c.demo.label}</motion.p>
                <motion.h2 {...reveal(0.1)} className="mt-4 text-4xl font-semibold tracking-tight text-white">
                  {c.demo.h2[0]}<br />{c.demo.h2[1]}
                </motion.h2>
                <motion.p {...reveal(0.2)} className="mt-5 max-w-sm text-base leading-7 text-zinc-400">{c.demo.sub}</motion.p>
                <motion.ul {...reveal(0.25)} className="mt-6 space-y-3 text-sm text-zinc-400">
                  {c.demo.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-amber-300">✦</span>
                      {step}
                    </li>
                  ))}
                </motion.ul>
                <motion.div {...reveal(0.35)} className="mt-8">
                  <Link href="/contact" className="rounded-2xl bg-gradient-to-r from-amber-200 via-white to-amber-100 px-7 py-3.5 text-center text-sm font-bold text-zinc-950 shadow-xl shadow-amber-950/30 transition hover:brightness-110">
                    {c.demo.cta}
                  </Link>
                </motion.div>
              </div>
              <motion.div {...reveal(0.1)}>
                <StyleDemo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <section className="py-16">
          <div className="mb-10 text-center">
            <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{c.catalog.label}</motion.p>
            <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.catalog.h2}</motion.h2>
          </div>
          <div className="space-y-4">
            <InfiniteMarquee items={MARQUEE_A} speed={45} />
            <InfiniteMarquee items={MARQUEE_B} speed={38} reverse />
          </div>
        </section>

        {/* ── Split Morph ── */}
        <section className="overflow-hidden py-4">
          <div className="relative">
            <div className="flex h-[70vh] min-h-[500px]">
              <div className="relative flex-1 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' }}>
                <ReelFrame images={SPLIT_LEFT} intervalMs={2800} className="h-full w-full" />
              </div>
              <div className="relative flex-1 overflow-hidden" style={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <ReelFrame images={SPLIT_RIGHT} intervalMs={3400} className="h-full w-full" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.div {...reveal(0)} className="relative z-10 rounded-3xl border border-white/10 bg-black/60 px-10 py-8 text-center backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">{c.splitMorph.label}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.splitMorph.h2[0]}<br />{c.splitMorph.h2[1]}</h2>
                <p className="mt-3 text-sm text-zinc-400">{c.splitMorph.sub}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Before / After ── */}
        <section id="compare" className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{c.compare.label}</motion.p>
              <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.compare.h2}</motion.h2>
              <motion.p {...reveal(0.2)} className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">{c.compare.sub}</motion.p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <motion.div {...reveal(0)}>
                <BeforeAfterSlider left="/women_signature/01_Clean_Natural_Beauty.png" right="/women_signature/05_Arabic_Glam.png" leftLabel={c.compare.labels[0]} rightLabel={c.compare.labels[1]} />
              </motion.div>
              <motion.div {...reveal(0.1)}>
                <BeforeAfterSlider left="/women_signature/09_Korean_Soft_Makeup.png" right="/women_signature/06_Red_Carpet_Red_Lip.png" leftLabel={c.compare.labels[2]} rightLabel={c.compare.labels[3]} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{c.features.label}</motion.p>
              <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.features.h2}</motion.h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.features.cards.map((f, i) => (
                <motion.div key={i} {...reveal(i * 0.1)} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
                  <p className="mb-5 text-3xl text-amber-300">{f.icon}</p>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <motion.div key={i} {...reveal(i * 0.1)}>
                  <div className="h-full rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
                    <p className="text-sm leading-6 text-zinc-300">"{t.quote}"</p>
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-white">{t.author}</p>
                      <p className="mt-1 text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{c.pricing.label}</motion.p>
              <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.pricing.h2}</motion.h2>
              <motion.p {...reveal(0.2)} className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">{c.pricing.sub}</motion.p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.pricing.tiers.map((tier, i) => (
                <motion.div key={i} {...reveal(i * 0.1)}>
                  <div className={`relative flex h-full flex-col rounded-3xl border p-6 ${tier.featured ? 'border-amber-300/40 bg-white/[0.08]' : 'border-white/10 bg-white/[0.055]'}`}>
                    {tier.featured && (
                      <div className="absolute -top-3 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-fuchsia-200/30 bg-fuchsia-300 px-3 py-1 text-xs font-bold text-zinc-950">{tier.tag}</div>
                    )}
                    {!tier.featured && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{tier.tag}</p>}
                    <h3 className="mt-3 text-2xl font-semibold text-white">{tier.name}</h3>
                    <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">{tier.desc}</p>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                      className="mt-6 block w-full rounded-2xl border border-emerald-300/20 bg-emerald-400/10 py-3 text-center text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/20">
                      {c.pricing.cta}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p {...reveal(0.3)} className="mt-8 text-center text-xs text-zinc-500">{c.pricing.note}</motion.p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="px-4 py-24">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <motion.p {...reveal(0)} className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{c.faq.label}</motion.p>
              <motion.h2 {...reveal(0.1)} className="mt-3 text-3xl font-semibold tracking-tight text-white">{c.faq.h2}</motion.h2>
            </div>
            <motion.div {...reveal(0.2)} className="rounded-3xl border border-white/10 bg-white/[0.04] px-6">
              {c.faq.items.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/10 px-4 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Brand />
            <p className="text-xs text-zinc-500">{c.footer.copyright}</p>
            <div className="flex items-center gap-6">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 transition hover:text-white">{c.footer.whatsapp}</a>
              <Link href="/login" className="text-xs text-zinc-500 transition hover:text-white">{c.footer.signIn}</Link>
            </div>
          </div>
        </footer>
      </div>
    </LangCtx.Provider>
  )
}
