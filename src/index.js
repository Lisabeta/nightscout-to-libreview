//Alex: SSL ignorance from lets encrypt it
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const dayjs = require('dayjs');
const uuid = require('uuid');
const colors = require('colors');
const prompt = require('prompt');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/../config.env' });

const libre = require('./functions/libre');
const nightscout = require('./functions/nightscout');

const CONFIG_NAME = 'config.json';
const DEFAULT_CONFIG = {
};

//Standard method
//const myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
console.log('year: ', argv.year);
console.log('month: ', argv.month);
console.log('day: ', argv.day);

if (between(argv.year,2015,2999) && between(argv.month,1,12) && between(argv.day,1,31)) {
  year = argv.year;
  month = argv.month;
  day = argv.day;
} else {
  return onErr('year_month_day are NOT between correct values');
}
console.log('year: ', year);
console.log('month: ', month);
console.log('day: ', day);


if (!fs.existsSync(CONFIG_NAME)) {
  fs.writeFileSync(CONFIG_NAME, JSON.stringify(DEFAULT_CONFIG));
}

const rawConfig = fs.readFileSync(CONFIG_NAME);
let config = JSON.parse(rawConfig);


/*
prompt.get([{
  name: 'nightscoutUrl',
  description: 'please enter your nightscout url',
  required: true,
  default: config.nightscoutUrl
}, {
  name: 'nightscoutToken',
  description: 'please enter your nightscout token',
  required: false,
  default: config.nightscoutToken
}, {
  name: 'libreUsername',
  description: 'please enter your libreview username',
  required: true,
  default: config.libreUsername
}, {
  name: 'librePassword',
  description: 'please enter your libreview password',
  required: true,
  default: config.librePassword
}, {
  name: 'year',
  description: 'please enter the year you want to transfer to libreview',
  required: true,
  type: 'number',
  //default: new Date().getFullYear()
  default: year
}, {
  name: 'month',
  description: 'please enter the month you want to transfer to libreview',
  required: true,
  type: 'number',
  //default: new Date().getMonth()
  default: month
}, {
  name: 'day',
  description: 'please enter the DAY you want to transfer to libreview',
  required: true,
  type: 'number',
  //default: new Date().getDay()
  default: day
}, {
  name: 'libreResetDevice',
  description: 'if you have problems with your transfer, recreate your device id',
  required: true,
  type: 'boolean',
  default: false
}], function (err, result) {
  if (err) {
    return onErr(err);
  }


  config = Object.assign({}, config, {
    nightscoutUrl: result.nightscoutUrl,
    nightscoutToken: result.nightscoutToken,
    libreUsername: result.libreUsername,
    librePassword: result.librePassword,
    libreDevice: (result.libreResetDevice || !!!config.libreDevice) ? uuid.v4().toUpperCase() : config.libreDevice
  });

  fs.writeFileSync(CONFIG_NAME, JSON.stringify(config));
*/


  (async () => {
    //const fromDate = dayjs(`${result.year}-${result.month}-01`).format('YYYY-MM-DD');
    //const toDate = dayjs(`${result.year}-${result.month + 1}-01`).format('YYYY-MM-DD');
    //const fromDate = dayjs(`${result.year}-${result.month}-${result.day}`).format('YYYY-MM-DD');
    //const toDate = dayjs(`${result.year}-${result.month}-${result.day + 1}`).format('YYYY-MM-DD');
    const fromDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
    const toDate = dayjs(`${year}-${month}-${day + 1}`).format('YYYY-MM-DD');

    console.log('transfer time span', fromDate.gray, toDate.gray);

    const glucoseEntries = await nightscout.getNightscoutGlucoseEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
    const foodEntries = await nightscout.getNightscoutFoodEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
    const insulinEntries = await nightscout.getNightscoutInsulinEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
    const genericEntries = await nightscout.getNightscoutGenericEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
	console.log("RESULT===");
	console.dir(genericEntries);

    if (glucoseEntries.length > 0 || foodEntries.length > 0 || insulinEntries.length > 0 || genericEntries.lenght >0) {
      //const auth = await libre.authLibreView(config.libreUsername, config.librePassword, config.libreDevice, result.libreResetDevice);
      const auth = await libre.authLibreView(config.libreUsername, config.librePassword, config.libreDevice, false);
      if (!!!auth) {
        console.log('libre auth failed!'.red);

        return;
      }
     //console.log(glucoseEntries);
     await libre.transferLibreView(config.libreDevice, auth, glucoseEntries, foodEntries, insulinEntries, genericEntries);
    }

  })();

//commented out fin of prompt.get
//});


//=========================

function onErr(err) {
  console.log(err);
  return 1;
}

function between(value,first,last) {
 let lower = Math.min(first,last) , upper = Math.max(first,last);
 return value >= lower &&  value <= upper ;
}
