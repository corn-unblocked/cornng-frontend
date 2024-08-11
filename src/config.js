const wispProxyUrls = {
    "custom": "Custom",
    "wss://aluu.xyz/wisp/": "Alu 1",
    "wss://incog.works/wisp/": "Incognito 1",
    "wss://math.mathpuns.lol/wisp/": "Incognito 2",
    "wss://math.americahistory.online/wisp/": "Incognito 3",
    "wss://english.geniuslecture.club/wisp": "Incognito 4",
    "wss://wisp.mercurywork.shop/": "Mercury",
}

const bareProxyUrls = {
    "custom": "Custom",
    "https://aluu.xyz/bare/": "Alu 1",
    "https://incog.works/bare/": "Incognito 1",
    "https://math.mathpuns.lol/bare/": "Incognito 2",
    "https://math.americahistory.online/bare/": "Incognito 3",
    "https://english.geniuslecture.club/bare/": "Incognito 4",
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
