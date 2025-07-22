<script lang="ts">
    import Navbar from "./Navbar.svelte";
    import proxyManager from "./proxy.svelte";

    let iframe: HTMLIFrameElement;
    let iframeHasLoaded = $state(false);

    function onIframeLoad() {
        iframeHasLoaded = true;
        // do not set proxyManager.url if the iframe hasn't hooked into the manager yet
        const src = new URL(iframe.src).pathname;
        if (!src.includes(proxyManager.uvConfig.prefix)) return;
        proxyManager.url = proxyManager.uvConfig.decodeUrl(
            src.slice(proxyManager.uvConfig.prefix.length),
        );
    }
</script>

<div class="w-screen h-screen fixed top-0 left-0">
    {#if !iframeHasLoaded}
        <div class="bg-base-200 w-full h-full flex flex-col justify-center">
            <span class="loading loading-spinner loading-xl"></span>
        </div>
    {/if}
    <iframe
        bind:this={iframe}
        title="Proxy"
        class="w-full h-full"
        src={proxyManager.iframeUrl}
        onload={onIframeLoad}
    ></iframe>

    <Navbar></Navbar>
</div>
