// Shop: product grid, cart (saved in this browser), checkout form and SMS order hand-off.
// No payments are taken here — the order text is sent to SHOP.orderPhone and the café confirms.

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// ---------- Cart state ----------
const CART_KEY = "tp-cart";
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
cart = cart.filter((l) => byId[l.id]); // drop products that no longer exist

const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} };
const lineKey = (l) => [l.id, l.variant ?? "", l.option ?? ""].join("|");
const linePrice = (l) => {
  const p = byId[l.id];
  return p.variants ? p.variants.find((v) => v.label === l.variant).price : p.price;
};
const lineLabel = (l) => [l.variant, l.option].filter(Boolean).join(" · ");
const subtotal = () => cart.reduce((s, l) => s + linePrice(l) * l.qty, 0);
const itemCount = () => cart.reduce((s, l) => s + l.qty, 0);

function addToCart(line) {
  const existing = cart.find((l) => lineKey(l) === lineKey(line));
  if (existing) existing.qty += line.qty;
  else cart.push(line);
  saveCart();
  renderCart();
}

// ---------- Product grid ----------
const tabsEl = $("#shopTabs");
const gridEl = $("#productGrid");

function productCard(p) {
  const variantSel = p.variants && p.variants.length > 1
    ? `<label class="pc__field"><span>${p.category === "Coffee Beans" || p.category === "Matcha & Tea" ? "Size" : "Style"}</span>
        <select data-role="variant">${p.variants.map((v) => `<option value="${esc(v.label)}">${esc(v.label)}</option>`).join("")}</select></label>`
    : "";
  const optionSel = p.options
    ? `<label class="pc__field"><span>${esc(p.options.name)}</span>
        <select data-role="option">${p.options.values.map((v) => `<option>${esc(v)}</option>`).join("")}</select></label>`
    : "";
  return `
    <article class="pc" data-id="${p.id}">
      <div class="pc__art" style="--art-bg:${p.art ? p.art.color : "#eee"}">
        ${p.badge ? `<span class="pc__badge">${esc(p.badge)}</span>` : ""}
        ${productArt(p)}
      </div>
      <div class="pc__body">
        <p class="pc__cat">${esc(p.category)}</p>
        <div class="pc__top"><h3>${esc(p.name)}</h3><span class="price" data-role="price">${priceLabel(p)}</span></div>
        <p class="pc__desc">${esc(p.desc)}</p>
        ${variantSel || optionSel ? `<div class="pc__fields">${variantSel}${optionSel}</div>` : ""}
        <div class="pc__buy">
          <div class="qty" aria-label="Quantity">
            <button type="button" data-role="dec" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" max="99" value="1" data-role="qty" aria-label="Quantity">
            <button type="button" data-role="inc" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="btn btn--dark btn--grow" data-role="add">Add to cart</button>
        </div>
      </div>
    </article>`;
}

function renderGrid(category) {
  const list = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
  gridEl.innerHTML = list.map(productCard).join("");
}

["All", ...SHOP.categories].forEach((name, i) => {
  const btn = document.createElement("button");
  btn.className = "tab";
  btn.type = "button";
  btn.role = "tab";
  btn.textContent = name;
  btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
  btn.addEventListener("click", () => {
    tabsEl.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");
    renderGrid(name);
  });
  tabsEl.appendChild(btn);
});

// Deep link: shop.html#coffee-beans opens that category.
const hashCat = SHOP.categories.find((c) => c.toLowerCase().replace(/[^a-z]+/g, "-") === location.hash.slice(1));
if (hashCat) [...tabsEl.children].find((t) => t.textContent === hashCat).click();
else renderGrid("All");

gridEl.addEventListener("change", (e) => {
  const card = e.target.closest(".pc");
  if (e.target.dataset.role === "variant") {
    const p = byId[card.dataset.id];
    $("[data-role=price]", card).textContent = peso(p.variants.find((v) => v.label === e.target.value).price);
  }
});

gridEl.addEventListener("click", (e) => {
  const role = e.target.dataset.role;
  const card = e.target.closest(".pc");
  if (!card || !role) return;
  const qtyEl = $("[data-role=qty]", card);
  const qty = Math.min(99, Math.max(1, parseInt(qtyEl.value, 10) || 1));
  if (role === "inc") qtyEl.value = Math.min(99, qty + 1);
  if (role === "dec") qtyEl.value = Math.max(1, qty - 1);
  if (role === "add") {
    const p = byId[card.dataset.id];
    addToCart({
      id: p.id,
      variant: p.variants ? ($("[data-role=variant]", card)?.value ?? p.variants[0].label) : null,
      option: p.options ? $("[data-role=option]", card).value : null,
      qty,
    });
    qtyEl.value = 1;
    toast(`Added ${qty} × ${p.name}`);
    bumpCartButton();
  }
});

// ---------- Cart drawer ----------
const drawer = $("#cart");
const overlay = $("#cartOverlay");

function showStep(step) {
  drawer.querySelectorAll(".drawer__step").forEach((s) => (s.hidden = s.dataset.step !== step));
  $("#drawerTitle").textContent = { cart: "Your cart", checkout: "Checkout", done: "Send your order" }[step];
  drawer.querySelector(".drawer__step:not([hidden]) .drawer__body").scrollTop = 0;
}

