// ==============================================
// SYSTEM DODAWANIA MODÓW PRZEZ UŻYTKOWNIKÓW
// ==============================================

class UserModsManager {
    constructor() {
        this.userMods = [];
        this.pendingMods = [];
        this.init();
    }

    // Inicjalizacja systemu
    init() {
        this.loadUserMods();
        this.setupEventListeners();
    }

    // Załadowanie modów użytkowników
    loadUserMods() {
        const savedMods = localStorage.getItem('sbmods_user_mods');
        if (savedMods) {
            this.userMods = JSON.parse(savedMods);
        }

        const pendingMods = localStorage.getItem('sbmods_pending_mods');
        if (pendingMods) {
            this.pendingMods = JSON.parse(pendingMods);
        }
    }

    // Zapisanie modów
    saveUserMods() {
        localStorage.setItem('sbmods_user_mods', JSON.stringify(this.userMods));
        localStorage.setItem('sbmods_pending_mods', JSON.stringify(this.pendingMods));
    }

    // Konfiguracja event listeners
    setupEventListeners() {
        const addModForm = document.getElementById('addUserModForm');
        if (addModForm) {
            addModForm.addEventListener('submit', (e) => this.handleAddMod(e));
        }
    }

    // Dodanie nowego moda przez użytkownika
    async handleAddMod(event) {
        event.preventDefault();

        // Sprawdzenie czy użytkownik jest zalogowany
        if (!authManager.isAuthenticated()) {
            showNotification('Musisz być zalogowany aby dodać mod', 'error');
            showRegisterModal();
            return;
        }

        // Sprawdzenie uprawnień
        if (!authManager.hasPermission('upload_mods')) {
            showNotification('Nie masz uprawnień do dodawania modów', 'error');
            return;
        }

        const formData = new FormData(event.target);
        const modData = {
            name: formData.get('modName'),
            description: formData.get('modDescription'),
            category: formData.get('modCategory'),
            price: parseFloat(formData.get('modPrice')) || 0,
            image: formData.get('modImage') || 'https://via.placeholder.com/400x300?text=Mod+Image',
            downloadLink: formData.get('modDownloadLink'),
            tags: formData.get('modTags') ? formData.get('modTags').split(',').map(tag => tag.trim()) : [],
            version: formData.get('modVersion') || '1.0.0'
        };

        // Walidacja danych
        if (!this.validateModData(modData)) {
            return;
        }

        try {
            showNotification('Przesyłanie moda...', 'info');
            await this.submitMod(modData);
            
            event.target.reset();
            this.closeAddModModal();
            showNotification('Mod został przesłany do moderacji!', 'success');
            
        } catch (error) {
            console.error('Error submitting mod:', error);
            showNotification('Błąd podczas przesyłania moda: ' + error.message, 'error');
        }
    }

    // Walidacja danych moda
    validateModData(modData) {
        if (modData.name.length < 3) {
            showNotification('Nazwa moda musi mieć co najmniej 3 znaki', 'error');
            return false;
        }

        if (modData.description.length < 20) {
            showNotification('Opis moda musi mieć co najmniej 20 znaków', 'error');
            return false;
        }

        if (!modData.category) {
            showNotification('Wybierz kategorię moda', 'error');
            return false;
        }

        if (modData.price < 0) {
            showNotification('Cena nie może być ujemna', 'error');
            return false;
        }

        if (!modData.downloadLink) {
            showNotification('Podaj link do pobrania moda', 'error');
            return false;
        }

        if (!this.isValidURL(modData.downloadLink)) {
            showNotification('Podaj prawidłowy URL do pobrania', 'error');
            return false;
        }

        return true;
    }

    // Sprawdzenie poprawności URL
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Przesłanie moda do moderacji
    async submitMod(modData) {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const currentUser = authManager.getCurrentUser();
        
        const newMod = {
            id: 'user_' + Date.now(),
            ...modData,
            author: {
                id: currentUser.id,
                username: currentUser.username,
                displayName: currentUser.displayName || currentUser.username,
                avatar: currentUser.avatar
            },
            status: 'pending_approval',
            submittedAt: new Date().toISOString(),
            downloads: 0,
            rating: 0,
            reviews: [],
            flags: {
                verified: false,
                featured: false,
                community: true
            }
        };

        // Dodanie do listy oczekujących na moderację
        this.pendingMods.push(newMod);
        this.saveUserMods();

        // Aktualizacja statystyk użytkownika
        if (currentUser.stats) {
            currentUser.stats.uploadedMods++;
        }

        return newMod;
    }

