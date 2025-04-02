// src/config.ts
var bareProxyUrls = {
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
  "https://lichology.com/bare/": "Definitely Science 4",
  "https://kazwire.com/bare/": "Kazwire"
};
var wispProxyUrls = {
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
  "wss://lichology.com/wisp/": "Definitely Science 4",
  "wss://anura.pro/": "Anura 1",
  "wss://adoptmy.baby/": "Anura 2",
  "wss://wallstjournal.click/": "Anura 3",
  "wss://avoidingice.xyz/": "Anura 4",
  "wss://maamplease.in/": "Anura 5",
  "wss://phantom.lol/wisp/": "Phantom",
  "wss://wisp.mercurywork.shop/": "Mercury"
};

// src/navbar.ts
var Navbar = class {
  config;
  proxy;
  backButton;
  forwardButton;
  reloadButton;
  exitProxy;
  openNavbarBtn;
  closeNavbarBtn;
  navbar;
  urlBar;
  proxyIframe;
  constructor(manager) {
    this.proxy = manager.proxy;
    this.config = manager.config;
    this.backButton = document.getElementById(
      "backProxy"
    );
    this.forwardButton = document.getElementById(
      "forwardProxy"
    );
    this.reloadButton = document.getElementById(
      "reloadProxy"
    );
    this.exitProxy = document.getElementById(
      "exitProxy"
    );
    this.openNavbarBtn = document.getElementById(
      "openNavbar"
    );
    this.closeNavbarBtn = document.getElementById(
      "closeNavbar"
    );
    this.navbar = document.getElementById("navbar");
    this.urlBar = document.getElementById("urlBar");
    this.proxyIframe = document.getElementById(
      "proxyIframe"
    );
    this.backButton.addEventListener(
      "click",
      (() => {
        this.proxy.setProxy(this.proxy.history.back());
      }).bind(this)
    );
    this.proxyIframe.addEventListener(
      "load",
      (() => {
        let url = this.proxy.decodeUrl(
          this.proxyIframe.contentWindow.location.pathname
        );
        this.urlBar.value = url;
        this.proxy.history.add(url);
      }).bind(this)
    );
    this.forwardButton.addEventListener(
      "click",
      (() => {
        this.proxyIframe.src = this.proxy.encodeUrl(
          this.proxy.history.forward()
        );
      }).bind(this)
    );
    this.reloadButton.addEventListener(
      "click",
      (() => this.proxyIframe.contentWindow.location.reload()).bind(
        this
      )
    );
    this.openNavbarBtn.addEventListener(
      "click",
      this.openNavbar.bind(this)
    );
    this.closeNavbarBtn.addEventListener(
      "click",
      this.closeNavbar.bind(this)
    );
    this.urlBar.addEventListener(
      "keypress",
      ((event) => {
        if (event.key !== "Enter") return;
        this.proxy.setProxy(this.urlBar.value);
      }).bind(this)
    );
    this.exitProxy.addEventListener(
      "click",
      (() => {
        this.proxyIframe.src = "";
        this.proxyIframe.style.display = "none";
        this.hideNavbar();
      }).bind(this)
    );
    this.hideNavbar();
  }
  hideNavbar() {
    this.navbar.style.display = "none";
    this.openNavbarBtn.style.display = "none";
  }
  openNavbar() {
    this.navbar.style.display = "flex";
    this.openNavbarBtn.style.display = "none";
  }
  closeNavbar() {
    this.navbar.style.display = "none";
    this.openNavbarBtn.style.display = "block";
  }
};

