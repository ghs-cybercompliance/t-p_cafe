// Shop catalogue, shared by the homepage teaser and shop.html.
// PLACEHOLDER products and prices — replace with the real range before launch.
// Each product has either `price` or `variants` ([{ label, price }]); `options` are extra
// choices that don't change the price (e.g. grind). `art` picks the illustration until
// real product photos exist: set `image: "images/shop/xyz.jpg"` to use a photo instead.

const SHOP = {
  // Orders are sent to this number by SMS.
  orderPhone: "+639999984407",
  orderPhoneDisplay: "0999 998 4407",
  pickupBranches: ["Maranding", "Tubod"],
  categories: ["Coffee Beans", "Matcha & Tea", "Drinkware", "Merch"],
};

const PRODUCTS = [
  {
    id: "daily-grind-blend",
    name: "Daily Grind Espresso Blend",
    category: "Coffee Beans",
    desc: "The blend behind every latte we pour. Chocolate, caramel and a soft nutty finish.",
    variants: [{ label: "250 g", price: 420 }, { label: "500 g", price: 780 }, { label: "1 kg", price: 1450 }],
    options: { name: "Grind", values: ["Whole bean", "Espresso", "Drip / Pour-over", "French press"] },
    art: { type: "bag", color: "#4e392a", accent: "#d9bf9f" },
    badge: "Bestseller",
    featured: true,
  },
  {
    id: "mindanao-single-origin",
    name: "Mindanao Single Origin",
    category: "Coffee Beans",
    desc: "Locally grown arabica, medium roast. Bright citrus, brown sugar and cacao.",
    variants: [{ label: "250 g", price: 480 }, { label: "500 g", price: 890 }, { label: "1 kg", price: 1650 }],
    options: { name: "Grind", values: ["Whole bean", "Espresso", "Drip / Pour-over", "French press"] },
    art: { type: "bag", color: "#8b6a4c", accent: "#fff3e3" },
    featured: true,
  },
  {
    id: "dark-roast",
    name: "After Hours Dark Roast",
    category: "Coffee Beans",
    desc: "Bold and smoky with dark chocolate notes. Made for Spanish lattes at home.",
    variants: [{ label: "250 g", price: 400 }, { label: "500 g", price: 740 }, { label: "1 kg", price: 1380 }],
    options: { name: "Grind", values: ["Whole bean", "Espresso", "Drip / Pour-over", "French press"] },
    art: { type: "bag", color: "#1d1916", accent: "#c9a27a" },
  },
  {
    id: "ceremonial-matcha",
    name: "Uji Ceremonial Matcha",
    category: "Matcha & Tea",
    desc: "The same Kyoto matcha we whisk at the bar. Smooth umami, low bitterness.",
    variants: [{ label: "30 g tin", price: 690 }, { label: "100 g pouch", price: 1990 }],
    art: { type: "tin", color: "#6a8d34", accent: "#f4f7ec" },
    badge: "New",
    featured: true,
  },
  {
    id: "hojicha",
    name: "Hojicha Roasted Green Tea",
    category: "Matcha & Tea",
    desc: "Toasty, low-caffeine roasted green tea powder for lattes at home.",
    variants: [{ label: "50 g tin", price: 520 }],
    art: { type: "tin", color: "#8a5a3b", accent: "#f6e9dc" },
  },
  {
    id: "tp-mug",
    name: "TP Stoneware Mug",
    category: "Drinkware",
    desc: "350 ml matte stoneware with the TP mark. Dishwasher safe.",
    variants: [{ label: "Chalk", price: 450 }, { label: "Espresso", price: 450 }],
    art: { type: "mug", color: "#f3efe9", accent: "#1d1916" },
    featured: true,
  },
  {
    id: "tp-tumbler",
    name: "TP Insulated Tumbler",
    category: "Drinkware",
    desc: "500 ml double-wall steel. Keeps iced matcha cold for hours.",
    variants: [{ label: "Matcha green", price: 890 }, { label: "Coffee brown", price: 890 }, { label: "Black", price: 890 }],
    art: { type: "tumbler", color: "#6a8d34", accent: "#ffffff" },
    badge: "Bestseller",
  },
  {
    id: "tp-glass",
    name: "Iced Latte Glass Set",
    category: "Drinkware",
    desc: "Set of two 400 ml ribbed glasses with bamboo lids and glass straws.",
    price: 690,
    art: { type: "glass", color: "#cfe0e8", accent: "#8b6a4c" },
  },
  {
    id: "tp-tote",
    name: "Daily Grind Canvas Tote",
    category: "Merch",
    desc: "Heavy natural canvas with an inside pocket. Fits a laptop and two bags of beans.",
    price: 390,
    art: { type: "tote", color: "#efe6d6", accent: "#1d1916" },
  },
  {
    id: "tp-tee",
    name: "Terry&Perry Tee",
    category: "Merch",
    desc: "Soft cotton tee with a small TP chest mark and #terryperrycoffee on the back.",
    variants: [{ label: "S", price: 650 }, { label: "M", price: 650 }, { label: "L", price: 650 }, { label: "XL", price: 690 }],
    options: { name: "Colour", values: ["White", "Black"] },
    art: { type: "tee", color: "#ffffff", accent: "#1d1916" },
  },
  {
    id: "tp-cap",
    name: "TP Dad Cap",
    category: "Merch",
    desc: "Washed cotton cap with an embroidered TP mark. Adjustable strap.",
    price: 550,
    options: { name: "Colour", values: ["Cream", "Black", "Matcha"] },
    art: { type: "cap", color: "#e9dfcf", accent: "#1d1916" },
  },
];

