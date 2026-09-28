// Company content taken from Nour's own company-profile site (nour-company-profile.vercel.app).
// Arabic text is Nour's; English text is our draft translation — to be reviewed by Nour.
// Images were downloaded into /public/media from the same sources.

export const media = {
  factoryHero: "/media/company/factory-hero.webp",
  panelsHero: "/media/company/hero-panels.webp",
};

export const extraContact = {
  phone2Display: "+20 100 630 0039",
  phone2Href: "tel:+201006300039",
  facebook: "https://www.facebook.com/share/1YaXaVgUsX/?mibextid=wwXIfr",
  mapsShort: "https://maps.app.goo.gl/qaDKsGmNwUuuNrY57",
};

export type Sector = { key: string; image: string; ar: string; en: string; descAr: string; descEn: string };
export const sectors: Sector[] = [
  { key: "factories", image: "/media/sectors/factories.webp", ar: "المصانع", en: "Factories", descAr: "لوحات عدادات للمصانع وتوزيع 3 فاز وصناديق حسب الطلب.", descEn: "Factory meter panels, 3-phase distribution and custom enclosures." },
  { key: "hospitals", image: "/media/sectors/hospitals.webp", ar: "المستشفيات", en: "Hospitals", descAr: "لوحات توزيع وبواطات للمنشآت الصحية.", descEn: "Distribution panels and junction boxes for healthcare facilities." },
  { key: "education", image: "/media/sectors/education.webp", ar: "المدارس والجامعات", en: "Schools & universities", descAr: "لوحات توزيع واتصالات للمباني التعليمية.", descEn: "Distribution and communication panels for campuses." },
  { key: "malls", image: "/media/sectors/malls.webp", ar: "المولات التجارية", en: "Shopping malls", descAr: "لوحات توزيع وعدادات للمحلات والمساحات التجارية.", descEn: "Distribution and meter panels for retail units and common areas." },
  { key: "residential", image: "/media/sectors/residential-towers.webp", ar: "الأبراج السكنية", en: "Residential towers", descAr: "لوحات خطوط وعدادات للشقق، داخل وخارج الشقة.", descEn: "Apartment line and meter panels, inside and outside the unit." },
  { key: "offices", image: "/media/sectors/office-buildings.webp", ar: "المباني الإدارية", en: "Administrative buildings", descAr: "لوحات توزيع واتصالات للمكاتب والمباني الإدارية.", descEn: "Distribution and communication panels for office buildings." },
  { key: "utilities", image: "/media/sectors/water-energy.webp", ar: "محطات المياه والطاقة", en: "Water & energy stations", descAr: "صناديق ولوحات مصنّعة حسب متطلبات المحطة.", descEn: "Enclosures and panels built to station requirements." },
  { key: "industrial", image: "/media/sectors/industrial-projects.webp", ar: "المشروعات الصناعية", en: "Industrial projects", descAr: "لوحات بمقاسات خاصة وفق المواصفات الصناعية.", descEn: "Custom-sized panels built to industrial specifications." },
];

export type Equipment = { key: string; image: string; nameEn: string; nameAr: string; descAr: string; descEn: string };
export const equipment: Equipment[] = [
  { key: "fiber-laser", image: "/media/equipment/fiber-laser.webp", nameEn: "Fiber Laser Cutting", nameAr: "القطع بالليزر الفايبر", descAr: "تُستخدم ماكينات القطع بالليزر الفايبر في تنفيذ عمليات القطع بدقة عالية وسرعة كبيرة.", descEn: "Fiber-laser cutting machines deliver high-precision, high-speed sheet cutting." },
  { key: "cnc-press-brake", image: "/media/equipment/cnc-press-brake.webp", nameEn: "CNC Press Brake", nameAr: "ماكينة الثني CNC", descAr: "تُستخدم ماكينة الثني CNC في عمليات الثني والتشكيل بدقة هندسية عالية.", descEn: "CNC press brakes bend and form sheet metal to accurate engineering tolerances." },
  { key: "hydraulic-press", image: "/media/equipment/hydraulic-press.webp", nameEn: "Hydraulic / Eccentric Press", nameAr: "ماكينات الكبس الهيدروليكي", descAr: "تُستخدم ماكينات الكبس الهيدروليكي في عمليات الكبس والتشكيل المختلفة.", descEn: "Hydraulic and eccentric presses handle pressing and forming operations." },
  { key: "electrostatic-painting", image: "/media/equipment/electrostatic-painting.webp", nameEn: "Electrostatic Painting", nameAr: "الدهان الكهروستاتيكي", descAr: "يتم تطبيق الدهان بتقنية الدهان الكهروستاتيكي للحصول على تشطيب نهائي عالي الجودة.", descEn: "Electrostatic powder painting gives a durable, high-quality finish." },
  { key: "laser-welding", image: "/media/equipment/laser-welding.jpg", nameEn: "Laser Welding", nameAr: "اللحام بالليزر", descAr: "نستخدم تقنية اللحام بالليزر لتنفيذ لحامات دقيقة ونظيفة تعزز جودة التجميع ومتانة مكونات اللوحات الكهربائية.", descEn: "Laser welding produces precise, clean welds for stronger, better-assembled panels." },
];

