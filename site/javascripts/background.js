// This will look for localStorage variables, if they are not found the
// response will contain an undefined value for the localStorage key
chrome.extension.onRequest.addListener(function(req, sender, sendRes) {
	sendRes({status: localStorage[req.localvar] || undefined });
});

// omnibox


var suggestions = [
	{ content: 'home', description: 'home: Foro principal', action:'' },
	{ content: 'unread', description: 'unread: Posts no leidos', action:'unread' },
	{ content: 'pm', description: 'pm: Mensages privados', action:'pm' }
];


chrome.omnibox.onInputEntered.addListener(function(str){
	
	// all actions go to specific parts of the website
	// if an action is not found, then do a google search
	var url = 'http://www.svcommunity.org/forum/',
		actions = {
			'home': url + '',
			'unread': url + 'unread',
			'pm': url +'pm'
		};
	
	if(actions.hasOwnProperty(str)){
		chrome.tabs.create({'url': actions[str]});
		return;
	}
	
	chrome.tabs.create({
        "url":"http://www.google.com/search?q=site%3Asvcommunity.org+" + str
    });

});

chrome.omnibox.onInputChanged.addListener(function(str, suggest){
    suggest(suggestions);
});