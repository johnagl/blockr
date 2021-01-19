/*global chrome*/

class BlockedUrlService {

    constructor() {
        this.blocked = {};
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                console.log("request " + request.type)
                if(request.type === "added website") {
                  this.reinit();
                }
            });
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                console.log("request " + request.type)
                if(request.type === "remove website") {
                  this.reinit();
                }
            });
        // this.initBlockList();
    }

    initBlockList = () => {
        chrome.storage.sync.get('blocked', (result) => {
            this.blocked = Object.assign({}, result.blocked);
            chrome.webRequest.onBeforeRequest.addListener(
              (details) => {
                return this.setBlocked(details);
              },  
              {urls: ["<all_urls>"]},
              ["blocking"]
            );
        });
    }

    setBlocked = (details) => {
        let url = details.url;
        for (const [blockedSite, isTrue] of Object.entries(this.blocked)) {
          let regex = new RegExp(blockedSite);
          if (isTrue && regex.test(url)) {
            return {cancel: true};
          }
        }
    }

    reinit = () => {
        this.initBlockList();
    }

}

export default BlockedUrlService;