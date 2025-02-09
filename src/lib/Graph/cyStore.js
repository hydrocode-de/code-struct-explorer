import { writable } from 'svelte/store';
import cytoscape from 'cytoscape';
import automove from  'cytoscape-automove';

let cy = null;
export const cyStore = writable(cy);

const defaultStyle = {
    'width': 3,
    'line-color': '#ccc',
    'target-arrow-color': '#ccc',
    'target-arrow-shape': 'triangle',
    'curve-style': 'bezier',
    'taxi-direction': 'downward'
}
export function initCy(container, elements =[]) {
    cytoscape.use(automove);
    cy = cytoscape({
        container: document.getElementById(container),
        elements: [...elements],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': e => e.data('color') ? e.data('color') : '#ddd',
                    'label': 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {...defaultStyle}
            }
        ],
        layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1500,
        }
    });
    
    cyStore.set(cy);
    // @ts-ignore
    window.cy = cy;
}

export function colorNodeTree(nodeId, color, replace =false) {
    // Make all visible
    cy.elements().css({'opacity': 1});

    // if replace mode, make all hardly visible
    if (replace) {
        cy.nodes().data('color', '#ddd');
        cy.edges().css({...defaultStyle}); 
        cy.elements().css({'opacity': 0.25});
    }
    
    // recursive function to color a node and its children
    function walkGraph(node) {
        const mynode = cy.nodes(`#${node}`)
        // if node is already colored, return to prevent infinite loop
        if (mynode.data('color') === color) {
            return
        }

        mynode.data('color', color);
        mynode.css('opacity', 1);
        const edges = cy.edges(`[source = "${node}"]`);
        edges.css({
            ...defaultStyle,
            'line-color': color, 
            'target-arrow-color': color, 
            'opacity': 1
        });

        // recursive call for all children
        edges.map(e => e.data('target')).map(node => walkGraph(node))
        
    }

    // start the walk
    walkGraph(nodeId);
}

export function fitGraphIntoView() {
    cy.animate({
        fit: {
            eles: cy.nodes(),
            padding: 80
        }
    },{
        duration: 600
    });

}