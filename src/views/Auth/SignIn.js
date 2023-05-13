import React from "react";
import config from "../../config.js"
import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";

import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";

function SignIn() {
  const [client, setClient] = useState(0);
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await fetch(`${config.API_URL}/clients/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({client_id:client, password:password}),
      }).then((response) => response.json());
      const error = response.error
      if (!error) {
        const profile = JSON.stringify(response.data)
        window.location.replace('/#/admin/profile')
        localStorage.setItem('profile', profile)
      } else {
        alert('Usuario o contrasena incorrecto')
        setClient(0)
        setPassword('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logInAsSguest = async () => {
    window.location.replace('/#/admin/tables')
  }

  // Chakra color mode
  const titleColor = useColorModeValue("red.400", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex position='relative' mb='40px'>
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: "100px", md: "0px" }}>
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}>
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: "150px", lg: "80px" }}>
            <Heading color={titleColor} fontSize='32px' mb='10px'>
              Inicio de sesión
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='bold'
              fontSize='14px'>
              Inicia sesion para ver precios preferenciales
            </Text>
            <FormControl>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                ID Cliente
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='24px'
                maxLength={3}
                fontSize='sm'
                type='number'
                placeholder='ID Cliente'
                size='lg'
                onChange={e => setClient(e.target.value)}
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Contraseña
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='36px'
                fontSize='sm'
                type='password'
                value={password}
                placeholder='Contraseña'
                size='lg'
                onChange={e => setPassword(e.target.value)}
              />
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
                onClick={login}
                >
                Iniciar sesión
              </Button>
              <Button
                fontSize='14px'
                type='submit'
                bg='gray.400'
                w='100%'
                h='45'
                mb='20px'
                color='white'
                mt='20px'
                _hover={{
                  bg: "gray.800",
                }}
                _active={{
                  bg: "gray.400",
                }}
                onClick={logInAsSguest}
                >
                Entrar como invitado
              </Button>
            </FormControl>
            <Flex
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              maxW='100%'
              mt='0px'>
              {/* <Text color={textColor} fontWeight='medium'>
                No tienes una cuenta?
                <Link color={titleColor} as='span' ms='5px' fontWeight='bold'>
                  Registrate
                </Link>
              </Text> */}
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'>
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
