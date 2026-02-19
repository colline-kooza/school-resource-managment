import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/prisma/db";
import { Adapter } from "next-auth/adapters";

// Extend NextAuth types for custom fields
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    campusId?: string | null;
    courseId?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    campusId?: string | null;
    courseId?: string | null;
  }
}

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login?auto-fill",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@busilearn.ac.ug" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            phone: true,
            image: true,
            email: true,
            role: true,
            password: true,
            campusId: true,
            courseId: true,
            status: true,
          },
        });

        if (!existingUser) {
          throw new Error("No user found");
        }

        if (!existingUser.status) {
          throw new Error("Account is disabled");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          existingUser.password as string
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: existingUser.id,
          name: existingUser.name,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          phone: existingUser.phone,
          image: existingUser.image,
          email: existingUser.email,
          role: existingUser.role,
          campusId: existingUser.campusId,
          courseId: existingUser.courseId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.campusId = user.campusId;
        token.courseId = user.courseId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phone = token.phone;
        session.user.campusId = token.campusId;
        session.user.courseId = token.courseId;
      }
      return session;
    },
  },
};
