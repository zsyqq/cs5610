$(function() {
  $('.del').click(function(e) {
    var target = $(e.target)
    var id = target.data('id')
    var tr = $('.item-id-' + id)

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/list?id=' + id
    })
    .done(function(results) {
      if (results.success === 1) {
        if (tr.length > 0) {
          tr.remove()
        }
      }
    })
  })

  $('#search-btn').on('click',function(e){
    var videoid = $("#search-txt").val();
    var matches = videoid.match(/^http:\/\/www\.youtube\.com\/.*[?&]v=([^&]+)/i) || videoid.match(/^http:\/\/youtu\.be\/([^?]+)/i);
    if (matches) {
      videoid = matches[1];
    }
    // if (videoid.match(/^[a-z0-9_-]{11}$/i) === null) {
    //   $("<p style='color: #F00;'>Unable to parse Video ID/URL.</p>").appendTo("#video-data-1");
    //   return;
    // }
    $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
          key: "AIzaSyD9kAseErgb-EmLm5HHO0tXLgh9VGGnC5c",
          part: "snippet,statistics",
          id: videoid
        }, function(data) {
          // if (data.items.length === 0) {
          //   $("<p style='color: #F00;'>Video not found.</p>").appendTo("#video-data-1");
          //   return;
          // }
          $('#inputTitle').val(data.items[0].snippet.title)
          // $('#inputDoctor').val(data.items[0].snippet.channelTitle)
          // $('#inputCountry').val(data.countries[0])
          $('#inputPoster').val(data.items[0].snippet.thumbnails.medium.url.replace("https","http"))
          $('#inputYear').val(data.items[0].snippet.publishedAt)
          $('#inputSummary').val(data.items[0].snippet.description)
          $('#inputFlash').val(videoid)
          $('#viewRate').val(data.items[0].statistics.viewCount)
          $('#FavoriteRate').val(data.items[0].statistics.favoriteCount)
          $('#LikeRate').val(data.items[0].statistics.likeCount)
          $('#DislikeRate').val(data.items[0].statistics.dislikeCount)
      

          // $('<p></p>').text(data.items[0].statistics.viewCount).appendTo('#viewRate')
          // $('<p></p>').text(data.items[0].statistics.favoriteCount).appendTo('#FavoriteRate')
          // $('<p></p>').text(data.items[0].statistics.likeCount).appendTo('#LikeRate')
          // $('<p></p>').text(data.items[0].statistics.dislikeCount).appendTo('#DislikeRate')
          



        }).fail(function(jqXHR, textStatus, errorThrown) {
          $("<p style='color: #F00;'></p>").text(jqXHR.responseText || errorThrown).appendTo("#video-data-1");})



  })


  // $('#search-txt').blur(function() {
  //   var douban = $(this)
  //   var id = douban.val()

  //   if (id) {
  //     $.ajax({
  //       url: 'https://api.douban.com/v2/movie/subject/' + id,
  //       cache: true,
  //       type: 'get',
  //       dataType: 'jsonp',
  //       crossDomain: true,
  //       jsonp: 'callback',
  //       success: function(data) {
  //         $('#inputTitle').val(data.title)
  //         $('#inputDoctor').val(data.directors[0].name)
  //         $('#inputCountry').val(data.countries[0])
  //         $('#inputPoster').val(data.images.large)
  //         $('#inputYear').val(data.year)
  //         $('#inputSummary').val(data.summary)
  //       }
  //     })
  //   }
  // })
})