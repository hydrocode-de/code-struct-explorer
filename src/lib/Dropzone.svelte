  <script>
    import { elements } from '../data.js';
    
    export let height = 48;
    
    let dropzone;
    let fileInput;
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
      processFile(file);
    }
    
    function handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    
      const file = event.dataTransfer.files[0];
      processFile(file);
    }
    
    function processFile(file) {
      if (file && (file.type === 'application/json' || file.type === 'application/geo+json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(String(e.target.result));
            if (Array.isArray(data)) {
              elements.set(data);
            } else if (data.elements) {
              elements.set(data.elements);
            }
          } catch (error) {
            console.error('Invalid JSON file', error);
          }
        };
        reader.readAsText(file);
      }
    }
    
    function handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    function handleClick() {
      fileInput.click();
    }
  </script>

  <div 
    role="button"
    tabindex="0"
    bind:this={dropzone}
    class="flex flex-col h-{height} justify-center align-middle w-full p-6 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer hover:border-blue-500"
    on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:click={handleClick}
    on:keypress={(e) => e.key === 'Enter' && handleClick()}
  >
    <input
      type="file"
      bind:this={fileInput}
      class="hidden"
      accept=".json,application/json"
      on:change={handleFileSelect}
    />
    <p class="text-gray-600">Drag & Drop a JSON file here or click to upload</p>
  </div>