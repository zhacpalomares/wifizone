$(document).ready(function(){

  var gamepad = new Gamepad();

  var alive = false;
  var coin = 0;
  var time = null;
  var pulseCount = 0;
  var cleared = true;
  var disabledButton = false;
  var voucherBlured = false;
  var plans = [];

  function setPulseCount() {
    pulseCount++;
    startTime();
  }

  async function startTime() {
    if (cleared == true) {
      cleared = false;

      setTimeout(function(){
        var totalPulse = pulseCount;
        sendTotalPulse(totalPulse);
        pulseCount = 0;
        cleared = true;
      }, 500)
    }
  }

  function sendTotalPulse(pulses) {
    if (pulses >= 1 && pulses <= 1) {
      sendCoinValue(1);
    } else if (pulses >= 2 && pulses <= 2) {
      sendCoinValue(5);
    } else if (pulses >= 3 && pulses <= 3) {
      sendCoinValue(12);
    }
  }

  gamepad.on('press', 'button_1', () => {
    if (disabledButton == false) {
      getVoucher('B');
    } else if (disabledButton == true && voucherBlured == true) {
      removeBlur();
    } else if (disabledButton == true && voucherBlured == false) {
      hideOverlay();
    }
  });

  gamepad.on('press', 'button_2', () => {
    if (disabledButton == false) {
      getVoucher('C');
    } else if (disabledButton == true && voucherBlured == true) {
      removeBlur();
    } else if (disabledButton == true && voucherBlured == false) {
      hideOverlay();
    }
  });

  gamepad.on('press', 'button_3', () => {
    sendCoinValue(1);
  });

  gamepad.on('press', 'button_4', () => {
    if (disabledButton == false) {
      getVoucher('A');
    } else if (disabledButton == true && voucherBlured == true) {
      removeBlur();
    } else if (disabledButton == true && voucherBlured == false) {
      hideOverlay();
    }
  });

  // $('body').keydown(function(event) {
  //     var which = event.which;
  //
  //     switch (which) {
  //       case 49:
  //         sendCoinValue(1);
  //         break;
  //       case 53:
  //         sendCoinValue(5);
  //         break;
  //       case 48:
  //         sendCoinValue(12);
  //         break;
  //       case 65:
  //         getVoucher('A');
  //         break;
  //       case 83:
  //         getVoucher('B');
  //         break;
  //       case 68:
  //         getVoucher('C');
  //         break;
  //     }
  //
  //   });

  function composeOverlay(username, password) {
    return "" +
    "<label for='username'>USERNAME:</label>" +
    "<input class='form-control input-lg' value=" + username + " type='text' readonly/>" +
    "</br>" +
    "<label for='password'>PASSWORD:</label>" +
    "<input class='form-control input-lg' value=" + password + " type='text' readonly/>" +
    "";
  }

  function showOverlay(obj, time, callback) {
    disabledButton = true;
    $('#overlay').css('display', 'block');
    $('.overlay-h1').text('(PRESS ANY BUTTON TO SHOW)');

    voucherBlured = true;
    $('.overlay-content').addClass('blur');
    $('.overlay-content').html(composeOverlay(obj.username, obj.password));

    displayCredit();
  };

  function removeBlur() {
    $('.overlay-content').removeClass('blur');
    $('.overlay-h1').text('(PRESS ANY BUTTON TO EXIT)');
    voucherBlured = false;

    activateLoadTimer(true);
    setTimeout(function(){ hideOverlay() }, 30000);
  }


  function activateLoadTimer(activate) {
    if (activate == true) {
      $('.exit-loading').html('<div class="timerwrapper">' +
      '<div class="shrinking"></div></div>');
    } else {
      $('.exit-loading').html('');
    }
  }

  function hideOverlay() {
    $('#overlay').css('display', 'none');
    $('.overlay-h1').text('(PRESS ANY BUTTON TO SHOW)');
    $('.overlay-content').html('');
    disabledButton = false;

    activateLoadTimer(false);
    displayCredit();
  };

  function showErrorOverlay(text, time, callback) {
    disabledButton = true;
    $('#errorOverlay').css('display', 'block');
    $('.error-overlay-container h1').text(text);

    setTimeout(function(){ callback(); }, time);
  };

  function hideErrorOverlay() {
    $('#errorOverlay').css('display', 'none');
    $('.error-overlay-container h1').text('');
    disabledButton = false;
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
        showOverlay(response, 5000, function(){
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

  async function sendCoinValue(value) {
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

  function populatePlan() {
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/plans',
      success: function(response) {
        plans = response;

        $.each(plans, function(index, obj) {
          var code = obj.plan_code;
          $('.price-plan-' + code).text('₱' + obj.price);
          $('.label-plan-' + code).text(obj.label);
        });
      }
    });
  }

  displayCredit();
  populatePlan();

});
