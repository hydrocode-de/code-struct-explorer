<script>
    import { onDestroy } from "svelte";
    import { cyStore, colorNodeTree } from "./cyStore";
    import NodeDescription from "../NodeDescription.svelte";
    import Card from "../../UI/Card.svelte";

    let storeActivated = false;

    const availableOperations = ['mark', 'inspect']
    let currentOperation = 'mark';
    let currentColor = '#0061ff';
    let replace = true;
    let lockedNodes = [];

    let description;
    let nodeId;

    function rewriteLocks(color =null) {
        // figure out which colors to use
        let usedColors;
        if (!color) {
            usedColors = $cyStore.nodes().map(n => n.data('color')).filter((c, i, arr) => arr.indexOf(c) === i && c !== '#ddd');
        } else {
            usedColors = [color];
        }
        lockedNodes.forEach(lock => {
            lock.rule.disable();
            lock.rule.destroy();
        })

        lockedNodes = usedColors.map(color => (
            {
                color,
                enabled: true,
                rule: $cyStore.automove({
                    nodesMatching: $cyStore.nodes(`[color="${color}"]`),
                    reposition: 'drag',
                    dragWith: $cyStore.nodes(`[color="${color}"]`),
                })
            }
        ))
    }

    function toggleLock(color) {
        const lockId = lockedNodes.findIndex(lock => lock.color === color);
        if (lockId !== -1) {
            lockedNodes[lockId].enabled = !lockedNodes[lockId].enabled;
            lockedNodes[lockId].rule.toggle();
            lockedNodes = [...lockedNodes];
        }
    }

    function clickHandler(e) {
        if (currentOperation === 'mark') {
            colorNodeTree(e.target.data('id'), currentColor, replace);
            if (replace) {
                rewriteLocks(currentColor);
                
            } else {
                rewriteLocks();
            }

        } else {
            const id = e.target.data('id');
            const desc = $cyStore.nodes(`#${id}`).data('description');
            if (desc && desc !== '') {
                description = desc;
                // nodeId = null;
                nodeId = id;
            } else {
                nodeId = id;
                description = '';
            }
        }
    }

    function registerClickHandler() {
        if (!storeActivated) {
            $cyStore.on('click', 'node', clickHandler);
            storeActivated = true;
        } 
    }
    
    $: $cyStore && !storeActivated ? registerClickHandler() : null;
    onDestroy(()  => $cyStore.off('click', 'node', clickHandler))
</script>

<div class="space-y-4">
    <div class="flex space-x-2">
        {#each availableOperations as operation}
            <button 
                class="px-4 py-2 rounded-md transition-colors {
                    currentOperation === operation 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }"
                on:click={() => currentOperation = operation}
            >
                {operation}
            </button>
        {/each}
    </div>

    {#if currentOperation === 'mark'}
    <div class="flex flex-col space-y-4">
        <Card>
            <span slot="title">Color-Select Structs</span>
            <label>
                <input type="checkbox" bind:checked={replace} />
                Replace other colors
            </label>
            <div>
                <input type="color" bind:value={currentColor} />
                {currentColor}
            </div>
    </Card>

        <Card>
         <span slot="title">Lock by color</span>
        {#each lockedNodes as lock}
            <div class="flex w-full items-center">
                <label class="flex items-center">
                    <input 
                        type="checkbox" 
                        checked={lock.enabled} 
                        on:change={() => toggleLock(lock.color)}
                        class="mr-3 w-5 h-5 rounded bordrr-grey-300 text-blue-500 focus:ring-blue-500 cursor-pointer" 
                    />
                </label>
                <div class="w-1/2 mr-2 h-4" style="background-color: {lock.color}"></div>
                {lock.color}
            </div>
        {/each}
        </Card>
    </div>
    {/if}

    {#if currentOperation === 'inspect'}
        <h1 class="text-md font-bold">Inspect Structs</h1>
        <div class="flex flex-col space-y-2">
            <NodeDescription data={{nodeId, description}} />
        </div>
    {/if}
</div>