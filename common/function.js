exports.timeFormat = function(time) {
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

