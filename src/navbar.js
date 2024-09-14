/**
 * @type {HTMLButtonElement}
 */
const backButton = document.getElementById("backProxy");
/**
 * @type {HTMLButtonElement}
 */
const forwardButton = document.getElementById("forwardProxy");
/**
 * @type {HTMLButtonElement}
 */
const reloadButton = document.getElementById("reloadProxy");
/**
 * @type {HTMLButtonElement}
 */
const exitProxy = document.getElementById("exitProxy");
/**
 * @type {HTMLButtonElement}
 */
const openNavbar = document.getElementById("openNavbar");
/**
 * @type {HTMLButtonElement}
 */
const closeNavbar = document.getElementById("closeNavbar");
/**
 * @type {HTMLDivElement}
 */
const navbar = document.getElementById("navbar");
/**
 * @type {HTMLInputElement}
 */
const urlBar = document.getElementById("urlBar");
/**
 * @type {HTMLIFrameElement}
 */
const proxyIframe = document.getElementById("proxyIframe");

// cant use iframe history because it degrades two iframes deep
const proxyHistory = {
    urls: [],
    index: 0,
    back: function () {
        this.index -= 1;
        return this.urls[this.index];
    },
    forward: function () {
        if (this.index < this.urls.length - 1) this.index += 1;
        return this.urls[this.index];
    },
    add: function (url) {
        // prevent readding duplicate urls when reloading page
        if (url == this.urls[this.index]) return;
        // delete "future" history if index is set to past
        if (this.index < this.urls.length - 1) {
            this.urls.splice(this.index + 1);
        }
        this.urls.push(url);
        this.index += 1;
    },
};

backButton.addEventListener("click", () => {
    proxyIframe.src = encodeUrl(proxyHistory.back());
});
forwardButton.addEventListener("click", () => {
    proxyIframe.src = encodeUrl(proxyHistory.forward());
});

reloadButton.addEventListener("click", () =>
    proxyIframe.contentWindow.location.reload(),
);

openNavbar.addEventListener("click", () => {
    navbar.style.display = "flex";
    openNavbar.style.display = "none";
});

closeNavbar.addEventListener("click", () => {
    navbar.style.display = "none";
    openNavbar.style.display = "block";
});

function decodeUrl(url) {
    let config = __uv$config;
    url = url.slice(config.prefix.length);
    return config.decodeUrl(url);
}

function encodeUrl(url) {
    let config = __uv$config;
    // if period, assume valid url. should work 90% of the time
    if (!url.includes(".")) {
        url = "https://google.com/search?q=" + url;
    } else if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "https://" + url;
    }
    return config.prefix + config.encodeUrl(url);
}

proxyIframe.addEventListener("load", () => {
    let url = decodeUrl(proxyIframe.contentWindow.location.pathname);
    urlBar.value = url;
    proxyHistory.add(url);
});

urlBar.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") return;
    proxyIframe.src = encodeUrl(urlBar.value);
});

exitProxy.addEventListener("click", () => {
    proxyIframe.src = "";
    proxyIframe.style.display = "none";
    navbar.style.display = "none";
    openNavbar.style.display = "none";
});
