import { config } from './configService';
import { 
  Professional, 
  ServiceCategory, 
  GeoLocation, 
  Booking,
  BookingStatus,
  Conversation,
  User,
  Message
} from '../types';
import { LoginCredentials, RegisterData } from '../auth/AuthContext';

// ====================================================================================
// MOCK DATABASE SIMULATION
// ====================================================================================

const MOCK_DB_PROFESSIONALS: Professional[] = [
  { _id: 'pro1', name: 'Gary the Plumber', serviceType: ServiceCategory.Plumber, experience: 10, rate: 80, rating: 4.8, availability: true, location: { lat: 48.8580, lon: 2.3550 }, avatarUrl: 'https://picsum.photos/100/100?random=1' },
  { _id: 'pro2', name: 'Eleanor Electric', serviceType: ServiceCategory.Electrician, experience: 8, rate: 95, rating: 4.9, availability: true, location: { lat: 48.8555, lon: 2.3510 }, avatarUrl: 'https://picsum.photos/100/100?random=2' },
  { _id: 'pro3', name: 'Carlos Carpenter', serviceType: ServiceCategory.Carpenter, experience: 15, rate: 70, rating: 4.7, availability: true, location: { lat: 48.8595, lon: 2.3500 }, avatarUrl: 'https://picsum.photos/100/100?random=3' },
  { _id: 'pro4', name: 'Penny Painter', serviceType: ServiceCategory.Painter, experience: 5, rate: 60, rating: 4.6, availability: true, location: { lat: 48.8540, lon: 2.3580 }, avatarUrl: 'https://picsum.photos/100/100?random=4' },
  { _id: 'pro5', name: 'Mike Mechanic', serviceType: ServiceCategory.Mechanic, experience: 12, rate: 85, rating: 4.8, availability: false, location: { lat: 48.8600, lon: 2.3490 }, avatarUrl: 'https://picsum.photos/100/100?random=5' },
  { _id: 'pro6', name: 'Connie Cleaner', serviceType: ServiceCategory.Cleaner, experience: 3, rate: 50, rating: 4.9, availability: true, location: { lat: 48.8560, lon: 2.3480 }, avatarUrl: 'https://picsum.photos/100/100?random=6' },
];

const MOCK_DB_USERS: User[] = [
  // Passwords would be securely hashed in a real DB (e.g., using bcrypt)
  { _id: 'user123', name: 'John Doe', email: 'john.doe@example.com', password: 'password123', phone: '555-1234', location: { lat: 48.8566, lon: 2.3522 }, avatarUrl: 'https://picsum.photos/100/100?random=99' },
];

const MOCK_DB_AI_ASSISTANT: Professional = {
    _id: 'ai-assistant', name: 'AI Assistant', serviceType: ServiceCategory.Plumber, experience: 0, rate: 0, rating: 5, availability: true, location: {lat:0, lon:0}, avatarUrl: 'https://picsum.photos/100/100?random=100'
};

