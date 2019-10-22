// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var image, interpreter, cachedInterpreter,displayForMainSqueak, tm_handlers = [],srender;
async function tm_onData(dat){
var array = [];
for(var v in tm_handlers){
array.push(await tm_handlers[v](dat));

};
return array
};
async function rmain_vx(render){
var sresult = await srender(render);
var sterm = await render('terminal',{onData: tm_onData});
return await render('windowingSystem',{defaultWindows: [sterm,sresult]})
};
chrome.runtime.onInstalled.addListener((details) => {
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
   chrome.runtime.sendMessage(Object.extend({},request,{isExternal: true}),sendResponse);
  }); 
  interpreter = function(){
if(cachedInterpreter)return cachedInterpreter;
var vm = image().then((i) => i && displayForMainSqueak && new Squeak.Interpreter(i,displayForMainSqueak));
var run = (getQuit,thenDo) => {
vm.then(i => i.interpret(50,() => {getQuit().then((qf) => {if(!qf)return requestAnimationFrame(() => run(getQuit,thenDo)); thenDo()})}))

};
vm.then(vmv => {
  if(!vmv)return;
vmv.run = run;
cachedInterpreter = Promise.resolve(vmv);
});
return vm;
  };
chrome.runtime.sendMessage({type: 'welcome'},(response) => {


});
chrome.runtime.onMessage.addListener((message,sender,respond) => {
if(message.type == 'loadSqueak'){image = Promise.resolve(new Squeak.Image().readFromBuffer(message.data)); cachedInterpreter = undefimed;}
if(message.type == 'term_onData'){tm_onData(message.data).then((vals) => vals.join('')).then(respond)};
});
});
image = () => fetch(chrome.runtime.getURL('sqk.image')).catch((err => undefined)).then((t) => t && t.blob()).then((b) => b && b.arrayBuffer()).then((buf) => buf && new Squeak.Image().readFromBuffer(buf));