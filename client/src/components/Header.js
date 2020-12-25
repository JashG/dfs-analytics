import { Avatar, Box, Flex, Heading, Tag } from '@chakra-ui/react';
import React from 'react';

const bgUrl =
  "data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23718096' fill-opacity='0.52' fill-rule='evenodd'/%3E%3C/svg%3E";

// Extra styling we need to apply to Header that can't be passed as props to Box component
const HeaderStyles = {
  borderImage: 'linear-gradient(to left, #6CB3ED, #48BB78)', // blue.300, green.400
  borderImageSlice: '1',
};

const Header = () => {
  return (
    <Box
      width="100%"
      padding="20px 0"
      borderTop="6px solid"
      backgroundImage={`linear-gradient(to right, #1A202C, transparent), linear-gradient(to left, #1A202C, transparent 30%), linear-gradient(to top, #1A202C, transparent), url("${bgUrl}")`}
      style={HeaderStyles}
      // _hover={HeaderStyles.hover}
    >
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
