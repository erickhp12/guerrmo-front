/*eslint-disable*/
// chakra imports
import {
    Box,
    Button, Flex,
    Link,
    Stack,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import miniLogo from "assets/img/miniLogo.png";
import IconBox from "components/Icons/IconBox";
import { Separator } from "components/Separator/Separator";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import utils from '../../utils'

// this function creates the links and collapses that appear in the sidebar (left menu)


const SidebarContent = ({ logoText, routes }) => {

  // to check for active links and opened collapses
  let location = useLocation();
  let client_id = utils.getProfile().client_id;
  
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  const createLinks = (routes) => {
    // Chakra Color Mode
    const activeBg = useColorModeValue("white", "gray.700");
    const inactiveBg = useColorModeValue("white", "gray.700");
    const activeColor = useColorModeValue("gray.700", "white");
    const inactiveColor = useColorModeValue("gray.400", "gray.400");

    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "12px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {document.documentElement.dir === "rtl"
                ? prop.rtlName
                : prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={prop.name}>
<<<<<<< HEAD
          {activeRoute(prop.layout + prop.path) === "active"  ? (
=======
          {activeRoute(prop.layout + prop.path) === "active" ? (
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
<<<<<<< HEAD
              hidden={client_id == 0 && prop.requireLogin && (client_id != 13 && prop.isSuperAdmin)}
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
              bg={activeBg}
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="teal.300"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
<<<<<<< HEAD
              hidden={client_id == 0 && prop.requireLogin}
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              py="12px"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={inactiveBg}
                    color="teal.300"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

    const links = <>{createLinks(routes)}</>;

  return (
    <>
        <Box pt={"25px"} mb="12px">
        <Link
          href={`${process.env.PUBLIC_URL}/#/`}
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
        <img src={miniLogo} alt="guerrmo" />
      </Link>
      <Separator></Separator>
    </Box>
          <Stack direction="column" mb="40px">
            <Box>{links}</Box>
          </Stack>
<<<<<<< HEAD
=======
          {/* <SidebarHelp /> */}
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
    </>
  )
}

export default SidebarContent