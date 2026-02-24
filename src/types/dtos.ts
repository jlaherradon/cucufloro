export interface UserDTO {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponseDTO {
  token: string;
  user: UserDTO;
}

export interface ParkingSpotDTO {
  id: string;
  addressText: string;
  floor?: string;
  width: number;
  length: number;
  height: number;
  active: boolean;
  features: string[];
  lat: number;
  lon: number;
}

export interface SwapPreferenceDTO {
  id?: string;
  homeLat: number;
  homeLon: number;
  radiusMeters: number;
}

export interface MatchDTO {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  score: number;
  partnerName?: string;
}

export interface MessageDTO {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface DashboardSummary {
  hasSpot: boolean;
  hasPreferences: boolean;
  matchesCount: number;
}
