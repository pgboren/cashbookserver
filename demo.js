require("dotenv").config();
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
var request = require('sync-request');

const util = require('util');
const demo = require('./data/demo_data');
const db = require('./models');
const { Console } = require("console");
const Province = db.province;
const District = db.district;
const Commune = db.commune;
const Village = db.village;

connnection_string = util.format('mongodb://boren:boren@127.0.0.1:27017/cashbook');
mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true});
var database = mongoose.connection;
if(!database) {
	console.log("Error connecting db");
}
else {
	console.log("Db connected successfully");
}

var provinces = [
	{
        "url": "/km/phnom-penh-capital",
        "name": "រាជធានី ភ្នំពេញ",
        "code": "12"
    },
    {
        "url": "/km/kandal-province",
        "name": "ខេត្ត កណ្តាល",
        "code": "08"
    }
    ,
{
        "url": "/km/kep-province",
        "name": "ខេត្ត កែប",
        "code": "22"
    },
    {
        "url": "/km/koh-kong-province",
        "name": "ខេត្ត កោះកុង",
        "code": "09"
    },
    {
        "url": "/km/kratie-province",
        "name": "ខេត្ត ក្រចេះ",
        "code": "10"
    },
    {
        "url": "/km/kampong-cham-province",
        "name": "ខេត្ត កំពង់ចាម",
        "code": "03"
    },
    {
        "url": "/km/kampong-chhnang-province",
        "name": "ខេត្ត កំពង់ឆ្នាំង",
        "code": "04"
    },
    {
        "url": "/km/kampong-thom-province",
        "name": "ខេត្ត កំពង់ធំ",
        "code": "06"
    },
    {
        "url": "/km/kampong-speu-province",
        "name": "ខេត្ត កំពង់ស្ពឺ",
        "code": "05"
    },
    {
        "url": "/km/kampot-province",
        "name": "ខេត្ត កំពត",
        "code": "07"
    },
    {
        "url": "/km/takeo-provine",
        "name": "ខេត្ត តាកែវ",
        "code": "21"
    },
    {
        "url": "/km/tboung-khmum-province",
        "name": "ខេត្ត ត្បូងឃ្មុំ",
        "code": "25"
    },
    {
        "url": "/km/banteay-meanchey-provine",
        "name": "ខេត្ត បន្ទាយមានជ័យ",
        "code": "01"
    },
    {
        "url": "/km/pailin-province",
        "name": "ខេត្ត ប៉ៃលិន",
        "code": "23"
    },
    {
        "url": "/km/battambang-provine",
        "name": "ខេត្ត បាត់ដំបង",
        "code": "02"
    },
    {
        "url": "/km/pursat-province",
        "name": "ខេត្ត ពោធិសាត់",
        "code": "15"
    },
    {
        "url": "/km/prey-veng-province",
        "name": "ខេត្ត ព្រៃវែង",
        "code": "14"
    },
    {
        "url": "/km/preah-vihear-provine",
        "name": "ខេត្ត ព្រះវិហារ",
        "code": "13"
    },
    {
        "url": "/km/preah-sihanouk-province",
        "name": "ខេត្ត ព្រះសីហនុ",
        "code": "18"
    },
    {
        "url": "/km/mondul-kiri-province",
        "name": "ខេត្ត មណ្ឌលគិរី",
        "code": "11"
    },
    {
        "url": "/km/ratanak-kiri-provine",
        "name": "ខេត្ត រតនគីរី",
        "code": "16"
    },
    {
        "url": "/km/siem-reap-provine",
        "name": "ខេត្ត សៀមរាប",
        "code": "17"
    },
    {
        "url": "/km/steung-treng-province",
        "name": "ខេត្ត ស្ទឹងត្រែង",
        "code": "19"
    },
    {
        "url": "/km/svay-rieng-province",
        "name": "ខេត្ត ស្វាយរៀង",
        "code": "20"
    },
    {
        "url": "/km/oddar-meanchey-province",
        "name": "ខេត្ត ឧត្តរមានជ័យ",
        "code": "24"
    }
];

const baseUrl = 'https://www.cambodiapostalcode.com';

// createProvince(provinces[0]);
// createProvince(provinces[1]);
// createProvince(provinces[2]);
// createProvince(provinces[3]);
// createProvince(provinces[4]);
// createProvince(provinces[5]);
// createProvince(provinces[6]);
// createProvince(provinces[7]);
// createProvince(provinces[8]);
// createProvince(provinces[9]);
// createProvince(provinces[10]);
// createProvince(provinces[11]);
// createProvince(provinces[12]);
// createProvince(provinces[13]);
// createProvince(provinces[14]);
// createProvince(provinces[15]);
// createProvince(provinces[16]);
// createProvince(provinces[17]);
// createProvince(provinces[18]);
// createProvince(provinces[19]);
// createProvince(provinces[20]);
// createProvince(provinces[21]);
// createProvince(provinces[22]);
// createProvince(provinces[23]);
// createProvince(provinces[24]);

