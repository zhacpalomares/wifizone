$(document).ready(function(){

  $('body').keydown(function(event) {
    var which = event.which;

    switch (which) {
      case 49:
        sendCoinValue(1);
        break;
      case 53:
        sendCoinValue(5);
        break;
      case 48:
        sendCoinValue(12);
        break;
      case 65:
        getVoucher('A');
        break;
      case 83:
        getVoucher('B');
        break;
      case 68:
        getVoucher('C');
        break;
    }

  });

  function showOverlay(text, time, callback) {
    $('#overlay').css('display', 'block');
    $('.overlay-container h1').text(text);

    setTimeout(function(){ callback(); }, time);
  };

  function hideOverlay() {
    $('#overlay').css('display', 'none');
    $('.overlay-container h1').text('');
  };

  function showErrorOverlay(text, time, callback) {
    $('#errorOverlay').css('display', 'block');
    $('.error-overlay-container h1').text(text);

    setTimeout(function(){ callback(); }, time);
  };

  function hideErrorOverlay() {
    $('#errorOverlay').css('display', 'none');
    $('.error-overlay-container h1').text('');
  };


  function getVoucher(plan) {
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/vouchers/verify/" + plan,
      success: function(response) {
        if (response && response > 0) {
          printVoucher(plan);
        } else {
          showErrorOverlay('NO VOUCHER AVAILABLE', 3000, function(){
            hideErrorOverlay();
          });
        }
      }
    })
  }

  function printVoucher(plan) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/vouchers/" + plan,
      success: function(response) {
        showOverlay('Printing your voucher...', 5000, function(){
          displayCredit();
          hideOverlay();
        });
      },
      error: function(response) {
        var jsonRes = response.responseJSON;
        showErrorOverlay(jsonRes.message, 3000, function(){
          hideErrorOverlay();
        });
      }
    })
  }

  function sendCoinValue(value) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/credits",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ 'coin': value }),
      success: function(response) {
        displayCredit();
      }
    })
  }

  function displayCredit() {
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/credits",
      success: function(response) {
        $('#value').text(response.total_credit);
      }
    })
  }

  displayCredit();

});
