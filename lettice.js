//
// lettice v 001
//   -by diopside

function Lettice( config ) { 

   const buildElement = config => { 
      
      // defines a constant string array that tells the browser which HTML attributes to watch for changes
      const observedAttrs = Object.keys( config.attributes ).filter( key => { 
         const def = config.attributes[ key ];
         return !(typeof def === 'object') || ( typeof def === 'object' && def.observe !== false )
      });  

      return class LetticeElement extends HTMLElement {  

         constructor() { super();   
            
            // attach shadow DOM and populate it with the template content
            const templateEl = document.createElement( 'template' );
            templateEl.innerHTML = this.template;
            this.attachShadow( {mode: 'open'} ).appendChild( templateEl.content.cloneNode( true ) );    

            // initaializes a host component property or accessors based on key value input
            const defineAndInitProp = ( key, def ) => {

               let meta      = { writable: true, enumerable: true },  // object metadata 
                  transform  = v => { return v }; 

               const isObj = typeof def === 'object',
                  isBool   = typeof def === 'boolean',
                  isNum    = typeof def === 'number',
                  readOnly = isObj && def.observe === false;
                  
               // define appropriate getter / setter accessors based on input type
               if ( !readOnly ) { 
                  const getter  = ()=> { return transform( this.getAttribute( key )) }
                  let setter    = v => { this.setAttribute( key, transform( v )) }
                  if ( isNum )  
                     transform  = v => { return parseFloat( v ) } 
                  else if ( isBool ) {
                     transform  = v => { if ( v === true ) return ''; else if ( v === '' ) return true }
                     setter     = v => { v? this.setAttribute( key, '') : this.removeAttribute( key )} }   
                  meta = { get: getter, set: setter }; 
               }

               Object.defineProperty( this, key, meta );      

               // if an object is provided, set the value to its 'default' property, otherwise set value to provided primitive val
               const value = ( isObj && def.default !== undefined )?  def.default : def;     

               // initalize component property if not redundant
               if ( !this.hasAttribute( key )) {
                  if ( !isBool || (isBool && readOnly) ) 
                     this[ key ] = value; 
                  if ( value !== false ) 
                     this.setAttribute( key, transform( value )) }   
               else { this[ key ] = transform( this.getAttribute( key ));}
            }  
            
            // bind or read+set attributes to the component
            for ( let attrKey in config.attributes ) {
               defineAndInitProp( attrKey, config.attributes[ attrKey ] ) } 

            // bind dom events to host element
            for ( let eventType in config.listeners ) { 
               this.addEventListener( eventType, config.listeners[ eventType ].bind( this )) }

            for ( let key in config.children ) {   
               // default behavior is to use query selector unless array of nums is provided
               let query = selector => { return this.shadowRoot.querySelector( selector ) }; 
               if ( config.children[ key ] instanceof Array ) {  
                  
                  // finds a dom element via an array of child node indexes - a crude dom map 
                  query = nodeIndexes => { 
                     let child = this.shadowRoot;
                     nodeIndexes.map( (index) => { child = this.getChildrenOf( child )[ index ] })
                     return child } }  

               Object.defineProperty( this, key, {
                  writable: true,
                  enumerable: true,
                  value: query( config.children[ key ] ) });   
            } 
         }   

         get template() {   // appends additional style information to the template string (including evaluated function styles) if available and returns the joint string
            const buildStyles = (funcArr) => {
               return funcArr.map( func => {
                  return func.bind(this)() }).join(' '); }  // call and concatenate output of functions in buildStyles array
            let insert = '';
            if ( config.styles ) {
               insert+= '<style>' + config.styles + (config.buildStyles ? buildStyles(config.buildStyles) : '') + '</style>';  } 
            if ( config.styleUrl ){ 
               insert+= '<link rel=stylesheet href="' + config.styleUrl + '">';  } 
            return insert + config.template
         }

         // returns the constant defined above the class definition, Array<string>
         static get observedAttributes() {
            return observedAttrs }  
         
         // return only those child dom nodes which have been specified as component properties
         get declaredChildren() {
            return Object.keys(config.children).map( key => { return this[key] }) } 
         
         // return -all- dom nodes descendant to this component
         get childNodes() { 
            return this.getChildrenOf( this.shadowRoot ) } 

         getChildrenOf( node ) {
            return [].slice.call( node.childNodes ).filter( child => { 
               // removes style, link, and text nodes from consideration in dom mapping
               return ( child.nodeType !== 3 ) && ( child.localName !== 'style' ) && ( child.localName !== 'link' )}) }  
         
         connectedCallback() { 
            config.onCreate && config.onCreate.bind( this )() }

         disconnectedCallback() {
            config.onRemove && config.onRemove.bind( this )() }

         // onchange property is defined in component definition as object w string key and function value pairs
         // anyChange subproperty, if defined, will be called after any change of any observed attribute
         // subprops that match keynames of observed attributes will have their included functions called when the corresponding watched attribute changes
         attributeChangedCallback( attrName, oldVal, newVal ) { 
            if ( config.onChange && config.onChange[ attrName ] ) { 
               config.onChange[ attrName ].bind( this )( oldVal, newVal ) } 

            config.onChange && config.onChange.anyChange && config.onChange.anyChange.bind( this )( name, oldVal, newVal )
         }
      }
   } 

   // buildElement returns an es6 class built to shadow dom + custom element spec v1
   customElements.define( config.selector, buildElement( config ))
} 
