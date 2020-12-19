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

    def points_per_game(self):
        for week in self.weekly_data:
            week_data = week[list(week.keys())[0]]
            for team in week_data:
                total_points = 0.0
                for player in team["lineup"]:
                    total_points += round(float(player["points"]), 2)
                team["total_points"] = round(total_points, 2)

        Operations.update_file(self.weekly_data_path, self.weekly_data)

    def avg_points_per_team(self):
        avg_per_team = dict()
        for week in self.weekly_data:
            week_data = week[list(week.keys())[0]]
            for team in week_data:
                team_name = team["name"]
                if team_name in avg_per_team:
                    team_avg = avg_per_team[team_name]
                    # Get updated total points
                    points_this_week = team["total_points"]
                    updated_total = team_avg["total_points"] + points_this_week
                    # Get updated avg points
                    num_weeks = team_avg["num_weeks"] + 1
                    updated_avg = updated_total / num_weeks
                    # Update dict
                    avg_per_team[team_name]["avg_points"] = updated_avg
                    avg_per_team[team_name]["total_points"] = updated_total
                    avg_per_team[team_name]["num_weeks"] = num_weeks
                else:
                    avg_per_team[team_name] = dict(
                        avg_points=team["total_points"],
                        total_points=team["total_points"],
                        num_weeks=1,
                    )

        # Update file with team data
        for team in self.team_data:
            team_name = team
            self.team_data[team_name]["avg_points"] = round(avg_per_team[team_name]["avg_points"], 2)
            self.team_data[team_name]["total_points"] = round(avg_per_team[team_name]["total_points"], 2)
            self.team_data[team_name]["num_weeks"] = round(avg_per_team[team_name]["num_weeks"], 2)

        Operations.update_file(self.team_data_path, self.team_data)

    def most_used_players(self):
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
        for team in self.team_data:
            team_name = team
            self.team_data[team_name]["player_usage"] = player_usage[team_name]

        Operations.update_file(self.team_data_path, self.team_data)

    @staticmethod
    def get_json_from_file(path):
        with open(path, "r") as file:
            return json.load(file)

    @staticmethod
    def update_file(path, content):
        with open(path, "w") as file:
            file.write(json.dumps(content, indent=4))
