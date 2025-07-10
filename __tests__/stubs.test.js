// 🥕 EXEMPLE : Stub simple pour tester une fonction de calcul
function calculerCaloriesRepas(plat) {
  return plat.ingredients.reduce((total, ingredient) => total + ingredient.calories, 0);
}

// Stub : version simplifiée d'un plat réel
const stubSaladeCesar = {
  nom: 'Salade César',
  ingredients: [
    { nom: 'Laitue', calories: 5 },
    { nom: 'Poulet grillé', calories: 231 },
    { nom: 'Parmesan', calories: 110 }
  ]
};

test('calcule les calories d\'une salade César', () => {
  // Le stub nous donne des données prévisibles pour tester notre logique
  expect(calculerCaloriesRepas(stubSaladeCesar)).toBe(346);
});
