import os
import csv
import json
import click
from validators import url as validate_url
from validators.ip_address import ipv4 as validate_ip

# Naked - Used to run node calls for d3 scripts
from Naked.toolshed.shell import muterun_js

# for making curl requests
import requests


def _setup_api_endpoints(profile_server, pdf_server):
    """Validate and correct urls and return dict of endpoints"""
    if validate_url(profile_server):
        ps = profile_server
    elif validate_url(f'http://{profile_server}'):
        ps = f'http://{profile_server}'
    elif validate_ip(profile_server.split(':')[0]):
        ps = f'http://{profile_server}'
    else:
        raise Exception(f'Profile Server variable is not a valid endpoint: {profile_server}')

    if validate_url(pdf_server):
        pdfs = pdf_server
    elif validate_url(f'http://{pdf_server}'):
        pdfs = f'http://{pdf_server}'
    elif validate_ip(pdf_server.split(':')[0]):
        pdfs = f'http://{pdf_server}'
    else:
        raise Exception(f'PDF Server variable is not a valid endpoint: {pdf_server}')

    endpoints = {
        "town": f'{ps}/profiles/api/v1/data/town',
        "county": f'{ps}/profiles/api/v1/data/county',
        "state": f'{ps}/profiles/api/v1/data/state',
        "pdf": f'{pdfs}/download'
    }
    return endpoints

# This will make sure all the output directories exist
# town, county, and state subdirectories of /data will contain the data that comes directly from the API
# /data/requests will contain JSON output of intermediary script that reshapes data from API -> Request format

def _setup_data_dirs(directory):
    """Creates directories for storing data"""
    current = os.getcwd()
    base_path = os.path.join(current, directory)
    if not os.path.isdir(base_path):
        os.mkdir(base_path)

    paths = ['town', 'county', 'state', 'requests']
    paths_list = [os.path.join(base_path, p) for p in paths]
    for p in paths_list:
        if not os.path.isdir(p):
            os.mkdir(p)
    return paths_list

def _setup_town_list(town):
    """Open csv file and return a dict. Lets the user pass in a town to try one PDF"""
    with open("towns.csv", "r") as town_file:
        reader = csv.DictReader(town_file)
        if town == 'All':
            towns = [t for t in reader]
        else:
            towns = [t for t in reader if t['Town'].lower() == town.lower()]
        return towns

def _get_data(geography, endpoint, output_path):
    print("Getting data for " + geography)

    output_file = f'{output_path}/{geography}.json'
    if os._exists(output_file):
        return output_file
    try:
        response = requests.get(f'{endpoint}/{geography}')
        with open(output_file, 'w') as outfile:
            json.dump(response.json(), outfile)
    except Exception as e:
        raise Exception(f'There was an error getting data for {geography}.\nUsing url: {endpoint}/{geography}.\n{e}')
    return output_file

def _restructure_data(town_path, county_path, state_path, town, output_path):
    print("Restructure API data")

    town_flag = f'--town="{town_path}"'
    county_flag = f'--county="{county_path}"'
    state_flag = f'--state="{state_path}"'
    node_cmd = f'api2pdf.js {town_flag} {county_flag} {state_flag}'
    json_request = muterun_js(node_cmd)
    pdf_data_path = f'{output_path}/{town}.json'

    try:
        with open(pdf_data_path, "w") as outfile:
            json.dump(json.loads(json_request.stdout), outfile)
    except Exception as e:
        raise Exception(f'Error converting data for {town}.\n{e}\nNode Command: {node_cmd}\nData path: {pdf_data_path}')

    return pdf_data_path


def _generate_pdf(town, pdf_data_path, pdf_api_target, output_directory):
    print(f'Creating PDF for {town}')

    try:
        with open(pdf_data_path, "r") as data:
            request = {"data" : json.dumps(json.load(data))}

            pdf = requests.get(pdf_api_target, data=request)
            with open(f'{output_directory}/{town}.pdf', "wb") as pdf_file:
                pdf_file.write(pdf.content)
    except Exception as e:
        raise Exception(f'Error generating PDF for {town}.\n{e}')


@click.command()
@click.option('--town', '-t', default='All', help='Pass in a town name to limit generation to one town.')
@click.option('--output', '-o', help='Base directory for saving output', type=click.Path())
@click.option('--data', '-d', help='Directory for storing fetched data', default='data')
@click.option('--profile_server', '-p', help='Base URL for Profile Server API. Ignore http.')
@click.option('--pdf_server', '-s', help='URL or IP for PDF Server.')
def convert(town, output, data, profile_server, pdf_server):
    town_dir, county_dir, state_dir, pdfdata_dir = _setup_data_dirs(data)
    towns = _setup_town_list(town)
    endpoints = _setup_api_endpoints(profile_server, pdf_server)
    for town in towns:
        final_path = os.path.join(os.getcwd(), output)
        if not os.path.isdir(final_path):
            os.mkdir(final_path)
        raw_town_data = _get_data(town['Town'], endpoints['town'], town_dir)
        raw_county_data = _get_data(town['County'], endpoints['county'], county_dir)
        raw_state_data = _get_data(town['State'], endpoints['state'], state_dir)
        pdf_data_path = _restructure_data(raw_town_data, raw_county_data, raw_state_data, town['Town'], pdfdata_dir)
        _generate_pdf(town['Town'], pdf_data_path, endpoints['pdf'], final_path)


if __name__ == '__main__':
    convert()