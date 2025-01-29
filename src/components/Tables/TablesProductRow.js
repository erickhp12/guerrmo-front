import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import config from "../../config";
import utils from "../../utils";
import { CartIcon } from "../../components/Icons/Icons";
import { useState, useEffect } from "react";

function TablesProductRow(props) {

  const [loading, setLoading] = useState(true);
  const [existence, setExistence] = useState(0);
  const [client, setClient] = useState(0);
  const [cartText, setCartText] = useState('Agregar');
  const [addedToCart, setAddedToCart] = useState(false);
  const [count, setCount] = useState(0);


  const addCart = async (data) => {
    try {
      console.log('entrando a addCart', new Date());
      const profile = utils.getProfile();
      const dataToSend = {
        client: profile.client_id,
        article: data.clave,
        price: data.precio,
        description: data.descripcion,
        features: data.caracteristicas
      }
      await fetch(`${config.API_URL}/articles/add-article/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }).then((response) => response.json());
      setExistence(existence-1);
      setCartText('Agregado');
      setAddedToCart(true);
    } catch(error) {
      console.log('Error al agregar al carrito ' + error.toString());
    }
  }

  // useEffect(() => {
  //     console.log('entrando', count)
      // setExistence(existenciaHenequen);
  //     // addCart();
  //     getProfile();
  //     setLoading(false);
  //     setCount(1);
  // }, []);

  const { item, clave, claveAlterna, precio, existenciaHenequen, existenciaMezquital, existenciaCarlosAmaya,  descripcion, caracteristicas } = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Td minWidth={{ sm: "150px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="50%"
            >
              {clave}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {claveAlterna}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {descripcion}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {caracteristicas}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {client.client_id === 0 ? '--' : `$${precio}` }
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {existenciaHenequen}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {existenciaMezquital}
          </Text>
        </Flex>
      </Td>
      <Td minWidth={{ sm: "200px" }}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {existenciaCarlosAmaya}
          </Text>
        </Flex>
      </Td>
      <Td hidden = { client.client_id === 0}>
        <Button
          disabled={addedToCart }
          p="0px"
          bg="transparent"
          variant="no-hover">
          <Text
            fontSize="sm"
            color={addedToCart ? "dark.300" : "green.500"}
            fontWeight="bold"
            cursor="pointer"
            onClick={() => addCart(item)}
          >
            <CartIcon color="inherit" />
            &nbsp;&nbsp;{cartText}
          </Text>
        </Button>
      </Td>
    </Tr>
  );
}

export default TablesProductRow;
