/**
 * @type {HTMLSelectElement}
 */
const proxyUrlSelector = document.getElementById("proxyUrl");

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
    if (proxyUrlSelector.value === "Custom") {
        serverAddress.value = config.customProxy;
        serverAddress.disabled = false;
    } else {
        serverAddress.value = proxyUrls[proxyUrlSelector.value];
        serverAddress.disabled = true;
    }
    config.proxyIndex = proxyUrlSelector.selectedIndex;
    saveConfig();
}

function generateSelectableUrls() {
    while (proxyUrlSelector.hasChildNodes()) proxyUrlSelector.removeChild();
    for (let proxy in proxyUrls) {
        let option = document.createElement("option");
        option.innerHTML = proxy;
        option.value = proxy;
        proxyUrlSelector.appendChild(option);
    }
}

function updateCustomProxy() {
    config.customProxy = serverAddress.value;
    saveConfig();
}

proxyUrlSelector.addEventListener("change", updateServerAddress);
serverAddress.addEventListener("change", updateCustomProxy);

generateSelectableUrls();
proxyUrlSelector.selectedIndex = config.proxyIndex;
updateServerAddress();
