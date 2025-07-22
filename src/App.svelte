<script lang="ts">
    import Proxy from "./Proxy.svelte";
    import config, { saveConfig } from "./config.svelte";
    import proxyManager from "./proxy.svelte";
    import { onEnterKeyPressed } from "./util";

    $effect(() => {
        saveConfig(config);
    });

    let destinationInput: HTMLInputElement = $state();
    let proxyComponent: Proxy = $state();

    let proxyIsOpen = $state(false);

    function startProxy() {
        proxyManager.setDestination(destinationInput.value);
        proxyManager.startProxy();
        proxyIsOpen = true;
    }
</script>

{#if proxyIsOpen}
    <Proxy bind:this={proxyComponent}></Proxy>
{:else}
    <div class="w-screen h-screen flex flex-col items-center p-10">
        <img class="w-1/2 grow-1" src="img/corn.svg" alt="Corn Unblocked" />
        <div class="flex flex-col grow-1 gap-10 w-full items-center">
            <input
                type="text"
                class="input w-1/2"
                title="Destination URL"
                placeholder="Enter a URL or search the web"
                onkeydown={onEnterKeyPressed(startProxy)}
                bind:this={destinationInput}
            />
            <button class="btn w-1/8" title="Start proxy" onclick={startProxy}
                >Start</button
            >
        </div>
        <div class="flex flex-row w-1/3 justify-evenly">
            <button
                class="btn w-4/9"
                title="Open settings"
                onclick={window.open.bind(
                    window,
                    "https://sites.google.com/view/cornunblocked/help/usage",
                )}
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
