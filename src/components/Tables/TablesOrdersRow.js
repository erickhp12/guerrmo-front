import {
  Icon,
  Flex,
  Table,
  Tbody,
  Thead,
  Th,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import SweetAlert from "react-bootstrap-sweetalert";
import config from 'config'

import { FaEye } from "react-icons/fa";

function TablesOrdersRow(props) {

  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState({
    items:[]
  });
  
  const showModal = async (id) => {
    setVisibleModal(!visibleModal);
    const response = await fetch(`${config.API_URL}/articles/order/${id}`).then((response) => response.json());
    setOrderDetail(response.data)
  }

  useEffect(() => {
    if (loading) {
      setLoading(!loading);
    }
});

  const { index, id, orderDate, total_items, total_price } = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <div hidden={!visibleModal}>
        <SweetAlert
          type="lg"
          hidden
          // title={`Orden ${id}`}
          onConfirm={() => showModal()}
        >
        <Table hidden={!orderDetail}>
          <Thead>
            <Tr>
              <Td fontWeight="bold" fontSize="md" >Clave</Td>
              <Td fontWeight="bold" fontSize="md" >Precio</Td>
              <Td fontWeight="bold" fontSize="md" >Canidad.</Td>
              <Td fontWeight="bold" fontSize="md" >Descripcion</Td>
            </Tr>
          </Thead>
          <Tbody>
          {orderDetail.items.map((item) => {
              return (
              <Tr key={item.art_id}>
                <Td>
                  <Text fontSize="sm" maxWidth="100%">
                   {item.art_id}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm" maxWidth="100%">
                  ${item.price}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm" maxWidth="50%">
                  {item.qty}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm" maxWidth="100%">
                  {item.description}
                  </Text>
                </Td>
              </Tr>
              );
            })}
          </Tbody>
        </Table>
      </SweetAlert>
      </div>
      <Td maxWidth={{ sm: "20px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="sm"
              color={textColor}
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
          <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            {moment(orderDate).format('DD-MMM-YYYY HH:mm')}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex w="50%" direction="column">
          <Text fontSize="sm" color={textColor} fontWeight="semi-bold">
            {total_items}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
           <Text fontSize="md" color={textColor} fontWeight="semi-bold">
            ${total_price}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Text
          fontSize="sm"
          color={"blue.300"}
          fontWeight="bold"
          cursor="pointer"
          onClick={() => showModal(id)}
        >
          <Icon as={FaEye} me="4px" />
          &nbsp; Ver detalle
        </Text>
      </Td>
    </Tr>
  );
}

export default TablesOrdersRow;
