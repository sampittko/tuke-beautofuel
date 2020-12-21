import { Provider as NextAuthProvider } from "next-auth/client";
import Layout from "../components/common/Layout";
import Head from "next/head";
import "../styles/main.css";

const App = ({ Component: Page, pageProps }) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
    </Head>
    <NextAuthProvider session={pageProps.session}>
      <Layout>
        <Page {...pageProps} />
      </Layout>
    </NextAuthProvider>
  </>
);

export default App;
