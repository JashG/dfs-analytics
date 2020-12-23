import { TriangleUpIcon } from '@chakra-ui/icons';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import TeamSnapshot from './TeamSnapshot';

const TeamSnapshotWrapper = ({
  selectedTeam,
  teamData,
  isLoading,
  opposingTeamData,
  alignData = 'right',
}) => {
  const placeholder = (text, showIcon = true) => {
    return (
      <Center height="100%">
        {showIcon && <TriangleUpIcon mr="6px" />}
        <Text fontSize="xl">{text}</Text>
      </Center>
    );
  };

  const renderTeamData = () => {
    if (isLoading) {
      return <Spinner size="xl" />;
    }
    if (teamData) {
      return (
        <TeamSnapshot
          selectedTeam={selectedTeam}
          teamData={teamData}
          opposingTeamData={opposingTeamData}
          alignData={alignData}
        />
      );
    } else {
      return placeholder('No data', false);
    }
  };

  return (
    <Box height="100%" overflow="scroll">
      {selectedTeam ? renderTeamData() : placeholder('Select a Team')}
    </Box>
  );
};

export default TeamSnapshotWrapper;
