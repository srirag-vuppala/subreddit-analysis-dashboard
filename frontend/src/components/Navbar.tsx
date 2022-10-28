import React from "react";

import {
  Box,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Link } from "react-router-dom";
import { ReactComponent as ReactLogo } from "./logo.svg";
import RoundBox from "./RoundBox";

const Navbar = ({children}) => {
  return (
    <>
      <Box p={3} borderRadius="0">
        <Flex justify="space-between" align="center">
          <RoundBox>
            <HStack spacing="10px">
              <ReactLogo width={30} height={30} />
              <Box>
                <Link to="/">
                  <Text fontSize="xl" fontWeight="bold">
                    Subreddit Analyzer
                  </Text>
                </Link>
              </Box>
            </HStack>
          </RoundBox>
          {children}

          <RoundBox padding={2}>
            <ColorModeSwitcher />
          </RoundBox>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
