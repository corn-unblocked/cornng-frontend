const wispProxyUrls = {
    "custom": "Custom",
    "wss://aluu.xyz/wisp/": "Alu",
    "wss://incog.works/wisp/": "Incognito",
    "wss://wisp.mercurywork.shop/": "Mercury",
}

const bareProxyUrls = {
    "custom": "Custom",
    "https://aluu.xyz/bare/": "Alu",
    "https://incog.works/bare/": "Incognito",
}

const config = {
    useBare: false,
    wispProxyIndex: 1,
    wispCustomProxy: "",
    bareProxyIndex: 1,
    bareCustomProxy: ""
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
