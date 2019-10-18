// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var image, interpreter, cachedInterpreter,displayForMainSqueak;
chrome.runtime.onInstalled.addListener((details) => {
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
   chrome.runtime.sendMessage(Object.extend({},request,{isExternal: true}),sendResponse);
  }); 
  interpreter = function(){
if(cachedInterpreter)return cachedInterpreter;
if(!displayForMainSqueak)return;
var vm = image.then((i) => new Squeak.Interpreter(i,displayForMainSqueak));
var run = (getQuit,thenDo) => {
vm.then(i => i.interpret(50,() => {getQuit().then((qf) => {if(!qf)return requestAnimationFrame(() => run(getQuit,thenDo)); thenDo()})}))

};
vm.then(vmv => {vmv.run = run;
cachedInterpreter = Promise.resolve(vmv);
});
return vm;
  };
chrome.runtime.sendMessage({type: 'welcome'},(response) => {


});
chrome.runtime.onMessage.addListener((message,sender,respond) => {
if(message.type == 'loadSqueak'){image = Promise.resolve(new Squeak.Image().readFromBuffer(message.data)); cachedInterpreter = undefimed;}

});
});
image = fetch(chrome.runtime.getURL('sqk.image')).then((t) => t.blob()).then((b) => b.arrayBuffer()).then((buf) => new Squeak.Image().readFromBuffer(buf));