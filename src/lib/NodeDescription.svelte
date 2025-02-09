<script>
    import { Marked } from 'marked';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/github.css'
    import { markedHighlight } from 'marked-highlight';
    import Card from '../UI/Card.svelte';

    export let nodeId;
    export let description;

    let modalIsOpen = false;

    $: markdown = description ? new Marked(markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, {language }).value;
        }
    })).use({gfm: true}).parse(description) : "";
    $: if (nodeId) {
        fetch(`/files/${nodeId}.md`)
        .then(response => response.text())
        .then(body => description = body)
    }
</script>


<Card>
    <span slot="title">{ nodeId ? nodeId : 'Details' }</span>
    <button 
        slot="header-actions"
        on:click={() => console.log('Full view clicked')}
        class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
        <span>Full View</span>
    </button>
    <div class="max-h-48 overflow-y-auto prose prose-sm">
        {#if markdown && markdown !== ''}
            {@html markdown}
        {:else}
            <div class="text-md font-semibold text-gray-600">
                No description was found for this node.
            </div>
        {/if}
    </div>

</Card>

