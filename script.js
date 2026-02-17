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
    resultElement.innerHTML = message;
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
        <strong>✓ Calculation Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Normality (N) = ${formatNumber(normality)} N
        </span>
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
        <strong>✓ Calculation Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Required Weight = ${formatNumber(weight)} g
        </span>
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
        <strong>✓ Calculation Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Strength = ${formatNumber(strength)} g/L
        </span>
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
    let qualityMessage = '';
    if (purity >= 99) {
        qualityMessage = '<br><small style="color: #27ae60;">🌟 Excellent Purity</small>';
    } else if (purity >= 95) {
        qualityMessage = '<br><small style="color: #f39c12;">⚠️ Good Purity</small>';
    } else {
        qualityMessage = '<br><small style="color: #e74c3c;">⚠️ Below Standard</small>';
    }

    showResult('resultPurity', `
        <strong>✓ Calculation Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Purity = ${formatNumber(purity, 2)} %
        </span>
        ${qualityMessage}
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
    let factorMessage = '';
    if (factor >= 0.98 && factor <= 1.02) {
        factorMessage = '<br><small style="color: #27ae60;">✓ Within Acceptable Range (0.98 - 1.02)</small>';
    } else {
        factorMessage = '<br><small style="color: #f39c12;">⚠️ Outside Standard Range</small>';
    }

    showResult('resultFactor', `
        <strong>✓ Calculation Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Factor (f) = ${formatNumber(factor)}
        </span>
        ${factorMessage}
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
        <strong>✓ Standardization Complete</strong><br>
        <span style="font-size: 1.2rem; display: block; margin-top: 0.5rem;">
            Unknown Normality (N₂) = ${formatNumber(n2)} N
        </span>
        <small style="display: block; margin-top: 0.5rem; opacity: 0.9;">
            Verification: ${formatNumber(n1)} × ${formatNumber(v1)} = ${formatNumber(n2)} × ${formatNumber(v2)}
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
    let qualityMsg = '';
    if (rsd < 1) {
        qualityMsg = '<br><small style="color: #27ae60;">✓ Excellent Precision (RSD < 1%)</small>';
    } else if (rsd < 2) {
        qualityMsg = '<br><small style="color: #f39c12;">⚠️ Acceptable Precision (RSD < 2%)</small>';
    } else {
        qualityMsg = '<br><small style="color: #e74c3c;">⚠️ Poor Precision (RSD ≥ 2%) - Consider repeating</small>';
    }

    showResult('resultTitration', `
        <strong>✓ Titration Analysis Complete</strong><br>
        <div style="margin-top: 0.8rem; text-align: left;">
            <strong>Trial Volumes:</strong><br>
            Trial 1: ${formatNumber(t1, 2)} mL<br>
            Trial 2: ${formatNumber(t2, 2)} mL<br>
            Trial 3: ${formatNumber(t3, 2)} mL<br>
            <strong>Mean Volume (V̄₂): ${formatNumber(meanVolume, 2)} mL</strong><br>
            <small>Standard Deviation: ±${formatNumber(stdDev, 3)} mL</small><br>
            <small>RSD: ${formatNumber(rsd, 2)}%</small>
            ${qualityMsg}
        </div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3);">
            <span style="font-size: 1.2rem; display: block;">
                <strong>Unknown Normality (N₂) = ${formatNumber(unknownN)} N</strong>
            </span>
        </div>
    `);
}

// ===== Initialize Event Listeners =====

document.addEventListener('DOMContentLoaded', function() {
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
