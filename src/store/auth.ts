"use client";

import { create } from "zustand";
import { UserDTO } from "@/types/dtos";
import { authStorage } from "@/lib/auth";

interface AuthState {
  token: string | null;
  user: UserDTO | null;
  hydrated: boolean;
  hydrate: () => void;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  hydrate: () => {
    set({ token: authStorage.getToken(), user: authStorage.getUser(), hydrated: true });
  },
  login: (token, user) => {
    authStorage.setSession(token, user);
    set({ token, user });
  },
  logout: () => {
    authStorage.clear();
    set({ token: null, user: null });
  }
}));
