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

create config.json file with configuration
change libreview endpoint api URL to your region

start:
specify date:
node . --year=2022 --month=10 --day=01
or specify delta:
node . --deltaday=-1
```

## Future use

Open command line in your favorite folder:
```
cd nightscout-to-libreview
npm start
```

## Diff from main branch:
- commented out interactive part
- added notes transfer to libreview
- added exercise notes to libreview

## Todo
- many many testing!
- better error handling
- clean up entry point
- clean up user input
- add frequent unscheduledContinuousGlucoseEntries
- add basal insulin?!?
- different libreview api endpoints
