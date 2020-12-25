import { Flex, Select } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import TeamSnapshotWrapper from './TeamSnapshotWrapper';

// TODO: Get this from API
const teams = [
  'McKrank',
  'JashG98',
  'paynetrain37',
  'dhdrewhouston',
  'rileyc98',
  'JParrot12',
];

const TeamComparison = () => {
  // API data
  const [teamOneData, setTeamOneData] = useState('');
  const [loadingTeamOneData, setLoadingTeamOneData] = useState(false);
  const [teamTwoData, setTeamTwoData] = useState('');
  const [loadingTeamTwoData, setLoadingTeamTwoData] = useState(false);

  // Selected teams from filter in UI
  const [teamOne, setTeamOne] = useState('');
  const [teamTwo, setTeamTwo] = useState('');

  const fetchTeamData = async (teamName, isTeamOne) => {
    isTeamOne ? setLoadingTeamOneData(true) : setLoadingTeamTwoData(true);
    return axios.get(`http://localhost:5000/team-data-2?team_name=${teamName}`);
  };

  const handleTeamSelection = async (e, isTeamOne) => {
    if (e.target && e.target.value) {
      const teamName = e.target.value;
      if (isTeamOne) {
        setTeamOne(teamName);
        setLoadingTeamOneData(true);
      } else {
        setTeamTwo(teamName);
        setLoadingTeamTwoData(true);
      }

      const teamData = await fetchTeamData(teamName, isTeamOne);
      if (teamData && teamData.data) {
        if (isTeamOne) {
          setTeamOneData(teamData.data);
          setLoadingTeamOneData(false);
        } else {
          setTeamTwoData(teamData.data);
          setLoadingTeamTwoData(false);
        }
      }
    }
  };

  const getTeamSelection = (isTeamOne = true) => {
    return (
      <Select
        size="lg"
        variant="filled"
        value={isTeamOne ? teamOne : teamTwo}
        placeholder="Select Team"
        onChange={e => handleTeamSelection(e, isTeamOne)}
      >
        {teams.map(team => {
          return (
            <option
              value={team}
              disabled={isTeamOne ? teamTwo === team : teamOne === team}
            >
              {team}
            </option>
          );
        })}
      </Select>
    );
  };

  return (
    <>
      <Flex wrap="wrap" justifyContent="center">
        <Flex
          m="10px"
          p="8px"
          w={{ base: '100%', md: '45%' }}
          minHeight="400px"
          // maxHeight="800px"
          flexDir="column"
        >
          {getTeamSelection()}
          <TeamSnapshotWrapper
            selectedTeam={teamOne}
            teamData={teamOneData}
            isLoading={loadingTeamOneData}
            opposingTeamData={teamTwoData}
          />
        </Flex>
        <Flex
          m="10px"
          p="8px"
          w={{ base: '100%', md: '48%' }}
          minHeight="400px"
          // maxHeight="800px"
          flexDir="column"
        >
          {getTeamSelection(false)}
          <TeamSnapshotWrapper
            selectedTeam={teamTwo}
            teamData={teamTwoData}
            isLoading={loadingTeamTwoData}
            opposingTeamData={teamOneData}
            alignData="left"
          />
        </Flex>
      </Flex>
    </>
  );
};

export default TeamComparison;
