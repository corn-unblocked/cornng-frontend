<script lang="ts">
    import proxyManager from "./proxy.svelte";
    let isNavbarOpen = $state(false);
</script>

{#if isNavbarOpen}
    <div class="fixed top-0 w-screen flex flex-row gap-1 z-50">
        <div>
            <button class="btn btn-square" title="Back"> ￩ </button>
            <button class="btn btn-square" title="Forward"> ￫ </button>
            <button class="btn btn-square" title="Reload"> ⟳ </button>
        </div>
        <input
            type="text"
            class="input flex grow-1"
            id="urlBar"
            value={proxyManager.url}
        />
        <div>
            <button class="btn btn-square" title="Close proxy"> × </button>
            <button
                class="btn btn-square"
                title="Close navbar"
                onclick={() => (isNavbarOpen = false)}
            >
                ↑
            </button>
        </div>
    </div>
{:else}
    <button
        class="btn btn-square fixed top-0 right-1 z-50"
        title="Open navbar"
        onclick={() => (isNavbarOpen = true)}
    >
        ↓
    </button>
{/if}
