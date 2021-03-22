
Date.prototype.getJulian = function() {
    return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
  }

var today = new Date(); //set any date
var julian = today.getJulian(); //get Julian counterpart

console.log(julian)


function calculateJulianDate() {
  const now = new Date();
  return Math.floor(now / 86400000 - now.getTimezoneOffset() / 1440 + 2440587.5);
}

// console.log(calculateJulianDate()) //2459271