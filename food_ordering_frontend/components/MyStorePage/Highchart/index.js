import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { getStoreProductStatus } from "@/lib";
import { Group, Button, Stack, Text, Tabs, Table, ThemeIcon, NumberInput } from "@mantine/core";
import { FaRegCalendarAlt } from "react-icons/fa/";
import React, { useEffect, useState, useMemo, useRef } from "react";
import styles from "./styles.module.scss";
import { BsDatabaseFillX, BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";

const Highchart = () => {
  const chartRef = useRef();
  var savedCookie;

  const testTransactions = [
    {
      id: "1",
      actionType: "💰",
      content: "Paid by Test user",
      amount: "+ 15$",
    },
    {
      id: "2",
      actionType: "💰",
      content: "Paid by Test user1",
      amount: "+ 25$",
    },
  ];

  const testRows = testTransactions.map((element) => (
    <tr key={element.id}>
      <td>{element.actionType}</td>
      <td>{element.content}</td>
      <td>{element.amount}</td>
    </tr>
  ));

  const [isMonthsChange, setIsMonthsChange] = useState(false);
  const [monthTabValue, setMonthTabValue] = useState("");
  const [yearValue, setYearValue] = useState("2024");
  const [profitData, setProfitData] = useState([]);
  const [buttonLoading, SetButtonLoading] = useState(false);
  const [chartOptions, setChartOptions] = useState({
    time: {
      useUTC: false,
      timezone: "Asia/Bangkok",
    },
    xAxis: {
      type: "datetime",
      crosshair: {
        //Dots on line
        color: "white",
        dashStyle: "Dash",
      },
      labels: {
        style: {
          color: "white",
          fontFamily: "system-ui",
        },
        format: "{value:%b-%d}",
      },
      lineColor: "#27ca7ee1",
      tickColor: "#20a86991",
      ordinal: false,
      minRange: 1,
    },
    yAxis: {
      title: {
        text: "",
      },
      opposite: false,
      labels: {
        style: {
          color: "white",
        },
      },
      gridLineDashStyle: "Dash",
      gridLineColor: "white",
      gridLineWidth: 0.5,
      // min: yAxisMin,
    },
    title: {
      style: {
        color: "white",
      },
      //text: yearTabValue,
    },
    series: [
      {
        type: "areaspline",
        lineWidth: 3,
        lineColor: "#20a86991",
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "rgba(38, 201, 125, 0.2)"],
            [1, "rgba(38, 201, 125, 0.01)"],
          ],
        },
        marker: {
          fillColor: "#27ca7ee1",
          lineWidth: 2,
          radius: 4,
          lineColor: "#27ca7ee1",
        },
        animation: {
          duration: 500,
        },
      },
    ],
    chart: {
      backgroundColor: "transparent",
      reflow: true,
    },
    legend: {
      itemStyle: {
        color: "white",
      },
    },
    navigation: {
      enabled: true,
      buttonOptions: {
        enabled: true,
      },
    },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      animation: true,
      // xDateFormat: "",
      style: { fontSize: "0.9rem" },
      useHTML: true,
      backgroundColor: "rgba(255, 255, 255)",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#B0C4DB",
      shadow: {
        offsetX: 1,
        offsetY: 2,
        width: 2,
        opacity: 0.05,
      },
      shape: "square",
      // split: true,
      hideDelay: 100,
      outside: false,
    },
    navigator: {
      handles: {
        // lineWidth: 1,
        width: 20,
        height: 30,
      },
      maskFill: "rgba(78, 125, 217, 0.2)",
      outlineWidth: 0,
      enabled: false,
      xAxis: {},
    },
    scrollbar: {
      enabled: false,
    },
  });

  const monthsFirstArr = [
    { id: "1", value: "Jan" },
    { id: "2", value: "Feb" },
    { id: "3", value: "Mar" },
    { id: "4", value: "Apr" },
    { id: "5", value: "May" },
    { id: "6", value: "Jun" },
  ];

  const monthsSecondArr = [
    { id: "7", value: "Jul" },
    { id: "8", value: "Aug" },
    { id: "9", value: "Sep" },
    { id: "10", value: "Oct" },
    { id: "11", value: "Nov" },
    { id: "12", value: "Dec" },
  ];

  // const yearsArr = [{ id: "2022" }, { id: "2023" }, { id: "2024" }];

  //Set options for line chart
  useEffect(() => {
    Highcharts.setOptions(chartOptions);
    // setChartOptions();
  }, []);

  //Switch to upper or lower month index in table upon clicking & Button delay
  useMemo(() => {
    if (monthTabValue != "" && monthTabValue != undefined) {
      var monthIndexNumb;
      var monthNumb;

      if (isMonthsChange) {
        monthIndexNumb = monthsFirstArr.findIndex((month) => month.value === monthTabValue);
        monthNumb = Number(monthIndexNumb);

        if (monthsSecondArr[monthNumb]) {
          setMonthTabValue(monthsSecondArr[monthNumb].value);
        }
      } else {
        monthIndexNumb = monthsSecondArr.findIndex((month) => month.value === monthTabValue);
        monthNumb = Number(monthIndexNumb);

        if (monthsFirstArr[monthNumb]) {
          setMonthTabValue(monthsFirstArr[monthNumb].value);
        }
      }
    }

    SetButtonLoading(true);
    setTimeout(() => {
      SetButtonLoading(false);
    }, 500);
  }, [isMonthsChange]);

  //Filter data upon choosing
  useEffect(() => {
    if (monthTabValue != "") {
      const cachedProfitData = localStorage.getItem(yearValue + "_profit");
      var filteredData = JSON.parse(cachedProfitData);

      if (filteredData?.[monthTabValue]) {
        setProfitData(filteredData[monthTabValue]);
      } else {
        setProfitData([]);
      }
    }
  }, [monthTabValue, yearValue]);

  //API called to get data
  useEffect(() => {
    async function getProfitData() {
      savedCookie = JSON.parse(document.cookie.split("Sel=")[1]);
      const data = {
        store_id: savedCookie.storeId,
        year: yearValue,
      };
      const [response, err] = await getStoreProductStatus(data);
      if (response) {
        localStorage.setItem(yearValue + "_profit", JSON.stringify(response));
      } else {
        //console.log(err);
      }
    }
    getProfitData();
  }, [yearValue]);

  //Build chart with data
  useEffect(() => {
    setChartOptions({
      title: {
        text: profitData.length > 0 ? yearValue + " Profit" : "",
      },
      series: {
        name: profitData.length > 0 ? "USD" : "",
        data: profitData,
      },
      legend: {
        enabled: profitData.length > 0 ? true : false,
      },
    });
  }, [profitData, yearValue]);

  return (
    <Stack h="85%" w="98%" spacing={10}>
      <Group spacing={0} position="left" className={styles.calendarSection}>
        <ThemeIcon color="teal" variant="filled" size="2.25rem">
          <FaRegCalendarAlt size={18} />
        </ThemeIcon>
        {/* <Flex> */}
          {/*           
          <Tabs
            ml={20}
            variant="pills"
            color="teal"
            //defaultValue={yearsArr[0].id}
            value={yearTabValue}
            onTabChange={(value) => setYearTabValue(value)}
            style={{
              border: "2px solid #20a86991",
              borderRadius: "5px",
            }}>
            <Tabs.List>
              {yearsArr.map((item) => (
                <Tabs.Tab value={"2022"}>
                  2022
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs> */}
          <NumberInput
            defaultValue={2024}
            value={parseInt(yearValue)}
            onChange={(value) => setYearValue(value.toString())}
            styles={{
              input: { borderColor: "#27ca7ee1", color: "#FFF", width: "fit-content"},
              control: { borderColor: "#27ca7ee1"},
              
            }}
            className={styles.yearsInput}
          />
        {/* </Flex> */}

        <Group
          spacing={0}
          style={{
            transition: "0.2s all ease-in-out",
            opacity: yearValue != "" ? 1 : 0,
          }}>
          {/* <div
            style={{
              width: "1.625rem",
              border: "1px solid #22704f",
              borderRadius: "5px",
            }}
          /> */}
        </Group>
        <Group
          spacing={0}
          style={{
            transition: "0.2s all ease-in-out",
            transitionDelay: "100ms",
            opacity: yearValue != "" ? 1 : 0,
          }}>
          <Tabs
            variant="pills"
            color="teal"
            //defaultValue={monthsFirstArr[0].id}
            value={monthTabValue}
            onTabChange={(value) => setMonthTabValue(value)}
            style={{
              border: "2px solid #20a86991",
              borderRadius: "5px",
              overflowY: "hidden",
              width: "26rem",
              height: "2.375rem",
            }}>
            <Tabs.List
              grow
              style={{
                width: "100%",
                transition: "transform 0.5s ease",
                transform: !isMonthsChange ? "translateY(0%)" : "translateY(-54%)",
              }}>
              {monthsFirstArr.map((item) => (
                <Tabs.Tab key={item.id} value={item.value}>
                  {item.value}
                </Tabs.Tab>
              ))}
              {monthsSecondArr.map((item) => (
                <Tabs.Tab key={item.id} value={item.value}>
                  {item.value}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
          <Button
            miw="5.625rem"
            ml={20}
            leftIcon={!isMonthsChange ? <BsFillArrowDownCircleFill size={15} /> : <BsFillArrowUpCircleFill size={15} />}
            loading={buttonLoading}
            onClick={() => setIsMonthsChange(!isMonthsChange)}>
            {!isMonthsChange ? "Next" : "Back"}
          </Button>
        </Group>
      </Group>

      <Stack
        mih="25rem"
        mah="100%"
        spacing={10}
        style={{
          background: "#25262b",
          borderRadius: "5px",
          justifyContent: "center",
          position: "relative",
        }}>
        <Stack
          align="center"
          style={{ position: "absolute", top: "34%", left: "43%", transition: "opacity 0.1s", opacity: profitData.length > 0 ? 0 : 1 }}>
          <BsDatabaseFillX size={"4.625rem"} />
          <Text size={18}>No data found</Text>
        </Stack>

        <HighchartsReact
          containerProps={{ style: { height: "100%", width: "100%" } }}
          highcharts={Highcharts}
          options={chartOptions}
          constructorType="chart"
          ref={chartRef}
        />
      </Stack>

      <Stack className={styles.transactionsHitorySection} position="apart" spacing={10}>
        <Group spacing={10}>
          <ThemeIcon size="1.6rem" color="blue">
            <GrTransaction size="1.2rem" />
          </ThemeIcon>
          <Text className={styles.labelFont}>Recent Transactions</Text>
        </Group>
        <Table fontSize={15} withBorder>
          <tbody>{testRows}</tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Highchart;
