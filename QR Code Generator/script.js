// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('qr-theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('qr-theme', newTheme);
    showToast('Theme changed to ' + newTheme + ' mode', 'success');
});

// QR Code Generator Elements
const textInput = document.getElementById('textInput');
const qrSection = document.getElementById('qrSection');
const qrImage = document.getElementById('qrImage');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrActions = document.getElementById('qrActions');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

// Settings
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const autoSaveDownload = document.getElementById('autoSaveDownload');
const autoSaveCopy = document.getElementById('autoSaveCopy');

// Toast
const toast = document.getElementById('toast');

let currentQRData = null;
let debounceTimer = null;
let isSavedToHistory = false;

// Load settings
autoSaveDownload.checked = localStorage.getItem('autoSaveDownload') === 'true';
autoSaveCopy.checked = localStorage.getItem('autoSaveCopy') === 'true';

// Save settings
autoSaveDownload.addEventListener('change', (e) => {
    localStorage.setItem('autoSaveDownload', e.target.checked);
    showToast('Settings saved', 'success');
});

autoSaveCopy.addEventListener('change', (e) => {
    localStorage.setItem('autoSaveCopy', e.target.checked);
    showToast('Settings saved', 'success');
});

// Toast notification
function showToast(message, type = '') {
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Generate QR Code using API
async function generateQRCode(text) {
    if (!text || text.trim() === '') {
        qrImage.style.display = 'none';
        qrPlaceholder.style.display = 'block';
        qrActions.style.display = 'none';
        currentQRData = null;
        isSavedToHistory = false;
        updateSaveButton();
        return;
    }

    try {
        const encodedText = encodeURIComponent(text.trim());
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
        
        // Set image source
        qrImage.src = qrUrl;
        qrImage.style.display = 'block';
        qrPlaceholder.style.display = 'none';
        qrActions.style.display = 'flex';
        
        currentQRData = text.trim();
        
        // Check if already in history
        checkIfSaved();
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        showToast('Failed to generate QR code', 'error');
    }
}

// Check if current QR is in history
function checkIfSaved() {
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    isSavedToHistory = history.some(item => item.text === currentQRData);
    updateSaveButton();
}

// Update save button appearance
function updateSaveButton() {
    if (isSavedToHistory) {
        saveBtn.innerHTML = '<span>✓</span> Saved';
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.6';
    } else {
        saveBtn.innerHTML = '<span>💾</span> Save to History';
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
    }
}

// Debounced input handler for real-time updates
textInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const text = textInput.textContent || textInput.innerText;
        generateQRCode(text);
    }, 500);
});

// Handle paste to strip formatting
textInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
});

// Prevent drag and drop
textInput.addEventListener('drop', (e) => {
    e.preventDefault();
});

// Manual save to history
saveBtn.addEventListener('click', () => {
    if (currentQRData && !isSavedToHistory) {
        saveToHistory(currentQRData);
        showToast('QR code saved to history!', 'success');
        isSavedToHistory = true;
        updateSaveButton();
    }
});

// Download QR Code
downloadBtn.addEventListener('click', async () => {
    if (!currentQRData) return;
    
    try {
        const encodedText = encodeURIComponent(currentQRData);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodedText}`;
        
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `qrcode-${Date.now()}.png`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        
        // Auto-save to history if enabled
        if (autoSaveDownload.checked && !isSavedToHistory) {
            saveToHistory(currentQRData);
            isSavedToHistory = true;
            updateSaveButton();
            showToast('Downloaded and saved to history!', 'success');
        } else {
            showToast('QR code downloaded!', 'success');
        }
        
    } catch (error) {
        console.error('Error downloading QR code:', error);
        showToast('Failed to download QR code', 'error');
    }
});

// Copy QR Link
copyLinkBtn.addEventListener('click', async () => {
    if (!currentQRData) return;
    
    const encodedText = encodeURIComponent(currentQRData);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(qrUrl);
        } else {
            // Fallback method for older browsers or non-HTTPS
            const textArea = document.createElement('textarea');
            textArea.value = qrUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (!successful) {
                    throw new Error('Copy command failed');
                }
            } finally {
                document.body.removeChild(textArea);
            }
        }
        
        // Visual feedback
        const originalHTML = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<span>✓</span> Copied!';
        copyLinkBtn.classList.add('success');
        
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalHTML;
            copyLinkBtn.classList.remove('success');
        }, 2000);
        
        // Auto-save to history if enabled
        if (autoSaveCopy.checked && !isSavedToHistory) {
            saveToHistory(currentQRData);
            isSavedToHistory = true;
            updateSaveButton();
            showToast('Link copied and saved to history!', 'success');
        } else {
            showToast('QR code link copied!', 'success');
        }
        
    } catch (err) {
        console.error('Failed to copy:', err);
        
        // Show manual copy option as last resort
        const copyFallback = prompt('Copy failed. Here is the QR code link:', qrUrl);
        if (copyFallback !== null) {
            showToast('Please copy the link manually', 'error');
        } else {
            showToast('Failed to copy link', 'error');
        }
    }
});

// History Management
function saveToHistory(text) {
    let history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    
    // Check if already exists
    const exists = history.some(item => item.text === text);
    if (exists) return;
    
    history.unshift({
        text: text,
        date: new Date().toISOString(),
        id: Date.now()
    });
    
    // Keep only last 50
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('qr-history', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No QR codes saved yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const escapedText = escapeHtml(item.text);
        
        return `
            <div class="history-item" style="animation-delay: ${index * 0.05}s">
                <div class="history-info">
                    <div class="history-text">${escapedText}</div>
                    <div class="history-date">${dateStr}</div>
                </div>
                <div class="history-actions">
                    <button class="icon-btn-small" onclick="regenerateQR(\`${escapedText.replace(/`/g, '\\`')}\`)" title="Regenerate">
                        🔄
                    </button>
                    <button class="icon-btn-small" onclick="deleteHistoryItem(${item.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function regenerateQR(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    const unescapedText = div.textContent;
    
    textInput.textContent = unescapedText;
    historyModal.style.display = 'none';
    generateQRCode(unescapedText);
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('qr-history') || '[]');
    history = history.filter(item => item.id !== id);
    localStorage.setItem('qr-history', JSON.stringify(history));
    loadHistory();
    showToast('Item deleted from history', 'success');
    
    // Update save button if current QR was deleted
    checkIfSaved();
}

// Clear all history
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.setItem('qr-history', '[]');
        loadHistory();
        showToast('History cleared', 'success');
        isSavedToHistory = false;
        updateSaveButton();
    }
});

// Settings Modal
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// History Modal
historyBtn.addEventListener('click', () => {
    loadHistory();
    historyModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Make functions global for onclick handlers
window.regenerateQR = regenerateQR;
window.deleteHistoryItem = deleteHistoryItem;

// Auto-focus input on load
textInput.focus();

// Check if there's any text on load and generate QR
const initialText = textInput.textContent || textInput.innerText;
if (initialText.trim()) {
    generateQRCode(initialText);
}
