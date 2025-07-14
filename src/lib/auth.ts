import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
    teamId?: string;
  }

  interface Session {
    user: {
      teamId: string | null;
      name: string | null;
      image: string | null;
      email: string | null;
      role: string | null;
      id: string | null;
    } | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token if user is available
      if (user) {
        token.role = user.role;
        token.id = user.id;
      } else if (token.email) {
        // Make sure role is updated if changed in database
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, teamId: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.teamId = dbUser.teamId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.teamId = token.teamId as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
