function initUvConfig() {
    let loc;
    // script needs to run both in sw and normal js
    try {
        let path = window.location.pathname;
        loc = path.substring(0, path.lastIndexOf("/"));
    } catch (_) {
        let path = self.location.pathname;
        // this also includes /uv/ ending so cut that off as well
        loc = path.substring(0, path.lastIndexOf("/", path.lastIndexOf("/")-1));
    }

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
