# 🎮 SBPack - Nowoczesna Platforma Modów FiveM

**SBPack** to profesjonalna platforma do dystrybucji modów, skryptów i zasobów dla serwerów FiveM. Stworzona przez **revsafeDEV** z myślą o nowoczesnym designie i najlepszym doświadczeniu użytkownika.

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

### 🛠️ **Panel Administracyjny**
- Zarządzanie modami (dodawanie, edycja, usuwanie)
- System uprawnień administratorów
- Zarządzanie zgłoszeniami support
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
SBPack/
├── assets/
│   ├── css/
│   │   ├── styles.css          # Główne style aplikacji
│   │   └── styles-new.css      # Dodatkowe style
│   └── js/
│       └── script.js           # Logika aplikacji
├── pages/
│   ├── contact.html            # Strona kontaktu
│   ├── mods.html              # Galeria modów
│   ├── success.html           # Strona sukcesu płatności
│   └── support-chat.html      # Live support
├── index.html                 # Strona główna
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

1. **Klonuj repozytorium**
   ```bash
   git clone https://github.com/USERNAME/SBPack.git
   cd SBPack
   ```

2. **Uruchom lokalnie**
   - Otwórz `index.html` w przeglądarce
   - Lub użyj lokalnego serwera (np. Live Server w VS Code)

3. **Konfiguracja PayPal**
   - Edytuj `assets/js/script.js`
   - Zmień `paypalEmail` na swój adres PayPal Business

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
