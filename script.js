// Menu transcribed from the in-store menu boards. tp: true = Terry & Perry signature.
const MENU = {
  "Coffee": {
    items: [
      { name: "Espresso", price: 115 },
      { name: "Americano", price: 115 },
      { name: "Cappuccino", price: 135 },
      { name: "Café Latte", price: 135 },
      { name: "Spanish Latte", price: 165, tp: true },
      { name: "Salted Caramel", price: 175 },
      { name: "Vanilla Latte", price: 175 },
      { name: "Caramel Macchiato", price: 175, tp: true },
      { name: "White Mocha", price: 175 },
      { name: "Dark Mocha", price: 175 },
      { name: "Terry&Perry Latte", price: 185, tp: true, iced: true, desc: "Cinnamon, caramel and oat milk." },
      { name: "Salted Cream Latte", price: 185, tp: true, iced: true, desc: "Sweetened iced latte with our signature salted cream." },
    ],
    note: "Extras: Oat milk +₱45 · Extra shot +₱55",
  },
  "Non-Coffee & Soda": {
    items: [
      { name: "Strawberry Milk", price: 155, iced: true, desc: "Our version of strawberries and cream: strawberry jam, dairy milk and cream." },
      { name: "Chocolate", price: 155, desc: "Rich, velvety chocolate served over ice or hot." },
      { name: "Terry Passion", price: 175, desc: "Passionfruit and sparkling soda." },
      { name: "Perry Sunset", price: 175, tp: true, desc: "Sparkling fusion of peach, berries and citrus." },
      { name: "Blue Paradise", price: 175, desc: "Crisp and refreshing blue soda." },
      { name: "Green Ocean", price: 175, desc: "Refreshing burst of citrusy sweetness." },
      { name: "Grasshopper", price: 175, desc: "Sweet, floral lychee with crisp, citrusy lemongrass. A must try." },
    ],
  },
  "Milk Tea": {
    sizes: true,
    items: [
      { name: "Wintermelon", price: [125, 145], tp: true },
      { name: "Ube", price: [125, 145] },
      { name: "Salted Caramel", price: [125, 145], tp: true },
      { name: "Cookies & Cream", price: [125, 145] },
      { name: "Chocolate", price: [125, 145] },
      { name: "Matcha", price: [135, 155] },
      { name: "Boba Milk", price: [145, 165] },
    ],
    note: "Add-ons: Pearls ₱25 · Coffee jelly ₱25 · Nata ₱25 · Cheesecake ₱35",
  },
  "Frappes": {
    items: [
      { name: "Oreo", price: 185, tp: true },
      { name: "Chocolate", price: 185 },
      { name: "Matcha", price: 185 },
      { name: "Strawberry", price: 185 },
      { name: "Biscoff", price: 195, tp: true },
      { name: "Blueberry Cheesecake", price: 195 },
      { name: "Double Choco", price: 205, desc: "Caffeinated" },
      { name: "Caramel", price: 205, desc: "Caffeinated" },
      { name: "White Choco", price: 205, desc: "Caffeinated" },
      { name: "Vanilla", price: 205, desc: "Caffeinated" },
    ],
  },
  "All-Day Breakfast": {
    intro: "Served with 2 eggs and vegetables.",
    items: [
      { name: "Chicken Tocino", price: 205 },
      { name: "Chicken Chipolata", price: 205 },
      { name: "Beef Smoked Longaniza", price: 225 },
      { name: "Beef Tapa", price: 235 },
      { name: "Corned Beef", price: 235 },
      { name: "Big Breakfast", price: 325, desc: "Choice of 2 meats + 2 cups of rice." },
    ],
  },
  "Croffles": {
    intro: "A hybrid of a croissant and a waffle.",
    items: [
      { name: "Plain Croffle", price: 125 },
      { name: "Ice Cream Croffle", price: 155, desc: "Vanilla ice cream with choco sauce." },
      { name: "Banananutella Croffle", price: 175, desc: "Banana and Nutella." },
      { name: "Nutella Almond Croffle", price: 175, tp: true, desc: "Nutella and almonds." },
      { name: "Oreo Cream Croffle", price: 175, desc: "Oreos, whipped cream and chocolate." },
      { name: "Biscoff Cream Croffle", price: 185, tp: true, desc: "Lotus Biscoff cookie, whipped cream, caramel." },
      { name: "Ham & Cheese Croffle", price: 195, desc: "Chicken ham, cheese and mayo." },
    ],
  },
  "Snacks & Pasta": {
    items: [
      { name: "Ham & Egg Toast", price: 125, desc: "Bread, chicken ham, egg, lettuce, cheddar and our signature sauce." },
      { name: "Ramen (Spicy / Mild)", price: 155, tp: true, desc: "Korean ramen with crab stick, egg, seaweed and cheddar. Kimchi upon request." },
      { name: "Nachos", price: 175, desc: "Chips, nacho sauce, tomato, cucumber, beef." },
      { name: "Savoury Fries", price: 185, desc: "Crinkle-cut fries, tomato, cucumber, cheese sauce and beef." },
      { name: "Terry&Perry Sandwich", price: 185, desc: "Bread, lettuce, tomatoes, cheese, chicken, egg and our signature sauce." },
      { name: "Chicken Alfredo", price: 215, desc: "Rich, creamy white sauce spaghetti with chicken on top." },
      { name: "Spaghetti", price: 215, desc: "Our version of the iconic sweet-style Filipino spaghetti." },
    ],
    note: "Sides: Rice ₱25 · Kimchi ₱25 · Bottled water ₱25",
  },
};

