/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  //Setting up the container for all the tweets to be displayed
  const $allTweets = $('#container');
//rendering all of the tweets by calling the create tweets function
  const renderTweets = function (tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container

    //emptying the container so tweets do not double up
    const $errorMessageContainer = $('.errorMessageContainer');
    $errorMessageContainer.empty();
    $allTweets.empty();

    //reset the character count form
    const $outputField = $('#output-text');
    $outputField.html('140');

    for (let tweet of tweets) {
      const $anotherTweet = $createTweets(tweet);
      $allTweets.append($anotherTweet);
    }
  };
//createTweets adds all of the html
  const $createTweets = (tweet) => {
    //creates a tweet based on data present
    const $flag = $('<i>').addClass("fas fa-flag");
    const $like = $('<i>').addClass("fas fa-heart");
    const $retweet = $('<i>').addClass("fas fa-retweet");
    const $icons = $('<div>').append($flag, $retweet, $like )
    const $date = $('<output>').text(timeago.format(tweet['created_at']));
    const $footer = $('<footer>').addClass('footer');
    $footer.append($date, $icons);

    const $textBody = $('<p>').text(tweet['content']['text']);
    const $border = $('<hr>');
    const $tweetBody = $('<section>').addClass("tweet-body");
    $tweetBody.append($textBody, $border);

    const $avatar = $('<img>').attr("src", tweet['user']['avatars']);
    const $handle = $('<h5>').text(tweet['user']['handle']);
    const $name = $('<h4>').text(tweet['user']['name']);
    const $avName = $('<div>').addClass('avName');
    $avName.append($avatar, $name);
    const $header = $('<header>');
    $header.append($avName, $handle);

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

  
  //Targeting the submit button for a tweet 
  const $submitButton = $('#submit-tweet'); 

  //on tweet button submit do this
  $submitButton.submit( function (event) {
    console.log("button worked", $(this).serialize());
    
    //getting the character count
    const $inputField = $('#tweet-text');
    const inputValue = $inputField.val();
    const inputLength = inputValue.length;

    event.preventDefault();
    const text = $(this).serialize();

    //defining error messages etc for the character count
    if (inputLength <= 0 || inputLength > 140) {
      
      const $errorMessageContainer = $('.errorMessageContainer');
      const $errorMessage = $('<h5>').text("Must be between 1 and 140 characters").addClass('errorMessage');

      $errorMessageContainer.empty();
      $errorMessageContainer.append($errorMessage).slideDown( 100 , function() {
        // Animation complete.
      });

      event.reset();
      return;
    }
   
    //if tweet is in character range, the post method below will run
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
