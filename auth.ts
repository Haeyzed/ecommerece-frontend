/**
 * NextAuth v5 Configuration
 * Handles authentication with Laravel backend
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthResponse, AuthUser } from './features/auth/types';
import { api } from "@/lib/api/api-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.post<AuthResponse>(
            "/auth/login",
            {
              identifier: credentials.identifier,
              password: credentials.password,
            },
            { skipAuth: true }
          );

          if (response.success && response.data) {
            const userData = response.data.user as AuthUser & { avatar_url?: string | null };
            return {
              id: String(response.data.user.id),
              name: response.data.user.name,
              email: response.data.user.email,
              token: response.data.token,
              avatar_url: userData.avatar_url ?? null,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    token?: string;
    avatar_url?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string | null;
      token?: string;
    };
  }
}

// JWT type augmentation handled via session callback
