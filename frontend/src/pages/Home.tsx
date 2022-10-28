import { Flex } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import SearchBox from "../components/SearchBox";

const Home = () => {
  return (
    <>
      <Navbar></Navbar>
      <Flex justifyContent="center" alignItems="center" height="80vh">
        <SearchBox />
      </Flex>
    </>
  );
};

export default Home;
