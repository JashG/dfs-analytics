import json
from heapq import nlargest
from statistics import stdev


# TODO: Look into more pythonic way to do all the nested looping
class Operations:

    def __init__(self,
                 weekly_data_path="data/weekly_data.json",
                 team_data_path="data/team_data.json",
                 ):
        self.weekly_data_path = weekly_data_path
        self.weekly_data = self.get_json_from_file(weekly_data_path)
        self.team_data_path = team_data_path
        self.team_data = self.get_json_from_file(team_data_path)

    def points_per_week(self):
        for week in self.weekly_data:
            week_data = week[list(week.keys())[0]]
            for team in week_data:
                total_points = 0.0
                for player in team["lineup"]:
                    total_points += round(float(player["points"]), 2)
                team["total_points"] = round(total_points, 2)

        # Operations.update_file(self.weekly_data_path, self.weekly_data)
        return self.weekly_data

    def get_filtered_team_data(self, start: int = 0, end: int = 0):
        if 0 < start <= end and end > 0:
            team_data = self.team_data

            for week in self.weekly_data:
                week_key = list(week.keys())[0]
                week_num = int(week_key.split('_')[1])

                if week_num < start or week_num > end:
                    continue

                week_data = week[week_key]

                for (idx, team) in enumerate(week_data):
                    team_name = team.get("name", "")

                    if team_name:
                        team_avg = team_data[team_name]

                        if week_num == start:
                            team_avg["league_points"] = 0
                            team_avg["avg_points"] = 0
                            team_avg["total_points"] = 0
                            team_avg["num_weeks"] = 0

                        # Get updated total points
                        points_this_week = team["total_points"]
                        updated_total = team_avg["total_points"] + points_this_week
                        # Get updated avg points
                        num_weeks = team_avg["num_weeks"] + 1
                        updated_avg = updated_total / num_weeks
                        # Get updated league points
                        updated_league_points = team_avg["league_points"] + (12 - (2 * idx))
                        # Update dict
                        team_data[team_name]["avg_points"] = round(updated_avg, 2)
                        team_data[team_name]["total_points"] = round(updated_total, 2)
                        team_data[team_name]["num_weeks"] = num_weeks
                        team_data[team_name]["league_points"] = updated_league_points

        # Update file with team data
        # for team in self.team_data:
        #     team_name = team
        #     self.team_data[team_name]["avg_points"] = round(avg_per_team[team_name]["avg_points"], 2)
        #     self.team_data[team_name]["total_points"] = round(avg_per_team[team_name]["total_points"], 2)
        #     self.team_data[team_name]["num_weeks"] = round(avg_per_team[team_name]["num_weeks"], 2)
        #
        # Operations.update_file(self.team_data_path, self.team_data)
        return team_data

    def get_team_data(self, team_name):
        team_data = dict()

        if not team_name:
            return team_data

        # Data we will keep track of
        num_wins = 0
        # First or second place finishes
        num_top_2 = 0
        # Third of fourth place finishes
        num_top_4 = 0
        # Fifth of sixth place finishes
        num_top_6 = 0
        std_dev = 0
        weekly_points = []
        big_games = 0
        big_game_players = dict()
        donuts = 0
        donut_players = dict()
        # Players < 5k who scored >= 20
        num_booms = 0
        # Players > 6k who scored < 10
        num_busts = 0
        # Total points contributed by top player each week
        top_player_points = 0
        # Total points contributed by top 3 players each week
        top_players_points = 0
        # Total unique plays by team
        num_unique_plays = 0

        for week in self.weekly_data:
            week_key = list(week.keys())[0]
            week_data = week[week_key]

            # Num wins, num top-2 finishes
            if week_data[0]["name"] == team_name:
                num_wins = num_wins + 1
                num_top_2 = num_top_2 + 1
            elif week_data[1]["name"] == team_name:
                num_top_2 = num_top_2 + 1
            elif week_data[2]["name"] == team_name or week_data[3]["name"] == team_name:
                num_top_4 = num_top_4 + 1
            elif week_data[4]["name"] == team_name or week_data[5]["name"] == team_name:
                num_top_6 = num_top_6 + 1

            # Get desired team's data for this week
            desired_team = [tm for tm in week_data if tm.get("name") == team_name][0]
            lineup = desired_team["lineup"]

            all_points = []
            all_ownership = []
            weekly_booms = 0
            weekly_busts = 0
            for playerObj in lineup:
                # Add each player's point total to array
                all_points.append(float(playerObj["points"]))
                # Add each player's ownership total to array
                all_ownership.append((playerObj["owned"]))
                # Keep track of weekly booms and busts
                salary = playerObj["salary"]
                if int(salary[1]) < 5 and float(playerObj["points"]) >= 20.0:
                    weekly_booms += 1
                elif int(salary[1]) >= 6 and float(playerObj["points"]) < 10.0:
                    weekly_busts += 1

            # Get players that were only owned by this team
            num_unique_plays += all_ownership.count("16.7%")
            # Append to our weekly booms and busts
            num_booms += weekly_booms
            num_busts += weekly_busts

            # Get number of points contributed by this team's top 3 players for the week
            # Get 3 largest point totals
            all_points = nlargest(3, all_points)
            # Keep track separately of points contributed by top player
            top_player_points += all_points[0]
            # Add the three values to our running total
            for point_val in all_points:
                top_players_points += point_val

            # Big games
            big_games_in_lineup = [plr for plr in lineup if float(plr["points"]) > 30.00]
            big_games += len(big_games_in_lineup)
            big_game_players[week_key] = big_games_in_lineup

            # Donuts
            donuts_in_lineup = [plr for plr in lineup if float(plr["points"]) <= 0.00]
            donuts += len(donuts_in_lineup)
            donut_players[week_key] = donuts_in_lineup

            # Keep track of weekly points so we can calculate stdev
            weekly_points.append(desired_team["total_points"])

        # Calculate stdev
        std_dev = round(stdev(weekly_points), 2)

        # Lastly, get team img path to display in UI
        team_img = Operations.get_team_img(team_name)

        # Create dict out of new data we've collected
        new_team_data = dict(
            img=team_img,
            num_wins=num_wins,
            num_top_2=num_top_2,
            num_top_4=num_top_4,
            num_top_6=num_top_6,
            std_dev=std_dev,
            num_big_games=big_games,
            big_game_players=big_game_players,
            num_donuts=donuts,
            donut_players=donut_players,
            num_unique_plays=num_unique_plays,
            num_booms=num_booms,
            num_busts=num_busts
        )

        # Add base, season-long team data that we've already stored to this response
        base_team_data = self.team_data[team_name]

        # Calculate percentage of team's points that came from top player
        base_team_data["top_player_share"] = round(top_player_points / base_team_data["total_points"], 2)
        # Calculate percentage of team's points that came from top 3 players
        base_team_data["top_players_share"] = round(top_players_points / base_team_data["total_points"], 2)

        team_data = {**new_team_data, **base_team_data}

        return team_data

    def player_usage(self):
        player_usage = dict()
        for week in self.weekly_data:
            week_number = list(week.keys())[0]
            week_data = week[week_number]
            for team in week_data:
                team_name = team["name"]
                if team_name not in player_usage:
                    player_usage[team_name] = dict()
                # Update team's dict for each player
                for player in team["lineup"]:
                    if player["name"] not in player_usage[team_name]:
                        player_usage[team_name][player["name"]] = [week_number]
                    else:
                        player_usage[team_name][player["name"]].append(week_number)

        # Update file with team data
        # for team in self.team_data:
        #     team_name = team
        #     self.team_data[team_name]["player_usage"] = player_usage[team_name]
        # Operations.update_file(self.team_data_path, self.team_data)
        return player_usage

    # Assumption: team data per-week is sorted from most to least points
    def weekly_wins(self):
        # We'll keep track of two types of wins:
        # type 1: weekly diff between first and second place
        # type 2: weekly diff between first and last place
        for week in self.weekly_data:
            week_number = list(week.keys())[0]
            week_data = week[week_number]

            first_place_points = week_data[0]["total_points"]
            second_place_points = week_data[1]["total_points"]
            last_place_points = week_data[5]["total_points"]

            if len(week_data) == 6:
                # For weekly data, the last object in the array will store the league-wide weekly data
                week_data.append(dict(
                    type1_win=round(first_place_points - second_place_points, 2),
                    type2_win=round(first_place_points - last_place_points, 2)
                ))
            elif len(week_data) > 6:
                week_data[len(week_data) - 1] = dict(
                    type1_win=round(first_place_points - second_place_points, 2),
                    type2_win=round(first_place_points - last_place_points, 2)
                )

        # Update weekly data file
        # Operations.update_file(self.weekly_data_path, self.weekly_data)

    @staticmethod
    def get_json_from_file(path):
        with open(path, "r") as file:
            return json.load(file)

    @staticmethod
    def update_file(path, content):
        with open(path, "w") as file:
            file.write(json.dumps(content, indent=4))

    @staticmethod
    def get_team_img(team_name):
        if team_name == 'McKrank':
            return 'kraken.jpg'
        elif team_name == 'JParrot12':
            return 'parrot.jpg'
        elif team_name == 'rileyc98':
            return 'jalenhurts.jpg'
        elif team_name == 'dhdrewhouston':
            return 'romo.jpg'
        elif team_name == 'JashG98':
            return 'brady.jpg'
        elif team_name == 'paynetrain37':
            return 'paynetrain.jpg'
        else:
            return ''
