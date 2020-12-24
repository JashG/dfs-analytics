import { Avatar, Box, Flex, Heading, Tag } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
  return (
    <Box width="100%" pt="20px" borderTop="6px solid" borderColor="blue.300">
      <Flex flexDir="row" wrap="wrap">
        <Flex flexDir="row" alignItems="center">
          <Avatar size="md" background="inherit" src="LeprechaunLogo.png" />
          <Heading as="h1" size="2xl" ml="10px">
            The Super Leprechauns
          </Heading>
        </Flex>
      </Flex>
      <Flex flexDir="row" alignItems="flex-end" margin="10px 0 0 60px">
        <Tag size="md" colorScheme="blue" mr="10px">
          2020
        </Tag>
        <Tag size="md" colorScheme="blue">
          DraftKings
        </Tag>
      </Flex>
    </Box>
  );
};

export default Header;
