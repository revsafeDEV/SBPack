// ==============================================
// TWOJA KONFIGURACJA OAUTH - SKOPIUJ I UŻYJ
// ==============================================

// INSTRUKCJA:
// 1. Utwórz GitHub OAuth App: https://github.com/settings/applications/new
// 2. Skopiuj Client ID
// 3. Zastąp 'TWÓJ_CLIENT_ID' poniżej
// 4. Skopiuj tę konfigurację do assets/js/config.js

const OAuthConfig = {
    google: {
        clientId: 'TWÓJ_GOOGLE_CLIENT_ID', // Opcjonalnie - skonfiguruj w Google Cloud Console
        redirectUri: window.location.origin + '/oauth-callback.html',
        scope: 'openid profile email',
        responseType: 'code',
        enabled: false // Zmień na true po skonfigurowaniu
    },
    
    github: {
        clientId: 'TWÓJ_GITHUB_CLIENT_ID', // ⚠️ ZASTĄP TYM Z GITHUB OAUTH APP!
        redirectUri: window.location.origin + '/oauth-callback.html',
        scope: 'user:email',
        enabled: false // ⚠️ ZMIEŃ NA TRUE ABY WŁĄCZYĆ!
    },
    
    discord: {
        clientId: 'TWÓJ_DISCORD_CLIENT_ID', // Opcjonalnie - skonfiguruj w Discord Developer Portal
        redirectUri: window.location.origin + '/oauth-callback.html', 
        scope: 'identify email',
        responseType: 'code',
        enabled: false // Zmień na true po skonfigurowaniu
    }
};

// PRZYKŁAD DLA GITHUB (gdy już masz Client ID):
/*
const OAuthConfig = {
    github: {
        clientId: 'Ov23liOe5Z8w4TCyHs8y', // Twój prawdziwy Client ID
        redirectUri: window.location.origin + '/oauth-callback.html',
        scope: 'user:email',
        enabled: true // WŁĄCZONE!
    },
    // ... reszta konfiguracji
};
*/

// KROK PO KROKU:
console.log('🔧 KONFIGURACJA OAUTH:');
console.log('1. Utwórz GitHub OAuth App: https://github.com/settings/applications/new');
console.log('2. Homepage URL: http://localhost:8000');
console.log('3. Callback URL: http://localhost:8000/oauth-callback.html');
console.log('4. Skopiuj Client ID do config.js');
console.log('5. Ustaw enabled: true');
console.log('6. Uruchom: python -m http.server 8000');
console.log('7. Otwórz: http://localhost:8000');