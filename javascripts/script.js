SC.initialize({
  client_id: '74e750f2728e9c5bba35a36bf889001b'
});

$(document).ready(function() {
  SC.get('/tracks', { genres: 'soul' }, function(tracks) {
    $(tracks).each(function(index, track) {
      $('#results').append($('<li></li>').html(track.title + ' - ' + track.genre));
    });
  });
});