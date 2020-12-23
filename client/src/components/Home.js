import { Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import HeaderSection from './HeaderSection';
import Standings from './Standings';
import TeamComparison from './TeamComparison';

const tabs = ['Team Overview', 'League Leaders'];

const Home = () => {
  return (
    <div style={{ height: '100%' }}>
      <HeaderSection />
      <Flex flexDir="column" ml="20px" mr="20px">
        <Heading as="h2" variant="tableTitle" m="0.5em 0">
          Team Overview
        </Heading>
        <Standings />
        <Heading as="h2" variant="tableTitle" mt="1.5em" mb="0.5em">
          Team Comparison Tool
        </Heading>
        <TeamComparison />
      </Flex>
    </div>
  );
};

export default Home;
