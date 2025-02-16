var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
function __(k){
  if(window._lang && typeof window._lang[k]!="undefined"){
    return window._lang[k];
  }
  return k;
}
Element.prototype.el=function(id){
  return this.querySelector(id);
}
Element.prototype.els=function(id){
  return this.querySelectorAll(id);
};
((dk)=>{
  var _user;
  var _domain=location.host.split(".").slice(-2).join(".");
  window.dk=new SDK();
  function SDK(url,method,$token){
    var $dk=this;
    var _method=method||"POST";
    var sortdomain="dw.beta.fwkui.com";
    var _url=url||"https://"+sortdomain;
    var _token="dk_token",_token_out=2*24*60*60*1000;
    var __token=$token;
    $dk.init=init;
    $dk.Unit=Unit;
    $dk.User=User;
    $dk.App=App;
    $dk.Resource=Resource;
    $dk.Doc=Doc;
    $dk.ResourceFile=ResourceFile;
    $dk.get=getDataForm;
    $dk.set=setDataForm;
    $dk.post=post;
    $dk.cookie=cookie;
    $dk.token=token;
    $dk.File=$File;
    $dk.upload=upload;
    $dk.download=_download;
    $dk.sha256=sha256;
    $dk.uid=()=>{
      return Math.random().toString(36).slice(2,8)+Date.now().toString(36);
    }
    function init(url,method){
      return new SDK(url,method);
    }
    function cookie(key, value, expire){
      var ckey = '__cookie_data__';
      var keys = key;
      if(typeof keys=="string"){
        keys=keys.split('.');
      }
      key = keys.shift();
      var data = localStorage.getItem(ckey) || {};
      if(typeof data == 'string'){
        if(data.substr(0,1) == '{' && data.substr(data.length-1)=='}'){
          data = JSON.parse(data);
        }else{
          data = {};
        }
      }
      if(typeof value == 'undefined'){
        var d=(data[key]||[]);
        if(!d.length){
          return;
        }
        if(d[1]&&d[2]){
          if(d[1]<Date.now()){
            return;
          }
        }
        if(!keys.length){
          return d[0];
        }
        var rs;
        try{
          eval(`rs=d[0].${keys.join(".")}`);
          return rs;
        }catch(e){
          return rs;
        }
      }else{
        data[key] = [value];
        if(typeof expire == 'number'){
          if(expire == 0){
            data[key][1] = Date.now();
          }else if(expire > 0){
            data[key][1] = Date.now()+expire;
            data[key][2] = expire;
          }
        }
        localStorage.setItem(ckey, JSON.stringify(data));
      }
    }
    async function token(value,expire){
      try{
        var v = ((await cookieStore.get(_token))||{}).value;
        if(value && value!=v && !sortdomain.includes(_domain)){
          await cookieStore.set({
            name: _token,
            value,
            expires: typeof expire=="undefined"?Date.now()+_token_out:expire,
            domain: _domain
          })
        }
        return value||v;
      }catch(e){
        console.log(e)
        var v = (await $dk.cookie(_token))||"";
        if(value && value!=v){
          await $dk.cookie(_token, value);
        }
        return value||v;
      }
    }
    function post (url,params,callback,callbackerror,sync){
      params=params||{};
      if(typeof params=="string"){
        eval(`params=${params};`);
      }
      if(typeof params=="object" && typeof params.deleted=="undefined"){
        params.deleted=$dk.cookie("deleted")||0;
      }
      typeof params!="string"&&(params=JSON.stringify(params));
      return new Promise(async (resolve)=>{
        var req = new XMLHttpRequest();
        req.open(_method, url, sync);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("Accept-Version", "9");
        var t = __token || (await $dk.token());
        //console.log("url,t",url,t)
        if(t){
          req.setRequestHeader("token", t);
        }
        if(params.app){
          req.setRequestHeader("id_app", params.app);
        }
        req.onload=(event)=>{
          var rs=event.target.response;
          if(url.includes("/file/content")){
            //rs = event.target.response
          }else{
            rs=JSON.parse(event.target.response);
            if(url.includes("os/login") && rs.data && rs.status_code==200){
              $dk.token(rs.data[_token]);
            }else if(url.includes("os/out")&&!url.includes("os/out_all")){
              $dk.token("",0);
            }
          }
          typeof callback=="function" && callback(rs);
          resolve(rs);
        }
        req.send(params);
      })
    }
    async function _download (url, stringFunction, callback, callbackerror, sync){
      var t = __token || (await $dk.token());
      return fetch(url,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Version": "9",
          "token": t
        },body: "{}"
      }).then(r=>{
        typeof callback=="function" && callback(r);
        if(stringFunction && typeof r[stringFunction]=="function"){
          return r[stringFunction]();
        }
        return r;
      });
    }
    function upload (url,path,filename,content,callback,callbackerror,sync){
      const req = new XMLHttpRequest();
      return new Promise(async (resolve)=>{
        var $form = new FormData();
        if(Array.isArray(content) || typeof content=="object" && content.toString()=='[object FileList]'){
          content=content[0];
        }
        if(typeof content=="string"){
          if(content.match(/data:[a-z]+\/[a-z]+;base64,.+/g)){
            content = dataURItoBlob(content);
          }else{
            var type = "text/plain";
            if(filename.match(/\.js$/)){
              type = "text/javascript";
            }else if(filename.match(/\.html$/)){
              type = "text/html";
            }else if(filename.match(/\.svg$/)){
              type = "image/svg+xml";
            }else if(filename.match(/\.xml$/)){
              type = "application/xml";
            }
            content = new File([content], filename, {
              type
            });
          }
        }else if(typeof typeof content=="object") {
          if(content.toString()=='[object File]'){

          }
        }
        //console.log("content",content)
        $form.append("path",path||"");
        $form.append("filename",filename);
        $form.append("files",content,filename);
        $form.append("filetype",content.type);
        req.addEventListener("load", async(event)=>{
          var rs=JSON.parse(event.target.response);
          if(url.includes("os/login") && rs.data && rs.status_code==200){
            $dk.token(rs.data[_token]);
          }else if(url.includes("os/out")&&!url.includes("os/out_all")){
            $dk.token("",0);
          }
          typeof callback=="function"&&callback(rs);
          resolve(rs);
        });
        req.open(_method, url, sync);
        req.setRequestHeader("Accept-Version", "9");
        var t = __token || (await $dk.token());
        //console.log("url,t",url,t)
        if(t){
          req.setRequestHeader("token", t);
        }
        req.send($form);
      })
    }
    function getDataForm(el){
      if(el){
        if(typeof el=="string"){
          el=document.querySelector(el);
        }
      }
      var p = {};
      var __CKE = [];
      if(Array.isArray(window.cke)) __CKE = window.cke;
      if(window.CKEDITOR) __CKE = CKEDITOR.instances;
      el.querySelectorAll('*[name]').forEach(a=>{
        if(!a.name){return}
        if(a.code && typeof a.code.getValue=="function"){
          return p[a.name] = a.code.getValue();
        }
        if(a.id && __CKE[a.id]){
          p[a.name] = __CKE[a.id].getData();
          return;
        }
        if(a.type === 'checkbox'){
          var val = a.checked?1:0;
          if(typeof p[a.name]!="undefined" && !Array.isArray(p[a.name])){
            p[a.name]=[p[a.name]];
          }
          if(Array.isArray(p[a.name])){
            p[a.name].push(val);
          }else{          
            p[a.name] = val;
          }
        }else if(a.type === 'radio'){
          var val = a.value||'';
          if(a.checked){
            p[a.name]=val;
          }
        }else{
          if(typeof p[a.name]!="undefined" && !Array.isArray(p[a.name])){
            p[a.name]=[p[a.name]];
          }
          if(Array.isArray(p[a.name])){
            p[a.name].push(a.value || '');
          }else{          
            p[a.name] = a.value || '';
          }
        }
      });
      return p;
    }
    function setDataForm(el, data, callback){
      if(el){
        if(typeof el=="string"){
          el=document.querySelector(el);
        }
      }
      data || (data={});
      var p = {};
      var __CKE = [];
      if(Array.isArray(window.cke)) __CKE = window.cke;
      if(window.CKEDITOR) __CKE = CKEDITOR.instances;
      Object.keys(data).forEach(k=>{
        try{
          var els=el.querySelectorAll(`[name="${k}"]`);
          if(els.length){
            if(Array.isArray(data[k])){
              data[k].forEach((v,i)=>{
                setVal(els[i],v);
              })
            }else{
              [...els].forEach(i=>{
                setVal(i,data[k]);
              })
            }
          }
        }catch(e){console.log("setDataForm err",e)}
      });
      function setVal(a,val){
        if(!a){return}
        if(a.code && typeof a.code.setValue=="function"){
          a.code.setValue(data[a.name]);
        }else if(a.id && __CKE[a.id]){
          __CKE[a.id].setData(data[a.name]);
        }else if(a.type=="checkbox"){
          if(!a.getAttribute("value")){
            a.setAttribute("value",1)
          }
          a.checked=(a.value==val?true:false);
        }else if(a.type=="radio"){
          a.checked=(a.value==val);
        }else{
          a.value=val;
        }
      }
    }
    function Unit(){
      var self=this;
      self.get=(zid,callback)=>{
        return $dk.post(_url+"/company/get",{zid},callback);
      }
      /***
      + filter: {field: "string", value: "", op: "="}
      + filter: {
      	filterRules: [
          	{field: "string", value: "", op: "="}
          ],
          type: "and"
      }
      ***/
      self.gets=(data,callback)=>{
        return $dk.post(_url+"/company/gets",{...data},callback);
      }
      /***
      data: {name:"string",content:"string",...}
      ***/
      self.add=(data,callback)=>{
        return $dk.post(_url+"/company/add",{data},callback);
      }
      /***
      - data: {
      	group_id: <zid>, 
          user_id: <zid>,
          name:"string",
          content:"string"
      };
      - signers.length==signeds.length: accepted;
      - revokeds.length>0: revoked;
      ***/
      self.invite=(data,callback)=>{
        return $dk.post(_url+"/company/invite", {data}, callback);
      }
      /***
      data: { 
      	filter: {filterRules: []},
          company: "unit_id"
      }
      nếu có company thì owner hoặc manager của company có thể nhìn thấy
      ***/
      self.inviteGets=(company,data,callback)=>{
        return $dk.post(_url+"/company/invite/gets", {company,...data}, callback);
      }
      /***
      zid: <invite_id>
      ***/
      self.inviteAccept=(zid,callback)=>{
        return $dk.post(_url+"/company/invite/accept", {zid}, callback);
      }
      /***
      zid: <invite_id>
      ***/
      self.inviteRevoke=(zid,callback)=>{
        return $dk.post(_url+"/company/invite/revoke", {zid}, callback);
      }
      /***
      zid: <invite_id>
      ***/
      self.staffBan=(zid,callback)=>{
        return $dk.post(_url+"/company/staff/ban", {zid}, callback);
      }
      self.edit=(zid,data,callback)=>{
        return $dk.post(_url+"/company/edit",{zid,data},callback);
      }
      /***
      zid: <unit_id>
      data: {
      	managers: [user_id, ...], designers: [], editors: [], authors: [], 
          readers: [], noaccess: [], deletable: []
      }
      ***/
      self.acl=(zid,data,callback)=>{
        return $dk.post(_url+"/company/acl",{zid,data},callback);
      }
      /***
      zid: <unit_id>
      data: {
      	owners: [user_id, ...]
      }
      ***/
      self.owner=(zid,data,callback)=>{
        return $dk.post(_url+"/company/owner",{zid,data},callback);
      }
      /***
      company: <unit_id>
      zid: <group_id>
      ***/
      self.groupGet=(company,zid,callback)=>{
        return $dk.post(_url+"/group/get",{company,zid},callback);
      }
      /***
      company: <unit_id>
      ***/
      self.groupGets=(company,data,callback)=>{
        return $dk.post(_url+"/group/gets",{company,...data},callback);
      }
      /***
      company: <unit_id>
      data: {
      	zid: "",
          name: ""
      }
      ***/
      self.groupAdd=(company,data,callback)=>{
        if(data.zid){
          return $dk.post(_url+"/group/edit",{company,zid: data.zid,data},callback)
        }else{
          return $dk.post(_url+"/group/add",{company,data},callback)
        }
      }
      self.groupDel=(company,zid,callback)=>{
        return $dk.post(_url+"/group/del",{company,zid},callback);
      }
      /***
      company: "<unit_id>"
      zid: "<group_id>"
      users: ["user_id"]
      ***/
      self.groupAddUser=(company,zid,users,callback)=>{
        return $dk.post(_url+"/group/add-user",{company,zid,users},callback);
      }
      /***
      company: "<unit_id>"
      zid: "<group_id>"
      users: ["user_id"]
      ***/
      self.groupDelUser=(company,zid,users,callback)=>{
        return $dk.post(_url+"/group/del-user",{company,zid,users},callback);
      }
      self.byTax=(taxCode,callback)=>{
        return new Promise(async rls=>{
          await fetch("https://api.vietqr.io/v2/business/"+taxCode).then(r=>r.json()).then(r=>{
            rls(r);
            typeof callback=="function" && callback(r);
          })
        })
      }
      /***
      company: <unit_id>
      zid: <group_id>
      ***/
      self.positionGet=(company,zid,callback)=>{
        return $dk.post(_url+"/position/get",{company,zid},callback);
      }
      /***
      company: <unit_id>
      ***/
      self.positionGets=(company,data,callback)=>{
        return $dk.post(_url+"/position/gets",{company,...data},callback);
      }
      /***
      company: <unit_id>
      data: {
      	zid: "",
          name: ""
      }
      ***/
      self.positionAdd=(company,data,callback)=>{
        if(data.zid){
          return $dk.post(_url+"/position/edit",{company, zid: data.zid, data},callback)
        }else{
          return $dk.post(_url+"/position/add",{company, data},callback)
        }
      }
      self.positionDel=(company,zid,callback)=>{
        return $dk.post(_url+"/position/del",{company,zid},callback);
      }
    }
    function App(company){
      var self=this;
      /***
      zid: "<app_id>"
      ***/
      self.get=(zid,callback)=>{
        return $dk.post(_url+"/app/get",{company,zid},callback);
      }
      self.gets=(data,callback)=>{
        return $dk.post(_url+"/app/gets",{company,...data},callback);
      }
      /***
      data: { name: "" }
      ***/
      self.add=(data,callback)=>{
        return $dk.post(_url+"/app/add",{company,data},callback);
      }
      /***
      data: { zid: "app_id", name: "" }
      ***/
      self.edit=(data,callback)=>{
        return $dk.post(_url+"/app/edit",{company,zid:data.zid,data},callback);
      }
      /*** ACL
      zid: <app_id>
      data: {
      	managers: ["user_id", "group_id", "[role_id]"...], designers: [], editors: [], authors: [], 
          readers: [], noaccess: [], deletable: []
      }
      ***/
      self.acl=(zid,data,callback)=>{
        return $dk.post(_url+"/app/acl",{company,zid, data},callback);
      }
      self.addDomain=(app,domain,callback)=>{
        return $dk.post(_url+"/domain/add",{company,app,domain},callback);
      }
      self.delDomain=(domain,callback)=>{
        return $dk.post(_url+"/domain/del",{company,domain},callback);
      }
      self.getDomain=(filter,callback)=>{
        return $dk.post(_url+"/domain/get",{company,filter},callback);
      }
      /***
      path: path of folder
      filename: ext: example.pdf
      content: text || File || Blob || dataUri()
      ***/
      self.upload=(path,filename,content,callback)=>{
        return $dk.upload(_url+"/public/file/upload",path,filename,content,callback);
      }
      /***
      path: path of folder
      filename: ext: example.pdf
      content: text content of file
      ***/
      self.createFolder=(path,callback)=>{
        return $dk.post(_url+"/public/path/create",{data: {path}},callback);
      }
      /***
      path: path of folder
      ***/
      self.fileGets=(path,callback)=>{
        return $dk.post(_url+"/public/file/gets",{data:{path}},callback);
      }
      /***
      path: full path filename
      ***/
      self.fileGet=(path, callback)=>{
        return $dk.post(_url+"/public/file/get",{data:{path}},callback);
      }
      /***
      path: full path filename
      ***/
      self.fileDel=(path, callback)=>{
        return $dk.post(_url+"/public/file/del",{data:{path}},callback);
      }
      /***
      data: {
          app: "<app_id>",
          zid: "<zid file>",
          filename: "<filename new>"
      }
      ***/
      self.fileRename=(data, callback)=>{
        return $dk.post(_url+"/public/file/rename",{data},callback);
      }
      /***
      path: full path filename
      ***/
      self.folderDel=(path, callback)=>{
        return $dk.post(_url+"/public/folder/del",{data:{path}},callback);
      }
      /***
      path: full path filename
      ***/
      self.fileContent=(path, callback)=>{
        return $dk.post(_url+"/public/file/content",{data:{path}},callback);
      }
      /***
      app: <app_id>
      data: {
          name: "string",
          users_groups: ["user_id", "group_id", "[role_id]", ...]
      }
      ***/
      self.roleAdd=(app,data,callback)=>{
        if(data.zid){
          return $dk.post(_url+"/role/edit",{company,zid:data.zid,data,app},callback)
        }else{
          return $dk.post(_url+"/role/add",{company,data,app},callback)
        }
      }
      self.roleDel=(app,zid,callback)=>{
        return $dk.post(_url+"/role/del",{company,app,zid},callback);
      }
      self.roleAddUser=(app,zid,users_groups,callback)=>{
        return $dk.post(_url+"/role/add-user",{company,app,zid,users_groups},callback);
      }
      self.roleDelUser=(app,zid,users_groups,callback)=>{
        return $dk.post(_url+"/role/del-user",{company,app,zid,users_groups},callback);
      }
      self.roleGet=(app,zid,callback)=>{
        return $dk.post(_url+"/role/get",{company,app,zid},callback);
      }
      self.roleGets=(app,data,callback)=>{
        return $dk.post(_url+"/role/gets",{company,app,...data},callback);
      }
    }
    function Resource(app){
      var self=this;
      //self.company=company;
      self.get=(zid,callback)=>{
        return $dk.post(_url+"/resource/get",{app,zid},callback);
      }
      self.gets=(data,callback)=>{
        return $dk.post(_url+"/resource/gets",{app,...data},callback);
      }
      /***
      data: {
      	name: "", summary: "",
          namefield: [],
          textfield: [],
          summaryfield: [],
          typefield: ["string|number|date|object"],
          resourceid: [],
          resourcefield: [],
          validate: "required|primary|email|min:3|max:10|array" //options
      }
      namefield.length==textfield.length==summaryfield.length==typefield.length==resourceid.length==resourcefield.length==validate.length
      ***/
      self.add=(data,callback)=>{
        return $dk.post(_url+"/resource/add",{app,data},callback);
      }
      self.edit=(zid,data,callback)=>{
        return $dk.post(_url+"/resource/edit",{app,zid,data},callback);
      }
      self.acl=(zid,data,callback)=>{
        return $dk.post(_url+"/resource/acl",{zid,app,data},callback);
      }
    }
    function ResourceFile(app){
      var self=this;
      //self.company=company;
      self.get=(zid,callback)=>{
        return $dk.post(_url+"/resource-file/get",{app,zid},callback);
      }
      self.gets=(data,callback)=>{
        return $dk.post(_url+"/resource-file/gets",{app,...data},callback);
      }
      self.add=(data,callback)=>{
        return $dk.post(_url+"/resource-file/add",{app,data},callback);
      }
      self.edit=(data,callback)=>{
        return $dk.post(_url+"/resource-file/edit",{app,data},callback);
      }
      self.setACL=(zid,data,callback)=>{
        return $dk.post(_url+"/resource-file/acl",{zid,app,data},callback);
      }
    }
    function Doc(resource){
      var self=this;
      /*** data={zid} ***/
      self.get=(data, callback)=>{
        return $dk.post(_url+"/doc/get",{resource,...data},callback);
      }
      /**** data = {filter: {filterRules: []}, limit: 20, page: 1} ****/
      self.gets=(data,callback)=>{
        return $dk.post(_url+"/doc/gets",{resource,...data}, callback);
      }
      /*** data = {data: {<fields of resource>}} ***/
      self.add=(data,callback)=>{
        return $dk.post(_url+"/doc/add",{resource,...data}, callback);
      }
      /*** data = {zid, data:{<fields of resource>}} ***/
      self.edit=(data,callback)=>{
        return $dk.post(_url+"/doc/edit",{resource,...data}, callback);
      }
      /*** 
      data = {
         zid, 
         data: {
         	  editors: [<users>,<groups>,<roles>],
            readers, noaccess
         }
      } 
      ***/
      self.acl=(data,callback)=>{
        return $dk.post(_url+"/doc/acl",{resource,...data}, callback);
      }
      /***
      data: {zid}
      ***/
      self.sign=(data,callback)=>{
        return $dk.post(_url+"/doc/sign",{resource,...data},callback);
      }
      /***
      data: {
      	zid,
      	data: { 
          	signers: [<users>,<groups>,<roles>] 
          }
      }
      ***/
      self.signer=(data,callback)=>{
        return $dk.post(_url+"/doc/signer",{resource,...data},callback);
      }
      /***
      data: {
      	zid,
      	data: {
          	revokers: [<users>,<groups>,<roles>]
          }
      }
      ***/
      self.revoker=(data,callback)=>{
        return $dk.post(_url+"/doc/revoker",{resource,...data},callback);
      }
      /***
      data: {zid}
      ***/
      self.revoke=(data,callback)=>{
        return $dk.post(_url+"/doc/revoke",{resource,...data},callback);
      }
      /***
      data = {zid}
      ***/
      self.del=(data,callback)=>{
        return $dk.post(_url+"/doc/del",{resource,...data}, callback);
      }
    }
    function $File(resource){
      var self=this;
      /***
      path: full path filename
      ***/
      self.get=(path, callback)=>{
        return $dk.post(_url+"/file/get",{data:{path}},callback);
      }
      /***
      path: full path filename
      ***/
      self.content=(path, callback)=>{
        return $dk.post(_url+"/file/content",{data:{path}},callback);
      }
      /***
      path: full path filename
      ***/
      self.download=(url, typeFnc, callback)=>{
        return $dk.download(url, typeFnc||"", callback);
      }
      /***
      path: full path filename
      ***/
      self.read=(resource, zid, typeFnc, callback)=>{
        return $dk.download(_url+`/file/get/${resource}/${zid}`, typeFnc||"", callback);
      }
      /***
      path: path of folder
      ***/
      self.gets=(path,callback)=>{
        return $dk.post(_url+"/file/gets",{data:{path}},callback);
      }
      /***
      path: path of folder
      filename: ext: example.pdf
      content: text content of file
      ***/
      self.save=(path,filename,content,callback)=>{
        return $dk.post(_url+"/file/save",{data: {path,filename,content}},callback);
      }
      /***
      path: path of folder
      filename: ext: example.pdf
      content: text || File || Blob || dataUri()
      ***/
      self.upload=(path,filename,content,callback)=>{
        var ps=path.split("/").filter(f=>f);
        if(resource && ps[0] != resource){
          ps = [resource,...ps];
        }
        return $dk.upload(_url+"/file/upload",ps.join("/"),filename,content,callback);
      }
      /***
      path: path of folder
      filename: ext: example.pdf
      content: text content of file
      ***/
      self.createFolder=(path,callback)=>{
        var ps=path.split("/").filter(f=>f);
        if(resource && ps[0] != resource){
          ps = [resource,...ps];
        }
        return $dk.post(_url+"/path/create",{data: {path: ps.join("/")}},callback);
      }
      /***
      path: full path filename
      data: {
      	editors: [<users>,<groups>,<roles>],
          readers, noaccess
      }
      ***/
      self.acl=(path,data,callback)=>{
        return $dk.post(_url+"/file/acl",{path,data},callback);
      }
      /***
      path: full path filename
      data: {
      	signers: [<users>,<groups>,<roles>]
      }
      ***/
      self.signer=(path,data,callback)=>{
        return $dk.post(_url+"/file/signer",{path,data},callback);
      }
      /***
      path: full path filename
      data: {
      	revokers: [<users>,<groups>,<roles>]
      }
      ***/
      self.revoker=(path,data,callback)=>{
        return $dk.post(_url+"/file/revoker",{path,data},callback);
      }
      /***
      path: full path filename
      ***/
      self.revoke=(path,callback)=>{
        return $dk.post(_url+"/file/revoke",{path},callback);
      }
      /***

      ***/
      self.del=(resource, zid, callback)=>{
        return $dk.post(_url+`/file/del/${resource}/${zid}`, callback);
      }
      /***

      ***/
      self.delPath=(resource, zid, callback)=>{
        return $dk.post(_url+`/path/del/${resource}/${zid}`, callback);
      }
    }
    function User(callback){
      var self=this;
      self.set=(user)=>{
        _user = user;
      }
      self.get=(callback)=>{
        return $dk.post(_url+"/os/user",{},callback)
      }
      self.login=(username,password,captcha,callback)=>{
        return $dk.post(_url+"/os/login",{data: {username,password,captcha},_token},callback)
      }
      self.logout=(callback)=>{
        return $dk.post(_url+"/os/out",{},callback);
      }
      self.reg=(data,callback)=>{
        return $dk.post(_url+"/os/reg",{data},callback);
      }
      self.update=(data,callback)=>{
        return $dk.post(_url+"/user/update",{data},callback);
      }
      self.info=(callback)=>{
        return $dk.post(_url+"/user/info",{},callback);
      }
      self.changepass=(old_password,password,re_password,callback)=>{
        return $dk.post(_url+"/user/changepass",{data:{old_password,password,re_password}},callback);
      }
      self.regF=(cb)=>{
        $dlg.form({
          title:'Đăng nhập',
          url: `/control/reg.html`,
          width: '400',
          onshown: frm=>{
            frm.querySelector('.registor').onclick=()=>{
              self.reg(frm.get(),rs=>{
                if(rs.status_code==200){
                  $dlg.message();
                  frm.close();
                }
                $dlg.error(rs)
              });
            }
          }
        });
      }
      self.loginF=async(cb)=>{
        var user= (await self.info()).data||{};
        _user=user;
        if(user && user.username!="anonymous"){
          $dlg.form({
            title:'Đăng nhập',
            template: `
            <div class="">
              <div class="dF">
                <div class=""></div>
                <div class="">${_user.fullname||_user.username}</div>
              </div>
              <div class="dF">
                 <button class="btn_signout">Logout</button>
              </div>
            </div>
            `,
            width: 400,
            onshown: frm=>{
              frm.el('.btn_signout').onclick=()=>{
                self.logout(rs=>{
                  if(rs.status_code==200){
                    location.reload();
                  }
                  $dlg.error(rs)
                });
              }
            }
          });
          return;
        }
        $dlg.form({
          title:'Đăng nhập',
          url: `/rcpanel/user/login-form.html`,
          width: '400',
          onshown: frm=>{
            console.log(frm);
            frm.els(".btn_send,.btn_sendr").forEach(el=>{
              el.onclick=()=>{
                var d=frm.get();
                self.login(d.username,d.password,"",rs=>{
                  if(rs.status_code == 200){
                    frm.close();
                    _user={
                      token: rs.data[_token],
                      ...rs.data.user
                    };
                    typeof cb=="function" && cb(rs.data);
                    //location.reload();
                  }
                  $dlg.error(rs);
                });
              }
            })
          }
        });
      }
    }
    function sha256(str, algo = "SHA-256") {
      if(typeof str!="string"){str=JSON.stringify(str)}
      let strBuf = new TextEncoder().encode(str);
      return crypto.subtle.digest(algo, strBuf).then(hash=>{
        window.hash = hash;
        let result = '';
        const view = new DataView(hash);
        for (let i = 0; i < hash.byteLength; i += 4) {
          result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        return result;
      });
    }
  }
})(window.dk=window.dk||{});
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], {type: mimeString});
}
function blobToDataURL(blob, callback) {
  return new Promise(rsl=>{
    var a = new FileReader();
    a.onload = function(e) {
      typeof callback=="function" && callback(e.target.result);
      rsl(e.target.result);
    }
    a.readAsDataURL(blob);
  })
}
function date2F(d,format){
  if(d){
    if(["number","string"].includes(typeof d)){
      d=new Date(d);
    }
    var r =(format||"dd/mm/yy hh:ii:ss");
    var d = [d.getDate(),d.getMonth()+1,d.getFullYear(),d.getHours(),d.getMinutes(),d.getSeconds()].map(m=>m+"");
    r = r.replace("dd",d[0].padStart(2,0)).replace("d",d[0]);
    r = r.replace("mm",d[1].padStart(2,0)).replace("m",d[1]);
    r = r.replace("yy",d[2]).replace("Y",d[2]);
    r = r.replace("hh",d[3].padStart(2,0)).replace("h",d[3]);
    r = r.replace("ii",d[4].padStart(2,0)).replace("i",d[4]);
    r = r.replace("ss",d[5].padStart(2,0)).replace("s",d[5]);
    return r;
  }
}
/***
   {
      start: ()=>{
        console.log("start",event.x,event.y)
      },
      drop: (files)=>{
        console.log("drop",files)
      },
      over: ()=>{
        console.log("over",event.x,event.y)
      },
      leave: ()=>{
        console.log("leave",el)
      },
      change: (files)=>{
      	console.log("change on click select file",el)
      }
   }
***/
function dropFile(el,options){
  if(el.dropfile){
    return;
  }
  options = options||{};
  var files=[];
  var dfm = document.querySelector("#drop_file_mash");
  if(!dfm){
    dfm = document.createElement("div");
    document.body.append(dfm);
    dfm.setAttribute("style","opacity: 0.0;position:fixed;top:0;left:0;width:0;height:0;z-index:9999");
  }
  el.dropfile=document.createElement("input");
  dfm.append(el.dropfile);

  if(typeof options.change=="function"){
    el.onclick=selectFile;
  }
  function selectFile(evt){
    if(!el._input){
      el._input = document.createElement("input");
      el._input.setAttribute("type","file");
      dfm.append(el._input);
      el._input.onchange=(evt)=>{
        typeof options.change=="function" && options.change([...el._input.files]);
        el._input.value="";
      }
    }
    el._input.click();
  }

  el.dropfile.setAttribute("style","display:none;position:fixed;top:0;left:0;width:0;height:0;");
  el.dropfile.setAttribute("type","file");
  el.dropfile.setAttribute("multiple","");
  el.dropfile.setAttribute("webkitdirectory","");
  el.ondragenter=(e)=>{
    el.dropfile.style.width=`${el.offsetWidth}px`;
    el.dropfile.style.height=`${el.offsetHeight}px`;
    el.dropfile.style.top=`${el.getBoundingClientRect().y}px`;
    el.dropfile.style.left=`${el.getBoundingClientRect().x}px`;
    el.dropfile.style.display="";
    typeof options.start=="function"&&options.start(e);
  };
  el.dropfile.ondragleave=ondragleave;
  el.dropfile.ondrop=ondrop;
  el.dropfile.ondragover=ondragover;
  el.dropfile.onchange=()=>{
    el.changed=0;
    el.dropfile.style.display="none";
  }
  function ondragleave(e){
    el.dropfile.style.display="none";
    typeof options.leave=="function"&&options.leave();
    console.log("leave in")
  }
  function ondrop(e){
    el.dropfile.style.display="none";
    files=[];
    if(e.dataTransfer.items){
      [...e.dataTransfer.items].filter(f=>f.kind==="file").map(m=>m.getAsFile()).filter(f=>f.type).forEach(f=>files.push(f))
    }else if(e.dataTransfer.files){
      [...e.dataTransfer.files].filter(f=>f.type).forEach(f=>files.push(f));
    }
    el.changed=1;
    var c=setInterval(()=>{
      if(!el.changed || el.changed++>=10){
        [...el.dropfile.files].filter(f=>f.type).forEach(f=>files.push(f));
        clearInterval(c);
        el.changed=0;
        typeof options.drop=="function"&&options.drop(files);
        el.dropfile.value="";
      }
    },100);
  }
  function ondragover(e){
    //e.preventDefault();
    //e.stopPropagation();
    typeof options.over=="function"&&options.over();
  }
}
function clone(obj){
  if(obj && typeof obj=="object"){
    return JSON.parse(JSON.stringify(obj))
  }
  return obj;
}
function initDrag(element,options) {
  options=options||{};
  var zone=options.zone||element;
  var area=options.area||document.body;
  var mouseTop,mouseLeft,posTop,posLeft,newTop,newLeft,widthMove,heightMove;
  var position = element.style.position||"fixed";
  var timeout=2000;
  zone.onmousedown = onmousedown;
  element.style.width=element.offsetWidth+"px";
  function onmousedown(e) {
    e = e || window.event;
    e.preventDefault();

    mouseTop=e.y;
    mouseLeft=e.x;
    widthMove=0;
    heightMove=0;
    posTop = element.getBoundingClientRect().y;
    posLeft = element.getBoundingClientRect().x;
    newTop=posTop;
    newLeft=posLeft;
    //var zoneOffset = element.getBoundingClientRect();
    //console.log("e",e)

    element.style.top=(newTop)+"px";
    element.style.left=(newLeft)+"px";
    element.style.position = "fixed";
    document.onmouseup = onmouseup;
    document.onmousemove = onmousemove;
    document.scrollDown = scrollDown;
    document.scrollDown();
    typeof options.onStart == "function" && options.onStart();
  }
  function scrollDown(){
    var speed=Math.abs(element.down||0)||1;
    if(speed>7){
      area.scrollTop += element.down;
    }
    speed=speed/10;
    if(speed>20){
      speed==20;
    }
    setTimeout(()=>{
      if(typeof document.scrollDown=="function"){
        document.scrollDown();
      }
    }, 50)
  }
  function onmousemove(e) {
    e = e || window.event;
    e.preventDefault();

    widthMove=mouseTop-e.y;
    heightMove=mouseLeft-e.x;
    newTop=posTop-(widthMove);
    newLeft=posLeft-(heightMove);
    var mint=0+area.getBoundingClientRect().y;
    var minl=0+area.getBoundingClientRect().x;
    var maxt=mint+area.offsetHeight-element.offsetHeight;
    var maxl=minl+area.offsetWidth-element.offsetWidth;
    if(maxt>screen.height-element.offsetHeight){
      maxt=screen.height-element.offsetHeight;
    }
    if(maxl>screen.width-element.offsetWidth){
      maxl=screen.width-element.offsetWidth;
    }
    if(newLeft<minl){
      newLeft=minl;
    }
    if(newLeft>maxl){
      newLeft=maxl;
    }
    element.down=0;
    if(newTop<mint){
      element.down=newTop-mint;
      newTop=mint;
    }
    if(newTop>maxt){
      element.down=newTop-maxt;
      newTop=maxt;
    }
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
    //console.log("down",element.down)
    typeof options.onDrag == "function" && options.onDrag();
  }

  function onmouseup(e) {
    element.style.position = position;
    element.style.top = (newTop-area.getBoundingClientRect().y+area.scrollTop) + "px";
    element.style.left = (newLeft-area.getBoundingClientRect().x+area.scrollLeft) + "px";
    document.onmouseup = null;
    document.onmousemove = null;
    document.scrollDown = null;
    typeof options.onDrop == "function" && options.onDrop();
  }
  function getData() {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }
}
function initResize(el,options){
  options=options||{};
  if(!el.elmove){
    el.elmove = document.createElement("div");
    document.body.append(el.elmove);
    el.elmove.setAttribute("style","position:fixed;display:none");
    el.elmove.innerHTML=`
      <div style="position:relative;width:20px;height:20px;">
      	<div style="position:absolute; border-bottom:3px solid #bbb; border-top:1px solid #fff; bottom:5px; right:5px; width:12px; height:0px; cursor:nwse-resize;"></div>
      	<div style="position:absolute; border-right:3px solid #bbb; border-left:1px solid #fff; bottom:5px;right:5px; height:12px; width:0px; cursor:nwse-resize"></div>
      </div>
      `;
    el.addEventListener("mouseover",e=>{
      el.style.background = "#ccc";
    });
    el.addEventListener("mouseleave",e=>{
      //el.style.background = "";
    });
    el.elmove.onmouseover=()=>{
      el.elmove.style.display = "";
    }
    el.elmove.onmouseleave=()=>{
      el.elmove.style.display = "none";
      el.style.border = "";
    }
    initDragDrop(el.elmove,{
      onStart: ()=>{
        el.sizes = {
          x: el.elmove.getBoundingClientRect().x,
          y: el.elmove.getBoundingClientRect().y,
          w: el.offsetWidth,
          h: el.offsetHeight,
        }
        console.log("onStart",el.elmove.sizes)
      },
      onDrop: ()=>{

      },
      onDrag: ()=>{
        el.style.width=(el.sizes.w+(el.elmove.getBoundingClientRect().x - el.sizes.x - 10))+"px";
        el.style.height=(el.sizes.h+(el.elmove.getBoundingClientRect().y - el.sizes.y - 10))+"px";
        //console.log("onDrag",event)
      }
    })
  }

  el.addEventListener("mousemove",e=>{
    el.elmove.style.display = "";
    el.elmove.style.top = (el.getBoundingClientRect().y+el.getBoundingClientRect().height-15)+"px";
    el.elmove.style.left = (el.getBoundingClientRect().x+el.getBoundingClientRect().width-15)+"px";
  });
  el.addEventListener("mouseleave",e=>{
    el.elmove.style.display = "none";
  });
}
function initDrag(element,options) {
  options=options||{};
  var zone=options.zone||element;
  var area=options.area||document.body;
  var mouseTop,mouseLeft,posTop,posLeft,newTop,newLeft,widthMove,heightMove;
  var position = element.style.position||"fixed";
  var timeout=2000;
  zone.onmousedown = onmousedown;
  element.style.width=element.offsetWidth+"px";
  function onmousedown(e) {
    e = e || window.event;
    e.preventDefault();

    mouseTop=e.y;
    mouseLeft=e.x;
    widthMove=0;
    heightMove=0;
    posTop = element.getBoundingClientRect().y;
    posLeft = element.getBoundingClientRect().x;
    newTop=posTop;
    newLeft=posLeft;
    //var zoneOffset = element.getBoundingClientRect();
    //console.log("e",e)

    element.style.top=(newTop)+"px";
    element.style.left=(newLeft)+"px";
    element.style.position = "fixed";
    document.onmouseup = onmouseup;
    document.onmousemove = onmousemove;
    document.scrollDown = scrollDown;
    document.scrollDown();
    typeof options.onStart == "function" && options.onStart();
  }
  function scrollDown(){
    var speed=Math.abs(element.down||0)||1;
    if(speed>7){
      area.scrollTop += element.down;
    }
    speed=speed/10;
    if(speed>20){
      speed==20;
    }
    setTimeout(()=>{
      if(typeof document.scrollDown=="function"){
        document.scrollDown();
      }
    }, 50)
  }
  function onmousemove(e) {
    e = e || window.event;
    e.preventDefault();

    widthMove=mouseTop-e.y;
    heightMove=mouseLeft-e.x;
    newTop=posTop-(widthMove);
    newLeft=posLeft-(heightMove);
    var mint=0+area.getBoundingClientRect().y;
    var minl=0+area.getBoundingClientRect().x;
    var maxt=mint+area.offsetHeight-element.offsetHeight;
    var maxl=minl+area.offsetWidth-element.offsetWidth;
    if(maxt>screen.height-element.offsetHeight){
      maxt=screen.height-element.offsetHeight;
    }
    if(maxl>screen.width-element.offsetWidth){
      maxl=screen.width-element.offsetWidth;
    }
    if(newLeft<minl){
      newLeft=minl;
    }
    if(newLeft>maxl){
      newLeft=maxl;
    }
    element.down=0;
    if(newTop<mint){
      element.down=newTop-mint;
      newTop=mint;
    }
    if(newTop>maxt){
      element.down=newTop-maxt;
      newTop=maxt;
    }
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
    //console.log("down",element.down)
    typeof options.onDrag == "function" && options.onDrag();
  }

  function onmouseup(e) {
    element.style.position = position;
    element.style.top = (newTop-area.getBoundingClientRect().y+area.scrollTop) + "px";
    element.style.left = (newLeft-area.getBoundingClientRect().x+area.scrollLeft) + "px";
    document.onmouseup = null;
    document.onmousemove = null;
    document.scrollDown = null;
    typeof options.onDrop == "function" && options.onDrop();
  }
  function getData() {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }
}


