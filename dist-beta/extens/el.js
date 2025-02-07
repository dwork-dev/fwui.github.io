(()=>{
  var dcs={
    bgmain:"green",
    bgdarkmain:"#ccc",
    cmain:"black",
    cdarkmain:"white",
    bcolor:"#ccc",
    bdarkcolor:"black"
  };
  if(!window.$$colors){
    window.$$colors=dcs;
  }else{
    Object.keys(window.$$colors).forEach(k=>{
      dcs[k]=$$colors[k];
    });
    window.$$colors=dcs;
  }
})();
function $el(elname,attrs=[],cbc,cbac){
  attrs=attrs||[],"string"==typeof attrs&&(attrs=attrs.split(",").filter((t=>t))),attrs.push("t-options"),attrs=[...new Set(attrs)];
  class MyCustomElement extends HTMLElement{
    static observedAttributes=attrs;constructor(){
      super()
    }
    get root(){
      return this.attachShadow({mode:"open"})
    }
    connectedCallback(){
      const t=this;
      "function"==typeof cbc&&cbc(this),setTimeout((()=>{
        $css?.storeCss(t)
      }))
    }
    disconnectedCallback(){
      console.log("Custom element removed from page.")
    }
    adoptedCallback(){
      console.log("Custom element moved to new page.")
    }
    attributeChangedCallback(t,e,s){
      "function"==typeof cbac&&cbac(this,t,s,e)
    }
    options(){
      var str=this.getAttribute("t-options")||"",rs={};
      try{
        return str&&"{"!=str[0]&&(str=`{${(str||"").replaceAll("\n","").replace(/\s+/g," ")}}`),eval(`rs=${(str||"").replaceAll("\n","")}`),rs
      }catch(e){
        console.log(this,e);return rs;
      }
    }
  }
  customElements.define(elname,MyCustomElement)}
