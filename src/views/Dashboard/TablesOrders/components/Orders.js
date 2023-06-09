// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Button,
  Th,
  Thead,
  Tr,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesOrdersRow from "components/Tables/TablesOrdersRow";
import React from "react";
import { Separator } from "components/Separator/Separator";

const Orders = ({ title, captions, data }) => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='6px 0px 22px 0px'>
        <Text fontSize='xl' color={textColor} fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      <CardBody>
        <Table variant='simple' color={textColor}>
          <Thead>
            <Tr my='.8rem' pl='0px' color='gray.400'>
              {captions.map((caption, idx) => {
                return (
                  <Th color='gray.400' key={idx} ps={idx === 0 ? "0px" : null}>
                    {caption}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          { data.data && data.data.length > 0 ? (
            <Tbody>
              {data.data.map((row, index) => {
                return (
                  <TablesOrdersRow
                    index={index+1}
                    id={row.id}
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

export default Orders;
