import {
  Icon,
  Button,
  Flex,
  Table,
  Tbody,
  Thead,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import config from 'config'

function TablesOrdersClientsRow(props) {

  const [loading, setLoading] = useState(true);

  const markDelivered = async (id) => {
    console.log('hola')
  };

  useEffect(() => {
    if (loading) {
      setLoading(!loading);
    }
});

  const { index, id, client_id, client_name, articles, orderDate, total_price } = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Table hidden={!articles}>
        <Thead>
          <Tr>
            <Td fontWeight="bold" fontSize="md" >Clave</Td>
            <Td fontWeight="bold" fontSize="md" >Precio</Td>
            <Td fontWeight="bold" fontSize="md" >Cant.</Td>
            <Td fontWeight="bold" fontSize="md" >Descripcion</Td>
          </Tr>
        </Thead>
        <Tbody>
        {articles.map((item) => {
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
                <Text fontSize="sm" maxWidth="10%">
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
        <br />
        <br />
        <br />
      </Table>
      <Td>
        <Flex direction="column">
           <Text fontSize="sm" minWidth="100" color={textColor} fontWeight="semi-bold">
            {moment(orderDate).format('DD-MMM-YYYY')}
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
        <Flex direction="column">
           <Text fontSize="sm" color={textColor} fontWeight="semi-bold">
            {client_id} - {client_name}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
           <Button onClick={() => markDelivered(id)}>
            Entregar
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
}

export default TablesOrdersClientsRow;
