import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/default.css';
import './styles.css'
import 'htmx.org'
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);


hljs.highlightAll();

const observer = new MutationObserver((mutlist, observer) => {
   console.log(mutlist);
   for (const mut of mutlist) {
       if (mut.type === 'childList' && mut.addedNodes.length > 0) {
           mut.addedNodes.forEach((node) => {
               if (node.nodeType === Node.ELEMENT_NODE) {
                   const preTags = node.querySelectorAll('pre');
                   preTags.forEach(el => {
                       hljs.highlightElement(el);
                   })
               }
           });
       }
   }
});

observer.observe(document.body, { childList: true, subtree: true })