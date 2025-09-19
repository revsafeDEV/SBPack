// ==============================================
// PURCHASED MODS SYSTEM
// ==============================================

class PurchasedMods {
    constructor() {
        this.purchases = this.loadPurchases();
        this.init();
    }

    // Inicjalizacja systemu zakupionych modów
    init() {
        this.createPurchasesSection();
        this.bindEvents();
        // Sprawdzenie oczekujących zakupów po powrocie z PayPal
        this.checkPendingPurchases();
    }

    // Ładowanie zakupionych modów z localStorage
    loadPurchases() {
        const savedPurchases = localStorage.getItem('sbpack_purchases');
        return savedPurchases ? JSON.parse(savedPurchases) : [];
    }

    // Zapisywanie zakupionych modów
    savePurchases() {
        localStorage.setItem('sbpack_purchases', JSON.stringify(this.purchases));
    }

    // Dodanie zakupionego moda
    addPurchase(purchase) {
        // Sprawdzenie czy zakup już nie istnieje
        const existingPurchase = this.purchases.find(p => p.id === purchase.id);
        if (!existingPurchase) {
            purchase.purchaseDate = new Date().toISOString();
            purchase.downloadCount = 0;
            this.purchases.push(purchase);
            this.savePurchases();
            
            // Aktualizacja statystyk
            this.updateModStatistics(purchase);
        }
    }

    // Sprawdzenie czy mod jest zakupiony
    isPurchased(modId) {
        return this.purchases.some(purchase => 
            purchase.items.some(item => item.id === modId) || purchase.id === modId
        );
    }

    // Pobieranie zakupionych modów
    getPurchasedMods() {
        const purchasedMods = [];
        this.purchases.forEach(purchase => {
            if (purchase.items && Array.isArray(purchase.items)) {
                purchasedMods.push(...purchase.items);
            } else if (purchase.id) {
                purchasedMods.push(purchase);
            }
        });
        return purchasedMods;
    }

    // Tworzenie sekcji zakupionych modów
    createPurchasesSection() {
        // Dodanie przycisku "Moje Zakupy" do nawigacji
        this.addPurchasesButton();
        
        // Tworzenie modala z zakupionymi modami
        this.createPurchasesModal();
    }

