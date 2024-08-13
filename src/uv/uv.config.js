function initUvConfig() {
    let loc;
    // script needs to run both in sw and normal js
    try {
        let path = window.location.pathname;
        loc = path.substring(0, path.lastIndexOf("/")) + "/uv";
    } catch (_) {
        let path = self.location.pathname;
        loc = path.substring(0, path.lastIndexOf("/"));
    }

    self.__uv$config = {
        prefix: loc + "/service/",
        encodeUrl: Ultraviolet.codec.xor.encode,
        decodeUrl: Ultraviolet.codec.xor.decode,
        handler: loc + "/uv.handler.js",
        client: loc + "/uv.client.js",
        bundle: loc + "/uv.bundle.js",
        config: loc + "/uv.config.js",
        sw: loc + "/uv.sw.js",
        stockSW: loc + "/sw.js",
        loc: loc,
    };
}

initUvConfig();
