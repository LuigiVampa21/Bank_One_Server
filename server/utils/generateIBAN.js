const generateIBAN = () => {
  var ktnr, iban;
  var pruef, pruef2;
  ktnr = Math.round(Math.random() * Date.now()) + 10000000;
  pruef = ktnr * 1000000 + 43;
  pruef2 = pruef % 97;
  pruef = 98 - pruef2;
  if (pruef > 9) {
    iban = "LI";
  } else {
    iban = "LI0";
  }
  iban = iban + pruef + "70050" + "000" + ktnr;
  return iban.substring(0, 18);
};

// console.log(generateIBAN());

module.exports = generateIBAN;
