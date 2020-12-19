import json
from flask import Flask
from flask import jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/weekly-data")
def weekly_data():
    with open("data/weekly_data.json") as file:
        return jsonify(json.load(file))


@app.route("/team-data")
def team_data():
    with open("data/team_data.json") as file:
        return jsonify(json.load(file))


app.run()
