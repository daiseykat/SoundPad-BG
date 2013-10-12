$(document).ready(function(){
    var isiOS = navigator.userAgent.match(/iPad|iPod|iPhone/i) != null;

    if(isiOS) {
        myScroll = new iScroll('wrapper');
    }
});