export type Leader = { key: string; image: string; nameAr: string; nameEn: string; roleAr: string; roleEn: string; bioAr: string; bioEn: string };
export const leadership: Leader[] = [
  {
    key: "founder",
    image: "/media/leadership/galal-amer.jpg",
    nameAr: "المهندس جلال عامر",
    nameEn: "Eng. Galal Amer",
    roleAr: "المؤسس",
    roleEn: "Founder",
    bioAr: "أسّس المهندس جلال عامر شركة نور عام 1985 برؤية واضحة في مجال الكهرباء، ثم قادها نحو التخصص في صناعة لوحات الكهرباء، واضعًا أساسًا من الجودة والثقة ما زال يميز الشركة حتى اليوم.",
    bioEn: "Eng. Galal Amer founded Nour in 1985 with a clear vision in the electrical field, then led it to specialise in electrical panel manufacturing, laying a foundation of quality and trust that still defines the company today.",
  },
  {
    key: "ceo",
    image: "/media/leadership/mostafa-galal-amer.jpg",
    nameAr: "م. مصطفى جلال عامر",
    nameEn: "Eng. Mostafa Galal Amer",
    roleAr: "رئيس مجلس الإدارة — CEO",
    roleEn: "Chairman & CEO",
    bioAr: "يقود م. مصطفى جلال عامر الشركة بخبرة ورؤية واضحة نحو تطوير صناعة لوحات الكهرباء، حرصًا على تقديم منتجات عالية الجودة تعتمد على الابتكار والدقة في التصنيع والثقة المتبادلة مع العملاء.",
    bioEn: "Eng. Mostafa Galal Amer leads the company with experience and a clear vision for advancing electrical panel manufacturing, delivering high-quality products built on innovation, manufacturing precision and mutual trust with clients.",
  },
];

export const vision = {
  ar: "أن نظل الاختيار الأول في مصر وخارجها في تصنيع وتوريد لوحات الكهرباء، من خلال منتجات عالية الجودة تعتمد على الابتكار، والدقة في التصنيع، والثقة المتبادلة مع عملائنا.",
  en: "To remain the first choice in Egypt and beyond for manufacturing and supplying electrical panels, through high-quality products built on innovation, manufacturing precision and mutual trust with our clients.",
};

export const aboutStory = {
  ar: [
    "منذ انطلاقها عام 1985، أصبحت نور للإضاءة الحديثة واحدة من الشركات الرائدة في تصنيع اللوحات الكهربائية وحلول توزيع الطاقة في مصر. وبفضل خبرة ممتدة لأكثر من أربعة عقود، نجحنا في تقديم منتجات وحلول هندسية تخدم المشروعات السكنية والتجارية والصناعية بكفاءة وجودة عالية.",
    "نؤمن بأن لكل مشروع متطلباته الخاصة، لذلك نوفّر حلولاً مصممة خصيصًا وفق احتياجات العملاء، مع الالتزام الكامل بمعايير الجودة والسلامة — بدءًا من التصميم الهندسي وحتى التصنيع والتسليم.",
    "نعتمد على خبرات هندسية متخصصة وخطوط إنتاج متطورة تُمكّننا من تصميم وتصنيع اللوحات الكهربائية بمختلف أنواعها ومقاساتها وفقًا لمتطلبات كل مشروع.",
  ],
  en: [
    "Since 1985, Nour Modern Lighting has grown into one of Egypt's leading manufacturers of electrical panels and power distribution solutions. With more than four decades of experience, we deliver products and engineering solutions for residential, commercial and industrial projects.",
    "Every project has its own requirements, so we provide solutions tailored to each client — committed to quality and safety from engineering design through manufacturing and delivery.",
    "Specialised engineering expertise and modern production lines let us design and manufacture electrical panels of every type and size to each project's requirements.",
  ],
};

