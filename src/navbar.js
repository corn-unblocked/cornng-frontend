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

backButton.addEventListener("click", () =>
    proxyIframe.contentWindow.history.back(),
);
forwardButton.addEventListener("click", () =>
    proxyIframe.contentWindow.history.forward(),
);

reloadButton.addEventListener("click", () =>
    proxyIframe.contentWindow.location.reload(),
);

openNavbar.addEventListener("click", () => {
    navbar.style.display = "flex";
    openNavbar.style.display = "none";
    iframeUrlUpdate();
});

closeNavbar.addEventListener("click", () => {
    navbar.style.display = "none";
    openNavbar.style.display = "block";
});

function iframeUrlUpdate() {
    let url = proxyIframe.contentWindow.location.pathname;
    let config = __uv$config;
    url = url.slice(config.prefix.length);
    urlBar.value = config.decodeUrl(url);
}

proxyIframe.addEventListener("load", iframeUrlUpdate);

urlBar.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") return;
    let config = __uv$config;
    let url = urlBar.value;
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "https://" + url;
    }
    proxyIframe.src = config.prefix + config.encodeUrl(url);
});

exitProxy.addEventListener("click", () => {
    proxyIframe.src = "";
    proxyIframe.style.display = "none";
    navbar.style.display = "none";
    openNavbar.style.display = "none";
});
