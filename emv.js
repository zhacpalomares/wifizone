var emv = require('serial-number');

emv(function(err, value){
  console.log(value);
})
