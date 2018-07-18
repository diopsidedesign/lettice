

function Lettice( config ) { 

   const buildElement = config => { 
 
      const observedAttrs = Object.keys( config.attributes ).filter( key => { 
         const def = config.attributes[ key ], isObject = typeof def === 'object';  
         return !isObject || ( isObject && def.observe !== false ) });  

      return class LetticeElement extends HTMLElement {  

         constructor() { super();   
            const templateEl = document.createElement( 'template' );
            templateEl.innerHTML = this.template;
            this.attachShadow( {mode: 'open'} )
               .appendChild( templateEl.content.cloneNode( true ) );    
            const defineAndInitProp = ( key, def ) => {
               let meta      = { writable: true, enumerable: true }, 
                  transform  = v => { return v };
               const isObj = typeof def === 'object',
                  isBool   = typeof def === 'boolean',
                  isNum    = typeof def === 'number',
                  readOnly = isObj && def.observe === false;
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
               const value = ( isObj && def.default !== undefined )?  def.default : def;     

               if ( !this.hasAttribute( key )) {
                  if ( !isBool || (isBool && readOnly) ) 
                     this[ key ] = value; 
                  if ( value !== false ) 
                     this.setAttribute( key, transform( value )) }   
               else { this[ key ] = transform( this.getAttribute( key ));}
            }  
            for ( let attrKey in config.attributes ) {
               defineAndInitProp( attrKey, config.attributes[ attrKey ] ) } 
            for ( let eventType in config.listeners ) { 
               this.addEventListener( eventType, config.listeners[ eventType ].bind( this )) }
            for ( let key in config.children ) {   
               let query = selector => { return this.shadowRoot.querySelector( selector ) }; 
               if ( config.children[ key ] instanceof Array ) {
                  query = nodeIndexes => {
                     let child = this.childNodes[ nodeIndexes[0] ];
                     nodeIndexes.slice(1).forEach( index => { child = this.getChildrenOf( child )[ index ] });  
                     return child } }
               Object.defineProperty( this, key, {
                  writable: true,
                  enumerable: true,
                  value: query( config.children[ key ] ) });   
            } 
         }   

         get template() { 
            const buildStyles = (funcArr) => { return funcArr.map( func => { return func.bind(this)() }).join(' '); } 
            if ( config.styles ) {
               return '<style>' + config.styles + (config.buildStyles ? buildStyles(config.buildStyles) : '') + '</style>' +  config.template 
            } else if ( config.styleUrl ){
               return '<link rel=stylesheet href="' + config.styleUrl + '">' + config.template
            } else return config.template
         }

         static get observedAttributes() {
            return observedAttrs }  
         
         get children() {
            return Object.keys(config.children).map( key => { return this[key] }) } 
         
         get childNodes() { 
            return this.getChildrenOf( this.shadowRoot ) } 

         getChildrenOf( node ) {
            return [].slice.call( node.childNodes ).filter( child => { 
               return ( child.nodeType !== 3 ) && ( child.localName !== 'style' ) && ( child.localName !== 'link' )}) }  
         
         connectedCallback() { 
            config.onCreate && config.onCreate.bind( this )() }

         disconnectedCallback() {
            config.onRemove && config.onRemove.bind( this )() }

         attributeChangedCallback( attrName, oldVal, newVal ) { 
            if ( config.onChange && config.onChange[ attrName ] ) { 
               config.onChange[ attrName ].bind( this )( oldVal, newVal ) } 
            config.onChange && config.onChange.anyChange && config.onChange.anyChange.bind( this )( name, oldVal, newVal )
         }
      }
   }
   customElements.define( config.selector, buildElement( config ))
} 