const MOCK_DB = {
  users: MOCK_DB_USERS,
  professionals: MOCK_DB_PROFESSIONALS,
  bookings: [
    { _id: 'booking123', userId: 'user123', professionalId: 'pro1', professional: MOCK_DB_PROFESSIONALS[0], serviceType: ServiceCategory.Plumber, status: BookingStatus.InProgress, startTime: new Date(), endTime: null, totalPrice: 0, liveTracking: true },
    { _id: 'booking456', userId: 'user123', professionalId: 'pro2', professional: MOCK_DB_PROFESSIONALS[1], serviceType: ServiceCategory.Electrician, status: BookingStatus.Confirmed, startTime: new Date(Date.now() + 24 * 3600 * 1000), endTime: null, totalPrice: 95, liveTracking: false },
    { _id: 'booking789', userId: 'user123', professionalId: 'pro4', professional: MOCK_DB_PROFESSIONALS[3], serviceType: ServiceCategory.Painter, status: BookingStatus.Completed, startTime: new Date(Date.now() - 2 * 24 * 3600 * 1000), endTime: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 2 * 3600 * 1000), totalPrice: 120, liveTracking: false },
    { _id: 'booking101', userId: 'user123', professionalId: 'pro3', professional: MOCK_DB_PROFESSIONALS[2], serviceType: ServiceCategory.Carpenter, status: BookingStatus.Cancelled, startTime: new Date(Date.now() - 5 * 24 * 3600 * 1000), endTime: null, totalPrice: 0, liveTracking: false },
  ],
  messages: [
    {_id:'msg1', senderId: 'ai-assistant', receiverId: 'user123', message: 'Hello! I am your AI booking assistant. How can I help you today?', timestamp: new Date(Date.now() - 10000), isAIMessage: true},
    {_id:'msg2', senderId: 'user123', receiverId: 'pro1', message: 'Are you nearby?', timestamp: new Date(Date.now() - 3605*1000)},
    {_id:'msg3', senderId: 'pro1', receiverId: 'user123', message: "I'm on my way!", timestamp: new Date(Date.now() - 3600*1000)},
  ],
  conversations: [
    { _id: 'convo-ai', participant: MOCK_DB_AI_ASSISTANT, lastMessage: "I can help you book a service. What do you need?", timestamp: new Date(), unreadCount: 1 },
    { _id: 'convo1', participant: MOCK_DB_PROFESSIONALS[0], lastMessage: "I'm on my way!", timestamp: new Date(Date.now() - 3600*1000), unreadCount: 0 },
    { _id: 'convo2', participant: MOCK_DB_PROFESSIONALS[3], lastMessage: "Thanks for the great review!", timestamp: new Date(Date.now() - 2 * 24 * 3600*1000), unreadCount: 0 },
  ],
  translations: {
    en: {
      nav: { home: "Home", bookings: "Bookings", messages: "Messages", profile: "Profile" },
      home: { title: "Find a Pro", subtitle: "Select a service or tap a pin", allProfessionals: "All Professionals" },
      bookings: { title: "My Bookings", active: "Active", completed: "Completed", noActive: "No active bookings.", noCompleted: "No completed bookings.", trackPrompt: "Tap to track professional", dateLabel: "Date", timeLabel: "Time" },
      profile: { edit: "Edit Profile", payment: "Payment Methods", settings: "Settings", help: "Help & Support", logout: "Log Out", language: "Language" },
      tracking: { back: "Back", title: "Tracking Your Pro", eta: "Estimated Arrival", minutes: "min" },
      details: { distanceAway: "{{distance}} km away", bookNow: "Book Now for ${{rate}}/hr" },
      service: { Plumber: "Plumber", Electrician: "Electrician", Cleaner: "Cleaner", Carpenter: "Carpenter", Mechanic: "Mechanic", Painter: "Painter", AIAssistant: "AI Assistant" },
      status: { Pending: "Pending", Confirmed: "Confirmed", InProgress: "In Progress", Completed: "Completed", Cancelled: "Cancelled" }
    },
    es: {
      nav: { home: "Inicio", bookings: "Reservas", messages: "Mensajes", profile: "Perfil" },
      home: { title: "Encontrar un Pro", subtitle: "Seleccione un servicio o toque un pin", allProfessionals: "Todos los Profesionales" },
      bookings: { title: "Mis Reservas", active: "Activas", completed: "Completadas", noActive: "No hay reservas activas.", noCompleted: "No hay reservas completadas.", trackPrompt: "Toca para seguir al profesional", dateLabel: "Fecha", timeLabel: "Hora" },
      profile: { edit: "Editar Perfil", payment: "Métodos de Pago", settings: "Configuración", help: "Ayuda y Soporte", logout: "Cerrar Sesión", language: "Idioma" },
      tracking: { back: "Volver", title: "Siguiendo a tu Pro", eta: "Llegada Estimada", minutes: "min" },
      details: { distanceAway: "a {{distance}} km", bookNow: "Reservar Ahora por ${{rate}}/hr" },
      service: { Plumber: "Fontanero", Electrician: "Electricista", Cleaner: "Limpiador(a)", Carpenter: "Carpintero", Mechanic: "Mecánico", Painter: "Pintor", AIAssistant: "Asistente de IA" },
      status: { Pending: "Pendiente", Confirmed: "Confirmada", InProgress: "En Progreso", Completed: "Completada", Cancelled: "Cancelada" }
    },
    fr: {
      nav: { home: "Accueil", bookings: "Réservations", messages: "Messages", profile: "Profil" },
      home: { title: "Trouver un Pro", subtitle: "Sélectionnez un service ou touchez une épingle", allProfessionals: "Tous les Professionnels" },
      bookings: { title: "Mes Réservations", active: "Actives", completed: "Terminées", noActive: "Aucune réservation active.", noCompleted: "Aucune réservation terminée.", trackPrompt: "Appuyez pour suivre le professionnel", dateLabel: "Date", timeLabel: "Heure" },
      profile: { edit: "Modifier le Profil", payment: "Moyens de Paiement", settings: "Paramètres", help: "Aide et Support", logout: "Se Déconnecter", language: "Langue" },
      tracking: { back: "Retour", title: "Suivi de votre Pro", eta: "Arrivée Prévue", minutes: "min" },
      details: { distanceAway: "à {{distance}} km", bookNow: "Réserver pour ${{rate}}/h" },
      service: { Plumber: "Plombier", Electrician: "Électricien", Cleaner: "Nettoyeur", Carpenter: "Charpentier", Mechanic: "Mécanicien", Painter: "Peintre", AIAssistant: "Assistant IA" },
      status: { Pending: "En attente", Confirmed: "Confirmée", InProgress: "En cours", Completed: "Terminée", Cancelled: "Annulée" }
    }
  }
};

