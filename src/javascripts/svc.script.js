
$(document).ready(function() {

	// Highlighting code with Google prettify 
    var pre = $('<pre></pre>').addClass('prettyprint').css({'fontSize':'1.2em !important'});
    $('code').removeClass('bbc_code').wrap(pre);
    prettyPrint();

    // Retrieve localStorage variables from the extension and use them in the
    // context of the content-scripts

    chrome.extension.sendRequest({localvar: "hideClutter"}, function(res) {
        var hideClutter =res.status || 'false',	
			// these are hidden by default to prevent the from flashing
		    hideelems = '.reportlinks, .stars, .postgroup, .icq.new_win,.addthis_button, #topic_icons, #display_jump_to';
        if(hideClutter === 'false'){
			$(hideelems).show();
		}
    });

    chrome.extension.sendRequest({localvar: "hideAds"}, function(res) {
		var hideAds =res.status || undefined;
		
		if(hideAds==='true'){
			$('#sp_block_45').hide().siblings('h3.catbg').hide();	
			$('#bb_unlock').parent().hide();
		}
	});

    // blacklist
    chrome.extension.sendRequest({localvar: "blacklist"}, function(res) {

        var blacklist = res.status;

        if (blacklist!==undefined) { 
			
            var users = blacklist.split(',');
            // get all headers containing usernames
            $(".poster h4").each(function(idx, el) {

                // Get user names by transversing the poster's profile link
                var username = $(el).find('a:eq(1)').text();
                for (var i = 0, t = users.length; i < t; i++) {
	
                    // hide post
                    if (username === users[i]) {
                        var $postwrapper = $(el).parents('.post_wrapper');
                        var originalhtml = $postwrapper.html();
                        $postwrapper.hide().parent().prepend(
                                $('<div>').addClass('troll')
										  .text(username + ' muted ')
										  .append($('<a>')
										  .attr('href', '#')
										  .text('ver post')
                                        )
                         );
                    }
                }
            });

            $('.troll a').toggle(function() {
                        $(this).text('ocultar post').parent().siblings('.post_wrapper').slideDown();
                    },function() {
                        $(this).text('ver post').parent().siblings('.post_wrapper').slideUp();
                    });
        }
    });


    // Google SVC Search
    var $searchForm = $('#search_form');
    $searchForm.submit(function() {
        var inputstr = $(this).find('.input_text').val() || $('.user .greeting span').text() + ' is AWESOME',
                searchstr = "http://www.google.com/search?q=site%3Asvcommunity.org+" + inputstr;
        window.open(searchstr);
        return false;
    });

    var keynav = function() {
        var _elements,
                _current = -1,
                _max,
                _min = 0,
                _class,
                _enableNextPrev = true,
                _animation_lock = false; 
        var key = {
            j:74,
            k:75
        };

        // check if the user is typing in a text/textarea input
        var activeInputs = function() {
            return $('input:focus').length +
                    $('textarea:focus').length;
        };

        // adds a class to the current element and scrolls to its position
        var selectElement = function() {
            var $cEl = $(_elements[_current]);
            $cEl.addClass(_class);
            var $cElx = $cEl.position().top - $(window).height() / 2 + $cEl.height() / 2;
            $('html, body').animate({scrollTop:$cElx}, 250);
        };

        // removes class
        var deSelectElement = function() {
            $(_elements[_current]).removeClass(_class);
        };

        var bind= function(keyCode, fun) {
            $(document).keyup(function(e) {
                if (activeInputs() === 0 && _animation_lock === false) {
                    if(e.which === keyCode){	fun();	}
                }
            });
        };

        return{
            init: function(options) {
                _elements = options.elements;
                _max = _elements.length - 1;
                _class = options.selectedClass;
                bind(key.j,this.next);
                bind(key.k,this.prev);
            },
            next: function() {
                if(_enableNextPrev){
                    deSelectElement();
                    _current = (_current >= _max) ? 0 : _current + 1;
                    selectElement();
                }
            },
            prev: function() {
                if(_enableNextPrev){
                    deSelectElement();
                    _current = (_current <= _min) ? _max : _current - 1;
                    selectElement();
                }
            },
            // extending functionality by adding more keyboard events
            extend:bind,
            enableNextPrev:function(){
                _enableNextPrev = true;
            },
            disableNextPrev:function(){
                _enableNextPrev = false;
            }
        };
    }();

    // check whether the current page is the main forums or a child forum
    var elements = location.pathname.match(/index/) !== null ?
            $('.windowbg2') : // Main Forums
            $('#childboards tr.windowbg2, .table_grid tr:gt(1)'); // Child Forums

    // unread posts & private messages
	if(location.pathname.match(/unread|pm/)!==null){
		elements = $('.table_grid tr:gt(0)');
	}

    keynav.init({
        elements : elements,
        selectedClass : 'svcselected'
    });

    // if we are inside a topic disable next prev navigation
    // and use `j` and `k` for scrolling down and up
    if($('#forumposts').length !==0){	
      keynav.disableNextPrev();	

      keynav.extend(74, function(){
        var y = $(window).scrollTop();
        $('html, body').animate({scrollTop: y + 200}, 200);
      });

      keynav.extend(75, function(){
        var y = $(window).scrollTop();
        $('html, body').animate({scrollTop: y - 200}, 200);
      });
    }

    // Open - o
    keynav.extend(79, function() {
        var sEl = $('.svcselected');

        if (sEl.length === 0) return false;

        // check if the selected item is a subject
        if (sEl.has('a.subject').length > 0){
            location.href = sEl.find('a.subject').attr('href');
            return false;
        }

        // topic with multiple pages
        if (sEl.has('a.navPages').length > 0){
            window.open(sEl.find('a.navPages:last').attr('href'));
            return false;
        }

        // special case when there are multiple pages but no navPages class
        if (sEl.has('.subject small a').length > 0) {
            var links = sEl.find('.subject small a');
            // check if the last link has the ?all identifier
            var lastLink = links.last().attr('href');

            window.open(lastLink.match(/\?all/) ? links[links.length-2] : lastLink);

            return false;
        }

        // otherwise open the first link
        window.open(sEl.find('a:first').attr('href'));


    });

    // Unread - u
    keynav.extend(85, function() {
        window.location = 'http://www.svcommunity.org/forum/unread/';
    });

    // Private messages - p
    keynav.extend(80,function(){
      window.location = 'http://www.svcommunity.org/forum/pm/';
    });

    // Home - h
    keynav.extend(72, function(){
        window.location = 'http://www.svcommunity.org/forum/index.php';
    });

    // Activate Search - s
    keynav.extend(83, function(){
        var el = $('#search_form').find('.input_text');
        $('html, body').animate({scrollTop:el.position().top}, 'fast');
        el.val('').focus();
    });

    // ESC - bring focus back to document
    keynav.extend(29,function(){
        // this doesn't work from text inputs because I've disabled key events while they are on focus
		// this would need to be changed in the keynav function
        $('html, body').focus();
    });

    // youtube fix
    // http://www.svcommunity.org/forum/galerias-%29/el-video-mas-epico-que-he-visto-en-monton-de-tiempo/

    // Regular expressions for YouTube BBCode Tags
    var regTube = {
      tag       : /\[youtube\]([^\[]*)\[\/youtube\]/g,
      idFromUrl : /v=([\w\-]{11})/,
      id        : /\]([\w\-]{11})\[/
    };

    var embedTube = function(id){
      return '<object width="560" height="349">'+
               '<param name="movie" value="http://www.youtube.com/v/' + id +
                 '?version=3&amp;hl=en_US"></param><param name="allowFullScreen" '+
                 'value="true"></param><param name="allowscriptaccess" value="always">'+
               '</param>'+
               '<embed src="http://www.youtube.com/v/'+ id +
                 '?version=3&amp;hl=en_US" type="application/x-shockwave-flash" '+
                 'width="560" height="349" allowscriptaccess="always" '+
                 'allowfullscreen="true">'+
               '</embed>'+
             '</object>';
    };

    $('.post').each(function(i,e){

      var html   = $(e).html(),
      tags = html.match(regTube.tag);

      // This will parse video ids from the tags
      if(tags !== null){

        for(var k=0, l=tags.length; k<l; k++){
          var id = regTube.idFromUrl.exec(tags[k]) || regTube.id.exec(tags[k]);

          // remove tags and use ids to embed youtube videos
          html = html.replace(tags[k], embedTube(id[1]));
        }
        // replace post's html
        $(e).html( html );
      }

      // Patch to bypass video limit by converting links to embedded videos
      var $links = $(e).find('.bbc_link').not('.aeva_link');
      $links.each(function(i, link){
        var $link = $(link);
        var id = regTube.idFromUrl.exec($link.attr('href')) || 'failed';
        if(id !== 'failed'){
          // the video will be wrapped in a new div
          $('<div>').html(embedTube(id[1])).insertBefore($link);
        }
      });
    });
});
