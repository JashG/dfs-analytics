import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import Header from './Header';
import Standings from './Standings';
import TeamComparison from './TeamComparison';

const tabs = ['Weekly Results', 'Team Comparison Tool'];

const Home = () => {
  return (
    <div style={{ height: '100%' }}>
      {/* <HeaderSection /> */}
      <Flex margin="0px 20px 40px 20px">
        <Header />
      </Flex>
      <Flex flexDir="column" margin="20px">
        <Heading as="h2" variant="tableTitle" m="0.5em 0">
          {tabs[0]}
        </Heading>
        <Standings />
        <Heading as="h2" variant="tableTitle" mt="1.5em" mb="0.5em">
          {tabs[1]}
        </Heading>
        <TeamComparison />
      </Flex>
    </div>
  );
};

export default Home;
