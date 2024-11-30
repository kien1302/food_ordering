import MyStoreNewProductPage from "@/components/MyStoreNewProductPage";
import MyStoreNewProductTypePage from "@/components/MyStoreNewProductTypePage";
import { Flex } from "@mantine/core";

export default function mystorenewproduct() {
  return (
    <Flex
      direction="row"
      
    >
      <MyStoreNewProductTypePage />
      <MyStoreNewProductPage />
    </Flex>
  );
}
