$(document).ready(function() {

    // Searching SVC with google
    $('#svc-search').submit(function(e) {
        chrome.tabs.create({
            "url":"http://www.google.com/search?q=site%3Asvcommunity.org+" + $('#svc-search-txt').val()
        });
        e.preventDefault();
    });

    // Loading Recent Posts
    $('#svc-recent').load('http://www.svcommunity.org/forum/index.php #sp_block_9 .sp_block', function(){
		// remove hr 
		$('<div class=\'svc-separator-top\'></div><div class=\'svc-separator\'></div>').insertAfter($('hr').hide());
	});

	

    // unread Messages
//    $.ajax({
//        url:'http://www.svcommunity.org/forum/unread',
//        cache:'false',
//        success: function(html){
//            $(html).find('.subject:lt(10)').each(function(i,e){
//                //todo parse data into html format
//                console.log(e);
//            });
//        }
//    });
//    $('#svc-unread').load('http://www.svcommunity.org/forum/unread .subject div');

    // Open links in the browser and not inside the popup
    $('#svc-recent').delegate('a', 'click', function(e) {
        chrome.tabs.create({    "url":e.currentTarget.href        });
        e.preventDefault();
    });

});