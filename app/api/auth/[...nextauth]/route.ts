import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import {prisma} from "@/db/prisma"
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const AuthOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials!.email || !credentials!.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials!.email
                    }
                })
                if (!user) {
                    return null;
                }
                const pwMatch = await bcrypt.compare(credentials!.password, user.password!);
                return pwMatch? user : null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENTID!,
            clientSecret: process.env.GOOGLE_CLIENTSECRET!
        })
    ],
    pages: {
        signIn: '/authPage'
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async redirect() {
          // Always redirect to /dashboard after sign-in
          return '/dashboard';
        },
      },
      
}

const handler = NextAuth(AuthOptions);

export {handler as GET, handler as POST};