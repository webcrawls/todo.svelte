<script lang="ts">
    import StickyWindow from "./StickyWindow.svelte";

    let { stickies, updateStickies, saveStickies } = $props();

    let grabbedSticky: string | undefined = $state(undefined);
    let grabbedStickyPosition: { x: number; y: number } | undefined = $state(undefined);

    const handleMouseMove = (event) => {
        if (grabbedSticky === undefined) return;

        handleStickyChange(grabbedSticky, { position: {
                x: event.clientX - grabbedStickyPosition.x,
                y: event.clientY - grabbedStickyPosition.y,
        }})
    };

    const handleStickyChange = (id, change) => {
        updateStickies(stickies.map((s) => {
            if (s.data.id !== id) return s;
            s = { ...s, ...change};
            return s;
        }))
    }

    const handleStickyGrab = (id, grabPosition: { x: number; y: number }) => {
        grabbedStickyPosition = grabPosition;
        grabbedSticky = id;
    };

    const handleStickyUngrab = () => {
        if (grabbedSticky === undefined) return;
        grabbedSticky = undefined;
    };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="stickies"
    onmousemove={handleMouseMove}
    onmouseup={handleStickyUngrab}
>
    {#each stickies as { data, position }}
        <div
            class="sticky-wrapper"
            style="--x: {position.x}px; --y: {position.y}px;"
        >
            <StickyWindow
                {...data}
                changed={handleStickyChange.bind(this, data.id)}
                grabbed={handleStickyGrab.bind(this, data.id)}
                isGrabbed={grabbedSticky === data.id}
            />
        </div>
    {/each}
</div>

<style>
    .stickies {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .sticky-wrapper {
        position: absolute;
        top: var(--y);
        left: var(--x);
    }
</style>
