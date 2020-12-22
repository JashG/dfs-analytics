import json


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

    def get_filtered_team_data(self, start, end):
        if 0 < start <= end and end > 0:
            return self.get_team_data(start, end)
        return dict()

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
