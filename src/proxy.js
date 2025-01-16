/**
 * List of hostnames that are allowed to run serviceworkers on http://
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];
let connection;

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
            throw new Error(
                "Service workers cannot be registered without https.",
            );

        throw new Error("Your browser doesn't support service workers.");
    }
    // unregister all previous workers when reregistering
    navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    await navigator.serviceWorker.register(__uv$config.stockSW);
    connection = new BareMux.BareMuxConnection(__uv$config.loc + "/baremux/worker.js");
}

async function startProxy() {
    try {
        await registerSW();
    } catch (err) {
        // TODO - error handling that exists
        return;
    }

    let proxyUrlObj;
    try {
        proxyUrlObj = new URL(proxyUrl);
    } catch (err) {
        return;
    }

    let url = targetAddress.value;
    const loc = __uv$config.loc;

    let frame = document.getElementById("proxyIframe");
    frame.style.display = "block";
    if (config.useBare) {
        await connection.setTransport(loc + "/baremod/index.mjs", [
            proxyUrlObj.href,
        ]);
    } else {
        // set to websocket protocol
        proxyUrlObj.protocol = proxyUrlObj.protocol === "http:" ? "ws:" : "wss:";
        await connection.setTransport(loc + "/libcurl/index.mjs", [
            { wisp: proxyUrlObj.href },
        ]);
    }
    frame.src = encodeUrl(url);
    document.getElementById("openNavbar").style.display = "block";
}

startButton.addEventListener("click", async (event) => {
    await startProxy();
});

targetAddress.addEventListener("keypress", async (event) => {
    if (event.key !== "Enter") return;
    await startProxy();
});
