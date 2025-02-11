<script>
  import Dropzone from './lib/Dropzone.svelte';
  import Graph from './lib/Graph/Graph.svelte';
  import { elements } from './data.js'; 
  import DrawerColumn from './UI/ColumnLayout.svelte';
  import GraphOptions from './lib/Graph/GraphOptions.svelte';
</script>

<DrawerColumn>

    <div slot="sidebar" class="flex flex-col space-y-4">
      {#if $elements.length > 0} 
        <!-- <h1 class="text-md font-bold">Load another file</h1> -->
        <!-- <Dropzone /> -->
        <GraphOptions />  
      {:else}
        <h3 class="text-md font-light font-italic mx-auto">
          First load a network file to view options 
        </h3>
      {/if}
  </div>


  <div class="h-full relative">
    {#if $elements.length > 0}
      <Graph />
    {:else}
      <div class="p-4">
        <Dropzone height={96}  />
      </div>
    {/if}
  </div>
</DrawerColumn>