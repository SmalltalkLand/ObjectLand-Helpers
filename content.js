var canvases = {};
function cact(canvas,request,respond){
if(request.type == 'set'){respond(canvas[request.prop] = request.value); return false};
if(request.type == 'get'){respond(canvas[request.prop]); return false};
if(request.type in canvas){respond(canvas[request.type](...request.args)); return false}; 

};
function canvas(request,respond,url){
    if(request.type == 'adopt' && url == window.location.href){canvases[request.id] = $(request.sel).get(0).getContext('2d'); respond({sucess: true}); return false};
if(!request.id in canvases){return false};

return cact(canvases[request.id],request,respond)
};
function block(req,res){
var jQ = $(req.id);
var result = jQ[req.sel](...req.args);
if(result == jQ)return false;
res(result);

};
function welcome(f){
var elem = $('<div>Welcome To The ObjectLand Extension</div>');
$('body').append(elem);
elem.dialog({});
elem.on('dialogclose',(ev,ui) => {f({})});

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
if(request.type == 'canvas')return canvas(request.data,respond,request.src);
if(request.type == 'block')return block(request,respond);
if(request.type == 'welcome' && !request.isExternal){welcome(respond); return true};
});
Vue.component('desktopManager',{
    data: () => {return {windows: []}},
    props: ['defaultWindows','debug'],
    mounted(){this.$on('olmessage',(evt) => {
var ce = new CustomEvent(evt.name);
ce.data = evt.data;
this.$el.dispatchEvent(ce);

    });

},
    computed: {realWindows(){return this.windows.concat(this.defaultWindows).filter((w) => w.isVisible).map((w) => w.vueComponent || w)}},
    template: '<div><component v-for = "win in realWindows" :is = "win" :debug = "debug"></component></div>',
    });
Vue.component('chromeDesktopManager',{
template: '<desktopManager ref = "desktop" :debug = "debug" :defaultWindows = "defaultWindows"></desktopManager>',
props: ['defaultWindows','debug'],
mounted(){
chrome.runtime.omMessage.addListener(this.$f = (evt,_,respond) => {this.$refs.desktop.$emit('olmessage',{name: 'olmessage',data: evt})})

},
beforeDestroy(){
    chrome.runtime.onMessage.removeListener(this.$f);

},
})
$(function(){
chrome.storage.sync.get(['welcome'],function(result){
if(result.welcome === undefined)welcome((v) => {chrome.storage.sync.set({welcome: v})})
var el;
new Vue({
    data: {debug: false},
el: (el = $('.ol.link.0').add($('<div class = "ol link 0"></div>')).append('<chromeDesktopManager :defaultWindows = "[]" :debug = "debug"></chromeDesktopManager>').get(0)),
});
});
}) 