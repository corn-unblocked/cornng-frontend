const stockSW = "/uv/sw.js";

/**
 * List of hostnames that are allowed to run serviceworkers on http://
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Global util
 * Used in 404.html and index.html
 */
async function registerSW() {
    if (!navigator.serviceWorker) {
        if (
            location.protocol !== "https:" &&
            !swAllowedHostnames.includes(location.hostname)
        )
            throw new Error("Service workers cannot be registered without https.");

        throw new Error("Your browser doesn't support service workers.");
    }

    await navigator.serviceWorker.register(stockSW);
}

const connection = new BareMux.BareMuxConnection("/baremux/worker.js")

startButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await registerSW();
    } catch (err) {
        // TODO - error handling that exists
        throw err;
    }

    const url = targetAddress.value;

    let frame = document.getElementById("proxyIframe");
    frame.style.display = "block";
    if (config.useBare && await connection.getTransport() !== "/baremod/index.mjs") {
        let bareUrl = new URL(serverAddress.value);
        await connection.setTransport("/baremod/index.mjs", [bareUrl.href]);
    } else if (await connection.getTransport() !== "/libcurl/index.mjs") {
        let wispUrl = new URL(serverAddress.value);
        // set to websocket protocol
        wispUrl.protocol = wispUrl.protocol === "http:" ? "ws:" : "wss:";
        await connection.setTransport("/libcurl/index.mjs", [{wisp: wispUrl.href}]);
    }
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});
