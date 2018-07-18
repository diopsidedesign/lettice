# lettice
web components made simple(r)  ::  es6.  

## what is it
an experimental blob of code that builds web components based on an easyish declarative syntax. it eliminates a lot of the repetitive boilerplate code associated with building web components from scratch

pretty much only works on chrome, safari, and maybe opera. the browser must support web components and the shadow DOM spec.

## getting started
copy / paste the code into your favorite es6 javascript web project, or try it in codepen and experiment yourself. 

## example component

to build a component, include the lettice.js code in a web project. 

    <script type="text/javascript" src="./pathOrUrl/to/lettice.js"></script>

define your component

    Lettice({
      selector: 'lettice-page',   // must include dash, per the custom element spec 
      template: `
          <html-markup-here></html-markup-here>
       `, 
      styles: `
          .css-here { font-size: 10rem; } 
      `,  
      styleUrl: './or-a-path-to-file-here.css',
      buildStyles: [  // array of functions - each returning a string representing a new CSS rule / line / definition 
         function () {  ...  }, 
         function () {  ...  },
      ], 
      attributes: {           
         'name'   : 'untitled',                                       // define and observe attribute (default behavior) 
         'home-state' :  { default: 'antarctica', observe: false }    // define but don't observe / bind once,  must specify 
      },  
      children: {    // link and style tags along with text nodes are ignored in the indexing
         myFirstDescendant:  [0]
      },  
      onCreate: function(){   /* single function, called when element initialized in dom  */ }, 
      onChange: {      /* object with keys as strings and values as functions
         'foobar' : function() {  /* this func is called when this.foobar changes */ )
         anyChange:  function() {  /* called when any prop changes  */  } 
      }, 
      onRemove: function() {   /* single function, called when removed from DOM  ~ disconnectedCallback */  } 
    });  
   
   
 use in html 

     <lettice-page name=mypage  home-state=france> </lettice-page>
     
## author
im really a geologist

## license
This project is licensed under the MIT License - see the LICENSE.md file for details
