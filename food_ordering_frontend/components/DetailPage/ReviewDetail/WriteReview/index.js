import StarRating from "@/components/shards/CardItem/components/StarRating";
import {
  Button,
  Stack,
  Textarea,
  TextInput,
  Text,
  Group,
  Radio,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Swal from "sweetalert2";
import {
  insertOrderComment,
  checkOrderComment,
  updateOrderComment,
} from "@/lib/api/comments";
import { getOrderAllProductInfo } from "@/lib";

function WriteReview({ orderId }) {
  let cookieInfo = "";
  if (document.cookie.indexOf("Cus") > -1) {
    cookieInfo = JSON.parse(document.cookie.split("Cus=")[1]);
  }

  const [productStore, setProductStore] = useState(null);
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(0);

  useEffect(() => {
    async function fetchOrderAllProductInfo() {
      const request = { order_id: orderId };
      const [data, error] = await getOrderAllProductInfo(request);
      console.log("wat", data);
  
      if (data?.data) {
        // Group products by store_id
        const groupedProducts = data?.data.reduce((acc, item) => {
          // If the store_id doesn't exist in the accumulator, create a new entry for it
          if (!acc[item.store_id]) {
            acc[item.store_id] = {
              store_id: item.store_id,
              store_name: item.store_name,
              comment: item.commment,
              products: []
            };
          }
          // Push product names for the corresponding store_id
          acc[item.store_id].products.push(item.product_name);
          acc[item.store_id].comment = (item.comment);
          acc[item.store_id].star = (item.star);
          return acc;
        }, {});
  
        // Convert groupedProducts object into an array of objects for rendering
        const groupedProductsArray = Object.values(groupedProducts);
        setProductStore(groupedProductsArray);
      }
    }
  
    console.log("test");
    if (orderId != null) {
      fetchOrderAllProductInfo();
    }
  }, [orderId]);


  const CheckIfExistComment = (value) => {
    const index = productStore.map((e) => e.store_id).indexOf(value);
    const cmtData = productStore[index].comment;
    const starData = productStore[index].star;
    setStar(starData);
    setComment(cmtData);
  };

  async function editComment(value) {
    try {
      const [check] = await checkOrderComment(value);
      if (!check) {
        const [insert, error] = await insertOrderComment(value);
        if (insert)
          Swal.fire({
            title: "Success",
            text: "Add comment succesfully!",
            icon: "success",
            confirmButtonColor: "#36c6d3",
            confirmButtonText: "Confirm",
          });
        else if (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to add comment!",
            icon: "error",
            confirmButtonColor: "#36c6d3",
            confirmButtonText: "Confirm",
          });
        }
      } else {
        const [update, error] = await updateOrderComment(value);
        if (update)
          Swal.fire({
            title: "Success",
            text: "Update comment succesfully!",
            icon: "success",
            confirmButtonColor: "#36c6d3",
            confirmButtonText: "Confirm",
          });
        else if (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to Update comment!",
            icon: "error",
            confirmButtonColor: "#36c6d3",
            confirmButtonText: "Confirm",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  let [review, setReview] = useState({
    account_id: cookieInfo.userId,
    star: "",
    comment: "",
    //image: "",
    order_id: orderId,
    // store_id: storeId,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  // transfer this to history
  return (
    <form onSubmit={handleSubmit} style={{ width: 550, margin: "auto" }}>
      <Stack>
        <Radio.Group
          label="Select a store to comment"
          mb={40}
          orientation="vertical"
          size="md"
          onChange={(value) => {
            setReview((pre) => ({
              ...pre,
              store_id: value.toString(),
            }));
            CheckIfExistComment(value);
          }}
        >
        {productStore?.map((store) => (
          <Group key={store.store_name}>
            <Radio
              label={
                <>
                  <b>{store.store_name}</b>
                  <div>
                    {store.products.map((product, index) => (
                      <div key={index}>{product}</div>
                    ))}
                  </div>
                </>
              }
              value={store.store_id} // You could use `store.store_id` instead if preferred
              defaultValue={""}
            />
          </Group>
        ))}
        </Radio.Group>
        <Text color="white">Previous comment</Text>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 5,
            marginBottom: 50,
          }}
        >
          {comment != null && comment.length > 0 ? (
            <Text p={10} color="teal">
              {comment}
            </Text>
          ) : (
            <Text p={10} fs="italic" color="grey">
              No comment yet!
            </Text>
          )}
        </div>
        <StarRating
          name="star"
          size={20}
          value={star}
          onchange={(value) => {
            setReview((pre) => ({
              ...pre,
              star: parseInt(value),
            }));
          }}
        />
        <Textarea
          placeholder="Write Your Comment"
          withAsterisk
          minRows={4}
          autosize
          name="comment"
          onChange={(e) =>
            setReview((pre) => ({
              ...pre,
              comment: e.target.value.toString(),
            }))
          }
        />
        <Button
          color="teal"
          type="submit"
          onClick={() => {
            editComment(review);
          }}
        >
          Edit
        </Button>
      </Stack>
    </form>
  );
}

export default WriteReview;
