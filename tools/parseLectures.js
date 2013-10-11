var result = [];
$('.hall-schedule__talk-name > .b-link').each(function() {
  var url = $(this).attr('href');
  $.ajax({
    url: url,
    success: function(res) {
      var html = $.parseHTML(res);
      var title = $('.title_type_h1:first', html).text();
      var name = $('.username__name:first', html).text();
      var avatar = $('.username__icon_type_big:first', html).css('background-image').match(/\(([^)]+)/)[1];
      var description = $('.static-text > p:first', html).text();
      var presentation_static_url = $('.static-text > p:eq(1) > a', html).attr('href');
      var video_static_url = $('.static-text > p:eq(2) > a', html).attr('href');
      var video_url = $('.player:first', html).attr('src');
      var presentation_url = $('.player:last', html).attr('src');
      result.push({
        title: title,
        name: name,
        avatar: avatar,
        description: description,
        presentation_static_url: presentation_static_url,
        video_static_url: video_static_url,
        video_url: video_url,
        presentation_url: presentation_url
      });
      if (result.length === 41) {
        console.log(JSON.stringify(result));
      }
    }
  });
});