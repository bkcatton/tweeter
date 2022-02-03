$(document).ready(function() {
  // --- our code goes here ---
  const $inputField = $('#tweet-text');
  $inputField.on('input', () => {
    // get the input field's value
    const inputValue = $inputField.val();
    //this will allow us to count down from 140
    const checkVal = 140 - inputValue.length;
    //setting our output equal to the output tag in html
    const $outputField = $('#output-text');
    //changing the output field IN HTML to equal the checkVal value
    $outputField.html(checkVal);
    //logic to change the counter to red when no characters are remaining
    if (checkVal < 0) {
    $outputField.css({'color': 'red'})
    } else if (checkVal >= 0) {
      $outputField.css({'color': 'grey'})
    }
  });
});