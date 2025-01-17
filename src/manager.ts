import { Config } from "./config";
import { Prober } from "./prober";
import { ProxyManager, UvConfig } from "./proxy";

export class Manager {
    public config: Config;
    public prober: Prober;
    public proxy: ProxyManager;

    public constructor(uvConfig: UvConfig) {
        this.config = new Config();
        this.prober = new Prober(this.config);
        this.proxy = new ProxyManager(this.config, uvConfig);
    }
}
