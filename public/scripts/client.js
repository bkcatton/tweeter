/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  const $allTweets = $('#container');

  const renderTweets = function (tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (let tweet of tweets) {
      const $anotherTweet = $createTweets(tweet);
      $allTweets.append($anotherTweet);
    }
  };

  const $createTweets = (tweet) => {
    //creates a tweet based on data present
    const $likeRetweet = $('<output>').text('flag, retweet');
    const $date = $('<output>').text(timeago.format(tweet['created_at']));
    const $footer = $('<footer>').addClass('footer');
    $footer.append($date, $likeRetweet);

    const $textBody = $('<p>').text(tweet['content']['text']);
    const $border = $('<hr>');
    const $tweetBody = $('<section>').addClass("tweet-body");
    $tweetBody.append($textBody, $border);

    const $avatar = $('<img>').attr("src", tweet['user']['avatars']);
    const $handle = $('<h5>').text(tweet['user']['handle']);
    const $header = $('<header>');
    $header.append($avatar, $handle);

    const $fullTweet = $('<article>').addClass('tweets');
    $fullTweet.append($header, $tweetBody, $footer);

    return $fullTweet;
  };

  //calling the main rendering function/ getting the tweets from database
  $.ajax({
    url: 'http://localhost:8080/tweets',
    method: 'GET',
    dataType: 'json',
    success: (data) => {
      console.log('this request succeeded and here\'s the data', data);
      renderTweets(data);
    },
    error: (error) => {
      console.log('this request failed and this was the error', error);
    }
  });

  

  const $submitButton = $('#submit-tweet'); 

  //on tweet button submit do this
  $submitButton.submit( function (event) {
    console.log("button worked", $(this).serialize());
    
    const $inputField = $('#tweet-text');
    const inputValue = $inputField.val();
    const inputLength = inputValue.length;

    event.preventDefault();
    const text = $(this).serialize();

    if (inputLength <= 0 || inputLength > 140) {
      const $errorMessage = $('<h5>').text("Error too many or not enough cvhars");
      const $errorMessageInsert = $('<article>');
      $errorMessageInsert.append($errorMessage);
      const $errorMessageContainer = $('#container');
      $errorMessageContainer.append($errorMessageInsert);


      event.reset();
      return;
    }
    
    $.ajax({
      url: 'http://localhost:8080/',
      method: 'POST',
      data: text,
      success: (text) => {
        console.log('this request succeeded and here\'s the data', text);

        $.ajax({
          url: 'http://localhost:8080/tweets',
          method: 'GET',
          dataType: 'json',
          success: (data) => {
            console.log('this request succeeded and here\'s the data', data);
            renderTweets(data);
          },
          error: (error) => {
            console.log('this request failed and this was the error', error);
          }
        });



      },
      error: (error) => {
        console.log('this request failed and this was the error', error);
      }
    });
    $submitButton.trigger("reset");
  });

});
