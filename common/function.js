exports.timeFormat = function(time) {
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

exports.getPagination = function(currentPage, totalPage) {
    var pagination = {};

    if(currentPage === 1) {
        pagination.first = { href:"javascript:;", state: 'disabled'};
        pagination.pre = { href:"javascript:;", state: 'disabled'};
    } else {
        pagination.first = { href:'?page=1', state: ''};
        pagination.pre = { href:'?page=' + (currentPage - 1), state: ''};
    }

    if(currentPage === totalPage) {
        pagination.next = { href:"javascript:;", state: 'disabled'};
        pagination.last = { href:"javascript:;", state: 'disabled'};
    } else {
        pagination.next = { href:'?page=' + (currentPage + 1), state: ''};
        pagination.last = { href:'?page=' + totalPage, state: ''};
    }

    if(currentPage < 3) {
        startPage = 1;
    } else {
        startPage = currentPage - 2;
    }
    if((totalPage - startPage) < 5) {
        startPage = totalPage - 4;
    }
    if(startPage < 1) {
        startPage = 1;
    }
    pagination.pages = []; 
    var j = (startPage + 4) < totalPage ? startPage + 4 : totalPage;
    for(var i = startPage; i <= j; i++) {
        if(currentPage === i) {
            pagination.pages.push({ href: '?page=' + i, count: i, state: 'active' });
        } else {
            pagination.pages.push({ href: '?page=' + i, count: i, state: '' });
        }
    }
    return pagination;
}

