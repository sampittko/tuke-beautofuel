import { Provider as NextAuthProvider } from "next-auth/client";
import Head from "next/head";
import "../styles/main.css";

const App = ({ Component: Page, pageProps }) => (
  <>
    <Head>
      <link rel="icon" href="/images/favicon.ico" />
    </Head>
    <NextAuthProvider session={pageProps.session}>
      <Page {...pageProps} />
    </NextAuthProvider>
  </>
);

export default App;
