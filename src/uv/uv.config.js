let __cornng$loc = self.location.pathname.includes("/uv/")
    ? self.location.pathname.substring(0, self.location.pathname.indexOf("/uv/")-1)
    : self.location.pathname.substring(0, self.location.pathname.lastIndexOf("/"));

self.__uv$config = {
    prefix: __cornng$loc + "/uv/service/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: __cornng$loc + "/uv/uv.handler.js",
    client: __cornng$loc + "/uv/uv.client.js",
    bundle: __cornng$loc + "/uv/uv.bundle.js",
    config: __cornng$loc + "/uv/uv.config.js",
    sw: __cornng$loc + "/uv/uv.sw.js",
    stockSW: __cornng$loc + "/uv/sw.js",
    loc: __cornng$loc,
};
