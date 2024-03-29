import { Provider as NextAuthProvider } from "next-auth/client";
import Head from "next/head";
import "tailwindcss/tailwind.css";

const App = ({ Component: Page, pageProps }) => (
  <>
    <Head>
      <link rel="icon" href="/images/beautofuel_favicon.ico" />
    </Head>
    <NextAuthProvider session={pageProps.session}>
      <Page {...pageProps} />
    </NextAuthProvider>
  </>
);

export default App;
