// ========================================
// src/inventaire.js
// ========================================

/**
 * Fake d'un système d'inventaire de cuisine
 * Utilisé pour démontrer les FAKES
 */
const fakeInventaireCuisine = {
  ingredients: new Map([
    ['tomates', { quantite: 10, unite: 'kg', prix: 2.5, peremption: '2024-12-31' }],
    ['basilic', { quantite: 5, unite: 'bouquets', prix: 1.8, peremption: '2024-01-15' }],
    ['mozzarella', { quantite: 3, unite: 'kg', prix: 12, peremption: '2024-02-01' }],
    ['pate_pizza', { quantite: 8, unite: 'unités', prix: 1.5, peremption: '2024-01-30' }],
    ['huile_olive', { quantite: 2, unite: 'litres', prix: 8, peremption: '2025-06-01' }]
  ]),

  // Vérifier si un ingrédient est disponible en quantité suffisante
  verifierDisponibilite(ingredient, quantiteNecessaire) {
    const stock = this.ingredients.get(ingredient);
    return stock && stock.quantite >= quantiteNecessaire;
  },

  // Utiliser une quantité d'ingrédient (décrémenter le stock)
  utiliserIngredient(ingredient, quantite) {
    const stock = this.ingredients.get(ingredient);
    if (stock && stock.quantite >= quantite) {
      stock.quantite -= quantite;
      return true;
    }
    return false;
  },

  // Ajouter du stock (nouvel arrivage)
  ajouterStock(ingredient, quantite, unite, prix, peremption = '2024-12-31') {
    if (this.ingredients.has(ingredient)) {
      this.ingredients.get(ingredient).quantite += quantite;
    } else {
      this.ingredients.set(ingredient, { quantite, unite, prix, peremption });
    }
  },

  // Obtenir les informations d'un ingrédient
  obtenirStock(ingredient) {
    return this.ingredients.get(ingredient) || null;
  },

  // Lister tous les ingrédients disponibles
  listerIngredients() {
    return Array.from(this.ingredients.entries()).map(([nom, info]) => ({
      nom,
      ...info
    }));
  },

  // Vérifier les ingrédients bientôt périmés
  verifierPeremptions(joursAlerte = 7) {
    const maintenant = new Date();
    const dateAlerte = new Date();
    dateAlerte.setDate(maintenant.getDate() + joursAlerte);
    
    return this.listerIngredients().filter(ingredient => {
      const datePeremption = new Date(ingredient.peremption);
      return datePeremption <= dateAlerte;
    });
  },

  // Calculer la valeur totale du stock
  calculerValeurStock() {
    return Array.from(this.ingredients.values())
      .reduce((total, ingredient) => total + (ingredient.quantite * ingredient.prix), 0);
  },

  // Réinitialiser l'inventaire aux valeurs par défaut
  reinitialiser() {
    this.ingredients.clear();
    this.ingredients.set('tomates', { quantite: 10, unite: 'kg', prix: 2.5, peremption: '2024-12-31' });
    this.ingredients.set('basilic', { quantite: 5, unite: 'bouquets', prix: 1.8, peremption: '2024-01-15' });
    this.ingredients.set('mozzarella', { quantite: 3, unite: 'kg', prix: 12, peremption: '2024-02-01' });
    this.ingredients.set('pate_pizza', { quantite: 8, unite: 'unités', prix: 1.5, peremption: '2024-01-30' });
    this.ingredients.set('huile_olive', { quantite: 2, unite: 'litres', prix: 8, peremption: '2025-06-01' });
  },

  // Sauvegarder l'état actuel (pour les tests)
  sauvegarderEtat() {
    return new Map(this.ingredients);
  },

  // Restaurer un état sauvegardé
  restaurerEtat(etatSauvegarde) {
    this.ingredients = new Map(etatSauvegarde);
  }
};

/**
 * Fonction pour préparer une pizza Margherita
 * Utilise l'inventaire fake
 */
function preparerPizzaMargherita(inventaire) {
  const ingredientsNecessaires = [
    { nom: 'pate_pizza', quantite: 1 },
    { nom: 'tomates', quantite: 0.2 },
    { nom: 'mozzarella', quantite: 0.15 },
    { nom: 'basilic', quantite: 1 },
    { nom: 'huile_olive', quantite: 0.05 }
  ];

  // Vérifier la disponibilité de tous les ingrédients
  for (const ingredient of ingredientsNecessaires) {
    if (!inventaire.verifierDisponibilite(ingredient.nom, ingredient.quantite)) {
      throw new Error(`Ingrédient manquant : ${ingredient.nom}`);
    }
  }

  // Utiliser tous les ingrédients
  for (const ingredient of ingredientsNecessaires) {
    const succes = inventaire.utiliserIngredient(ingredient.nom, ingredient.quantite);
    if (!succes) {
      throw new Error(`Impossible d'utiliser l'ingrédient : ${ingredient.nom}`);
    }
  }

  return 'Pizza Margherita prête !';
}

/**
 * Fonction pour préparer plusieurs pizzas
 */
function preparerCommande(inventaire, pizzas) {
  const resultats = [];
  
  for (const pizza of pizzas) {
    try {
      switch (pizza.type) {
        case 'margherita':
          const resultat = preparerPizzaMargherita(inventaire);
          resultats.push({ type: pizza.type, statut: 'succès', message: resultat });
          break;
        default:
          resultats.push({ type: pizza.type, statut: 'erreur', message: 'Type de pizza non supporté' });
      }
    } catch (error) {
      resultats.push({ type: pizza.type, statut: 'erreur', message: error.message });
    }
  }
  
  return resultats;
}

/**
 * Gestionnaire de commandes avec historique
 */
class GestionnaireCommandes {
  constructor(inventaire) {
    this.inventaire = inventaire;
    this.historique = [];
    this.numeroCommande = 1;
  }

  passerCommande(items) {
    const commande = {
      numero: this.numeroCommande++,
      items: items,
      date: new Date().toISOString(),
      statut: 'en_preparation'
    };

    try {
      const resultats = preparerCommande(this.inventaire, items);
      commande.resultats = resultats;
      commande.statut = resultats.every(r => r.statut === 'succès') ? 'réussie' : 'partiellement_échouée';
    } catch (error) {
      commande.statut = 'échouée';
      commande.erreur = error.message;
    }

    this.historique.push(commande);
    return commande;
  }

  obtenirHistorique() {
    return [...this.historique];
  }

  obtenirCommande(numero) {
    return this.historique.find(cmd => cmd.numero === numero);
  }

  obtenirStatistiques() {
    const total = this.historique.length;
    const reussies = this.historique.filter(cmd => cmd.statut === 'réussie').length;
    const echouees = this.historique.filter(cmd => cmd.statut === 'échouée').length;
    
    return {
      total,
      reussies,
      echouees,
      tauxReussite: total > 0 ? Math.round((reussies / total) * 100) : 0
    };
  }
}

module.exports = {
  fakeInventaireCuisine,
  preparerPizzaMargherita,
  preparerCommande,
  GestionnaireCommandes
};
