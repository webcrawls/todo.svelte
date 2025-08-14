<script lang="ts">
    let {
        data,
        delete: deleteSelf,
        minimize,
        grabbed,
        isGrabbed,
        changed,
        requestResize,
    } = $props();

    let { name, content } = data;

    let header: HTMLElement | undefined = undefined;

    const headerMouseDown = (e) => {
        // if (e.target !== header) return
        grabbed({ x: e.offsetX, y: e.offsetY });
    };

    const textChange = (e) => {
        changed({ data: { ...data, content: e.target.value } });
    };

    const cancelEvent = (fn, event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        fn();
    };

    let stickyElement: HTMLElement = undefined;
    let resizePositionStart = undefined;
    let windowOrigin = undefined;
    let resizing = false;

    const startResize = (event) => {
        resizing = true;

        const rect = stickyElement.getBoundingClientRect();
        windowOrigin = { x: rect.x, y: rect.y };
        resizePositionStart = { x: event.offsetX, y: event.offsetY };
    };

    const endResize = (event) => {
        resizing = false;
    };

    const handleResize = (event) => {
        if (!resizing) return;
        console.log({ resizePositionStart, windowOrigin, resizing });
        const width = event.clientX - resizePositionStart.x;
        const height = event.clientY - resizePositionStart.y;
        // console.log({width})
        requestResize(width, height);
        // changed({data: {...data, position: {...data.position, width, height }}})
    };
</script>

<svelte:window onmousemove={handleResize} onmouseup={endResize} />

<div
    class="sticky"
    style="border: {resizing ? '2px solid red' : 'none'}"
    bind:this={stickyElement}
>
    <section>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <header bind:this={header} onmousedown={headerMouseDown}>
            <h1>{name}</h1>
            <div class="controls">
                <button onclick={cancelEvent.bind(this, deleteSelf)}>x</button>
                <button onclick={cancelEvent.bind(this, () => {})}>-</button>
            </div>
        </header>
        <article>
            <textarea
                onchange={textChange}
                oninput={textChange}
                onkeyup={textChange}>{content}</textarea
            >
        </article>
        <div class="grabber" onmousedown={startResize}></div>
    </section>
</div>

<style>
    .sticky {
        background-color: white;
        border: black 2px solid;

        width: 100%;
        height: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;

        & header {
            background-color: gray;
            color: white;
            cursor: grab;

            display: flex;
            flex-direction: row;

            & h1 {
                width: 100%;
                flex: 1 1;
                font-size: 0.75rem;
            }

            & .controls {
                display: flex;
                width: min-content;
                gap: 0.5rem;
                flex: 1 1;

                & button {
                    flex: 1 1;
                    width: 24px !important;
                    min-width: none;
                    margin: 0;
                    padding: 0;
                    height: 24px;
                }
            }
        }

        & article {
            width: 100%;
            height: 100%;

            & textarea {
                width: 100%;
                height: 100%;
                resize: none;
                box-sizing: border-box;
            }
        }

        & .grabber {
            position: absolute;
            width: 16px;
            height: 16px;
            bottom: 0;
            right: 0;
            background-image: linear-gradient(
                calc(360deg - 45deg),
                black 50%,
                white 50%
            );
            cursor: grab;
        }
    }
</style>