const simulateDelay = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

const simulateError = (message: string, delay = 500): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));

function getCollection<T>(collectionName: keyof typeof MOCK_DB): T[] {
    return (MOCK_DB[collectionName] as T[]) || [];
}

// ====================================================================================
// AUTHENTICATION API
// ====================================================================================

export const login = async ({ email, password }: LoginCredentials): Promise<User> => {
    console.log(`Attempting login from collection '${config.collections.users}' for email: ${email}`);
    const usersCollection = getCollection<User>(config.collections.users as keyof typeof MOCK_DB);
    const user = usersCollection.find(u => u.email === email);

    if (!user) {
        return simulateError('User not found. Please check your email or register.');
    }
    if (user.password !== password) {
        return simulateError('Incorrect password. Please try again.');
    }
    // In a real app, you would not send the password back
    const { password: _, ...userWithoutPassword } = user;
    return simulateDelay(userWithoutPassword);
};

export const register = async (data: RegisterData): Promise<User> => {
    console.log(`Attempting to register new user in collection '${config.collections.users}'`);
    const usersCollection = getCollection<User>(config.collections.users as keyof typeof MOCK_DB);
    
    if (usersCollection.some(u => u.email === data.email)) {
        return simulateError('An account with this email already exists.');
    }
    
    const newUser: User = {
        _id: `user${Date.now()}`,
        ...data,
        location: { lat: 48.8566, lon: 2.3522 }, // Default location
        avatarUrl: `https://picsum.photos/100/100?random=${Date.now()}`
    };

    usersCollection.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return simulateDelay(userWithoutPassword);
};

export const getUserById = async (userId: string): Promise<User | null> => {
    console.log(`Fetching user from collection '${config.collections.users}' with ID: ${userId}`);
    const usersCollection = getCollection<User>(config.collections.users as keyof typeof MOCK_DB);
    const user = usersCollection.find(u => u._id === userId) || null;
    
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return simulateDelay(userWithoutPassword as User);
    }
    return simulateDelay(null);
}

// ====================================================================================
// MAIN APPLICATION API
// ====================================================================================

export const getNearbyProfessionals = async (location: GeoLocation, category: ServiceCategory): Promise<Professional[]> => {
  console.log(`Fetching professionals from collection '${config.collections.professionals}' for category ${category}`);
  const proCollection = getCollection<Professional>(config.collections.professionals as keyof typeof MOCK_DB);
  const filtered = proCollection.filter(p => p.serviceType === category && p.availability);
  return simulateDelay(filtered);
};

