const wispProxyUrls = {
    "Custom": "",
    "Mercury Network": "wss://wisp.mercurywork.shop/",
    "Aluu.xyz": "wss://aluu.xyz/wisp/",
    "Incognito": "wss://incog.works/wisp/",
}

const bareProxyUrls = {
    "Custom": "",
    "Aluu.xyz": "https://aluu.xyz/bare/",
    "Incognito": "https://incog.works/bare/",
}

const config = {
    useBare: false,
    wispProxyIndex: 1,
    wispCustomProxy: "",
    bareProxyIndex: 1,
    bareCustomProxy: "",
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
