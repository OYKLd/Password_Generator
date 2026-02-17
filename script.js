class PasswordGenerator {
    constructor() {
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.lowercaseCheckbox = document.getElementById('lowercase');
        this.numbersCheckbox = document.getElementById('numbers');
        this.symbolsCheckbox = document.getElementById('symbols');
        
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.init();
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        
        // Generate initial password
        this.generatePassword();
    }
    
    updateLengthDisplay() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }
    
    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const options = {
            uppercase: this.uppercaseCheckbox.checked,
            lowercase: this.lowercaseCheckbox.checked,
            numbers: this.numbersCheckbox.checked,
            symbols: this.symbolsCheckbox.checked
        };
        
        // Validate at least one option is selected
        if (!Object.values(options).some(option => option)) {
            this.showMessage('Veuillez sélectionner au moins une option');
            return;
        }
        
        let charset = '';
        let guaranteedChars = [];
        
        // Build charset and guarantee at least one character from each selected type
        if (options.uppercase) {
            charset += this.charSets.uppercase;
            guaranteedChars.push(this.getRandomChar(this.charSets.uppercase));
        }
        if (options.lowercase) {
            charset += this.charSets.lowercase;
            guaranteedChars.push(this.getRandomChar(this.charSets.lowercase));
        }
        if (options.numbers) {
            charset += this.charSets.numbers;
            guaranteedChars.push(this.getRandomChar(this.charSets.numbers));
        }
        if (options.symbols) {
            charset += this.charSets.symbols;
            guaranteedChars.push(this.getRandomChar(this.charSets.symbols));
        }
        
        // Generate password
        let password = '';
        
        // Add guaranteed characters first
        password += guaranteedChars.join('');
        
        // Fill remaining length with random characters from the combined charset
        for (let i = guaranteedChars.length; i < length; i++) {
            password += this.getRandomChar(charset);
        }
        
        // Shuffle the password to avoid predictable patterns
        password = this.shuffleString(password);
        
        // Display the password
        this.passwordOutput.value = password;
        
        // Update strength indicator
        this.updateStrengthIndicator(password, options);
    }
    
    getRandomChar(charset) {
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
    
    updateStrengthIndicator(password, options) {
        let strength = 0;
        let strengthLabel = '';
        let strengthClass = '';
        
        // Calculate strength based on various factors
        const length = password.length;
        const optionsCount = Object.values(options).filter(option => option).length;
        
        // Length contribution
        if (length >= 8) strength += 20;
        if (length >= 12) strength += 20;
        if (length >= 16) strength += 20;
        
        // Character variety contribution
        strength += optionsCount * 15;
        
        // Determine strength level
        if (strength < 40) {
            strengthLabel = 'Faible';
            strengthClass = 'weak';
        } else if (strength < 60) {
            strengthLabel = 'Moyen';
            strengthClass = 'fair';
        } else if (strength < 80) {
            strengthLabel = 'Bon';
            strengthClass = 'good';
        } else {
            strengthLabel = 'Fort';
            strengthClass = 'strong';
        }
        
        // Update UI
        this.strengthBar.className = `strength-fill ${strengthClass}`;
        this.strengthText.textContent = `Force: ${strengthLabel}`;
    }
    
    async copyPassword() {
        const password = this.passwordOutput.value;
        
        if (!password) {
            this.showMessage('Aucun mot de passe à copier');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(password);
            this.showCopyFeedback();
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(password);
            this.showCopyFeedback();
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    showCopyFeedback() {
        const originalHTML = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        this.copyBtn.classList.add('copied');
        
        setTimeout(() => {
            this.copyBtn.innerHTML = originalHTML;
            this.copyBtn.classList.remove('copied');
        }, 2000);
    }
    
    showMessage(message) {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2d3748;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});