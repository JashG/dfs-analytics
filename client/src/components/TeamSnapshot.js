import { CheckCircleIcon, QuestionIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { getDisplayValueFromWeek, trimPlayerName } from '../utils/utils';

const PlayerSnapshot = ({ playerObj }) => {
  return (
    <Flex flexDir="column">
      <Text>
        {playerObj.name ? trimPlayerName(playerObj.name) : ''},{' '}
        {playerObj.position || ''}, {playerObj.salary || ''}
      </Text>
      <Flex flexDir="row" wrap="wrap" color="blue.300">
        <Text mr="5px">
          <b>Points:</b> {playerObj.points || 'No Data'}
        </Text>
        <Text>
          <b>Owned:</b> {playerObj.owned || 'No Data'}
        </Text>
      </Flex>
    </Flex>
  );
};

const TeamSnapshot = ({
  selectedTeam,
  teamData,
  opposingTeamData,
  alignData = 'right',
}) => {
  const getTeamHeader = () => {
    return (
      <Flex flexDir="row">
        <Avatar
          size="2xl"
          margin="20px 20px 20px 0"
          name={selectedTeam}
          src={teamData.img || ''}
        />
        <Flex flexDir="column" justifyContent="center">
          <Text
            color="gray.600"
            fontSize={{ sm: '2em', xl: '3em' }}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {selectedTeam}
          </Text>
          <Text>
            Regular Season Place: <b>{teamData.place}</b>
          </Text>
        </Flex>
      </Flex>
    );
  };

  const getPopover = (title, header, content) => {
    return (
      <Popover>
        <PopoverTrigger>
          <Text
            color="blue.300"
            fontSize={{ sm: '1em', lg: '1.15em' }}
            mr="8px"
            _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {title}
          </Text>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>{header}</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>{content}</PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  };

  const getIndividualGamesPopover = (title, popoverHeader, weeklyGames) => {
    // Array of JSX elements, each representing a week where there are games to display
    const popoverContent = [];

    if (weeklyGames) {
      Object.keys(weeklyGames).forEach(week => {
        const players = weeklyGames[week];
        if (Array.isArray(players) && players.length) {
          const playerComponents = [];
          const weekDisplay = getDisplayValueFromWeek(week);

          players.forEach(player => {
            playerComponents.push(<PlayerSnapshot playerObj={player} />);
          });

          popoverContent.push(
            <Flex flexDir="column" mt="10px">
              <Text fontWeight="700">{weekDisplay}:</Text>
              {playerComponents}
            </Flex>
          );
        }
      });
    }

    return (
      <Flex
        alignItems="center"
        justifyContent={alignData === 'right' ? 'flex-end' : 'flex-start'}
      >
        <ViewIcon mr="8px" />
        {getPopover(title, popoverHeader, popoverContent)}
      </Flex>
    );
  };

  const getInformationalPopover = (title, popoverHeader, content) => {
    return (
      <Flex
        alignItems="center"
        justifyContent={alignData === 'right' ? 'flex-end' : 'flex-start'}
      >
        <QuestionIcon mr="8px" />
        {getPopover(title, popoverHeader, content)}
      </Flex>
    );
  };

  const getDataPointValue = (
    value,
    key,
    lowerIsBetter = false,
    extraContent = ''
  ) => {
    if (opposingTeamData) {
      const opposingTeamValue = !Array.isArray(key)
        ? opposingTeamData[key]
        : key.reduce((prev, curr) => prev && prev[curr], opposingTeamData);
      if (opposingTeamValue) {
        return (
          <>
            {(
              !lowerIsBetter
                ? value > opposingTeamValue
                : value < opposingTeamValue
            ) ? (
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent={
                  alignData === 'right' ? 'flex-end' : 'flex-start'
                }
              >
                <CheckCircleIcon mr="8px" color="green.500" />
                <Text
                  color="green.500"
                  fontWeight="700"
                  fontSize={{ sm: '1.25em', lg: '1.5em' }}
                  textAlign={alignData}
                >
                  {value}
                </Text>
              </Flex>
            ) : (
              <>
                <Text
                  fontSize={{ sm: '1.25em', lg: '1.5em' }}
                  textAlign={alignData}
                >
                  {value}
                </Text>
              </>
            )}
            {extraContent}
          </>
        );
      }
    }
    return (
      <>
        <Text fontSize={{ sm: '1.25em', lg: '1.5em' }} textAlign={alignData}>
          <b>{value}</b>
        </Text>
        {extraContent}
      </>
    );
  };

  const getDataPoint = (
    label,
    value,
    key,
    subtitle = '',
    lowerIsBetter = false,
    extraContent = ''
  ) => {
    return (
      <Flex flexDirection="column" mt="10px">
        <Flex
          wrap="wrap"
          alignItems="baseline"
          justifyContent={alignData === 'right' ? 'flex-end' : 'flex-start'}
        >
          <Text
            fontSize={{ sm: '1.5em', lg: '1.75em' }}
            fontWeight="700"
            color="gray.600"
            mr="8px"
          >
            {label}
          </Text>
          {subtitle && (
            <Text
              fontSize={{ sm: '1em', lg: '1.15em' }}
              fontWeight="700"
              color="gray.600"
            >
              {`(${subtitle})`}
            </Text>
          )}
        </Flex>
        {getDataPointValue(value, key, lowerIsBetter, extraContent)}
      </Flex>
    );
  };

  const getTeamDataPoints = () => {
    // Stores JSX element for each data points
    const dataPoints = [];

    if (teamData) {
      const score = teamData.league_points;
      if (score) {
        dataPoints.push(getDataPoint('Score', score, 'league_points'));
      }

      const totalPoints = teamData.total_points;
      if (totalPoints) {
        dataPoints.push(
          getDataPoint('Total Points', totalPoints, 'total_points')
        );
      }

      const avgPoints = teamData.avg_points;
      if (avgPoints) {
        dataPoints.push(getDataPoint('Avg. Points', avgPoints, 'avg_points'));
      }

      const seasonHigh =
        (teamData.season_high && teamData.season_high.points) || '';
      if (seasonHigh) {
        dataPoints.push(
          getDataPoint('Season High', seasonHigh, ['season_high', 'points'])
        );
      }

      const seasonLow =
        (teamData.season_low && teamData.season_low.points) || '';
      if (seasonHigh) {
        dataPoints.push(
          getDataPoint('Season Low', seasonLow, ['season_low', 'points'])
        );
      }

      const numWins = teamData.num_wins;
      if (numWins) {
        dataPoints.push(getDataPoint('Wins', numWins, 'num_wins'));
      }

      const numTop2 = teamData.num_top_2;
      if (numTop2) {
        dataPoints.push(getDataPoint('Top 2 finishes', numTop2, 'num_top_2'));
      }

      const numBigGames = teamData.num_big_games;
      if (numBigGames) {
        const viewBigGames = getIndividualGamesPopover(
          'View Big Games',
          'Big Games',
          teamData.big_game_players
        );

        dataPoints.push(
          getDataPoint(
            'Big games',
            numBigGames,
            'num_big_games',
            '30+ point games',
            false,
            viewBigGames
          )
        );
      }

      const numDonuts = teamData.num_donuts;
      if (numDonuts) {
        const viewDonuts = getIndividualGamesPopover(
          'View Donuts',
          'Donuts',
          teamData.donut_players
        );

        dataPoints.push(
          getDataPoint(
            'Donuts',
            numDonuts,
            'num_donuts',
            '<= 0 point games',
            true,
            viewDonuts
          )
        );
      }

      const topPlayerShare = teamData.top_player_share;
      if (topPlayerShare) {
        const dataExplanation = getInformationalPopover(
          'What is this?',
          'Top Players Share',
          "Percentage of team's weekly points contributed by top scorer"
        );
        dataPoints.push(
          getDataPoint(
            'Top Player Share',
            topPlayerShare,
            'top_player_share',
            '',
            false,
            dataExplanation
          )
        );
      }

      const topPlayersShare = teamData.top_players_share;
      if (topPlayerShare) {
        const dataExplanation = getInformationalPopover(
          'What is this?',
          'Top 3 Players Share',
          "Percentage of team's weekly points contributed by top 3 scorers"
        );
        dataPoints.push(
          getDataPoint(
            'Top 3 Players Share',
            topPlayersShare,
            'top_players_share',
            '',
            false,
            dataExplanation
          )
        );
      }

      const consistency = teamData.std_dev;
      if (consistency) {
        const dataExplanation = getInformationalPopover(
          'What is this?',
          'Consistency',
          "Standard deviation of team's weekly points"
        );
        dataPoints.push(
          getDataPoint(
            'Consistency',
            consistency,
            'std_dev',
            '',
            true,
            dataExplanation
          )
        );
      }
    }

    return dataPoints;
  };

  return (
    <Flex flexDir="column">
      {getTeamHeader()}
      <Flex
        flexDir="column"
        justifyContent={alignData === 'right' ? 'flex-end' : 'flex-start'}
        mr={alignData === 'right' ? '10px' : '0'}
        ml={alignData === 'right' ? '' : '10px'}
      >
        {getTeamDataPoints()}
      </Flex>
    </Flex>
  );
};

export default TeamSnapshot;
