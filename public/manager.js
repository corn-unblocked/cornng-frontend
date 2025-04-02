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
var Config = class {
  // config version (incrementing forces a config rewrite)
  configVersion;
  // whether to use bare or wisp
  useBare;
  // these 4 are pretty self explanatory
  wispProxyIndex;
  wispCustomProxy;
  bareProxyIndex;
  bareCustomProxy;
  // auto detect proxy timeout (ms)
  probeTimeout;
  constructor() {
    this.configVersion = 1;
    this.useBare = false;
    this.wispProxyIndex = 0;
    this.wispCustomProxy = "";
    this.bareProxyIndex = 0;
    this.bareCustomProxy = "";
    this.probeTimeout = 5e3;
    this.loadConfig();
  }
  saveConfig() {
    localStorage.setItem("config", JSON.stringify(this));
  }
  loadConfig() {
    let str = localStorage.getItem("config");
    if (str == null) {
      this.saveConfig();
      return;
    }
    let tmp = JSON.parse(str);
    if (tmp.configVersion == void 0 || tmp.configVersion < this.configVersion) {
      this.saveConfig();
      return;
    }
    for (let a2 in tmp) {
      this[a2] = tmp[a2];
    }
  }
};

// src/util.ts
var Util = class {
  static httpToWs(url) {
    let urlObj = new URL(url);
    urlObj.protocol = urlObj.protocol === "http:" ? "ws:" : "wss:";
    return urlObj.toString();
  }
};

// src/prober.ts
var Prober = class {
  config;
  wispUrl;
  bareUrl;
  constructor(config) {
    this.config = config;
    this.wispUrl = null;
    this.bareUrl = null;
  }
  async probeBare() {
    let proxyDetectPromises = [];
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
                "Bare returned error code " + rsp.status + " on url " + url
              );
            }
          });
        })
      );
    }
    await Promise.any(proxyDetectPromises).then((res) => {
      this.bareUrl = res;
    });
  }
  async probeWisp() {
    let proxyDetectPromises = [];
    for (const proxy in wispProxyUrls) {
      let url = proxy;
      if (url == "auto") continue;
      if (url == "custom") url = this.config.wispCustomProxy;
      try {
        url = Util.httpToWs(url);
      } catch (_e) {
        continue;
      }
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
        })
      );
    }
    await Promise.any(proxyDetectPromises).then((res) => {
      this.wispUrl = res;
    });
  }
};

