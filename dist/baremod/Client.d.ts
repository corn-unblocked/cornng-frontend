import type { BareHeaders, BareWebSocketMeta } from "./BareTypes.js";
export declare const statusEmpty: number[];
export declare const statusRedirect: number[];
export interface BareErrorBody {
    code: string;
    id: string;
    message?: string;
    stack?: string;
}
export declare class BareError extends Error {
    status: number;
    body: BareErrorBody;
    constructor(status: number, body: BareErrorBody);
}
export type MetaCallback = (meta: BareWebSocketMeta) => void;
export type ReadyStateCallback = (readyState: number) => void;
export type WebSocketImpl = {
    new (...args: ConstructorParameters<typeof WebSocket>): WebSocket;
};
export type GetRequestHeadersCallback = () => Promise<BareHeaders>;
export declare abstract class Client {
    protected base: URL;
    /**
     *
     * @param version Version provided by extension
     * @param server Bare Server URL provided by BareClient
     */
    constructor(version: number, server: URL);
}
