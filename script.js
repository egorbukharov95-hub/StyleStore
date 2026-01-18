// Данные товаров
const products = [
  {
    id: 1,
    name: "Женское платье летнее",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "women",
  },
  {
    id: 2,
    name: "Мужская рубашка",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "men",
  },
  {
    id: 3,
    name: "Детская футболка",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1579100195626-9471165a4262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "kids",
  },
  {
    id: 4,
    name: "Женские джинсы",
    price: 4599,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "women",
  },
  {
    id: 5,
    name: "Мужские кроссовки",
    price: 5999,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "men",
  },
  {
    id: 6,
    name: "Детская куртка",
    price: 3899,
    image:
      "https://images.unsplash.com/photo-1520256862855-398228c41684?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "kids",
  },
  {
    id: 7,
    name: "Женская сумка",
    price: 2899,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "women",
  },
  {
    id: 8,
    name: "Мужская куртка",
    price: 7899,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    category: "men",
  },
];

// Корзина
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Загрузка товаров на страницу
function loadProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        `;
    productGrid.appendChild(productCard);
  });
}

// Добавление в корзину
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  showNotification(`${product.name} добавлен в корзину!`);
}

// Обновление корзины
function updateCart() {
  // Сохраняем в localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Обновляем счетчик
  const cartCount = document.querySelector(".cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Обновляем модальное окно корзины
  updateCartModal();
}

// Обновление модального окна корзины
function updateCartModal() {
  const cartItems = document.getElementById("cart-items");
  const cartTotalPrice = document.getElementById("cart-total-price");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Корзина пуста</p>";
    cartTotalPrice.textContent = "0";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} ₽ x ${item.quantity}</p>
                <p class="cart-item-price">${item.price * item.quantity} ₽</p>
                <div class="cart-item-actions">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 10px;">Удалить</button>
                </div>
            </div>
        `;
    cartItems.appendChild(cartItem);
  });

  cartTotalPrice.textContent = totalPrice;
}

// Изменение количества товара
function changeQuantity(productId, change) {
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }

    updateCart();
  }
}

// Удаление из корзины
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Уведомление
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2c3e50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCart();

  // Открытие/закрытие корзины
  const cartIcon = document.querySelector(".cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.querySelector(".close-cart");

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    cartModal.classList.add("active");
  });

  closeCart.addEventListener("click", () => {
    cartModal.classList.remove("active");
  });

  // Поиск
  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");

  searchButton.addEventListener("click", () => {
    performSearch();
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  function performSearch() {
    const query = searchInput.value.toLowerCase();
    if (query.trim()) {
      alert(`Поиск: ${query}`);
      // Здесь можно добавить реальный поиск товаров
    }
  }
});

// Стили для анимаций
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-item-actions button {
        margin: 0 5px;
        padding: 2px 8px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);
