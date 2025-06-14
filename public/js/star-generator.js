"use strict";
const MAX_LUMINOSITY = 4;
const MIN_TEMP = 2000;
const MAX_TEMP = 30000;
const STELLAR_DENSITY = 1e-4;
const MOVE_SPEED = 0.008;
let windowXBound = window.innerWidth / 2;
let lastWindowXBound = 0;
let windowYBound = window.innerHeight / 2;
let lastWindowYBound = 0;
let lastUpdated;
let canvasElt;
let ctx;
const canvasOfs = new OffscreenCanvas(windowXBound * 2, windowYBound * 2);
const ctxOfs = canvasOfs.getContext("2d");
const starTemps = [];
const starLuminosities = [];
const starXs = [];
const starYs = [];
const starZs = [];
let numStars = 0;
let univXBound = 0;
let univYBound = 0;
const univMinZ = 0;
const univMaxZ = 2;
const observerX = 0;
const observerY = 0;
const observerZ = -1;
const kelvinTable = { "1000": "#ff3300", "1100": "#ff4500", "1200": "#ff5200", "1300": "#ff5d00", "1400": "#ff6600", "1500": "#ff6f00", "1600": "#ff7600", "1700": "#ff7c00", "1800": "#ff8200", "1900": "#ff8700", "2000": "#ff8d0b", "2100": "#ff921d", "2200": "#ff9829", "2300": "#ff9d33", "2400": "#ffa23c", "2500": "#ffa645", "2600": "#ffaa4d", "2700": "#ffae54", "2800": "#ffb25b", "2900": "#ffb662", "3000": "#ffb969", "3100": "#ffbd6f", "3200": "#ffc076", "3300": "#ffc37c", "3400": "#ffc682", "3500": "#ffc987", "3600": "#ffcb8d", "3700": "#ffce92", "3800": "#ffd097", "3900": "#ffd39c", "4000": "#ffd5a1", "4100": "#ffd7a6", "4200": "#ffd9ab", "4300": "#ffdbaf", "4400": "#ffddb4", "4500": "#ffdfb8", "4600": "#ffe1bc", "4700": "#ffe2c0", "4800": "#ffe4c4", "4900": "#ffe5c8", "5000": "#ffe7cc", "5100": "#ffe8d0", "5200": "#ffead3", "5300": "#ffebd7", "5400": "#ffedda", "5500": "#ffeede", "5600": "#ffefe1", "5700": "#fff0e4", "5800": "#fff1e7", "5900": "#fff3ea", "6000": "#fff4ed", "6100": "#fff5f0", "6200": "#fff6f3", "6300": "#fff7f5", "6400": "#fff8f8", "6500": "#fff9fb", "6600": "#fff9fd", "6700": "#fefaff", "6800": "#fcf8ff", "6900": "#faf7ff", "7000": "#f7f5ff", "7100": "#f5f4ff", "7200": "#f3f3ff", "7300": "#f1f1ff", "7400": "#eff0ff", "7500": "#eeefff", "7600": "#eceeff", "7700": "#eaedff", "7800": "#e9ecff", "7900": "#e7eaff", "8000": "#e5e9ff", "8100": "#e4e9ff", "8200": "#e3e8ff", "8300": "#e1e7ff", "8400": "#e0e6ff", "8500": "#dfe5ff", "8600": "#dde4ff", "8700": "#dce3ff", "8800": "#dbe2ff", "8900": "#dae2ff", "9000": "#d9e1ff", "9100": "#d8e0ff", "9200": "#d7dfff", "9300": "#d6dfff", "9400": "#d5deff", "9500": "#d4ddff", "9600": "#d3ddff", "9700": "#d2dcff", "9800": "#d1dcff", "9900": "#d0dbff", "10000": "#cfdaff", "10100": "#cfdaff", "10200": "#ced9ff", "10300": "#cdd9ff", "10400": "#ccd8ff", "10500": "#ccd8ff", "10600": "#cbd7ff", "10700": "#cad7ff", "10800": "#cad6ff", "10900": "#c9d6ff", "11000": "#c8d5ff", "11100": "#c8d5ff", "11200": "#c7d4ff", "11300": "#c6d4ff", "11400": "#c6d4ff", "11500": "#c5d3ff", "11600": "#c5d3ff", "11700": "#c4d2ff", "11800": "#c4d2ff", "11900": "#c3d2ff", "12000": "#c3d1ff", "12100": "#c2d1ff", "12200": "#c2d0ff", "12300": "#c1d0ff", "12400": "#c1d0ff", "12500": "#c0cfff", "12600": "#c0cfff", "12700": "#bfcfff", "12800": "#bfceff", "12900": "#beceff", "13000": "#beceff", "13100": "#beceff", "13200": "#bdcdff", "13300": "#bdcdff", "13400": "#bccdff", "13500": "#bcccff", "13600": "#bcccff", "13700": "#bbccff", "13800": "#bbccff", "13900": "#bbcbff", "14000": "#bacbff", "14100": "#bacbff", "14200": "#bacbff", "14300": "#b9caff", "14400": "#b9caff", "14500": "#b9caff", "14600": "#b8caff", "14700": "#b8c9ff", "14800": "#b8c9ff", "14900": "#b8c9ff", "15000": "#b7c9ff", "15100": "#b7c9ff", "15200": "#b7c8ff", "15300": "#b6c8ff", "15400": "#b6c8ff", "15500": "#b6c8ff", "15600": "#b6c8ff", "15700": "#b5c7ff", "15800": "#b5c7ff", "15900": "#b5c7ff", "16000": "#b5c7ff", "16100": "#b4c7ff", "16200": "#b4c6ff", "16300": "#b4c6ff", "16400": "#b4c6ff", "16500": "#b3c6ff", "16600": "#b3c6ff", "16700": "#b3c6ff", "16800": "#b3c5ff", "16900": "#b3c5ff", "17000": "#b2c5ff", "17100": "#b2c5ff", "17200": "#b2c5ff", "17300": "#b2c5ff", "17400": "#b2c4ff", "17500": "#b1c4ff", "17600": "#b1c4ff", "17700": "#b1c4ff", "17800": "#b1c4ff", "17900": "#b1c4ff", "18000": "#b0c4ff", "18100": "#b0c3ff", "18200": "#b0c3ff", "18300": "#b0c3ff", "18400": "#b0c3ff", "18500": "#b0c3ff", "18600": "#afc3ff", "18700": "#afc3ff", "18800": "#afc2ff", "18900": "#afc2ff", "19000": "#afc2ff", "19100": "#afc2ff", "19200": "#aec2ff", "19300": "#aec2ff", "19400": "#aec2ff", "19500": "#aec2ff", "19600": "#aec2ff", "19700": "#aec1ff", "19800": "#aec1ff", "19900": "#adc1ff", "20000": "#adc1ff", "20100": "#adc1ff", "20200": "#adc1ff", "20300": "#adc1ff", "20400": "#adc1ff", "20500": "#adc1ff", "20600": "#adc0ff", "20700": "#acc0ff", "20800": "#acc0ff", "20900": "#acc0ff", "21000": "#acc0ff", "21100": "#acc0ff", "21200": "#acc0ff", "21300": "#acc0ff", "21400": "#acc0ff", "21500": "#abc0ff", "21600": "#abc0ff", "21700": "#abbfff", "21800": "#abbfff", "21900": "#abbfff", "22000": "#abbfff", "22100": "#abbfff", "22200": "#abbfff", "22300": "#abbfff", "22400": "#aabfff", "22500": "#aabfff", "22600": "#aabfff", "22700": "#aabfff", "22800": "#aabeff", "22900": "#aabeff", "23000": "#aabeff", "23100": "#aabeff", "23200": "#aabeff", "23300": "#aabeff", "23400": "#a9beff", "23500": "#a9beff", "23600": "#a9beff", "23700": "#a9beff", "23800": "#a9beff", "23900": "#a9beff", "24000": "#a9beff", "24100": "#a9beff", "24200": "#a9bdff", "24300": "#a9bdff", "24400": "#a9bdff", "24500": "#a8bdff", "24600": "#a8bdff", "24700": "#a8bdff", "24800": "#a8bdff", "24900": "#a8bdff", "25000": "#a8bdff", "25100": "#a8bdff", "25200": "#a8bdff", "25300": "#a8bdff", "25400": "#a8bdff", "25500": "#a8bdff", "25600": "#a8bdff", "25700": "#a7bcff", "25800": "#a7bcff", "25900": "#a7bcff", "26000": "#a7bcff", "26100": "#a7bcff", "26200": "#a7bcff", "26300": "#a7bcff", "26400": "#a7bcff", "26500": "#a7bcff", "26600": "#a7bcff", "26700": "#a7bcff", "26800": "#a7bcff", "26900": "#a7bcff", "27000": "#a7bcff", "27100": "#a6bcff", "27200": "#a6bcff", "27300": "#a6bcff", "27400": "#a6bbff", "27500": "#a6bbff", "27600": "#a6bbff", "27700": "#a6bbff", "27800": "#a6bbff", "27900": "#a6bbff", "28000": "#a6bbff", "28100": "#a6bbff", "28200": "#a6bbff", "28300": "#a6bbff", "28400": "#a6bbff", "28500": "#a6bbff", "28600": "#a6bbff", "28700": "#a5bbff", "28800": "#a5bbff", "28900": "#a5bbff", "29000": "#a5bbff", "29100": "#a5bbff", "29200": "#a5bbff", "29300": "#a5bbff", "29400": "#a5bbff", "29500": "#a5baff", "29600": "#a5baff", "29700": "#a5baff", "29800": "#a5baff", "29900": "#a5baff", "30000": "#a5baff", "30100": "#a5baff", "30200": "#a5baff", "30300": "#a5baff", "30400": "#a5baff", "30500": "#a5baff", "30600": "#a4baff", "30700": "#a4baff", "30800": "#a4baff", "30900": "#a4baff", "31000": "#a4baff", "31100": "#a4baff", "31200": "#a4baff", "31300": "#a4baff", "31400": "#a4baff", "31500": "#a4baff", "31600": "#a4baff", "31700": "#a4baff", "31800": "#a4baff", "31900": "#a4baff", "32000": "#a4b9ff", "32100": "#a4b9ff", "32200": "#a4b9ff", "32300": "#a4b9ff", "32400": "#a4b9ff", "32500": "#a4b9ff", "32600": "#a4b9ff", "32700": "#a3b9ff", "32800": "#a3b9ff", "32900": "#a3b9ff", "33000": "#a3b9ff", "33100": "#a3b9ff", "33200": "#a3b9ff", "33300": "#a3b9ff", "33400": "#a3b9ff", "33500": "#a3b9ff", "33600": "#a3b9ff", "33700": "#a3b9ff", "33800": "#a3b9ff", "33900": "#a3b9ff", "34000": "#a3b9ff", "34100": "#a3b9ff", "34200": "#a3b9ff", "34300": "#a3b9ff", "34400": "#a3b9ff", "34500": "#a3b9ff", "34600": "#a3b9ff", "34700": "#a3b9ff", "34800": "#a3b9ff", "34900": "#a3b9ff", "35000": "#a3b8ff", "35100": "#a3b8ff", "35200": "#a2b8ff", "35300": "#a2b8ff", "35400": "#a2b8ff", "35500": "#a2b8ff", "35600": "#a2b8ff", "35700": "#a2b8ff", "35800": "#a2b8ff", "35900": "#a2b8ff", "36000": "#a2b8ff", "36100": "#a2b8ff", "36200": "#a2b8ff", "36300": "#a2b8ff", "36400": "#a2b8ff", "36500": "#a2b8ff", "36600": "#a2b8ff", "36700": "#a2b8ff", "36800": "#a2b8ff", "36900": "#a2b8ff", "37000": "#a2b8ff", "37100": "#a2b8ff", "37200": "#a2b8ff", "37300": "#a2b8ff", "37400": "#a2b8ff", "37500": "#a2b8ff", "37600": "#a2b8ff", "37700": "#a2b8ff", "37800": "#a2b8ff", "37900": "#a2b8ff", "38000": "#a2b8ff", "38100": "#a2b8ff", "38200": "#a2b8ff", "38300": "#a1b8ff", "38400": "#a1b8ff", "38500": "#a1b8ff", "38600": "#a1b7ff", "38700": "#a1b7ff", "38800": "#a1b7ff", "38900": "#a1b7ff", "39000": "#a1b7ff", "39100": "#a1b7ff", "39200": "#a1b7ff", "39300": "#a1b7ff", "39400": "#a1b7ff", "39500": "#a1b7ff", "39600": "#a1b7ff", "39700": "#a1b7ff", "39800": "#a1b7ff", "39900": "#a1b7ff", "40000": "#a1b7ff" };
function tempToRgb(kelvin) {
    if (kelvin <= 1000) {
        return kelvinTable[1000];
    }
    if (kelvin >= 40000) {
        return kelvinTable[40000];
    }
    return kelvinTable[Math.round(kelvin / 100) * 100];
}
function randRange(min, max) {
    return Math.random() * (max - min) + min;
}
function populateStars(minX, maxX, minY, maxY, minZ, maxZ) {
    let numStarsToAdd = STELLAR_DENSITY * (maxX - minX) * (maxY - minY)
        * (maxZ - minZ);
    const fracPart = numStarsToAdd % 1;
    if (fracPart !== 0) {
        numStarsToAdd = ((Math.random() < fracPart)
            ? Math.ceil(numStarsToAdd)
            : Math.floor(numStarsToAdd));
    }
    for (let i = 0; i < numStarsToAdd; i++) {
        starTemps.push(randRange(MIN_TEMP, MAX_TEMP));
        starLuminosities.push(randRange(0, MAX_LUMINOSITY));
        starXs.push(randRange(minX, maxX));
        starYs.push(randRange(minY, maxY));
        starZs.push(randRange(minZ, maxZ));
    }
    numStars = starTemps.length;
}
function cleanStars() {
    let iSet = 0;
    for (let iGet = 0; iGet < numStars; iGet++) {
        if (Math.abs(starXs[iGet]) > univXBound ||
            Math.abs(starYs[iGet]) > univYBound ||
            starZs[iGet] > univMaxZ || starZs[iGet] < univMinZ) {
            continue;
        }
        if (iSet !== iGet) {
            starTemps[iSet] = starTemps[iGet];
            starLuminosities[iSet] = starLuminosities[iGet];
            starXs[iSet] = starXs[iGet];
            starYs[iSet] = starYs[iGet];
            starZs[iSet] = starZs[iGet];
        }
        iSet++;
    }
    numStars = iSet + 1;
    starTemps.length = numStars;
    starLuminosities.length = numStars;
    starXs.length = numStars;
    starYs.length = numStars;
    starZs.length = numStars;
}
function translateY(deltaY) {
    for (let i = 0; i < numStars; i++) {
        starYs[i] += deltaY;
    }
    cleanStars();
    populateStars(-univXBound, univXBound, -univYBound, deltaY - univYBound, univMinZ, univMaxZ);
}
function updateUnivXBound(newUnivXBound) {
    if (newUnivXBound === univXBound)
        return;
    if (newUnivXBound < univXBound) {
        univXBound = newUnivXBound;
        cleanStars();
    }
    else {
        populateStars(-newUnivXBound, -univXBound, -univYBound, univYBound, univMinZ, univMaxZ);
        populateStars(univXBound, newUnivXBound, -univYBound, univYBound, univMinZ, univMaxZ);
        univXBound = newUnivXBound;
    }
}
function updateUnivYBound(newUnivYBound) {
    if (newUnivYBound == univYBound)
        return;
    if (newUnivYBound < univYBound) {
        univYBound = newUnivYBound;
        cleanStars();
    }
    else {
        populateStars(-univXBound, univXBound, -newUnivYBound, -univYBound, univMinZ, univMaxZ);
        populateStars(-univXBound, univXBound, univYBound, newUnivYBound, univMinZ, univMaxZ);
        univYBound = newUnivYBound;
    }
}
function drawStarsOffscreen() {
    for (let i = 0; i < numStars; i++) {
        const starX = (starXs[i] - observerX) / (starZs[i] - observerZ)
            * -observerZ;
        const starY = (starYs[i] - observerY) / (starZs[i] - observerZ)
            * -observerZ;
        const flux = starLuminosities[i] / (starZs[i] - observerZ) ** 2;
        const radius = Math.sqrt(flux);
        if (Math.abs(starX) - radius > windowXBound ||
            Math.abs(starY) - radius > windowYBound) {
            continue;
        }
        ctxOfs.fillStyle = tempToRgb(starTemps[i]);
        ctxOfs.beginPath();
        ctxOfs.arc(starX + windowXBound, starY + windowYBound, radius, 0, 2 * Math.PI);
        ctxOfs.fill();
    }
}
function render() {
    windowXBound = window.innerWidth / 2;
    if (lastWindowXBound !== windowXBound) {
        canvasElt.width = windowXBound * 2;
        canvasOfs.width = windowXBound * 2;
        lastWindowXBound = windowXBound;
        updateUnivXBound((windowXBound - observerX) / (-observerZ)
            * (univMaxZ - observerZ));
    }
    windowYBound = window.innerHeight / 2;
    if (lastWindowYBound !== windowYBound) {
        canvasElt.height = windowYBound * 2;
        canvasOfs.height = windowYBound * 2;
        lastWindowYBound = windowYBound;
        updateUnivYBound((windowYBound - observerY) / (-observerZ)
            * (univMaxZ - observerZ));
    }
    const timeNow = performance.now();
    const timeElapsed = timeNow - lastUpdated;
    lastUpdated = timeNow;
    translateY(timeElapsed * MOVE_SPEED);
    drawStarsOffscreen();
    ctx.transferFromImageBitmap(canvasOfs.transferToImageBitmap());
    if (window["STATIC_BACKGROUND"] !== true) {
        requestAnimationFrame(render);
    }
}
// TODO: Update lastUpdated
document.addEventListener("DOMContentLoaded", function () {
    canvasElt = document.getElementById("background-canvas");
    ctx = canvasElt.getContext("bitmaprenderer")
        ?? (function () {
            throw new Error("Bitmap rendering context not supported");
        })();
    lastUpdated = performance.now();
    render();
});
