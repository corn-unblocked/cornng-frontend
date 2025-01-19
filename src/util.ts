export default class Util {
    public static httpToWs(url: string): string {
        let urlObj = new URL(url);
        urlObj.protocol = urlObj.protocol === "http:" ? "ws:" : "wss:";
        return urlObj.toString();
    }
}
