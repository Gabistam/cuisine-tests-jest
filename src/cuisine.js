// ========================================
// src/cuisine.js
// ========================================

/**
 * Calcule le total de calories d'un repas
 * Utilisé pour démontrer les STUBS
 */
function calculerCaloriesRepas(plat) {
  if (!plat || !plat.ingredients) {
    return 0;
  }
  return plat.ingredients.reduce((total, ingredient) => total + ingredient.calories, 0);
}

/**
 * Commande un repas via un service de livraison
 * Utilisé pour démontrer les MOCKS
 */
function commanderRepas(plat, adresse, instructions, serviceLivraison) {
  // Validation des paramètres
  if (!plat || !adresse) {
    throw new Error('Plat et adresse requis');
  }

  if (!serviceLivraison) {
    throw new Error('Service de livraison requis');
  }

  // Appel du service externe - c'est ce qu'on veut mocker
  return serviceLivraison.livrer(plat, adresse, instructions);
}

/**
 * Objet chef avec méthodes pour démontrer les SPIES
 */
const chef = {
  preparerSauce: function(type) {
    console.log(`Préparation de la sauce ${type}`);
    return `Sauce ${type} prête`;
  },

  cuirePates: function(duree) {
    console.log(`Cuisson des pâtes pendant ${duree} minutes`);
    return 'Pâtes al dente';
  },

  assaisonner: function(ingredients) {
    console.log(`Assaisonnement avec: ${ingredients.join(', ')}`);
    return `Assaisonnement ${ingredients.join(' + ')} ajouté`;
  }
};

/**
 * Fonction qui utilise le chef pour préparer un plat
 * Utilisée pour démontrer les SPIES
 */
function preparerPlatPates(chef, typeSauce) {
  // Cette fonction appelle plusieurs méthodes du chef
  chef.cuirePates(8);
  const sauce = chef.preparerSauce(typeSauce);
  chef.assaisonner(['sel', 'poivre']);
  
  return `Pâtes avec ${sauce}`;
}

/**
 * Génère un menu du jour avec structure complexe
 * Utilisé pour démontrer les SNAPSHOTS
 */
function genererMenuJour(plats, chef) {
  if (!plats || plats.length === 0) {
    return {
      erreur: 'Aucun plat disponible',
      date: new Date().toISOString().split('T')[0]
    };
  }

  return {
    date: new Date().toISOString().split('T')[0],
    restaurant: 'Chez Jest',
    chef: chef,
    plats: plats.map(plat => ({
      nom: plat.nom,
      prix: `${plat.prix}€`,
      calories: `${plat.calories} cal`,
      description: plat.description || 'Délicieux plat maison',
      disponible: plat.disponible !== false
    })),
    platRecommande: plats.find(p => p.recommande)?.nom || plats[0].nom,
    totalCalories: plats.reduce((total, plat) => total + plat.calories, 0),
    nombrePlats: plats.length,
    prixMoyen: Math.round(plats.reduce((total, plat) => total + plat.prix, 0) / plats.length)
  };
}

/**
 * Calcule le prix total d'une commande avec remises
 */
function calculerPrixCommande(items, codePromo = null) {
  let total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  
  // Application des codes promo
  if (codePromo) {
    switch (codePromo) {
      case 'ETUDIANT':
        total *= 0.9; // 10% de réduction
        break;
      case 'FIDELITE':
        total *= 0.85; // 15% de réduction
        break;
      case 'NOUVEAUCLIENT':
        total -= 5; // 5€ de réduction
        break;
    }
  }
  
  return Math.max(0, Math.round(total * 100) / 100); // Arrondi à 2 décimales, minimum 0
}

/**
 * Valide les ingrédients d'une recette
 */
function validerRecette(recette) {
  if (!recette || !recette.nom) {
    throw new Error('Le nom de la recette est obligatoire');
  }
  
  if (!recette.ingredients || recette.ingredients.length === 0) {
    throw new Error('La recette doit contenir au moins un ingrédient');
  }
  
  if (!recette.tempsPreparation || recette.tempsPreparation <= 0) {
    throw new Error('Le temps de préparation doit être supérieur à 0');
  }
  
  return {
    valide: true,
    nom: recette.nom,
    nombreIngredients: recette.ingredients.length,
    tempsPreparation: recette.tempsPreparation,
    difficulte: recette.ingredients.length > 10 ? 'Difficile' : 
                recette.ingredients.length > 5 ? 'Moyenne' : 'Facile'
  };
}

module.exports = {
  calculerCaloriesRepas,
  commanderRepas,
  chef,
  preparerPlatPates,
  genererMenuJour,
  calculerPrixCommande,
  validerRecette
};
