/*global chrome*/

// TODO: Refactor this

let blocked = {};

const initBlockList = () => {
  chrome.storage.sync.get('blocked', (result) => {
      blocked = Object.assign({}, result.blocked);
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return setBlocked(details); },
        {urls: ["<all_urls>"]},
        ["blocking"]
      );
  });
}

const reinit = () => {
    initBlockList();
}

const setBlocked = (details) => {
    let url = details.url;
    for (const [blockedSite, isTrue] of Object.entries(blocked)) {
      let regex = new RegExp(blockedSite);
      if (isTrue && regex.test(url)) {
        return {cancel: true};
      }
    }
}

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        console.log("request " + request.type)
        if(request.type === "added website") {
          reinit();
        }
});

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if(request.type === "remove website") {
          reinit();
        }
});

initBlockList();