var NodeGeocoder = require('node-geocoder');
var fs = require('fs');


var options = {
  provider: 'google',
};

var geocoder = NodeGeocoder(options);
var allData = JSON.parse(fs.readFileSync('acopios.json', 'utf8'));
var noGeoposition = [];

var noGeopositionCount = 0;
var totalCount = 0;
var foundCount = 0;

allData.forEach(function(entry, position) {
  if (!entry.geopos) {
    noGeopositionCount++;
    setGeoposition(entry, position);
  }
});


function setGeoposition(entry, position) {

  if (!entry.direccion) {
    //Sin direccion
    allData[position].geopos = {
      lat : 0,
      lng : 0
    };

    finishScript();
    return;
  }

  console.log('Buscando posicion para: ', entry.direccion);

  geocoder.geocode(entry.direccion, function(err, res) {
    if (!res) {
      console.log('=======> Sin direccion');
      allData[position].geopos = {
        lat : 0,
        lng : 0
      };
      finishScript();
    } else if (res[0]) {
      foundCount++;
      console.log('Direccion encontrada', res[0]);
      allData[position].geopos = {
        lat : res[0].latitude,
        lng : res[0].longitude
      };
      finishScript();
    }

  });

}


function finishScript() {
  totalCount++;

  console.log('Total count ' + totalCount + '  == ' + noGeopositionCount);

  if (totalCount == noGeopositionCount) {
    console.log('All data size: ', allData.length);
    console.log('No geoposition: ', noGeopositionCount);
    console.log('Found geoposition: ', foundCount);
    console.log('******************************************');
    fs.writeFile("./final.json", JSON.stringify(allData), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was created!");
    });
  }
}
