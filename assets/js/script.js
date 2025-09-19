// Smooth scroll dla linków nawigacji
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect - support both old and new header classes
    const header = document.querySelector('.header, .modern-header');
    const navLinks = document.querySelectorAll('.nav-link, .nav-item');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.backdropFilter = 'blur(20px) saturate(150%)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.8)';
                header.style.backdropFilter = 'blur(20px) saturate(150%)';
            }
        });
    }

    // Active navigation link
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Mobile menu toggle - support both old and new menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn, .mobile-menu-toggle');
    const nav = document.querySelector('.nav, .modern-nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
            mobileMenuBtn.classList.toggle('active');
            
            // Add mobile styles if not using CSS classes
            if (nav.classList.contains('mobile-active')) {
                nav.style.display = 'flex';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
                nav.style.flexDirection = 'column';
                nav.style.padding = '1rem';
                nav.style.borderRadius = '0 0 20px 20px';
                nav.style.zIndex = '999';
            } else {
                nav.style.display = '';
                nav.style.position = '';
                nav.style.top = '';
                nav.style.left = '';
                nav.style.right = '';
                nav.style.background = '';
                nav.style.backdropFilter = '';
                nav.style.flexDirection = '';
                nav.style.padding = '';
                nav.style.borderRadius = '';
                nav.style.zIndex = '';
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.feature-card, .mod-card, .step');
    animatedElements.forEach(el => observer.observe(el));

    // Particle background effect for hero section
    createParticles();

    // Download tracking
    const downloadButtons = document.querySelectorAll('.btn-download');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show download notification
            showNotification('Pobieranie rozpoczęte!', 'success');
            
            // Update download counter (simulation)
            const downloadCounter = this.closest('.mod-card').querySelector('.mod-downloads');
            if (downloadCounter) {
                const currentCount = downloadCounter.textContent.match(/[\d.k]+/)[0];
                let newCount = parseFloat(currentCount.replace('k', ''));
                if (currentCount.includes('k')) {
                    newCount = (newCount * 1000 + 1) / 1000;
                    newCount = newCount.toFixed(1) + 'k';
                } else {
                    newCount = parseInt(newCount) + 1;
                }
                downloadCounter.innerHTML = `<i class="fas fa-download"></i> ${newCount}`;
            }
            
            // Here you would implement actual download logic
            console.log('Download initiated for:', this.closest('.mod-card').querySelector('h3').textContent);
        });
    });

    // Preview buttons
    const previewButtons = document.querySelectorAll('.btn-preview');
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modName = this.closest('.mod-card').querySelector('h3').textContent;
            showModal(modName);
        });
    });
});

// Particles animation for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = '#6C63FF';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 15000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    let backgroundColor = '#2196F3'; // info
    if (type === 'success') backgroundColor = '#4CAF50';
    if (type === 'error') backgroundColor = '#F44336';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Modal system for previews
function showModal(modName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${modName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="mod-gallery">
                    <img src="https://via.placeholder.com/800x450/1a1a2e/ffffff?text=Preview_${encodeURIComponent(modName)}" alt="${modName} Preview">
                </div>
                <div class="mod-details">
                    <h3>Szczegóły moda</h3>
                    <ul>
                        <li><strong>Wersja:</strong> 1.0.0</li>
                        <li><strong>Rozmiar:</strong> 12.5 MB</li>
                        <li><strong>Kompatybilność:</strong> FiveM 1.0+</li>
                        <li><strong>Ostatnia aktualizacja:</strong> ${new Date().toLocaleDateString('pl-PL')}</li>
                    </ul>
                    <h3>Wymagania</h3>
                    <ul>
                        <li>ESX Framework</li>
                        <li>MySQL Database</li>
                        <li>FiveM Server</li>
                    </ul>
                    <h3>Instrukcja instalacji</h3>
                    <ol>
                        <li>Pobierz archiwum z modem</li>
                        <li>Wypakuj do folderu resources</li>
                        <li>Dodaj do server.cfg: start ${modName.toLowerCase().replace(/\s+/g, '_')}</li>
                        <li>Zrestartuj serwer</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: var(--darker-bg);
        border-radius: 20px;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem;
        border-bottom: 1px solid rgba(197, 198, 199, 0.1);
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem;
        color: var(--text-light);
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--text-light);
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = 'var(--primary-color)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
    });
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 100);
    
    // Close modal handlers
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Typing effect for hero title - tylko jeśli element istnieje
function createTypingEffect() {
    const title = document.querySelector('.hero h1');
    if (!title) {
        return; // Element nie istnieje, zakończ funkcję
    }
    
    const text = title.textContent;
    if (!text) {
        return; // Brak tekstu do animacji
    }
    
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Initialize typing effect when page loads - tylko jeśli potrzebne
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Sprawdź czy element istnieje przed uruchomieniem animacji
        if (document.querySelector('.hero h1')) {
            createTypingEffect();
        }
    }, 500);
});

