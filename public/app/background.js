/*global chrome*/

// TODO: Refactor/Modularize code, use classes?

// var url;
var blocked = {};

function initBlockList(){
  console.log("initBlockList called");
  chrome.storage.sync.get('blocked', (result) => {
      blocked = Object.assign({}, result.blocked);
      console.log(`result.blocked: ${result.blocked}`);
      console.log(`blocked ${JSON.stringify(blocked)}`);
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return choserino(details); },
        {urls: ["<all_urls>"]},
        ["blocking"]
      );
  });
}

initBlockList();

// function setUrl(){
//   chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
//     url = tabs[0].url;
//     return {cancel: true};
//   });
// }


function reinit() {
    initBlockList();
}

function choserino(details){
    let url = details.url;
    console.log(`url ${url}`)
    for (const [blockedSite, isTrue] of Object.entries(blocked)) {
      console.log(`for ${blockedSite}`);
      console.log(`isTrue ${JSON.stringify(isTrue)}`);
      var regex = new RegExp(blockedSite);
      if (isTrue && regex.test(url)) {
        console.log("return cancel true");
        return {cancel: true};
      }
    }
}

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        console.log("request " + request.type)
        if(request.type === "added website") {
          console.log("added website");
          reinit();
        }
});

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {

        if(request.type === "remove website") {
          console.log("remove website")
          reinit();
        }
});