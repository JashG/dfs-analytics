import json
from flask import Flask
from flask import jsonify, request
from flask_cors import CORS, cross_origin
from data.operations import Operations

app = Flask(__name__)
CORS(app)


@app.route("/weekly-data")
def weekly_data():
    with open("data/weekly_data.json") as file:
        return jsonify(json.load(file))


@app.route("/team-data", methods=['GET'])
def team_data():
    # If params are provided, we will compute team data using the given weeks as bounds
    if request.args.get('start') and request.args.get('end'):
        start_week = int(request.args.get('start'))
        end_week = int(request.args.get('end'))

        ops = Operations()
        all_team_data = ops.get_filtered_team_data(start=start_week, end=end_week)

        return jsonify(all_team_data)
    # Otherwise, return pre-computed team data for the entire season
    else:
        with open("data/team_data.json") as file:
            return jsonify(json.load(file))


@app.route("/db")
@cross_origin()
def db():
    with open("../db.json") as file:
        return jsonify(json.load(file))


app.run()