export const getAllAvailableProfessionals = async (): Promise<Professional[]> => {
  console.log(`Fetching all available professionals from collection '${config.collections.professionals}'`);
  const proCollection = getCollection<Professional>(config.collections.professionals as keyof typeof MOCK_DB);
  const filtered = proCollection.filter(p => p.availability);
  return simulateDelay(filtered);
};

export const getBookings = async (userId: string): Promise<Booking[]> => {
  console.log(`Fetching bookings from collection '${config.collections.bookings}' for user`, userId);
  const bookingsCollection = getCollection<Booking>(config.collections.bookings as keyof typeof MOCK_DB);
  return simulateDelay(bookingsCollection.filter(b => b.userId === userId));
};

export const getBookingDetails = async (bookingId: string): Promise<Booking | null> => {
    console.log(`Fetching booking details from collection '${config.collections.bookings}' for ID`, bookingId);
    const bookingsCollection = getCollection<Booking>(config.collections.bookings as keyof typeof MOCK_DB);
    const booking = bookingsCollection.find(b => b._id === bookingId) || null;
    return simulateDelay(booking);
};

export const getConversations = async (userId: string): Promise<Conversation[]> => {
    console.log(`Fetching conversations from collection '${config.collections.conversations}' for user`, userId);
    const conversationsCollection = getCollection<Conversation>(config.collections.conversations as keyof typeof MOCK_DB);
    return simulateDelay(conversationsCollection);
}

export const getMessages = async (userId: string, otherId: string): Promise<Message[]> => {
    console.log(`Fetching messages from collection '${config.collections.messages}' between ${userId} and ${otherId}`);
    const messagesCollection = getCollection<Message>(config.collections.messages as keyof typeof MOCK_DB);
    const filtered = messagesCollection.filter(m => 
        (m.senderId === userId && m.receiverId === otherId) ||
        (m.senderId === otherId && m.receiverId === userId)
    );
    return simulateDelay(filtered, 200);
}

export const sendMessage = async (message: Message): Promise<Message> => {
    console.log(`Sending message to collection '${config.collections.messages}'`, message);
    const messagesCollection = getCollection<Message>(config.collections.messages as keyof typeof MOCK_DB);
    messagesCollection.push(message);
    return simulateDelay(message, 100);
}

export const getCurrentUser = async (): Promise<User> => {
  console.log(`Fetching current user from collection '${config.collections.users}'`);
  const usersCollection = getCollection<User>(config.collections.users as keyof typeof MOCK_DB);
  // This is now legacy with the auth system, but kept for potential single-user mode.
  // In the authenticated app, always use getUserById or the context.
  const user = usersCollection[0];
  const { password, ...userWithoutPassword } = user;
  return simulateDelay(userWithoutPassword as User);
}

export const getProfessionalLocationStream = (
  professionalId: string, 
  callback: (location: GeoLocation) => void
): (() => void) => {
  const proCollection = getCollection<Professional>(config.collections.professionals as keyof typeof MOCK_DB);
  let pro = proCollection.find(p => p._id === professionalId);
  if (!pro) {
      console.error("Professional not found for location stream");
      return () => {};
  }
  let location = { ...pro.location };
  
  const intervalId = setInterval(() => {
    location = {
      lat: location.lat + (Math.random() - 0.5) * 0.0005,
      lon: location.lon + (Math.random() - 0.5) * 0.0005,
    };
    callback(location);
  }, 2000);

  return () => clearInterval(intervalId); // Unsubscribe function
};

export const getTranslations = async (language: string): Promise<Record<string, any>> => {
  console.log(`Fetching translations from collection '${config.collections.translations}' for language: ${language}`);
  const langKey = language.split('-')[0] as keyof typeof MOCK_DB.translations;
  const translationsCollection = MOCK_DB[config.collections.translations as keyof typeof MOCK_DB] as typeof MOCK_DB.translations;
  const translations = translationsCollection[langKey] || translationsCollection['en'];
  return simulateDelay(translations, 150);
};