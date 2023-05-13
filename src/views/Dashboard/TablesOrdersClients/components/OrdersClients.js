// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import TablesOrdersClientsRow from "components/Tables/TablesOrdersClientsRow";
import React from "react";

const OrdersClients = ({ data }) => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardBody>
        <Table variant='simple' color={textColor}>
          { data.data && data.data.length > 0 ? (
            <Tbody>
              {data.data.map((row, index) => {
                return (
                  <TablesOrdersClientsRow
                    index={index+1}
                    id={row.id}
                    client_id={row.client_id}
                    articles={row.articles}
                    client_name={row.client_name}
                    total_items={row.total_items}
                    total_price={row.total_price}
                    orderDate={row.created_at}
                  />
                );
              })}
            </Tbody>
            ) : (
            <Tbody>
              <tr>
                <td colSpan='4'>
                  No hay ordenes pendientes
                </td>
              </tr>
            </Tbody>
          )}
          <br />
          <Tbody>
            <Tr>
              <Td></Td>
              <Td textAlign='right' fontWeight="bold">TOTAL:</Td>
              <Td fontSize="lg" color={textColor} fontWeight="bold">{data.final_items}</Td>
              <Td fontSize="lg" color={textColor} fontWeight="bold">${data.final_price}</Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default OrdersClients;
