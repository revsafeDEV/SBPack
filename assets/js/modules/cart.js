// ==============================================
// SHOPPING CART SYSTEM
// ==============================================

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    // Inicjalizacja systemu koszyka
    init() {
        this.createCartIcon();
        this.createCartModal();
        this.updateCartDisplay();
        this.bindEvents();
    }

    // Ładowanie koszyka z localStorage
    loadCart() {
        const savedCart = localStorage.getItem('sbpack_cart');
        return savedCart ? JSON.parse(savedCart) : {
            items: [],
            total: 0,
            timestamp: new Date().toISOString()
        };
    }

    // Zapisywanie koszyka do localStorage
    saveCart() {
        this.cart.timestamp = new Date().toISOString();
        localStorage.setItem('sbpack_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    // Dodanie produktu do koszyka
    addToCart(mod) {
        const existingItem = this.cart.items.find(item => item.id === mod.id);
        
        if (existingItem) {
            showNotification('Mod już jest w koszyku!', 'info');
            return;
        }

        this.cart.items.push({
            id: mod.id,
            name: mod.name,
            price: mod.price,
            image: mod.image,
            category: mod.category,
            addedAt: new Date().toISOString()
        });

        this.calculateTotal();
        this.saveCart();
        showNotification(`${mod.name} dodany do koszyka!`, 'success');
    }

    // Usunięcie produktu z koszyka
    removeFromCart(modId) {
        this.cart.items = this.cart.items.filter(item => item.id !== modId);
        this.calculateTotal();
        this.saveCart();
        this.renderCartItems();
        showNotification('Mod usunięty z koszyka', 'success');
    }

    // Obliczanie całkowitej wartości
    calculateTotal() {
        this.cart.total = this.cart.items.reduce((sum, item) => sum + item.price, 0);
    }

    // Tworzenie ikony koszyka
    createCartIcon() {
        if (document.querySelector('.cart-icon')) return;

        const cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = `
            <button class="cart-btn" onclick="cart.toggleCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
            </button>
        `;

        // Dodanie do header actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertBefore(cartIcon, headerActions.firstChild);
        }
    }

    // Tworzenie modala koszyka
    createCartModal() {
        if (document.querySelector('.cart-modal')) return;

        const cartModal = document.createElement('div');
        cartModal.className = 'cart-modal';
        cartModal.id = 'cartModal';
        cartModal.style.display = 'none';
        cartModal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2><i class="fas fa-shopping-cart"></i> Koszyk</h2>
                    <button class="cart-close" onclick="cart.toggleCart()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-body">
                    <div id="cartItems" class="cart-items"></div>
                    <div class="cart-summary">
                        <div class="cart-total">
                            <span>Łączna kwota: </span>
                            <span id="cartTotal">0.00 PLN</span>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-secondary" onclick="cart.clearCart()">
                                <i class="fas fa-trash"></i> Wyczyść koszyk
                            </button>
                            <button class="btn btn-primary" onclick="cart.checkout()" id="checkoutBtn">
                                <i class="fab fa-paypal"></i> Zapłać PayPal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(cartModal);
    }

    // Przełączanie widoczności koszyka
    toggleCart() {
        const modal = document.getElementById('cartModal');
        if (modal.style.display === 'none' || !modal.style.display) {
            modal.style.display = 'flex';
            this.renderCartItems();
            document.body.style.overflow = 'hidden';
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Renderowanie elementów koszyka
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (this.cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Koszyk jest pusty</h3>
                    <p>Dodaj mody do koszyka aby je kupić</p>
                </div>
            `;
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        } else {
            cartItemsContainer.innerHTML = this.cart.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-category">${item.category}</p>
                        <p class="cart-item-price">${item.price.toFixed(2)} PLN</p>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        }

        cartTotal.textContent = `${this.cart.total.toFixed(2)} PLN`;
    }

    // Aktualizacja wyświetlania koszyka
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.items.length;
            cartCount.style.display = this.cart.items.length > 0 ? 'block' : 'none';
        }
    }

    // Czyszczenie koszyka
    clearCart() {
        if (this.cart.items.length === 0) return;
        
        if (confirm('Czy na pewno chcesz wyczyścić koszyk?')) {
            this.cart.items = [];
            this.cart.total = 0;
            this.saveCart();
            this.renderCartItems();
            showNotification('Koszyk wyczyszczony', 'success');
        }
    }

    // Proces płatności
    checkout() {
        if (this.cart.items.length === 0) return;

        // Generowanie linku PayPal dla wielu produktów
        const paypalLink = this.generateBulkPayPalLink();
        
        // Otwieranie PayPal w nowym oknie
        window.open(paypalLink, '_blank');
        
        // Zapisanie koszyka jako oczekujący
        this.savePendingPurchase();
        
        showNotification('Przekierowanie do PayPal...', 'info');
    }

    // Generowanie linku PayPal dla wielu produktów
    generateBulkPayPalLink() {
        const paypalEmail = 'osipiuksebastian3@gmail.com';
        const totalAmount = this.cart.total.toFixed(2);
        const currency = 'PLN';
        
        // Tworzenie opisu zamówienia
        const itemNames = this.cart.items.map(item => item.name).join(', ');
        const itemDescription = `SBPack: ${itemNames} (${this.cart.items.length} mods)`;
        
        return `https://www.paypal.com/cgi-bin/webscr?` +
               `cmd=_xclick&` +
               `business=${paypalEmail}&` +
               `item_name=${encodeURIComponent(itemDescription)}&` +
               `item_number=CART_${Date.now()}&` +
               `amount=${totalAmount}&` +
               `currency_code=${currency}&` +
               `return=${encodeURIComponent(window.location.origin + '/pages/success.html')}&` +
               `cancel_return=${encodeURIComponent(window.location.origin)}&` +
               `notify_url=${encodeURIComponent(window.location.origin + '/ipn')}`;
    }

    // Zapisywanie oczekującego zakupu
    savePendingPurchase() {
        const pendingPurchase = {
            id: `purchase_${Date.now()}`,
            items: [...this.cart.items],
            total: this.cart.total,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        localStorage.setItem('sbpack_pending_purchase', JSON.stringify(pendingPurchase));
    }

    // Sprawdzenie czy produkt jest w koszyku
    isInCart(modId) {
        return this.cart.items.some(item => item.id === modId);
    }

    // Pobieranie ilości przedmiotów
    getItemCount() {
        return this.cart.items.length;
    }

    // Pobieranie całkowitej wartości
    getTotal() {
        return this.cart.total;
    }

    // Bindowanie eventów
    bindEvents() {
        // Zamknięcie koszyka przy kliknięciu poza nim
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('cartModal');
            if (e.target === modal) {
                this.toggleCart();
            }
        });

        // ESC key dla zamknięcia koszyka
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('cartModal');
                if (modal && modal.style.display === 'flex') {
                    this.toggleCart();
                }
            }
        });
    }
}

// Globalna instancja koszyka
window.cart = new ShoppingCart();
