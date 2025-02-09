<script>
    export let isDrawerOpen = false;
    
    const toggleDrawer = () => {
      isDrawerOpen = !isDrawerOpen;
    };
</script>
  
<div class="min-h-screen flex flex-col">
    <header class="w-full bg-gray-800 text-white p-4 flex items-center">
      <button 
        class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        on:click={toggleDrawer}
      >
        {isDrawerOpen ? '← 🍔' : '→ 🍔'}
      </button>
      <h1 class="ml-4 text-xl font-bold">Code explorer</h1>
    </header>
  
    <div class="flex flex-1 h-[calc(100vh-80px)]">
      <aside 
        class="bg-gray-100 transition-all duration-300 ease-in-out {isDrawerOpen ? 'w-96' : 'w-0'} overflow-hidden"
      >
        <div class="p-4">
          <slot name="sidebar" />
        </div>
      </aside>
  
      <main class="flex-1 relative">
        <div class="absolute inset-0">
          <slot />
        </div>
      </main>
    </div>
</div>