// FIX: Removed a self-referential import of `ServiceCategory` that was causing a conflict.
export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Added for authentication
  location: GeoLocation;
  avatarUrl: string;
}

export interface Professional {
  _id: string;
  name: string;
  serviceType: ServiceCategory;
  experience: number;
  rate: number;
  rating: number;
  availability: boolean;
  location: GeoLocation;
  avatarUrl: string;
}

export enum ServiceCategory {
  Plumber = "Plumber",
  Electrician = "Electrician",
  Cleaner = "Cleaner",
  Carpenter = "Carpenter",
  Mechanic = "Mechanic",
  Painter = "Painter",
}

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  InProgress = "In Progress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export interface Booking {
  _id: string;
  userId: string;
  professionalId: string;
  professional: Professional;
  serviceType: ServiceCategory;
  status: BookingStatus;
  startTime: Date;
  endTime: Date | null;
  totalPrice: number;
  liveTracking: boolean;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isAIMessage?: boolean;
}

export interface Conversation {
    _id: string;
    participant: User | Professional;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
}