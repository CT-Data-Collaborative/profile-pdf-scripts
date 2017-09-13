# Creating Town Profile PDFS

## Requirements

These scripts rely on Python 3.6+. Setting using `pyenv` is recommended, but use 3.6+ however you can get it.

### Python
1.   Create a python 3.6+ virtualenv
      + `python3 -m venv venv`
2.   Activate venv and install requirements
      + `. ./venv/bin/activate`
      + `pip install -r requiremnts`

### Javascript
1.   NodeJS, with the following packages
      +   Minimist@1.2.0
      +   lodash@4.0.0  
      +  Install locally with `npm install`

### Data
1.   `towns.csv` - The only static data requirement for this script is the included csv. It contains three columns - Town, County, and State, and contains one row for each town with it's accompanying county and state value. This is the master list the script gets these combinations from, and will iterate through the data present in this file to create each town's report.


## Instructions
1.   Make sure the pdf server is running.
      + This should be as simple as `vagrant up` in the `reports` project directory, unless there have been any major changes to that project or its repository. The server will automatically start the process and serve pdf responses. (Note: currently the report vagrant repo isn't starting the flask server correctly, so you may need to ssh into run the server)
2.   Run the included python script.
      + Navigate to this directory in your command line and execute `python make_pdfs.py --help` to see the configuration requirements.
      + Town and Year are optional (defaults to all and 2017)
      + The `pdf_server` should be set to whatever IP address you are using for the reports Vagrant server (Set to be http://192.168.33.101:5000/ out of the box).
      + The `profile_server` should be set to the publically facing town profile url.
      + The `data` and `output` directories should also be specified. The script will create all of the correct data subdirectories, but the output directory should already exist (TODO: Fix to autocreate output dir if not existing).

## Under the hood
1.   The python script will iterate through each town, make a request to the town profiles backend for the given town's data, and save it to file.
2.   It will repeat this process with each county, saving it to file
3.   It will get the state level data last and save it to file as well
4.   Next it will iterate through each town again, this time sending the town, county, and state data through a translation script via the Naked package making a request to a Node script called `api2pdf.js`. As the name suggests, it turns the data from the structure provided by the town profiles *data api* into the structure expected by the town profiles *pdf server request*, with code that appropriately reshapes each and every object required in the pdf. As it iterates, the script will save each newly formed request JSON to file.
5.   Finally, it will iterate through each request, and send it to the pdf server appropriately. Barring any errors (there shouldn't be any!) it will receive the pdf response, and save that to file. Your newly created pdfs will be named for the town they represent.
