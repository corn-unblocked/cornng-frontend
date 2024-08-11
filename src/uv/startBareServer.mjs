let BareMux = await import ("/baremux/index.js");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js")

async function startBareServer() {
    const url = targetAddress.value;
    const config = JSON.parse(window.localStorage.getItem("config"));
    const serverAddress = window.localStorage.getItem("serverAddress");

    if (config.useBare && await connection.getTransport() !== "/baremod/index.mjs") {
        let bareUrl = new URL(serverAddress);
        await connection.setTransport("/baremod/index.mjs", [bareUrl.href]);
    } else if (await connection.getTransport() !== "/libcurl/index.mjs") {
        let wispUrl = new URL(serverAddress);
        // set to websocket protocol
        wispUrl.protocol = wispUrl.protocol === "http:" ? "ws:" : "wss:";
        await connection.setTransport("/libcurl/index.mjs", [{wisp: wispUrl.href}]);
    }
}

await startBareServer();
