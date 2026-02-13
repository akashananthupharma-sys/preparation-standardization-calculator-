function calcN() {

    var w = parseFloat(document.getElementById("w").value);
    var eq = parseFloat(document.getElementById("eq").value);
    var v = parseFloat(document.getElementById("v").value);

    if (isNaN(w) || isNaN(eq) || isNaN(v)) {
        document.getElementById("resultN").innerHTML = "Enter all values correctly";
        return;
    }

    var N = (w * 1000) / (eq * v);

    document.getElementById("resultN").innerHTML =
        "Normality = " + N.toFixed(4) + " N";
}

function calcWeight() {

    var N = parseFloat(document.getElementById("reqN").value);
    var eq = parseFloat(document.getElementById("reqEq").value);
    var V = parseFloat(document.getElementById("reqV").value);

    if (isNaN(N) || isNaN(eq) || isNaN(V)) {
        document.getElementById("resultWeight").innerHTML = "Enter all values correctly";
        return;
    }

    var W = (N * eq * V) / 1000;

    document.getElementById("resultWeight").innerHTML =
        "Required Weight = " + W.toFixed(4) + " g";
}

function calcStrength() {

    var N = parseFloat(document.getElementById("strN").value);
    var eq = parseFloat(document.getElementById("strEq").value);

    if (isNaN(N) || isNaN(eq)) {
        document.getElementById("resultStrength").innerHTML = "Enter all values correctly";
        return;
    }

    var strength = N * eq;

    document.getElementById("resultStrength").innerHTML =
        "Strength = " + strength.toFixed(4) + " g/L";
}

function calcPurity() {

    var actual = parseFloat(document.getElementById("actualW").value);
    var taken = parseFloat(document.getElementById("takenW").value);

    if (isNaN(actual) || isNaN(taken)) {
        document.getElementById("resultPurity").innerHTML = "Enter all values correctly";
        return;
    }

    var purity = (actual / taken) * 100;

    document.getElementById("resultPurity").innerHTML =
        "% Purity = " + purity.toFixed(2) + " %";
}

function calcTitration() {

    var t1 = parseFloat(document.getElementById("t1").value);
    var t2 = parseFloat(document.getElementById("t2").value);
    var t3 = parseFloat(document.getElementById("t3").value);
    var stdN = parseFloat(document.getElementById("stdN").value);
    var stdV = parseFloat(document.getElementById("stdV").value);

    if (isNaN(t1) || isNaN(t2) || isNaN(t3) || isNaN(stdN) || isNaN(stdV)) {
        document.getElementById("resultTitration").innerHTML = "Enter all values correctly";
        return;
    }

    var meanV = (t1 + t2 + t3) / 3;

    var unknownN = (stdN * stdV) / meanV;

    document.getElementById("resultTitration").innerHTML =
        "Mean Volume = " + meanV.toFixed(2) + " mL <br>" +
        "Unknown Normality = " + unknownN.toFixed(4) + " N";
}

function setEqWeight() {
    var value = document.getElementById("chemical").value;
    document.getElementById("eq").value = value;
}