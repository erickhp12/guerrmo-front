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
  const [cartText, setCartText] = useState('Agregar al carrito');
  const [addedToCart, setAddedToCart] = useState(false);

  const addCart = async (data) => {
    try {
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
      setCartText('Agregado al carrito');
      setAddedToCart(true);
    } catch(error) {
      console.log('Error al agregar al carrito ' + error.toString());
    }
  }

  useEffect(() => {
    if (loading) {
      setExistence(existencia);
      addCart();
      setLoading(false);
    }
});


  const { item, clave, claveAlterna, precio, existencia, descripcion, caracteristicas } = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
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
            ${precio}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {existence}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Button
          disabled={addedToCart}
          p="0px"
          bg="transparent"
          variant="no-hover">
          <Text
            fontSize="sm"
            color={addedToCart ? "dark.300" : "green.300"}
            fontWeight="bold"
            cursor="pointer"
            onClick={() => addCart(item)}
          >
            <CartIcon color="inherit" />
            &nbsp;{cartText}
          </Text>
        </Button>
      </Td>
    </Tr>
  );
}

export default TablesProductRow;
