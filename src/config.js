const proxyUrls = {
    "Custom": "",
    "Mercury Network": "wss://wisp.mercurywork.shop/",
    "Aluu.xyz": "wss://aluu.xyz/wisp/",
    "Incognito": "wss://incog.works/wisp/",
}

const config = {
    proxyIndex: 1,
    customProxy: "",
}

function loadConfig() {
    let tmp = JSON.parse(localStorage.getItem("config"));
    for (let a in tmp) {
        config[a] = tmp[a];
    }
}

function saveConfig() {
    localStorage.setItem("config", JSON.stringify(config));
}

loadConfig();
