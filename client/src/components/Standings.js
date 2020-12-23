import {
  Center,
  Flex,
  Select,
  Spinner,
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
  WrapItem
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Standings = () => {
  // API Data
  const [teamData, setTeamData] = useState('');
  const [weeklyData, setWeeklyData] = useState('');
  const [fetchingData, setFetchingData] = useState(false);

  // Base start week available in our fetched data
  const [startWeek, setStartWeek] = useState('');
  // Selected start week from filter in UI
  const [selectedStartWeek, setSelectedStartWeek] = useState('');
  // Base end week available in our fetched data
  const [endWeek, setEndWeek] = useState('');
  // Selected end week from filter in UI
  const [selectedEndWeek, setSelectedEndWeek] = useState('');

  useEffect(async () => {
    setFetchingData(true);
    const res = await axios.get('http://localhost:5000/db');

    if (res && res.data) {
      if (res.data.team_data) {
        setTeamData(res.data.team_data);
      }
      if (res.data.weekly_data) {
        const weeklyData = res.data.weekly_data;
        setWeeklyData(weeklyData);
        if (Array.isArray(weeklyData)) {
          const startWeek = Object.keys(weeklyData[0]).length
            ? Object.keys(weeklyData[0])[0]
            : '';
          setStartWeek(startWeek);
          setSelectedStartWeek(startWeek);

          const endWeek = Object.keys(weeklyData[weeklyData.length - 1]).length
            ? Object.keys(weeklyData[weeklyData.length - 1])[0]
            : '';
          setEndWeek(endWeek);
          setSelectedEndWeek(endWeek);
        }
      }
    }
    setFetchingData(false);
  }, []);

  const getDisplayValueFromWeek = week => {
    if (typeof week !== 'string') {
      return '';
    }

    const weekNum =
      week.split('_').length === 2 ? Number(week.split('_')[1]) : '';

    if (weekNum) {
      return `Week ${weekNum}`;
    }

    return '';
  };

  const fetchFilteredTeamData = async (startWeek, endWeek) => {
    setFetchingData(true);

    const res = await axios.get(
      `http://localhost:5000/team-data?start=${startWeek}&end=${endWeek}`
    );

    if (res && res.data) {
      // Push each obj into array
      const teamDataArray = [];
      Object.keys(res.data).forEach(key => {
        teamDataArray.push({ [key]: res.data[key] });
      });

      const sortedTeamData = teamDataArray.sort((a, b) => {
        const teamA = Object.keys(a).length ? Object.keys(a)[0] : '';
        const teamB = Object.keys(b).length ? Object.keys(b)[0] : '';
        if (a[teamA].place > b[teamB].place) return 1;
        else if (a[teamA].place < b[teamB].place) return -1;
        return 0;
      });

      setTeamData(sortedTeamData);
    }
    setFetchingData(false);
  };

  const handleFilterClick = (e, endWeek = false) => {
    if (e.target && e.target.value) {
      const selectedWeek = e.target.value;
      const selectedWeekNum =
        selectedWeek.split('_').length === 2
          ? Number(selectedWeek.split('_')[1])
          : 3;
      if (!endWeek) {
        setSelectedStartWeek(selectedWeek);

        const selectedEndWeekNum =
          selectedEndWeek.split('_').length === 2
            ? Number(selectedEndWeek.split('_')[1])
            : '';
        if (selectedWeekNum > selectedEndWeekNum) {
          setSelectedEndWeek(selectedWeek);
          fetchFilteredTeamData(selectedWeekNum, selectedWeekNum);
        } else {
          fetchFilteredTeamData(selectedWeekNum, selectedEndWeekNum);
        }
      } else {
        const selectedStartWeekNum =
          selectedStartWeek.split('_').length === 2
            ? Number(selectedStartWeek.split('_')[1])
            : '';
        setSelectedEndWeek(selectedWeek);
        fetchFilteredTeamData(selectedStartWeekNum, selectedWeekNum);
      }
    }
  };

  const getFilter = () => {
    const startWeekNum =
      startWeek.split('_').length === 2 ? Number(startWeek.split('_')[1]) : '';
    const endWeekNum =
      endWeek.split('_').length === 2 ? Number(endWeek.split('_')[1]) : '';
    const selectedStartWeekNum =
      selectedStartWeek.split('_').length === 2
        ? Number(selectedStartWeek.split('_')[1])
        : '';

    const startWeekOptions = [];
    for (let i = startWeekNum; i <= endWeekNum; i++) {
      startWeekOptions.push(<option value={`week_${i}`}>Week {i}</option>);
    }
    const endWeekOptions = [];
    for (let i = selectedStartWeekNum; i <= endWeekNum; i++) {
      endWeekOptions.push(<option value={`week_${i}`}>Week {i}</option>);
    }

    return (
      <Flex flexDir="row" mb="20px">
        <Center mr="8px">Start Week:</Center>
        <Select
          variant="filled"
          colorScheme="orange"
          mr="8px"
          width="8em"
          value={selectedStartWeek}
          placeholder="Start Week"
          onChange={e => handleFilterClick(e)}
        >
          {startWeekOptions}
        </Select>
        <Center mr="8px">End Week:</Center>
        <Select
          variant="filled"
          colorScheme="orange"
          mr="8px"
          width="8em"
          value={selectedEndWeek}
          placeholder="End Week"
          onChange={e => handleFilterClick(e, true)}
        >
          {endWeekOptions}
        </Select>
      </Flex>
    );
  };

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
              <Td>{teamObj.league_points}</Td>
              <Td>{teamObj.total_points}</Td>
              <Td>{teamObj.avg_points}</Td>
              {/* <Td>{getMostUsedPlayers(teamObj.player_usage)}</Td> */}
              <Td _hover={{ cursor: 'pointer' }}>
                <Tooltip label={`Place: ${seasonHigh.placement}`}>
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
      <Flex flexWrap="wrap">{getFilter()}</Flex>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Place</Th>
            <Th>Team</Th>
            <Th>Score</Th>
            <Th>Total Points</Th>
            <Th>Avg. Points</Th>
            {/* <Th>Most Used Players</Th> */}
            <Th>Season High</Th>
            <Th>Season Low</Th>
          </Tr>
        </Thead>
        <Tbody>{fetchingData ? <Spinner size="xl" /> : populateTable()}</Tbody>
      </Table>
    </>
  );
};

export default Standings;