    // Dodanie przycisku zakupów do nawigacji
    addPurchasesButton() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions || document.querySelector('.purchases-btn')) return;

        const purchasesBtn = document.createElement('button');
        purchasesBtn.className = 'purchases-btn';
        purchasesBtn.onclick = () => this.showPurchases();
        purchasesBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span class="purchases-tooltip">Moje Zakupy</span>
        `;

        headerActions.insertBefore(purchasesBtn, headerActions.children[1]);
    }

    // Tworzenie modala zakupionych modów
    createPurchasesModal() {
        if (document.querySelector('.purchases-modal')) return;

        const purchasesModal = document.createElement('div');
        purchasesModal.className = 'purchases-modal';
        purchasesModal.id = 'purchasesModal';
        purchasesModal.style.display = 'none';
        purchasesModal.innerHTML = `
            <div class="purchases-content">
                <div class="purchases-header">
                    <h2><i class="fas fa-download"></i> Moje Zakupy</h2>
                    <button class="purchases-close" onclick="purchasedMods.hidePurchases()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="purchases-body">
                    <div id="purchasesList" class="purchases-list"></div>
                    <div class="purchases-stats" id="purchasesStats">
                        <div class="stat">
                            <span class="stat-label">Zakupione mody:</span>
                            <span class="stat-value" id="totalPurchasedMods">0</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Wydana kwota:</span>
                            <span class="stat-value" id="totalSpent">0.00 PLN</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Łączne pobrania:</span>
                            <span class="stat-value" id="totalDownloadsUser">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(purchasesModal);
    }

    // Wyświetlanie zakupionych modów
    showPurchases() {
        const modal = document.getElementById('purchasesModal');
        modal.style.display = 'flex';
        this.renderPurchasedMods();
        document.body.style.overflow = 'hidden';
    }

    // Ukrywanie zakupionych modów
    hidePurchases() {
        const modal = document.getElementById('purchasesModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Renderowanie zakupionych modów
    renderPurchasedMods() {
        const purchasesList = document.getElementById('purchasesList');
        const purchasedMods = this.getPurchasedMods();

        if (purchasedMods.length === 0) {
            purchasesList.innerHTML = `
                <div class="no-purchases">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Brak zakupionych modów</h3>
                    <p>Kup swój pierwszy mod aby go zobaczyć tutaj</p>
                    <a href="pages/mods.html" class="btn btn-primary">
                        <i class="fas fa-shopping-cart"></i> Przejdź do sklepu
                    </a>
                </div>
            `;
        } else {
            purchasesList.innerHTML = purchasedMods.map(mod => `
                <div class="purchase-item" data-id="${mod.id}">
                    <div class="purchase-image">
                        <img src="${mod.image}" alt="${mod.name}">
                    </div>
                    <div class="purchase-details">
                        <h4>${mod.name}</h4>
                        <p class="purchase-category">${mod.category || 'Mod'}</p>
                        <p class="purchase-price">${mod.price ? mod.price.toFixed(2) + ' PLN' : 'Darmowy'}</p>
                        <p class="purchase-date">Zakupiony: ${this.formatDate(mod.addedAt || new Date().toISOString())}</p>
                    </div>
                    <div class="purchase-actions">
                        <button class="btn btn-primary" onclick="purchasedMods.downloadMod('${mod.id}')">
                            <i class="fas fa-download"></i> Pobierz
                        </button>
                        <button class="btn btn-secondary" onclick="purchasedMods.showModDetails('${mod.id}')">
                            <i class="fas fa-info"></i> Szczegóły
                        </button>
                    </div>
                </div>
            `).join('');
        }

        this.updatePurchasesStats();
    }

    // Aktualizacja statystyk zakupów
    updatePurchasesStats() {
        const purchasedMods = this.getPurchasedMods();
        const totalMods = purchasedMods.length;
        const totalSpent = this.purchases.reduce((sum, purchase) => {
            return sum + (purchase.total || purchase.price || 0);
        }, 0);
        const totalDownloads = this.purchases.reduce((sum, purchase) => {
            return sum + (purchase.downloadCount || 0);
        }, 0);

        document.getElementById('totalPurchasedMods').textContent = totalMods;
        document.getElementById('totalSpent').textContent = totalSpent.toFixed(2) + ' PLN';
        document.getElementById('totalDownloadsUser').textContent = totalDownloads;
    }

    // Pobieranie moda
    downloadMod(modId) {
        const purchase = this.purchases.find(p => 
            p.items?.some(item => item.id === modId) || p.id === modId
        );
        
        if (!purchase) {
            showNotification('Mod nie został zakupiony!', 'error');
            return;
        }

        // Symulacja pobierania
        showNotification('Pobieranie rozpoczęte...', 'success');
        
        // Zwiększenie licznika pobrań
        purchase.downloadCount = (purchase.downloadCount || 0) + 1;
        purchase.lastDownload = new Date().toISOString();
        this.savePurchases();
        
        // Aktualizacja statystyk globalnych
        this.updateGlobalStats(modId);
        
        // Symulacja pobierania pliku
        setTimeout(() => {
            showNotification('Plik został pobrany!', 'success');
        }, 2000);
    }

    // Wyświetlanie szczegółów moda
    showModDetails(modId) {
        const mod = this.getPurchasedMods().find(m => m.id === modId);
        if (mod) {
            showModal(mod.name);
        }
    }

    // Sprawdzanie oczekujących zakupów
    checkPendingPurchases() {
        const pendingPurchase = localStorage.getItem('sbpack_pending_purchase');
        if (pendingPurchase) {
            const purchase = JSON.parse(pendingPurchase);
            
            // Sprawdzenie czy użytkownik wrócił ze strony sukcesu
            if (document.referrer.includes('success.html') || window.location.search.includes('success')) {
                this.completePurchase(purchase);
                localStorage.removeItem('sbpack_pending_purchase');
                
                // Czyszczenie koszyka
                if (typeof cart !== 'undefined') {
                    cart.cart.items = [];
                    cart.cart.total = 0;
                    cart.saveCart();
                }
            }
        }
    }

    // Finalizowanie zakupu
    completePurchase(purchase) {
        this.addPurchase(purchase);
        showNotification(`Zakupiono ${purchase.items.length} mod(ów)!`, 'success');
        
        // Aktualizacja statystyk dla każdego moda
        purchase.items.forEach(item => {
            this.updateModStatistics(item);
        });
    }

    // Aktualizacja statystyk moda
    updateModStatistics(mod) {
        // Aktualizacja w modsManager jeśli istnieje
        if (typeof modsManager !== 'undefined') {
            const existingMod = modsManager.getMod(mod.id);
            if (existingMod) {
                existingMod.downloads = (existingMod.downloads || 0) + 1;
                modsManager.saveMods();
            }
        }
    }

    // Aktualizacja globalnych statystyk
    updateGlobalStats(modId) {
        if (typeof modsManager !== 'undefined') {
            const mod = modsManager.getMod(modId);
            if (mod) {
                mod.downloads = (mod.downloads || 0) + 1;
                modsManager.saveMods();
            }
        }
    }

    // Formatowanie daty
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Bindowanie eventów
    bindEvents() {
        // Zamknięcie modala przy kliknięciu poza nim
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('purchasesModal');
            if (e.target === modal) {
                this.hidePurchases();
            }
        });

        // ESC key dla zamknięcia
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('purchasesModal');
                if (modal && modal.style.display === 'flex') {
                    this.hidePurchases();
                }
            }
        });
    }

    // Eksport danych zakupów
    exportPurchases() {
        const data = {
            purchases: this.purchases,
            exportDate: new Date().toISOString(),
            totalPurchases: this.purchases.length,
            totalSpent: this.purchases.reduce((sum, p) => sum + (p.total || p.price || 0), 0)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sbpack_purchases_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Dane zakupów zostały wyeksportowane', 'success');
    }
}

// Globalna instancja zakupionych modów
window.purchasedMods = new PurchasedMods();
