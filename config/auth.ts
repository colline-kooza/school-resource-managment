import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/prisma/db";
import { Adapter } from "next-auth/adapters";

// Extend NextAuth types for custom fields
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
  }

  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
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
    signIn: "/login",
  },
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_SECRET || "",
    //   profile(profile) {
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name || profile.login,
    //       firstName: profile.name?.split(" ")[0] || "",
    //       lastName: profile.name?.split(" ")[1] || "",
    //       phone: "",
    //       image: profile.avatar_url,
    //       email: profile.email,
    //       role: "USER",
    //     };
    //   },
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: `${profile.given_name} ${profile.family_name}`,
    //       firstName: profile.given_name,
    //       lastName: profile.family_name,
    //       phone: "",
    //       image: profile.picture,
    //       email: profile.email,
    //       role: "USER",
    //     };
    //   },
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jb@gmail.com" },
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
          },
        });

        if (!existingUser) {
          throw new Error("No user found");
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
      }
      return session;
    },
  },
};