// src/index.ts
var IndexPage = class {
  config;
  prober;
  proxy;
  navbar;
  proxyUrlSelector;
  proxyTypeSelector;
  serverAddress;
  targetAddress;
  startButton;
  constructor(manager) {
    this.config = manager.config;
    this.prober = manager.prober;
    this.proxy = manager.proxy;
    this.navbar = new Navbar(manager);
    this.proxyUrlSelector = document.getElementById(
      "proxyUrl"
    );
    this.proxyTypeSelector = document.getElementById(
      "proxyType"
    );
    this.serverAddress = document.getElementById(
      "serverAddress"
    );
    this.targetAddress = document.getElementById(
      "targetAddress"
    );
    this.startButton = document.getElementById(
      "startButton"
    );
    this.proxyUrlSelector.addEventListener(
      "change",
      this.updateServerAddress.bind(this)
    );
    this.proxyTypeSelector.addEventListener(
      "change",
      this.updateProxyType.bind(this)
    );
    this.serverAddress.addEventListener(
      "change",
      this.updateCustomProxy.bind(this)
    );
    this.proxyTypeSelector.selectedIndex = this.config.useBare ? 1 : 0;
    this.updateProxyType();
    this.targetAddress.value = new URLSearchParams(document.location.search).get("url") ?? "https://google.com";
    this.startButton.addEventListener(
      "click",
      (async (event) => {
        try {
          await this.proxy.startProxy(this.targetAddress.value);
        } catch (_e) {
          return;
        }
        this.navbar.closeNavbar();
      }).bind(this)
    );
    this.targetAddress.addEventListener(
      "keypress",
      (async (event) => {
        if (event.key !== "Enter") return;
        await this.proxy.startProxy(this.targetAddress.value);
        this.navbar.closeNavbar();
      }).bind(this)
    );
    this.prober.probeBare().then(() => {
      if (this.proxyUrlSelector.value != "auto" || !this.config.useBare)
        return;
      this.setProxyUrl(this.prober.bareUrl ?? "");
    });
    this.prober.probeWisp().then(() => {
      if (this.proxyUrlSelector.value != "auto" || this.config.useBare)
        return;
      this.setProxyUrl(this.prober.wispUrl ?? "");
    });
  }
  setProxyUrl(url) {
    this.proxy.proxyUrl = url;
    this.serverAddress.value = url;
  }
  updateServerAddress() {
    if (this.proxyUrlSelector.value === "custom") {
      this.serverAddress.disabled = false;
      let url = this.config.useBare ? this.config.bareCustomProxy : this.config.wispCustomProxy;
      this.setProxyUrl(url);
    } else if (this.proxyUrlSelector.value === "auto") {
      this.serverAddress.disabled = true;
      let url = (this.config.useBare ? this.prober.bareUrl : this.prober.wispUrl) ?? "";
      this.setProxyUrl(url);
    } else {
      this.serverAddress.disabled = true;
      this.setProxyUrl(this.proxyUrlSelector.value);
    }
    if (this.config.useBare) {
      this.config.bareProxyIndex = this.proxyUrlSelector.selectedIndex;
    } else {
      this.config.wispProxyIndex = this.proxyUrlSelector.selectedIndex;
    }
    this.config.saveConfig();
  }
  generateSelectableUrls() {
    while (this.proxyUrlSelector.hasChildNodes())
      this.proxyUrlSelector.removeChild(
        this.proxyUrlSelector.firstChild
      );
    let proxyUrls = this.config.useBare ? bareProxyUrls : wispProxyUrls;
    for (let proxy in proxyUrls) {
      let option = document.createElement("option");
      option.innerHTML = proxyUrls[proxy];
      option.value = proxy;
      this.proxyUrlSelector.appendChild(option);
    }
  }
  updateCustomProxy() {
    this.proxy.proxyUrl = this.serverAddress.value;
    if (this.config.useBare) {
      this.config.bareCustomProxy = this.serverAddress.value;
    } else {
      this.config.wispCustomProxy = this.serverAddress.value;
    }
    this.config.saveConfig();
  }
  updateProxyType() {
    this.config.useBare = this.proxyTypeSelector.selectedIndex == 1;
    this.generateSelectableUrls();
    this.proxyUrlSelector.selectedIndex = this.config.useBare ? this.config.bareProxyIndex : this.config.wispProxyIndex;
    this.updateServerAddress();
    this.config.saveConfig();
  }
};
export {
  IndexPage
};
