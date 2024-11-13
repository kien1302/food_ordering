import React from "react";
import {
  Avatar,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ScrollArea,
} from "@mantine/core";
import styles from "./styles.module.scss";
import SmallProduct from "./SmallProduct";
import SmallStatic from "./SmallStatic";
import { useEffect } from "react";
import { getCart, updateCart, removeFromCart } from "@/redux/cart";
import { useDispatch, useSelector } from "react-redux";
function CardTotal({ countItem }) {
  const { cart } = useSelector(getCart);
  const dispatch = useDispatch();

  useEffect(() => {
    countItem(cart.length);
  }, [countItem, cart]);
  return (
    <Paper pt={10} pb={10}>
      <ScrollArea style={{ height: 250 }} type="auto">
        {cart.map((item, index) => (
          <SmallProduct
            key={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            type={item.type}
            amount={item.amount}
          />
        ))}
      </ScrollArea>
      <SmallStatic
        subtotal={cart.reduce(
          (total, item) => (total += item.amount * item.price),
          0,
        )}
        shipping={0}
        tax={0}
        total={cart.reduce(
          (total, item) => (total += item.amount * item.price),
          0,
        )}
      />
    </Paper>
  );
}

export default CardTotal;
