// Chakra imports
import {
  Skeleton, Stack,
  Box, 
  SkeletonCircle,
  SkeletonText,
  Flex,
  Text,
  Input,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import Products from "./components/Products";
import config from "config";
import { useState, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import utils from "../../../utils";

function Tables() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const textColor = useColorModeValue("gray.700", "white");

const getProducts = async () => {
  try {
    const perfil = utils.getProfile();
    const response = await fetch(`${config.API_URL}/articles/${perfil.price}`).then((response) => response.json());
    setProducts(response)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

const searchProduct = async (e) => {
  if (e.key == 'Enter') {
    if (e.target.value === '') {
      console.log('caso 1')
      getProducts()
      return;
    } else {
      try {
        console.log('caso 2')
        setLoading(true);
        const perfil = utils.getProfile();
        const response = await fetch(`${config.API_URL}/articles/${perfil.price}/clave/${e.target.value}`).then((response) => response.json());
        setProducts(response)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }
  return;
}

useEffect(() => {
    // if (loading) {
    getProducts();
    // }
},[]);

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardBody>
            <Text fontSize='md' color={textColor} fontWeight='bold'>
            Buscar: &nbsp;&nbsp;&nbsp;
            </Text>
            <Input
              fontSize="sm"
              py="12px"
              placeholder="Escribe el numero de parte y presiona enter"
              borderRadius="inherit"
              onKeyUp={(e) => searchProduct(e)}
              />
        </CardBody>
      </Card>
        <br />
        { loading ? (
        <Box padding='6' boxShadow='lg' bg='white'>
          <SkeletonText mt='5' noOfLines={40} spacing='4' fadeDuration={0.8} />
        </Box>
      ) : (
      <Products
        title={"Productos"}
        captions={["clave", "articulo", "Precio", "Henequen", "Mezquital", "Carlos Amaya", "Accion"]}
        data={products}
      />
      )}
    </Flex>
  );
}

export default Tables;
