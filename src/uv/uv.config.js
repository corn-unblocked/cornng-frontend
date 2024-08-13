function initUvConfig() {
    let path;
    try {
        path = window.location.pathname + "/uv";
    } catch (_) {
        path = self.location.pathname;
    }
    let loc = path.substring(0, path.lastIndexOf("/"));

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
