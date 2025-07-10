// ========================================
// src/restaurant.js
// ========================================

// Import du mock du service météo
const meteo = require('../mocks/service-meteo');

/**
 * Choisit le menu du jour selon la météo
 * Utilisé pour démontrer le MOCKING DE MODULES
 */
function choisirMenuJour(date) {
  try {
    const temperature = meteo.obtenirTemperature(date);
    const humidite = meteo.obtenirHumidite ? meteo.obtenirHumidite(date) : 50;

    // Logique de choix du menu selon la météo
    if (temperature > 25) {
      return humidite > 70 ? 
        'Salade fraîche et gazpacho avec boissons glacées' : 
        'Salade fraîche et gazpacho';
    } else if (temperature < 10) {
      return humidite > 80 ? 
        'Soupe chaude et pot-au-feu avec pain chaud' : 
        'Soupe chaude et pot-au-feu';
    } else {
      return temperature > 18 ? 
        'Plat du jour équilibré avec option fraîcheur' : 
        'Plat du jour équilibré';
    }
  } catch (error) {
    // En cas d'erreur du service météo, menu par défaut
    console.warn('Service météo indisponible, menu par défaut');
    return 'Menu du jour standard';
  }
}

/**
 * Planifie le menu de la semaine
 */
function planifierMenuSemaine(dateDebut) {
  const menu = [];
  const date = new Date(dateDebut);
  
  for (let i = 0; i < 7; i++) {
    const dateJour = date.toISOString().split('T')[0];
    try {
      const menuJour = choisirMenuJour(dateJour);
      menu.push({
        date: dateJour,
        jour: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        menu: menuJour
      });
    } catch (error) {
      menu.push({
        date: dateJour,
        jour: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        menu: 'Menu standard',
        erreur: 'Service météo indisponible'
      });
    }
    date.setDate(date.getDate() + 1);
  }
  
  return menu;
}

/**
 * Système de réservation simple
 */
class SystemeReservation {
  constructor() {
    this.reservations = new Map();
    this.capaciteMax = 50;
    this.numeroReservation = 1;
  }

  verifierDisponibilite(date, nombrePersonnes) {
    const reservationsJour = this.reservations.get(date) || [];
    const personnesReservees = reservationsJour.reduce((total, res) => total + res.nombrePersonnes, 0);
    
    return (personnesReservees + nombrePersonnes) <= this.capaciteMax;
  }

  faireReservation(date, nombrePersonnes, nomClient) {
    if (!this.verifierDisponibilite(date, nombrePersonnes)) {
      throw new Error('Capacité insuffisante pour cette date');
    }

    const reservation = {
      numero: this.numeroReservation++,
      date,
      nombrePersonnes,
      nomClient,
      menuSuggere: choisirMenuJour(date),
      dateReservation: new Date().toISOString()
    };

    if (!this.reservations.has(date)) {
      this.reservations.set(date, []);
    }
    this.reservations.get(date).push(reservation);

    return reservation;
  }

  obtenirReservations(date) {
    return this.reservations.get(date) || [];
  }

  annulerReservation(numeroReservation) {
    for (const [date, reservationsJour] of this.reservations.entries()) {
      const index = reservationsJour.findIndex(res => res.numero === numeroReservation);
      if (index !== -1) {
        const reservationAnnulee = reservationsJour.splice(index, 1)[0];
        return reservationAnnulee;
      }
    }
    throw new Error('Réservation non trouvée');
  }

  obtenirStatistiques() {
    let totalReservations = 0;
    let totalPersonnes = 0;
    
    for (const reservationsJour of this.reservations.values()) {
      totalReservations += reservationsJour.length;
      totalPersonnes += reservationsJour.reduce((sum, res) => sum + res.nombrePersonnes, 0);
    }

    return {
      totalReservations,
      totalPersonnes,
      moyennePersonnesParReservation: totalReservations > 0 ? 
        Math.round(totalPersonnes / totalReservations * 10) / 10 : 0,
      joursAvecReservations: this.reservations.size
    };
  }
}

/**
 * Service de notification des clients
 */
class ServiceNotification {
  constructor() {
    this.notifications = [];
  }

  envoyerNotification(client, message, type = 'info') {
    const notification = {
      id: Date.now() + Math.random(),
      client,
      message,
      type,
      date: new Date().toISOString(),
      lue: false
    };

    this.notifications.push(notification);
    
    // Simulation d'envoi (dans la vraie vie, ça serait un email/SMS)
    console.log(`📨 Notification ${type} pour ${client}: ${message}`);
    
    return notification;
  }

  marquerCommeLue(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.lue = true;
      return true;
    }
    return false;
  }

  obtenirNotifications(client) {
    return this.notifications.filter(n => n.client === client);
  }

  obtenirNotificationsNonLues(client) {
    return this.notifications.filter(n => n.client === client && !n.lue);
  }
}

module.exports = {
  choisirMenuJour,
  planifierMenuSemaine,
  SystemeReservation,
  ServiceNotification
};