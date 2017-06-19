var lat = "1.315912";
var long = '103.753189';
var food = '';


const Yelp = require('yelp-api-v3');
const YelpBiz = require('node-yelp-fusion');

var YELP_ID = '-ulP58VwFTAHGRhyxnZh_A';
var YELP_SECRET = 'BvupJdv1K4xdIKaX3vJJaejAuN9fECa5PpgIvyMJF4Lw3KfIioEKatlMf6mlDcWu';

var yelp = new Yelp({
    app_id: YELP_ID,
    app_secret: YELP_SECRET
});

// use different package for Biz search
var yelpBiz = new YelpBiz({ id: YELP_ID, secret: YELP_SECRET});

// Intialize variables that we will save to global
var responseCounter = 0; 
var exceedResNo = false;
var jsonString = '';
var jsonBiz = '';
var jsonName = ''; 
var jsonUrl = '';
var jsonCat = '';
var jsonImage = '';
var jsonNumber = '';
var jsonRating = '';
var jsonAddress = ''; 
var jsonAddress2 = ''; 
var jsonDist = ''; 
var jsonMapLat = '';
var jsonMapLong = '';
var jsonId = '';
var jsonPrice = '';
var jsonPriceSym = '';
var jsonIsOpenNow = '';

// Create function to save yelp search output
const saveYelpSearchOutput = (data) => {
    jsonString = JSON.parse(data);
    jsonBiz = jsonString.businesses;
    jsonBiz = jsonString.businesses;
    jsonName = [jsonBiz[0].name]; 
    jsonUrl = [jsonBiz[0].url];
    var i = 0;
    do {
        if (i == jsonBiz[0].categories.length) {
            jsonCat += jsonBiz[0].categories[i].title;      
        } else if (i == 0) {
            jsonCat = [jsonBiz[0].categories[0].title];
        } else {
            jsonCat += ", " + jsonBiz[0].categories[i].title;
        }
        i++;
    } while (i<jsonBiz[0].categories.length);
    jsonCat = [jsonCat];
    jsonImage = [jsonBiz[0].image_url];
    jsonNumber = [jsonBiz[0].phone];
    jsonRating = [jsonBiz[0].rating];
    jsonAddress=[jsonBiz[0].location.address1];
    jsonAddress2=[jsonBiz[0].location.address2];
    jsonDist=[jsonBiz[0].distance];
    jsonMapLat = [jsonBiz[0].coordinates.latitude];
    jsonMapLong = [jsonBiz[0].coordinates.longitude];
    jsonId = [jsonBiz[0].id];
    if (jsonBiz[0].price) {
        jsonPrice = [jsonBiz[0].price.length];   
    } else {
        jsonPrice = [""];
    }
        
    // Store all results
    i = 0;
    if (jsonBiz.length > 0) {
        do {
            jsonName[i] = jsonBiz[i].name; 
            jsonUrl[i] = jsonBiz[i].url;
            var j = 0;
            do {
                if (j == jsonBiz[i].categories.length) {
                    jsonCat[i] += jsonBiz[i].categories[j].title;   
                } else if (j == 0) {
                    jsonCat[i] = jsonBiz[i].categories[0].title;
                } else {
                    jsonCat[i] += ", " + jsonBiz[i].categories[j].title;
                }
                j++;
            } while (j<jsonBiz[i].categories.length);
            
            jsonImage[i] = jsonBiz[i].image_url;
            if (jsonImage[i]) {
                jsonImage[i] = jsonImage[i].replace("ms.jpg","o.jpg");
            }
            jsonNumber[i] = jsonBiz[i].phone;
            jsonRating[i] = jsonBiz[i].rating;
            jsonAddress[i] = jsonBiz[i].location.address1;
            jsonAddress2[i] = jsonBiz[i].location.address2;
            jsonDist[i]= [jsonBiz[i].distance];
            jsonMapLat[i] = jsonBiz[i].coordinates.latitude;
            jsonMapLong[i] = jsonBiz[i].coordinates.longitude;
            jsonId[i] = jsonBiz[i].id;
            if (jsonBiz[i].price) {
                jsonPrice[i] = jsonBiz[i].price.length;
            } else {
                jsonPrice[i] = "Not available";
            }
            i++;
        } while (i < jsonBiz.length);
    }
    return true;
};

