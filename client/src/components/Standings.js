import { Table, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

const Standings = () => {
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Place</Th>
            <Th>Team</Th>
            <Th>Total Points</Th>
            <Th>Avg. Points</Th>
            <Th>Most Used Players</Th>
          </Tr>
        </Thead>
      </Table>
    </>
  );
};

export default Standings;
