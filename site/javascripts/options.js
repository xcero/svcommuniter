Array.prototype.clean = function(token) {
    for (var i = 0, t = this.length; i < t; i++) {
        if(this[i] === token){ this.splice(i--, 1); }
    }
    return this;
};

var validate = function(str) {
    var m = str.match(/\"/);
    return !(m !== null && m.length > 0);
};


$(document).ready(function() {

    // get current blocked users and add them to text area
    var list = localStorage.blacklist;
    if (list) {
        $('#svc-block-users').val(list.replace(/,/g, '\n'));
    }

    var hideClutter = localStorage.hideClutter || 'false';
    if (hideClutter === 'true') {
        // check
        $('#clutter').attr('checked', 'true');
    } else {
        // uncheck
        $('#clutter').removeAttr('checked');
    }

    $('#clutter').change(function() {
        localStorage.hideClutter = $('#clutter').is(':checked');
    });

    // Black List
    $(document).keyup(function() {
        if ($('#svc-block-users:focus').length > 0) {
            var list = $('#svc-block-users').val();
            list = list.replace(/\n/g, ',');
            if (validate(list)) {
                $('#svc-block-users').removeClass('invalid');
                // create array from list, clean it and join it back
                list = ((list.split(',')).clean('')).join(',');
                //console.log(list);
                localStorage.blacklist = list;
            } else {
                $('#svc-block-users').addClass('invalid');
            }
        }
    });
});