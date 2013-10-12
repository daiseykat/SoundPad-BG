SC.initialize({
  client_id: '74e750f2728e9c5bba35a36bf889001b'
});

$(document).ready(function() {
    SC.get('/tracks/293', function(track)
    {
        $('#player').html(track.title);
    });
});