// Search functionality - tylko dla strony z modami
function initializeSearch() {
    // Sprawdź czy jesteśmy na stronie z modami
    const modsSection = document.querySelector('.mods-section .container');
    if (!modsSection) {
        return; // Nie jesteśmy na stronie z modami, nic nie rób
    }
    
    const modsTitle = modsSection.querySelector('h2');
    if (!modsTitle) {
        return; // Brak tytułu sekcji, nie możemy dodać pola wyszukiwania
    }
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Szukaj modów...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 0.75rem 1rem;
        border: 2px solid var(--primary-color);
        border-radius: 25px;
        background: var(--darker-bg);
        color: var(--text-light);
        font-size: 1rem;
        margin-bottom: 2rem;
        width: 100%;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        display: block;
    `;
    
    modsTitle.insertAdjacentElement('afterend', searchInput);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const modCards = document.querySelectorAll('.mod-card');
        
        modCards.forEach(card => {
            const titleElement = card.querySelector('h3');
            const descriptionElement = card.querySelector('p');
            
            if (!titleElement || !descriptionElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            const description = descriptionElement.textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialize search when DOM is loaded - tylko jeśli potrzebne
document.addEventListener('DOMContentLoaded', () => {
    // Dodaj opóźnienie aby upewnić się że DOM jest w pełni załadowany
    setTimeout(initializeSearch, 100);
});

// ============= ADMIN PANEL FUNCTIONALITY =============

// Admin Configuration
const ADMIN_PASSWORD = 'SBPack2025!'; // Zmień to hasło!
let isAdminLoggedIn = false;

// Mods Storage
class ModsManager {
    constructor() {
        this.mods = this.loadMods();
        this.initializeDefaultMods();
    }

    loadMods() {
        const saved = localStorage.getItem('sbpack_mods');
        return saved ? JSON.parse(saved) : [];
    }

    saveMods() {
        localStorage.setItem('sbpack_mods', JSON.stringify(this.mods));
        this.renderMods();
        this.renderAdminMods();
    }

    initializeDefaultMods() {
        if (this.mods.length === 0) {
            this.mods = [
                {
                    id: '1',
                    name: 'ESX Advanced Jobs',
                    description: 'Zaawansowany system prac dla ESX framework z wieloma nowymi zawodami.',
                    price: 29.99,
                    category: 'skrypty',
                    status: 'available',
                    image: 'https://via.placeholder.com/400x250/1a1a2e/ffffff?text=Skrypt_ESX',
                    downloadLink: '#',
                    downloads: 1200,
                    flags: {
                        official: true,
                        sbpack: true,
                        verified: true,
                        featured: true
                    },
                    author: {
                        id: 'sbpack_official',
                        username: 'SBPack',
                        displayName: 'SBPack Official',
                        avatar: 'https://via.placeholder.com/100x100?text=SB'
                    }
                },
                {
                    id: '2',
                    name: 'Super Cars Pack',
                    description: 'Kolekcja luksusowych samochodów sportowych w najwyższej jakości.',
                    price: 49.99,
                    category: 'pojazdy',
                    status: 'available',
                    image: 'https://via.placeholder.com/400x250/16213e/ffffff?text=Pojazd_Pack',
                    downloadLink: '#',
                    downloads: 856,
                    flags: {
                        official: true,
                        sbpack: true,
                        verified: true,
                        featured: true
                    },
                    author: {
                        id: 'sbpack_official',
                        username: 'SBPack',
                        displayName: 'SBPack Official',
                        avatar: 'https://via.placeholder.com/100x100?text=SB'
                    }
                },
                {
                    id: '3',
                    name: 'Police Station MLO',
                    description: 'Nowoczesny komisariat policji z pełnym wnętrzem i funkcjonalnością.',
                    price: 79.99,
                    category: 'mapy',
                    status: 'in-development',
                    image: 'https://via.placeholder.com/400x250/0f3460/ffffff?text=Mapa_MLO',
                    downloadLink: '#',
                    downloads: 643,
                    flags: {
                        official: true,
                        sbpack: true,
                        verified: true,
                        featured: false
                    },
                    author: {
                        id: 'sbpack_official',
                        username: 'SBPack',
                        displayName: 'SBPack Official',
                        avatar: 'https://via.placeholder.com/100x100?text=SB'
                    }
                },
                {
                    id: '4',
                    name: 'Free Car Spawner',
                    description: 'Darmowy skrypt do spawnowania pojazdów dla wszystkich graczy.',
                    price: 0,
                    category: 'skrypty',
                    status: 'available',
                    image: 'https://via.placeholder.com/400x250/28a745/ffffff?text=Free_Script',
                    downloadLink: 'https://github.com/revsafeDEV/car-spawner',
                    downloads: 2340,
                    flags: {
                        official: true,
                        sbpack: true,
                        verified: true,
                        featured: false
                    },
                    author: {
                        id: 'sbpack_official',
                        username: 'SBPack',
                        displayName: 'SBPack Official',
                        avatar: 'https://via.placeholder.com/100x100?text=SB'
                    }
                }
            ];
            this.saveMods();
        }
    }

    addMod(modData) {
        const newMod = {
            id: Date.now().toString(),
            ...modData,
            downloads: 0
        };
        this.mods.push(newMod);
        this.saveMods();
        return newMod;
    }

    updateMod(id, modData) {
        const index = this.mods.findIndex(mod => mod.id === id);
        if (index !== -1) {
            this.mods[index] = { ...this.mods[index], ...modData };
            this.saveMods();
            return this.mods[index];
        }
        return null;
    }

    deleteMod(id) {
        this.mods = this.mods.filter(mod => mod.id !== id);
        this.saveMods();
    }

    getMod(id) {
        return this.mods.find(mod => mod.id === id);
    }

    getAllMods() {
        return this.mods;
    }

    getStatusIcon(status) {
        switch(status) {
            case 'available': return 'fa-check-circle';
            case 'in-development': return 'fa-clock';
            case 'unavailable': return 'fa-times-circle';
            default: return 'fa-question-circle';
        }
    }

    getStatusText(status) {
        switch(status) {
            case 'available': return 'Dostępny';
            case 'in-development': return 'W budowie';
            case 'unavailable': return 'Niedostępny';
            default: return 'Nieznany';
        }
    }

    getCategoryIcon(category) {
        switch(category) {
            case 'skrypty': return 'fa-code';
            case 'pojazdy': return 'fa-car';
            case 'mapy': return 'fa-map';
            case 'skins': return 'fa-tshirt';
            default: return 'fa-tag';
        }
    }

    renderMods() {
        const modsGrid = document.getElementById('modsGrid');
        if (!modsGrid) return;

        modsGrid.innerHTML = '';
        
        this.mods.forEach(mod => {
            const modCard = this.createModCard(mod);
            modsGrid.appendChild(modCard);
        });
    }

    createModCard(mod) {
        const card = document.createElement('div');
        const isOfficial = mod.flags && mod.flags.sbpack;
        const isCommunity = mod.flags && mod.flags.community;
        const cardClasses = [
            'mod-card',
            mod.price > 0 ? 'premium' : '',
            isOfficial ? 'official-mod' : '',
            isCommunity ? 'community-mod' : ''
        ].filter(Boolean).join(' ');
        
        card.className = cardClasses;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Pomiń kliknięcie jeśli kliknięto przycisk
            if (e.target.closest('.btn') || e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            showModPreview(mod.id);
        });
        
        card.innerHTML = `
            <div class="mod-status status-${mod.status.replace('-', '')}">
                ${this.getStatusText(mod.status)}
            </div>
            ${isOfficial ? `
                <div class="official-badge">
                    <i class="fas fa-certificate"></i>
                    <span>SBPack Official</span>
                </div>
            ` : ''}
            ${isCommunity ? `
                <div class="community-badge">
                    <i class="fas fa-users"></i>
                    <span>Community</span>
                </div>
            ` : ''}
            <div class="mod-image">
                <img src="${mod.image}" alt="${mod.name}">
                <div class="mod-overlay">
                    <div class="mod-buttons">
                        <button class="btn btn-preview" onclick="showModPreview('${mod.id}')">
                            <i class="fas fa-eye"></i>
                            Szczegóły
                        </button>
                        ${this.createActionButton(mod)}
                    </div>
                </div>
            </div>
            <div class="mod-content">
                <h3>${mod.name}</h3>
                <p>${mod.description}</p>
                ${mod.author ? `
                    <div class="mod-author">
                        <img src="${mod.author.avatar}" alt="${mod.author.username}" class="author-avatar">
                        <span class="author-name">${mod.author.displayName || mod.author.username}</span>
                        ${mod.flags && mod.flags.verified ? '<i class="fas fa-check-circle verified-badge" title="Zweryfikowany twórca"></i>' : ''}
                    </div>
                ` : ''}
                ${this.renderPricingSection(mod)}
                <div class="mod-meta">
                    <div class="mod-category">
                        <i class="fas ${this.getCategoryIcon(mod.category)}"></i>
                        ${mod.category.charAt(0).toUpperCase() + mod.category.slice(1)}
                    </div>
                    <div class="mod-downloads">
                        <i class="fas fa-download"></i> 
                        ${mod.downloads > 999 ? (mod.downloads/1000).toFixed(1) + 'k' : mod.downloads}
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    createActionButton(mod) {
        switch(mod.status) {
            case 'available':
                if (mod.price > 0) {
                    // Sprawdź czy mod jest już zakupiony
                    const isPurchased = typeof purchasedMods !== 'undefined' && purchasedMods.isPurchased(mod.id);
                    const isInCart = typeof cart !== 'undefined' && cart.isInCart(mod.id);
                    
                    if (isPurchased) {
                        return `<button class="btn btn-success" onclick="purchasedMods.downloadMod('${mod.id}')">
                            <i class="fas fa-download"></i>
                            Pobierz
                        </button>`;
                    } else if (isInCart) {
                        return `<button class="btn btn-secondary" onclick="cart.toggleCart()">
                            <i class="fas fa-shopping-cart"></i>
                            W koszyku
                        </button>`;
                    } else {
                        return `<div class="mod-purchase-options">
                            <button class="btn btn-primary" onclick="cart.addToCart(${JSON.stringify(mod).replace(/"/g, '&quot;')})">
                                <i class="fas fa-cart-plus"></i>
                                Dodaj do koszyka
                            </button>
                            <a href="${this.generatePayPalLink(mod)}" class="paypal-button" target="_blank">
                                <i class="fab fa-paypal"></i>
                                Kup teraz
                            </a>
                        </div>`;
                    }
                } else {
                    return `<button class="btn btn-download" onclick="modsManager.downloadFreeMod('${mod.id}')">
                        <i class="fas fa-download"></i>
                        Pobierz za darmo
                    </button>`;
                }
            case 'in-development':
                return `<button class="btn btn-secondary" disabled>
                    <i class="fas fa-clock"></i>
                    W budowie
                </button>`;
            case 'unavailable':
                return `<button class="btn btn-secondary" disabled>
                    <i class="fas fa-ban"></i>
                    Niedostępny
                </button>`;
        }
    }
    
    // Pobieranie darmowego moda
    downloadFreeMod(modId) {
        const mod = this.getMod(modId);
        if (!mod) return;
        
        // Aktualizacja statystyk
        if (typeof statisticsManager !== 'undefined') {
            statisticsManager.incrementDownloads(modId);
        }
        
        mod.downloads = (mod.downloads || 0) + 1;
        this.saveMods();
        
        showNotification(`Pobieranie ${mod.name} rozpoczęte!`, 'success');
        
        // Symulacja pobierania
        setTimeout(() => {
            showNotification('Darmowy mod został pobrany!', 'success');
        }, 2000);
    }
    
    generatePayPalLink(mod) {
        const paypalEmail = 'osipiuksebastian3@gmail.com';
        const amount = mod.price.toFixed(2);
        const currency = 'PLN';
        const itemName = encodeURIComponent(mod.name);
        const itemDescription = encodeURIComponent(mod.description.substring(0, 100));
        
        return `https://www.paypal.com/cgi-bin/webscr?` +
               `cmd=_xclick&` +
               `business=${paypalEmail}&` +
               `item_name=${itemName}&` +
               `item_number=${mod.id}&` +
               `amount=${amount}&` +
               `currency_code=${currency}&` +
               `return=${encodeURIComponent(window.location.origin + '/pages/success.html')}&` +
               `cancel_return=${encodeURIComponent(window.location.origin)}&` +
               `notify_url=${encodeURIComponent(window.location.origin + '/ipn')}`;
    }
    
    renderPricingSection(mod) {
        if (mod.price > 0) {
            return `
                <div class="mod-pricing">
                    <div class="mod-price">
                        <span class="price-amount">${mod.price}</span>
                        <span class="price-currency">PLN</span>
                    </div>
                    <div class="price-label">Płatność PayPal</div>
                </div>
            `;
        } else {
            return `
                <div class="mod-pricing">
                    <div class="mod-price">
                        <span class="price-amount">DARMOWY</span>
                    </div>
                    <div class="price-label">Pobierz teraz</div>
                </div>
            `;
        }
    }

    renderAdminMods() {
        const adminModsList = document.getElementById('adminModsList');
        if (!adminModsList) return;

        adminModsList.innerHTML = '';
        
        this.mods.forEach(mod => {
            const modItem = document.createElement('div');
            modItem.className = 'admin-mod-item';
            modItem.innerHTML = `
                <div class="admin-mod-info">
                    <h4>${mod.name}</h4>
                    <p>${mod.price} PLN - ${this.getStatusText(mod.status)}</p>
                </div>
                <div class="admin-mod-actions">
                    <button class="btn btn-small btn-edit" onclick="editMod('${mod.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-delete" onclick="deleteMod('${mod.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            adminModsList.appendChild(modItem);
        });
    }
}

// Initialize Mods Manager
const modsManager = new ModsManager();

// Admin Functions
function showLoginModal() {
    console.log('showLoginModal called');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('Modal displayed');
    } else {
        console.error('Login modal not found');
    }
}

// Make functions globally available
window.showLoginModal = showLoginModal;

function closeLoginModal() {
    console.log('closeLoginModal called');
    const modal = document.getElementById('loginModal');
    const form = document.getElementById('loginForm');
    if (modal) modal.style.display = 'none';
    if (form) form.reset();
}

window.closeLoginModal = closeLoginModal;

function showAdminPanel() {
    console.log('showAdminPanel called');
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.style.display = 'block';
        console.log('Admin panel displayed');
    } else {
        console.error('Admin panel not found');
    }
    modsManager.renderAdminMods();
    showAdminSection('mods');
}

window.showAdminPanel = showAdminPanel;

function closeAdminPanel() {
    console.log('closeAdminPanel called');
    const panel = document.getElementById('adminPanel');
    if (panel) panel.style.display = 'none';
    isAdminLoggedIn = false;
}

window.closeAdminPanel = closeAdminPanel;

function showAdminSection(section) {
    console.log('showAdminSection called with:', section);
    
    // Hide all sections
    document.querySelectorAll('.admin-content, .admin-management').forEach(el => {
        el.style.display = 'none';
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    if (section === 'mods') {
        // Show main admin content (mods management)
        const content = document.querySelector('.admin-panel > .admin-content');
        if (content) {
            content.style.display = 'grid';
            console.log('Mods section shown');
        }
        const btn = document.querySelector('.admin-nav-btn[onclick="showAdminSection(\'mods\')"]');
        if (btn) btn.classList.add('active');
        
        // Render mods for admin
        modsManager.renderAdminMods();
        
    } else if (section === 'moderation') {
        // Show moderation section
        const moderationSection = document.getElementById('moderationSection');
        if (moderationSection) {
            moderationSection.style.display = 'block';
            console.log('Moderation section shown');
        }
        const btn = document.querySelector('.admin-nav-btn[onclick="showAdminSection(\'moderation\')"]');
        if (btn) btn.classList.add('active');
        
        // Load pending mods for moderation
        if (typeof userModsManager !== 'undefined') {
            userModsManager.renderPendingMods('pendingModsList');
            updateModerationStats();
        }
        
    } else if (section === 'admins') {
        // Show admin management section
        const mgmt = document.getElementById('adminManagement');
        if (mgmt) {
            mgmt.style.display = 'block';
            console.log('Admins section shown');
        }
        const btn = document.querySelector('.admin-nav-btn[onclick="showAdminSection(\'admins\')"]');
        if (btn) btn.classList.add('active');
        
        // Show only admin management form and list
        showAdminManagement();
        
    } else if (section === 'support') {
        // Show support section 
        const mgmt = document.getElementById('adminManagement');
        if (mgmt) {
            mgmt.style.display = 'block';
            console.log('Support section shown');
        }
        const btn = document.querySelector('.admin-nav-btn[onclick="showAdminSection(\'support\')"]');
        if (btn) btn.classList.add('active');
        
        // Show only support tickets
        showSupportManagement();
    }
}

window.showAdminSection = showAdminSection;

// Aktualizacja statystyk moderacji
function updateModerationStats() {
    if (typeof userModsManager === 'undefined') return;
    
    const pendingMods = userModsManager.getPendingMods();
    const approvedMods = userModsManager.getCommunityMods();
    
    // Aktualizacja liczników
    const totalPending = document.getElementById('totalPendingMods');
    const totalApproved = document.getElementById('totalApprovedMods');
    const pendingCount = document.getElementById('pendingModsCount');
    
    if (totalPending) totalPending.textContent = pendingMods.length;
    if (totalApproved) totalApproved.textContent = approvedMods.length;
    
    // Pokaż/ukryj licznik oczekujących modów w nawigacji
    if (pendingCount) {
        if (pendingMods.length > 0) {
            pendingCount.textContent = pendingMods.length;
            pendingCount.style.display = 'flex';
        } else {
            pendingCount.style.display = 'none';
        }
    }
}

window.updateModerationStats = updateModerationStats;

// Admin Management Functions
function showAdminManagement() {
    console.log('showAdminManagement called');
    
    // Hide support sections, show only admin sections
    const adminSections = document.querySelectorAll('#adminManagement .admin-section');
    adminSections.forEach((section, index) => {
        if (index < 2) { // Show first two sections (Add Admin + Admin List)
            section.style.display = 'block';
        } else { // Hide support sections
            section.style.display = 'none';
        }
    });
    
    // Load and display admin list
    loadAdminsList();
}

function showSupportManagement() {
    console.log('showSupportManagement called');
    
    // Hide admin sections, show only support sections
    const adminSections = document.querySelectorAll('#adminManagement .admin-section');
    adminSections.forEach((section, index) => {
        if (index >= 2) { // Show support sections (index 2 and above)
            section.style.display = 'block';
        } else { // Hide admin sections
            section.style.display = 'none';
        }
    });
    
    // Load and display support tickets
    loadSupportTickets();
}

function loadAdminsList() {
    const adminsList = document.getElementById('adminsList');
    if (!adminsList) return;
    
    // Simulate admin data
    const admins = [
        {
            id: 1,
            username: 'revsafeDEV',
            email: 'revsafe777@gmail.com',
            role: 'Super Administrator',
            lastLogin: new Date().toLocaleDateString('pl-PL')
        }
    ];
    
    adminsList.innerHTML = admins.map(admin => `
        <div class="admin-item">
            <div class="admin-info">
                <h4>${admin.username}</h4>
                <p>${admin.email}</p>
                <small>${admin.role} • Ostatnie logowanie: ${admin.lastLogin}</small>
            </div>
            <div class="admin-actions">
                <button class="btn btn-small btn-edit" onclick="editAdmin(${admin.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${admin.id !== 1 ? `<button class="btn btn-small btn-delete" onclick="deleteAdmin(${admin.id})">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

function loadSupportTickets() {
    const ticketsList = document.getElementById('supportTicketsList');
    if (!ticketsList) return;
    
    // Simulate support tickets data
    const tickets = [
        {
            id: 1,
            subject: 'Problem z instalacją moda ESX Jobs',
            priority: 'high',
            status: 'new',
            author: 'user@example.com',
            date: new Date().toLocaleDateString('pl-PL')
        },
        {
            id: 2,
            subject: 'Błąd w skrypcie Car Spawner',
            priority: 'medium',
            status: 'in_progress',
            author: 'developer@example.com',
            date: new Date().toLocaleDateString('pl-PL')
        }
    ];
    
    ticketsList.innerHTML = tickets.map(ticket => `
        <div class="ticket-item ${ticket.status}">
            <div class="ticket-header">
                <h4>${ticket.subject}</h4>
                <span class="ticket-priority priority-${ticket.priority}">${ticket.priority}</span>
            </div>
            <div class="ticket-meta">
                <span>Od: ${ticket.author}</span>
                <span>Data: ${ticket.date}</span>
                <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span>
            </div>
            <div class="ticket-actions">
                <button class="btn btn-small btn-primary" onclick="viewTicket(${ticket.id})">
                    <i class="fas fa-eye"></i> Zobacz
                </button>
                <button class="btn btn-small btn-success" onclick="resolveTicket(${ticket.id})">
                    <i class="fas fa-check"></i> Rozwiąż
                </button>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'new': 'Nowe',
        'in_progress': 'W trakcie',
        'resolved': 'Rozwiązane'
    };
    return statusMap[status] || status;
}

// Placeholder functions for admin actions
function editAdmin(id) {
    showNotification(`Edytowanie administratora ID: ${id}`, 'info');
}

function deleteAdmin(id) {
    if (confirm('Czy na pewno chcesz usunąć tego administratora?')) {
        showNotification('Administrator został usunięty', 'success');
    }
}

function viewTicket(id) {
    showNotification(`Wyświetlanie zgłoszenia ID: ${id}`, 'info');
}

function resolveTicket(id) {
    if (confirm('Czy na pewno chcesz oznaczyć to zgłoszenie jako rozwiązane?')) {
        showNotification('Zgłoszenie zostało rozwiązane', 'success');
        loadSupportTickets(); // Refresh the list
    }
}

window.showAdminManagement = showAdminManagement;
window.showSupportManagement = showSupportManagement;

function handlePurchase(modId) {
    const mod = modsManager.getMod(modId);
    if (mod && mod.status === 'available') {
        // Simulate purchase
        showNotification(`Zakupiono mod: ${mod.name}!`, 'success');
        mod.downloads++;
        modsManager.saveMods();
        
        // Here you would integrate with payment system
        console.log('Purchase initiated for mod:', mod);
    }
}

function editMod(modId) {
    const mod = modsManager.getMod(modId);
    if (mod) {
        // Fill form with existing data
        document.getElementById('modName').value = mod.name;
        document.getElementById('modDescription').value = mod.description;
        document.getElementById('modPrice').value = mod.price;
        document.getElementById('modCategory').value = mod.category;
        document.getElementById('modStatus').value = mod.status;
        document.getElementById('modImage').value = mod.image;
        document.getElementById('modDownloadLink').value = mod.downloadLink;
        
        // Change form to edit mode
        const form = document.getElementById('addModForm');
        form.dataset.editId = modId;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Aktualizuj Mod';
    }
}

function deleteMod(modId) {
    if (confirm('Czy na pewno chcesz usunąć ten mod?')) {
        modsManager.deleteMod(modId);
        showNotification('Mod został usunięty!', 'success');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Render mods on page load
    modsManager.renderMods();
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            
            console.log('Checking password:', password, 'against:', ADMIN_PASSWORD);
            console.log('Password length:', password.length, 'Expected length:', ADMIN_PASSWORD.length);
            
            if (password === ADMIN_PASSWORD) {
                console.log('Password correct!');
                isAdminLoggedIn = true;
                closeLoginModal();
                showAdminPanel();
                showNotification('Zalogowano pomyślnie!', 'success');
            } else {
                console.log('Password incorrect!');
                console.log('Tried:', JSON.stringify(password));
                console.log('Expected:', JSON.stringify(ADMIN_PASSWORD));
                showNotification('Nieprawidłowe hasło!', 'error');
                document.getElementById('adminPassword').value = '';
            }
        });
    }
    
    // Add/Edit Mod Form
    const addModForm = document.getElementById('addModForm');
    if (addModForm) {
        addModForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const modData = {
                name: document.getElementById('modName').value,
                description: document.getElementById('modDescription').value,
                price: parseFloat(document.getElementById('modPrice').value),
                category: document.getElementById('modCategory').value,
                status: document.getElementById('modStatus').value,
                image: document.getElementById('modImage').value || 'https://via.placeholder.com/400x250/1a1a2e/ffffff?text=Nowy_Mod',
                downloadLink: document.getElementById('modDownloadLink').value || '#'
            };
            
            const editId = this.dataset.editId;
            
            if (editId) {
                // Update existing mod
                modsManager.updateMod(editId, modData);
                showNotification('Mod został zaktualizowany!', 'success');
                delete this.dataset.editId;
                this.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Dodaj Mod';
            } else {
                // Add new mod
                modsManager.addMod(modData);
                showNotification('Nowy mod został dodany!', 'success');
            }
            
            this.reset();
        });
    }
});

// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.querySelector('#contactName').value,
                email: this.querySelector('#contactEmail').value,
                subject: this.querySelector('#contactSubject').value,
                message: this.querySelector('#contactMessage').value
            };
            
            // Here you would send the form data to your server
            console.log('Contact form submitted:', formData);
            
            // Show success message
            showNotification('Wiadomość została wysłana!', 'success');
            
            // Reset form
            this.reset();
        });
    }
});

// Support form functionality
document.addEventListener('DOMContentLoaded', function() {
    const supportForm = document.getElementById('supportForm');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.querySelector('#supportName').value,
                email: this.querySelector('#supportEmail').value,
                priority: this.querySelector('#supportPriority').value,
                category: this.querySelector('#supportCategory').value,
                subject: this.querySelector('#supportSubject').value,
                description: this.querySelector('#supportDescription').value
            };
            
            // Here you would send the form data to your server
            console.log('Support form submitted:', formData);
            
            // Show success message
            showNotification('Zgłoszenie zostało wysłane!', 'success');
            
            // Reset form
            this.reset();
        });
    }
});
