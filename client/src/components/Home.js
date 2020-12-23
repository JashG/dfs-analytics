import { Button, Flex, Heading, WrapItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import Standings from './Standings';
import TeamComparison from './TeamComparison';

const tabs = ['Team Overview', 'League Leaders'];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const tabBtns = tabs.map(tab => {
    return (
      <WrapItem>
        <Button
          key={tab}
          variant="tab"
          bg={activeTab === tab ? 'orange.400' : ''}
          onClick={() => {
            setActiveTab(tab);
          }}
        >
          {tab}
        </Button>
      </WrapItem>
    );
  });

  return (
    <div style={{ height: '100%' }}>
      <HeaderSection />
      <Flex flexDir="column" ml="20px" mr="20px">
        <Heading as="h2" m="0.5em 0">
          Team Overview
        </Heading>
        <Standings />
        <Heading as="h2" mt="1.5em" mb="0.5em">
          Team Comparison Tool
        </Heading>
        <TeamComparison />
      </Flex>
    </div>
  );
};

export default Home;
