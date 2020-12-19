import { Provider as NextAuthProvider } from "next-auth/client";
import Layout from "../components/common/Layout";
import Head from "next/head";
import "../styles/main.css";

const App = ({ Component: Page, pageProps }) => {
  const { session } = pageProps;

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <NextAuthProvider session={session}>
        <Layout>
          <Page {...pageProps} />
        </Layout>
      </NextAuthProvider>
    </>
  );
};

export default App;
