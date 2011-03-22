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
	
	// actions execute functions which brings flexibility
	var url = 'http://www.svcommunity.org/forum/',
	actions = {
		'home': function(){
			chrome.tabs.create({'url': url+'index.php'});
		},
		'unread': function(){
			chrome.tabs.create({'url': url+'unread'});
		},
		'pm': function(){
			chrome.tabs.create({'url': url+'pm'});
		}
	};
	
	if(actions.hasOwnProperty(str)){
		actions[str]();
	}else{
		chrome.tabs.create({"url":"http://www.google.com/search?q=site%3Asvcommunity.org+" + str });
	}
});

chrome.omnibox.onInputChanged.addListener(function(str, suggest){
    suggest(suggestions);
});