import { collections, dbConnect } from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "Your Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const user = await dbConnect(collections.USER).findOne({ email });
        if (!user) return null;

        const isPasswordOk = await bcrypt.compare(password, user.password);

        if (isPasswordOk) {
          return user;
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const payLoad = {
          ...user,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          role: "user",
          createdAt: new Date().toISOString(),
        };

        if (!user?.email) {
          return false;
        }

        const isExist = await dbConnect(collections.USER).findOne({
          email: user.email,
        });
        if (!isExist) {
          const result = await dbConnect(collections.USER).insertOne(payLoad);
        }
      } catch (error) {
        return false;
      }
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, token, user }) {
      if (token) {
        session.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
};