const tabsEl = document.getElementById("menuTabs");
const panelEl = document.getElementById("menuPanel");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtPrice = (p) => (Array.isArray(p) ? `M ₱${p[0]} · L ₱${p[1]}` : `₱${p}`);

function renderCategory(name) {
  const cat = MENU[name];
  const items = cat.items.map((it) => `
    <div class="item">
      <span class="item__name">${esc(it.name)}${it.tp ? ' <span class="tp-badge tp-badge--sm">TP</span>' : ""}${it.iced ? ' <span title="Served iced" aria-label="Served iced">🧊</span>' : ""}</span>
      <span class="item__price">${fmtPrice(it.price)}</span>
      ${it.desc ? `<p class="item__desc">${esc(it.desc)}</p>` : ""}
    </div>`).join("");
  panelEl.innerHTML = `
    ${cat.intro ? `<p class="menu__intro">${esc(cat.intro)}</p>` : ""}
    <div class="menu__cols">${items}</div>
    ${cat.note ? `<p class="menu__intro" style="margin:24px 0 0">${esc(cat.note)}</p>` : ""}`;
  panelEl.classList.remove("is-swapping");
  void panelEl.offsetWidth; // restart animation
  panelEl.classList.add("is-swapping");
}

Object.keys(MENU).forEach((name, i) => {
  const btn = document.createElement("button");
  btn.className = "tab";
  btn.type = "button";
  btn.role = "tab";
  btn.textContent = name;
  btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
  btn.addEventListener("click", () => {
    tabsEl.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");
    renderCategory(name);
  });
  tabsEl.appendChild(btn);
});
renderCategory(Object.keys(MENU)[0]);

