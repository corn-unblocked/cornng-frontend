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

let proxyUrl = "";

async function autoDetectServer() {
    proxyUrl = config.useBare
        ? await autoDetectServerBare()
        : await autoDetectServerWisp();
}

async function autoDetectServerBare() {
    let ret = "";
    let proxyDetectPromises = [];
    for (const proxy in bareProxyUrls) {
        let url = proxy;
        if (url == "auto") continue;
        if (url == "custom") url = config.bareCustomProxy;
        proxyDetectPromises.push(
            new Promise((res, rej) => {
                setTimeout(() => {
                    rej("Failed to fetch bare on " + url);
                }, 5000);
                fetch(url).then((rsp) => {
                    if (rsp.status == 200) {
                        res(url);
                    } else {
                        rej(
                            "Bare returned error code " +
                                rsp.status +
                                " on url " +
                                url,
                        );
                    }
                });
            }),
        );
    }
    await Promise.any(proxyDetectPromises).then((res) => {
        ret = res;
    });
    return ret;
}

async function autoDetectServerWisp() {
    let ret = "";
    let proxyDetectPromises = [];
    for (const proxy in wispProxyUrls) {
        let url = proxy;
        if (url == "auto") continue;
        if (url == "custom") url = config.wispCustomProxy;
        proxyDetectPromises.push(
            new Promise((res, rej) => {
                const socket = new WebSocket(url);
                // wait 5s before failing to find url, may add in config later
                setTimeout(() => {
                    if (socket.readyState == WebSocket.OPEN) res(url);
                    else rej("Failed to open websocket on " + url);
                }, 5000);
                socket.onopen = () => res(url);
            }),
        );
    }
    await Promise.any(proxyDetectPromises).then((res) => {
        ret = res;
    });
    return ret;
}

function updateServerAddress() {
    if (proxyUrlSelector.value === "custom") {
        proxyUrl = config.useBare
            ? config.bareCustomProxy
            : config.wispCustomProxy;
        serverAddress.disabled = false;
    } else if (proxyUrlSelector.value === "auto") {
        autoDetectServer().then(() => {
            serverAddress.disabled = true;
            serverAddress.value = proxyUrl;
        });
    } else {
        proxyUrl = proxyUrlSelector.value;
        serverAddress.disabled = true;
    }
    if (config.useBare) {
        config.bareProxyIndex = proxyUrlSelector.selectedIndex;
    } else {
        config.wispProxyIndex = proxyUrlSelector.selectedIndex;
    }
    serverAddress.value = proxyUrl;
    saveConfig();
}

function generateSelectableUrls() {
    while (proxyUrlSelector.hasChildNodes())
        proxyUrlSelector.removeChild(proxyUrlSelector.firstChild);
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
    proxyUrlSelector.selectedIndex = config.useBare
        ? config.bareProxyIndex
        : config.wispProxyIndex;
    updateServerAddress();
    saveConfig();
}

proxyUrlSelector.addEventListener("change", updateServerAddress);
proxyTypeSelector.addEventListener("change", updateProxyType);
serverAddress.addEventListener("change", updateCustomProxy);

proxyTypeSelector.selectedIndex = config.useBare ? 1 : 0;
updateProxyType();

targetAddress.value =
    new URLSearchParams(document.location.search).get("url") ??
    "https://google.com";
