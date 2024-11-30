import dynamic from "next/dynamic";
import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import "../styles/reset.css";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { Notifications } from "@mantine/notifications";
import { AppShell, Loader } from "@mantine/core";
import store from "@/redux";
import Header from "@/components/shards/Header";
const Footer = dynamic(() => import("@/components/shards/Footer"));
import NavigationBar from "@/components/shards/NavigationBar";
import BreadCrumb from "@/components/shards/BreadCrumb";
import AdminNavigationBar from "@/components/AdminNavigationBar";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [pageloader, setPageLoader] = useState(true);
  const path = router.pathname;
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useMemo(() => {
    if (path.includes("seller") || path.includes("mystore")) {
      if (isSeller !== true) {
        setIsSeller(true);
        setIsAdmin(false);
        setPageLoader(true);
      }
    } else if (path.includes("admin") || path.includes("myadmin")) {
      if (isAdmin !== true) {
        setIsAdmin(true);
        setIsSeller(false);
        setPageLoader(true);
      }
    } else {
      if (isSeller !== false || isAdmin !== false) {
        setIsSeller(false);
        setIsAdmin(false);
        setPageLoader(true);
      }
    }
    setTimeout(() => {
      setPageLoader(false);
    }, 100);
  }, [path]);

  return (
    <>
      {pageloader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
          }}>
          <Loader
            variant="dots"
            size={50}
            style={{
              marginBlock: "auto",
            }}
          />
        </div>
      ) : (
        <>
          {isSeller || isAdmin ? (
            //<Provider store={store}>
            <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
              <Notifications />
              {
                isSeller ? (
                  path.includes("/mystore") ? (
                    <AppShell navbarOffsetBreakpoint="sm" navbar={<NavigationBar />}>
                      <Component {...pageProps} />
                    </AppShell>
                  ) : (
                    <Component {...pageProps} />
                  )
                ) : (
                  path.includes("/myadmin") ? (
                    <AppShell navbarOffsetBreakpoint="sm" navbar={<AdminNavigationBar />}>
                      <Component {...pageProps} />
                    </AppShell>
                  ) : (
                    <Component {...pageProps} />
                  )
                )
              }
            </MantineProvider>
          ) : (
            <Provider store={store}>
              <MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
                <Notifications />
                {/* Hide shard components in these pages */}
                {!path.includes("/customer", "/seller", "/_error", "/paymentsuccess", "/admin") ? (
                  <>
                    <Header />
                    <BreadCrumb />
                    <Component {...pageProps} />
                    <Footer />
                  </>
                ) : (
                  <Component {...pageProps} />
                )}
              </MantineProvider>
            </Provider>
          )}
        </>
      )}
    </>
  );
}

export default MyApp;
