// ==============================================
// SYSTEM SZCZEGÓŁOWEGO PODGLĄDU MODÓW
// ==============================================

class ModPreviewManager {
    constructor() {
        this.currentMod = null;
        this.currentImageIndex = 0;
    }

    // Pokazanie szczegółowego podglądu moda
    showModPreview(modId) {
        const mod = this.getModById(modId);
        if (!mod) {
            showNotification('Nie znaleziono moda', 'error');
            return;
        }

        this.currentMod = mod;
        this.currentImageIndex = 0;

        const existingModal = document.getElementById('modPreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'modPreviewModal';
        modal.className = 'mod-preview-modal';
        modal.innerHTML = this.createPreviewHTML(mod);

        document.body.appendChild(modal);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Inicjalizacja galerii
        this.initializeGallery();
        this.updateGallery();
    }

    // Pobranie moda po ID z różnych źródeł
    getModById(modId) {
        // Sprawdź w głównym systemie modów
        if (typeof modsManager !== 'undefined') {
            const mainMod = modsManager.getMod(modId);
            if (mainMod) return this.enrichModData(mainMod);
        }

        // Sprawdź w modach użytkowników
        if (typeof userModsManager !== 'undefined') {
            const communityMods = userModsManager.getCommunityMods();
            const pendingMods = userModsManager.getPendingMods();
            const allUserMods = [...communityMods, ...pendingMods];
            
            const userMod = allUserMods.find(mod => mod.id === modId);
            if (userMod) return this.enrichModData(userMod);
        }

        return null;
    }

    // Wzbogacenie danych moda o dodatkowe informacje
    enrichModData(mod) {
        // Dodanie przykładowych galerii zdjęć dla demonstracji
        const enriched = { ...mod };
        
        if (!enriched.gallery) {
            enriched.gallery = [
                enriched.image,
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop'
            ];
        }

        if (!enriched.detailedDescription) {
            enriched.detailedDescription = this.generateDetailedDescription(mod);
        }

        if (!enriched.features) {
            enriched.features = this.generateFeatures(mod);
        }

        if (!enriched.requirements) {
            enriched.requirements = this.generateRequirements(mod);
        }

        if (!enriched.changelog) {
            enriched.changelog = this.generateChangelog(mod);
        }

        return enriched;
    }

    // Generowanie szczegółowego opisu
    generateDetailedDescription(mod) {
        const descriptions = {
            'skrypty': `
                <h4>Opis funkcjonalności:</h4>
                <p>${mod.description}</p>
                <p>Ten skrypt został stworzony z myślą o maksymalnej wydajności i kompatybilności z popularnymi frameworkami FiveM. Zawiera zaawansowane funkcje konfiguracyjne oraz system uprawnień.</p>
                
                <h4>Główne zalety:</h4>
                <ul>
                    <li>Optymalizacja wydajności - minimalne zużycie zasobów serwera</li>
                    <li>Łatwa instalacja i konfiguracja</li>
                    <li>Kompatybilność z ESX/QBCore</li>
                    <li>Regularne aktualizacje i wsparcie</li>
                </ul>
            `,
            'pojazdy': `
                <h4>Opis pakietu:</h4>
                <p>${mod.description}</p>
                <p>Wysokiej jakości modele pojazdów z realistyczną fizyką, szczegółowymi wnętrzami i dźwiękami. Wszystkie pojazdy zostały zoptymalizowane pod kątem wydajności i kompatybilności z serwerami FiveM.</p>
                
                <h4>Zawartość pakietu:</h4>
                <ul>
                    <li>Modele wysokiej rozdzielczości (4K tekstury)</li>
                    <li>Realistyczna fizyka jazdy</li>
                    <li>Szczegółowe wnętrza z animacjami</li>
                    <li>Unikalne dźwięki silnika</li>
                    <li>Gotowe do użycia pliki instalacyjne</li>
                </ul>
            `,
            'mapy': `
                <h4>Opis lokacji:</h4>
                <p>${mod.description}</p>
                <p>Profesjonalnie zaprojektowana mapa/MLO z dbałością o każdy detal. Lokacja została stworzona zgodnie z najwyższymi standardami modelowania 3D i zoptymalizowana pod kątem wydajności serwerów FiveM.</p>
                
                <h4>Cechy lokacji:</h4>
                <ul>
                    <li>Wysokiej jakości modele i tekstury</li>
                    <li>Pełna funkcjonalność wszystkich elementów</li>
                    <li>Zoptymalizowany pod kątem wydajności</li>
                    <li>Kompatybilny z popularnymi skryptami</li>
                    <li>Gotowe kolizje i NavMesh</li>
                </ul>
            `
        };

        return descriptions[mod.category] || `
            <h4>Szczegółowy opis:</h4>
            <p>${mod.description}</p>
            <p>Ten mod został stworzony z dbałością o jakość i wydajność. Zapewniamy pełne wsparcie techniczne i regularne aktualizacje.</p>
        `;
    }

    // Generowanie listy funkcji
    generateFeatures(mod) {
        const featuresMap = {
            'skrypty': [
                'Kompatybilny z ESX i QBCore',
                'Konfigurowalny przez pliki Config',
                'System uprawnień administratora',
                'Automatyczne zapisywanie w bazie danych',
                'Obsługa wielu języków',
                'API dla developerów'
            ],
            'pojazdy': [
                'Modele wysokiej jakości (4K)',
                'Realistyczna fizyka pojazdu',
                'Szczegółowe wnętrza',
                'Unikalne dźwięki',
                'Tuning i modyfikacje',
                'Kompatybilność z garażami'
            ],
            'mapy': [
                'Wysokiej jakości tekstury',
                'Pełna funkcjonalność',
                'Zoptymalizowana wydajność',
                'NavMesh i kolizje',
                'Oświetlenie i efekty',
                'Gotowa do użycia'
            ]
        };

        return featuresMap[mod.category] || [
            'Wysoka jakość wykonania',
            'Regularne aktualizacje',
            'Wsparcie techniczne',
            'Łatwa instalacja'
        ];
    }

    // Generowanie wymagań
    generateRequirements(mod) {
        return {
            server: [
                'FiveM Server (najnowsza wersja)',
                'Minimum 4GB RAM',
                'Stabilne połączenie internetowe'
            ],
            framework: mod.category === 'skrypty' ? [
                'ESX lub QBCore Framework',
                'MySQL Database',
                'Uprawnienia administratora'
            ] : [
                'Standardowa instalacja FiveM',
                'Brak dodatkowych wymagań'
            ],
            optional: [
                'Discord Bot (opcjonalnie)',
                'Dodatkowe skrypty wspierające',
                'Zaawansowane narzędzia administracyjne'
            ]
        };
    }

    // Generowanie changelog
    generateChangelog(mod) {
        return [
            {
                version: '1.2.0',
                date: '2025-01-15',
                changes: [
                    'Dodano nowe funkcje konfiguracji',
                    'Poprawiono wydajność o 15%',
                    'Naprawiono błąd z zapisywaniem danych',
                    'Dodano obsługę nowych frameworków'
                ]
            },
            {
                version: '1.1.0',
                date: '2025-01-01',
                changes: [
                    'Wprowadzono system uprawnień',
                    'Dodano obsługę wielu języków',
                    'Poprawiono kompatybilność z ESX',
                    'Zaktualizowano dokumentację'
                ]
            },
            {
                version: '1.0.0',
                date: '2024-12-15',
                changes: [
                    'Pierwsza wersja publiczna',
                    'Wszystkie podstawowe funkcje',
                    'Pełna dokumentacja',
                    'Wsparcie techniczne'
                ]
            }
        ];
    }

    // Tworzenie HTML podglądu
    createPreviewHTML(mod) {
        const isOfficial = mod.flags && mod.flags.sbpack;
        const isCommunity = mod.flags && mod.flags.community;
        const isPurchased = typeof purchasedMods !== 'undefined' && purchasedMods.isPurchased(mod.id);
        const isInCart = typeof cart !== 'undefined' && cart.isInCart(mod.id);

        return `
            <div class="mod-preview-content">
                <div class="preview-header">
                    <button class="preview-close" onclick="modPreviewManager.closePreview()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="preview-body">
                    <div class="preview-main">
                        <div class="preview-gallery">
                            <div class="gallery-main">
                                <img id="mainGalleryImage" src="${mod.gallery[0]}" alt="${mod.name}">
                                <div class="gallery-controls">
                                    <button class="gallery-prev" onclick="modPreviewManager.previousImage()">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <button class="gallery-next" onclick="modPreviewManager.nextImage()">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div class="image-counter">
                                    <span id="imageCounter">1 / ${mod.gallery.length}</span>
                                </div>
                            </div>
                            
                            <div class="gallery-thumbnails">
                                ${mod.gallery.map((img, index) => `
                                    <img class="thumbnail ${index === 0 ? 'active' : ''}" 
                                         src="${img}" 
                                         onclick="modPreviewManager.selectImage(${index})"
                                         alt="Zdjęcie ${index + 1}">
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="preview-info">
                            <div class="mod-header-info">
                                <div class="mod-badges">
                                    ${isOfficial ? '<div class="badge official"><i class="fas fa-certificate"></i> SBPack Official</div>' : ''}
                                    ${isCommunity ? '<div class="badge community"><i class="fas fa-users"></i> Community</div>' : ''}
                                    <div class="badge status status-${mod.status}">
                                        ${this.getStatusText(mod.status)}
                                    </div>
                                </div>
                                
                                <h1 class="mod-title">${mod.name}</h1>
                                
                                ${mod.author ? `
                                    <div class="mod-author-info">
                                        <img src="${mod.author.avatar}" alt="${mod.author.username}" class="author-avatar">
                                        <div class="author-details">
                                            <span class="author-name">${mod.author.displayName || mod.author.username}</span>
                                            ${mod.flags && mod.flags.verified ? '<i class="fas fa-check-circle verified-icon"></i>' : ''}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="mod-stats-bar">
                                    <div class="stat-item">
                                        <i class="fas fa-download"></i>
                                        <span>${mod.downloads > 999 ? (mod.downloads/1000).toFixed(1) + 'k' : mod.downloads} pobrań</span>
                                    </div>
                                    <div class="stat-item">
                                        <i class="fas fa-star"></i>
                                        <span>${mod.rating || 4.5}/5</span>
                                    </div>
                                    <div class="stat-item">
                                        <i class="fas fa-tag"></i>
                                        <span>${mod.category}</span>
                                    </div>
                                    ${mod.version ? `
                                        <div class="stat-item">
                                            <i class="fas fa-code-branch"></i>
                                            <span>v${mod.version}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div class="price-and-actions">
                                <div class="price-section">
                                    ${mod.price > 0 ? `
                                        <div class="price-display">
                                            <span class="price-amount">${mod.price}</span>
                                            <span class="price-currency">PLN</span>
                                        </div>
                                    ` : `
                                        <div class="free-badge">
                                            <i class="fas fa-gift"></i>
                                            <span>DARMOWY</span>
                                        </div>
                                    `}
                                </div>
                                
                                <div class="action-buttons">
                                    ${this.createActionButtons(mod, isPurchased, isInCart)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="preview-tabs">
                        <div class="tab-buttons">
                            <button class="tab-btn active" data-tab="description">
                                <i class="fas fa-info-circle"></i> Opis
                            </button>
                            <button class="tab-btn" data-tab="features">
                                <i class="fas fa-list-ul"></i> Funkcje
                            </button>
                            <button class="tab-btn" data-tab="requirements">
                                <i class="fas fa-cogs"></i> Wymagania
                            </button>
                            <button class="tab-btn" data-tab="changelog">
                                <i class="fas fa-history"></i> Changelog
                            </button>
                        </div>
                        
                        <div class="tab-content">
                            <div class="tab-panel active" id="description-panel">
                                <div class="description-content">
                                    ${mod.detailedDescription}
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="features-panel">
                                <div class="features-list">
                                    <h4>Główne funkcje:</h4>
                                    <ul>
                                        ${mod.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="requirements-panel">
                                <div class="requirements-content">
                                    <div class="req-section">
                                        <h4><i class="fas fa-server"></i> Wymagania serwera:</h4>
                                        <ul>
                                            ${mod.requirements.server.map(req => `<li>${req}</li>`).join('')}
                                        </ul>
                                    </div>
                                    
                                    <div class="req-section">
                                        <h4><i class="fas fa-code"></i> Framework:</h4>
                                        <ul>
                                            ${mod.requirements.framework.map(req => `<li>${req}</li>`).join('')}
                                        </ul>
                                    </div>
                                    
                                    <div class="req-section optional">
                                        <h4><i class="fas fa-plus-circle"></i> Opcjonalne:</h4>
                                        <ul>
                                            ${mod.requirements.optional.map(req => `<li>${req}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="changelog-panel">
                                <div class="changelog-content">
                                    ${mod.changelog.map(version => `
                                        <div class="version-block">
                                            <div class="version-header">
                                                <h4>Wersja ${version.version}</h4>
                                                <span class="version-date">${version.date}</span>
                                            </div>
                                            <ul class="version-changes">
                                                ${version.changes.map(change => `<li>${change}</li>`).join('')}
                                            </ul>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Tworzenie przycisków akcji
    createActionButtons(mod, isPurchased, isInCart) {
        if (mod.status !== 'available') {
            return `
                <button class="action-btn disabled">
                    <i class="fas fa-ban"></i>
                    ${mod.status === 'in-development' ? 'W budowie' : 'Niedostępny'}
                </button>
            `;
        }

        if (mod.price === 0) {
            return `
                <button class="action-btn download-btn" onclick="modsManager.downloadFreeMod('${mod.id}')">
                    <i class="fas fa-download"></i>
                    Pobierz za darmo
                </button>
            `;
        }

        if (isPurchased) {
            return `
                <button class="action-btn success-btn" onclick="purchasedMods.downloadMod('${mod.id}')">
                    <i class="fas fa-download"></i>
                    Pobierz (zakupiony)
                </button>
            `;
        }

        if (isInCart) {
            return `
                <button class="action-btn secondary-btn" onclick="cart.toggleCart()">
                    <i class="fas fa-shopping-cart"></i>
                    W koszyku
                </button>
                <button class="action-btn paypal-btn" onclick="window.open('${this.generatePayPalLink(mod)}', '_blank')">
                    <i class="fab fa-paypal"></i>
                    Kup teraz
                </button>
            `;
        }

        return `
            <button class="action-btn primary-btn" onclick="cart.addToCart(${JSON.stringify(mod).replace(/"/g, '&quot;')})">
                <i class="fas fa-cart-plus"></i>
                Dodaj do koszyka
            </button>
            <button class="action-btn paypal-btn" onclick="window.open('${this.generatePayPalLink(mod)}', '_blank')">
                <i class="fab fa-paypal"></i>
                Kup teraz
            </button>
        `;
    }

    // Generowanie linku PayPal
    generatePayPalLink(mod) {
        const paypalEmail = 'osipiuksebastian3@gmail.com';
        const amount = mod.price.toFixed(2);
        const currency = 'PLN';
        const itemName = encodeURIComponent(mod.name);
        
        return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypalEmail}&item_name=${itemName}&item_number=${mod.id}&amount=${amount}&currency_code=${currency}`;
    }

    // Pobieranie tekstu statusu
    getStatusText(status) {
        const statusMap = {
            'available': 'Dostępny',
            'in-development': 'W budowie',
            'unavailable': 'Niedostępny',
            'pending_approval': 'Oczekuje na moderację'
        };
        return statusMap[status] || status;
    }

    // Inicjalizacja galerii
    initializeGallery() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    // Przełączanie zakładek
    switchTab(tabName) {
        // Usuń active z wszystkich przycisków i paneli
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Dodaj active do wybranej zakładki
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    // Nawigacja galerii
    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.currentMod.gallery.length - 1;
        }
        this.updateGallery();
    }

    nextImage() {
        if (this.currentImageIndex < this.currentMod.gallery.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0;
        }
        this.updateGallery();
    }

    selectImage(index) {
        this.currentImageIndex = index;
        this.updateGallery();
    }

    updateGallery() {
        const mainImage = document.getElementById('mainGalleryImage');
        const counter = document.getElementById('imageCounter');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (mainImage && this.currentMod) {
            mainImage.src = this.currentMod.gallery[this.currentImageIndex];
            
            if (counter) {
                counter.textContent = `${this.currentImageIndex + 1} / ${this.currentMod.gallery.length}`;
            }
            
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentImageIndex);
            });
        }
    }

    // Zamknięcie podglądu
    closePreview() {
        const modal = document.getElementById('modPreviewModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
        this.currentMod = null;
        this.currentImageIndex = 0;
    }
}

// Globalna instancja menedżera podglądu
window.modPreviewManager = new ModPreviewManager();

// Globalne funkcje pomocnicze
window.showModPreview = (modId) => modPreviewManager.showModPreview(modId);
