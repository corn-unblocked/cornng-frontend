import { Config, wispProxyUrls, bareProxyUrls } from "./config";

export class Prober {
    private config: Config;

    public wispUrl: string | null;
    public bareUrl: string | null;

    public constructor(config: Config) {
        this.config = config;
        this.wispUrl = null;
        this.bareUrl = null;
    }

    public async probeBare() {
        let proxyDetectPromises: Promise<string>[] = [];
        for (const proxy in bareProxyUrls) {
            let url = proxy;
            if (url == "auto") continue;
            if (url == "custom") url = this.config.bareCustomProxy;
            proxyDetectPromises.push(
                new Promise((res, rej) => {
                    setTimeout(() => {
                        rej("Failed to fetch bare on " + url);
                    }, this.config.probeTimeout);
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
            this.bareUrl = res;
        });
    }

    public async probeWisp() {
        let proxyDetectPromises: Promise<string>[] = [];
        for (const proxy in wispProxyUrls) {
            let url = proxy;
            if (url == "auto") continue;
            if (url == "custom") url = this.config.wispCustomProxy;
            proxyDetectPromises.push(
                new Promise((res, rej) => {
                    const socket = new WebSocket(url);
                    setTimeout(() => {
                        if (socket.readyState == WebSocket.OPEN) {
                            socket.close();
                            res(url);
                        } else {
                            socket.close();
                            rej("Failed to open websocket on " + url);
                        }
                    }, this.config.probeTimeout);
                    socket.onopen = () => {
                        socket.close();
                        res(url);
                    };
                }),
            );
        }
        await Promise.any(proxyDetectPromises).then((res) => {
            this.wispUrl = res;
        });
    }
}
