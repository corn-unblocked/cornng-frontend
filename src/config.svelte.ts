export const bareProxyUrls = {
    auto: "Auto",
    custom: "Custom",
    "https://aluu.xyz/bare/": "Alu 1",
    "https://freemathhw.xyz/bare/": "Alu 2",
    "https://canvaslogin.org/bare/": "Alu 3",
    "https://tnlnda.xyz/bare/": "Alu 4",
    "https://incog.works/bare/": "Incognito 1",
    "https://math.mathpuns.lol/bare/": "Incognito 2",
    "https://math.americahistory.online/bare/": "Incognito 3",
    "https://english.geniuslecture.club/bare/": "Incognito 4",
    "https://definitelyscience.com/bare/": "Definitely Science 1",
    "https://onlinegames.ro/bare/": "Definitely Science 2",
    "https://mages.io/bare/": "Definitely Science 3",
    "https://kazwire.com/bare/": "Kazwire",
};

export const wispProxyUrls = {
    auto: "Auto",
    custom: "Custom",
    "wss://aluu.xyz/wisp/": "Alu 1",
    "wss://freemathhw.xyz/wisp/": "Alu 2",
    "wss://canvaslogin.org/wisp/": "Alu 3",
    "wss://tnlnda.xyz/wisp/": "Alu 4",
    "wss://incog.works/wisp/": "Incognito 1",
    "wss://math.mathpuns.lol/wisp/": "Incognito 2",
    "wss://math.americahistory.online/wisp/": "Incognito 3",
    "wss://english.geniuslecture.club/wisp/": "Incognito 4",
    "wss://definitelyscience.com/wisp/": "Definitely Science 1",
    "wss://onlinegames.ro/wisp/": "Definitely Science 2",
    "wss://mages.io/wisp/": "Definitely Science 3",
    "wss://wisp.mercurywork.shop/": "Mercury",
};

export class Config {
    // config version (incrementing forces a config rewrite)
    public configVersion: number = $state(1);
    // whether to use bare or wisp
    public useBare: boolean = $state(false);
    // these 4 are pretty self explanatory
    public wispProxyIndex: number = $state(0);
    public wispCustomProxy: string = $state("");
    public bareProxyIndex: number = $state(0);
    public bareCustomProxy: string = $state("");
    // auto detect proxy timeout (ms)
    public probeTimeout: number = $state(5000);
}

export function saveConfig(config: Config): void {
    localStorage.setItem("config", JSON.stringify(config));
}

function loadConfig(): Config {
    const config = new Config();
    let str = localStorage.getItem("config");
    if (str == null) {
        return config;
    }
    let tmp = JSON.parse(str);
    // overwrite old configs
    if (
        tmp.configVersion == undefined ||
        tmp.configVersion < config.configVersion
    ) {
        return config;
    }
    for (let a in tmp) {
        config[a] = tmp[a];
    }
    return config;
}

const config = $state(loadConfig());
export default config;