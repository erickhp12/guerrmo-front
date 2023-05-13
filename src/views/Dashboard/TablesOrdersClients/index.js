// Chakra imports
import {
  Flex,
  Input,
  Text
} from "@chakra-ui/react";
import React from "react";
import OrdersClients from "./components/OrdersClients";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody";
import config from "config";
import { useState, useEffect } from "react";


function TablesOrdersClients() {
  const [orders, setOrders] = useState([]);
  const [client, setClient] = useState(0);
  const [loading, setLoading] = useState(true);

  const getOrdersClients = async () => {
    try {
      const response = await fetch(`${config.API_URL}/articles/orders-clients/${client}`).then((response) => response.json());
      setOrders(response)
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false)
    }
  }


  const searchProduct = async (e) => {
    if (e.key == 'Enter') {
      try {
        const response = await fetch(`${config.API_URL}/articles/orders-clients/${e.target.value}`).then((response) => response.json());
        setOrders(response)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
      } else if (e.target.value == '') {
        getOrdersClients();
      } else {
        return;
    }
  }

  useEffect(() => {
    if (loading) {
      getOrdersClients();
    }
  });

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardBody>
          <Text fontSize='md' fontWeight='bold'>
          Buscar: &nbsp;&nbsp;&nbsp;
          </Text>
          <Input
            fontSize="sm"
            py="12px"
            placeholder="Escribe el numero o nombre de cliente"
            borderRadius="inherit"
            onKeyUp={(e) => searchProduct(e)}
            />
        </CardBody>
      </Card>
      <br />
      <OrdersClients
        title={"Ordenes de clientes"}
        captions={["Fecha", "Cliente", "Total", "Articulos"]}
        data={orders}
      />
    </Flex>
  );
}

export default TablesOrdersClients;
