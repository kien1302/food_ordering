import React from "react";
import {
  Container,
  Text,
  Stack,
  Group,
  Center,
  Box,
  Space,
} from "@mantine/core";
import Link from "next/link";
export default function List({ data }) {
  return (
    <Container px={0} style={{ marginLeft: 0 }}>
      {data.map((item, index) => (
        <Container key={index} px={0}>
          <Group spacing="xs">
            {item.icon}
            <Box ml={item.space}>{item.title}</Box>
          </Group>
          <Space h="md" />
        </Container>
      ))}
    </Container>
  );
}

export function HorizontalList({ data }) {
  return (
    <Stack align="flex-start" justify="flex-start">
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {index === 0 ? (
            <Center>
              <Text weight={700} color="white">
                {item.title}
              </Text>
            </Center>
          ) : (
            <Link href={item.path}>
              <Text color="white">{item.title}</Text>
            </Link>
          )}
        </div>
      ))}
    </Stack>
  );
}