// Create function to save yelp business output
const saveYelpBusinessOutput = (data) => {
    if (data.hours) {
        const jsonHours = data.hours;
        jsonIsOpenNow = jsonHours[0].is_open_now; 
        if (jsonIsOpenNow==true) {
            jsonIsOpenNow = "Open now."
        } else {
            jsonIsOpenNow = "Closed."
        }
        var resObj = jsonIsOpenNow;    
    } else {
        var resObj = "Unknown status";
    }

    return resObj;
};

// Need to find a better shuffle algo
const shuffleYelp = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = jsonName[i];
        var temp2 = jsonCat[i];
        var temp3 = jsonImage[i];
        var temp4 = jsonRating[i];
        var temp5 = jsonPrice[i];
        var temp6 = jsonUrl[i];
        var temp7 = jsonMapLat[i];
        var temp8 = jsonMapLong[i];
        var temp9 = jsonId[i];
        var temp10 = jsonAddress[i];
        var temp11 = jsonAddress2[i];
        var temp12 = jsonDist[i];

        jsonName[i] = jsonName[j];
        jsonName[j] = temp;

        jsonCat[i] = jsonCat[j];
        jsonCat[j] = temp2;

        jsonImage[i] = jsonImage[j];
        jsonImage[j] = temp3;

        jsonRating[i] = jsonRating[j];
        jsonRating[j] = temp4;


        jsonPrice[i] = jsonPrice[j];
        jsonPrice[j] = temp5;


        jsonUrl[i] = jsonUrl[j];
        jsonUrl[j] = temp6;


        jsonMapLat[i] = jsonMapLat[j];
        jsonMapLat[j] = temp7;


        jsonMapLong[i] = jsonMapLong[j];
        jsonMapLong[j] = temp8;


        jsonId[i] = jsonId[j];
        jsonId[j] = temp9;
        
        jsonAddress[i] = jsonAddress[j];
        jsonAddress[j] = temp10;
        
        jsonAddress2[i] = jsonAddress2[j];
        jsonAddress2[j] = temp11;
        
        jsonDist[i] = jsonDist[j];
        jsonDist[j] = temp12;
        
    }
    return true;
}

const updatePriceSym = (data) => {
    var res = "";
    switch (data) {
        case 4:
            res = "💰💰💰💰";
            break;
        case 3:
            res = "💰💰💰";
            break;
        case 2:
            res = "💰💰";
            break;
        case 1:
            res = "💰";
            break;
        default:
            res = "Unknown!"
    }
    return res;
}


yelp.search({term: food+'food', latitude: lat, longitude:long, open_now: true, radius: ''})
.catch(function (err) {
        console.log(err);
    })
    .then(function (data) {
        if (JSON.parse(data)['businesses'].length!=0) {
            return saveYelpSearchOutput(data);
        }
    })
    .then(function(data) {
        return shuffleYelp(data);
    })
    .then(function(data){
        console.log(data);
        if (data) {
            while (!jsonName[responseCounter] || !jsonImage[responseCounter] 
            || !jsonUrl[responseCounter] || !jsonNumber[responseCounter] || !jsonRating[responseCounter]
            || !jsonMapLat[responseCounter] || !jsonMapLong[responseCounter] 
            || jsonCat[responseCounter].indexOf("Supermarkets")!=-1 
            || jsonCat[responseCounter].indexOf("Convenience")!=-1 
            || jsonCat[responseCounter].indexOf("Grocery")!=-1
            || jsonCat[responseCounter].indexOf("Grocer")!=-1) {
                responseCounter += 1;
            }
            if (responseCounter >= jsonName.length) {
                responseCounter = 0;
                context.noRec=true;
                noRec = true;
                recGiven = false;
                delete context.recGiven;
                delete context.recError;
                return false;
            } else {
                return yelpBiz.business(jsonId[responseCounter]);
            }       
        } else {
            return false;
        }
    })
    .then(function(data){
        return saveYelpBusinessOutput(data);
    })
    .then(function(data){
        console.log(data);
        console.log(updatePriceSym("Not available"));
        console.log(jsonPrice);
    })                        
    .catch(function (err) {
        console.error(err);
    });
