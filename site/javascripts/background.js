// This will look for localStorage variables, if they are not found the
// response will contain an undefined value for the localStorage key
chrome.extension.onRequest.addListener(function(req, sender, sendRes) {
	sendRes({status: localStorage[req.localvar] || undefined });
});

// omnibox

chrome.omnibox.onInputEntered.addListener(function(str){
	chrome.tabs.create({
        "url":"http://www.google.com/search?q=site%3Asvcommunity.org+" + str
    });
});
