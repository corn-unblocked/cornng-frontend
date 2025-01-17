import { bareProxyUrls, Config, wispProxyUrls } from "./config";
import { Manager } from "./manager";
import { Navbar } from "./navbar";
import { Prober } from "./prober";
import { ProxyManager } from "./proxy";

export class IndexPage {
    private config: Config;
    private prober: Prober;
    private proxy: ProxyManager;
    private navbar: Navbar;

    public proxyUrlSelector: HTMLSelectElement;
    public proxyTypeSelector: HTMLSelectElement;
    public serverAddress: HTMLInputElement;
    public targetAddress: HTMLInputElement;
    public startButton: HTMLButtonElement;

    public constructor(manager: Manager) {
        this.config = manager.config;
        this.prober = manager.prober;
        this.proxy = manager.proxy;
        this.navbar = new Navbar(manager);

        this.proxyUrlSelector = document.getElementById(
            "proxyUrl",
        ) as HTMLSelectElement;
        this.proxyTypeSelector = document.getElementById(
            "proxyType",
        ) as HTMLSelectElement;
        this.serverAddress = document.getElementById(
            "serverAddress",
        ) as HTMLInputElement;
        this.targetAddress = document.getElementById(
            "targetAddress",
        ) as HTMLInputElement;
        this.startButton = document.getElementById(
            "startButton",
        ) as HTMLButtonElement;

        this.proxyUrlSelector.addEventListener(
            "change",
            this.updateServerAddress.bind(this),
        );
        this.proxyTypeSelector.addEventListener(
            "change",
            this.updateProxyType.bind(this),
        );
        this.serverAddress.addEventListener(
            "change",
            this.updateCustomProxy.bind(this),
        );

        this.proxyTypeSelector.selectedIndex = this.config.useBare ? 1 : 0;
        this.updateProxyType();

        this.targetAddress.value =
            new URLSearchParams(document.location.search).get("url") ??
            "https://google.com";

        this.startButton.addEventListener(
            "click",
            (async (event) => {
                await this.proxy.startProxy(this.targetAddress.value);
                this.navbar.closeNavbar();
            }).bind(this),
        );

        this.targetAddress.addEventListener(
            "keypress",
            (async (event) => {
                if (event.key !== "Enter") return;
                await this.proxy.startProxy(this.targetAddress.value);
                this.navbar.closeNavbar();
            }).bind(this),
        );
    }

    public updateServerAddress() {
        if (this.proxyUrlSelector.value === "custom") {
            this.proxy.proxyUrl = this.config.useBare
                ? this.config.bareCustomProxy
                : this.config.wispCustomProxy;
            this.serverAddress.disabled = false;
        } else if (this.proxyUrlSelector.value === "auto") {
            this.serverAddress.disabled = true;
            if (this.config.useBare) {
                if (this.prober.bareUrl == null) {
                    this.prober.probeBare().then(() => {
                        let url = this.prober.bareUrl ?? "";
                        this.proxy.proxyUrl = url;
                        this.serverAddress.value = url;
                    });
                } else {
                    let url = this.prober.bareUrl ?? "";
                    this.proxy.proxyUrl = url;
                    this.serverAddress.value = url;
                }
            } else {
                if (this.prober.wispUrl == null) {
                    this.prober.probeWisp().then(() => {
                        let url = this.prober.wispUrl ?? "";
                        this.proxy.proxyUrl = url;
                        this.serverAddress.value = url;
                    });
                } else {
                    let url = this.prober.wispUrl ?? "";
                    this.proxy.proxyUrl = url;
                    this.serverAddress.value = url;
                }
            }
        } else {
            this.proxy.proxyUrl = this.proxyUrlSelector.value;
            this.serverAddress.disabled = true;
        }
        if (this.config.useBare) {
            this.config.bareProxyIndex = this.proxyUrlSelector.selectedIndex;
        } else {
            this.config.wispProxyIndex = this.proxyUrlSelector.selectedIndex;
        }
        this.serverAddress.value = this.proxy.proxyUrl;
        this.config.saveConfig();
    }

    public generateSelectableUrls() {
        while (this.proxyUrlSelector.hasChildNodes())
            this.proxyUrlSelector.removeChild(
                this.proxyUrlSelector.firstChild!,
            );
        let proxyUrls = this.config.useBare ? bareProxyUrls : wispProxyUrls;
        for (let proxy in proxyUrls) {
            let option = document.createElement("option");
            option.innerHTML = proxyUrls[proxy];
            option.value = proxy;
            this.proxyUrlSelector.appendChild(option);
        }
    }

    public updateCustomProxy() {
        if (this.config.useBare) {
            this.config.bareCustomProxy = this.serverAddress.value;
        } else {
            this.config.wispCustomProxy = this.serverAddress.value;
        }
        this.config.saveConfig();
    }

    public updateProxyType() {
        this.config.useBare = this.proxyTypeSelector.selectedIndex == 1;
        this.generateSelectableUrls();
        this.proxyUrlSelector.selectedIndex = this.config.useBare
            ? this.config.bareProxyIndex
            : this.config.wispProxyIndex;
        this.updateServerAddress();
        this.config.saveConfig();
    }
}