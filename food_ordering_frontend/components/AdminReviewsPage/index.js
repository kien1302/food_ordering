import { Paper, Skeleton, Table, Text, Drawer, useMantineTheme, Button, Flex, Title, Input, TextInput, Textarea, ActionIcon, createStyles, Select, Grid } from "@mantine/core";
import styles from "./styles.module.scss"
import { useEffect, useState } from "react";
import { getAllCommentsFromCustomer, getAllStores, getCustomerCommentListFromStore, updateOrderComment } from "@/lib";
import moment from "moment";
import { useRouter } from "next/navigation";
import AlertPopup from "../shards/AlertPopup";
import { useForm } from '@mantine/form';
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

function reviewDetail(item) {
    const {
        // id,
        order_id,
        account_id,
        name,
        comment,
        star,
        created_date,
        // updated_date,
        product_name,
        quantity,
        order_store_id,
        // price
    } = item

    const form = useForm({

        initialValues: {
            name: name,
            comment: comment,
            star: star,
            created_date: created_date,
            product_name: product_name,
            quantity: quantity,
        },
    });

    async function handleSubmit(values) {
        for (const [key, value] of Object.entries(values)) {
            if (value !== undefined) {
                continue
            } else {
                values[key] = item[key] //update object if the ini not change
            }
        }
        const data = {
            account_id: account_id,
            order_id: order_id,
            store_id: order_store_id,
            comment: values['comment'],
            star: values['star']
        }

        console.log("check data push: ", data)
        try {
            const [response, error] = await updateOrderComment(data)
            console.log("alert: ", response, error)
            if (response?.error) {
                alert(response?.error)
            } else {
                alert(response?.message)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ width: '100%' }}>
            <TextInput
                label="Customer's name"
                variant="default"
                disabled
                defaultValue={name}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('name')}
            />

            <TextInput
                label="Comment date"
                disabled
                // value={moment(created_date).format("DD/MM/YYYY h:mm a")}
                defaultValue={moment(created_date).format("DD/MM/YYYY h:mm a")}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('created_date')}
            />

            <TextInput
                label="Product"
                disabled
                defaultValue={`${product_name}`}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('product_name')}
            />

            <TextInput
                label="Quantity"
                disabled
                defaultValue={`${quantity}`}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('quantity')}
            />

            <TextInput
                label="Star rating"
                disabled
                defaultValue={star + `⭐`}
                // value={star + ``}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('star')}
            />

            <Textarea
                label="Customer's review"
                defaultValue={comment}
                styles={{
                    label: { marginBottom: '6px' },
                    root: { width: '100%' },
                }}
                {...form.getInputProps('comment')}
            />
            <Grid grow gutter="lg" mt={16}>
                <Grid.Col span={4}>
                    <Button type="button" style={{ width: '100%' }} color="red">
                        Delete
                    </Button>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Button type="submit" style={{ width: '100%' }}>
                        Confirm
                    </Button>
                </Grid.Col>
            </Grid>
        </form>

    )
}

const AdminReviewsPage = () => {
    const router = useRouter();
    const theme = useMantineTheme()
    const [loading, setLoading] = useState(false)
    const [opened, setOpened] = useState(false);
    const [comments, setComments] = useState([])
    const [clickItem, setClickItem] = useState({})
    const [storeData, setStoreData] = useState([
        { value: "all", label: "All Store" }
    ]);

    useEffect(() => {
        setLoading(true)
        if (!document.cookie.split("Adm=")[1]) {
            <AlertPopup
                Title={"Login required"}
                Content={"We need you to login before accessing this page!"}
                LinkRef={"/admin/login"}
                ButtonName={"Login"}
            />
            router.push("/admin/login")
        } else {
            let savedCookie = JSON.parse(document.cookie.split("Adm=")[1]);
            // let storeId = savedCookie.storeId;
            async function fetchData() {
                try {
                    const [[commentsResponse, commentsError], [storeResponse, storeError]] = await Promise.all([
                        getAllCommentsFromCustomer(),
                        getAllStores()
                    ]);

                    // Check for errors in responses
                    if (commentsError) {
                        console.error("Error fetching comments:", commentsError);
                        throw new Error("Failed to fetch comments");
                    }

                    if (storeError) {
                        console.error("Error fetching store data:", storeError);
                        throw new Error("Failed to fetch store data");
                    }
                    // Process responses
                    setComments(commentsResponse.data);
                    if (storeResponse) {
                        const formattedStoreData = storeResponse?.map((store) => ({
                            value: store.id,
                            label: store.name,
                        }));
                        setStoreData((prev) => [...prev, ...formattedStoreData.flat(1)])
                    }
                } catch (e) {
                    console.error(e)
                    throw new Error("Error fetching reviews")
                } finally {
                    setLoading(false)
                }
            }
            fetchData();
        }
    }, [])


    async function selectStoreChange(storeId) {
        setLoading(true)
        if (storeId !== 'all') {
            try {
                const [commentsResponse, commentsError] = await getCustomerCommentListFromStore(storeId);
                if (commentsError) {
                    console.error("Error fetching comments:", commentsError);
                    throw new Error("Failed to fetch comments");
                }

                if (commentsResponse.data.length > 0) {
                    setComments(commentsResponse.data);
                } else {
                    setComments([]);
                }
            } catch (e) {
                console.error(e)
                throw new Error("Error fetching reviews")
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const [commentsResponse, commentsError] = await getAllCommentsFromCustomer();
                if (commentsError) {
                    console.error("Error fetching comments:", commentsError);
                    throw new Error("Failed to fetch comments");
                }

                if (commentsResponse.data.length > 0) {
                    setComments(commentsResponse.data);
                } else {
                    setComments([]);
                }
            } catch (e) {
                console.error(e)
                throw new Error("Error fetching reviews")
            } finally {
                setLoading(false)
            }
        }
    }

    const rows = comments?.map((row, index) => {

        return (
            <>
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
            </>
        )
    })

    const tableNoData = () => {
        return (
            <tr style={{ alignItems: 'center' }}>
                No Comment
            </tr>
        )
    }
    return (
        <>
            <Paper withBorder p="md" radius="md" w="82vw" style={{ background: "#25262b" }}>
                <Flex
                    mih={50}
                    justify="space-between"
                    align="center"
                    direction="row"
                    wrap="no-wrap"
                >
                    <Text className={styles.titleText}>Customer Reviews</Text>
                    {storeData.length > 1 ? (
                        <Select
                            label="Store picked: "
                            place="store"
                            data={storeData.length > 1 ? storeData : ""}
                            defaultValue={'all'}
                            onChange={(value) => selectStoreChange(value)}
                        />
                    ) : (
                        <div>loading</div>
                    )}

                </Flex>

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
                    <tbody>{loading ? <Waiting /> : (comments?.length > 0 ? rows : tableNoData)}</tbody>
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

export default AdminReviewsPage;