<script lang="ts">
    import StickyWindow from "./StickyWindow.svelte";

    let { stickies, updateStickies } = $props();

    let grabbedSticky: string | undefined = $state(undefined);
    let grabbedStickyPosition: { x: number; y: number } | undefined =
        $state(undefined);

    const handleMouseMove = (event) => {
        if (grabbedSticky === undefined) return;

        updateStickies(
            stickies.map((s) => {
                if (s.data.id !== grabbedSticky) return s;
                const newS = {
                    ...s,
                    position: {
                        ...s.position,
                        x: event.clientX - grabbedStickyPosition.x,
                        y: event.clientY - grabbedStickyPosition.y,
                    },
                };
                return newS;
            }),
        );
    };

    const handleStickyChange = (id, change) => {
        updateStickies(
            stickies.map((s) => {
                if (s.data.id !== id) return s;
                const newS = { ...s, ...change };
                console.log({ change });
                return newS;
            }),
        );
    };

    const handleStickyGrab = (id, grabPosition: { x: number; y: number }) => {
        grabbedStickyPosition = grabPosition;
        grabbedSticky = id;
    };

    const handleStickyUngrab = () => {
        if (grabbedSticky === undefined) return;
        grabbedSticky = undefined;
    };

    const deleteSticky = (id) => {
        updateStickies(
            stickies.filter((s) => {
                if (s.data.id === id) return false;
                return true;
            }),
        );
    };

    const handleStickyResize = (id, width, height) => {
        updateStickies(
            stickies.map((s) => {
                if (s.data.id !== id) return s;
                const newS = {
                    ...s,
                    position: { ...s.position, width, height },
                };
                return newS;
            }),
        );
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
            style="--x: {position.x}px; --y: {position.y}px; --width: {position.width ??
                256}px; --height: {position.height ?? 256}px;"
        >
            <StickyWindow
                {data}
                delete={deleteSticky.bind(this, data.id)}
                minimize={() => {}}
                changed={handleStickyChange.bind(this, data.id)}
                grabbed={handleStickyGrab.bind(this, data.id)}
                requestResize={handleStickyResize.bind(this, data.id)}
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
        width: var(--width, 256px);
        height: var(--height, 256px);
    }
</style>
