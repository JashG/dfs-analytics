import { Button, Center, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import HeaderSection from './HeaderSection';
import Standings from './Standings';

const tabs = ['Team Overview', 'League Leaders'];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const tabBtns = tabs.map(tab => {
    return (
      <WrapItem>
        <Button
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
      <Center mb="20px">
        <Wrap spacing="25px" justify="center">
          {tabBtns}
        </Wrap>
      </Center>
      <Center ml="20px" mr="20px">
        <Standings />
      </Center>
    </div>
  );
};

export default Home;
