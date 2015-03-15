var padToFour = function(number) {
  if (number<=9999) { number = ("000"+number).slice(-4); }
  return number;
}

exports.padToFour = padToFour