export type Project = { key: string; image: string; logo: string | null; brand: string; nameAr: string; nameEn: string; subAr: string; subEn: string };
export const projects: Project[] = [
  { key: "morshedy", image: "/media/projects/morshedy-card.webp", logo: "/media/projects/morshedy-logo.svg", brand: "Morshedy", nameAr: "مشروعات شركة المرشدي للمقاولين", nameEn: "El Morshedy Contractors projects", subAr: "مشروعات تطوير ومقاولات في مصر", subEn: "Development and contracting projects in Egypt" },
  { key: "global", image: "/media/projects/global-card.webp", logo: "/media/projects/global-logo.png", brand: "Global", nameAr: "مشروعات شركة جلوبل للمقاولين", nameEn: "Global Contractors projects", subAr: "مشروعات سكنية وإنشائية", subEn: "Residential and construction projects" },
  { key: "tmg", image: "/media/projects/tmg-card.webp", logo: "/media/projects/tmg-logo.svg", brand: "TMG", nameAr: "مشروعات شركة طلعت مصطفى", nameEn: "Talaat Moustafa Group projects", subAr: "مدينتي ومجتمعات عمرانية متكاملة", subEn: "Madinaty and integrated communities" },
  { key: "greenland", image: "/media/projects/greenland-card.webp", logo: "/media/projects/greenland-logo.png", brand: "Green Land", nameAr: "مشروعات شركة جرينلاند", nameEn: "Green Land projects", subAr: "استثمارات ومشروعات عقارية", subEn: "Real-estate investments and projects" },
  { key: "tatweer", image: "/media/projects/tatweer-card.webp", logo: "/media/projects/tatweer-logo.svg", brand: "Tatweer Misr", nameAr: "مشروعات شركة تطوير مصر", nameEn: "Tatweer Misr projects", subAr: "بلومفيلدز — مدينة المستقبل", subEn: "Bloomfields — Mostakbal City" },
  { key: "nile", image: "/media/projects/nile-card.webp", logo: "/media/projects/nile-logo.svg", brand: "Nile Developments", nameAr: "مشروعات شركة النيل", nameEn: "Nile Developments projects", subAr: "أبراج ومشروعات بالعاصمة الإدارية", subEn: "Towers and projects in the New Administrative Capital" },
  { key: "salam", image: "/media/projects/salam-card.webp", logo: "/media/projects/salam-logo.png", brand: "Salam", nameAr: "مشروعات شركة السلام", nameEn: "Salam projects", subAr: "مشروعات تجارية وسكنية", subEn: "Commercial and residential projects" },
  { key: "gates", image: "/media/projects/gates-card.webp", logo: "/media/projects/gates-logo.webp", brand: "Gates Developments", nameAr: "مشروعات شركة جيتس", nameEn: "Gates Developments projects", subAr: "مجتمعات سكنية ومشروعات متكاملة", subEn: "Residential communities and integrated projects" },
  { key: "modon", image: "/media/projects/modon-card.webp", logo: "/media/projects/modon-logo.png", brand: "Modon", nameAr: "مشروعات شركة مدن", nameEn: "Modon projects", subAr: "مشروعات عمرانية بالعاصمة الإدارية", subEn: "Urban projects in the New Administrative Capital" },
  { key: "social", image: "/media/projects/social-card.webp", logo: null, brand: "Social Housing", nameAr: "جميع مشاريع شركة الإسكان الاجتماعي", nameEn: "Social Housing projects", subAr: "وحدات سكن لكل المصريين", subEn: "Housing units for all Egyptians" },
  { key: "capital", image: "/media/projects/capital-card.webp", logo: null, brand: "New Administrative Capital", nameAr: "مشاريع شركة العاصمة الإدارية الجديدة", nameEn: "New Administrative Capital projects", subAr: "مشروعات الحي الحكومي وحي المال والأعمال", subEn: "Government District and Central Business District" },
  { key: "authority", image: "/media/projects/authority-card.webp", logo: "/media/projects/authority-logo.png", brand: "NUCA", nameAr: "الهيئة العامة للتطوير العمراني", nameEn: "New Urban Communities Authority", subAr: "تنمية المدن والمجتمعات العمرانية الجديدة", subEn: "Developing new cities and urban communities" },
];
