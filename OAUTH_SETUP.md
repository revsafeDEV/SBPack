# 🔐 Konfiguracja Prawdziwego OAuth - Instrukcja Krok po Krok

## ⚡ GitHub OAuth (Najłatwiejszy do skonfigurowania)

### Krok 1: Utwórz GitHub OAuth App

1. **Otwórz link:** https://github.com/settings/applications/new
2. **Wypełnij formularz:**
   ```
   Application name: SBMods
   Homepage URL: http://localhost:8000
   Application description: SBMods - Platforma modów FiveM
   Authorization callback URL: http://localhost:8000/oauth-callback.html
   ```
3. **Kliknij:** "Register application"
4. **Skopiuj Client ID** (będzie wyglądać jak: `Ov23liOe5Z8w4TCyHs8y`)

### Krok 2: Skonfiguruj w kodzie

1. **Otwórz plik:** `assets/js/config.js`
2. **Znajdź sekcję GitHub:**
   ```javascript
   github: {
       clientId: 'YOUR_GITHUB_CLIENT_ID',
       enabled: false
   }
   ```
3. **Zastąp swoim Client ID:**
   ```javascript
   github: {
       clientId: 'TWÓJ_SKOPIOWANY_CLIENT_ID',
       enabled: true // ⚠️ WAŻNE: Zmień na true
   }
   ```

### Krok 3: Testowanie

1. **Uruchom serwer lokalny:**
   ```bash
   # W folderze SBPack:
   python -m http.server 8000
   # Lub użyj Live Server w VS Code
   ```

2. **Otwórz stronę:** http://localhost:8000
3. **Kliknij:** "Logowanie"
4. **Wybierz:** "Kontynuuj z GitHub"
5. **Powinieneś zostać przekierowany do GitHub** dla autoryzacji

---

## 🔥 Google OAuth (Średni poziom trudności)

### Krok 1: Google Cloud Console

1. **Otwórz:** https://console.cloud.google.com/
2. **Utwórz nowy projekt** lub wybierz istniejący
3. **Włącz Google+ API** (lub Google Identity API)

### Krok 2: Utwórz OAuth 2.0 Client ID

1. **Idź do:** APIs & Services > Credentials
2. **Kliknij:** "Create Credentials" > "OAuth 2.0 Client ID"
3. **Wybierz:** "Web application"
4. **Skonfiguruj:**
   ```
   Name: SBMods
   Authorized JavaScript origins: http://localhost:8000
   Authorized redirect URIs: http://localhost:8000/oauth-callback.html
   ```
5. **Skopiuj Client ID**

### Krok 3: Konfiguracja

```javascript
google: {
    clientId: 'TWÓJ_GOOGLE_CLIENT_ID.googleusercontent.com',
    enabled: true
}
```

---

## 💬 Discord OAuth (Zaawansowany)

### Krok 1: Discord Developer Portal

1. **Otwórz:** https://discord.com/developers/applications
2. **Kliknij:** "New Application"
3. **Nazwa:** SBMods

### Krok 2: OAuth2 Settings

1. **Przejdź do:** OAuth2 > General
2. **Dodaj Redirect URI:** `http://localhost:8000/oauth-callback.html`
3. **Skopiuj Client ID**

### Krok 3: Konfiguracja

```javascript
discord: {
    clientId: 'TWÓJ_DISCORD_CLIENT_ID',
    enabled: true
}
```

---

## 🧪 Jak przetestować czy działa?

### ✅ Sprawdzenie konfiguracji

1. **Otwórz DevTools (F12)**
2. **Console powinno pokazać:**
   ```
   OAuth Status:
   Skonfigurowane: ['github'] (lub inne)
   Nie skonfigurowane: ['google', 'discord']
   ```

### ✅ Test autoryzacji

1. **Kliknij przycisk OAuth**
2. **Sprawdź czy:**
   - Otwiera się popup GitHub/Google/Discord
   - Nie ma błędów w konsoli
   - Po autoryzacji wraca do strony
   - Pokazuje powiadomienie o sukcesie

### ❌ Rozwiązywanie problemów

**Błąd: "Provider nie jest skonfigurowany"**
- Sprawdź czy `enabled: true`
- Sprawdź czy Client ID nie zawiera "YOUR_"

**Błąd: "Popup zablokowane"**
- Odblokuj popupy w przeglądarce
- Użyj HTTPS w produkcji

**Błąd: "Invalid redirect URI"**
- Sprawdź czy URL w OAuth App = redirect URI w kodzie
- Upewnij się że używasz `http://localhost:8000`

---

## 🚀 Quick Start (GitHub)

**Najszybszy sposób na test:**

1. **GitHub OAuth App:** https://github.com/settings/applications/new
2. **Callback URL:** `http://localhost:8000/oauth-callback.html`
3. **W config.js:**
   ```javascript
   github: {
       clientId: 'TWÓJ_CLIENT_ID',
       enabled: true
   }
   ```
4. **Uruchom:** `python -m http.server 8000`
5. **Test:** http://localhost:8000

**Gotowe! OAuth będzie działać naprawdę! 🎉**