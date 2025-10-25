const passwordInput = document.getElementById('passwordInput');
let showPassword = false;

function togglePassword() {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
}

passwordInput.addEventListener('input', analyzePassword);

function analyzePassword() {
    const password = passwordInput.value;
    const length = password.length;

    const hasLength = length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    updateRequirement('req1', hasLength);
    updateRequirement('req2', hasUpper);
    updateRequirement('req3', hasLower);
    updateRequirement('req4', hasNumber);
    updateRequirement('req5', hasSpecial);

    let score = 0;
    if (length > 0) score += Math.min(length * 4, 40);
    if (hasUpper) score += 15;
    if (hasLower) score += 15;
    if (hasNumber) score += 15;
    if (hasSpecial) score += 15;

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumber) charsetSize += 10;
    if (hasSpecial) charsetSize += 32;

    const entropy = length > 0 ? Math.floor(length * Math.log2(charsetSize)) : 0;

    document.getElementById('lengthStat').textContent = length;
    document.getElementById('typesStat').textContent = 
        `${[hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length}/4`;
    document.getElementById('entropyStat').textContent = entropy;
    document.getElementById('scoreStat').textContent = `${score}/100`;

    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    strengthBar.style.width = `${score}%`;
    
    if (score === 0) {
        strengthBar.className = 'strength-bar';
        strengthText.textContent = '';
        strengthText.className = 'strength-text';
    } else if (score < 40) {
        strengthBar.className = 'strength-bar weak';
        strengthText.textContent = '[ CRITICAL ]';
        strengthText.className = 'strength-text weak';
    } else if (score < 60) {
        strengthBar.className = 'strength-bar fair';
        strengthText.textContent = '[ WARNING ]';
        strengthText.className = 'strength-text fair';
    } else if (score < 80) {
        strengthBar.className = 'strength-bar good';
        strengthText.textContent = '[ ACCEPTABLE ]';
        strengthText.className = 'strength-text good';
    } else {
        strengthBar.className = 'strength-bar strong';
        strengthText.textContent = '[ SECURED ]';
        strengthText.className = 'strength-text strong';
    }

    if (length > 0) {
        const crackTime = calculateCrackTime(entropy);
        document.getElementById('crackTime').style.display = 'block';
        document.getElementById('crackTimeText').textContent = crackTime;
    } else {
        document.getElementById('crackTime').style.display = 'none';
    }
}

function updateRequirement(id, met) {
    const element = document.getElementById(id);
    if (met) {
        element.classList.add('met');
    } else {
        element.classList.remove('met');
    }
}

function calculateCrackTime(entropy) {
    const guessesPerSecond = 1e9;
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / guessesPerSecond / 2;

    if (seconds < 1) return 'INSTANT';
    if (seconds < 60) return `${Math.round(seconds)} SECONDS`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} MINUTES`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} HOURS`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} DAYS`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} MONTHS`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} YEARS`;
    return 'CENTURIES';
}