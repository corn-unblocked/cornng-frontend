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
    public configVersion: number;
    // whether to use bare or wisp
    public useBare: boolean;
    // these 4 are pretty self explanatory
    public wispProxyIndex: number;
    public wispCustomProxy: string;
    public bareProxyIndex: number;
    public bareCustomProxy: string;
    // auto detect proxy timeout (ms)
    public probeTimeout: number;

    public constructor() {
        this.configVersion = 1;
        this.useBare = false;
        this.wispProxyIndex = 0;
        this.wispCustomProxy = "";
        this.bareProxyIndex = 0;
        this.bareCustomProxy = "";
        this.loadConfig();
        this.probeTimeout = 5000;
    }

    public saveConfig(): void {
        localStorage.setItem("config", JSON.stringify(this));
    }
    public loadConfig(): void {
        let str = localStorage.getItem("config");
        if (str == null) {
            this.saveConfig();
            return;
        }
        let tmp = JSON.parse(str);
        // overwrite old configs
        if (
            tmp.configVersion == undefined ||
            tmp.configVersion < this.configVersion
        ) {
            this.saveConfig();
            return;
        }
        for (let a in tmp) {
            this[a] = tmp[a];
        }
    }
}
