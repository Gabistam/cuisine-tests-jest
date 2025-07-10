// ========================================
// mocks/service-meteo.js
// ========================================

/**
 * Mock du service météo externe
 * Utilisé pour démontrer le MOCKING DE MODULES
 */

// Ce fichier sera automatiquement mocké par Jest
// Les fonctions seront remplacées par des jest.fn()

const serviceMeteo = {
  // Fonction mockée pour obtenir la température
  obtenirTemperature: jest.fn(() => {
    // Valeur par défaut si pas configurée dans les tests
    return 20;
  }),

  // Fonction mockée pour obtenir l'humidité
  obtenirHumidite: jest.fn(() => {
    // Valeur par défaut si pas configurée dans les tests
    return 60;
  }),

  // Fonction mockée pour obtenir la météo complète
  obtenirMeteoComplete: jest.fn((date) => {
    return {
      date: date,
      temperature: 20,
      humidite: 60,
      description: 'Partiellement nuageux',
      vent: 10
    };
  }),

  // Fonction utilitaire pour les tests - permet de simuler une panne
  simulerPanne: jest.fn(() => {
    throw new Error('Service météo temporairement indisponible');
  })
};

module.exports = serviceMeteo;