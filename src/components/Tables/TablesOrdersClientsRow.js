import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import moment from "moment";
import config from "config";

const STATUS_COLORS = {
  nuevo: "blue",
  en_proceso: "yellow",
  entregado: "green",
};

function TablesOrdersClientsRow({ index, id, client_id, client_name, articles, orderDate, total_price, status }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clientAddress, setClientAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const textColor = useColorModeValue("gray.700", "white");
  const subtleColor = useColorModeValue("gray.500", "gray.400");

  const openDetail = async () => {
    onOpen();
    if (clientAddress || client_id >= 900000) return;
    setLoadingAddress(true);
    try {
      const res = await fetch(`${config.API_URL}/clients/prefill/${client_id}/`);
      const data = await res.json();
      if (!data.error) setClientAddress(data.data);
    } catch (_) {
      // address not critical, drawer still opens
    } finally {
      setLoadingAddress(false);
    }
  };

  const subtotal = articles.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      <Tr>
        <Td>
          <Text fontSize="sm" color={subtleColor}>
            {moment(orderDate).format("DD MMM YYYY")}
          </Text>
        </Td>
        <Td>
          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
            {client_id} — {client_name}
          </Text>
        </Td>
        <Td>
          <Badge colorScheme={STATUS_COLORS[status] || "gray"}>
            {status || "nuevo"}
          </Badge>
        </Td>
        <Td isNumeric>
          <Text fontSize="sm" fontWeight="bold" color={textColor}>
            ${Number(total_price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Text>
        </Td>
        <Td>
          <Button size="sm" colorScheme="teal" variant="outline" onClick={openDetail}>
            Ver detalle
          </Button>
        </Td>
      </Tr>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontSize="lg" fontWeight="bold">
              Pedido #{id}
            </Text>
            <Text fontSize="sm" color={subtleColor} fontWeight="normal">
              {moment(orderDate).format("DD [de] MMMM YYYY, HH:mm")}
            </Text>
          </DrawerHeader>

          <DrawerBody pt={4} pb={8}>
            {/* Client info */}
            <Text fontSize="md" fontWeight="bold" mb={2}>
              Cliente
            </Text>
            <Flex direction="column" bg="gray.50" borderRadius="md" p={3} mb={4} gap={1}>
              <Text fontSize="sm"><b>Nombre:</b> {client_name}</Text>
              <Text fontSize="sm"><b>ID:</b> {client_id}</Text>
              {loadingAddress && <Text fontSize="sm" color={subtleColor}>Cargando dirección…</Text>}
              {clientAddress && (
                <>
                  {clientAddress.telefono && <Text fontSize="sm"><b>Teléfono:</b> {clientAddress.telefono}</Text>}
                  {clientAddress.correo && <Text fontSize="sm"><b>Correo:</b> {clientAddress.correo}</Text>}
                  {(clientAddress.calle || clientAddress.noExt) && (
                    <Text fontSize="sm">
                      <b>Dirección:</b>{" "}
                      {[clientAddress.calle, clientAddress.noExt, clientAddress.noInt]
                        .filter(Boolean)
                        .join(" ")}
                    </Text>
                  )}
                  {clientAddress.colonia && <Text fontSize="sm"><b>Colonia:</b> {clientAddress.colonia}</Text>}
                  {clientAddress.localidad && (
                    <Text fontSize="sm">
                      <b>Ciudad:</b> {clientAddress.localidad}
                      {clientAddress.codigoPostal ? `, C.P. ${clientAddress.codigoPostal}` : ""}
                    </Text>
                  )}
                </>
              )}
              {client_id >= 900000 && (
                <Text fontSize="sm" color={subtleColor}>Cliente invitado — sin dirección registrada</Text>
              )}
            </Flex>

            {/* Articles table */}
            <Text fontSize="md" fontWeight="bold" mb={2}>
              Artículos
            </Text>
            <Table variant="simple" size="sm" mb={4}>
              <Thead>
                <Tr>
                  <Th>Clave</Th>
                  <Th>Descripción</Th>
                  <Th isNumeric>Precio</Th>
                  <Th isNumeric>Cant.</Th>
                  <Th isNumeric>Subtotal</Th>
                </Tr>
              </Thead>
              <Tbody>
                {articles.map((item) => (
                  <Tr key={item.art_id}>
                    <Td fontFamily="mono" fontSize="xs">{item.art_id}</Td>
                    <Td fontSize="xs" maxW="160px" whiteSpace="normal">{item.description}</Td>
                    <Td isNumeric fontSize="xs">${Number(item.price).toFixed(2)}</Td>
                    <Td isNumeric fontSize="xs">{item.qty}</Td>
                    <Td isNumeric fontSize="xs" fontWeight="semibold">
                      ${(item.price * item.qty).toFixed(2)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Totals */}
            <Flex justify="flex-end">
              <Flex direction="column" align="flex-end" gap={1}>
                <Text fontSize="sm" color={subtleColor}>
                  {articles.length} artículo{articles.length !== 1 ? "s" : ""}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Total: ${Number(subtotal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </Text>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default TablesOrdersClientsRow;
