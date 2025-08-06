import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          name: "evgin",
          email: "evgin@example.com",
        };

        if (
          credentials?.username === "evgin" &&
          credentials.password === "1234"
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // app/login/page.tsx varsa
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