function openCart(step = "cart") {
  showStep(step);
  overlay.hidden = false;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#cartClose").focus();
}
function closeCart() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
  $("#cartOpen").focus();
}
$("#cartOpen").addEventListener("click", () => openCart());
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

function renderCart() {
  const count = itemCount();
  const countEl = $("#cartCount");
  countEl.textContent = count;
  countEl.hidden = count === 0;
  $("#cartSubtotal").textContent = peso(subtotal());
  $("#checkoutSubtotal").textContent = peso(subtotal());
  $("#toCheckout").disabled = count === 0;

  $("#cartItems").innerHTML = cart.length
    ? cart.map((l) => {
        const p = byId[l.id];
        return `
        <div class="line" data-key="${esc(lineKey(l))}">
          <div class="line__art" style="--art-bg:${p.art ? p.art.color : "#eee"}">${productArt(p)}</div>
          <div class="line__info">
            <p class="line__name">${esc(p.name)}</p>
            ${lineLabel(l) ? `<p class="line__meta">${esc(lineLabel(l))}</p>` : ""}
            <div class="line__row">
              <div class="qty qty--sm">
                <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
                <span>${l.qty}</span>
                <button type="button" data-act="inc" aria-label="Increase quantity">+</button>
              </div>
              <strong>${peso(linePrice(l) * l.qty)}</strong>
            </div>
          </div>
          <button type="button" class="line__remove" data-act="remove" aria-label="Remove ${esc(p.name)}">×</button>
        </div>`;
      }).join("")
    : `<div class="empty"><p>Your cart is empty.</p><button type="button" class="btn btn--ghost" data-act="browse">Browse the shop</button></div>`;
}

$("#cartItems").addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  if (act === "browse") return closeCart();
  const row = e.target.closest(".line");
  if (!row || !act) return;
  const line = cart.find((l) => lineKey(l) === row.dataset.key);
  if (act === "inc") line.qty = Math.min(99, line.qty + 1);
  if (act === "dec") line.qty -= 1;
  if (act === "remove" || line.qty < 1) cart = cart.filter((l) => l !== line);
  saveCart();
  renderCart();
});

function bumpCartButton() {
  const btn = $("#cartOpen");
  btn.classList.remove("bump");
  void btn.offsetWidth;
  btn.classList.add("bump");
}

// ---------- Checkout ----------
const form = $("#checkoutForm");
$("#branchSelect").innerHTML = SHOP.pickupBranches.map((b) => `<option>${esc(b)} branch</option>`).join("");
$("#toCheckout").addEventListener("click", () => showStep("checkout"));
$("#backToCart").addEventListener("click", () => showStep("cart"));

form.addEventListener("change", (e) => {
  if (e.target.name !== "fulfillment") return;
  form.querySelectorAll("[data-show]").forEach((el) => (el.hidden = el.dataset.show !== e.target.value));
});

function orderNumber() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `TP-${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function buildOrderText(data, no) {
  const lines = cart.map((l) => {
    const p = byId[l.id];
    const label = lineLabel(l);
    return `${l.qty} x ${p.name}${label ? ` (${label})` : ""} - ${peso(linePrice(l) * l.qty)}`;
  });
  return [
    `Terry & Perry order ${no}`,
    "",
    ...lines,
    "",
    `Subtotal: ${peso(subtotal())}`,
    data.fulfillment === "pickup" ? `Pick up: ${data.branch}` : `Delivery to: ${data.address}`,
    `Payment: ${data.payment}`,
    `Name: ${data.name}`,
    `Mobile: ${data.phone}`,
    data.notes ? `Notes: ${data.notes}` : null,
  ].filter((x) => x !== null).join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  Object.keys(data).forEach((k) => (data[k] = String(data[k]).trim()));
  const errors = [];
  if (!data.name) errors.push("your name");
  if (!/^(\+?63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}$/.test(data.phone)) errors.push("a valid mobile number (09XX XXX XXXX)");
  if (data.fulfillment === "delivery" && !data.address) errors.push("a delivery address");
  const errEl = $("#formError");
  if (errors.length) {
    errEl.textContent = `Please add ${errors.join(", ")}.`;
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;

  const text = buildOrderText(data, orderNumber());
  $("#orderSummary").textContent = text;
  // "?&body=" works on both iOS and Android SMS apps.
  $("#smsLink").href = `sms:${SHOP.orderPhone}?&body=${encodeURIComponent(text)}`;
  showStep("done");
});

$("#copyOrder").addEventListener("click", async () => {
  const text = $("#orderSummary").textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("#orderSummary"));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    document.execCommand("copy");
  }
  toast("Order copied");
});

$("#newOrder").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  form.reset();
  form.querySelectorAll("[data-show]").forEach((el) => (el.hidden = el.dataset.show !== "pickup"));
  showStep("cart");
  closeCart();
});

$("#phoneLink").href = `tel:${SHOP.orderPhone}`;
$("#phoneLink").textContent = SHOP.orderPhoneDisplay;

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

// ---------- Nav ----------
const nav = $("#nav");
const toggle = $(".nav__toggle", nav);
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

$("#year").textContent = new Date().getFullYear();
renderCart();