function createProvince(data) {
	var province = new Province();
	province.name = data.name;
	province.code = data.code;
    province.url = data.url;
    province.save((error, saveProvince) => {
        if (error) {
            console.log('Province Import Error: ' + data.name);
            process.exit();
        } else {
            createDistricts(saveProvince);
        }
      });
}

function createDistricts(province) {
    var url = baseUrl + province.url + '.json';
	https.get(url, (res) => {
		let data = '';
	
		// A chunk of data has been received.
		res.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received.
		res.on('end', () => {
			const body = JSON.parse(data);
			var components = body.data.placeholders[0].components;

            components.forEach(function(component) {
                var isDistrictData = (component.name == 'postal-code-link-list' && component.data.heading == province.name);
                if (isDistrictData) {
                    var items = component.data.items;
                    items.forEach(function(item) {
                        console.log('Province:' + province.name + ' - District: ' + item.name);
                        var url = baseUrl + item.url + '.json';
                        var district = new District();
                        var name = item.name;
                        district.name = name;
                        district.url = item.url;
                        district.code = item.code.replace("", "");
                        district.province = province._id;
                        district.save((error, saveDistrict) => {
                            if (error) {
                                Console.log('Error at Url' + url);
                                process.exit();
                            } else {
                                createCommunes(saveDistrict);
                            }
                          });
        
                    });
                }
            });

			
		});
	
	}).on("error", (err) => {
		console.log("Error: " + err.message);
        Console.log('Error at Url' + url);
        process.exit();
	});
}

function createCommunes(district) {
    var url = baseUrl + district.url + '.json';
	https.get(url, (res) => {
		let data = '';
	

		res.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received.
		res.on('end', () => {
			const body = JSON.parse(data);
            var components = body.data.placeholders[0].components;
            components.forEach(function(component) {
                var isCommuneData = (component.name == 'postal-code-list');
                if (isCommuneData) {
                    var items = component.data.items;
                    items.forEach(function(item) {
                        console.log('		- Commune: ' + item.name + ' - Url: ' + item.url);
                        var commune = new Commune();
                        commune.name = item.name;
                        commune.code = item.code.replace("", "");
                        commune.district = district._id;
                        if (item.url) {
                            commune.url = item.url;
                        }
                        commune.save((error, saveCommune) => {
                            if (error) {
                                Console.log('Error at Url' + url);
                                process.exit();
                            } else {
                                if (commune.url != null) {
                                    createVillages(saveCommune)
                                }
                            }
                        });
                    });
                }
               
            });
		});
	
	}).on("error", (err) => {
		console.log("Error: " + err.message);
        Console.log('Error at Url' + url);
        process.exit();
	});
}

function createVillages(commune) {
    console.log('Commune URL: ' + commune.url);
    var url = baseUrl + commune.url + '.json';

    https.get(url, (res) => {
		let data = '';
	
		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
            if (res.statusCode == 200) {
                const body = JSON.parse(data);
                var components = body.data.placeholders[0].components;
                components.forEach(function(component) {
                    if (component.name == 'village-list') {
                        var items =  component.data.items;
                        items.forEach(function(item) {
                            console.log('		- Commune: ' + item.name + ' - Url: ' + item.url);
                            var village = new Village();
                            village.name = item.name;
                            village.commune = commune._id;
                            village.save();
                        });
                    }

                });


                
            }
		});
	
	}).on("error", (err) => {
		console.log("Error: " + err.message);
        console.log('Error at Url' + url);
        process.exit();
	});

	
}



function addDistrictToProvince(provinceId, districtId) {
    const filter = { _id: provinceId };
    const update = { $push: { districts: { $each: [districtId] } } };
    const options = { new: true };
    Province.findOneAndUpdate(filter, update, options, (error, updatedDocument) => {
    if (error) {
        // handle error
    } else {
        // handle success
    }
    });
}

function addCommuneToDistrict(commune_id, district_id) {
    const filter = { _id: district_id };
    const update = { $push: { communes: { $each: [commune_id] } } };
    const options = { new: true };
    District.findOneAndUpdate(filter, update, options, (error, updatedDocument) => {
    if (error) {
        // handle error
    } else {
        // handle success
    }
    });
}
