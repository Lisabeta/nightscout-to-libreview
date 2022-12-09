# Transfer Nightscout data to LibreView
Transfer your diabetes data from Nightscout to LibreView.

## Requirements
- git
- nodejs

## First use


Open command line in your favorite folder:
```
git clone https://github.com/AlexZamDia/nightscout-to-libreview
cd nightscout-to-libreview
npm install

copy config-example.txt as config.json
fill file with your personal data (username, password, phone details and libreview sn)
change libreview endpoint api URL to your region at libre.js

start:
specify date:
node . --year=2022 --month=10 --day=01
or specify delta:
node . --deltaday=-1
```

## Diff from main branch:
- commented out interactive part, only config.json required
- added Profile Switch events as Notes transfer to libreview
- added Exercise records transfer to libreview
- added hardwareDescriptor,osVersion,hardwareName as config params

## Todo
- Change 1/3 data point transfer to rouding. Sometimes we get less that 96 datapoints.
- many many testing!
- better error handling
- clean up entry point
- clean up user input
- add frequent unscheduledContinuousGlucoseEntries
- add basal insulin?!?
- different libreview api endpoints
