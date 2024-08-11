/**
 * @type {HTMLSelectElement}
 */
const proxyUrlSelector = document.getElementById("proxyUrl");

/**
 * @type {HTMLSelectElement}
 */
const proxyTypeSelector = document.getElementById("proxyType");

/**
 * @type {HTMLInputElement}
 */
const serverAddress = document.getElementById("serverAddress");

/**
 * @type {HTMLInputElement}
 */
const targetAddress = document.getElementById("targetAddress");

/**
 * @type {HTMLButtonElement}
 */
const startButton = document.getElementById("startButton");

function updateServerAddress() {
    let proxyUrls = config.useBare ? bareProxyUrls : wispProxyUrls;
    if (proxyUrlSelector.value === "custom") {
        serverAddress.value = config.useBare ? config.bareCustomProxy : config.wispCustomProxy;
        serverAddress.disabled = false;
    } else {
        serverAddress.value = proxyUrlSelector.value;
        serverAddress.disabled = true;
    }
    if (config.useBare) {
        config.bareProxyIndex = proxyUrlSelector.selectedIndex;
    } else {
        config.wispProxyIndex = proxyUrlSelector.selectedIndex;
    }
    saveConfig();
}

function generateSelectableUrls() {
    while (proxyUrlSelector.hasChildNodes()) proxyUrlSelector.removeChild(proxyUrlSelector.firstChild);
    let proxyUrls = config.useBare ? bareProxyUrls : wispProxyUrls;
    for (let proxy in proxyUrls) {
        let option = document.createElement("option");
        option.innerHTML = proxyUrls[proxy];
        option.value = proxy;
        proxyUrlSelector.appendChild(option);
    }
}

function updateCustomProxy() {
    if (config.useBare) {
        config.bareCustomProxy = serverAddress.value;
    } else {
        config.wispCustomProxy = serverAddress.value;
    }
    saveConfig();
}

function updateProxyType() {
    config.useBare = proxyTypeSelector.selectedIndex == 1;
    generateSelectableUrls();
    proxyUrlSelector.selectedIndex = config.useBare ? config.bareProxyIndex : config.wispProxyIndex;
    updateServerAddress();
    saveConfig();
}

proxyUrlSelector.addEventListener("change", updateServerAddress);
proxyTypeSelector.addEventListener("change", updateProxyType)
serverAddress.addEventListener("change", updateCustomProxy);

proxyTypeSelector.selectedIndex = config.useBare ? 1 : 0;
updateProxyType();
