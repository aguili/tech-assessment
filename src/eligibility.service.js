/**
 * Représente le service de l'éligibilité.
 * @class
 */
class EligibilityService {
  /**
   * Vérifie si un panier est éligible en fonction des critères donnés.
   * @param {Object} cart - Données du panier.
   * @param {Object} criteria - Conditions.
   * @returns {boolean} - True si éligible, False sinon.
   */
  isEligible(cart, criteria) {
    return Object.entries(criteria).every(([key, condition]) => {
      const cartData = this._extractValue(cart, key);
      if (cartData === undefined) return false;

      return Array.isArray(cartData)
        ? cartData.some((value) => this._evaluateCondition(value, condition))
        : this._evaluateCondition(cartData, condition);
    });
  }

  /**
   * Évalue si une donnée du panier respecte une condition donnée.
   * @param {*} value - Valeur du panier.
   * @param {*} condition - Condition à vérifier.
   * @returns {boolean} - True si la condition est respectée, False sinon.
   */
  _evaluateCondition(value, condition) {
    if (typeof condition === "object" && condition !== null) {
      return Object.entries(condition).every(([operator, expected]) => {
        switch (operator) {
          case "gt":
            return Number(value) > Number(expected);
          case "lt":
            return Number(value) < Number(expected);
          case "gte":
            return Number(value) >= Number(expected);
          case "lte":
            return Number(value) <= Number(expected);
          case "in":
            return Array.isArray(expected) && expected.includes(value);
          case "and":
            return Object.entries(expected).every(([op, val]) =>
              this._evaluateCondition(value, { [op]: val })
            );
          case "or":
            return Object.entries(expected).some(([op, val]) =>
              this._evaluateCondition(value, { [op]: val })
            );
          default:
            return false;
        }
      });
    }
    return value == condition;
  }

  /**
   * Récupère la valeur associée à une clé dans le panier, y compris les clés imbriquées.
   * @param {Object} cart - Données du panier.
   * @param {string} keyPath - Chemin d'accès à la donnée (ex: "products.productId").
   * @returns {*} - La valeur trouvée ou undefined si inexistante.
   */
  _extractValue(cart, keyPath) {
    return keyPath.split(".").reduce((acc, key) => {
      if (Array.isArray(acc))
        return acc.map((item) => item[key]).filter((v) => v !== undefined);
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, cart);
  }
}

module.exports = {
  EligibilityService,
};
