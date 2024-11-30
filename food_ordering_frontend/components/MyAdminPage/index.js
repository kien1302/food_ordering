import React from "react";
import {Grid } from "@mantine/core";
import {useState, useMemo } from "react";
import AlertPopup from "../shards/AlertPopup";
import Highchart from "./Highchart";
import StatisticSection from "./StatisticSection";

export default function MyStorePage() {
  const [isLogin, setIsLogin] = useState(false);

  useMemo(() => {
    if (document.cookie.indexOf("Ad") > -1) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  return !isLogin ? (
    <div>
      <div
        style={{
          backgroundColor: "grey",
          zIndex: 2,
          filter: "blur(8px)",
        }}
      />
      <AlertPopup
        Title={"Login required"}
        Content={"We need you to login before accessing this page!"}
        LinkRef={"/admin/login"}
        ButtonName={"Login"}
      />
    </div>
  ) : (
    <Grid gutter={0}>
      <Grid.Col span={8}>
        <Highchart />
      </Grid.Col>
      <Grid.Col span={4}>
        <StatisticSection />
      </Grid.Col>
    </Grid>
  );
}
