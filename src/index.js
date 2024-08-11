const currentProxyConfig = {
    proxyType: 0,
    isBare: false,
    proxyUrls: wispProxyUrls,
    proxyIndex: config.wispProxyIndex,
    customProxy: config.wispCustomProxy,
}

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
    if (proxyUrlSelector.value === "custom") {
        serverAddress.value = currentProxyConfig.customProxy;
        serverAddress.disabled = false;
    } else {
        serverAddress.value = proxyUrlSelector.value;
        serverAddress.disabled = true;
    }
    currentProxyConfig.proxyIndex = proxyUrlSelector.selectedIndex;
    saveCurrentProxyConfig();
}

function generateSelectableUrls() {
    while (proxyUrlSelector.hasChildNodes()) proxyUrlSelector.removeChild(proxyUrlSelector.firstChild);
    for (let proxy in currentProxyConfig.proxyUrls) {
        let option = document.createElement("option");
        option.innerHTML = currentProxyConfig.proxyUrls[proxy];
        option.value = proxy;
        proxyUrlSelector.appendChild(option);
    }
}

function updateCustomProxy() {
    currentProxyConfig.customProxy = serverAddress.value;
    saveCurrentProxyConfig();
}

function saveCurrentProxyConfig() {
    if (currentProxyConfig.isBare) {
        config.bareProxyIndex = currentProxyConfig.proxyIndex;
        config.bareCustomProxy = currentProxyConfig.customProxy;
    } else {
        config.wispProxyIndex = currentProxyConfig.proxyIndex;
        config.wispCustomProxy = currentProxyConfig.customProxy;
    }
    saveConfig();
}

function updateProxyType() {
    config.proxyType = proxyTypeSelector.selectedIndex;

    // save old stuff if proxy type changes
    if (currentProxyConfig.proxyType != config.proxyType)
    {
        saveCurrentProxyConfig();
    }

    currentProxyConfig.proxyType = config.proxyType;
    currentProxyConfig.isBare = currentProxyConfig.proxyType === 2;
    currentProxyConfig.proxyUrls = currentProxyConfig.isBare ? bareProxyUrls : wispProxyUrls;
    currentProxyConfig.proxyIndex = currentProxyConfig.isBare ? config.bareProxyIndex : config.wispProxyIndex;
    currentProxyConfig.customProxy = currentProxyConfig.isBare ? config.bareCustomProxy : config.wispCustomProxy;

    generateSelectableUrls();
    proxyUrlSelector.selectedIndex = currentProxyConfig.proxyIndex;
    updateServerAddress();
}

proxyUrlSelector.addEventListener("change", updateServerAddress);
proxyTypeSelector.addEventListener("change", updateProxyType)
serverAddress.addEventListener("change", updateCustomProxy);

proxyTypeSelector.selectedIndex = config.proxyType;
updateProxyType();
