// ==============================================
// SYSTEM NOTYFIKACJI I FEEDBACK
// ==============================================

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.injectStyles();
    }

    // Utworzenie kontenera na notyfikacje
    createContainer() {
        if (document.getElementById('notifications-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }

    // Wstrzyknięcie stylów CSS
    injectStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notifications-container {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }

            .notification {
                min-width: 300px;
                max-width: 400px;
                padding: 16px 20px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
                font-family: var(--font-sans, 'Inter', sans-serif);
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: translateX(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .notification::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                pointer-events: none;
            }

            .notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }

            .notification.warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }

            .notification.info {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }

            .notification-icon {
                font-size: 18px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
            }

            .notification-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .notification-title {
                font-weight: 600;
                font-size: 14px;
            }

            .notification-message {
                font-weight: 400;
                opacity: 0.9;
                font-size: 13px;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                transform-origin: left;
                transition: transform linear;
            }

            @media (max-width: 768px) {
                .notifications-container {
                    top: 80px;
                    left: 20px;
                    right: 20px;
                    width: auto;
                }

                .notification {
                    min-width: auto;
                    max-width: none;
                }
            }

            /* Loading states dla OAuth */
            .oauth-btn.loading {
                pointer-events: none;
                opacity: 0.7;
                position: relative;
            }

            .oauth-loading {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .oauth-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-left: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Fade in animation */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .fade-in {
                animation: fadeInUp 0.6s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    // Główna funkcja pokazywania notyfikacji
    show(message, type = 'info', options = {}) {
        const config = {
            title: options.title || this.getDefaultTitle(type),
            duration: options.duration || this.getDefaultDuration(type),
            closable: options.closable !== false,
            persistent: options.persistent || false,
            showProgress: options.showProgress !== false,
            ...options
        };

        const notification = this.createNotification(message, type, config);
        this.addToContainer(notification);
        
        // Auto remove after duration (if not persistent)
        if (!config.persistent && config.duration > 0) {
            this.scheduleRemoval(notification, config.duration);
        }

        return notification;
    }

    // Utworzenie elementu notyfikacji
    createNotification(message, type, config) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.type = type;

        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                ${config.title ? `<div class="notification-title">${config.title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            ${config.closable ? '<button class="notification-close"><i class="fas fa-times"></i></button>' : ''}
            ${config.showProgress && config.duration > 0 && !config.persistent ? '<div class="notification-progress"></div>' : ''}
        `;

        // Event listeners
        if (config.closable) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove(notification);
            });
        }

        // Click to dismiss (if closable)
        if (config.closable) {
            notification.addEventListener('click', () => {
                this.remove(notification);
            });
        }

        // Store config on element
        notification._config = config;

        return notification;
    }

    // Dodanie notyfikacji do kontenera
    addToContainer(notification) {
        const container = document.getElementById('notifications-container');
        
        // Usuń nadmiarowe notyfikacje
        this.enforceLimit();
        
        container.appendChild(notification);
        this.notifications.push(notification);

        // Trigger show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }

    // Zaplanowanie usunięcia notyfikacji
    scheduleRemoval(notification, duration) {
        // Progress bar animation
        const progressBar = notification.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.transform = 'scaleX(0)';
            progressBar.style.transition = `transform ${duration}ms linear`;
            
            requestAnimationFrame(() => {
                progressBar.style.transform = 'scaleX(1)';
            });
        }

        // Schedule removal
        setTimeout(() => {
            this.remove(notification);
        }, duration);
    }

    // Usunięcie notyfikacji
    remove(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    // Wymuszenie limitu notyfikacji
    enforceLimit() {
        while (this.notifications.length >= this.maxNotifications) {
            const oldestNotification = this.notifications[0];
            if (oldestNotification && !oldestNotification._config?.persistent) {
                this.remove(oldestNotification);
            } else {
                break; // Jeśli najstarsza jest persistent, przerwij
            }
        }
    }

    // Pobranie ikony dla typu notyfikacji
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Pobranie domyślnego tytułu
    getDefaultTitle(type) {
        const titles = {
            success: 'Sukces',
            error: 'Błąd',
            warning: 'Uwaga',
            info: 'Informacja'
        };
        return titles[type] || '';
    }

    // Pobranie domyślnego czasu wyświetlania
    getDefaultDuration(type) {
        const durations = {
            success: 4000,
            error: 6000,
            warning: 5000,
            info: 4000
        };
        return durations[type] || 4000;
    }

    // Wyczyszczenie wszystkich notyfikacji
    clearAll() {
        [...this.notifications].forEach(notification => {
            if (!notification._config?.persistent) {
                this.remove(notification);
            }
        });
    }

    // Wyczyszczenie notyfikacji określonego typu
    clearByType(type) {
        [...this.notifications].forEach(notification => {
            if (notification.dataset.type === type && !notification._config?.persistent) {
                this.remove(notification);
            }
        });
    }

    // Sprawdzenie czy istnieją notyfikacje danego typu
    hasNotificationType(type) {
        return this.notifications.some(n => n.dataset.type === type);
    }
}

// Globalna instancja
window.notificationManager = new NotificationManager();

// Globalne funkcje pomocnicze (dla zgodności wstecznej)
window.showNotification = (message, type = 'info', options = {}) => {
    return window.notificationManager.show(message, type, options);
};

// Convenience functions
window.showSuccess = (message, options = {}) => {
    return window.notificationManager.show(message, 'success', options);
};

window.showError = (message, options = {}) => {
    return window.notificationManager.show(message, 'error', options);
};

window.showWarning = (message, options = {}) => {
    return window.notificationManager.show(message, 'warning', options);
};

window.showInfo = (message, options = {}) => {
    return window.notificationManager.show(message, 'info', options);
};

// Eksport dla modułów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}