const peso = (n) => "₱" + n.toLocaleString("en-PH");
const minPrice = (p) => (p.variants ? Math.min(...p.variants.map((v) => v.price)) : p.price);
// "from ₱420" only when variants are priced differently.
const priceLabel = (p) =>
  (p.variants && new Set(p.variants.map((v) => v.price)).size > 1 ? "from " : "") + peso(minPrice(p));

// Flat product illustrations with the TP mark (stand-ins for product photos).
function productArt(p) {
  if (p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  const { type, color: c, accent: a } = p.art;
  const logo = (x, y, size, fill = a) =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="${size}" letter-spacing="-${size * 0.08}" fill="${fill}">T<tspan opacity=".75">P</tspan></text>`;
  const shapes = {
    bag: `
      <path d="M58 52 h84 l6 118 a6 6 0 0 1 -6 6 h-84 a6 6 0 0 1 -6 -6z" fill="${c}"/>
      <rect x="58" y="44" width="84" height="14" rx="3" fill="${c}"/>
      <rect x="58" y="44" width="84" height="14" rx="3" fill="#000" opacity=".18"/>
      <path d="M58 58 h84 l1 8 h-86z" fill="#000" opacity=".08"/>
      <circle cx="100" cy="112" r="30" fill="${a}"/>
      ${logo(100, 122, 26, c)}
      <rect x="76" y="152" width="48" height="4" rx="2" fill="${a}" opacity=".6"/>`,
    tin: `
      <rect x="66" y="62" width="68" height="104" rx="6" fill="${c}"/>
      <rect x="62" y="50" width="76" height="22" rx="6" fill="${c}"/>
      <rect x="62" y="50" width="76" height="22" rx="6" fill="#000" opacity=".2"/>
      <rect x="66" y="92" width="68" height="46" fill="${a}"/>
      ${logo(100, 124, 24, c)}`,
    mug: `
      <path d="M134 86 a22 22 0 0 1 0 44" fill="none" stroke="${c}" stroke-width="12"/>
      <path d="M134 86 a22 22 0 0 1 0 44" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="12"/>
      <rect x="56" y="66" width="82" height="96" rx="12" fill="${c}"/>
      <rect x="56" y="66" width="82" height="96" rx="12" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="2"/>
      <ellipse cx="97" cy="68" rx="41" ry="6" fill="#000" opacity=".12"/>
      ${logo(97, 126, 30)}`,
    tumbler: `
      <rect x="70" y="38" width="60" height="16" rx="6" fill="${c}"/>
      <rect x="70" y="38" width="60" height="16" rx="6" fill="#000" opacity=".25"/>
      <rect x="112" y="24" width="6" height="18" rx="3" fill="${a}" opacity=".8"/>
      <path d="M72 56 h56 l-7 112 a8 8 0 0 1 -8 7 h-26 a8 8 0 0 1 -8 -7z" fill="${c}"/>
      <path d="M118 56 h10 l-7 112 a8 8 0 0 1 -5 7z" fill="#fff" opacity=".12"/>
      ${logo(100, 118, 24)}`,
    glass: `
      <path d="M64 58 h40 l-4 108 h-32z" fill="${c}" opacity=".85"/>
      <path d="M100 66 h40 l-4 100 h-32z" fill="${c}"/>
      <rect x="62" y="52" width="44" height="8" rx="3" fill="#c9a27a"/>
      <rect x="98" y="60" width="44" height="8" rx="3" fill="#c9a27a"/>
      <rect x="86" y="30" width="4" height="40" rx="2" fill="#fff" opacity=".9" transform="rotate(8 88 50)"/>
      <rect x="122" y="38" width="4" height="40" rx="2" fill="#fff" opacity=".9" transform="rotate(8 124 58)"/>
      <rect x="70" y="110" width="28" height="52" fill="${a}" opacity=".55"/>
      <rect x="106" y="112" width="28" height="50" fill="${a}" opacity=".55"/>
      ${logo(120, 100, 14, "#1d1916")}`,
    tote: `
      <path d="M78 76 v-14 a22 22 0 0 1 44 0 v14" fill="none" stroke="${c}" stroke-width="7"/>
      <path d="M78 76 v-14 a22 22 0 0 1 44 0 v14" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="7"/>
      <path d="M52 76 h96 l-6 96 h-84z" fill="${c}"/>
      <path d="M52 76 h96 l-6 96 h-84z" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
      ${logo(100, 126, 30)}
      <text x="100" y="148" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="8" letter-spacing="2.5" fill="${a}">DAILY GRIND</text>`,
    tee: `
      <path d="M72 46 l-34 18 l12 26 l14 -6 v86 h72 v-86 l14 6 l12 -26 l-34 -18 a14 10 0 0 1 -56 0z" fill="${c}"/>
      <path d="M72 46 l-34 18 l12 26 l14 -6 v86 h72 v-86 l14 6 l12 -26 l-34 -18 a14 10 0 0 1 -56 0z" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>
      ${logo(120, 86, 12)}`,
    cap: `
      <path d="M48 130 a52 52 0 0 1 104 0z" fill="${c}"/>
      <path d="M48 130 a52 52 0 0 1 104 0z" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>
      <path d="M100 78 v52 M74 86 q-8 20 -6 44 M126 86 q8 20 6 44" stroke="#000" stroke-opacity=".08" stroke-width="2" fill="none"/>
      <circle cx="100" cy="78" r="4" fill="${c}"/>
      <path d="M40 130 h120 q10 0 10 6 q-60 10 -140 0 q0 -6 10 -6z" fill="${c}"/>
      <path d="M40 130 h120 q10 0 10 6 q-60 10 -140 0 q0 -6 10 -6z" fill="#000" opacity=".12"/>
      ${logo(100, 116, 20)}`,
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.name}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="180" rx="56" ry="6" fill="#000" opacity=".08"/>${shapes[type]}</svg>`;
}
