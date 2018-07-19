# lettice
a web component factory written in es6.  

define custom html elements with less boilerplate code. sorta like an uber simple version of Polymer, with angular-like component definitions, and no semblance of backwards compatibility with anything.
  
## getting started
copy / paste the code into your favorite es6 javascript web project, or try it in codepen and experiment yourself. 

## example component

to build a component, include the lettice.js code in a web project. 

    <script type="text/javascript" src="./pathOrUrl/to/lettice.js"></script>

call the Lettice function, providing an input object that defines all the needed properties

````
Lettice({

   // used in html as -> 
   //      <example-component></example-component> 
   // selector must have a dash to indicate it is a custom element
   selector: 'example-component', 

   // html markup goes here, add es6 string literal interpolation here if you want  
   template: `
      <section id="pagename" >  
         <h3 class="page-title"></h3>
         <h6 id="subtitle"> subtitles are hard </h6>
         <slot></slot>  
      </section> 
      <span></span> 
      `, 

   // styles can either be included in the html template string inside the requisite <style> tags or provided here as a separate property, which makes later manipulation easier
   styles: ` 
      h3.page-title { 
         font-size: 1rem;  
      }`,

   // or include a link to an external css stylesheet here
   styleUrl: './pathToExternalCssFile.css' ,
      
   // lettice calls these functions in sequence and appends their (hopefully) string return values to the style information before adding that to the final rendered template string
   // no error handling so ... beware
   buildStyles: [
      function () { return '\n:host-context([activepage=' + this.getAttribute('name') + ']) h3 {   font-size: 5rem    }' }   // adds a style rule that greatly increases subtitle font size if an ancestor element has an activepage attribute equal to the components name, cuz why not
   ]   ,

   // key value pairs representing attributes to bind to component
   // if provided simply as   index[string] : primitiveValue, it uses that primitive value as the fallback initialization value if none is specified in the html markup
   // if an object is provied, and that object has an 'observe' property set to false, the specified attribute will only be declared and read initially upon dom render and any further changes wont be observed or bound to the component property
   // changes can be responded to with a matching callback function in the 'onChange' component definition property
   attributes: {  
      'name'   : 'untitled component',   // will define a component property and corresponding geters/setters for - this.name, set to HTML value if provided, otherwise set to fallback provided here 
      'active' : false, // defines a component property and corresponding getters/setters for a boolean property. if the element is called w/ <example-component active></example-component> it will be initailized to true,
      // otherwise initialized to value provided here as fallbackl
      'pagename' : { default: 'untitled page', observe: false } // defines and sets this.pagename to whatever attribute value is a) in the html markup at render or otherwise b)provided here as the default. no further changes are observed
   },

   // key value pairs can either be arrays of nums or strings
   // key names listed here will be dom node references to specified child elements in the template
   children: {  
      'pageTitle' : [0,0], // set  this.pageTitle = to the dom node reference representing the first child of the first child in the template, in this case its the page title,
      'separator' : [1],    // set  this.separator to a reference representing the second child listed in the template, in this case the span element
      'subtitle'  : '#subtitle'  // if a string value is provided, it will use query selector to query for the corresponding dom element, in this case one with an id of 'subtitle'
                                 // generic ids are totally fine because... shadow DOM!
   },

   // define any dom listeners to add to the host element
   listeners: {
      'mouseenter' : function() { this.pageTitle.style.color = pink }  // when the mouse first enters the component area, sets the color of the page title to pink, a very practical example
   },

   // onCreate is defined as a single function which will be called after the custom element is rendered to the dom
   // the 'afterConnected' callback of the HTMLElement interface
   onCreate: function(){ 
      this.pageTitle.textContent = this.name;  // this sets the text content of the page title h3 element to the value of any provided name attribute
      let p = setTimeout(()=> { this.active = true }, 1000)    //  1 s after component is rendered, set the active property and corresponding attribute to true 
   },

   // key value pairs defining attribute names and corresponding callback functions to be called whenever that attribute registers a change
   // same paramters as the 'attributeChangedCallback' of the HTMLElement interface ->  ( name of attribute that changed,  previous value,   new value  )
   onChange: { 
      'active' : function(oldVal, newVal)       { console.log('i am a function that is called whenever the value of the active attribute changes on the host element') },
      anyChange: function(name, oldVal, newVal) { console.log( 'i am a function called whenver ANY observed attribute changes' )}
   },

   // function called whenever element is removed from dom  
   // analagous to 'disconnectedCallback' of HTMLElement interface
   onRemove: function() {  console.log('oh noooo, please dont leave me') }
});  

````

now you can use your custom element in an html page like so 

     <example-component name=mypage> </example-component>
     
## author
diopside

## license
This project is licensed under the MIT License - see the LICENSE.md file for details
