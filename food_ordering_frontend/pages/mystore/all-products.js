import MyStoreAllProductsPage from "@/components/MyStoreAllProductsPage";
import MyStoreAllProductsTypePage from "@/components/MyStoreAllProductsTypesPage";
import { Flex } from "@mantine/core";

export default function mystoreallproducts() {
  return (
    <Flex
      direction="row"
      gap={8}
    >
      <MyStoreAllProductsTypePage />
      <MyStoreAllProductsPage />
    </Flex>
  );
}
