import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import ProxyComponent from "./Proxy.svelte";
import config from "./config.svelte";
import { httpUrlToWebSocket } from "./util";

interface UvConfig {
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

export class ProxyManager {
    // set in App.svelte
    uvConfig: UvConfig;

    // set when ProxyComponent loads
    proxyComponent: ProxyComponent | undefined;
    bareMuxConnection: BareMuxConnection | undefined;
    
    url: string = $state("");
    iframeUrl: string = $state("");
    reloadIframe() {
        this.iframeUrl = this.uvConfig.prefix + this.uvConfig.encodeUrl(this.url);
    }

    setDestination(destination: string) {
        if (destination === "") {
            this.url = "https://google.com";
            return;
        }
        if (!destination.includes(".")) {
            this.url =
                "https://google.com/search?q=" + destination;
            return;
        }
        if (
            !destination.startsWith("https://") &&
            !destination.startsWith("http://")
        ) {
            this.url = "https://" + destination;
            return;
        }
        this.url = destination;
    }

    async registerSW() {
        if (!navigator.serviceWorker) {
            if (
                location.protocol !== "https:" &&
                !["localhost", "127.0.0.1"].includes(location.hostname)
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

    async startProxy() {
        const loc = this.uvConfig.loc;

        if (this.bareMuxConnection == undefined) this.bareMuxConnection = new BareMuxConnection(loc + "/baremux/worker.js");

        await this.registerSW();

        // todo - set proxy urls
        if (config.useBare) {
            await this.bareMuxConnection.setTransport(loc + "/baremod/index.mjs", [
                "https://aluu.xyz/bare/"
            ]);
        } else {
            // set to websocket protocol
            await this.bareMuxConnection.setTransport(loc + "/libcurl/index.mjs", [
                { wisp: httpUrlToWebSocket("wss://phantom.lol/wisp/") },
            ]);
        }

        this.reloadIframe();
    }
}

const proxyManager = $state(new ProxyManager());
export default proxyManager;