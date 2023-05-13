// Chakra imports
import {
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import Orders from "./components/Orders";
import config from "config";
import { useState, useEffect } from "react";
import utils from "utils"


function TablesOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const profile = utils.getProfile();
      const response = await fetch(`${config.API_URL}/articles/orders/${profile.client_id}`).then((response) => response.json());
      setOrders(response)
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      if (loading) {
        getOrders();
      }
  });

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Orders
        title={"Ordenes"}
        captions={["#", "Fecha", "Articulos", "Total", "Accion"]}
        data={orders}
      />
    </Flex>
  );
}

export default TablesOrders;
