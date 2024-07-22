import hljs from 'highlight.js/lib/core';

hljs.highlightAll();

//const observer = new MutationObserver((mutlist, observer) => {
//    console.log("Cought Mutation");
//    console.log(mutlist);
//    for (const mut of mutlist) {
//        if (mut.type === 'childList' && mut.addedNodes.length > 0) {
//            console.log("got mutations in childlist");
//            mut.addedNodes.forEach((node) => {
//                if (node.nodeType === Node.ELEMENT_NODE) {
//                    const preTags = node.querySelectorAll('pre');
//                    preTags.forEach(el => {
//                        console.log("Found pre tag");
//                        hljs.highlightElement(el);
//                    })
//                }
//            });
//        }
//    }
//});

//observer.observe(document.body, { childList: true, subtree: true })