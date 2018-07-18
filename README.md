# lettice
web components made simple(r)  ::  es6.  pretty much only works on chrome, safari, and maybe opera. the browser must support web components and the shadow DOM spec.

## what is it
an experiment. lettice builds web components based on an easyish declarative syntax. it eliminates a lot of the repetitive boilerplate code associated with building web components from scratch (if your browser supports it...). 

## getting started
copy / paste the code into your favorite es6 javascript web project, or try the codepen and experiment yourself.
or put it in a link tag, you do you.

## example component

to build a component, include the lettice.js code in a web project. 

    <script type="text/javascript" src="./lettice.js"></script>

define your component

    Lettice({
    
      selector: 'lettice-page', 
      
      template: `
      <style> 
          #css-can-go-here {  background-color: red } 
      </style>
      <section> 
          <slot></slot>   
      </section>
      `,
      
      styles: `
          .or-css-goes-here {
             font-size: 10rem;
          } 
      `,
      
      styleUrl: './or-specify-a-path-to-a-css-file.css',
      
      // an array of functions that will be called while generating the css template, you can dynamically append special css rules 
      buildStyles: [
         function () { return '\n:host-context([activepage=' + this.getAttribute('name') + ']){ display: block!important }' } 
      ],
      
      // bind to and observe element attributes
      attributes: {  
         'name'   : 'untitled',
         'active' : false,
         'home-state' :  { default: 'antarctica', observe: false } // only read and set initial value, dont observe changes
      },


      // selectors for defining references to child nodes so they can be accessed like  'this.pageTitle' 
      // can include an array of numbers, each indiicated the child node index of the targeted element,
      // or include a single string to be used as as query selector
      children: {  
         pageTitle: [0,0]  // first child of the first child of the host element
         pageFooter: [4,1] // 2nd child of the 5th child of the host element, etc.
         textblock:  '#mytextblock'  // select by id
      }, 
      
      
      onCreate: function(){
        console.log('the onCreate function is called when the element is first instantiated in the DOM');
        console.log(this.textblock)  // this would log the textblock element defined above to the console
      },
          
      // called when observed attributes or properties are changed,
      // it is analagous to the 'attributeChangedCallback(' method in a custom element class
      // use key : value pairs where key is a string identifier and value is a function, 
      // use the anyChange: property to watch all changes
      onChange: { 
         'active' : function() {  console.log('this func is called when the active attribute changes')
         anyChange:  function() {  // called when any observed prop changes } 
      },
      
      
      // called when element is removed from DOM. analagous to 'disconnectedCallback' of custom element spec
      onRemove: function() {  console.log( 'oh no...' ) } 
     });  


condensed  component definition 


    Lettice({
      selector: 'lettice-page',  
      template: `  <html-markup-here></html-markup-here>  `, 
      styles: `
          .css-here { font-size: 10rem; } 
      `,  
      buildStyles: [     
         function () {  ...  }, 
         function () {  ...  },
      ], 
      attributes: {  
         'name'   : 'untitled', 
         'home-state' :  { default: 'antarctica', observe: false } 
      },  
      children: {    // link and style tags along with text nodes are ignored in the indexing
         myFirstDescendant:  [0]
      },  
      onCreate: function(){   /* single function, called when element initialized in dom  */ }, 
      onChange: {   
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
