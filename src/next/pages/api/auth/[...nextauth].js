import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      state: process.env.NODE_ENV === "production",
    }),
  ],
  session: {
    jwt: true,
  },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    session: async (session, user) => {
      session.jwt = user.jwt;
      session.id = user.id;

      return Promise.resolve(session);
    },
    jwt: async (token, user, account) => {
      const isSignedIn = !!user;
      const publicApiUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : process.env.NEXT_PUBLIC_API_URL_DEV;

      if (isSignedIn) {
        const response = await fetch(
          `${publicApiUrl}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        );

        const data = await response.json();

        token.jwt = data.jwt;
        token.id = data.user.id;
      }

      return Promise.resolve(token);
    },
  },
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