    // Pobieranie modów użytkownika
    getUserMods(userId) {
        return this.userMods.filter(mod => mod.author.id === userId);
    }

    // Pobieranie modów oczekujących na moderację
    getPendingMods() {
        return this.pendingMods;
    }

    // Zatwierdzenie moda przez administratora
    approveMod(modId) {
        const modIndex = this.pendingMods.findIndex(mod => mod.id === modId);
        if (modIndex !== -1) {
            const mod = this.pendingMods[modIndex];
            mod.status = 'available';
            mod.approvedAt = new Date().toISOString();
            
            // Przeniesienie do głównej listy modów
            this.userMods.push(mod);
            
            // Dodanie do głównego systemu modów
            if (typeof modsManager !== 'undefined') {
                modsManager.addMod(mod);
            }
            
            // Usunięcie z listy oczekujących
            this.pendingMods.splice(modIndex, 1);
            this.saveUserMods();
            
            showNotification(`Mod "${mod.name}" został zatwierdzony!`, 'success');
            return true;
        }
        return false;
    }

    // Odrzucenie moda
    rejectMod(modId, reason) {
        const modIndex = this.pendingMods.findIndex(mod => mod.id === modId);
        if (modIndex !== -1) {
            const mod = this.pendingMods[modIndex];
            mod.status = 'rejected';
            mod.rejectedAt = new Date().toISOString();
            mod.rejectionReason = reason;
            
            this.saveUserMods();
            showNotification(`Mod "${mod.name}" został odrzucony`, 'info');
            return true;
        }
        return false;
    }

