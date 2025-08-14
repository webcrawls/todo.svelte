<script lang="ts">
    import type { StickyData } from "$lib";
    import { text } from "@sveltejs/kit";

    let data = $props();
    let { id, name, content, grabbed, isGrabbed, changed }: StickyData = data

    const headerMouseDown = (e) => {
        grabbed({ x: e.offsetX, y: e.offsetY })
    }

    const textChange = (e) => {
        console.log({e})
        changed({data: { ...data, content: e.target.value}})
    }
</script>

<div class="sticky" style="border: {isGrabbed ? '2px solid red' : 'none'}">
    <section>
        
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <header onmousedown={headerMouseDown}>({id}) {name} <!-- todo: controls --></header>
        <article>
            <textarea onchange={textChange} oninput={textChange} onkeyup={textChange}>{content}</textarea>
        </article>
    </section>
</div>

<style>
    .sticky {
        background-color: white;
        border: black 2px solid;

        aspect-ratio: 1 / 1;
        max-width: 400px;
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
        }

        & article {
            width: 100%;
            height: 100%;

            & textarea {
                width: 100%;
                height: 100%;
                resize: none;
            }
        }
    }
</style>
