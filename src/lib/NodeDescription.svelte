<script>
    import { Marked } from 'marked';
    import hljs from 'highlight.js';
    import 'highlight.js/styles/github.css'
    import { markedHighlight } from 'marked-highlight';
    import Card from '../UI/Card.svelte';

    export let data;

    let modalIsOpen = false;

    $: markdown = data.description && data.description !== '' ? new Marked(markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, {language }).value;
        }
    })).use({gfm: true}).parse(data.description) : "";
    
    $: if (data.nodeId && data?.description === '') {
        fetch(`/files/${data.nodeId}.md`)
        .then(response => response.text())
        .then(body => {
            data = {...data, description: body};
        })
    }
</script>
<style>
    div.docked {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 40vw;
        z-index: 999;
        background-color: rgba(127, 127, 0, 0.4);
        transition: ease-in-out 400ms;
    }
</style>

<div class={modalIsOpen ? 'docked' : ''}>
<Card>
    <span slot="title">{ data.nodeId ? data.nodeId : 'Details' }</span>
    <button 
        slot="header-actions"
        on:click={() => modalIsOpen = !modalIsOpen}
        class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
        <span>{modalIsOpen ? 'Close' : 'Full View'}</span>
    </button>
    <div class="overflow-y-auto prose prose-sm {modalIsOpen ? 'h-screen' : 'max-h-48'} transition duration-300">
        {#if markdown && markdown !== ''}
            {@html markdown}
        {:else}
            <div class="text-md font-semibold text-gray-600">
                No description was found for this node.
            </div>
        {/if}
    </div>
</Card>
</div>

