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

if (!fs.existsSync(CONFIG_NAME)) {
  fs.writeFileSync(CONFIG_NAME, JSON.stringify(DEFAULT_CONFIG));
}

const rawConfig = fs.readFileSync(CONFIG_NAME);
let config = JSON.parse(rawConfig);
  
/**/
var deltaday = 1;
var d = new Date();
d.setDate(d.getDate() - deltaday);

fromyear = d.getFullYear();
frommonth = d.getMonth() + 1; //month starts from 0
fromday = d.getDate();	
	
var tod = new Date();
toyear = tod.getFullYear();
tomonth = tod.getMonth() + 1; //month starts from 0
today = tod.getDate();	
	
const fromDate = dayjs(`${fromyear}-${frommonth}-${fromday}`).format('YYYY-MM-DD');
const toDate = dayjs(`${toyear}-${tomonth}-${today}`).format('YYYY-MM-DD');
console.log("Upload datad from " + fromDate +  " to " + toDate);
/**/

  (async () => {
    
    console.log('transfer time span', fromDate.gray, toDate.gray);

    const glucoseEntries = await nightscout.getNightscoutGlucoseEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
    const foodEntries = await nightscout.getNightscoutFoodEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);
    const insulinEntries = await nightscout.getNightscoutInsulinEntries(config.nightscoutUrl, config.nightscoutToken, fromDate, toDate);

    if (glucoseEntries.length > 0 || foodEntries.length > 0 || insulinEntries.length > 0) {
      const auth = await libre.authLibreView(config.libreUsername, config.librePassword, config.libreDevice, result.libreResetDevice);
      if (!!!auth) {
        console.log('libre auth failed!'.red);

        return;
      }

      await libre.transferLibreView(config.libreDevice, auth, glucoseEntries, foodEntries, insulinEntries);
    }
  })();
});

function onErr(err) {
  console.log(err);
  return 1;
}
