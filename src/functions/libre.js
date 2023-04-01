const axios = require('axios');
const colors = require('colors');

const authLibreView = async function (username, password, device, setDevice) {
  console.log('authLibreView'.blue);
  const data = {
    DeviceId: device,
    GatewayType: "FSLibreLink.iOS",
    SetDevice: setDevice,
    UserName: username,
    Domain: "Libreview",
    Password: password
  };
 
console.log('data', data);

  const response = await axios.default.post('https://api.libreview.ru/lsl/api/nisperson/getauthentication', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('authLibreView, response', response.data.gray);

  if (response.data.status !== 0) {
    return;
  }

  return response.data.result.UserToken;
}

const transferLibreView = async function (device, hardwareDescriptor0, osVersion0, hardwareName0, token, glucoseEntries, foodEntries, insulinEntries, genericEntries) {
  console.log('transferLibreView'.blue);

  console.log('glucose entries', (glucoseEntries || []).length.toString().gray);
  console.log('food entries', (foodEntries || []).length.toString().gray);
  console.log('insulin entries', (insulinEntries || []).length.toString().gray);

  const data = {
    UserToken: token,
    GatewayType: "FSLibreLink.Android",
    DeviceData: {
//My
      deviceSettings: {
        factoryConfig: {
          UOM: "mmol/L"
        },
        firmwareVersion: "2.8.2",
        miscellaneous: {
          selectedLanguage: "ru_RU",
          valueGlucoseTargetRangeLowInMgPerDl: 70,
          valueGlucoseTargetRangeHighInMgPerDl: 180,
          selectedTimeFormat: "24hr",
          selectedCarbType: "grams of carbs"
        }
      },
//endMy
      header: {
        device: {
          hardwareDescriptor: hardwareDescriptor0,
          osVersion: osVersion0,
          modelName: "com.freestylelibre.app.ru",
          osType: "Android",
          uniqueIdentifier: device,
          hardwareName: hardwareName0
        }
      },
      measurementLog: {
        capabilities: [
          "scheduledContinuousGlucose",
          "unscheduledContinuousGlucose",
          "bloodGlucose",
          "insulin",
          "food",
          "generic-com.abbottdiabetescare.informatics.exercise",
          "generic-com.abbottdiabetescare.informatics.customnote",
          "generic-com.abbottdiabetescare.informatics.ondemandalarm.low",
          "generic-com.abbottdiabetescare.informatics.ondemandalarm.high",
          "generic-com.abbottdiabetescare.informatics.ondemandalarm.projectedlow",
          "generic-com.abbottdiabetescare.informatics.ondemandalarm.projectedhigh",
          "generic-com.abbottdiabetescare.informatics.sensorstart",
          "generic-com.abbottdiabetescare.informatics.error",
          "generic-com.abbottdiabetescare.informatics.isfGlucoseAlarm",
          "generic-com.abbottdiabetescare.informatics.alarmSetting"
        ],
        bloodGlucoseEntries: [],
        genericEntries: genericEntries || [],
        ketoneEntries: [],
        scheduledContinuousGlucoseEntries: glucoseEntries || [],
        insulinEntries: insulinEntries || [],
        foodEntries: foodEntries || [],
        unscheduledContinuousGlucoseEntries: []
      }
    },
    Domain: "Libreview"
  };

  console.log(genericEntries);
  
  const response = await axios.default.post('https://api.libreview.ru/lsl/api/measurements', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('transferLibreView, response', response.data.gray);
};

exports.authLibreView = authLibreView;
exports.transferLibreView = transferLibreView;
