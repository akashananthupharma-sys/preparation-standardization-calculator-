// ===== Dark Mode & Theme Management =====
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : '';
    updateThemeIcon();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('themeToggle').querySelector('i');
    const isDark = document.body.classList.contains('dark-mode');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== Help Panel Toggle =====
function toggleHelp() {
    const helpPanel = document.getElementById('helpPanel');
    if (helpPanel) {
        helpPanel.style.display = helpPanel.style.display === 'none' ? 'block' : 'none';
    }
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }

    const helpToggle = document.getElementById('helpToggle');
    if (helpToggle) {
        helpToggle.addEventListener('click', toggleHelp);
    }
});

// ===== Utility Functions =====

function validateInput(value, fieldName) {
    if (value === '' || value === null || isNaN(value)) {
        return { valid: false, message: `Please enter a valid ${fieldName}` };
    }
    if (parseFloat(value) <= 0) {
        return { valid: false, message: `${fieldName} must be greater than 0` };
    }
    return { valid: true };
}

function showResult(elementId, message, isSuccess = true) {
    const resultElement = document.getElementById(elementId);
    resultElement.className = 'result ' + (isSuccess ? 'success' : 'error');
    const copyBtn = isSuccess ? `<button class="copy-btn" onclick="copyToClipboard('${elementId}')"><i class="fas fa-copy"></i> Copy</button>` : '';
    resultElement.innerHTML = message + copyBtn;
}

