import {
  Icon,
  Button,
  Flex,
  Td,
  Text,
  Input,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import utils from "../../utils"
import config from "config"


import { FaTrashAlt } from "react-icons/fa";

function TablesCarritoRow(props) {

  const [deleteArticle, setDeleteArticle] = useState(false);
  const [cartText, setCartText] = useState('Eliminar');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removeFromCart, setRemoveFromCart] = useState(false);

  
  const removeArticle = async (articleSelected) => {
    try {
      const profile = utils.getProfile();
      await fetch(`${config.API_URL}/articles/delete/${articleSelected}/client/${profile.client_id}`, {method: "DELETE"});
      setCartText('Eliminado');
      setRemoveFromCart(true);
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setDeleteArticle(true);
    }
  }

  const modifyQty = async (value, art_id, special) => {
    try {
      if (!special) {
        let newValue = quantity;
        newValue += value;
        value = newValue
        setQuantity(newValue);
      } else {
        setQuantity(value);
      }
      const profile = utils.getProfile();
      const dataToSend = {
        qty: value,
        art_id: art_id,
        client_id: profile.client_id
      };
      await fetch(`${config.API_URL}/articles/modify-qty/`, 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
    } catch (error) {
      console.log(error);
    }
  }

  
  useEffect(() => {
    if (loading) {
      setQuantity(qty);
      setLoading(!loading);
    }
});

  const { index, art_id, price, qty, description, features } = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr hidden={deleteArticle}>
      <Td maxWidth={{ sm: "20px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="sm"
              color={removeFromCart ? "red.300" : textColor}
              fontWeight="semi-bold"
              minWidth="100%"
            >
              {index}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={removeFromCart ? "red.300" : textColor} fontWeight="bold">
            {art_id}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
           <Text fontSize="md" color={removeFromCart ? "red.300" : textColor} fontWeight="semi-bold">
            ${price}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Flex>
            <Button
              w="10%"
              fontWeight="bold"
              textColor={"white"}
              bg="#b10000"
              fontSize="sm"
              onClick={() => modifyQty(-1, art_id, false)}
              >-
            </Button>
            <Input
              fontSize="md"
              value={quantity}
              width="70px"
              onChange ={(e) => modifyQty(e.target.value, art_id, true)}
            />
            <Button
              w="10%"
              fontWeight="bold"
              textColor={"white"}
              bg="#0b8200"
              fontSize="xs"
              onClick={() => modifyQty(1, art_id, false)}
              >+
            </Button>
            </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="sm" color={removeFromCart ? "red.300" : textColor} fontWeight="semi-bold">
            {description}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Text fontSize="sm" color={removeFromCart ? "red.300" : textColor} fontWeight="semi-bold">
            {features}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Button p="0px" bg="transparent" variant="no-hover">
          <Text
            disabled={removeFromCart}
            fontSize="sm"
            color={removeFromCart ? "dark.300" : "red.300"}
            fontWeight="bold"
            cursor="pointer"
            onClick={() => removeArticle(art_id)}
          >
            {/* <CartIcon color="inherit" /> */}
            <Icon as={FaTrashAlt} me="4px" />
            &nbsp;{cartText}
          </Text>
    
        </Button>
      </Td>
    </Tr>
  );
}

export default TablesCarritoRow;
