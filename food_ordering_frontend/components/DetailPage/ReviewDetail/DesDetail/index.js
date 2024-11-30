import {
  Text,
  Title,
  Image,
  Stack,
  Group,
  Button,
  Badge,
  Grid,
} from "@mantine/core";
import CardItem from "@/components/shards/CardItem";
import { React, useState, useEffect } from "react";
//import StoreDetailPage from "@/components/StoreDetailPage";
import Link from "next/link";
import { useRouter } from "next/router";
import { getRandomProducts } from "@/lib/api/products";

function DesDetail({ storeinfo }) {
  const img_load = process.env.NEXT_PUBLIC_IPFS_URL;

  const router = useRouter();
  var { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [randproduct, setRandProduct] = useState([]);

  useEffect(() => {
    try {
      setLoading(true);
      const getRandProducts = async () => {
        const value = {
          store_id: storeinfo.sid,
          product_id: id,
        };
        const [data, error] = await getRandomProducts(value);
  
        if (data) {
          setRandProduct(data);
        } else {
          console.log(error);
        }
      };
  
      getRandProducts();
    } catch (e) {
      console.error("error: ", e)
    } finally {
      setLoading(false)
    }
    
  }, [id]);

  return (
    <>
      <Stack>
        <Group
          style={{
            border: "1px solid #ccc",
            marginTop: 20,
            borderRadius: 5,
            paddingBottom: 10,
            width: "fit-content",
          }}
        >
          <Stack
            style={{
              maxWidth: 240,
              marginTop: 10,
              marginLeft: 20,
              marginRight: -20,
            }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: 10,
                marginRight: 20,
                overflowWrap: "break-word",
              }}
            >
              <Image
                priority
                loader={({ src }) => src}
                fit="cover"
                height={120}
                width={200}
                radius="md"
                src={img_load + storeinfo?.image}
                alt="Store Image"
              />
            </div>
          </Stack>
          <Group>
            <Stack
              spacing={4}
              align="flex-start"
              justify="flex-start"
              mt={10}
              mr={20}
            >
              <Title color="white" size={17}>
                {storeinfo.name}
              </Title>
              <Badge
                mt={5}
                color="pink"
                variant="light"
                style={{
                  fontSize: 10,
                }}
              >
                {storeinfo.type_name}
              </Badge>
              <Group mt={10}>
                <Text color="white" size={14}>
                  Address:
                </Text>
                <Text
                  color="white"
                  size={12}
                  style={{
                    maxWidth: 240,
                    overflowWrap: "break-word",
                  }}
                >
                  {storeinfo.address}
                </Text>
              </Group>
              <Link href={"/store/detail?id=" + storeinfo.sid}>
                <Button
                  mb={1}
                  variant="outline"
                  textAlign="center"
                  style={{
                    width: "100%",
                  }}
                >
                  Visit
                </Button>
              </Link>
            </Stack>
          </Group>
        </Group>
        <Title color="white" weight={600} size={20}>
          Other products you may like:
        </Title>
      </Stack>
      <Grid mt={20} grow>
        {!loading &&
          randproduct.map((item) => (
            <Grid.Col key={item.id} span={3}>
              <CardItem
                pid={item.id}
                sid={item.sid}
                description={item.description}
                type={item.type_name}
                name={item.name}
                image={item.image}
                price={item.price}
                hidden={true}
                store_name={storeinfo.name}
                loading={loading}
              />
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}

export default DesDetail;
