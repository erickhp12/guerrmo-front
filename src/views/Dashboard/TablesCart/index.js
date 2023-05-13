// Chakra imports
import {
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import Cart from "./components/Cart";
import config from "config";
import { useState, useEffect } from "react";


function TablesCart() {
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const textColor = useColorModeValue("gray.700", "white");

  const getCart = async () => {
    try {
      let client_id = 1
      const ls_profile = JSON.parse(localStorage.getItem('profile'))
      if (ls_profile) {
        client_id = ls_profile.client_id
        setProfile(profile)
      }
      const response = await fetch(`${config.API_URL}/articles/cart/${client_id}`).then((response) => response.json());
      setArticles(response.data)
    } catch (error) {
      setArticles([]);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      if (loading) {
        getCart();
      }
  });

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Cart
        title={"Carrito"}
        captions={["#", "Clave", "Precio", "Cantidad", "Descripcion", "Caracteristicas", "Accion"]}
        data={articles}
      />
    </Flex>
  );
}

export default TablesCart;
