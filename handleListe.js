// === Data i LocalStorage ===
let shoppingItems = JSON.parse(localStorage.getItem("shoppingItems")) || [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

// === Elementer i DOM ===
const shoppingList = document.getElementById("shopping-list");
const cartList = document.getElementById("cart-list");
const historyList = document.getElementById("history-list");
const shoppingForm = document.getElementById("shopping-form");
const itemInput = document.getElementById("item-input");
const completeBtn = document.getElementById("complete-purchase");

// === Lagre data til localStorage ===
function saveData() {
  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));
}

// === Tegn listene ===
function renderLists() {
  shoppingList.innerHTML = "";
  cartList.innerHTML = "";

  shoppingItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button class="action-btn check-btn" onclick="moveToCart('${item.id}')">✔️</button>
        <button class="action-btn delete-btn" onclick="deleteFromShopping('${item.id}')">❌</button>
      </div>
    `;
    shoppingList.appendChild(li);
  });

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button class="action-btn delete-btn" onclick="deleteFromCart('${item.id}')">❌</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  saveData();
}

// === Tegn historikk ===
function renderHistory() {
  historyList.innerHTML = "";
  if (purchaseHistory.length === 0) {
    historyList.innerHTML = "<p>Ingen handler fullført ennå.</p>";
    return;
  }

  purchaseHistory.forEach((entry) => {
    const div = document.createElement("div");
    div.classList.add("history-entry");
    div.innerHTML = `
      <h4>${entry.date}</h4>
      <ul>
        ${entry.items.map((i) => `<li>${i.name}</li>`).join("")}
      </ul>
    `;
    historyList.appendChild(div);
  });
}

// === Legg til vare i handleliste ===
shoppingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = itemInput.value.trim();
  if (!name) return;
  shoppingItems.push({ id: crypto.randomUUID(), name });
  itemInput.value = "";
  renderLists();
});

// === Flytt vare til handlekurv ===
function moveToCart(id) {
  const item = shoppingItems.find((i) => i.id === id);
  if (item) {
    cartItems.push(item);
    shoppingItems = shoppingItems.filter((i) => i.id !== id);
    renderLists();
  }
}

// === Slett vare fra handleliste ===
function deleteFromShopping(id) {
  shoppingItems = shoppingItems.filter((i) => i.id !== id);
  renderLists();
}

// === Slett vare fra handlekurv ===
function deleteFromCart(id) {
  cartItems = cartItems.filter((i) => i.id !== id);
  renderLists();
}

// === Fullfør handel ===
completeBtn.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Handlekurven er tom!");
    return;
  }
  if (confirm("Er du sikker på at du vil fullføre handelen?")) {
    const timestamp = new Date().toLocaleString();
    purchaseHistory.push({ date: timestamp, items: [...cartItems] });
    shoppingItems = [];
    cartItems = [];
    renderLists();
    renderHistory();
    alert("Handelen er fullført og lagret i historikken!");
  }
});

// === Navigasjon mellom seksjoner ===
document.querySelectorAll("aside button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    document
      .querySelectorAll(".section")
      .forEach((s) => (s.style.display = "none"));

    if (section === "shopping") {
      document.getElementById("shopping-section").style.display = "block";
      renderLists();
    } else if (section === "history") {
      document.getElementById("history-section").style.display = "block";
      renderHistory();
    }
  });
});

// === Start ===
renderLists();
renderHistory();
