import type { BareHeaders, BareMethod } from "./BareTypes.js";
import { Client } from "./Client.js";
import type { BareTransport, TransferrableResponse } from "@mercuryworkshop/bare-mux";
export default class ClientV3 extends Client implements BareTransport {
    ws: URL;
    http: URL;
    meta(): {};
    constructor(server: URL);
    ready: boolean;
    init(): Promise<void>;
    connect(url: URL, protocols: string[], requestHeaders: BareHeaders, onopen: (protocol: string) => void, onmessage: (data: Blob | ArrayBuffer | string) => void, onclose: (code: number, reason: string) => void, onerror: (error: string) => void): [(data: Blob | ArrayBuffer | string) => void, (code: number, reason: string) => void];
    request(remote: URL, method: BareMethod, body: BodyInit | null, headers: BareHeaders, signal: AbortSignal | undefined): Promise<TransferrableResponse>;
    private readBareResponse;
    createBareHeaders(remote: URL, bareHeaders: BareHeaders, forwardHeaders?: string[], passHeaders?: string[], passStatus?: number[]): Headers;
}
