// ==============================================
// REGULAMIN I WARUNKI UŻYTKOWANIA SBMODS
// ==============================================

class TermsManager {
    constructor() {
        this.termsVersion = '1.0';
        this.lastUpdated = '2025-01-19';
    }

    // Treść regulaminu
    getTermsContent() {
        return `
            <div class="terms-content">
                <div class="terms-header">
                    <h2>🛡️ Regulamin i Warunki Użytkowania</h2>
                    <p class="terms-subtitle">Platforma SBMods - Wersja ${this.termsVersion}</p>
                    <p class="last-updated">Ostatnia aktualizacja: ${this.lastUpdated}</p>
                </div>

                <div class="terms-sections">
                    <div class="terms-section">
                        <h3>📋 1. Postanowienia ogólne</h3>
                        <p>Korzystając z platformy SBMods, akceptujesz niniejszy regulamin w całości. Platforma SBMods to społecznościowa platforma modów dla FiveM, która umożliwia użytkownikom przeglądanie, kupowanie i publikowanie modyfikacji.</p>
                    </div>

                    <div class="terms-section">
                        <h3>💰 2. Zakupy i płatności</h3>
                        <ul>
                            <li><strong>Płatności:</strong> Wszystkie płatności są przetwarzane przez PayPal</li>
                            <li><strong>Ceny:</strong> Ceny są podane w PLN i zawierają wszystkie opłaty</li>
                            <li><strong>Potwierdzenie zakupu:</strong> Po opłaceniu otrzymasz dostęp do pobrania moda</li>
                        </ul>
                    </div>

                    <div class="terms-section important">
                        <h3>⚠️ 3. WAŻNE: Odpowiedzialność za mody użytkowników</h3>
                        <div class="warning-box">
                            <p><strong>UWAGA:</strong> Za mody publikowane przez społeczność (oznaczone jako "Community") <strong>NIE PONOSIMY ODPOWIEDZIALNOŚCI</strong>.</p>
                            <ul>
                                <li>Mody społecznościowe są tworzone przez niezależnych twórców</li>
                                <li>Nie gwarantujemy ich jakości, bezpieczeństwa ani funkcjonalności</li>
                                <li>Użytkownik instaluje je na własną odpowiedzialność</li>
                                <li>Odpowiedzialność za treść ponosi wyłącznie autor moda</li>
                            </ul>
                        </div>
                    </div>

                    <div class="terms-section">
                        <h3>🔄 4. Polityka zwrotów</h3>
                        <div class="refund-policy">
                            <p><strong>Zwroty są możliwe w następujących przypadkach:</strong></p>
                            <ul>
                                <li>Zgłoszenie w ciągu <strong>7 dni</strong> od zakupu</li>
                                <li>Z <strong>potwierdzeniem problemu technicznego</strong></li>
                                <li>Mod nie działa zgodnie z opisem</li>
                                <li>Mod zawiera złośliwy kod</li>
                            </ul>
                            <p><strong>Zwroty NIE są możliwe gdy:</strong></p>
                            <ul>
                                <li>Mod działa zgodnie z opisem</li>
                                <li>Problem wynika z nieprawidłowej instalacji</li>
                                <li>Zmiana zdania użytkownika</li>
                                <li>Niezgodność z innymi modami</li>
                            </ul>
                        </div>
                    </div>

                    <div class="terms-section">
                        <h3>🎯 5. Mody oficjalne SBPack</h3>
                        <p>Mody oznaczone jako "SBPack Official" są przez nas tworzone, testowane i wspierane. Dla tych modów zapewniamy:</p>
                        <ul>
                            <li>Pełne wsparcie techniczne</li>
                            <li>Regularne aktualizacje</li>
                            <li>Gwarancję jakości</li>
                            <li>Szybką reakcję na problemy</li>
                        </ul>
                    </div>

                    <div class="terms-section">
                        <h3>📤 6. Publikowanie modów przez użytkowników</h3>
                        <ul>
                            <li>Możesz publikować własne mody po zalogowaniu</li>
                            <li>Wszystkie mody przechodzą moderację przed publikacją</li>
                            <li>Nie możesz publikować nielegalnych lub szkodliwych treści</li>
                            <li>Zachowujesz prawa autorskie do swoich modów</li>
                            <li>Jesteś odpowiedzialny za treść i wsparcie swoich modów</li>
                        </ul>
                    </div>

                    <div class="terms-section">
                        <h3>🔒 7. Prywatność i dane osobowe</h3>
                        <ul>
                            <li>Zbieramy minimum danych niezbędnych do działania serwisu</li>
                            <li>Nie udostępniamy danych osobowych trzecim stronom</li>
                            <li>Możesz w każdej chwili usunąć swoje konto</li>
                            <li>Dane są przechowywane lokalnie w przeglądarce</li>
                        </ul>
                    </div>

                    <div class="terms-section">
                        <h3>⚖️ 8. Kontakt i rozwiązywanie sporów</h3>
                        <p>W przypadku problemów lub pytań:</p>
                        <ul>
                            <li>Email: support@sbmods.pl</li>
                            <li>Discord: sebablyqt</li>
                            <li>GitHub: revsafeDEV/SBPack</li>
                        </ul>
                    </div>

                    <div class="terms-section">
                        <h3>📜 9. Zmiany regulaminu</h3>
                        <p>Zastrzegamy sobie prawo do zmiany regulaminu. O istotnych zmianach powiadomimy użytkowników na platformie.</p>
                    </div>
                </div>

                <div class="terms-footer">
                    <p><strong>Korzystając z platformy SBMods akceptujesz powyższe warunki.</strong></p>
                    <p class="small-text">Ostatnia aktualizacja: ${this.lastUpdated} | Wersja: ${this.termsVersion}</p>
                </div>
            </div>
        `;
    }

