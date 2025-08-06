<script lang="ts">
    import Config from "./Config.svelte";
    import Proxy from "./Proxy.svelte";
    import config from "./config.svelte";
    import proxyManager from "./proxy.svelte";
    import { onEnterKeyPressed } from "./util";
    import autoProxyProber from "./prober.svelte";

    $effect(() => {
        if (config.useBare && config.bareSelectedProxy === "auto") {
            autoProxyProber.probeBare();
        } else if (config.wispSelectedProxy === "auto") {
            autoProxyProber.probeWisp();
        }
    });

    $effect(() => {
        proxyManager.setProxyServer(proxyManager.proxyUrl);
    });

    let destinationInput = $state("");

    let isConfigOpen = $state(false);

    function startProxy() {
        if (proxyManager.startProxy(destinationInput)) {
            destinationInput = "";
        }
    }
</script>

{#if proxyManager.isProxyOpen}
    <Proxy></Proxy>
{:else}
    <Config bind:isConfigOpen></Config>
    <div class="w-screen h-screen flex flex-col items-center p-10 gap-[5vh]">
        <picture class="w-3/4 min-w-60 max-h-1/3 grow-1">
            <source
                srcset="img/corn-dark.svg"
                media="(prefers-color-scheme: dark)"
                class="w-full h-full"
            />
            <img
                class="w-full h-full"
                src="img/corn.svg"
                alt="Corn Unblocked"
            />
        </picture>
        <div
            class="flex flex-col grow-1 gap-[5vh] w-full items-center justify-center"
        >
            <input
                type="text"
                class="input w-1/2 min-w-40"
                title="Destination URL"
                placeholder="Enter a URL or search the web"
                onkeydown={onEnterKeyPressed(startProxy)}
                {@attach (urlBar: HTMLInputElement) => {
                    urlBar.focus();
                }}
                bind:value={destinationInput}
            />
            <span
                class="tooltip w-1/8 min-w-30"
                data-tip={proxyManager.proxyUrl === ""
                    ? "Proxy URL not found! Go to settings and configure proxy server"
                    : !proxyManager.serviceWorker
                      ? "Service worker not ready! Please wait"
                      : ""}
            >
                <button
                    class="btn w-1/1 pointer-events-auto"
                    title="Start proxy"
                    onclick={startProxy}
                    disabled={proxyManager.proxyUrl === "" ||
                        !proxyManager.serviceWorker}>Start</button
                >
            </span>
        </div>
        <div class="flex flex-row w-1/3 min-w-40 justify-evenly">
            <button
                class="btn w-4/9"
                title="Open settings"
                onclick={() => (isConfigOpen = true)}
            >
                Settings
            </button>
            <button
                class="btn w-4/9"
                title="Usage help"
                onclick={window.open.bind(
                    window,
                    "https://sites.google.com/view/cornunblocked/help/usage",
                )}
            >
                Help
            </button>
        </div>
        <footer class="mt-10 text-xs text-center">
            ©2025 Corn Unblocked under the <a
                href="https://github.com/corn-unblocked/cornng-frontend/blob/master/LICENSE"
                >GNU AGPL v3.0</a
            >
        </footer>
    </div>
{/if}
