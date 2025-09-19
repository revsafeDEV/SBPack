// ==============================================
// SYSTEM AUTORYZACJI I REJESTRACJI UŻYTKOWNIKÓW
// ==============================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    // Inicjalizacja systemu autoryzacji
    init() {
        this.loadUserSession();
        this.setupEventListeners();
        this.updateUIState();
    }

    // Załadowanie sesji użytkownika z localStorage
    loadUserSession() {
        const sessionData = localStorage.getItem('sbmods_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (this.isSessionValid(session)) {
                    this.currentUser = session.user;
                    this.isLoggedIn = true;
                    console.log('User session restored:', this.currentUser.username);
                }
            } catch (error) {
                console.error('Error loading user session:', error);
                this.clearSession();
            }
        }
    }

    // Sprawdzenie ważności sesji
    isSessionValid(session) {
        if (!session.expires || !session.user) return false;
        return new Date(session.expires) > new Date();
    }

    // Zapisanie sesji użytkownika
    saveUserSession() {
        if (this.currentUser) {
            const sessionData = {
                user: this.currentUser,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dni
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('sbmods_session', JSON.stringify(sessionData));
        }
    }

    // Wyczyszczenie sesji
    clearSession() {
        localStorage.removeItem('sbmods_session');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.updateUIState();
    }

    // Konfiguracja event listeners
    setupEventListeners() {
        // Formularz rejestracji
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Formularz logowania
        const loginForm = document.getElementById('userLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Przyciski OAuth
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('oauth-btn')) {
                const provider = e.target.dataset.provider;
                this.handleOAuthLogin(provider);
            }
        });
    }

    // Rejestracja użytkownika
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Walidacja danych
        if (!this.validateRegistrationData(userData)) {
            return;
        }

        // Sprawdzenie czy zaakceptował regulamin
        if (typeof termsManager !== 'undefined' && !termsManager.hasAcceptedTerms()) {
            try {
                const accepted = await termsManager.showAcceptanceModal();
                if (!accepted) {
                    showNotification('Rejestracja anulowana - musisz zaakceptować regulamin', 'info');
                    return;
                }
            } catch (error) {
                console.error('Terms acceptance error:', error);
                showNotification('Błąd podczas akceptacji regulaminu', 'error');
                return;
            }
        }

        try {
            // Symulacja rejestracji - w rzeczywistości byłaby to obsługa przez API
            const user = await this.registerUser(userData);
            
            this.currentUser = user;
            this.isLoggedIn = true;
            this.saveUserSession();
            this.updateUIState();
            
            this.closeModal('registerModal');
            showNotification('Rejestracja zakończona pomyślnie! Witaj w SBMods!', 'success');
            
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Błąd podczas rejestracji: ' + error.message, 'error');
        }
    }

    // Logowanie użytkownika
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const user = await this.loginUser(loginData);
            
            this.currentUser = user;
            this.isLoggedIn = true;
            this.saveUserSession();
            this.updateUIState();
            
            this.closeModal('loginUserModal');
            showNotification(`Witaj ponownie, ${user.username}!`, 'success');
            
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Błąd logowania: ' + error.message, 'error');
        }
    }

    // OAuth logowanie
    async handleOAuthLogin(provider) {
        console.log(`Attempting OAuth login with ${provider}`);
        
        try {
            // Sprawdzenie czy provider jest skonfigurowany
            if (!window.OAuthConfig || !window.OAuthConfig[provider] || !window.OAuthConfig[provider].enabled) {
                // Fallback do symulacji jeśli provider nie jest skonfigurowany
                console.warn(`Provider ${provider} nie jest skonfigurowany. Używam symulacji.`);
                this.simulateOAuthLogin(provider);
                return;
            }
            
            // Pokazanie loading state
            this.showOAuthLoading(provider);
            
            // Rozpoczęcie prawdziwego OAuth flow
            const authUrl = window.OAuthHelpers.buildAuthUrl(provider);
            
            // Otwarcie okna OAuth w popup
            const popup = window.open(
                authUrl,
                `oauth_${provider}`,
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );
            
            if (!popup) {
                throw new Error('Popup zostało zablokowane. Sprawdź ustawienia przeglądarki.');
            }
            
            // Nasłuchiwanie na zamknięcie popup lub callback
            const result = await this.waitForOAuthCallback(popup, provider);
            
            if (result.success) {
                await this.processOAuthSuccess(result.data, provider);
            } else {
                throw new Error(result.error || 'OAuth authorization failed');
            }
            
        } catch (error) {
            console.error(`${provider} OAuth error:`, error);
            showNotification(`Błąd logowania przez ${provider}: ${error.message}`, 'error');
            this.hideOAuthLoading(provider);
        }
    }

    // Oczekiwanie na callback z OAuth
    waitForOAuthCallback(popup, provider) {
        return new Promise((resolve, reject) => {
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    this.hideOAuthLoading(provider);
                    reject(new Error('OAuth anulowane przez użytkownika'));
                }
            }, 1000);
            
            // Nasłuchiwanie na wiadomości z popup
            const messageListener = (event) => {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'OAUTH_SUCCESS' && event.data.provider === provider) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageListener);
                    popup.close();
                    this.hideOAuthLoading(provider);
                    resolve({ success: true, data: event.data });
                }
                
                if (event.data.type === 'OAUTH_ERROR' && event.data.provider === provider) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageListener);
                    popup.close();
                    this.hideOAuthLoading(provider);
                    resolve({ success: false, error: event.data.error });
                }
            };
            
            window.addEventListener('message', messageListener);
            
            // Timeout po 5 minutach
            setTimeout(() => {
                clearInterval(checkClosed);
                window.removeEventListener('message', messageListener);
                if (!popup.closed) popup.close();
                this.hideOAuthLoading(provider);
                reject(new Error('OAuth timeout'));
            }, 300000); // 5 minut
        });
    }

    // Przetworzenie udanej autoryzacji OAuth
    async processOAuthSuccess(data, provider) {
        try {
            // Weryfikacja state dla bezpieczeństwa
            if (!window.OAuthHelpers.verifyState(provider, data.state)) {
                throw new Error('Invalid state parameter');
            }
            
            // Utworzenie użytkownika z danych OAuth
            const user = {
                id: `${provider}_${data.user.id}`,
                username: data.user.username || data.user.login || data.user.name || `${provider}_user`,
                email: data.user.email,
                displayName: data.user.name || data.user.display_name || data.user.login,
                avatar: data.user.avatar_url || data.user.picture || data.user.avatar || `https://via.placeholder.com/100x100?text=${provider[0].toUpperCase()}`,
                provider: provider,
                providerId: data.user.id,
                role: 'user',
                joinDate: new Date().toISOString(),
                permissions: ['upload_mods', 'comment', 'rate'],
                oauthData: {
                    accessToken: data.access_token, // Zapisane dla przyszłych API calls
                    refreshToken: data.refresh_token,
                    expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : null
                }
            };
            
            this.currentUser = user;
            this.isLoggedIn = true;
            this.saveUserSession();
            this.updateUIState();
            
            this.closeAllModals();
            showNotification(`Pomyślnie zalogowano przez ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, 'success');
            
        } catch (error) {
            console.error('OAuth processing error:', error);
            throw error;
        }
    }

    // Pokazanie loading state dla OAuth
    showOAuthLoading(provider) {
        const btn = document.querySelector(`.oauth-btn[data-provider="${provider}"]`);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('loading');
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <div class="oauth-loading">
                    <div class="oauth-spinner"></div>
                    <span>Łączenie...</span>
                </div>
            `;
            btn.dataset.originalText = originalText;
        }
    }

    // Ukrycie loading state dla OAuth
    hideOAuthLoading(provider) {
        const btn = document.querySelector(`.oauth-btn[data-provider="${provider}"]`);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('loading');
            if (btn.dataset.originalText) {
                btn.innerHTML = btn.dataset.originalText;
                delete btn.dataset.originalText;
            }
        }
    }

    // Symulacja OAuth logowania (fallback)
    async simulateOAuthLogin(provider) {
        try {
            this.showOAuthLoading(provider);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const user = {
                id: `sim_${provider}_${Date.now()}`,
                username: `${provider}_user_${Math.random().toString(36).substr(2, 9)}`,
                email: `user@${provider}.example.com`,
                displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                avatar: `https://via.placeholder.com/100x100?text=${provider[0].toUpperCase()}`,
                provider: provider,
                role: 'user',
                joinDate: new Date().toISOString(),
                permissions: ['upload_mods', 'comment', 'rate'],
                isSimulated: true
            };

            this.currentUser = user;
            this.isLoggedIn = true;
            this.saveUserSession();
            this.updateUIState();
            
            this.closeAllModals();
            this.hideOAuthLoading(provider);
            showNotification(`Zalogowano przez ${provider} (symulacja)!`, 'success');
            
        } catch (error) {
            console.error(`${provider} OAuth simulation error:`, error);
            this.hideOAuthLoading(provider);
            showNotification(`Błąd logowania przez ${provider}`, 'error');
        }
    }

    // Walidacja danych rejestracji
    validateRegistrationData(userData) {
        if (userData.username.length < 3) {
            showNotification('Nazwa użytkownika musi mieć co najmniej 3 znaki', 'error');
            return false;
        }

        if (userData.password.length < 6) {
            showNotification('Hasło musi mieć co najmniej 6 znaków', 'error');
            return false;
        }

        if (userData.password !== userData.confirmPassword) {
            showNotification('Hasła nie są zgodne', 'error');
            return false;
        }

        if (!this.isValidEmail(userData.email)) {
            showNotification('Nieprawidłowy format email', 'error');
            return false;
        }

        return true;
    }

    // Walidacja email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Symulacja rejestracji użytkownika
    async registerUser(userData) {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sprawdzenie czy użytkownik już istnieje (symulacja)
        const existingUsers = this.getExistingUsers();
        if (existingUsers.find(u => u.email === userData.email)) {
            throw new Error('Użytkownik z tym adresem email już istnieje');
        }

        // Utworzenie nowego użytkownika
        const newUser = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            displayName: userData.username,
            avatar: `https://via.placeholder.com/100x100?text=${userData.username[0].toUpperCase()}`,
            provider: 'local',
            role: 'user',
            joinDate: new Date().toISOString(),
            permissions: ['upload_mods', 'comment', 'rate'],
            stats: {
                uploadedMods: 0,
                totalDownloads: 0,
                rating: 0,
                reviews: 0
            }
        };

        // Zapisanie użytkownika (symulacja)
        existingUsers.push(newUser);
        this.saveUsers(existingUsers);

        return newUser;
    }

    // Symulacja logowania użytkownika
    async loginUser(loginData) {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const existingUsers = this.getExistingUsers();
        const user = existingUsers.find(u => u.email === loginData.email);
        
        if (!user) {
            throw new Error('Użytkownik nie istnieje');
        }

        // W rzeczywistości tutaj byłaby weryfikacja hasła
        return user;
    }

    // Pobieranie użytkowników z localStorage
    getExistingUsers() {
        const users = localStorage.getItem('sbmods_users');
        return users ? JSON.parse(users) : [];
    }

    // Zapisywanie użytkowników do localStorage
    saveUsers(users) {
        localStorage.setItem('sbmods_users', JSON.stringify(users));
    }

    // Wylogowanie użytkownika
    logout() {
        this.clearSession();
        showNotification('Zostałeś wylogowany', 'info');
        
        // Przekierowanie na stronę główną jeśli jesteśmy na stronie wymagającej logowania
        if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('profile')) {
            window.location.href = '/';
        }
    }

    // Aktualizacja stanu UI
    updateUIState() {
        this.updateNavigation();
        this.updateUserProfile();
        this.toggleAuthButtons();
    }

    // Aktualizacja nawigacji
    updateNavigation() {
        const userNav = document.querySelector('.user-navigation');
        const authButtons = document.querySelector('.auth-buttons');
        
        if (this.isLoggedIn && userNav) {
            userNav.style.display = 'flex';
            if (authButtons) authButtons.style.display = 'none';
            
            // Aktualizacja avatar i nazwy
            const userAvatar = userNav.querySelector('.user-avatar img');
            const userName = userNav.querySelector('.user-name');
            
            if (userAvatar && this.currentUser.avatar) {
                userAvatar.src = this.currentUser.avatar;
            }
            if (userName) {
                userName.textContent = this.currentUser.displayName || this.currentUser.username;
            }
        } else {
            if (userNav) userNav.style.display = 'none';
            if (authButtons) authButtons.style.display = 'flex';
        }
    }

    // Aktualizacja profilu użytkownika
    updateUserProfile() {
        // Aktualizacja elementów profilu na stronie
        const profileElements = document.querySelectorAll('[data-user-info]');
        profileElements.forEach(element => {
            const infoType = element.dataset.userInfo;
            if (this.currentUser && this.currentUser[infoType]) {
                element.textContent = this.currentUser[infoType];
            }
        });
    }

    // Przełączanie przycisków autoryzacji
    toggleAuthButtons() {
        const loginBtns = document.querySelectorAll('.login-btn');
        const logoutBtns = document.querySelectorAll('.logout-btn');
        const userOnlyElements = document.querySelectorAll('.user-only');
        
        if (this.isLoggedIn) {
            loginBtns.forEach(btn => btn.style.display = 'none');
            logoutBtns.forEach(btn => btn.style.display = 'block');
            userOnlyElements.forEach(el => el.style.display = 'block');
        } else {
            loginBtns.forEach(btn => btn.style.display = 'block');
            logoutBtns.forEach(btn => btn.style.display = 'none');
            userOnlyElements.forEach(el => el.style.display = 'none');
        }
    }

    // Sprawdzenie uprawnień użytkownika
    hasPermission(permission) {
        if (!this.isLoggedIn || !this.currentUser) return false;
        return this.currentUser.permissions && this.currentUser.permissions.includes(permission);
    }

    // Sprawdzenie roli użytkownika
    hasRole(role) {
        if (!this.isLoggedIn || !this.currentUser) return false;
        return this.currentUser.role === role;
    }

    // Otwarcie modalea
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Zamknięcie modala
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Zamknięcie wszystkich modali
    closeAllModals() {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Pobieranie danych aktualnego użytkownika
    getCurrentUser() {
        return this.currentUser;
    }

    // Sprawdzenie czy użytkownik jest zalogowany
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Globalna instancja menedżera autoryzacji
window.authManager = new AuthManager();

// Globalne funkcje pomocnicze
window.showRegisterModal = () => authManager.showModal('registerModal');
window.showLoginModal = () => authManager.showModal('loginUserModal');
window.closeAuthModal = (modalId) => authManager.closeModal(modalId);
window.userLogout = () => authManager.logout();