    // Pokazanie modala z regulaminem
    showTermsModal() {
        const existingModal = document.getElementById('termsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'termsModal';
        modal.className = 'terms-modal';
        modal.innerHTML = `
            <div class="terms-modal-content">
                <div class="terms-modal-header">
                    <button class="terms-close" onclick="termsManager.closeTermsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="terms-modal-body">
                    ${this.getTermsContent()}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Zamknięcie modala
    closeTermsModal() {
        const modal = document.getElementById('termsModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }

    // Sprawdzenie czy użytkownik zaakceptował regulamin
    hasAcceptedTerms() {
        const accepted = localStorage.getItem('sbmods_terms_accepted');
        const acceptedVersion = localStorage.getItem('sbmods_terms_version');
        return accepted === 'true' && acceptedVersion === this.termsVersion;
    }

    // Akceptacja regulaminu
    acceptTerms() {
        localStorage.setItem('sbmods_terms_accepted', 'true');
        localStorage.setItem('sbmods_terms_version', this.termsVersion);
        localStorage.setItem('sbmods_terms_date', new Date().toISOString());
    }

    // Odrzucenie regulaminu
    rejectTerms() {
        localStorage.removeItem('sbmods_terms_accepted');
        localStorage.removeItem('sbmods_terms_version');
        localStorage.removeItem('sbmods_terms_date');
    }

    // Modal akceptacji regulaminu przy rejestracji
    showAcceptanceModal() {
        return new Promise((resolve) => {
            const existingModal = document.getElementById('termsAcceptanceModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.id = 'termsAcceptanceModal';
            modal.className = 'terms-modal acceptance-modal';
            modal.innerHTML = `
                <div class="terms-modal-content acceptance-content">
                    <div class="acceptance-header">
                        <h2>📋 Akceptacja Regulaminu</h2>
                        <p>Aby założyć konto na platformie SBMods, musisz zaakceptować nasz regulamin.</p>
                    </div>
                    
                    <div class="terms-preview">
                        ${this.getTermsContent()}
                    </div>
                    
                    <div class="acceptance-footer">
                        <div class="acceptance-checkbox">
                            <label class="checkbox-container">
                                <input type="checkbox" id="acceptTermsCheckbox" required>
                                <span class="checkbox-checkmark"></span>
                                Przeczytałem i akceptuję 
                                <a href="#" onclick="termsManager.showTermsModal(); event.preventDefault();">Regulamin i Warunki Użytkowania</a>
                            </label>
                        </div>
                        
                        <div class="acceptance-buttons">
                            <button class="btn-reject" onclick="termsManager.handleTermsRejection(${resolve})">
                                <i class="fas fa-times"></i>
                                Odrzuć
                            </button>
                            <button class="btn-accept" id="acceptTermsBtn" disabled onclick="termsManager.handleTermsAcceptance(${resolve})">
                                <i class="fas fa-check"></i>
                                Akceptuję i rejestruję się
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Obsługa checkboxa
            const checkbox = document.getElementById('acceptTermsCheckbox');
            const acceptBtn = document.getElementById('acceptTermsBtn');
            
            checkbox.addEventListener('change', () => {
                acceptBtn.disabled = !checkbox.checked;
                acceptBtn.classList.toggle('enabled', checkbox.checked);
            });

            // Przechowanie resolve dla przycisków
            window.termsResolve = resolve;
        });
    }

    // Obsługa akceptacji
    handleTermsAcceptance(resolve) {
        const checkbox = document.getElementById('acceptTermsCheckbox');
        if (checkbox && checkbox.checked) {
            this.acceptTerms();
            this.closeAcceptanceModal();
            if (window.termsResolve) {
                window.termsResolve(true);
            }
        } else {
            showNotification('Musisz zaakceptować regulamin aby się zarejestrować', 'error');
        }
    }

    // Obsługa odrzucenia
    handleTermsRejection(resolve) {
        this.rejectTerms();
        this.closeAcceptanceModal();
        if (window.termsResolve) {
            window.termsResolve(false);
        }
    }

    // Zamknięcie modala akceptacji
    closeAcceptanceModal() {
        const modal = document.getElementById('termsAcceptanceModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }
}

// Globalna instancja menedżera regulaminu
window.termsManager = new TermsManager();

// Funkcje pomocnicze
window.showTermsModal = () => termsManager.showTermsModal();