    // Renderowanie modów użytkownika w dashboardzie
    renderUserMods(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentUser = authManager.getCurrentUser();
        if (!currentUser) {
            container.innerHTML = '<p>Musisz być zalogowany aby zobaczyć swoje mody.</p>';
            return;
        }

        const userMods = this.getUserMods(currentUser.id);
        const userPending = this.pendingMods.filter(mod => mod.author.id === currentUser.id);
        const allUserMods = [...userMods, ...userPending];

        if (allUserMods.length === 0) {
            container.innerHTML = `
                <div class="no-mods-message">
                    <i class="fas fa-gamepad fa-3x"></i>
                    <h3>Nie masz jeszcze żadnych modów</h3>
                    <p>Dodaj swój pierwszy mod i podziel się nim ze społecznością!</p>
                    <button class="btn btn-primary" onclick="showAddModModal()">
                        <i class="fas fa-plus"></i> Dodaj pierwszy mod
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="user-mods-grid">
                ${allUserMods.map(mod => this.createUserModCard(mod)).join('')}
            </div>
        `;
    }

    // Utworzenie karty moda użytkownika
    createUserModCard(mod) {
        const statusClass = mod.status.replace('_', '-');
        const statusText = this.getStatusText(mod.status);
        
        return `
            <div class="user-mod-card status-${statusClass}">
                <div class="mod-status-badge">${statusText}</div>
                <div class="mod-image">
                    <img src="${mod.image}" alt="${mod.name}" loading="lazy">
                </div>
                <div class="mod-info">
                    <h4>${mod.name}</h4>
                    <p class="mod-description">${mod.description.substring(0, 100)}...</p>
                    <div class="mod-meta">
                        <span class="mod-category">
                            <i class="fas ${this.getCategoryIcon(mod.category)}"></i>
                            ${mod.category}
                        </span>
                        <span class="mod-price">
                            ${mod.price > 0 ? mod.price + ' PLN' : 'Darmowy'}
                        </span>
                    </div>
                    <div class="mod-stats">
                        <span><i class="fas fa-download"></i> ${mod.downloads}</span>
                        <span><i class="fas fa-star"></i> ${mod.rating}/5</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(mod.submittedAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div class="mod-actions">
                        <button class="btn btn-small btn-edit" onclick="editUserMod('${mod.id}')">
                            <i class="fas fa-edit"></i> Edytuj
                        </button>
                        <button class="btn btn-small btn-delete" onclick="deleteUserMod('${mod.id}')">
                            <i class="fas fa-trash"></i> Usuń
                        </button>
                        ${mod.status === 'available' ? `
                            <button class="btn btn-small btn-stats" onclick="showModStats('${mod.id}')">
                                <i class="fas fa-chart-bar"></i> Statystyki
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Pobieranie tekstu statusu
    getStatusText(status) {
        const statusMap = {
            'pending_approval': 'Oczekuje na moderację',
            'available': 'Dostępny',
            'rejected': 'Odrzucony',
            'disabled': 'Wyłączony'
        };
        return statusMap[status] || status;
    }

    // Pobieranie ikony kategorii
    getCategoryIcon(category) {
        const iconMap = {
            'skrypty': 'fa-code',
            'pojazdy': 'fa-car',
            'mapy': 'fa-map',
            'skins': 'fa-tshirt',
            'inne': 'fa-puzzle-piece'
        };
        return iconMap[category] || 'fa-gamepad';
    }

    // Renderowanie modów do moderacji (dla adminów)
    renderPendingMods(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const pendingMods = this.getPendingMods();
        
        if (pendingMods.length === 0) {
            container.innerHTML = `
                <div class="no-pending-mods">
                    <i class="fas fa-check-circle fa-3x"></i>
                    <h3>Brak modów do moderacji</h3>
                    <p>Wszystkie przesłane mody zostały już zweryfikowane.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="pending-mods-list">
                ${pendingMods.map(mod => this.createPendingModCard(mod)).join('')}
            </div>
        `;
    }

    // Karta moda do moderacji
    createPendingModCard(mod) {
        return `
            <div class="pending-mod-card">
                <div class="mod-header">
                    <img src="${mod.image}" alt="${mod.name}" class="mod-thumbnail">
                    <div class="mod-basic-info">
                        <h4>${mod.name}</h4>
                        <p class="mod-author">
                            <img src="${mod.author.avatar}" alt="${mod.author.username}" class="author-avatar">
                            ${mod.author.displayName}
                        </p>
                        <div class="mod-meta">
                            <span>${mod.category}</span>
                            <span>${mod.price > 0 ? mod.price + ' PLN' : 'Darmowy'}</span>
                            <span>${new Date(mod.submittedAt).toLocaleDateString('pl-PL')}</span>
                        </div>
                    </div>
                </div>
                <div class="mod-description">
                    <p>${mod.description}</p>
                </div>
                <div class="mod-details">
                    <div class="detail-item">
                        <strong>Wersja:</strong> ${mod.version}
                    </div>
                    <div class="detail-item">
                        <strong>Link:</strong> <a href="${mod.downloadLink}" target="_blank">${mod.downloadLink}</a>
                    </div>
                    ${mod.tags.length > 0 ? `
                        <div class="detail-item">
                            <strong>Tagi:</strong> ${mod.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="mod-moderation-actions">
                    <button class="btn btn-success" onclick="userModsManager.approveMod('${mod.id}')">
                        <i class="fas fa-check"></i> Zatwierdź
                    </button>
                    <button class="btn btn-danger" onclick="showRejectModal('${mod.id}')">
                        <i class="fas fa-times"></i> Odrzuć
                    </button>
                    <button class="btn btn-secondary" onclick="showModPreview('${mod.id}')">
                        <i class="fas fa-eye"></i> Podgląd
                    </button>
                </div>
            </div>
        `;
    }

    // Otwarcie modala dodawania moda
    showAddModModal() {
        if (!authManager.isAuthenticated()) {
            showNotification('Musisz być zalogowany aby dodać mod', 'error');
            showRegisterModal();
            return;
        }

        const modal = document.getElementById('addModModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Zamknięcie modala dodawania moda
    closeAddModModal() {
        const modal = document.getElementById('addModModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Pobieranie wszystkich modów społeczności
    getCommunityMods() {
        return this.userMods.filter(mod => mod.flags.community);
    }

    // Pobieranie oficjalnych modów SBPack
    getOfficialMods() {
        // Integracja z głównym systemem modów
        if (typeof modsManager !== 'undefined') {
            return modsManager.getAllMods().filter(mod => !mod.flags || !mod.flags.community);
        }
        return [];
    }
}

// Globalna instancja menedżera modów użytkowników
window.userModsManager = new UserModsManager();

// Globalne funkcje pomocnicze
window.showAddModModal = () => userModsManager.showAddModModal();
window.showUserDashboard = () => {
    // Implementacja dashboard użytkownika
    console.log('Opening user dashboard...');
    if (!authManager.isAuthenticated()) {
        showNotification('Musisz być zalogowany', 'error');
        showLoginModal();
        return;
    }
    // TODO: Implementacja pełnego dashboardu
    showAddModModal();
};
