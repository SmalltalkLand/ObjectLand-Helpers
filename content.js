var canvases = {};
function cact(canvas,request,respond){
if(request.type == 'set'){respond(canvas[request.prop] = request.value); return false};
if(request.type == 'get'){respond(canvas[request.prop]); return false};
if(request.type in canvas){respond(canvas[request.type](...request.args)); return false}; 

};
function canvas(request,respond){
    if(request.type == 'adopt'){canvases[request.id] = $(request.sel).get(0).getContext('2d'); respond({sucess: true}); return false};
if(!request.id in canvases){respond({error: true}); return false};

return cact(canvases[request.id],request,respond)
};
function block(req,res){
var jQ = $(req.id);
var result = jQ[req.sel](...req.args);
if(result == jQ)return false;
res(result);

};
chrome.runtime.onMessage.addListener((request,_,respond) => {
if(request.type == 'dialog' && request.id.beginsWith(window.location.href)){
    var index = request.id.indexOf('#');
    var id = request.id.substring(index + 1);
    $('#' + id).dialog(request.data).on('dialogopen',(ev,ui) => {respond(ev)})
return true;
};
if(request.type == 'onload' && request.data == window.location.href){
$((v) => respond({}))
    return true;
};
if(request.type == 'canvas')return canvas(request.data,respond);
if(request.type == 'block')return block(request,respond);
});
$(function(){


}) 