function copyToClipboard(elementId) {
    const resultElement = document.getElementById(elementId);
    const text = resultElement.innerText.replace('Copy', '').trim();
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.5s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function formatNumber(num, decimals = 4) {
    return parseFloat(num).toFixed(decimals);
}

// ===== Equivalent Weight Setting Functions =====

function setEqWeight(calcNum) {
    const chemical = document.getElementById(`chemical${calcNum}`);
    const eqInput = document.getElementById(`eq${calcNum}`);
    eqInput.value = chemical.value;
}

// ===== Calculator 1: Normality Calculator =====
// Formula: N = (W × 1000) / (Eq.wt × V)

function calcN() {
    const w = parseFloat(document.getElementById('w1').value);
    const eq = parseFloat(document.getElementById('eq1').value);
    const v = parseFloat(document.getElementById('v1').value);

    // Validation
    const validations = [
        validateInput(w, 'Weight'),
        validateInput(eq, 'Equivalent Weight'),
        validateInput(v, 'Volume')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultN', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Normality
    const normality = (w * 1000) / (eq * v);

    showResult('resultN', `
        <strong>✅ Calculation Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Normality (N) = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(normality)}</span> N
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">Formula: (${formatNumber(w)} × 1000) / (${formatNumber(eq)} × ${formatNumber(v)})</small>
    `);
}

// ===== Calculator 2: Required Weight Calculator =====
// Formula: W = (N × Eq.wt × V) / 1000

function calcWeight() {
    const reqN = parseFloat(document.getElementById('reqN').value);
    const eq = parseFloat(document.getElementById('eq2').value);
    const reqV = parseFloat(document.getElementById('reqV').value);

    // Validation
    const validations = [
        validateInput(reqN, 'Required Normality'),
        validateInput(eq, 'Equivalent Weight'),
        validateInput(reqV, 'Volume')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultWeight', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Required Weight
    const weight = (reqN * eq * reqV) / 1000;

    showResult('resultWeight', `
        <strong>✅ Calculation Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Required Weight = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(weight)}</span> g
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">Formula: (${formatNumber(reqN)} × ${formatNumber(eq)} × ${formatNumber(reqV)}) / 1000</small>
    `);
}

// ===== Calculator 3: Strength Calculator =====
// Formula: Strength (g/L) = N × Eq.wt

function calcStrength() {
    const strN = parseFloat(document.getElementById('strN').value);
    const strEq = parseFloat(document.getElementById('strEq').value);

    // Validation
    const validations = [
        validateInput(strN, 'Normality'),
        validateInput(strEq, 'Equivalent Weight')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultStrength', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Strength
    const strength = strN * strEq;

    showResult('resultStrength', `
        <strong>✅ Calculation Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Strength = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(strength)}</span> g/L
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">Formula: ${formatNumber(strN)} × ${formatNumber(strEq)}</small>
    `);
}

// ===== Calculator 4: Purity Calculator =====
// Formula: Purity % = (Actual Weight / Taken Weight) × 100

function calcPurity() {
    const actualW = parseFloat(document.getElementById('actualW').value);
    const takenW = parseFloat(document.getElementById('takenW').value);

    // Validation
    const validations = [
        validateInput(actualW, 'Actual Weight'),
        validateInput(takenW, 'Taken Weight')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultPurity', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Purity
    const purity = (actualW / takenW) * 100;

    // Determine purity quality
    let qualityEmoji = '⚠️';
    let qualityColor = '#e74c3c';
    if (purity >= 99) {
        qualityEmoji = '🌟';
        qualityColor = '#27ae60';
    } else if (purity >= 95) {
        qualityEmoji = '✓';
        qualityColor = '#f39c12';
    }

    showResult('resultPurity', `
        <strong>✅ Calculation Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Purity = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(purity, 2)}%</span>
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">${qualityEmoji} Formula: (${formatNumber(actualW)} / ${formatNumber(takenW)}) × 100</small>
    `);
}

// ===== Calculator 5: Factor Calculator =====
// Formula: Factor = Actual Normality / Theoretical Normality

function calcFactor() {
    const actual = parseFloat(document.getElementById('actual').value);
    const theoretical = parseFloat(document.getElementById('theoretical').value);

    // Validation
    const validations = [
        validateInput(actual, 'Actual Normality'),
        validateInput(theoretical, 'Theoretical Normality')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultFactor', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Factor
    const factor = actual / theoretical;

    // Determine factor quality
    const isInRange = factor >= 0.98 && factor <= 1.02;
    const factorStatus = isInRange ? '✓ Acceptable (0.98 - 1.02)' : '⚠️ Outside Range';

    showResult('resultFactor', `
        <strong>✅ Calculation Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Factor (f) = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(factor)}</span>
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">Formula: ${formatNumber(actual)} / ${formatNumber(theoretical)}</small>
    `);
}

// ===== Calculator 6: Standardization (N₁V₁ = N₂V₂) =====
// Formula: N₂ = (N₁ × V₁) / V₂

function calcStd() {
    const n1 = parseFloat(document.getElementById('n1').value);
    const v1 = parseFloat(document.getElementById('v1_std').value);
    const v2 = parseFloat(document.getElementById('v2').value);

    // Validation
    const validations = [
        validateInput(n1, 'Normality of Standard (N₁)'),
        validateInput(v1, 'Volume of Standard (V₁)'),
        validateInput(v2, 'Volume of Unknown (V₂)')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultStd', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Unknown Normality
    const n2 = (n1 * v1) / v2;

    showResult('resultStd', `
        <strong>✅ Standardization Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Unknown Normality (N₂) = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(n2)}</span> N
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">
            Formula: (${formatNumber(n1)} × ${formatNumber(v1)}) / ${formatNumber(v2)}
        </small>
    `);
}

// ===== Calculator 7: Titration Standardization =====
// Calculate mean volume and then use N₁V₁ = N₂V₂

function calcTitration() {
    const t1 = parseFloat(document.getElementById('t1').value);
    const t2 = parseFloat(document.getElementById('t2').value);
    const t3 = parseFloat(document.getElementById('t3').value);
    const stdN = parseFloat(document.getElementById('stdN').value);
    const stdV = parseFloat(document.getElementById('stdV').value);

    // Validation
    const validations = [
        validateInput(t1, 'Trial 1 Volume'),
        validateInput(t2, 'Trial 2 Volume'),
        validateInput(t3, 'Trial 3 Volume'),
        validateInput(stdN, 'Normality of Standard'),
        validateInput(stdV, 'Volume of Standard')
    ];

    for (let validation of validations) {
        if (!validation.valid) {
            showResult('resultTitration', `❌ ${validation.message}`, false);
            return;
        }
    }

    // Calculate Mean Volume
    const meanVolume = (t1 + t2 + t3) / 3;

    // Calculate Standard Deviation (for quality assessment)
    const variance = ((Math.pow(t1 - meanVolume, 2) + 
                       Math.pow(t2 - meanVolume, 2) + 
                       Math.pow(t3 - meanVolume, 2)) / 3);
    const stdDev = Math.sqrt(variance);
    const rsd = (stdDev / meanVolume) * 100; // Relative Standard Deviation

    // Calculate Unknown Normality using N₁V₁ = N₂V₂
    const unknownN = (stdN * stdV) / meanVolume;

    // Quality assessment
    let qualityEmoji = '⚠️';
    if (rsd < 1) {
        qualityEmoji = '✅';
    } else if (rsd < 2) {
        qualityEmoji = '⚠️';
    }

    showResult('resultTitration', `
        <strong>✅ Titration Analysis Complete</strong><br>
        <span style="font-size: 1.3rem; display: block; margin-top: 0.8rem; font-weight: 700;">
            Unknown Normality (N₂) = <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px;">${formatNumber(unknownN)}</span> N
        </span>
        <small style="display: block; margin-top: 0.8rem; text-align: left; opacity: 0.9;">
            <strong>Mean Volume:</strong> ${formatNumber(meanVolume, 2)} mL<br>
            <strong>RSD:</strong> ${formatNumber(rsd, 2)}% ${qualityEmoji}
        </small>
    `);
}

// ===== Initialize Event Listeners =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Initialize theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }

    // Initialize help toggle
    const helpToggle = document.getElementById('helpToggle');
    if (helpToggle) {
        helpToggle.addEventListener('click', toggleHelp);
    }

    // Set initial equivalent weights
    setEqWeight(1);
    setEqWeight(2);

    // Add Enter key support for all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                // Find the calculate button in the same card
                const card = input.closest('.card');
                const button = card.querySelector('.btn-primary');
                if (button) {
                    button.click();
                }
            }
        });
    });

    // Add input validation styling
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && parseFloat(this.value) <= 0) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '';
            }
        });
    });
    
    // Add card animations on scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'scaleIn 0.5s ease';
            }
        });
    });
    
    cards.forEach(card => observer.observe(card));
});

// ===== Clear Result Messages =====

function clearResults() {
    const results = document.querySelectorAll('.result');
    results.forEach(result => {
        result.innerHTML = '';
        result.className = 'result';
    });
}

// ===== Export Functions for Testing =====

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calcN,
        calcWeight,
        calcStrength,
        calcPurity,
        calcFactor,
        calcStd,
        calcTitration,
        validateInput,
        formatNumber
    };
}
