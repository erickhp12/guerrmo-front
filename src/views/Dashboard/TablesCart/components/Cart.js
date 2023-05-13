// Chakra imports
import {
  Table,
  Tbody,
  Text,
<<<<<<< HEAD
  Button,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
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
import TablesCarritoRow from "components/Tables/TablesCarritoRow";
import React from "react";
import { Separator } from "components/Separator/Separator";
import utils from '../../../../utils';
import config from '../../../../config';

const Cart = ({ title, captions, data }) => {

  const submitOrder = async () => {
    try {
      const profile = utils.getProfile();
      const dataToSend = {
        client_id: profile.client_id
      };
      await fetch(`${config.API_URL}/articles/submit-order/`, 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      window.location.replace('/#/admin/profile')
    } catch(error) {
      console.log(error);
    }
  }
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
          { data.items && data.items.length > 0 ? (
            <Tbody>
              {data.items.map((row, index) => {
                return (
                  <TablesCarritoRow
                    index={index+1}
                    art_id={row.art_id}
                    price={row.price}
                    qty={row.qty}
                    description={row.description}
                    features={row.features}
                  />
                );
              })}
            </Tbody>
            ) : (
            <Tbody>
              <tr>
                <td colSpan='4'>
                  No hay articulos en el carrito
                </td>
              </tr>
            </Tbody>
          )}
          <br />
          <Separator></Separator>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td textAlign='right' fontWeight="bold">TOTAL:</Td>
              <Td fontSize="lg" color={textColor} fontWeight="bold">${data.total_price}</Td>
              <Td fontSize="lg" color={textColor} fontWeight="bold">{data.total_items}</Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </CardBody>
<<<<<<< HEAD
      <br />
      <br />
      <Button
        h="52px"
        w="152px"
        onClick={() => submitOrder()}
        bg={"green.500"}
        boxShadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
      >
        Ordenar pedido
      </Button>
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
    </Card>
  );
};

export default Cart;
