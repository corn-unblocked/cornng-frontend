function initUvConfig() {
    let path = location.pathname;
    try {
        path = window.location.pathname;
    } catch (_) {
        path = self.location.pathname;
    }
    let loc = path.substring(0, path.lastIndexOf("/"));

    self.__uv$config = {
        prefix: loc + "/uv/service/",
        encodeUrl: Ultraviolet.codec.xor.encode,
        decodeUrl: Ultraviolet.codec.xor.decode,
        handler: loc + "/uv/uv.handler.js",
        client: loc + "/uv/uv.client.js",
        bundle: loc + "/uv/uv.bundle.js",
        config: loc + "/uv/uv.config.js",
        sw: loc + "/uv/uv.sw.js",
        stockSW: loc + "/uv/sw.js",
        loc: loc,
    };
}

initUvConfig();
