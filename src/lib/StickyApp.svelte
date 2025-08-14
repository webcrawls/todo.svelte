<script lang="ts">
    import type { ActiveSticky } from "$lib";
    import { localStore } from "./localStore.svelte";
    import StickyContainer from "./StickyContainer.svelte";
    import { onMount } from "svelte";

    let storedStickies = localStore('stickies', [])
    let stickies: ActiveSticky[] = $state([]);

    const updateStickies = (newStickies) => {
        stickies = newStickies;
        saveStickies()
    };

    const saveStickies = () => {
        storedStickies.value = [...stickies]
    }

    const createSticky = () => {
        const newStickies = [
            ...stickies,
            {
                data: {
                    id: crypto.randomUUID(),
                    name: "test",
                    content: "blah",
                },
                position: { x: 200, y: 200, width: 256, height: 256 },
            },
        ];
        updateStickies(newStickies);
    };

    onMount(() => {
        stickies = [...storedStickies.value]
    })
</script>

<div class="sticky-app">
    <StickyContainer {stickies} {updateStickies}/>
    <div class="sticky-controls">
        <button>Minimize All [TODO]</button>
        <button onclick={createSticky}>Create New</button>
    </div>
</div>

<style>
    .sticky-app {
        min-width: 100vw;
        min-height: 100vh;

        display: flex;
        flex-direction: column;

        position: relative;
        background-color: cadetblue;
    }

    .sticky-controls {
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 3rem;
        
        background-color: gray;

        display: flex;
        justify-content: center;
        gap: 2rem;
        padding: 0.5rem;
    }
</style>
