import { Paper, Skeleton, Table, Text, Drawer, useMantineTheme, Button, Flex, Title, Input, TextInput, Textarea, ActionIcon, createStyles } from "@mantine/core";
import styles from "./styles.module.scss"
import { useEffect, useState } from "react";
import { getCustomerCommentListFromStore } from "@/lib";
import moment from "moment";
import { useRouter } from "next/navigation";
import AlertPopup from "../shards/AlertPopup";
function Waiting() {
    return (
        <>
            <tr>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>

            </tr>
            <tr>

                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
            </tr>
            <tr>

                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
                <td>
                    <Skeleton height={8} mt={6} width="100%" radius="xl" />
                </td>
            </tr>
        </>
    );
}

function reviewDetail(value) {
    const {
        // id,
        // order_id,
        name,
        comment,
        star,
        created_date,
        // updated_date,
        product_name,
        quantity,
        // order_store_id,
        // price
    } = value
    return (
        <>
            <TextInput
                label="Customer's name"
                variant="default"
                disabled
                value={name}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
            />

            <TextInput
                label="Comment date"
                disabled
                value={moment(created_date).format("DD/MM/YYYY h:mm a")}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
            />

            <TextInput
                label="Product and quantity"
                disabled
                value={`${product_name}: ${quantity}`}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
            />

            <TextInput
                label="Star rating"
                disabled
                value={star + `⭐`}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
            />

            <Textarea
                label="Customer's review"
                value={comment}
                disabled
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
            />
        </>

    )
}


const MyStoreReviewPage = () => {
    const router = useRouter();
    const theme = useMantineTheme()
    const [loading, setLoading] = useState(false)
    const [opened, setOpened] = useState(false);
    const [comments, setComments] = useState([])
    const [clickItem, setClickItem] = useState({})
    useEffect(() => {
        setLoading(true)
        if (!document.cookie.split("Sel=")[1]) {
            <AlertPopup
                Title={"Login required"}
                Content={"We need you to login before accessing this page!"}
                LinkRef={"/seller/login"}
                ButtonName={"Login"}
            />
            router.push("/seller/login")
        } else {
            let savedCookie = JSON.parse(document.cookie.split("Sel=")[1]);
            let storeId = savedCookie.storeId;
            async function getAllComments() {
                try {
                    const [response, err] = await getCustomerCommentListFromStore(storeId);
                    setComments(response.data);
                } catch (e) {
                    console.log(e)
                    throw new Error("Error fetching reviews")
                } finally {
                    setLoading(false)
                }
            }
            getAllComments();
        }
    }, [])

    const rows = comments.map((row, index) => {

        return (
            <tr key={index} style={{ alignItems: 'center' }}>
                <td>
                    {row.name}
                </td>
                <td>
                    {row.product_name + `(${row.quantity})`}
                </td>
                <td>
                    {moment(row.created_date).format("DD/MM/YYYY h:mm a")}
                </td>
                <td>
                    {row.star}⭐
                </td>
                <td className={styles.td}>
                    <ActionIcon 
                    onClick={() => {
                        setOpened(true)
                        setClickItem(row)
                    }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-right"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18" />
                            <path d="M16 12l-4 -4" />
                            <path d="M16 12h-8" />
                            <path d="M12 16l4 -4" />
                        </svg>
                    </ActionIcon>
                </td>
            </tr>
        )
    })

    return (
        <>
            <Paper withBorder p="md" radius="md" w="82vw" style={{ background: "#25262b" }}>
                <Text className={styles.titleText}>Customer Reviews</Text>

                <Table width="80vw" sx={{ background: "#25262b" }} verticalSpacing="xs" striped highlightOnHover>
                    <thead className={styles.thead}>
                        <tr>
                            <th>Customers</th>
                            <th style={{ width: "20%" }}>Product (Quantity)</th>
                            <th>Timestamp</th>
                            <th>Star rating</th>
                            <th stlye={{ width: "5%" }}>View Details</th>
                        </tr>
                    </thead>
                    <tbody>{loading ? <Waiting /> : rows}</tbody>
                </Table>
            </Paper>

            <Drawer
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                position="right"
                opened={opened}
                onClose={() => {
                    setClickItem({})
                    setOpened(false)
                }}
                size="sm"
            >
                <Title>
                    Customer Reviews
                </Title>
                <Flex
                    gap="md"
                    justify="center"
                    align="flex-start"
                    direction="column"
                    wrap="wrap"
                    mt={40}
                >
                    {reviewDetail(clickItem)}
                </Flex>
            </Drawer>
        </>


    )
}

export default MyStoreReviewPage;