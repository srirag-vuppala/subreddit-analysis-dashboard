import React from "react";

import {
  Box,
  Text,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  VisuallyHidden,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Link } from "react-router-dom";
import logo from './logo.svg';

const Navbar = () => {
  return (
    <>
      <Box p={3} borderRadius="0">
        <Flex
          justify="space-between"
          align="center"
        >
          <HStack spacing="10px">
            <Box>
              <Link to="/">
                <Text fontSize="xl" fontWeight="bold">
                    Subreddit Analyzer
                </Text>
              </Link>
            </Box>
            <Box>
              <Icon>
                {logo}
              </Icon>
            </Box>
          </HStack>
          <ColorModeSwitcher />
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