// Branches, from their Google Maps listings. To add a branch, add an entry here.
// open/close are 24h hours, same every day.
const BRANCHES = [
  {
    name: "Maranding",
    address: ["MCB Building, Petron Gas Station", "Linamon–Zamboanga Road, Maranding", "Lala, Lanao del Norte"],
    open: 10, close: 22,
    rating: 4.8, reviews: 11,
    lat: 7.9276613, lng: 123.7727743,
    maps: "https://www.google.com/maps/place/Terry+%26+Perry+Coffee/@7.9276613,123.7727743,17z/data=!4m6!3m5!1s0x325435007bd39c3f:0xdfdf46d0636e2c9f!8m2!3d7.9276613!4d123.7727743!16s%2Fg%2F11ykdj9gkf",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJP5zTewA1VDIRnyxuY9BG398",
  },
  {
    name: "Tubod",
    address: ["2QVX+R4V, Poblacion", "Tubod, Lanao del Norte 9209"],
    open: 7, close: 19,
    rating: 4.9, reviews: 20,
    lat: 8.0446009, lng: 123.7977851,
    maps: "https://www.google.com/maps/place/Terry+and+Perry/@8.0446009,123.7977851,17z/data=!4m6!3m5!1s0x32544d002bb2bbfd:0x8ccfe6f948c8b0a3!8m2!3d8.0446009!4d123.7977851!16s%2Fg%2F11vk2mxzr9",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJ_buyKwBNVDIRo7DISPnmz4w",
  },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmtHour = (h) => `${h % 12 || 12}:00 ${h < 12 ? "AM" : "PM"}`;
const shortHour = (h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

// Current time in the Philippines (UTC+8), regardless of the viewer's timezone.
const nowPH = () => {
  const now = new Date();
  return new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
};
const isOpen = (b, ph = nowPH()) => {
  const h = ph.getHours() + ph.getMinutes() / 60;
  return h >= b.open && h < b.close;
};

// Hero status pill: which branches are open right now.
(function openStatus() {
  const statusEl = document.getElementById("openStatus");
  const dot = statusEl.previousElementSibling;
  const openNow = BRANCHES.filter((b) => isOpen(b));
  if (openNow.length === BRANCHES.length) {
    statusEl.textContent = "Open now at all branches";
  } else if (openNow.length) {
    statusEl.textContent = `Open now · ${openNow.map((b) => `${b.name} until ${shortHour(b.close)}`).join(", ")}`;
  } else {
    const first = BRANCHES.reduce((a, b) => (b.open < a.open ? b : a));
    statusEl.textContent = `Closed now · ${first.name} opens ${shortHour(first.open)}`;
    dot.classList.add("is-closed");
  }
})();

// Rating band: one score per branch.
document.getElementById("ratingScores").innerHTML = BRANCHES.map((b) => `
  <a class="rating-band__score" href="${b.reviewsUrl}" target="_blank" rel="noopener">
    <span class="big">${b.rating.toFixed(1)}</span>
    <div>
      <div class="stars" aria-label="${b.rating} out of 5 stars">★★★★★</div>
      <span>${esc(b.name)} · ${b.reviews} Google reviews →</span>
    </div>
  </a>`).join("");

// Visit section: branch tabs with address, hours and map.
const branchTabs = document.getElementById("branchTabs");
const branchInfo = document.getElementById("branchInfo");
const branchMap = document.getElementById("branchMap");

function renderBranch(b) {
  const ph = nowPH();
  const today = ph.getDay();
  const open = isOpen(b, ph);
  const rows = [1, 2, 3, 4, 5, 6, 0].map((d) =>
    `<tr${d === today ? ' class="is-today"' : ""}><td>${DAYS[d]}</td><td>${fmtHour(b.open)} – ${fmtHour(b.close)}</td></tr>`).join("");
  branchInfo.innerHTML = `
    <div class="info-block">
      <h3>${esc(b.name)} branch <span class="status ${open ? "" : "status--closed"}">${open ? "Open now" : "Closed now"}</span></h3>
      <p>${b.address.map(esc).join("<br>")}</p>
      <a class="btn btn--dark btn--sm" href="${b.maps}" target="_blank" rel="noopener">Directions →</a>
    </div>
    <div class="info-block">
      <h3>Hours</h3>
      <table class="hours">${rows}</table>
    </div>`;
  branchMap.src = `https://maps.google.com/maps?q=${b.lat},${b.lng}&z=17&output=embed`;
  branchMap.title = `Map of the Terry & Perry ${b.name} branch`;
}

BRANCHES.forEach((b, i) => {
  const btn = document.createElement("button");
  btn.className = "tab";
  btn.type = "button";
  btn.role = "tab";
  btn.textContent = b.name;
  btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
  btn.addEventListener("click", () => {
    branchTabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");
    renderBranch(b);
  });
  branchTabs.appendChild(btn);
});
renderBranch(BRANCHES[0]);

// Nav: background on scroll + mobile toggle
const nav = document.getElementById("nav");
const toggle = nav.querySelector(".nav__toggle");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll(".mobile-nav a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

document.getElementById("year").textContent = new Date().getFullYear();
