import { Avatar, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const TeamSnapshot = ({ selectedTeam, teamData, opposingTeamData }) => {
  const getTeamHeader = () => {
    return (
      <Flex flexDir="row">
        <Avatar
          size="2xl"
          mr="8px"
          name={selectedTeam}
          src={teamData.img || ''}
        />
        <Flex flexDir="column">
          <Text fontSize="xl">{selectedTeam}</Text>
          <Text>Place: {teamData.place}</Text>
        </Flex>
      </Flex>
    );
  };

  return <Flex flexDir="column">{getTeamHeader()}</Flex>;
};

export default TeamSnapshot;
