<script>
    import { cyStore, initCy } from "./cyStore";
    import { elements } from "../../data";
  
    let container;
  
    $: if (container && !$cyStore) {
        const newElements = $elements; 
        const nodes = newElements.filter(e => e.data.id && e.data.source === undefined);
        const edges = newElements.filter(e => e.data.id && e.data.source !== undefined && e.data.target !== undefined);

        // filter out duplicated id nodes
        const NonDuplicateNodes = nodes.filter((node, index, arr) => arr.findIndex(n => n.data.id === node.data.id) === index)
        const OnlyExistingEdges = edges.filter(e => NonDuplicateNodes.findIndex(n => n.data.id === e.data.source) !== -1 && NonDuplicateNodes.findIndex(n => n.data.id === e.data.target) !== -1)

        //console.log([...NonDuplicateNodes.slice(480, 490)])
        initCy('cy', [...NonDuplicateNodes, ...OnlyExistingEdges]);
        $cyStore.center();
    }


</script>
  
<div id="cy" bind:this={container} class="w-full h-full absolute inset-0"></div>
  