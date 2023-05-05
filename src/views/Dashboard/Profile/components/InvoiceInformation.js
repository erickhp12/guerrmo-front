// Chakra imports
import { Flex, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const ProfileInformation = ({
  domicilio,
  noExt,
  noInt,
  localidad,
  ciudad,
  estado,
  pais,
  codigoPostal,
  colonia,
  rfc,
  usoCfdi,
  curp,
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p='16px' my={{ sm: "24px", xl: "0px" }}>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          Datos de facturación
        </Text>
      </CardHeader>
      <CardBody px='5px'>
        <Flex direction='column'>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Calle:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {domicilio || '--'} {noExt} -{noInt}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              C.P.:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {codigoPostal || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Colonia:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {colonia || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Localidad:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {localidad || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Ciudad:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {ciudad || '--'} {estado || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              RFC:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {rfc || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Uso CFDI:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {usoCfdi || '--'}
            </Text>
          </Flex>
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              CURP:{" "}
            </Text>
            <Text fontSize='md' color='gray.500' fontWeight='400'>
              {curp || '--'}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileInformation;
