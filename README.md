# lettice
a [web component](https://en.wikipedia.org/wiki/Web_Components) builder written in [es6](http://es6-features.org/).  

define [custom html elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) with less boilerplate code. 

its like an uber simple version of [polymer](https://www.polymer-project.org/) that eschews all notions of backwards compatibility. polyfills? what are those. 
  
## getting started
copy / paste the code into your favorite es6 javascript web project.

<< [view the source code](/lettice.js) >>

or try it in codepen and experiment yourself in the browser. 
https://codepen.io/diopside/pen/mjrXEv

no frameworks / dependencies required. just a browser that supports es6 javascript and web components (read: chrome / safari / opera ).

you can even just paste it in an html script tag and get going on a local, network-less environment.

## what and how
lettice reads an input object that defines the selector, template, styles, and other behavior about your component and generates a corresponding es6 class extending the HTMLElement interface, and then automatically calls the window.customElements.define method to register your element.

if you're familiar with frameworks like angular or polymer, the approach and syntax shouldn't be too strange.

component styles are fully encapsulated and will not affect external html elements thanks to the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) spec

## browser compatibility
good on chrome and opera, firefox tries its damndest, and things aren't looking good in the redmond camp. 

To enable custom elements and shadow DOM in Firefox, in about:config, enable the following flags
````
     dom.webcomponents.customelements.enabled  
     dom.webcomponents.shadowdom.enabled  
````
note - it seems the css host-context selector still doesn't work on FF even with these flags enabled



## a simple example 
````

Lettice({

   selector: 'example-component', 
   
   template: `
      <section id="pagename" >  
         <h3 class="page-title"></h3>
         <h6 id="subtitle"> subtitles are hard </h6>
         <slot></slot>  
      </section> 
      <span></span>
   `, 
   
   styles: ` 
      h3.page-title { 
         font-size: 1rem;  
      }`,  
      
   buildStyles: [
      function () { return '\n:host-context([activepage=' + this.getAttribute('name') + ']) h3 {   font-size: 5rem    }' } 
   ], 
   
   attributes: {  
      'name'     : 'untitled component', 
      'active'   : false, 
      'pagename' : { default: 'untitled page', observe: false }  
   }, 
   
   children: {  
      'pageTitle' : [0,0],  
      'separator' : [1], 
      'subtitle'  : '#subtitle' 
   }, 
   
   listeners: { 
      'mouseenter' : function() { this.pageTitle.style.color = pink } 
   }, 
   
   onCreate: function(){  
      this.pageTitle.textContent = this.name; 
      let p = setTimeout(()=> { this.active = true }, 1000) 
   }, 
   
   onChange: { 
      'active' : function(oldVal, newVal) {
          console.log('i am a function that is called whenever the value of the 'active' attribute changes on the host element')
       },
       anyChange: function(name, oldVal, newVal) {
          console.log( 'i am a function called whenver ANY observed attribute changes' )
       }
   }, 
   
   onRemove: function() {
      console.log('oh noooo, please dont leave me')
   } 
});  

````


## example component with explanations

to build a component, simply include the lettice.js code in a web project. i.e 

    <script type="text/javascript" src="./pathOrUrl/to/lettice.js"></script>

somewhere in your js project, call the Lettice function, providing an input object that defines all the needed properties

````
Lettice({

   //      used in html as -> 
   //      <example-component></example-component> 
   //      selector must have a dash to indicate it is a custom element
   
   selector: 'example-component', 
   
   

   // html markup goes here
   // add es6 string literal interpolation here if you want  
   
   template: `
      <section id="pagename" >  
         <h3 class="page-title"></h3>
         <h6 id="subtitle"> subtitles are hard </h6>
         <slot></slot>  
      </section> 
      <span></span> 
      `, 
      
      

   // styles can either be included in the html template string inside the requisite <style>
   // or provided here as a separate styles property, which makes later manipulation easier
   
   styles: ` 
      h3.page-title { 
         font-size: 1rem;  
      }`,



   // alternatively you can include a link to an external css stylesheet with styleUrl
   
   styleUrl: './pathToExternalCssFile.css' ,
   
   
      
   // lettice calls these functions in sequence and appends their (hopefully) string return values to the styles
   // no error handling so ... beware
   
   buildStyles: [
      function () { return '\n:host-context([activepage=' + this.getAttribute('name') + ']) h3 {   font-size: 5rem    }' }
      
      // this adds a style rule that increases subtitle font size when an ancestor element has an
      // activepage attribute equal to the components name, cuz why not?
   ]   ,



   // key value pairs representing attributes to bind to component
   // if provided simply as primitive values, primitive value assumed to be default fallback
   // if an object is provided, and that object has an 'observe' property set to false -
   // the specified attribute will only be read initially upon dom render
   // any further changes wont be observed or bound to the component property
   // changes can be responded to with a matching callback function in the 'onChange' component definition property
   
   
   attributes: {  
      'name'   : 'untitled component',   // will define a component property and corresponding geters/setters for - this.name, set to 
                                         // HTML value if provided, otherwise set to fallback provided here 
                                         
      'active' : false,      // defines a component property and corresponding getters/setters for a boolean property.
                             // if host element is called w/ <example-component active></example-component> prop will be 
                             // initailized to true, otherwise init to fallback provided here (false in this case)
                             
      'pagename' : { default: 'untitled page', observe: false } 
      // defines and sets this.pagename to whatever attribute value is 
      // a) in the html markup at render or otherwise b)provided here as the default. no further changes are observed
   },


   // key value pairs can either be arrays of nums or strings
   // key names listed here will be dom node references to specified child elements in the template
   
   children: {  
      'pageTitle' : [0,0], // sets this.pageTitle = to the dom node representing first child of the first child in the template
                           // in this case its the page title,
      'separator' : [1],   // set this.separator to a reference representing the second child listed in the template
                           // in this case the span element
      'subtitle'  : '#subtitle'  // if a string value is provided, it will use query selector to query for the corresponding dom element, in this case one with an id of 'subtitle'
                                 // generic ids are totally fine because... shadow DOM!
   },



   // define any dom listeners to add to the host element
   
   listeners: {
   
      'mouseenter' : function() { this.pageTitle.style.color = pink }
      // when the mouse first enters the component area, sets the color of the page title to pink, a very practical example
   },



   // onCreate is a single function which will be called after the custom element is rendered to the dom
   // the 'afterConnected' callback of the HTMLElement interface
   
   onCreate: function(){ 
      
      this.pageTitle.textContent = this.name; 
      // this sets the text content of the page title h3 element to the value of any provided name attribute
      
      let p = setTimeout(()=> { this.active = true }, 1000)
      // 1 s after component is rendered, set the active property and corresponding attribute to true 
   },
   
   

   // key value pairs defining attribute names and corresponding callback functions to be called 
   // whenever that attribute registers a change  as the 'attributeChangedCallback' of the HTMLElement interface
   // ->  ( name of attribute that changed,  previous value,   new value  )
   
   onChange: { 
      'active' : function(oldVal, newVal) {
          console.log('i am a function that is called whenever the value of the active attribute changes on the host element')
       },
       anyChange: function(name, oldVal, newVal) {
          console.log( 'i am a function called whenver ANY observed attribute changes' )
       }
   },



   // function called whenever element is removed from dom  
   // analagous to 'disconnectedCallback' of HTMLElement interface
   
   onRemove: function() {
      console.log('oh noooo, please dont leave me')
   }
   
});  

````

now you can use your custom element in an html page like so 

     <example-component> </example-component>
     

     
## author
diopside

## license
This project is licensed under the MIT License - see the LICENSE.md file for details
