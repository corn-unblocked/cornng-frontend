<script lang="ts">
    import config from "./config.svelte";
    import { bareProxyUrls, wispProxyUrls } from "./urls";

    let { isConfigOpen = $bindable() }: { isConfigOpen: boolean } = $props();
    let modalElement: HTMLDialogElement = $state();

    $effect(() => {
        if (isConfigOpen) {
            modalElement.showModal();
        } else {
            modalElement.close();
        }
    });
</script>

<dialog
    id="configModal"
    class="modal z-50"
    bind:this={modalElement}
    onclose={() => (isConfigOpen = false)}
>
    <div class="modal-box flex flex-col items-center gap-5 h-1/2">
        <p class="text-4xl">Settings</p>
        <div class="flex flex-col items-center grow-1 justify-center w-1/1">
            <div class="grid grid-cols-2 gap-5 w-1/1">
                <p class="flex items-center justify-center">Proxy Backend</p>
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn m-1 w-1/1">
                        {config.useBare ? "Bare" : "Wisp"}
                    </div>
                    <ul
                        class="dropdown-content menu bg-base-100 rounded-box p-2 shadow-sm w-1/1"
                    >
                        <li>
                            <button
                                onclick={() => {
                                    config.useBare = false;
                                    document.activeElement.blur();
                                }}>Wisp</button
                            >
                        </li>
                        <li>
                            <button
                                onclick={() => {
                                    config.useBare = true;
                                    document.activeElement.blur();
                                }}>Bare</button
                            >
                        </li>
                    </ul>
                </div>
                <p class="flex items-center justify-center">Proxy Server</p>
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn m-1 w-1/1">
                        {config.useBare
                            ? bareProxyUrls[config.bareSelectedProxy]
                            : wispProxyUrls[config.wispSelectedProxy]}
                    </div>
                    <ul
                        class="dropdown-content menu bg-base-100 rounded-box p-2 shadow-sm w-1/1 block overflow-y-scroll max-h-30"
                    >
                        {#each Object.entries(config.useBare ? bareProxyUrls : wispProxyUrls) as [proxyUrl, proxyName]}
                            <li>
                                <button
                                    onclick={() => {
                                        if (config.useBare) {
                                            config.bareSelectedProxy = proxyUrl;
                                        } else {
                                            config.wispSelectedProxy = proxyUrl;
                                        }
                                        document.activeElement.blur();
                                    }}>{proxyName}</button
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
                <p class="flex items-center justify-center">Custom Proxy URL</p>
                <input
                    class="input w-1/1"
                    bind:value={
                        () =>
                            config.useBare
                                ? config.bareCustomProxy
                                : config.wispCustomProxy,
                        (v) => {
                            if (config.useBare) {
                                config.bareCustomProxy = v;
                            } else {
                                config.wispCustomProxy = v;
                            }
                        }
                    }
                />
            </div>
        </div>
        <button class="btn" onclick={() => (isConfigOpen = false)}>Close</button
        >
    </div>
    <form method="dialog" class="modal-backdrop">
        <button onclick={() => (isConfigOpen = false)}>close</button>
    </form>
</dialog>
