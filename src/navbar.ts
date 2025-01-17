import { Config } from "./config";
import { Manager } from "./manager";
import { ProxyManager } from "./proxy";

export class Navbar {
    private config: Config;
    private proxy: ProxyManager;

    public backButton: HTMLButtonElement;
    public forwardButton: HTMLButtonElement;
    public reloadButton: HTMLButtonElement;
    public exitProxy: HTMLButtonElement;
    public openNavbarBtn: HTMLButtonElement;
    public closeNavbarBtn: HTMLButtonElement;
    public navbar: HTMLDivElement;
    public urlBar: HTMLInputElement;
    public proxyIframe: HTMLIFrameElement;

    public constructor(manager: Manager) {
        this.proxy = manager.proxy;
        this.config = manager.config;

        this.backButton = document.getElementById(
            "backProxy",
        ) as HTMLButtonElement;
        this.forwardButton = document.getElementById(
            "forwardProxy",
        ) as HTMLButtonElement;
        this.reloadButton = document.getElementById(
            "reloadProxy",
        ) as HTMLButtonElement;
        this.exitProxy = document.getElementById(
            "exitProxy",
        ) as HTMLButtonElement;
        this.openNavbarBtn = document.getElementById(
            "openNavbar",
        ) as HTMLButtonElement;
        this.closeNavbarBtn = document.getElementById(
            "closeNavbar",
        ) as HTMLButtonElement;
        this.navbar = document.getElementById("navbar") as HTMLDivElement;
        this.urlBar = document.getElementById("urlBar") as HTMLInputElement;
        this.proxyIframe = document.getElementById(
            "proxyIframe",
        ) as HTMLIFrameElement;

        this.backButton.addEventListener(
            "click",
            (() => {
                this.proxy.setProxy(this.proxy.history.back());
            }).bind(this),
        );

        this.proxyIframe.addEventListener(
            "load",
            (() => {
                let url = this.proxy.decodeUrl(
                    this.proxyIframe.contentWindow!.location.pathname,
                );
                this.urlBar.value = url;
                this.proxy.history.add(url);
            }).bind(this),
        );

        this.forwardButton.addEventListener(
            "click",
            (() => {
                this.proxyIframe.src = this.proxy.encodeUrl(
                    this.proxy.history.forward(),
                );
            }).bind(this),
        );

        this.reloadButton.addEventListener(
            "click",
            (() => this.proxyIframe.contentWindow!.location.reload()).bind(
                this,
            ),
        );

        this.openNavbarBtn.addEventListener(
            "click",
            this.openNavbar.bind(this),
        );

        this.closeNavbarBtn.addEventListener(
            "click",
            this.closeNavbar.bind(this),
        );

        this.urlBar.addEventListener(
            "keypress",
            ((event) => {
                if (event.key !== "Enter") return;
                this.proxy.setProxy(this.urlBar.value);
            }).bind(this),
        );

        this.exitProxy.addEventListener(
            "click",
            (() => {
                this.proxyIframe.src = "";
                this.proxyIframe.style.display = "none";
                this.hideNavbar();
            }).bind(this),
        );

        this.hideNavbar();
    }

    public hideNavbar() {
        this.navbar.style.display = "none";
        this.openNavbarBtn.style.display = "none";
    }

    public openNavbar() {
        this.navbar.style.display = "flex";
        this.openNavbarBtn.style.display = "none";
    }

    public closeNavbar() {
        this.navbar.style.display = "none";
        this.openNavbarBtn.style.display = "block";
    }
}
