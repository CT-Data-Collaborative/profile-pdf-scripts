from os import mkdir
from os.path import isdir
import csv
import json

# Naked - Used to run node calls for d3 scripts
from Naked.toolshed.shell import muterun_js

# for making curl requests
import requests

## SOME CONSTANTS
## town profile data endpoints
endpoints = {
    "town" : "http://profiles.ctdata.org/profiles/api/v1/data/town",
    "county" : "http://profiles.ctdata.org/profiles/api/v1/data/county",
    "state" : "http://profiles.ctdata.org/profiles/api/v1/data/state",
    "pdf" : "http://192.168.33.101/download"
}


# This will make sure all the output directories exist
# town, county, and state subdirectories of /data will contain the data that comes directly from the API
# /data/requests will contain JSON output of intermediary script that reshapes data from API -> Request format
if not isdir("data"):
    mkdir("data")

if not isdir("data/town"):
    mkdir("data/town")

if not isdir("data/county"):
    mkdir("data/county")

if not isdir("data/state"):
    mkdir("data/state")

if not isdir("data/requests"):
    mkdir("data/requests")

# /pdfs will contain the final pdfs after they are returned from the reports server
if not isdir("pdfs"):
    mkdir("pdfs")


# Reads CSV file (in this directory) and gets list of towns with their counties.
with open("towns.csv", "r") as townListFile:
    townListReader = csv.DictReader(townListFile)
    towns = [town for town in townListReader]

###
#   If you need to run a single town, or a small set of towns,
#   you can manually create a list of them as such:
###

######  A single Town
#
# towns = [
#     # {'Town': 'Suffield', 'County': 'Hartford County', 'State': 'Connecticut'},
#     {'Town': 'Bethany', 'County': 'New Haven County', 'State': 'Connecticut'}
# ]

######  or a few Towns

# towns = [
#     {'Town' : 'Bristol','County' : 'Hartford County','State' : 'Connecticut'},
#     {'Town' : 'Cornwall','County' : 'Litchfield County','State' : 'Connecticut'},
#     {'Town' : 'Enfield','County' : 'Hartford County','State' : 'Connecticut'},
# ]


# get all town data
for town in set([town["Town"] for town in towns]):
    print("Getting data for "+town)
    try:
        townData = requests.get("/".join([endpoints["town"], town]))

        # save to file
        with open("data/town/"+town+".json", "w") as townDataFile:
            json.dump(townData.json(), townDataFile)
    except:
        print("Error!")
        print("/".join([endpoints["town"], town]))

# get all county data
for county in set([town["County"] for town in towns]):
    print("Getting data for "+county)
    try:
        countyData = requests.get("/".join([endpoints["county"], county]))

        # save to file
        with open("data/county/"+county+".json", "w") as countyDataFile:
            json.dump(countyData.json(), countyDataFile)
    except:
        print("Error!")
        print("/".join([endpoints["county"], county]))

# get all state data
for state in set([town["State"] for town in towns]):
    print("Getting data for "+state)
    try:
        stateData = requests.get("/".join([endpoints["state"], state]))

        # save to file
        with open("data/state/"+state+".json", "w") as stateDataFile:
            json.dump(stateData.json(), stateDataFile)
    except:
        print("Error!")
        print("/".join([endpoints["state"], state]))

# Send data through api2pdf node script
for town in towns:
    print("Converting to PDF request for "+town["Town"]+", "+town["County"]+", "+town["State"])
    townFlag = "--town='./data/town/"+town["Town"]+".json'"
    countyFlag = "--county='./data/county/"+town["County"]+".json'"
    stateFlag = "--state='./data/state/"+town["State"]+".json'"

    jsonRequest = muterun_js("api2pdf.js", " ".join([townFlag, countyFlag, stateFlag]))

    try:
        with open("data/requests/" + town["Town"] + ".json", "w") as requestOutputFile:
            json.dump(json.loads(jsonRequest.stdout), requestOutputFile)
    except Exception as e:
        print("Error!")
        print(e)
        print(" ".join([townFlag, countyFlag, stateFlag]))

# Get pdfs!
for town in towns:
    print("Creating PDF for "+town["Town"]+", "+town["County"]+", "+town["State"])
    try:
        with open("data/requests/" + town["Town"] + ".json", "r") as requestFile:
            request = {"data" : json.dumps(json.load(requestFile))}

            pdf = requests.get(endpoints["pdf"], data=request)

            with open("pdfs/" + town["Town"] + ".pdf", "wb") as pdfFile:
                pdfFile.write(pdf.content)
    except Exception as e:
        print("Error!")
        print(town)
        print(e)
