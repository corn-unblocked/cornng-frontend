import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { Config } from "./config";
import Util from "./util";

export interface UvConfig {
    prefix: string;
    encodeUrl: (s: string) => string;
    decodeUrl: (s: string) => string;
    handler: string;
    client: string;
    bundle: string;
    config: string;
    sw: string;
    stockSW: string;
    loc: string;
}

export class ProxyHistory {
    public urls: string[];
    public index: number;

    public constructor() {
        this.urls = [];
        this.index = 0;
    }

    public back(): string {
        this.index -= 1;
        return this.urls[this.index];
    }

    public forward(): string {
        if (this.index < this.urls.length - 1) this.index += 1;
        return this.urls[this.index];
    }

    public add(url: string) {
        // prevent readding duplicate urls when reloading page
        if (url == this.urls[this.index]) return;
        // delete "future" history if index is set to past
        if (this.index < this.urls.length - 1) {
            this.urls.splice(this.index + 1);
        }
        this.urls.push(url);
        this.index += 1;
    }
}

export class ProxyManager {
    private readonly swAllowedHostnames = ["localhost", "127.0.0.1"];
    private config: Config;
    private uvConfig: UvConfig;

    public connection: BareMuxConnection;
    public history: ProxyHistory;
    public proxyUrl: string;

    public constructor(config: Config, uvConfig: UvConfig) {
        this.config = config;
        this.uvConfig = uvConfig;
        this.connection = new BareMuxConnection(
            this.uvConfig.loc + "/baremux/worker.js",
        );
        this.history = new ProxyHistory();
        this.proxyUrl = "";
    }

    public async registerSW() {
        if (!navigator.serviceWorker) {
            if (
                location.protocol !== "https:" &&
                !this.swAllowedHostnames.includes(location.hostname)
            )
                throw new Error(
                    "Service workers cannot be registered without https.",
                );

            throw new Error("Your browser doesn't support service workers.");
        }
        // do not reregister
        if (
            (await navigator.serviceWorker.getRegistrations()).some(
                (x) =>
                    x.active !== null &&
                    x.active.scriptURL == this.uvConfig.stockSW,
            )
        )
            return;
        await navigator.serviceWorker.register(this.uvConfig.stockSW);
    }

    public async startProxy(url: string) {
        await this.registerSW();
        const loc = this.uvConfig.loc;
        if (this.config.useBare) {
            await this.connection.setTransport(loc + "/baremod/index.mjs", [
                this.proxyUrl,
            ]);
        } else {
            // set to websocket protocol
            await this.connection.setTransport(loc + "/libcurl/index.mjs", [
                { wisp: Util.httpToWs(this.proxyUrl) },
            ]);
        }

        this.setProxy(url);
    }

    public setProxy(url: string) {
        let frame = document.getElementById("proxyIframe") as HTMLIFrameElement;
        frame.style.display = "block";
        frame.src = this.encodeUrl(url);
    }

    public decodeUrl(url: string): string {
        url = url.slice(this.uvConfig.prefix.length);
        return this.uvConfig.decodeUrl(url);
    }

    public encodeUrl(url: string): string {
        // if period, assume valid url. should work 90% of the time
        if (!url.includes(".")) {
            url = "https://google.com/search?q=" + url;
        } else if (!url.startsWith("https://") && !url.startsWith("http://")) {
            url = "https://" + url;
        }
        return this.uvConfig.prefix + this.uvConfig.encodeUrl(url);
    }
}
