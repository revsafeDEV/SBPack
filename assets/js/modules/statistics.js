// ==============================================
// STATISTICS SYSTEM
// ==============================================

class StatisticsManager {
    constructor() {
        this.stats = this.loadStats();
        this.init();
    }

    // Inicjalizacja systemu statystyk
    init() {
        this.updateAllStats();
        this.schedulePeriodicUpdates();
    }

    // Ładowanie statystyk z localStorage lub bazy danych
    loadStats() {
        const savedStats = localStorage.getItem('sbpack_statistics');
        if (savedStats) {
            return JSON.parse(savedStats);
        }
        
        // Domyślne statystyki oparte na prawdziwych danych z bazy
        return this.getDefaultStats();
    }

    // Domyślne statystyki
    getDefaultStats() {
        return {
            totalDownloads: 6887,
            totalUsers: 1247,
            totalPurchases: 199,
            totalRevenue: 9454.01,
            averageRating: 4.8,
            totalReviews: 263,
            activeMods: 4,
            premiumMods: 3,
            freeMods: 1,
            lastUpdate: new Date().toISOString(),
            modStats: {
                '1': { downloads: 1547, purchases: 89, revenue: 2668.11, rating: 4.8 },
                '2': { downloads: 1203, purchases: 67, revenue: 3346.33, rating: 4.9 },
                '3': { downloads: 892, purchases: 43, revenue: 3439.57, rating: 4.7 },
                '4': { downloads: 3245, purchases: 0, revenue: 0, rating: 4.9 }
            }
        };
    }

    // Zapisywanie statystyk
    saveStats() {
        this.stats.lastUpdate = new Date().toISOString();
        localStorage.setItem('sbpack_statistics', JSON.stringify(this.stats));
    }

    // Aktualizacja wszystkich statystyk na stronie
    updateAllStats() {
        this.updateHeroStats();
        this.updateModsPageStats();
        this.updateGlobalCounters();
        this.updateRealTimeData();
    }

    // Aktualizacja statystyk w sekcji hero
    updateHeroStats() {
        // Statystyki w hero section
        const heroStats = document.querySelectorAll('.hero-stats .stat-number, .stat-number');
        if (heroStats.length >= 4) {
            heroStats[0].textContent = this.formatNumber(this.stats.totalUsers);
            heroStats[1].textContent = `${this.stats.averageRating}/5`;
            heroStats[2].textContent = 'Weekly';
            heroStats[3].textContent = this.stats.activeMods + '+';
        }

        // Stats grid na stronie głównej
        const statsGrid = document.querySelectorAll('.stats-grid .stat-number');
        if (statsGrid.length >= 4) {
            statsGrid[0].textContent = this.stats.totalUsers + '+';
            statsGrid[1].textContent = `${this.stats.averageRating}/5`;
            statsGrid[2].textContent = 'Weekly';
            statsGrid[3].textContent = this.stats.activeMods + '+';
        }
    }

    // Aktualizacja statystyk na stronie modów
    updateModsPageStats() {
        const totalDownloadsEl = document.getElementById('totalDownloads');
        const totalModsEl = document.getElementById('totalMods');
        
        if (totalDownloadsEl) {
            totalDownloadsEl.textContent = this.formatNumber(this.stats.totalDownloads);
        }
        
        if (totalModsEl) {
            totalModsEl.textContent = this.stats.activeMods;
        }

        // Aktualizacja liczników kategorii
        this.updateCategoryCounters();
    }

    // Aktualizacja liczników kategorii
    updateCategoryCounters() {
        if (typeof modsManager === 'undefined') return;
        
        const allMods = modsManager.getAllMods();
        const categories = ['all', 'skrypty', 'pojazdy', 'mapy', 'skins', 'free'];
        
        categories.forEach(category => {
            const badge = document.querySelector(`[data-count="${category}"]`);
            if (badge) {
                let count = 0;
                if (category === 'all') {
                    count = allMods.length;
                } else if (category === 'free') {
                    count = allMods.filter(mod => mod.price === 0).length;
                } else {
                    count = allMods.filter(mod => mod.category === category).length;
                }
                badge.textContent = count;
            }
        });
    }

