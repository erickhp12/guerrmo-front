// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React from "react";
import { FaCube, FaPenFancy } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import InvoiceInformation from "./components/InvoiceInformation";
import config from "../../../config.js";
import utils from "../../../utils";
import { useState, useEffect } from "react";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const perfil = utils.getProfile();
      const response = await fetch(`${config.API_URL}/clients/profile/${perfil.client_id}/`).then((response) => response.json());
      setProfile(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
      if (loading) {
        getProfile();
      }
  });

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 210.84%)"
  );

  return (
    <Flex direction='column'>
      
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar4}
        name={profile.nombre}
        email={profile.mail}
        tabs={[
          {
            name: "OVERVIEW",
            icon: <FaCube w='100%' h='100%' />,
          },
          {
            name: "TEAMS",
            icon: <IoDocumentsSharp w='100%' h='100%' />,
          },
          {
            name: "PROJECTS",
            icon: <FaPenFancy w='100%' h='100%' />,
          },
        ]}
      />
      <br />
      <br />
      <br />
      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap='22px'>
        <PlatformSettings
          title={"Ajustes"}
          subtitle1={"Cuenta"}
          subtitle2={"Seguridad"}
        />
        <ProfileInformation
          client_id={profile.client_id}
          nombre={profile.nombre}
          representante={profile.representante}
          telefono={profile.telefono}
          celular={profile.celular}
          mail={profile.mail}
          limite={profile.limite}
          precio={profile.precio}
          diasCredito={profile.diasCredito}
        />
        <InvoiceInformation
          domicilio={profile.domicilio}
          noExt={profile.noExt}
          noInt={profile.noInt}
          localidad={profile.localidad}
          ciudad={profile.ciudad}
          estado={profile.estado}
          pais={profile.pais}
          codigoPostal={profile.codigoPostal}
          colonia={profile.colonia}
          rfc={profile.rfc}
          usoCfdi={profile.usoCfdi}
          curp={profile.curp}
        />
      </Grid>
    </Flex>
  );
}

export default Profile;
