/**
 * This script takes data from the Town Profiles Dashboard (passed in as file paths in command line arguments, then read from these files) and does the reshaping necessary to put the data into the structure expected by the Town Profile pdf report.
 *
 * REQUIREMENTS:
 * minimist - for parsing command-line arguments
 * fs - for reading source data files (syncronously)
 * lodash - used for data manipulation
 */

var minimist = require("minimist");
var fs = require("fs");
var lodash = require("lodash");

/**
 * Process arguments from node call using minimist
 */

var args = minimist(process.argv.slice(2));
var townFile = args.town;
var countyFile = args.county;
var stateFile = args.state;
var profileYear = args.year;

// var townFile = 'data/town/Suffield.json';
// var countyFile = 'data/county/Hartford County.json';
// var stateFile = 'data/state/Connecticut.json';

var townData = JSON.parse(fs.readFileSync(townFile, {encoding: "utf8"}));
var countyData = JSON.parse(fs.readFileSync(countyFile, {encoding: "utf8"}));
var stateData = JSON.parse(fs.readFileSync(stateFile, {encoding: "utf8"}));

townData.data.name = townData.name;
countyData.data.name = countyData.name;
stateData.data.name = stateData.name;

// Actually run the function
var output = serviceToProfile(townData.data, countyData.data, stateData.data);

// Pull town name into a different part of the config
output.config.town = townData.name;

// output to console
console.log(JSON.stringify(output));


// Constants

// var DISTANT_POINTS = [
//     "Hartford",
//     "Boston",
//     "Montreal",
//     "Providence",
//     "New York City"
// ];


// Helpers
// var parse_suppression = function (cell) {
//     if (cell.value == "-9999") {
//         return {"type": "string", "value": "NA"};
//     } else {
//         return cell;
//     }
// };
//
// var findByKey = function (data, key) {
//     return lodash.chain(data)
//         .find(function (o) {
//             return (key in o);
//         }).value();
// };
//
// var sfyFormat = function (year) {
//     if (year.slice(0, 3) === "SFY") {
//         year = year.slice(-4);
//     }
//
//     return year;
// };
//
// var growthValue = function (data, endYear) {
//     var popTimePeriodOne = findByKey(data.demographics.population, "population_acs").population_acs[0].Value;
//     var popTimePeriodTwo = findByKey(data.demographics.population, "population_projection").population_projection[0].Value;
//     var growthDenominator = 2020 - endYear;
//
//     return (((popTimePeriodTwo - popTimePeriodOne) / popTimePeriodTwo) / growthDenominator);
// };
//
// var raceCell = function (data, race) {
//     data = data.demographics.racecohort[0].race_cohort;
//     return lodash.chain(data)
//         .find(function (o) {
//             return o["Race/Ethnicity"] === race && o.Row === "Population";
//         })
//         .value()
//         .Value;
// };
//
// var povertyCell = function (data) {
//     data = findByKey(data.demographics.misc, "poverty").poverty;
//     return lodash.chain(data)
//             .find(function (o) {
//                 return o.Row === "Poverty Status";
//             }).value().Value / 100;
// };
//
//
// var factCell = function (data, fact) {
//     return lodash.chain(findByKey(data.demographics.misc, fact)[fact])
//         .find(function (o) {
//             return o.Row !== "Margins of Error";
//         }).value().Value;
// };
//
// var factYear = function (data, fact) {
//     return lodash.chain(findByKey(data.demographics.misc, fact)[fact])
//         .find(function (o) {
//             return o.Row !== "Margins of Error";
//         })
//         .value()
//         .Year;
// };
//
// var populationStat = function (data) {
//     return findByKey(data.demographics.population, "population_acs").population_acs[0].Value;
// };
//
//
// var educationCell = function (data, attainment, measureType) {
//     return lodash.chain(data.demographics.edattain[0].ed_attainment)
//         .find(function (o) {
//             return o["Measure Type"] === measureType
//                 && o["Educational Attainment"] === attainment
//                 && o.Row !== "Margins of Error";
//         })
//         .value()
//         .Value;
// };
//
// var ageCell = function (data, ages, measureType) {
//     ages = [].concat(ages);
//
//     var toSum = lodash.chain(ages)
//         .map(function (age) {
//             return lodash.chain(data.demographics.agecohort[0].age_cohort)
//                 .find(function (o) {
//                     return (
//                         o["Measure Type"] === measureType
//                         && o["Age Cohort"] === age
//                         && o.Row !== "Margins of Error"
//                     );
//                 })
//                 .value()
//                 .Value;
//         })
//         .value();
//
//     return lodash.reduce(toSum, function (sum, value) {
//         return sum + value;
//     });
// };
//
// var employmentSectors = function (data) {
//     data = data.government.industryemployment[0].employmentbyindustry;
//     return lodash.chain(data)
//         .sortBy(function (o) {
//             return o.NAICS;
//         })
//         .filter(function (o) {
//             return o.NAICS !== "";
//         })
//         .map(function (o) {
//             var objectToJoin = [o.NAICS, o.Column];
//             return objectToJoin.join(" - ");
//         })
//         .uniq()
//         .value();
// };
//
// var employmentCell = function (data, sector) {
//     if (sector.split(" - ")[0] !== "Total") {
//         sector = sector.split(" - ").pop();
//     }
//     data = data.government.industryemployment[0].employmentbyindustry;
//
//     var cell = lodash.chain(data)
//         .find(function (o) {
//             return o.Column === sector;
//         })
//         .value()
//         .Value;
//
//     if (cell == "-9999") {
//         return {"type": "string", "value": "NA"};
//     } else {
//         return {"type": "integer", "value": cell};
//     }
// };
//
// var unitsCell = function (data, sector) {
//     if (sector.split(" - ")[0] !== "Total") {
//         sector = sector.split(" - ").pop();
//     }
//     data = data.government.industryunits[0].unitsbyindustry;
//
//     var cell = lodash.chain(data)
//         .find(function (o) {
//             return o.Column === sector;
//         })
//         .value()
//         .Value;
//
//     if (cell == "-9999") {
//         return {"type": "string", "value": "NA"};
//     } else {
//         return {"type": "integer", "value": cell};
//     }
// };
//
// var grandListTopFiveCell = function (data, name, variable) {
//     var cell = lodash.chain(data.government.grandlisttopfive[0].grand_top_five)
//         .find(function (o) {
//             return (
//                 o.Name === name
//             );
//         })
//         .value()
//         .Value;
//
//     if (cell === "-9999") {
//         return {"type": "string", "value": "NA"};
//     } else if (cell === "-666666") {
//         return {"type": "string", "value": " - "};
//     } else {
//         return {"type": "currency", "value": cell};
//     }
// };
//
// //
// // var smarterBalancedCell = function (data, grade, subject) {
// //     var datum = lodash.chain(data.education.cmt[0].cmt)
// //         .find(function (o) {
// //             return (o.Grade === grade
// //             && o.Subject === subject);
// //         })
// //         .value()
// //         .Value;
// //
// //     if (datum.trim() === "-") {
// //         return {"type": "string", "value": "NA"};
// //     } else {
// //         return {"type": "percent", "value": parseFloat(datum) / 100};
// //     }
// // };
//
// var gradeRateCell = function (data, gender) {
//     var cell = lodash.chain(data.education.gradrate[0].gradrate)
//         .find(function (o) {
//             return o.Gender == gender;
//         })
//         .value();
//
//     cell = {
//         "Gender": {"type": "string", "value": gender},
//         "Location": {"type": "string", "value": cell.District},
//         "Value": {"type": "percent", "value": parseInt(cell.Value) / 100}
//     };
//
//     if (cell.Value.value == -99.99) {
//         cell.Value = {"type": "string", "value": "*"};
//     }
//
//     return cell;
// };
//
//
// var revenueCell = function (data, indicator) {
//     return lodash.chain(data.government.revenue[0].municipal_revenue_and_expenditures)
//         .find(function (o) {
//             return o.Row === indicator;
//         })
//         .value()
//         .Value;
// };
//
// var debtCell = function (data, indicator) {
//     return lodash.chain(findByKey(data.government.debt, "municipal_debt").municipal_debt)
//         .find(function (o) {
//             return o.Row === indicator;
//         })
//         .value()
//         .Value;
// };
//
// var ENGLCell = function (data, indicator) {
//     data = findByKey(data.government.grand, "municipal_grand_list").municipal_grand_list;
//     return lodash.chain(data)
//         .find(function (o) {
//             return o.Row === indicator;
//         })
//         .value()
//         .Value;
// };
//
// var housingCell = function (data, subset, find1, find2) {
//     data = findByKey(data.housing[subset], find1)[find1];
//
//     // return data
//     if (find2 === null || find2 === false) {
//         // cell = data[0].Value
//         var cell = data.filter(function (o) {
//             return o.Row !== "Margins of Error";
//         })[0].Value;
//     } else {
//         var cell = lodash.chain(data)
//             .filter(function (o) {
//                 return o.Row != "Margins of Error";
//             })
//             .find(function (o) {
//                 var match = true;
//                 [].concat(find2).forEach(function (condition) {
//                     match = (match && o[condition.key] === condition.value);
//                 });
//                 return match;
//             })
//             .value()
//             .Value;
//     }
//
//     return (cell === "-9999" ? "NA" : cell);
// };
//
// var housingCellYear = function (data, subset, find1, find2) {
//     data = findByKey(data.housing[subset], find1)[find1];
//
//     // return data
//     if (find2 === null || find2 === false) {
//         return data[0].Year;
//     } else {
//         return lodash.chain(data)
//             .find(function (o) {
//                 var match = true;
//                 [].concat(find2).forEach(function (condition) {
//                     match = (match && o[condition.key] === condition.value);
//                 });
//                 return match;
//             })
//             .value()
//             .Year;
//     }
// };
//
// var homeSalesCell = function (data, price) {
//     var cell = lodash.chain(data.housing.sales[0].home_sales)
//         .find(function (o) {
//             return o["Row"] === price;
//         })
//         .value();
//
//     if (cell.Value == -9999) {
//         return "NA";
//     }
//     else {
//         return cell.Value;
//     }
// };
//
// var placeOfWorkCell = function (data, row) {
//     data = findByKey(data.labor.placeofwork, "employmentbyindustry").employmentbyindustry;
//     var value = lodash.chain(data)
//         .find(function (o) {
//             return o.Row === row;
//         })
//         .value()
//         .Value;
//
//     if (value == "-9999") {
//         return {"type": "string", "value": "NA"};
//     } else {
//         return {"type": "integer", "value": value};
//     }
// };
//
// var aagrCell = function (data, row) {
//     return findByKey(data.labor.placeofwork, "aagr").aagr[0].Value;
// };
//
// var residenceCell = function (data, cohort) {
//     data = findByKey(data.labor.placeofresidence, "laborforce").laborforce;
//     return lodash.chain(data)
//         .find(function (o) {
//             return o.Measure === cohort;
//         })
//         .value()
//         .Value;
// };


