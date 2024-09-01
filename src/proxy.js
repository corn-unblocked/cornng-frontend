/**
 * List of hostnames that are allowed to run serviceworkers on http://
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];
let swRegistered = false;

/**
 * Global util
 * Used in 404.html and index.html
 */
async function registerSW() {
    if (swRegistered) return;
    if (!navigator.serviceWorker) {
        if (
            location.protocol !== "https:" &&
            !swAllowedHostnames.includes(location.hostname)
        )
            throw new Error(
                "Service workers cannot be registered without https.",
            );

        throw new Error("Your browser doesn't support service workers.");
    }

    swRegistered = true;
    await navigator.serviceWorker.register(__uv$config.stockSW);
}

const connection = new BareMux.BareMuxConnection(
    __uv$config.loc + "/baremux/worker.js",
);

async function startProxy() {
    try {
        await registerSW();
    } catch (err) {
        // TODO - error handling that exists
        throw err;
    }

    let url = targetAddress.value;
    const loc = __uv$config.loc;

    let frame = document.getElementById("proxyIframe");
    frame.style.display = "block";
    if (config.useBare) {
        let bareUrl = new URL(serverAddress.value);
        await connection.setTransport(loc + "/baremod/index.mjs", [
            bareUrl.href,
        ]);
    } else {
        let wispUrl = new URL(serverAddress.value);
        // set to websocket protocol
        wispUrl.protocol = wispUrl.protocol === "http:" ? "ws:" : "wss:";
        await connection.setTransport(loc + "/libcurl/index.mjs", [
            { wisp: wispUrl.href },
        ]);
    }
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "https://" + url;
    }
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    document.getElementById("openNavbar").style.display = "block";
}

startButton.addEventListener("click", async (event) => {
    await startProxy();
});

targetAddress.addEventListener("keypress", async (event) => {
    if (event.key !== "Enter") return;
    await startProxy();
});
