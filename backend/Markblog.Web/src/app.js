import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';
import './styles.css'
import 'htmx.org'
import javascript from 'highlight.js/lib/languages/javascript';
import csharp from 'highlight.js/lib/languages/csharp';

// Then register the languages you need

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('csharp', csharp);

console.log(hljs.listLanguages());

hljs.highlightAll();