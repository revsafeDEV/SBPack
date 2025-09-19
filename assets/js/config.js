// ==============================================
// KONFIGURACJA OAUTH PROVIDERS
// ==============================================

// INSTRUKCJA KONFIGURACJI:
// 
// 1. GOOGLE OAUTH:
//    - Idź na https://console.developers.google.com/
//    - Utwórz nowy projekt lub wybierz istniejący
//    - Włącz Google+ API
//    - Utwórz credentials (OAuth 2.0 client ID)
//    - Dodaj swoją domenę do autoryzowanych origins
//    - Skopiuj Client ID poniżej
//
// 2. GITHUB OAUTH:
//    - Idź na GitHub Settings > Developer settings > OAuth Apps
//    - Utwórz nową OAuth App
//    - Ustaw Authorization callback URL na twój domenę
//    - Skopiuj Client ID poniżej
//
// 3. DISCORD OAUTH:
//    - Idź na https://discord.com/developers/applications
//    - Utwórz nową aplikację
//    - Przejdź do sekcji OAuth2
//    - Dodaj redirect URI
//    - Skopiuj Client ID poniżej

const OAuthConfig = {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Zastąp swoim Google Client ID
        redirectUri: window.location.origin + '/oauth/callback/google',
        scope: 'openid profile email',
        responseType: 'code',
        enabled: false // Ustaw na true po skonfigurowaniu
    },
    
    github: {
        clientId: 'YOUR_GITHUB_CLIENT_ID', // Zastąp swoim GitHub Client ID  
        redirectUri: window.location.origin + '/oauth/callback/github',
        scope: 'user:email',
        enabled: false // Ustaw na true po skonfigurowaniu
    },
    
    discord: {
        clientId: 'YOUR_DISCORD_CLIENT_ID', // Zastąp swoim Discord Client ID
        redirectUri: window.location.origin + '/oauth/callback/discord', 
        scope: 'identify email',
        responseType: 'code',
        enabled: false // Ustaw na true po skonfigurowaniu
    }
};

// Backend endpoints dla OAuth (możesz dostosować do swojej architektury)
const OAuthEndpoints = {
    google: {
        authUrl: 'https://accounts.google.com/oauth/authorize',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
    },
    
    github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user'
    },
    
    discord: {
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        userInfoUrl: 'https://discord.com/api/v10/users/@me'
    }
};

// Funkcje pomocnicze dla OAuth
const OAuthHelpers = {
    // Generowanie state parameter dla bezpieczeństwa
    generateState: () => {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0].toString(36);
    },
    
    // Zapisywanie state w sessionStorage
    saveState: (provider, state) => {
        sessionStorage.setItem(`oauth_state_${provider}`, state);
    },
    
    // Weryfikacja state
    verifyState: (provider, receivedState) => {
        const savedState = sessionStorage.getItem(`oauth_state_${provider}`);
        sessionStorage.removeItem(`oauth_state_${provider}`);
        return savedState === receivedState;
    },
    
    // Budowanie URL autoryzacji
    buildAuthUrl: (provider) => {
        const config = OAuthConfig[provider];
        const endpoints = OAuthEndpoints[provider];
        
        if (!config || !config.enabled) {
            throw new Error(`Provider ${provider} nie jest skonfigurowany lub wyłączony`);
        }
        
        const state = OAuthHelpers.generateState();
        OAuthHelpers.saveState(provider, state);
        
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            scope: config.scope,
            state: state
        });
        
        if (config.responseType) {
            params.append('response_type', config.responseType);
        }
        
        return `${endpoints.authUrl}?${params.toString()}`;
    }
};

// Eksport konfiguracji
window.OAuthConfig = OAuthConfig;
window.OAuthEndpoints = OAuthEndpoints;  
window.OAuthHelpers = OAuthHelpers;

// Sprawdzenie czy wszystkie providery są skonfigurowane
const checkOAuthSetup = () => {
    const providers = ['google', 'github', 'discord'];
    const configured = [];
    const notConfigured = [];
    
    providers.forEach(provider => {
        const config = OAuthConfig[provider];
        if (config.enabled && !config.clientId.includes('YOUR_')) {
            configured.push(provider);
        } else {
            notConfigured.push(provider);
        }
    });
    
    console.log('OAuth Status:');
    console.log('Skonfigurowane:', configured);
    console.log('Nie skonfigurowane:', notConfigured);
    
    if (notConfigured.length > 0) {
        console.warn('Aby włączyć OAuth, skonfiguruj providery w config.js');
    }
    
    return { configured, notConfigured };
};

// Sprawdź setup przy załadowaniu
document.addEventListener('DOMContentLoaded', checkOAuthSetup);