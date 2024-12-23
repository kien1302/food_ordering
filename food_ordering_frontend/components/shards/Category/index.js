import {
  Container,
  Group,
  Text,
  Divider,
  RangeSlider,
  Stack,
  Input,
  Button,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { MdKeyboardArrowRight } from "react-icons/md";
import CateElement from "./components/CateElement";
import { GiChickenOven, GiHamburger, GiSlicedBread } from "react-icons/gi";
import { MdFastfood, MdLocalDrink } from "react-icons/md";
import ListCheckbox from "./components/ListCheckbox";

function Category({ onClickCate, getType }) {
  const [sliderMin, setSliderMin] = useState(20);
  const [sliderMax, setSliderMax] = useState(100);
  const filterType = (name) => {
    const filter = getType.filter((val) =>
      name == "Food" ? val.type != "drink" : val.type == name.toLowerCase(),
    );
    return filter.length;
  };

  return (
    <Container style={{ width: 300, marginLeft: 100, marginRight: 100 }}>
      <Group align="center" position="apart">
        <Text weight={700} size={20} color="white">
          Category
        </Text>
        <MdKeyboardArrowRight size={20} />
      </Group>
      <Divider />
      <CateElement
        data={[
          {
            icon: <MdFastfood size={35} color="#27ca7d" />,
            name: "Food",
            quantity: filterType("Food"),
          },
          {
            icon: <MdLocalDrink size={35} color="#27ca7d" />,
            name: "Drink",
            quantity: filterType("Drink"),
          },
          {
            icon: <GiHamburger size={35} color="#27ca7d" />,
            name: "Hamburger",
            quantity: filterType("Hamburger"),
          },
          {
            icon: <GiSlicedBread size={35} color="#27ca7d" />,
            name: "Bread",
            quantity: filterType("Bread"),
          },
        ]}
        onclickcate={(val) => onClickCate(val)}
      />

      {/* Slider */}
     
      <Divider mb={20} />
      <Button variant="light" color="teal" style={{ width: "100%" }}>
        Filter
      </Button>
    </Container>
  );
}

export default Category;
