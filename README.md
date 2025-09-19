# 🎮 SBMods - Otwarta Platforma Modów FiveM

**SBMods** to nowoczesna, społecznościowa platforma do dystrybucji modów, skryptów i zasobów dla serwerów FiveM. Stworzona przez **revsafeDEV** z myślą o otwartości, bezpieczeństwie i najlepszym doświadczeniu użytkownika.

🚀 **NOWE FUNKCJE**: Integracja OAuth (Google, GitHub, Discord), zaawansowany system powiadomień, ulepszona autoryzacja!

![SBPack Preview](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=SBPack+FiveM+Mods)

## ✨ Funkcjonalności

### 🏪 **Sklep z Modami**
- Przejrzysta galeria modów z kategoriami
- Zaawansowane filtrowanie i wyszukiwanie
- Integracja z PayPal dla bezpiecznych płatności
- Podgląd modów z detalami i instrukcjami

### 💳 **System Płatności**
- Bezpieczne płatności przez PayPal
- Automatyczne generowanie linków płatności
- Wsparcie dla różnych walut (PLN domyślnie)
- Natychmiastowy dostęp po opłaceniu

### 🔐 **System Autoryzacji OAuth**
- Logowanie przez Google, GitHub, Discord
- Bezpieczna autoryzacja bez haseł
- Automatyczne tworzenie profili użytkowników
- Fallback do symulacji dla testów

### 🛠️ **Panel Administracyjny**
- Zarządzanie modami (dodawanie, edycja, usuwanie)
- System uprawnień administratorów
- Zarządzanie zgłoszeniami support
- Moderacja modów społeczności
- Statystyki i analityka

### 📱 **Responsywny Design**
- Nowoczesny, ciemny motyw
- Pełna responsywność na wszystkich urządzeniach
- Animacje i efekty glassmorphism
- Intuicyjna nawigacja

### 💬 **System Wsparcia**
- Live chat support
- Formularz kontaktowy
- FAQ i dokumentacja
- Integracja z Discord

## 🚀 Technologie

- **Frontend**: HTML5, CSS3 (Custom Variables), Vanilla JavaScript
- **Design System**: Modern CSS Grid, Flexbox, CSS Custom Properties
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter, JetBrains Mono
- **Płatności**: PayPal Integration
- **Storage**: Local Storage (dla demo modów)

## 📁 Struktura Projektu

```
SBMods/
├── assets/
│   ├── css/
│   │   └── styles.css          # Główne style + OAuth modals
│   └── js/
│       ├── config.js            # Konfiguracja OAuth
│       ├── script.js            # Główna logika
│       └── modules/            # Moduły JavaScript
│           ├── auth.js         # System autoryzacji OAuth
│           ├── notifications.js # System powiadomień
│           ├── cart.js         # Koszyk
│           ├── user-mods.js    # Mody użytkowników
│           └── ...             # Inne moduły
├── pages/
│   ├── contact.html            # Strona kontaktu
│   ├── mods.html              # Galeria modów
│   ├── success.html           # Strona sukcesu płatności
│   └── support-chat.html      # Live support
├── database/                  # Dane lokalne
│   ├── mods_stats.json        # Statystyki
│   └── users.json             # Użytkownicy
├── index.html                 # Strona główna
├── oauth-callback.html        # OAuth callback
└── README.md                  # Dokumentacja
```

## 🎨 Design System

### Paleta Kolorów
- **Primary**: Linear gradient `#667eea` → `#764ba2`
- **Secondary**: Linear gradient `#f093fb` → `#f5576c`
- **Accent**: Linear gradient `#4facfe` → `#00f2fe`
- **Background**: Dark theme z glassmorphism

### Typografia
- **Headings**: Inter (300-900)
- **Body**: Inter (400-600)
- **Code**: JetBrains Mono

## ⚙️ Instalacja

### 🚀 Szybki Start

```bash
# Klonuj repozytorium
git clone https://github.com/revsafeDEV/SBPack.git
cd SBPack

# Uruchom lokalnie (wybierz jedną opcję):
# 1. Live Server w VS Code (zalecane)
# 2. Python: python -m http.server 8000
# 3. Node.js: npx serve .
# 4. Dowolny serwer HTTP
```

### 🔐 Konfiguracja OAuth (opcjonalnie)

**Aplikacja działa od razu bez OAuth** - używa symulacji do testów.

Aby włączyć prawdziwe OAuth:

#### 1. Google OAuth
```bash
# 1. Idź na https://console.cloud.google.com/
# 2. Utwórz projekt i włącz Google+ API
# 3. Utwórz OAuth 2.0 client ID
# 4. Dodaj redirect: http://localhost:8000/oauth-callback.html
```

W `assets/js/config.js`:
```javascript
google: {
    clientId: 'TWÓJ_GOOGLE_CLIENT_ID',
    enabled: true // Zmień na true
}
```

#### 2. GitHub OAuth
```bash
# 1. GitHub Settings > Developer settings > OAuth Apps
# 2. New OAuth App
# 3. Callback URL: http://localhost:8000/oauth-callback.html
```

#### 3. Discord OAuth
```bash
# 1. https://discord.com/developers/applications
# 2. New Application > OAuth2
# 3. Redirect URI: http://localhost:8000/oauth-callback.html
```

## 🔧 Konfiguracja

### PayPal Integration
W pliku `script.js` znajdź funkcję `generatePayPalLink()` i skonfiguruj:

```javascript
generatePayPalLink(mod) {
    const paypalEmail = 'your-paypal@business.com'; // Twój PayPal Business
    const currency = 'PLN'; // Waluta
    // ... reszta konfiguracji
}
```

### Panel Administratora
Domyślne hasło administratora: `SBPack2025!`
Zmień je w `script.js`:

```javascript
const ADMIN_PASSWORD = 'YourNewPassword';
```

## 🎯 Funkcjonalności Demo

### Przykładowe Mody
Aplikacja zawiera demo mody:
- ESX Advanced Jobs (29.99 PLN)
- Super Cars Pack (49.99 PLN)
- Police Station MLO (79.99 PLN)
- Free Car Spawner (Darmowy)

### Admin Panel
- Dostęp: Podwójny klik na logo lub przycisk w prawym dolnym rogu
- Funkcje: Dodawanie modów, zarządzanie, statystyki

## 📱 Responsywność

Strona jest w pełni responsywna z breakpointami:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1024px
- **Mobile**: <768px

## 🛡️ Bezpieczeństwo

- Bezpieczne płatności przez PayPal
- Walidacja formularzy
- Ochrona przed XSS
- HTTPS ready

## 🤝 Współpraca

1. Fork projektu
2. Stwórz feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📞 Kontakt

- **Email**: osipiuksebastian3@gmail.com
- **Discord**: sebablyqt
- **GitHub**: revsafeDEV

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 🙏 Podziękowania

- Font Awesome za ikony
- Google Fonts za fontanmiki
- Społeczność FiveM za inspirację

---

⭐ **Jeśli podoba Ci się ten projekt, zostaw gwiazdkę!** ⭐
