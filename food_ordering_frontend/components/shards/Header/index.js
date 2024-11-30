import React, { useRef } from "react";
import {
  Grid,
  Paper,
  NativeSelect,
  TextInput,
  Text,
  Container,
  Group,
  ActionIcon,
  Image,
  Stack,
  ScrollArea,
  Indicator,
  Select,
  Divider,
  Flex,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import {
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GrLocation, GrApps } from "react-icons/gr";
import { CiFacebook, CiTwitter, CiInstagram, CiYoutube } from "react-icons/ci";
import { ImWhatsapp } from "react-icons/im";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import MainMenu, { ListIcon } from "./components/Menu";
import Contact from "./components/Contact";
import Link from "next/link";
import { useRouter } from "next/router";
// import {IoLocationOutline} from 'react-icons/io';
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "@/redux/cart";
import { getWishlist } from "@/redux/wishlist";
import { getUser } from "@/redux/user";
import UserMenu from "./components/UserMenu";
import { searchProduct } from "@/lib/api/products";

function Header() {
  const router = useRouter();

  const [isDrop, setIsDrop] = useState(false);
  const [isUser, setUser] = useState({});

  const [isVisible, setIsVisible] = useState(true);
  const [dropMenu, setDropMenu] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const { cart } = useSelector(getCart);
  const { wishlist } = useSelector(getWishlist);
  const img_load = process.env.NEXT_PUBLIC_IPFS_URL;


  useEffect(() => {
    if (document.cookie.indexOf("Cus") > -1) {
      const savedCookie = JSON.parse(document.cookie.split("Cus=")[1]);
      const checkUser = savedCookie;
      setUser(checkUser);
    }
  }, [setUser]);

  /////// Search data when press Enter //////////////////////////////////////////
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      //Check if input valid
      if (!searchInput.replace(/\s/g, "").length) {
        getSearchedProduct([]);
      } else {
        const searchObject = {
          name: searchInput,
        };
        setSearchData([]);
        getSearchedProduct(searchObject);
        setDropMenu(true);
      }
    } else {
      setDropMenu(false);
    }
  };

  const getSearchedProduct = async (value) => {
    const [data, error] = await searchProduct(value);

    if (data) {
      setSearchData(data);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////

  //// Detect and hide/show if click outside/inside search drop-menu ////
  const wrapperRef = useRef(null);
  const [isClickedOutside, setIsClickedOutside] = useState(true);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsClickedOutside(false);
    } else setIsClickedOutside(true);
  };
  ////////////////////////////////////////////////////////////////

  return (
    <Container
      style={{ maxWidth: "100%", zIndex: 100, position: "sticky", top: 0 }}
      p={0}
    >
      <Paper shadow="xs">
        <Grid
          style={{
            minHeight: 100,
            marginBottom: "10px",
            justifyContent: "center",
            margin: "auto",
          }}
          align="center"
          justify="center"
          columns={12}
        >
          <Grid.Col span={1}>
            <Link href="/">
              <Image
                priority
                loader={({ src }) => src}
                size="md"
                width={50}
                height={50}
                fit="content"
                src="/images/logo.png"
                style={{ cursor: "pointer" }}
              ></Image>
            </Link>
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              ref={wrapperRef}
              onKeyDown={handleKeyDown}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
              rightSection={<FiSearch />}
              placeholder="Search..."
              style={{ 
                maxWidth: 320
              }}
            />
            {dropMenu && searchData && isClickedOutside && (
              <ScrollArea
                style={{
                  border: "2px solid #ccc",
                  borderRadius: 5,
                  background: "white",
                  zIndex: 2,
                  marginTop: 10,
                  position: "fixed",
                  width: 498,
                  maxHeight: 198,
                }}
              >
                <Stack
                  p={5}
                  style={{
                    borderBottom: "0.5px solid #ccc",
                  }}
                >
                  {searchData.length > 0 &&
                    searchData.map((item) => (
                      <Group>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            border: "1px solid #ccc",
                            borderRadius: 3,
                          }}
                        >
                          <Image
                            priority
                            loader={({ src }) => src}
                            src={img_load + item.image}
                            alt="image"
                            width={50}
                            height={50}
                            styles={{
                              root: { height: "100%" },
                              figure: { width: "100%", height: "100%" },
                              imageWrapper: { width: "100%", height: "100%" },
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <Link href={"/detail?id=" + item.id} key={item.id}>
                          <Text
                            style={{
                              cursor: "pointer",
                            }}
                            fz="sm"
                          >
                            {item.name}
                          </Text>
                        </Link>
                      </Group>
                    ))}
                </Stack>
              </ScrollArea>
            )}
          </Grid.Col>

          {/* action icon: Wish list & Cart */}
          <Grid.Col span={3}>
            <Group spacing="xs" grow position="center">
              <ActionIcon size={36} variant="subtle" color="teal">
                <Link href="/wishlist" passhref="true">
                  <Group spacing="xs">
                    <Indicator
                      color="green"
                      label={wishlist.length + ""}
                      //dot="false"
                      inline
                      mr={5}
                      size={20}
                      radius="xl"
                    >
                      <AiOutlineHeart size={20} />
                    </Indicator>
                    <Text>Wishlist</Text>
                  </Group>
                </Link>
              </ActionIcon>

              <ActionIcon size={36} variant="subtle" color="teal">
                <Link href="/cart" passhref="true">
                  <Group spacing="xs">
                    <Indicator
                      color="green"
                      label={cart.length + ""}
                      mr={5}
                      //dot="false"
                      //showZero="false"
                      //overflowCount={999}
                      inline
                      size={22}
                    >
                      <AiOutlineShoppingCart size={20} />
                    </Indicator>
                    <Text>Cart</Text>
                  </Group>
                </Link>
              </ActionIcon>
            </Group>
          </Grid.Col>
          {/* button: User's name */}
          <Grid.Col span={2}>
            {isUser && Object.keys(isUser).length > 0 ? (
              <UserMenu
                isUser={isUser.role}
                name={isUser.name}
                onLogout={() => setUser(undefined)}
              />
            ) : (
              <ActionIcon size="sx" variant="subtle" color="teal">
                <Link href="/customer/login" replace>
                  <Group spacing="xs">
                    <AiOutlineUser size={20} />
                    <Text>Account</Text>
                  </Group>
                </Link>
              </ActionIcon>
            )}
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper
        shadow="xs"
        style={{
          paddingBottom: !isVisible ? 0 : 5,
          height: !isVisible ? 0 : "auto",
          opacity: !isVisible ? 0 : 1,
          visibility: !isVisible ? "hidden" : "visible",
          transition: "all 0.3s ease",
        }}
      >
        <Flex 
          gap="xl"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <MainMenu
            data={[
              { title: "Home", path: "/" },
              { title: "About", path: "/about" },
              { title: "Store", path: "/store" },
            ]}
          />

          <ListIcon
            data={[
              {
                icon: <CiFacebook size={18} />,
                path: "https://www.facebook.com/",
              },
              {
                icon: <CiTwitter size={18} />,
                path: "https://www.twitter.com/",
              },
              {
                icon: <CiInstagram size={18} />,
                path: "https://www.instagram.com/",
              },
              {
                icon: <CiYoutube size={18} />,
                path: "https://www.youtube.com/",
              },
              {
                icon: <ImWhatsapp size={18} />,
                path: "https://www.whatsapp.com/",
              },
            ]}
          />
          <Divider size="sm" orientation="vertical" />

          <Contact
            phoneNumber={"(012) 345-6789"}
            dateTime={"Contact for help!"}
          />
        </Flex>
      </Paper>
    </Container>
  );
}

export default Header;
