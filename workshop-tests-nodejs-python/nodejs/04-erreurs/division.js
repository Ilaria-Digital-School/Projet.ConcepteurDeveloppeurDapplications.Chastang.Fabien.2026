// Divise a par b. Diviser par zéro lève une erreur.
function diviser(a, b) {
  if (b === 0) {
    throw new Error('Division par zéro');
  }
  return a / b;
}

module.exports = { diviser };
