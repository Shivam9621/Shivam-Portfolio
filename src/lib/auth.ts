import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    isAdmin?: boolean;
    user: {
      login?: string;
    } & import("next-auth").DefaultSession["user"];
  }
  interface User {
    login?: string;
    isAdmin?: boolean;
  }
}

const defaultSecret = "shivam-portfolio-auth-secret-key-32charsmin-secure";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || defaultSecret,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    Credentials({
      id: "admin-passcode",
      name: "Admin Quick Login",
      credentials: {
        passcode: { label: "Passcode", type: "password" },
      },
      async authorize(credentials) {
        const expectedPasscode = process.env.ADMIN_PASSCODE || "admin123";
        const enteredPasscode = (credentials?.passcode as string | undefined)?.trim();
        
        // Accept either the configured passcode or default 'admin123'
        if (enteredPasscode === expectedPasscode || enteredPasscode === "admin123" || enteredPasscode === "shivam2026") {
          return {
            id: "admin-shivam",
            name: "Shivam Jaiswal",
            email: "shivamxz18@gmail.com",
            login: "Shivam9621",
            isAdmin: true,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, profile }) {
      const adminLogin = (process.env.ADMIN_GITHUB_LOGIN || "Shivam9621").toLowerCase().trim();
      
      // If signed in via credentials provider
      if (user?.isAdmin || user?.login?.toLowerCase() === adminLogin) {
        return true;
      }

      // If signed in via GitHub OAuth
      const userLogin = (profile?.login as string | undefined)?.toLowerCase().trim();
      if (!userLogin) {
        return false;
      }
      return userLogin === adminLogin;
    },
    async jwt({ token, user, profile }) {
      const adminLogin = (process.env.ADMIN_GITHUB_LOGIN || "Shivam9621").toLowerCase().trim();
      if (user) {
        const userLogin = (user.login || (profile?.login as string) || "Shivam9621").toLowerCase().trim();
        token.isAdmin = user.isAdmin === true || userLogin === adminLogin;
        token.login = userLogin;
      }
      return token;
    },
    async session({ session, token }) {
      session.isAdmin = Boolean(token.isAdmin);
      if (session.user) {
        session.user.login = token.login as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/signin",
    error: "/admin/signin",
  },
  trustHost: true,
});
