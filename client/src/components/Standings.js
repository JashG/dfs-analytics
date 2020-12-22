import {
  Progress,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Standings = () => {
  const [teamData, setTeamData] = useState('');
  const [weeklyData, setWeeklyData] = useState('');
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    setFetchingData(true);
    axios
      .get('http://localhost:5000/db')
      .then(res => {
        if (res && res.data) {
          console.log(res.data);
          if (res.data.team_data) {
            setTeamData(res.data.team_data);
          }
          if (res.data.weekly_data) {
            setWeeklyData(res.data.weekly_data);
          }
        }
        setFetchingData(false);
      })
      .catch(e => {
        setFetchingData(false);
      });
  }, []);

  const getMostUsedPlayers = playerUsage => {
    let mostUsedPlayers = [];
    let maxWeeksPlayed = 0;

    Object.keys(playerUsage).forEach(player => {
      const weeksPlayed = playerUsage[player];
      if (Array.isArray(weeksPlayed)) {
        if (weeksPlayed.length > maxWeeksPlayed) {
          mostUsedPlayers = [
            {
              name: player,
              weeksPlayed,
            },
          ];
          maxWeeksPlayed = weeksPlayed.length;
        } else if (weeksPlayed.length === maxWeeksPlayed) {
          mostUsedPlayers.push({
            name: player,
            weeksPlayed,
          });
        }
      }
    });

    return (
      <Wrap spacing="10px" alignItems="flex-start">
        {mostUsedPlayers.map(player => {
          return (
            <WrapItem>
              <Tag
                size="md"
                key={playerUsage[player]}
                variant="solid"
                colorScheme="orange"
              >
                {`${player.name} (${player.weeksPlayed.length} times)`}
              </Tag>
            </WrapItem>
          );
        })}
      </Wrap>
    );
  };

  const getSeasonHigh = (teamName, low = false) => {
    const seasonHigh = {
      week: '',
      points: !low ? 0 : 1000,
      placement: 0,
    };

    if (Array.isArray(weeklyData)) {
      weeklyData.forEach(week => {
        const weekNum = Object.keys(week).length ? Object.keys(week)[0] : '';
        if (weekNum) {
          const weekObj = week[weekNum];
          let teamPlacement = 0;
          const teamObj = weekObj.find((team, idx) => {
            teamPlacement = idx + 1;
            return team.name === teamName ? team.total_points : false;
          });
          if (
            !low
              ? teamObj.total_points > seasonHigh.points
              : teamObj.total_points < seasonHigh.points
          ) {
            seasonHigh.week = weekNum;
            seasonHigh.points = teamObj.total_points;
            seasonHigh.placement = teamPlacement;
          }
        }
      });
    }

    return seasonHigh;
  };

  const populateTable = () => {
    if (Array.isArray(teamData)) {
      const sortedTeamData = teamData.sort((a, b) => {
        const teamA = Object.keys(a).length ? Object.keys(a)[0] : '';
        const teamB = Object.keys(b).length ? Object.keys(b)[0] : '';
        if (a[teamA].place > b[teamB].place) return 1;
        else if (a[teamA].place < b[teamB].place) return -1;
        return 0;
      });

      return sortedTeamData.map(team => {
        const teamName = Object.keys(team).length ? Object.keys(team)[0] : '';
        if (teamName) {
          const teamObj = team[teamName];
          const seasonHigh = getSeasonHigh(teamName);
          const seasonLow = getSeasonHigh(teamName, true);
          return (
            <Tr key={teamName}>
              <Td>{teamObj.place}</Td>
              <Td>{teamName}</Td>
              <Td>{teamObj.total_points}</Td>
              <Td>{teamObj.avg_points}</Td>
              {/* <Td>{getMostUsedPlayers(teamObj.player_usage)}</Td> */}
              <Td _hover={{ cursor: 'pointer' }}>
                <Tooltip label={`Place: ${seasonLow.placement}`}>
                  <Tag size="md" colorScheme="green" textAlign="center">
                    <b>{`${seasonHigh.points} `}</b>
                    <Text ml="4px">{`(${seasonHigh.week
                      .split('_')
                      .join(' ')})`}</Text>
                  </Tag>
                </Tooltip>
              </Td>
              <Td _hover={{ cursor: 'pointer' }}>
                <Tooltip label={`Place: ${seasonLow.placement}`}>
                  <Tag size="md" colorScheme="red" textAlign="center">
                    <b>{`${seasonLow.points} `}</b>
                    <Text ml="4px">{`(${seasonLow.week
                      .split('_')
                      .join(' ')})`}</Text>
                  </Tag>
                </Tooltip>
              </Td>
            </Tr>
          );
        }
      });
    }
  };

  return (
    <>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Place</Th>
            <Th>Team</Th>
            <Th>Total Points</Th>
            <Th>Avg. Points</Th>
            {/* <Th>Most Used Players</Th> */}
            <Th>Season High</Th>
            <Th>Season Low</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fetchingData ? (
            <Progress size="sm" isIndeterminate />
          ) : (
            populateTable()
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default Standings;
