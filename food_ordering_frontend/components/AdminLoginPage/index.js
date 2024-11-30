import React, { useState } from "react";
import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Center,
    Group,
} from "@mantine/core";
import Head from "next/head";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { accountLogin } from "@/lib";

const AdminLoginPage = () => {
    const [userId, setUserId] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);

    async function Login() {
        // check all fields
        if (email === "" || password === "") {
            if (email === "") {
                setEmptyEmail(true);
            } else {
                setEmptyEmail(false);
            }
            if (password === "") {
                setEmptyPassword(true);
            } else {
                setEmptyPassword(false);
            }
            return;
        }

        setEmptyEmail(false);
        setEmptyPassword(false);

        try {
            const data = {
                role_id: "AD",
                email: email,
                password: password,
            };

            const [response, error] = await accountLogin(data);
            if (error) {
                alert(Object.values(error)[0]);
            } else {

                var expireTime = new Date(Date.now() + 21600 * 1000).toUTCString();
                document.cookie = `Adm=${JSON.stringify(
                    response,
                )};Expires=${expireTime};path=/;`;
                setUserId(response.userId);
                router.push("/myadmin");
            }
        } catch (err) {
            //@ts-ignore
            alert(err.response);
        }
    }


    return (
        <div>
            <Head>
                <title>Admin-Food-Delivery</title>
                <link rel="shortcut icon" href="public/images/logo.png" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <div className={styles.wrapper}>
                <Paper className={styles.form} radius={0} p={30}>
                    <Title
                        order={2}
                        className={styles.title}
                        align="center"
                        mt="md"
                        mb={50}
                        variant="gradient"
                        gradient={{ from: "#13a762", to: "cyan" }}
                        weight={900}
                    >
                        Food Delivery Admin
                    </Title>

                    <TextInput
                        label="Email address"
                        placeholder="admin"
                        size="md"
                        onChange={(value) => setEmail(value.currentTarget.value)}
                        error={emptyEmail}
                    />
                    {emptyEmail ? (
                        <Text fz="xs" c="red">
                            email is required
                        </Text>
                    ) : (
                        <></>
                    )}
                    <PasswordInput
                        label="Password"
                        variant="filled"
                        placeholder="Your password"
                        mt="md"
                        size="md"
                        onChange={(value) => setPassword(value.currentTarget.value)}
                        error={emptyPassword}
                    />
                    {emptyPassword ? (
                        <Text fz="xs" c="red">
                            Password is required
                        </Text>
                    ) : (
                        <></>
                    )}

                    <Checkbox label="Keep me logged in" sx={{ lineHeight: 1, marginTop: 8, }} />

                    <Button fullWidth mt="xl" size="md" onClick={Login}>
                        Login
                    </Button>
                </Paper>
            </div>
        </div>
    )
}


export default AdminLoginPage;