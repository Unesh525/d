// _app.js
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <SessionProvider session={session}>
      {
        loading ? (
          <div className="flex flex-col flex-center wh_100">
            <Loading/>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div>
            <Header />
            <Aside />
            <main>
              <Component {...pageProps} />
            </main>
          </div>
        )
      }
    </SessionProvider>
  );
}


