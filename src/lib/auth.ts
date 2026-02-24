import { UserDTO } from "@/types/dtos";

const TOKEN_KEY = "parking_swap_token";
const USER_KEY = "parking_swap_user";

export const authStorage = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  getUser: (): UserDTO | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserDTO) : null;
  },
  setSession: (token: string, user: UserDTO) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const mapAuthResponse = (payload: unknown) => payload as { token: string; user: UserDTO };