// node_modules/@mercuryworkshop/bare-mux/dist/index.mjs
var t = globalThis.fetch;
var r = globalThis.SharedWorker;
var a = globalThis.localStorage;
var s = globalThis.navigator.serviceWorker;
var o = MessagePort.prototype.postMessage;
var n = { prototype: { send: WebSocket.prototype.send }, CLOSED: WebSocket.CLOSED, CLOSING: WebSocket.CLOSING, CONNECTING: WebSocket.CONNECTING, OPEN: WebSocket.OPEN };
async function c() {
  const e = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).map(async (e2) => {
    const t3 = await function(e3) {
      let t4 = new MessageChannel();
      return new Promise((r2) => {
        e3.postMessage({ type: "getPort", port: t4.port2 }, [t4.port2]), t4.port1.onmessage = (e4) => {
          r2(e4.data);
        };
      });
    }(e2);
    return await i(t3), t3;
  }), t2 = Promise.race([Promise.any(e), new Promise((e2, t3) => setTimeout(t3, 1e3, new TypeError("timeout")))]);
  try {
    return await t2;
  } catch (e2) {
    if (e2 instanceof AggregateError) throw console.error("bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort."), new Error("All clients returned an invalid MessagePort.");
    return console.warn("bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying"), await c();
  }
}
function i(e) {
  const t2 = new MessageChannel(), r2 = new Promise((e2, r3) => {
    t2.port1.onmessage = (t3) => {
      "pong" === t3.data.type && e2();
    }, setTimeout(r3, 1500);
  });
  return o.call(e, { message: { type: "ping" }, port: t2.port2 }, [t2.port2]), r2;
}
function l(e, t2) {
  const a2 = new r(e, "bare-mux-worker");
  return t2 && s.addEventListener("message", (t3) => {
    if ("getPort" === t3.data.type && t3.data.port) {
      console.debug("bare-mux: recieved request for port from sw");
      const a3 = new r(e, "bare-mux-worker");
      o.call(t3.data.port, a3.port, [a3.port]);
    }
  }), a2.port;
}
var h = null;
function d() {
  if (null === h) {
    const e = new MessageChannel(), t2 = new ReadableStream();
    let r2;
    try {
      o.call(e.port1, t2, [t2]), r2 = true;
    } catch (e2) {
      r2 = false;
    }
    return h = r2, r2;
  }
  return h;
}
var p = class {
  constructor(e) {
    this.channel = new BroadcastChannel("bare-mux"), e instanceof MessagePort || e instanceof Promise ? this.port = e : this.createChannel(e, true);
  }
  createChannel(e, t2) {
    if (self.clients) this.port = c(), this.channel.onmessage = (e2) => {
      "refreshPort" === e2.data.type && (this.port = c());
    };
    else if (e && SharedWorker) {
      if (!e.startsWith("/") && !e.includes("://")) throw new Error("Invalid URL. Must be absolute or start at the root.");
      this.port = l(e, t2), console.debug("bare-mux: setting localStorage bare-mux-path to", e), a["bare-mux-path"] = e;
    } else {
      if (!SharedWorker) throw new Error("Unable to get a channel to the SharedWorker.");
      {
        const e2 = a["bare-mux-path"];
        if (console.debug("bare-mux: got localStorage bare-mux-path:", e2), !e2) throw new Error("Unable to get bare-mux workerPath from localStorage.");
        this.port = l(e2, t2);
      }
    }
  }
  async sendMessage(e, t2) {
    this.port instanceof Promise && (this.port = await this.port);
    try {
      await i(this.port);
    } catch {
      return console.warn("bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead."), this.createChannel(), await this.sendMessage(e, t2);
    }
    const r2 = new MessageChannel(), a2 = [r2.port2, ...t2 || []], s2 = new Promise((e2, t3) => {
      r2.port1.onmessage = (r3) => {
        const a3 = r3.data;
        "error" === a3.type ? t3(a3.error) : e2(a3);
      };
    });
    return o.call(this.port, { message: e, port: r2.port2 }, a2), await s2;
  }
};
function u(e, t2, r2) {
  console.error(`error while processing '${r2}': `, t2), e.postMessage({ type: "error", error: t2 });
}
var m = class {
  constructor(e) {
    this.worker = new p(e);
  }
  async getTransport() {
    return (await this.worker.sendMessage({ type: "get" })).name;
  }
  async setTransport(e, t2, r2) {
    await this.setManualTransport(`
			const { default: BareTransport } = await import("${e}");
			return [BareTransport, "${e}"];
		`, t2, r2);
  }
  async setManualTransport(e, t2, r2) {
    if ("bare-mux-remote" === e) throw new Error("Use setRemoteTransport.");
    await this.worker.sendMessage({ type: "set", client: { function: e, args: t2 } }, r2);
  }
  async setRemoteTransport(e, t2) {
    const r2 = new MessageChannel();
    r2.port1.onmessage = async (t3) => {
      const r3 = t3.data.port, a2 = t3.data.message;
      if ("fetch" === a2.type) try {
        e.ready || await e.init(), await async function(e2, t4, r4) {
          const a3 = await r4.request(new URL(e2.fetch.remote), e2.fetch.method, e2.fetch.body, e2.fetch.headers, null);
          if (!d() && a3.body instanceof ReadableStream) {
            const e3 = new Response(a3.body);
            a3.body = await e3.arrayBuffer();
          }
          a3.body instanceof ReadableStream || a3.body instanceof ArrayBuffer ? o.call(t4, { type: "fetch", fetch: a3 }, [a3.body]) : o.call(t4, { type: "fetch", fetch: a3 });
        }(a2, r3, e);
      } catch (e2) {
        u(r3, e2, "fetch");
      }
      else if ("websocket" === a2.type) try {
        e.ready || await e.init(), await async function(e2, t4, r4) {
          const [a3, s2] = r4.connect(new URL(e2.websocket.url), e2.websocket.protocols, e2.websocket.requestHeaders, (t5) => {
            o.call(e2.websocket.channel, { type: "open", args: [t5] });
          }, (t5) => {
            t5 instanceof ArrayBuffer ? o.call(e2.websocket.channel, { type: "message", args: [t5] }, [t5]) : o.call(e2.websocket.channel, { type: "message", args: [t5] });
          }, (t5, r5) => {
            o.call(e2.websocket.channel, { type: "close", args: [t5, r5] });
          }, (t5) => {
            o.call(e2.websocket.channel, { type: "error", args: [t5] });
          });
          e2.websocket.channel.onmessage = (e3) => {
            "data" === e3.data.type ? a3(e3.data.data) : "close" === e3.data.type && s2(e3.data.closeCode, e3.data.closeReason);
          }, o.call(t4, { type: "websocket" });
        }(a2, r3, e);
      } catch (e2) {
        u(r3, e2, "websocket");
      }
    }, await this.worker.sendMessage({ type: "set", client: { function: "bare-mux-remote", args: [r2.port2, t2] } }, [r2.port2]);
  }
  getInnerPort() {
    return this.worker.port;
  }
};
console.debug("bare-mux: running v2.1.7 (build c56d286)");

