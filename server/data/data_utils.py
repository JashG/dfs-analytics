import os
import json


def merge_weekly_data(base_path="data/", output_file="data/weekly_data.json"):
    merged_json = []

    json_files = [file for file in os.listdir(base_path) if file.endswith(".json")]
    for index, json_file in enumerate(json_files):
        json_file_path = os.path.join(base_path, json_file)
        with (open(json_file_path, "r")) as file:
            week = json_file.split(".")[0]
            # print(json.load(file, parse_float=True))
            merged_json.append(json.load(file, parse_float=True))
            # = json.loads(file.read(), parse_float=True

    with open(output_file, "w") as output:
        json.dump(merged_json, output, indent=4)
        # output.write(json.dumps(merged_json, indent=4))


merge_weekly_data()
