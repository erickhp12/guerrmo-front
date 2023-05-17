// Chakra imports
import { Flex, Switch, Text, useColorModeValue, Button } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";

const PlatformSettings = ({ title, subtitle1, subtitle2 }) => {

  const changePassword = () => {
    console.log('hola')
  }
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card p='16px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      <CardBody px='5px'>
        <Flex direction='column'>
          <Text fontSize='sm' color='gray.500' fontWeight='600' mb='20px'>
            {subtitle1}
          </Text>
          <Flex align='center' mb='20px'>
            <Switch defaultChecked colorscheme='teal' me='10px' />
            <Text noOfLines={0} fontSize='md' color='gray.500' fontWeight='400'>
              Activa
            </Text>
          </Flex>
          <Text
            fontSize='sm'
            color='gray.500'
            fontWeight='600'
            m='6px 0px 20px 0px'>
            {subtitle2}
          </Text>
          <Flex align='center'>
            <Button 
            fontSize='14px'
            type='submit'
            bg='red.400'
            w='100%'
            h='45'
            mb='20px'
            color='white'
            mt='20px'
            _hover={{
              bg: "red.600",
            }}
            _active={{
              bg: "red.400",
            }}
            onClick={() => changePassword()}>
              Cambiar contrasena
          </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlatformSettings;
