$(document).ready(function() {

  var googUrl = 'http://www.google.com/search?q=site%3Asvcommunity.org+',
      homeUrl = 'http://www.svcommunity.org/forum/';

  // Searching SVC with google
  $('#svc-search').submit(function(e) {
    chrome.tabs.create({
        "url": googUrl + $('#svc-search-txt').val()
    });
    e.preventDefault();
  });

  // Loading Recent Posts
  $('#svc-recent').load(homeUrl + 'index.php #adk_block_5 td:odd:lt(10)', function(){
    var temp = [];
    // extract the first 10 td elements from tables and place them inside div
    // elements
    $(this).find('td').each(function(i, e){
      temp.push('<div>' + $(e).html() + '</div>');
    });
    $(this).html(temp.join(' '));
  });

  // Open links in the browser and not inside the popup
  $('#svc-recent').delegate('a', 'click', function(e) {
    chrome.tabs.create({    "url":e.currentTarget.href        });
    e.preventDefault();
  });

});