/** Main Function **/
function serviceToProfile(town, county, state) {

    var DISTANT_POINTS = [
        "Hartford",
        "Boston",
        "Montreal",
        "Providence",
        "New York City"
    ];


    // Helpers
    var parse_suppression = function (cell) {
        if (cell == "-9999") {
            return {"type": "string", "value": "NA"};
        } else {
            return {"type": "integer", "value": cell};
        }
    };

    var findByKey = function (data, key) {
        return lodash.chain(data)
            .find(function (o) {
                return (key in o);
            }).value();
    };

    var sfyFormat = function (year) {
        if (year.slice(0, 3) === "SFY") {
            year = year.slice(-4);
        }

        return year;
    };

    var growthValue = function (data, endYear) {
        var popTimePeriodOne = findByKey(data.demographics.population, "population_acs").population_acs[0].Value;
        var popTimePeriodTwo = findByKey(data.demographics.population, "population_projection").population_projection[0].Value;
        var growthDenominator = 2020 - endYear;

        return (((popTimePeriodTwo - popTimePeriodOne) / popTimePeriodTwo) / growthDenominator);
    };

    var raceCell = function (data, race) {
        data = data.demographics.racecohort[0].race_cohort;
        return lodash.chain(data)
            .find(function (o) {
                return o["Race/Ethnicity"] === race && o.Row === "Population";
            })
            .value()
            .Value;
    };

    var povertyCell = function (data) {
        data = findByKey(data.demographics.misc, "poverty").poverty;
        return lodash.chain(data)
                .find(function (o) {
                    return o.Row === "Poverty Status";
                }).value().Value / 100;
    };

    var factCell = function (data, fact) {
        return lodash.chain(findByKey(data.demographics.misc, fact)[fact])
            .find(function (o) {
                return o.Row !== "Margins of Error";
            }).value().Value;
    };

    var factYear = function (data, fact) {
        return lodash.chain(findByKey(data.demographics.misc, fact)[fact])
            .find(function (o) {
                return o.Row !== "Margins of Error";
            })
            .value()
            .Year;
    };

    var populationStat = function (data) {
        return findByKey(data.demographics.population, "population_acs").population_acs[0].Value;
    };

    var educationCell = function (data, attainment, measureType) {
        return lodash.chain(data.demographics.edattain[0].ed_attainment)
            .find(function (o) {
                return o["Measure Type"] === measureType
                    && o["Educational Attainment"] === attainment
                    && o.Row !== "Margins of Error";
            })
            .value()
            .Value;
    };

    var ageCell = function (data, ages, measureType) {
        ages = [].concat(ages);

        var toSum = lodash.chain(ages)
            .map(function (age) {
                return lodash.chain(data.demographics.agecohort[0].age_cohort)
                    .find(function (o) {
                        return (
                            o["Measure Type"] === measureType
                            && o["Age Cohort"] === age
                            && o.Row !== "Margins of Error"
                        );
                    })
                    .value()
                    .Value;
            })
            .value();

        return lodash.reduce(toSum, function (sum, value) {
            return sum + value;
        });
    };

    var employmentSectors = function (data) {
        data = data.government.industryemployment[0].employmentbyindustry;
        return lodash.chain(data)
            .sortBy(function (o) {
                return o.NAICS;
            })
            .filter(function (o) {
                return o.NAICS !== "";
            })
            .map(function (o) {
                var objectToJoin = [o.NAICS, o.Column];
                return objectToJoin.join(" - ");
            })
            .uniq()
            .value();
    };

    var employmentCell = function (data, sector) {
        if (sector.split(" - ")[0] !== "Total") {
            sector = sector.split(" - ").pop();
        }
        data = data.government.industryemployment[0].employmentbyindustry;

        var cell = lodash.chain(data)
            .find(function (o) {
                return o.Column === sector;
            })
            .value()
            .Value;

        if (cell == "-9999") {
            return {"type": "string", "value": "NA"};
        } else {
            return {"type": "integer", "value": cell};
        }
    };

    var unitsCell = function (data, sector) {
        if (sector.split(" - ")[0] !== "Total") {
            sector = sector.split(" - ").pop();
        }
        data = data.government.industryunits[0].unitsbyindustry;

        var cell = lodash.chain(data)
            .find(function (o) {
                return o.Column === sector;
            })
            .value()
            .Value;

        if (cell == "-9999") {
            return {"type": "string", "value": "NA"};
        } else {
            return {"type": "integer", "value": cell};
        }
    };

    var grandListTopFiveCell = function (data, name, variable) {
        var cell = lodash.chain(data.government.grandlisttopfive[0].grand_top_five)
            .find(function (o) {
                return (
                    o.Name === name
                );
            })
            .value()
            .Value;

        if (cell === "-9999") {
            return {"type": "string", "value": "NA"};
        } else if (cell === "-666666") {
            return {"type": "string", "value": " - "};
        } else {
            return {"type": "currency", "value": cell};
        }
    };

    var smarterBalancedCell = function (data, grade, subject) {
        var datum = lodash.chain(data.education.smarterbalanced[0].smarterbalanced)
            .find(function (o) {
                return (o.Grade === grade && o.Subject === subject);
            })
            .value()
            .Value;

        if (datum.trim() === "-") {
            return {"type": "string", "value": "NA"};
        } else {
            return {"type": "percent", "value": parseFloat(datum) / 100};
        }
    };

    var gradeRateCell = function (data, gender) {
        var cell = lodash.chain(data.education.gradrate[0].gradrate)
            .find(function (o) {
                return o.Gender == gender;
            })
            .value();

        cell = {
            "Gender": {"type": "string", "value": gender},
            "Location": {"type": "string", "value": cell.District},
            "Value": {"type": "percent", "value": parseFloat(cell.Value) / 100}
        };

        if (cell.Value.value == -99.99) {
            cell.Value = {"type": "string", "value": "*"};
        }

        return cell;
    };

    var revenueCell = function (data, indicator) {
        return lodash.chain(data.government.revenue[0].municipal_revenue_and_expenditures)
            .find(function (o) {
                return o.Row === indicator;
            })
            .value()
            .Value;
    };

    var debtCell = function (data, indicator) {
        return lodash.chain(findByKey(data.government.debt, "municipal_debt").municipal_debt)
            .find(function (o) {
                return o.Row === indicator;
            })
            .value()
            .Value;
    };

    var ENGLCell = function (data, indicator) {
        data = findByKey(data.government.grand, "municipal_grand_list").municipal_grand_list;
        return lodash.chain(data)
            .find(function (o) {
                return o.Row === indicator;
            })
            .value()
            .Value;
    };

    var housingCell = function (data, subset, find1, find2) {
        data = findByKey(data.housing[subset], find1)[find1];

        // return data
        if (find2 === null || find2 === false) {
            // cell = data[0].Value
            var cell = data.filter(function (o) {
                return o.Row !== "Margins of Error";
            })[0].Value;
        } else {
            var cell = lodash.chain(data)
                .filter(function (o) {
                    return o.Row != "Margins of Error";
                })
                .find(function (o) {
                    var match = true;
                    [].concat(find2).forEach(function (condition) {
                        match = (match && o[condition.key] === condition.value);
                    });
                    return match;
                })
                .value()
                .Value;
        }

        return (cell === "-9999" ? "NA" : cell);
    };

    var housingCellYear = function (data, subset, find1, find2) {
        data = findByKey(data.housing[subset], find1)[find1];

        // return data
        if (find2 === null || find2 === false) {
            return data[0].Year;
        } else {
            return lodash.chain(data)
                .find(function (o) {
                    var match = true;
                    [].concat(find2).forEach(function (condition) {
                        match = (match && o[condition.key] === condition.value);
                    });
                    return match;
                })
                .value()
                .Year;
        }
    };

    var homeSalesCell = function (data, price) {
        var cell = lodash.chain(data.housing.sales[0].home_sales)
            .find(function (o) {
                return o["Row"] === price;
            })
            .value();

        if (cell.Value == -9999) {
            return "NA";
        }
        else {
            return cell.Value;
        }
    };

    var placeOfWorkCell = function (data, row) {
        data = findByKey(data.labor.placeofwork, "employmentbyindustry").employmentbyindustry;
        var value = lodash.chain(data)
            .find(function (o) {
                return o.Row === row;
            })
            .value()
            .Value;

        if (value == "-9999") {
            return {"type": "string", "value": "NA"};
        } else {
            return {"type": "integer", "value": value};
        }
    };

    var aagrCell = function (data, row) {
        return findByKey(data.labor.placeofwork, "aagr").aagr[0].Value;
    };

    var residenceCell = function (data, cohort) {
        data = findByKey(data.labor.placeofresidence, "laborforce").laborforce;
        return lodash.chain(data)
            .find(function (o) {
                return o.Measure === cohort;
            })
            .value()
            .Value;
    };


    // config info
    var address;
    address = lodash.chain(findByKey(town.topmatter.addresses, "address").address[0])
        .pick(["Address 1", "Address 2", "Address 3", "City", "Zip", "Telephone"])
        .value();

    // could make this more robust, but just not worth it here.
    // if we have a zip that's less than 5 digits, for all reasonability
    // it's because of integer casting somewhere and missing leading zero
    if (address.Zip.length < 5) {
        address.Zip = "0" + address.Zip;
    }

    if (address["Address 1"] === "") {
        address["Address 1"] = "Town Hall";
    }

    address = [
        address["Address 1"],
        address["Address 2"],
        (address["Address 3"] !== "" ? address["Address 3"] : null),
        address.City + ", CT " + address.Zip,
        address.Telephone
    ].filter(function (v) {
        return v !== null;
    });

    var municipalorgs = [
        county.name,
        findByKey(town.topmatter.labormarketareas, "lma").lma[0].Value,
        findByKey(town.topmatter.econdev, "econdevregion").econdevregion[0].Value,
        findByKey(town.topmatter.rpa, "rpa").rpa[0].Value
    ];

    var incorporation = findByKey(town.topmatter.incorporations, "incorporations").incorporations[0].Value;
    var governmentform = findByKey(town.government.misc, "gov_form").gov_form[0].Value;
    var fips = findByKey(town.demographics.population, "population_acs").population_acs[0].FIPS;

    // We could make this more robust but honestly if there's something outside a 10 digit fips or a 9 digit
    // fips that's been erroneously converted to a numeric we have bigger problems.
    if (fips.length < 10) {
        fips = "0" + fips;
    }

    var output = {
        template: "town_profile",
        config: {
            town: town.name,
            FIPS: fips,
            profile_year: profileYear,
            info: {
                address: address,
                municipalorgs: municipalorgs,
                incorporation: incorporation,
                governmentform: governmentform,
                datayears: {} // this is filled in as we go through datasets
            }
        },
        objects: []
    };

    // various infos that need parsing/processing/editing before being fed into giant data object below
    var acsPopYear = findByKey(town.demographics.population, "population_acs").population_acs[0].Year;
    var acsPopEndYear = acsPopYear.slice(-4);
    var growthName = "'" + acsPopEndYear.slice(-2) + " - '20 Growth / Yr";

    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************
    //
    // Demographics
    //
    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************


    // ********************************************************
    //
    // Start Population Data Processing
    //
    // ********************************************************


    output.config.info.datayears["population"] = acsPopYear;

    output.objects.push({
        type: "table",
        name: "population",
        config: {
            nest: [
                "Year"
            ],
            order: {
                Year: [
                    "2000",
                    "2010",
                    acsPopEndYear,
                    "2020",
                    growthName
                ]
            },
            formats: {
                percent: ".1%"
            }
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Year"
                },
                {
                    "type": "integer",
                    "id": "Town"
                },
                {
                    "type": "integer",
                    "id": "County"
                },
                {
                    "type": "numeric",
                    "id": "State"
                }
            ],
            "records": [
                {
                    "Year": {"type": "string", "value": "2000"},
                    "Town": {
                        "type": "integer",
                        "value": findByKey(town.demographics.population, "population_dicennial_2000").population_dicennial_2000[0].Value
                    },
                    "County": {
                        "type": "integer",
                        "value": findByKey(county.demographics.population, "population_dicennial_2000").population_dicennial_2000[0].Value
                    },
                    "State": {
                        "type": "integer",
                        "value": findByKey(state.demographics.population, "population_dicennial_2000").population_dicennial_2000[0].Value
                    }
                }, {
                    "Year": {"type": "string", "value": "2010"},
                    "Town": {
                        "type": "integer",
                        "value": findByKey(town.demographics.population, "population_dicennial_2010").population_dicennial_2010[0].Value
                    },
                    "County": {
                        "type": "integer",
                        "value": findByKey(county.demographics.population, "population_dicennial_2010").population_dicennial_2010[0].Value
                    },
                    "State": {
                        "type": "integer",
                        "value": findByKey(state.demographics.population, "population_dicennial_2010").population_dicennial_2010[0].Value
                    }
                }, {
                    "Year": {"type": "string", "value": acsPopEndYear},
                    "Town": {
                        "type": "integer",
                        "value": findByKey(town.demographics.population, "population_acs").population_acs[0].Value
                    },
                    "County": {
                        "type": "integer",
                        "value": findByKey(county.demographics.population, "population_acs").population_acs[0].Value
                    },
                    "State": {
                        "type": "integer",
                        "value": findByKey(state.demographics.population, "population_acs").population_acs[0].Value
                    }
                }, {
                    "Year": {"type": "string", "value": "2020"},
                    "Town": {
                        "type": "integer",
                        "value": findByKey(town.demographics.population, "population_projection").population_projection[0].Value
                    },
                    "County": {
                        "type": "integer",
                        "value": findByKey(county.demographics.population, "population_projection").population_projection[0].Value
                    },
                    "State": {
                        "type": "integer",
                        "value": findByKey(state.demographics.population, "population_projection").population_projection[0].Value
                    }
                }, {
                    "Year": {"type": "string", "value": growthName},
                    "Town": {"type": "percent", "value": growthValue(town, acsPopEndYear)},
                    "County": {"type": "percent", "value": growthValue(county, acsPopEndYear)},
                    "State": {"type": "percent", "value": growthValue(state, acsPopEndYear)}
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Race/Ethnicity Data Processing
    //
    // ********************************************************

    output.config.info.datayears["race"] = town.demographics.racecohort[0].race_cohort[0].Year;

    output.objects.push({
        type: "table",
        name: "race",
        config: {
            nest: [
                "Race"
            ],
            order: {
                Race: [
                    "White",
                    "Black",
                    "Asian Pacific",
                    "Native American",
                    "Other/Multi-Race",
                    "Hispanic (Any Race)"
                ]
            }
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Race"
                },
                {
                    "type": "integer",
                    "id": "Town"
                },
                {
                    "type": "integer",
                    "id": "County"
                },
                {
                    "type": "numeric",
                    "id": "State"
                }
            ],
            "records": [
                {
                    "Race": {"type": "string", "value": "White Alone, Non-Hispanic"},
                    "Town": {"type": "integer", "value": raceCell(town, "White Alone, Not Hispanic or Latino")},
                    "County": {"type": "integer", "value": raceCell(county, "White Alone, Not Hispanic or Latino")},
                    "State": {"type": "integer", "value": raceCell(state, "White Alone, Not Hispanic or Latino")}
                }, {
                    "Race": {"type": "string", "value": "Black Alone, Non-Hispanic"},
                    "Town": {"type": "integer", "value": raceCell(town, "Black or African American Alone")},
                    "County": {"type": "integer", "value": raceCell(county, "Black or African American Alone")},
                    "State": {"type": "integer", "value": raceCell(state, "Black or African American Alone")}
                }, {
                    "Race": {"type": "string", "value": "Asian"},
                    "Town": {"type": "integer", "value": raceCell(town, "Asian Alone")},
                    "County": {"type": "integer", "value": raceCell(county, "Asian Alone")},
                    "State": {"type": "integer", "value": raceCell(state, "Asian Alone")}
                }, {
                    "Race": {"type": "string", "value": "Native American"},
                    "Town": {
                        "type": "integer",
                        "value": raceCell(town, "American Indian and Alaska Native Alone")
                    },
                    "County": {
                        "type": "integer",
                        "value": raceCell(county, "American Indian and Alaska Native Alone")
                    },
                    "State": {
                        "type": "integer",
                        "value": raceCell(state, "American Indian and Alaska Native Alone")
                    }
                }, {
                    "Race": {"type": "string", "value": "Other/Multi-Race"},
                    "Town": {
                        "type": "integer",
                        "value": parseInt(raceCell(town, "Two or More Races")) + parseInt(raceCell(town, "Some Other Race Alone"))
                    },
                    "County": {
                        "type": "integer",
                        "value": parseInt(raceCell(county, "Two or More Races")) + parseInt(raceCell(county, "Some Other Race Alone"))
                    },
                    "State": {
                        "type": "integer",
                        "value": parseInt(raceCell(state, "Two or More Races")) + parseInt(raceCell(state, "Some Other Race Alone"))
                    }
                }, {
                    "Race": {"type": "string", "value": "Hispanic (Any Race)"},
                    "Town": {"type": "integer", "value": raceCell(town, "Hispanic or Latino")},
                    "County": {"type": "integer", "value": raceCell(county, "Hispanic or Latino")},
                    "State": {"type": "integer", "value": raceCell(state, "Hispanic or Latino")}
                }
            ]
        }
    });

    // ********************************************************
    //
    // Start Poverty Data Processing
    //
    // ********************************************************


    var povertyYear = lodash
        .chain(findByKey(town.demographics.misc, "poverty").poverty)
        .find(function (o) {
            return o.Row === "Poverty Status";
        })
        .value()
        .Year;

    output.objects.push({
        type: "table",
        name: "poverty",
        config: {
            nest: [
                "Measure"
            ]
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Measure"
                },
                {
                    "type": "percent",
                    "id": "Town"
                },
                {
                    "type": "percent",
                    "id": "County"
                },
                {
                    "type": "percent",
                    "id": "State"
                }
            ],
            "records": [
                {
                    "Measure": {"type": "string", "value": "Poverty Rate (" + povertyYear + ")"},
                    "Town": {"type": "percent", "value": povertyCell(town)},
                    "County": {"type": "percent", "value": povertyCell(county)},
                    "State": {"type": "percent", "value": povertyCell(state)}
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Demographic Facts Data Processing
    //
    // ********************************************************

    var densityYear = factYear(town, "landarea");
    var ageYear = factYear(town, "median_age");
    var householdsYear = factYear(town, "households");
    var hhIncYear = factYear(town, "median_hh_income");

    output.objects.push({
        type: "table",
        name: "demog_facts",
        config: {
            nest: [
                "Fact"
            ],
            order: {
                Fact: [
                    "Land Area (sq. miles)",
                    "Pop./Sq. Mile (" + densityYear + ")",
                    "Median Age (" + ageYear + ")",
                    "Households (" + householdsYear + ")",
                    "Med. HH Inc. (" + hhIncYear + ")"
                ]
            }
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Fact"
                },
                {
                    "type": "integer",
                    "id": "Town"
                },
                {
                    "type": "integer",
                    "id": "County"
                },
                {
                    "type": "integer",
                    "id": "State"
                }
            ],
            "records": [
                {
                    "Fact": {"type": "string", "value": "Land Area (sq. miles)"},
                    "Town": {"type": "integer", "value": factCell(town, "landarea")},
                    "County": {"type": "integer", "value": factCell(county, "landarea")},
                    "State": {"type": "integer", "value": factCell(state, "landarea")}
                }, {
                    "Fact": {"type": "string", "value": "Pop./Sq. Mile (" + densityYear + ")"},
                    "Town": {"type": "integer", "value": Math.round(populationStat(town) / factCell(town, "landarea"))},
                    "County": {
                        "type": "integer",
                        "value": Math.round(populationStat(county) / factCell(county, "landarea"))
                    },
                    "State": {
                        "type": "integer",
                        "value": Math.round(populationStat(state) / factCell(state, "landarea"))
                    }
                }, {
                    "Fact": {"type": "string", "value": "Median Age (" + ageYear + ")"},
                    "Town": {"type": "integer", "value": factCell(town, "median_age")},
                    "County": {"type": "integer", "value": factCell(county, "median_age")},
                    "State": {"type": "integer", "value": factCell(state, "median_age")}
                }, {
                    "Fact": {"type": "string", "value": "Households (" + householdsYear + ")"},
                    "Town": {"type": "integer", "value": factCell(town, "households")},
                    "County": {"type": "integer", "value": factCell(county, "households")},
                    "State": {"type": "integer", "value": factCell(state, "households")}
                }, {
                    "Fact": {"type": "string", "value": "Med. HH Inc. (" + hhIncYear + ")"},
                    "Town": {"type": "currency", "value": factCell(town, "median_hh_income")},
                    "County": {"type": "currency", "value": factCell(county, "median_hh_income")},
                    "State": {"type": "currency", "value": factCell(state, "median_hh_income")}
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Educational Attainment Data Processing
    //
    // ********************************************************

    output.config.info.datayears["educational_attainment"] = town.demographics.edattain[0].ed_attainment[0].Year;

    output.objects.push({
        type: "table",
        name: "educational_attainment",
        config: {
            nest: [
                "Attainment",
                "Geography"
            ],
            order: {
                leaf: [
                    "Number",
                    "Percent"
                ],
                Attainment: [
                    "High School Graduate",
                    "Associates Degree",
                    "Bachelors or Higher"
                ],
                Geography: [
                    "Town",
                    "State"
                ]
            },
            formats: {
                percent: ".0%"
            }
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Attainment"
                },
                {
                    "type": "string",
                    "id": "Geography"
                },
                {
                    "type": "integer",
                    "id": "Number"
                },
                {
                    "type": "percent",
                    "id": "Percent"
                }
            ],
            "records": [
                {
                    "Attainment": {"type": "string", "value": "High School Graduate"},
                    "Geography": {"type": "string", "value": "Town"},
                    "Number": {
                        "type": "integer",
                        "value": educationCell(town, "High School Diploma, GED, or equivalent", "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": educationCell(town, "High School Diploma, GED, or equivalent", "Percent")
                    }
                }, {
                    "Attainment": {"type": "string", "value": "Associates Degree"},
                    "Geography": {"type": "string", "value": "Town"},
                    "Number": {"type": "integer", "value": educationCell(town, "Associate's Degree", "Number")},
                    "Percent": {"type": "percent", "value": educationCell(town, "Associate's Degree", "Percent")}
                }, {
                    "Attainment": {"type": "string", "value": "Bachelors or Higher"},
                    "Geography": {"type": "string", "value": "Town"},
                    "Number": {
                        "type": "integer",
                        "value": educationCell(town, "Bachelor's Degree or higher", "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": educationCell(town, "Bachelor's Degree or higher", "Percent")
                    }
                }, {
                    "Attainment": {"type": "string", "value": "High School Graduate"},
                    "Geography": {"type": "string", "value": "State"},
                    "Number": {
                        "type": "integer",
                        "value": educationCell(state, "High School Diploma, GED, or equivalent", "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": educationCell(state, "High School Diploma, GED, or equivalent", "Percent")
                    }
                }, {
                    "Attainment": {"type": "string", "value": "Associates Degree"},
                    "Geography": {"type": "string", "value": "State"},
                    "Number": {"type": "integer", "value": educationCell(state, "Associate's Degree", "Number")},
                    "Percent": {"type": "percent", "value": educationCell(state, "Associate's Degree", "Percent")}
                }, {
                    "Attainment": {"type": "string", "value": "Bachelors or Higher"},
                    "Geography": {"type": "string", "value": "State"},
                    "Number": {
                        "type": "integer",
                        "value": educationCell(state, "Bachelor's Degree or higher", "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": educationCell(state, "Bachelor's Degree or higher", "Percent")
                    }
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Educational Attaiment Data Processing
    //
    // ********************************************************

    output.config.info.datayears["age"] = town.demographics.agecohort[0].age_cohort[0].Year;

    output.objects.push({
        type: "table",
        name: "age",
        config: {
            nest: [
                "Cohort",
                "Age"
            ],
            order: {
                leaf: [
                    "Number",
                    "Percent"
                ],
                Cohort: [
                    "Town",
                    "County",
                    "State"
                ],
                Age: [
                    "0-4",
                    "5-17",
                    "18-24",
                    "25-49",
                    "50-64",
                    "65+",
                    "Total"
                ]
            },
            formats: {
                percent: "0%"
            }
        },
        data: {
            "fields": [
                {
                    "type": "string",
                    "id": "Cohort"
                },
                {
                    "type": "string",
                    "id": "Age"
                },
                {
                    "type": "integer",
                    "id": "Number"
                },
                {
                    "type": "percent",
                    "id": "Percent"
                }
            ],
            "records": [
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "0-4"},
                    "Number": {"type": "integer", "value": ageCell(town, ["0 to 4 years"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(town, ["0 to 4 years"], "Percent")}
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "0-4"},
                    "Number": {"type": "integer", "value": ageCell(county, ["0 to 4 years"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(county, ["0 to 4 years"], "Percent")}
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "0-4"},
                    "Number": {"type": "integer", "value": ageCell(state, ["0 to 4 years"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(state, ["0 to 4 years"], "Percent")}
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "5-14"},
                    "Number": {"type": "integer", "value": ageCell(town, ["5 to 9 years", "10 to 14 years"], "Number")},
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(town, ["5 to 9 years", "10 to 14 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "5-14"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(county, ["5 to 9 years", "10 to 14 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(county, ["5 to 9 years", "10 to 14 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "5-14"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(state, ["5 to 9 years", "10 to 14 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(state, ["5 to 9 years", "10 to 14 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "15-24"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(town, ["15 to 19 years", "20 to 24 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(town, ["15 to 19 years", "20 to 24 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "15-24"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(county, ["15 to 19 years", "20 to 24 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(county, ["15 to 19 years", "20 to 24 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "15-24"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(state, ["15 to 19 years", "20 to 24 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(state, ["15 to 19 years", "20 to 24 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "25-44"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(town, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(town, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "25-44"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(county, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(county, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "25-44"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(state, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(state, ["25 to 29 years", "30 to 34 years", "35 to 44 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "45-64"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(town, ["45 to 54 years", "55 to 64 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(town, ["45 to 54 years", "55 to 64 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "45-64"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(county, ["45 to 54 years", "55 to 64 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(county, ["45 to 54 years", "55 to 64 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "45-64"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(state, ["45 to 54 years", "55 to 64 years"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(state, ["45 to 54 years", "55 to 64 years"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "65+"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(town, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(town, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "65+"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(county, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(county, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "65+"},
                    "Number": {
                        "type": "integer",
                        "value": ageCell(state, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Number")
                    },
                    "Percent": {
                        "type": "percent",
                        "value": ageCell(state, ["65 to 74 years", "75 to 84 years", "85 years and over"], "Percent")
                    }
                },
                {
                    "Cohort": {"type": "string", "value": "Town"},
                    "Age": {"type": "string", "value": "Total"},
                    "Number": {"type": "integer", "value": ageCell(town, ["Total"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(town, ["Total"], "Percent")}
                },
                {
                    "Cohort": {"type": "string", "value": "County"},
                    "Age": {"type": "string", "value": "Total"},
                    "Number": {"type": "integer", "value": ageCell(county, ["Total"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(county, ["Total"], "Percent")}
                },
                {
                    "Cohort": {"type": "string", "value": "State"},
                    "Age": {"type": "string", "value": "Total"},
                    "Number": {"type": "integer", "value": ageCell(state, ["Total"], "Number")},
                    "Percent": {"type": "percent", "value": ageCell(state, ["Total"], "Percent")}
                }
            ]
        }
    });

    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************
    //
    // ECONOMICS
    //
    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************


    // ********************************************************
    //
    // Start Business Profile Data Processing
    //
    // ********************************************************

    var sectors = employmentSectors(town);
    sectors = ["Total - All Industries"].concat(sectors).concat(["Total Government"]);
    // sectors = ["Total - All Industries"].concat(sectors).concat(["Total Government", "Local/Municipal Government"]);

    var records = lodash.chain(sectors)
        .map(function (s) {
            return {
                "Sector": {"type": "string", "value": s},
                "Units": unitsCell(town, s),
                "Employment": employmentCell(town, s)
            }
        })
        .value();

    output.config.info.datayears["business"] = town.government.industryemployment[0].employmentbyindustry[0].Year;

    output.objects.push({
        type: "table",
        name: "business",
        config: {
            header_zero: true,
            nest: [
                "Sector"
            ],
            order: {
                Sector: sectors
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Sector"},
                {"type": "integer", "id": "Units"},
                {"type": "integer", "id": "Employment"}
            ],
            "records": records
        }
    });


    // ********************************************************
    //
    // Start Grand List Data Processing
    //
    // ********************************************************
    var grandListTopFiveNames = lodash.chain(town.government.grandlisttopfive[0].grand_top_five)
        .filter(function (o) {
            return ("Name" in o && undefined !== o.Name);
        })
        .sortBy(function (o) {
            return o.Rank
        })
        .map(function (o) {
            return o.Name
        })
        .value();


    if (town.government.grandlisttopfive[0].grand_top_five[0].Year !== "-666666") {
        output.config.info.datayears["grand_list"] = town.government.grandlisttopfive[0].grand_top_five[0].Year;
    } else {
        output.config.info.datayears["grand_list"] = "";
    }

    var grandListTopFiveObjects = lodash.chain(grandListTopFiveNames)
        .map(function (name) {
            return {
                Company: {type: "string", value: (name === "-666666" ? " - " : name)},
                Amount: grandListTopFiveCell(town, name, "Grand List Value")/*,
                 "% of Net" : {type : "percent", value : (grandListTopFiveCell(town, name, "Percent of Net Grand List")/100)}*/
            }
        })
        .value();

    var netGL = findByKey(town.government.grand, "municipal_grand_list").municipal_grand_list;
    netGL = lodash.chain(netGL)
        .find(function (o) {
            return o.Row === "Net Grand List"
        })
        .value();

    var netGLYear = netGL.Year; // to report as "SFY ####-####"

    // var netGLYear = netGL.Year.slice(-4); // take end year from SFY
    // netGLYear = parseInt(netGLYear) - 2; // GL year for SFY year is from october before start year

    netGL = netGL.Value;

    grandListTopFiveObjects.push({
        Company: {type: "string", value: "Net Grand List (" + netGLYear + ")"},
        Amount: {type: "currency", value: netGL}/*,
         "% of Net" : {type : "string", value : ""}*/
        // empty string - type string - doesn't break num formatting later
    });

    output.objects.push({
        type: "table",
        name: "grand_list",
        config: {
            nest: ["Company"],
            order: {
                leaf: ["Amount", "% of Net"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Company"},
                {"type": "currency", "id": "Amount"},
                {"type": "percent", "id": "% of Net"}
            ],
            "records": grandListTopFiveObjects
        }
    });


    // ********************************************************
    //
    // Start Major Employers Data Processing
    //
    // ********************************************************

    var employersObjects = lodash
        .chain(findByKey(town.government.majoremployers, "major_employers").major_employers)
        .sortBy(function (o) {
            return o.Rank;
        })
        .map(function (o) {
            return {Company: {type: "string", value: o.Value}};
        })
        .value();

    output.config.info.datayears["employers"] = findByKey(town.government.majoremployers, "major_employers").major_employers[0].Year;

    output.objects.push({
        type: "table",
        name: "employers",
        config: {
            header: false
        },
        data: {
            "fields": [
                {"type": "string", "id": "Company"}
            ],
            "records": employersObjects
        }
    });

    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************
    //
    // EDUCATION
    //
    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************


    // ********************************************************
    //
    // Start CMT Data Processing
    //
    // ********************************************************


    // output.config.info.datayears["cmt"] = town.education.cmt[0].cmt[0].Year;

    // output.objects.push({
    //     type: "table",
    //     name: "cmt",
    //     config: {
    //         header_leaf: true,
    //         nest: ["Subject", "Grade"],
    //         order: {
    //             Subject: ["Reading", "Math", "Writing"],
    //             Grade: ["Grade 4", "Grade 6", "Grade 8"]
    //         }
    //     },
    //     data: {
    //         "fields": [
    //             {"type": "string", "id": "Grade"},
    //             {"type": "string", "id": "Subject"},
    //             {"type": "string", "id": "Town"},
    //             {"type": "string", "id": "State"}
    //         ],
    //         "records": [
    //             {
    //                 "Grade": {"type": "string", "value": "Grade 3"},
    //                 "Subject": {"value": "Reading", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 3", "Reading"),
    //                 "State": smarterBalancedCell(state, "Grade 3", "Reading")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 4"},
    //                 "Subject": {"value": "Reading", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 4", "Reading"),
    //                 "State": smarterBalancedCell(state, "Grade 4", "Reading")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 8"},
    //                 "Subject": {"value": "Reading", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 8", "Reading"),
    //                 "State": smarterBalancedCell(state, "Grade 8", "Reading")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 3"},
    //                 "Subject": {"value": "Math", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 3", "Math"),
    //                 "State": smarterBalancedCell(state, "Grade 3", "Math")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 4"},
    //                 "Subject": {"value": "Math", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 4", "Math"),
    //                 "State": smarterBalancedCell(state, "Grade 4", "Math")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 8"},
    //                 "Subject": {"value": "Math", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 8", "Math"),
    //                 "State": smarterBalancedCell(state, "Grade 8", "Math")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 3"},
    //                 "Subject": {"value": "Writing", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 3", "Writing"),
    //                 "State": smarterBalancedCell(state, "Grade 3", "Writing")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 4"},
    //                 "Subject": {"value": "Writing", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 4", "Writing"),
    //                 "State": smarterBalancedCell(state, "Grade 4", "Writing")
    //             }, {
    //                 "Grade": {"type": "string", "value": "Grade 8"},
    //                 "Subject": {"value": "Writing", "type": "string"},
    //                 "Town": smarterBalancedCell(town, "Grade 8", "Writing"),
    //                 "State": smarterBalancedCell(state, "Grade 8", "Writing")
    //             }
    //         ]
    //     }
    // });

    // ********************************************************
    //
    // Start Smarter Balanced Data Processing
    //
    // ********************************************************


    output.config.info.datayears["smarterbalanced"] = town.education.smarterbalanced[0].smarterbalanced[0].Year;

    output.objects.push({
        type: "table",
        name: "smarterbalanced",
        config: {
            header_leaf: true,
            nest: ["Subject", "Grade"],
            order: {
                Subject: ["Math", "ELA"],
                Grade: ["Grade 4", "Grade 6", "Grade 8"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Grade"},
                {"type": "string", "id": "Subject"},
                {"type": "string", "id": "Town"},
                {"type": "string", "id": "State"}
            ],
            "records": [
                {
                    "Grade": {"type": "string", "value": "Grade 3"},
                    "Subject": {"value": "Math", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 3", "Math"),
                    "State": smarterBalancedCell(state, "Grade 3", "Math")
                }, {
                    "Grade": {"type": "string", "value": "Grade 4"},
                    "Subject": {"value": "Math", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 4", "Math"),
                    "State": smarterBalancedCell(state, "Grade 4", "Math")
                }, {
                    "Grade": {"type": "string", "value": "Grade 8"},
                    "Subject": {"value": "Math", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 8", "Math"),
                    "State": smarterBalancedCell(state, "Grade 8", "Math")
                }, {
                    "Grade": {"type": "string", "value": "Grade 3"},
                    "Subject": {"value": "ELA", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 3", "ELA"),
                    "State": smarterBalancedCell(state, "Grade 3", "ELA")
                }, {
                    "Grade": {"type": "string", "value": "Grade 4"},
                    "Subject": {"value": "ELA", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 4", "ELA"),
                    "State": smarterBalancedCell(state, "Grade 4", "ELA")
                }, {
                    "Grade": {"type": "string", "value": "Grade 8"},
                    "Subject": {"value": "ELA", "type": "string"},
                    "Town": smarterBalancedCell(town, "Grade 8", "ELA"),
                    "State": smarterBalancedCell(state, "Grade 8", "ELA")
                }
            ]
        }
    });
    // ********************************************************
    //
    // Start Enrollment Data Processing
    //
    // ********************************************************

    var grades = ["PK", "K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var enrollment = findByKey(town.education.enrollment, "enrollment").enrollment;

    enrollment = lodash.chain(enrollment)
        .map(function (o) {
            var gradeRange = o["District Grade Range"].split("-");
            o.gradeStart = gradeRange[0];
            o.gradeEnd = gradeRange[1];

            return o;
        })
        .sort(function (a, b) {
            return grades.indexOf(b.gradeStart) - grades.indexOf(a.gradeStart);
        })
        .map(function (o) {
            return {
                "School": {"type": "string", "value": o.District},
                "Grades": {"type": "string", "value": o["District Grade Range"]},
                "Enrollment": {"type": "integer", "value": o.Value}
            };
        })
        .value();

    output.config.info.datayears["enrollment"] = town.education.enrollment[0].enrollment[0].Year;

    output.objects.push({
        type: "table",
        name: "enrollment",
        config: {
            nest: ["School"],
            order: {
                leaf: ["Grades", "Enrollment"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "School"},
                {"type": "string", "id": "Grades"},
                {"type": "integer", "id": "Enrollment"}
            ],
            "records": enrollment
        }
    });

    // ********************************************************
    //
    // Start Graduation Rate Data Processing
    //
    // ********************************************************


    if (town.education.gradrate[0].gradrate.length > 0) {

        output.config.info.datayears["graduation"] = town.education.gradrate[0].gradrate[0].Year;

        output.objects.push({
            type: "table",
            name: "graduation",
            config: {
                nest: ["Location", "Gender"],
                order: {
                    Gender: ["All", "Female", "Male"]
                }
            },
            data: {
                "fields": [
                    {"type": "string", "id": "Gender"},
                    {"type": "string", "id": "Location"},
                    {"type": "percent", "id": "Value"}
                ],
                "records": [
                    gradeRateCell(state, "All"),
                    gradeRateCell(state, "Female"),
                    gradeRateCell(state, "Male"),
                    gradeRateCell(town, "All"),
                    gradeRateCell(town, "Female"),
                    gradeRateCell(town, "Male")
                ]
            }
        })
    } else {
        // what to do without graduation rate info (Bozrah)
    }

    // ********************************************************
    //
    // Start PSIS Data Processing
    //
    // ********************************************************

    var psisDistrict = town.education.psis[0].psis[0].District;
    var psisYear = town.education.psis[0].psis[0].Year;
    var psisValue = town.education.psis[0].psis[0].Value;

    output.objects.push({
        type: "table",
        name: "psis",
        config: {
            nest: ["District", "Year"],
            order: {
                Gender: ["All", "Female", "Male"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "District"},
                {"type": "string", "id": "Year"},
                {"type": "integer", "id": "Value"}
            ],
            "records": [
                {
                    District: {"type": "string", "value": psisDistrict},
                    Year: {"type": "string", "value": psisYear},
                    Value: {"type": "string", "value": psisValue}
                }
            ]
        }
    });

    // ********************************************************
    //
    // Start Chronic Absenteeism Data Processing
    //
    // ********************************************************

    var absentGrades = [
        {"type": "string", "value": ""},
        {"type": "string", "value": "All"}
    ];

    var absentState = lodash.chain(absentGrades)
        .map(function (o, i, a) {
            if (i === 0) {
                return {"type": "string", "value": "Connecticut"}
            }

            var value = lodash.chain(state.education.absenteeism[0].absenteeism[0]).value().Value;
            if (value === "-9999") {
                return {"type": "string", "value": "*"}
            } else {
                return {"type": "percent", "value": (parseFloat(value) / 100)}
            }
        })
        .value();

    var absenteeism = findByKey(town.education.absenteeism, "absenteeism").absenteeism;
    absenteeism = absenteeism = lodash.chain(absenteeism)
        .map(function (o) {
            return [
                {
                    "type": "string",
                    "value": o.District
                },
                {
                    "type": "percent",
                    "value": (o.Value == "-9999" || o.Value == "-6666") ? "*" : (parseFloat(o.Value) / 100)
                }
            ]
        })
        .value();
    absenteeism.unshift(absentState);
    absenteeism.unshift(absentGrades);

    output.config.info.datayears["absenteeism"] = town.education.absenteeism[0].absenteeism[0].Year;

    output.objects.push({
        type: "simpletable",
        name: "absenteeism",
        config: {
            nest: ["Location", "Grade"],
            order: {
                Grade: ["All"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Location"},
                // {"type": "string", "id": "Grade"},
                {"type": "percent", "id": "Value"}
            ],
            "records": absenteeism
        }
    });

    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************
    //
    // GOVERNMENT
    //
    // ********************************************************
    // ********************************************************
    // ********************************************************
    // ********************************************************


    // ********************************************************
    //
    // Start Revenue Data Processing
    //
    // ********************************************************


    var revenueYear = sfyFormat(town.government.revenue[0].municipal_revenue_and_expenditures[0].Year);

    var revenueObjRecords = [];

    if (revenueCell(town, "Total Revenue") == null) {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Total Revenue (" + revenueYear + ")"},
            Value: {type: "string", value: " - "}
        });
    } else {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Total Revenue (" + revenueYear + ")"},
            Value: {type: "currency", value: revenueCell(town, "Total Revenue")}
        });
    }

    if (revenueCell(town, "Property Tax Revenue") == null) {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Tax Revenue"},
            Value: {type: "string", value: " - "}
        });
    } else {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Tax Revenue"},
            Value: {type: "currency", value: revenueCell(town, "Property Tax Revenue")}
        });
    }

    if (revenueCell(town, "Total Revenue") == null || revenueCell(town, "Property Tax Revenue") == null) {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Non-tax Revenue"},
            Value: {type: "string", value: " - "}
        });
    } else {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Non-tax Revenue"},
            Value: {
                type: "currency",
                value: parseInt(revenueCell(town, "Total Revenue")) - parseInt(revenueCell(town, "Property Tax Revenue"))
            }
        });
    }

    if (revenueCell(town, "Intergovernmental Revenue") == null) {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Intergovernmental"},
            Value: {type: "string", value: " - "}
        });
    } else {
        revenueObjRecords.push({
            Indicator: {type: "string", value: "Intergovernmental"},
            Value: {type: "currency", value: revenueCell(town, "Intergovernmental Revenue")}
        });
    }

    output.objects.push({
        type: "table",
        name: "revenue",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Indicator: [
                    "Total Revenue (" + revenueYear + ")",
                    "Tax Revenue",
                    "Non-tax Revenue",
                    "Intergovernmental"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "currency", "id": "Value"}
            ],
            "records": revenueObjRecords
        }
    });


    // ********************************************************
    //
    // Start Tax Data Processing
    //
    // ********************************************************

    var taxObjRecords = [];
    if (revenueCell(town, "Current Year Adjusted Tax Levy per Capita") == null) {
        taxObjRecords.push({
            Indicator: {type: "string", value: "Per Capita Tax (" + revenueYear + ")"},
            Value: {type: "string", value: " - "}
        })
    } else {
        taxObjRecords.push({
            Indicator: {type: "string", value: "Per Capita Tax (" + revenueYear + ")"},
            Value: {type: "currency", value: revenueCell(town, "Current Year Adjusted Tax Levy per Capita")}
        })
    }

    if (revenueCell(town, "Current Year Adjusted Tax Levy per Capita as Percent of State Average") == null) {
        taxObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {type: "string", value: " - "}
        })
    } else {
        taxObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {
                type: "percent",
                value: revenueCell(town, "Current Year Adjusted Tax Levy per Capita as Percent of State Average") / 100
            }
        })
    }

    output.objects.push({
        type: "table",
        name: "tax",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: ["Per Capita Tax (" + revenueYear + ")", "As % of State Average"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "integer", "id": "Value"}
            ],
            "records": taxObjRecords
        }
    });


    // ********************************************************
    //
    // Start Expenditures Data Processing
    //
    // ********************************************************

    var expendituresObjRecords = [];

    if (revenueCell(town, "Total Expenditures") == null) {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Total Expenditures (" + revenueYear + ")"},
            Value: {type: "string", value: " - "}
        })
    } else {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Total Expenditures (" + revenueYear + ")"},
            Value: {type: "currency", value: revenueCell(town, "Total Expenditures")}
        })
    }

    if (revenueCell(town, "Educational Expenditures") == null) {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Education"},
            Value: {type: "string", value: " - "}
        })
    } else {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Education"},
            Value: {type: "currency", value: revenueCell(town, "Educational Expenditures")}
        })
    }

    if (revenueCell(town, "Total Expenditures") == null || revenueCell(town, "Educational Expenditures") == null) {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Other"},
            Value: {type: "string", value: " - "}
        })
    } else {
        expendituresObjRecords.push({
            Indicator: {type: "string", value: "Other"},
            Value: {
                type: "currency",
                value: parseInt(revenueCell(town, "Total Expenditures")) - parseInt(revenueCell(town, "Educational Expenditures"))
            }
        })
    }

    output.objects.push({
        type: "table",
        name: "expenditures",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: ["Total Expenditures (" + revenueYear + ")", "Education", "Other"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Location"},
                {"type": "string", "id": "Grade"},
                {"type": "integer", "id": "Value"}
            ],
            "records": expendituresObjRecords
        }
    });

    // ********************************************************
    //
    // Start Debt Data Processing
    //
    // ********************************************************

    var debtYear = sfyFormat(findByKey(town.government.debt, "municipal_debt").municipal_debt[0].Year);

    var debtObjRecords = [];

    if (debtCell(town, "Total Indebtedness") == null) {
        debtObjRecords.push({
            Indicator: {type: "string", value: "Total Indebtedness (" + debtYear + ")"},
            Value: {type: "string", value: " - "}
        });
    }
    else {
        debtObjRecords.push({
            Indicator: {type: "string", value: "Total Indebtedness (" + debtYear + ")"},
            Value: {type: "currency", value: debtCell(town, "Total Indebtedness")}
        });
    }

    if (debtCell(town, "Total Indebtedness as Percent of Total Expenditures") == null) {
        debtObjRecords.push({
            Indicator: {type: "string", value: "As % of Expenditures"},
            Value: {type: "string", value: " - "}
        });
    }
    else {
        debtObjRecords.push({
            Indicator: {type: "string", value: "As % of Expenditures"},
            Value: {type: "percent", value: debtCell(town, "Total Indebtedness as Percent of Total Expenditures") / 100}
        });
    }

    if (debtCell(town, "Debt per Capita") == null) {
        debtObjRecords.push({
            Indicator: {type: "string", value: "Per Capita"},
            Value: {type: "string", value: " - "}
        });
    }
    else {
        debtObjRecords.push({
            Indicator: {type: "string", value: "Per Capita"},
            Value: {type: "currency", value: debtCell(town, "Debt per Capita")}
        });
    }

    if (debtCell(town, "Debt per Capita as Percent of State Average") == null) {
        debtObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {type: "string", value: " - "}
        });
    }
    else {
        debtObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {type: "percent", value: debtCell(town, "Debt per Capita as Percent of State Average") / 100}
        });
    }

    output.objects.push({
        type: "table",
        name: "indebtedness",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: [
                    "Total Indebtedness (" + debtYear + ")",
                    "As % of Expenditures",
                    "Per Capita",
                    "As % of State Average"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "integer", "id": "Value"}
            ],
            "records": debtObjRecords
        }
    });

    // ********************************************************
    //
    // Start Debt Service Data Processing
    //
    // ********************************************************

    var debtServiceObjRecords = [];

    if (debtCell(town, "Debt Service") == null) {
        debtServiceObjRecords.push({
            Indicator: {type: "string", value: "Annual Debt Service (" + debtYear + ")"},
            Value: {type: "string", value: " - "}
        });
    } else {
        debtServiceObjRecords.push({
            Indicator: {type: "string", value: "Annual Debt Service (" + debtYear + ")"},
            Value: {type: "currency", value: debtCell(town, "Debt Service")}
        });
    }

    if (debtCell(town, "Debt Service") == null || revenueCell(town, "Total Expenditures") == null) {
        debtServiceObjRecords.push({
            Indicator: {type: "string", value: "As % of Expenditures"},
            Value: {type: "string", value: " - "}
        });
    } else {
        debtServiceObjRecords.push({
            Indicator: {type: "string", value: "As % of Expenditures"},
            Value: {
                type: "percent",
                value: (parseInt(debtCell(town, "Debt Service")) / parseInt(revenueCell(town, "Total Expenditures")))
            }
        });
    }

    output.objects.push({
        type: "table",
        name: "debt_service",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: [
                    "Annual Debt Service (" + debtYear + ")",
                    "As % of Expenditures"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "integer", "id": "Value"}
            ],
            "records": debtServiceObjRecords
        }
    });

    // ********************************************************
    //
    // Start Grand List Data Processing
    //
    // ********************************************************


    var equalizedNetGrandListYear = sfyFormat(findByKey(town.government.grand, "municipal_grand_list").municipal_grand_list[0].Year);

    var englObjRecords = [];

    if (ENGLCell(town, "Equalized Net Grand List") == null) {
        englObjRecords.push({
            Indicator: {type: "string", value: "Eq. Net Grand List (" + equalizedNetGrandListYear + ")"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        englObjRecords.push({
            Indicator: {type: "string", value: "Eq. Net Grand List (" + equalizedNetGrandListYear + ")"},
            Value: {type: "currency", value: ENGLCell(town, "Equalized Net Grand List")}
        })
    }

    if (ENGLCell(town, "Equalized Net Grand List per Capita") == null) {
        englObjRecords.push({
            Indicator: {type: "string", value: "Per Capita"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        englObjRecords.push({
            Indicator: {type: "string", value: "Per Capita"},
            Value: {type: "currency", value: ENGLCell(town, "Equalized Net Grand List per Capita")}
        })
    }

    if (ENGLCell(town, "Equalized Net Grand List per Capita as Percent of State Average") == null) {
        englObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        englObjRecords.push({
            Indicator: {type: "string", value: "As % of State Average"},
            Value: {
                type: "percent",
                value: parseFloat(ENGLCell(town, "Equalized Net Grand List per Capita as Percent of State Average")) / 100
            }
        })
    }

    output.objects.push({
        type: "table",
        name: "eq_grand_list",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: [
                    "Eq. Net Grand List (" + equalizedNetGrandListYear + ")",
                    "Per Capita",
                    "As % of State Average"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "integer", "id": "Value"}
            ],
            "records": englObjRecords
        }
    });

    // ********************************************************
    //
    // Start Bond Info Data Processing
    //
    // ********************************************************

    var moody = findByKey(town.government.debt, "moodys").moodys[0].Value,
        moodyYear = sfyFormat(findByKey(town.government.debt, "moodys").moodys[0].Year);

    var bondMillObjRecords = [
        {
            Indicator: {type: "string", value: "Moody's Bond Rating (" + moodyYear + ")"},
            Value: {type: "string", value: (moody === "" ? " - " : moody)}
        }
    ];

    if (ENGLCell(town, "Actual Mill Rate") == null) {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "Actual Mill Rate (" + equalizedNetGrandListYear + ")"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "Actual Mill Rate (" + equalizedNetGrandListYear + ")"},
            Value: {type: "decimal", value: ENGLCell(town, "Actual Mill Rate")}
        })
    }

    if (ENGLCell(town, "Equalized Mill Rate") == null) {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "Equalized Mill Rate (" + equalizedNetGrandListYear + ")"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "Equalized Mill Rate (" + equalizedNetGrandListYear + ")"},
            Value: {type: "decimal", value: ENGLCell(town, "Equalized Mill Rate")}
        })
    }

    if (ENGLCell(town, "Commercial and Industrial Share of Total Net Grand List") == null) {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "% of Net Grand List Com/Ind (" + equalizedNetGrandListYear + ")"},
            Value: {"type": "string", "value": " - "}
        })
    } else {
        bondMillObjRecords.push({
            Indicator: {type: "string", value: "% of Net Grand List Com/Ind (" + equalizedNetGrandListYear + ")"},
            Value: {
                type: "percent",
                value: ENGLCell(town, "Commercial and Industrial Share of Total Net Grand List") / 100
            }
        })
    }

    output.objects.push({
        type: "table",
        name: "bond_mill",
        config: {
            header: false,
            nest: ["Indicator"],
            order: {
                Grade: [
                    "Moody's Bond Rating (" + moodyYear + ")",
                    "Actual Mill Rate (" + equalizedNetGrandListYear + ")",
                    "Equalized Mill Rate (" + equalizedNetGrandListYear + ")",
                    "% of Net Grand List Com/Ind (" + equalizedNetGrandListYear + ")"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "integer", "id": "Value"}
            ],
            "records": bondMillObjRecords
        }
    });

    // ********************************************************
    //
    // Start Home Sales Data Processing
    //
    // ********************************************************

    var townSalesTotal = homeSalesCell(town, "Total");
    var countySalesTotal = homeSalesCell(county, "Total");
    var stateSalesTotal = homeSalesCell(state, "Total");

    var singleUnitYear = housingCellYear(town, "stock", "detatchedhousingunits", [{
        key: "Row",
        value: "Detached Units (% of Total)"
    }]);
    var permitsYear = housingCellYear(town, "stock", "housingpermits", null);
    var demolitionsYear = housingCellYear(town, "stock", "demolition", null);
    var salesYear = (townSalesTotal === "NA" ? "" : town.housing.sales[0].home_sales[0].Year);
    var subsidizedYear = housingCellYear(town, "stock", "subsidized", null);

    output.config.info.datayears["housing"] = housingCellYear(town, "stock", "housingtenure", null);

    var salesIndicator = "Home Sales";

    if (salesYear !== "") {
        output.config.info.datayears["house_sales"] = salesYear;
        salesIndicator = "Home Sales (" + salesYear + ")"
    }

    output.objects.push({
        type: "table",
        name: "housing",
        config: {
            nest: ["Indicator"],
            order: {
                Grade: [
                    "Total Units",
                    "% Single Unit (" + singleUnitYear + ")",
                    "New Permits Auth (" + permitsYear + ")",
                    "As % Existing Units",
                    "Demolitions (" + demolitionsYear + ")",
                    salesIndicator,
                    "Median Price",
                    "Built Pre-1950 share",
                    "Owner Occupied Dwellings",
                    "As % Total Dwellings",
                    "Subsidized Housing (" + subsidizedYear + ")"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "string", "id": "Town"},
                {"type": "string", "id": "County"},
                {"type": "integer", "id": "State"}
            ],
            "records": [
                {
                    Indicator: {type: "string", value: "Total Units"},
                    Town: {
                        type: "integer",
                        value: housingCell(town, "stock", "singlehousingunits", [{key: "Row", value: "Total Units"}])
                    },
                    County: {
                        type: "integer",
                        value: housingCell(county, "stock", "singlehousingunits", [{key: "Row", value: "Total Units"}])
                    },
                    State: {
                        type: "integer",
                        value: housingCell(state, "stock", "singlehousingunits", [{key: "Row", value: "Total Units"}])
                    }
                }, {
                    Indicator: {type: "string", value: "% Single Unit (" + singleUnitYear + ")"},
                    Town: {
                        type: "percent",
                        value: parseFloat(housingCell(town, "stock", "detatchedhousingunits", [{
                            key: "Row",
                            value: "Detached Units (% of Total)"
                        }])) / 100
                    },
                    County: {
                        type: "percent",
                        value: parseFloat(housingCell(county, "stock", "detatchedhousingunits", [{
                            key: "Row",
                            value: "Detached Units (% of Total)"
                        }])) / 100
                    },
                    State: {
                        type: "percent",
                        value: parseFloat(housingCell(state, "stock", "detatchedhousingunits", [{
                            key: "Row",
                            value: "Detached Units (% of Total)"
                        }])) / 100
                    }
                }, {
                    Indicator: {type: "string", value: "New Permits Auth (" + permitsYear + ")"},
                    Town: {
                        type: (housingCell(town, "stock", "housingpermits", null) === "NA" ? "string" : "integer"),
                        value: housingCell(town, "stock", "housingpermits", null)
                    },
                    County: {
                        type: (housingCell(county, "stock", "housingpermits", null) === "NA" ? "string" : "integer"),
                        value: housingCell(county, "stock", "housingpermits", null)
                    },
                    State: {
                        type: (housingCell(state, "stock", "housingpermits", null) === "NA" ? "string" : "integer"),
                        value: housingCell(state, "stock", "housingpermits", null)
                    }
                }, {
                    Indicator: {type: "string", value: "As % Existing Units"},
                    Town: {
                        type: "percent",
                        value: (parseInt(housingCell(town, "stock", "housingpermits", null)) / parseInt(housingCell(town, "stock", "singlehousingunits", [{
                            key: "Row",
                            value: "Total Units"
                        }])))
                    },
                    County: {
                        type: "percent",
                        value: (parseInt(housingCell(county, "stock", "housingpermits", null)) / parseInt(housingCell(county, "stock", "singlehousingunits", [{
                            key: "Row",
                            value: "Total Units"
                        }])))
                    },
                    State: {
                        type: "percent",
                        value: (parseInt(housingCell(state, "stock", "housingpermits", null)) / parseInt(housingCell(state, "stock", "singlehousingunits", [{
                            key: "Row",
                            value: "Total Units"
                        }])))
                    }
                }, {
                    Indicator: {type: "string", value: "Demolitions (" + demolitionsYear + ")"},
                    Town: {type: "integer", value: housingCell(town, "stock", "demolition", null)},
                    County: {type: "integer", value: housingCell(county, "stock", "demolition", null)},
                    State: {type: "integer", value: housingCell(state, "stock", "demolition", null)}
                }, {
                    Indicator: {type: "string", value: salesIndicator},
                    Town: {type: (townSalesTotal !== "NA" ? "integer" : "string"), value: townSalesTotal},
                    County: {type: (countySalesTotal !== "NA" ? "integer" : "string"), value: countySalesTotal},
                    State: {type: (stateSalesTotal !== "NA" ? "integer" : "string"), value: stateSalesTotal}
                }, {
                    Indicator: {type: "string", value: "Median Price"},
                    Town: {type: "currency", value: housingCell(town, "stock", "homevalue", null)},
                    County: {type: "currency", value: housingCell(county, "stock", "homevalue", null)},
                    State: {type: "currency", value: housingCell(state, "stock", "homevalue", null)}
                }, {
                    Indicator: {type: "string", value: "Built Pre-1950 share"},
                    Town: {type: "percent", value: housingCell(town, "stock", "pre1950units", null) / 100},
                    County: {type: "percent", value: housingCell(county, "stock", "pre1950units", null) / 100},
                    State: {type: "percent", value: housingCell(state, "stock", "pre1950units", null) / 100}
                }, {
                    Indicator: {type: "string", value: "Owner Occupied Dwellings"},
                    Town: {
                        type: "integer",
                        value: housingCell(town, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units"
                        }])
                    },
                    County: {
                        type: "integer",
                        value: housingCell(county, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units"
                        }])
                    },
                    State: {
                        type: "integer",
                        value: housingCell(state, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units"
                        }])
                    }
                }, {
                    Indicator: {type: "string", value: "As % Total Dwellings"},
                    Town: {
                        type: "percent",
                        value: housingCell(town, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units (% of Total)"
                        }]) / 100
                    },
                    County: {
                        type: "percent",
                        value: housingCell(county, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units (% of Total)"
                        }]) / 100
                    },
                    State: {
                        type: "percent",
                        value: housingCell(state, "stock", "housingtenure", [{
                            key: "Row",
                            value: "Owner Occupied Housing Units (% of Total)"
                        }]) / 100
                    }
                }, {
                    Indicator: {type: "string", value: "Subsidized Housing (" + subsidizedYear + ")"},
                    Town: {type: "integer", value: housingCell(town, "stock", "subsidized", null)},
                    County: {type: "integer", value: housingCell(county, "stock", "subsidized", null)},
                    State: {type: "integer", value: housingCell(state, "stock", "subsidized", null)}
                }
            ]
        }
    });

    var homeSalesObject = {
        type: "table",
        name: "house_sales",
        config: {
            header_zero: false,
            nest: ["Number of Sales"],
            order: {
                "Number of Sales": [
                    "Less than $100,000",
                    "$100,000-$199,999",
                    "$200,000-$299,999",
                    "$300,000-$399,999",
                    "$400,000 or More"
                ]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Number of Sales"},
                {"type": "string", "id": "Town"},
                {"type": "string", "id": "County"},
                {"type": "integer", "id": "State"}
            ],
            "records": [
                {
                    "Number of Sales": {type: "string", value: "Less than $100,000"},
                    Town: {type: "integer", value: homeSalesCell(town, "Less than $100,000")},
                    County: {type: "integer", value: homeSalesCell(county, "Less than $100,000")},
                    State: {type: "integer", value: homeSalesCell(state, "Less than $100,000")}
                }, {
                    "Number of Sales": {type: "string", value: "$100,000-$199,999"},
                    Town: {type: "integer", value: homeSalesCell(town, "$100,000 to $199,999")},
                    County: {type: "integer", value: homeSalesCell(county, "$100,000 to $199,999")},
                    State: {type: "integer", value: homeSalesCell(state, "$100,000 to $199,999")}
                }, {
                    "Number of Sales": {type: "string", value: "$200,000-$299,999"},
                    Town: {type: "integer", value: homeSalesCell(town, "$200,000 to $299,999")},
                    County: {type: "integer", value: homeSalesCell(county, "$200,000 to $299,999")},
                    State: {type: "integer", value: homeSalesCell(state, "$200,000 to $299,999")}
                }, {
                    "Number of Sales": {type: "string", value: "$300,000-$399,999"},
                    Town: {type: "integer", value: homeSalesCell(town, "$300,000 to $399,999")},
                    County: {type: "integer", value: homeSalesCell(county, "$300,000 to $399,999")},
                    State: {type: "integer", value: homeSalesCell(state, "$300,000 to $399,999")}
                }, {
                    "Number of Sales": {type: "string", value: "$400,000 or More"},
                    Town: {type: "integer", value: homeSalesCell(town, "$400,000 and Over")},
                    County: {type: "integer", value: homeSalesCell(county, "$400,000 and Over")},
                    State: {type: "integer", value: homeSalesCell(state, "$400,000 and Over")}
                }
            ]
        }
    };

    homeSalesObject.data.records.forEach(function (r, ri, ra) {
        if (r.Town.value === "NA") {
            homeSalesObject.data.records[ri].Town.type = "string";
        }
        if (r.County.value === "NA") {
            homeSalesObject.data.records[ri].County.type = "string";
        }
        if (r.State.value === "NA") {
            homeSalesObject.data.records[ri].State.type = "string";
        }
    });

    output.objects.push(homeSalesObject);

    // ********************************************************
    //
    // Start Place of Residence Data Processing
    //
    // ********************************************************


    output.config.info.datayears["place_of_residence"] = findByKey(town.labor.placeofresidence, "laborforce").laborforce[0].Year;

    output.objects.push({
        type: "table",
        name: "place_of_residence",
        config: {
            nest: ["Cohort"],
            order: {
                Cohort: [
                    "Labor Force",
                    "Employed",
                    "Unemployed",
                    "Unemployment Rate"
                ],
                leaf: ["Town", "County", "State"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Cohort"},
                {"type": "string", "id": "Town"},
                {"type": "string", "id": "County"},
                {"type": "integer", "id": "State"}
            ],
            "records": [
                {
                    Cohort: {type: "string", value: "Labor Force"},
                    Town: {type: "integer", value: residenceCell(town, "Labor Force")},
                    County: {type: "integer", value: residenceCell(county, "Labor Force")},
                    State: {type: "integer", value: residenceCell(state, "Labor Force")}
                }, {
                    Cohort: {type: "string", value: "Employed"},
                    Town: {type: "integer", value: residenceCell(town, "Employment")},
                    County: {type: "integer", value: residenceCell(county, "Employment")},
                    State: {type: "integer", value: residenceCell(state, "Employment")}
                }, {
                    Cohort: {type: "string", value: "Unemployed"},
                    Town: {type: "integer", value: residenceCell(town, "Unemployment")},
                    County: {type: "integer", value: residenceCell(county, "Unemployment")},
                    State: {type: "integer", value: residenceCell(state, "Unemployment")}
                }, {
                    Cohort: {type: "string", value: "Unemployment Rate"},
                    Town: {type: "percent", value: residenceCell(town, "Unemployment Rate") / 100},
                    County: {type: "percent", value: residenceCell(county, "Unemployment Rate") / 100},
                    State: {type: "percent", value: residenceCell(state, "Unemployment Rate") / 100}
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Place of Work Data Processing
    //
    // ********************************************************


    var aagrYearStart = findByKey(town.labor.placeofwork, "aagr").aagr[0].Row.slice(-10, -6);
    var aagrYearEnd = findByKey(town.labor.placeofwork, "aagr").aagr[0].Row.slice(-3, -1);
    var aagrIndicator = aagrYearStart + "-'" + aagrYearEnd + " AAGR";

    output.config.info.datayears["place_of_work"] = findByKey(town.labor.placeofwork, "employmentbyindustry").employmentbyindustry[0].Year;

    output.objects.push({
        type: "table",
        name: "place_of_work",
        config: {
            nest: ["Indicator"],
            order: {
                Indicator: [
                    "Units",
                    "Total Employment",
                    aagrIndicator,
                    "Mfg Employment"
                ],
                leaf: ["Town", "County", "State"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "string", "id": "Town"},
                {"type": "string", "id": "County"},
                {"type": "integer", "id": "State"}
            ],
            "records": [
                {
                    Indicator: {type: "string", value: "Units"},
                    Town: placeOfWorkCell(town, "All Industries - Number of Employers"),
                    County: placeOfWorkCell(county, "All Industries - Number of Employers"),
                    State: placeOfWorkCell(state, "All Industries - Number of Employers")
                }, {
                    Indicator: {type: "string", value: "Total Employment"},
                    Town: placeOfWorkCell(town, "All Industries - Annual Average Employment"),
                    County: placeOfWorkCell(county, "All Industries - Annual Average Employment"),
                    State: placeOfWorkCell(state, "All Industries - Annual Average Employment")
                }, {
                    Indicator: {type: "string", value: aagrIndicator},
                    Town: {type: "percent", value: aagrCell(town)},
                    County: {type: "percent", value: aagrCell(county)},
                    State: {type: "percent", value: aagrCell(state)}
                }, {
                    Indicator: {type: "string", value: "Mfg Employment"},
                    Town: placeOfWorkCell(town, "Manufacturing - Annual Average Employment"),
                    County: placeOfWorkCell(county, "Manufacturing - Annual Average Employment"),
                    State: placeOfWorkCell(state, "Manufacturing - Annual Average Employment")
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Commuting Table Data Processing
    //
    // ********************************************************


    // build commuting table data
    var commuteTo = town.labor.commutingto[0].commutingto;
    var commuteFrom = town.labor.commutingfrom[0].commutingfrom;

    output.config.info.datayears["commuters"] = commuteTo[0].Year;

    var commutingObjects = [];

    commuteTo.forEach(function (o, i) {
        var tempObj = [
            {"value": commuteFrom[i].Column, "type": "string"},
            {"value": commuteFrom[i].Value, "type": "integer"},
            {"value": commuteTo[i].Column, "type": "string"},
            {"value": commuteTo[i].Value, "type": "integer"}
        ];
        commutingObjects.push(tempObj);
    });

    commutingObjects = [
        [
            {
                "value": "Commuters Into Town From:",
                "type": "string"
            },
            {
                "value": "Town Residents Commuting To:",
                "type": "string"
            }
        ]
    ].concat(commutingObjects);

    output.objects.push({
        type: "simpletable",
        name: "commuters",
        config: {},
        data: {
            "fields": [],
            "records": commutingObjects
        }
    });


    // ********************************************************
    //
    // Start Crime Data Processing
    //
    // ********************************************************

    output.config.info.datayears["crime"] = town.other.crime[0].crimerate[0].Year;

    output.objects.push({
        type: "table",
        name: "crime",
        config: {
            nest: ["Indicator"]
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "string", "id": "Town"},
                {"type": "integer", "id": "State"}
            ],
            "records": [
                {
                    Indicator: {type: "string", value: "Per 100,000 residents"},
                    Town: {type: "integer", value: town.other.crime[0].crimerate[0].Value},
                    State: {type: "integer", value: state.other.crime[0].crimerate[0].Value}
                }
            ]
        }
    });


    // ********************************************************
    //
    // Start Library Data Processing
    //
    // ********************************************************


    var library = findByKey(town.other.services, "library").library,
        circulation = lodash.chain(library)
            .find(function (o) {
                return o.Row === "Circulation per capita"
            })
            .value()
            .Value;

    var internet = lodash.chain(library)
        .find(function (o) {
            return o.Row === "Internet Computer Use"
        })
        .value()
        .Value;

    circulation = (circulation === "-" ? "NA" : circulation);
    internet = (internet === "-" ? "NA" : internet);

    output.config.info.datayears["library"] = library[0].Year;

    output.objects.push({
        type: "table",
        name: "library",
        config: {
            nest: ["Indicator"],
            order: {
                Indicator: ["Circulation per Capita", "Internet use per Visit"]
            }
        },
        data: {
            "fields": [
                {"type": "string", "id": "Indicator"},
                {"type": "string", "id": "Town"}
            ],
            "records": [
                {
                    Indicator: {type: "string", value: "Circulation per Capita"},
                    Town: {type: (circulation === "NA" ? "string" : "decimal"), value: circulation}
                }, {
                    Indicator: {type: "string", value: "Internet Use per Visit"},
                    Town: {type: (internet === "NA" ? "string" : "decimal"), value: internet}
                }
            ]
        }
    });

    // ********************************************************
    //
    // Start Family Assistance Processing
    //
    // ********************************************************


    output.config.info.datayears["family_assistance"] = sfyFormat(findByKey(town.other.services, "tanf").tanf[0].Year);

    var tanf_value = findByKey(town.other.services, "tanf").tanf[0].Value;
    tanf_value = parse_suppression(tanf_value);

    output.objects.push({
        type: "table",
        name: "family_assistance",
        config: {
            nest: ["Indicator"]
        },
        data: {
            fields: [
                {type: "string", id: "Indicator"},
                {type: "string", id: "Town"}
            ],
            records: [
                {
                    "Indicator": {type: "string", value: "Temporary Family Assistance (TFA)"},
                    "Town": tanf_value
                }
            ]
        }
    });

    // ********************************************************
    //
    // Start SNAP Data Processing
    //
    // ********************************************************

    output.config.info.datayears["population_assistance"] = sfyFormat(findByKey(town.other.services, "snap").snap[0].Year);

    output.objects.push({
        type: "table",
        name: "population_assistance",
        config: {
            nest: ["Indicator"]
        },
        data: {
            fields: [
                {type: "string", id: "Indicator"},
                {type: "string", id: "Town"}
            ],
            records: [
                {
                    "Indicator": {type: "string", value: "Supplemental Nutrition Assistance Program (SNAP)"},
                    "Town": {type: "integer", value: findByKey(town.other.services, "snap").snap[0].Value}
                }
            ]
        }
    });

    // ********************************************************
    //
    // Start Distances Data Processing
    //
    // ********************************************************


    var distanceObjects = lodash.chain(town.labor.distances[0].distance)
        .filter(function (o) {
            return DISTANT_POINTS.indexOf(o.Endpoint) !== -1;
        })
        .sortBy(function (o) {
            return parseFloat(o.Value)
        })
        .map(function (o) {
            return {
                City: {type: "string", value: o.Endpoint},
                Miles: {type: "integer", value: o.Value}
            }
        });

    output.objects.push({
        type: "table",
        name: "city_distance",
        config: {
            nest: ["City"]
        },
        data: {
            "fields": [
                {"type": "string", "id": "City"},
                {"type": "string", "id": "Miles"}
            ],
            "records": distanceObjects
        }
    });

    // ********************************************************
    //
    // Start Utilities Processing
    //
    // ********************************************************

    var utilities = findByKey(town.government.other, "utilities").utilities;

    var electric = lodash.chain(utilities)
        .map(function (o) {
            if (o.Telephone === "-666666") {
                o.Telephone = "";
            }
            return o;
        })
        .find(function (o) {
            return o.Utility === "Electric"
                && o.Telephone !== "-666666"
        })
        .value();

    var gas = lodash.chain(utilities)
        .map(function (o) {
            if (o.Telephone === "-666666") {
                o.Telephone = "";
            }
            return o;
        })
        .find(function (o) {
            return o.Utility === "Gas"
                && o.Name !== "-666666";
            // && o.Telephone !== "-666666"
        })
        .value();

    var water = lodash.chain(utilities)
        .map(function (o) {
            if (o.Telephone === "-666666") {
                o.Telephone = "";
            }
            return o;
        })
        .find(function (o) {
            return o.Utility === "Water"
                && o.Name !== "-666666";
            // && o.Telephone !== "-666666"
        })
        .value();

    var cable = lodash.chain(utilities)
        .map(function (o) {
            if (o.Telephone === "-666666") {
                o.Telephone = "";
            }
            return o;
        })
        .find(function (o) {
            return o.Utility === "Cable"
                && o.Name !== "-666666";
            // && o.Telephone !== "-666666"
        })
        .value();

    if (undefined !== electric) {
        output.objects.push({
            type: "table",
            name: "electric",
            config: {
                header: false
            },
            data: {
                "fields": [
                    {"type": "string", "id": "Info"}
                ],
                "records": [
                    {
                        Info: {type: "string", value: electric.Name}
                    }, {
                        // Info : {type : "string", value : electric.Name}
                        Info: {type: "string", value: electric.Telephone}
                    }
                ]
            }
        })
    }
    if (undefined !== gas) {
        output.objects.push({
            type: "table",
            name: "gas",
            config: {
                header: false
            },
            data: {
                "fields": [
                    {"type": "string", "id": "Info"}
                ],
                "records": [
                    {
                        Info: {type: "string", value: gas.Name}
                    }, {
                        // Info : {type : "string", value : gas.Name}
                        Info: {type: "string", value: gas.Telephone}
                    }
                ]
            }
        })
    }
    if (undefined !== water) {
        output.objects.push({
            type: "table",
            name: "water",
            config: {
                header: false
            },
            data: {
                "fields": [
                    {"type": "string", "id": "Info"}
                ],
                "records": [
                    {
                        Info: {type: "string", value: water.Name}
                    }, {
                        // Info : {type : "string", value : water.Name}
                        Info: {type: "string", value: water.Telephone}
                    }
                ]
            }
        })
    }
    if (undefined !== cable) {
        output.objects.push({
            type: "table",
            name: "cable",
            config: {
                header: false
            },
            data: {
                "fields": [
                    {"type": "string", "id": "Info"}
                ],
                "records": [
                    {
                        Info: {type: "string", value: cable.Name}
                    }, {
                        // Info : {type : "string", value : cable.Name}
                        Info: {type: "string", value: cable.Telephone}
                    }
                ]
            }
        })
    }

    return output;
}
