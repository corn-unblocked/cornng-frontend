<script lang="ts">
    import Config from "./Config.svelte";
    import Proxy from "./Proxy.svelte";
    import config, { saveConfig } from "./config.svelte";
    import proxyManager from "./proxy.svelte";
    import { onEnterKeyPressed } from "./util";
    import autoProxyProber from "./prober.svelte";

    autoProxyProber.probeBare();
    autoProxyProber.probeWisp();

    $effect(() => {
        saveConfig(config);
    });

    let destinationInput = $state("");

    let isConfigOpen = $state(false);

    function startProxy() {
        if (proxyManager.proxyUrl === "") return;
        proxyManager.setDestination(destinationInput);
        proxyManager.startProxy();
        proxyManager.isProxyOpen = true;
    }
</script>

{#if proxyManager.isProxyOpen}
    <Proxy></Proxy>
{:else}
    <Config bind:isConfigOpen></Config>
    <div class="w-screen h-screen flex flex-col items-center p-10">
        <picture class="w-1/2 grow-1">
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
        <div class="flex flex-col grow-1 gap-10 w-full items-center">
            <input
                type="text"
                class="input w-1/2"
                title="Destination URL"
                placeholder="Enter a URL or search the web"
                onkeydown={onEnterKeyPressed(startProxy)}
                bind:value={destinationInput}
            />
            <span
                class="tooltip w-1/8"
                data-tip={proxyManager.proxyUrl === ""
                    ? "Proxy URL not found! Go to settings and configure proxy server"
                    : ""}
            >
                <button
                    class="btn w-1/1 pointer-events-auto"
                    title="Start proxy"
                    onclick={startProxy}
                    disabled={proxyManager.proxyUrl === ""}>Start</button
                >
            </span>
        </div>
        <div class="flex flex-row w-1/3 justify-evenly">
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
    </div>
{/if}
