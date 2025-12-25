import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const userList = [
  { name: "saad", password: 1234 },
  { name: "afif", password: 5678 },
  { name: "al", password: 9012 },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your name" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        const user = userList.find((u) => u.name == username);
        if (!user) return null;

        const isPasswordOk = user.password == password;

        if (isPasswordOk) {
          return user;
        }

        return null;
      },
    }),
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