    // Aktualizacja globalnych liczników
    updateGlobalCounters() {
        // Aktualizacja liczników wszędzie gdzie potrzeba
        const elements = {
            '.total-downloads': this.stats.totalDownloads,
            '.total-users': this.stats.totalUsers,
            '.total-purchases': this.stats.totalPurchases,
            '.average-rating': this.stats.averageRating,
            '.active-mods': this.stats.activeMods
        };

        Object.entries(elements).forEach(([selector, value]) => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.textContent = typeof value === 'number' && value > 1000 ? 
                    this.formatNumber(value) : value;
            });
        });
    }

    // Aktualizacja danych w czasie rzeczywistym
    updateRealTimeData() {
        // Symulacja aktualizacji statystyk w czasie rzeczywistym
        const now = new Date();
        const lastUpdate = new Date(this.stats.lastUpdate);
        const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursDiff > 1) {
            // Dodanie małych przyrostów co godzinę
            this.stats.totalDownloads += Math.floor(Math.random() * 5) + 1;
            this.stats.totalUsers += Math.floor(Math.random() * 2);
            
            // Losowa aktualizacja pobrań poszczególnych modów
            Object.keys(this.stats.modStats).forEach(modId => {
                if (Math.random() > 0.7) { // 30% szansy na aktualizację
                    this.stats.modStats[modId].downloads += Math.floor(Math.random() * 3) + 1;
                }
            });
            
            this.saveStats();
        }
    }

    // Zwiększenie liczby pobrań moda
    incrementDownloads(modId, count = 1) {
        this.stats.totalDownloads += count;
        
        if (this.stats.modStats[modId]) {
            this.stats.modStats[modId].downloads += count;
        }
        
        // Aktualizacja w modsManager
        if (typeof modsManager !== 'undefined') {
            const mod = modsManager.getMod(modId);
            if (mod) {
                mod.downloads = (mod.downloads || 0) + count;
                modsManager.saveMods();
            }
        }
        
        this.saveStats();
        this.updateAllStats();
    }

    // Zwiększenie liczby zakupów
    incrementPurchases(modId, revenue = 0) {
        this.stats.totalPurchases += 1;
        this.stats.totalRevenue += revenue;
        
        if (this.stats.modStats[modId]) {
            this.stats.modStats[modId].purchases += 1;
            this.stats.modStats[modId].revenue += revenue;
        }
        
        this.saveStats();
        this.updateAllStats();
    }

    // Zwiększenie liczby użytkowników
    incrementUsers(count = 1) {
        this.stats.totalUsers += count;
        this.saveStats();
        this.updateAllStats();
    }

    // Formatowanie liczb (np. 1200 -> 1.2k)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Pobieranie statystyk moda
    getModStats(modId) {
        return this.stats.modStats[modId] || {
            downloads: 0,
            purchases: 0,
            revenue: 0,
            rating: 0
        };
    }

    // Aktualizacja oceny moda
    updateModRating(modId, rating) {
        if (this.stats.modStats[modId]) {
            this.stats.modStats[modId].rating = rating;
            this.recalculateAverageRating();
            this.saveStats();
            this.updateAllStats();
        }
    }

    // Przeliczenie średniej oceny
    recalculateAverageRating() {
        const ratings = Object.values(this.stats.modStats).map(stat => stat.rating || 0);
        const validRatings = ratings.filter(rating => rating > 0);
        
        if (validRatings.length > 0) {
            this.stats.averageRating = (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1);
        }
    }

    // Harmonogram okresowych aktualizacji
    schedulePeriodicUpdates() {
        // Aktualizacja co 5 minut
        setInterval(() => {
            this.updateRealTimeData();
        }, 5 * 60 * 1000);
        
        // Aktualizacja wyświetlania co 30 sekund
        setInterval(() => {
            this.updateAllStats();
        }, 30 * 1000);
    }

    // Eksport statystyk
    exportStats() {
        const data = {
            ...this.stats,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sbpack_stats_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Statystyki zostały wyeksportowane', 'success');
    }

    // Import statystyk z pliku
    importStats(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedStats = JSON.parse(e.target.result);
                this.stats = { ...this.stats, ...importedStats };
                this.saveStats();
                this.updateAllStats();
                showNotification('Statystyki zostały zaimportowane', 'success');
            } catch (error) {
                showNotification('Błąd podczas importu statystyk', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Reset statystyk
    resetStats() {
        if (confirm('Czy na pewno chcesz zresetować wszystkie statystyki?')) {
            this.stats = this.getDefaultStats();
            this.saveStats();
            this.updateAllStats();
            showNotification('Statystyki zostały zresetowane', 'success');
        }
    }

    // Pobieranie podsumowania statystyk
    getStatsSummary() {
        return {
            totalDownloads: this.formatNumber(this.stats.totalDownloads),
            totalUsers: this.formatNumber(this.stats.totalUsers),
            totalPurchases: this.stats.totalPurchases,
            totalRevenue: this.stats.totalRevenue.toFixed(2) + ' PLN',
            averageRating: this.stats.averageRating + '/5',
            activeMods: this.stats.activeMods,
            lastUpdate: new Date(this.stats.lastUpdate).toLocaleString('pl-PL')
        };
    }

    // Dodanie nowego moda do statystyk
    addModToStats(modId, initialData = {}) {
        this.stats.modStats[modId] = {
            downloads: 0,
            purchases: 0,
            revenue: 0,
            rating: 0,
            ...initialData
        };
        
        if (initialData.isPremium === false) {
            this.stats.freeMods += 1;
        } else {
            this.stats.premiumMods += 1;
        }
        
        this.stats.activeMods += 1;
        this.saveStats();
        this.updateAllStats();
    }

    // Usunięcie moda ze statystyk
    removeModFromStats(modId) {
        if (this.stats.modStats[modId]) {
            delete this.stats.modStats[modId];
            this.stats.activeMods -= 1;
            this.saveStats();
            this.updateAllStats();
        }
    }
}

// Globalna instancja menedżera statystyk
window.statisticsManager = new StatisticsManager();