// src/proxy.ts
var ProxyHistory = class {
  urls;
  index;
  constructor() {
    this.urls = [];
    this.index = 0;
  }
  back() {
    this.index -= 1;
    return this.urls[this.index];
  }
  forward() {
    if (this.index < this.urls.length - 1) this.index += 1;
    return this.urls[this.index];
  }
  add(url) {
    if (url == this.urls[this.index]) return;
    if (this.index < this.urls.length - 1) {
      this.urls.splice(this.index + 1);
    }
    this.urls.push(url);
    this.index += 1;
  }
};
var ProxyManager = class {
  swAllowedHostnames = ["localhost", "127.0.0.1"];
  config;
  uvConfig;
  connection;
  history;
  proxyUrl;
  constructor(config, uvConfig) {
    this.config = config;
    this.uvConfig = uvConfig;
    this.connection = new m(
      this.uvConfig.loc + "/baremux/worker.js"
    );
    this.history = new ProxyHistory();
    this.proxyUrl = "";
  }
  async registerSW() {
    if (!navigator.serviceWorker) {
      if (location.protocol !== "https:" && !this.swAllowedHostnames.includes(location.hostname))
        throw new Error(
          "Service workers cannot be registered without https."
        );
      throw new Error("Your browser doesn't support service workers.");
    }
    if ((await navigator.serviceWorker.getRegistrations()).some(
      (x) => x.active !== null && x.active.scriptURL == this.uvConfig.stockSW
    ))
      return;
    await navigator.serviceWorker.register(this.uvConfig.stockSW);
  }
  async startProxy(url) {
    await this.registerSW();
    const loc = this.uvConfig.loc;
    if (this.config.useBare) {
      await this.connection.setTransport(loc + "/baremod/index.mjs", [
        this.proxyUrl
      ]);
    } else {
      await this.connection.setTransport(loc + "/libcurl/index.mjs", [
        { wisp: Util.httpToWs(this.proxyUrl) }
      ]);
    }
    this.setProxy(url);
  }
  setProxy(url) {
    let frame = document.getElementById("proxyIframe");
    frame.style.display = "block";
    frame.src = this.encodeUrl(url);
  }
  decodeUrl(url) {
    url = url.slice(this.uvConfig.prefix.length);
    return this.uvConfig.decodeUrl(url);
  }
  encodeUrl(url) {
    if (!url.includes(".")) {
      url = "https://google.com/search?q=" + url;
    } else if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = "https://" + url;
    }
    return this.uvConfig.prefix + this.uvConfig.encodeUrl(url);
  }
};

// src/manager.ts
var Manager = class {
  config;
  prober;
  proxy;
  constructor(uvConfig) {
    this.config = new Config();
    this.prober = new Prober(this.config);
    this.proxy = new ProxyManager(this.config, uvConfig);
  }
};
export {
  Manager
};
