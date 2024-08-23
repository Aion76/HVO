// OpenStreetMap Layer hinzufügen
var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Vektor-Layer für Markierungen erstellen
var vectorSource = new ol.source.Vector({
    features: [] // Hier werden die Features hinzugefügt
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

// Kartenansicht festlegen
var view = new ol.View({
    center: ol.proj.fromLonLat([10.4515, 51.1657]), // Deutschland Koordinaten
    zoom: 5.7 // Verändere den Zoom-Level, um mehr oder weniger Details anzuzeigen
});

// Karte erstellen
var map = new ol.Map({
    target: 'map',
    layers: [osmLayer, vectorLayer], // Füge den Vektor-Layer zur Karte hinzu
    view: view
});

// Popup-Overlay erstellen
var popupElement = document.getElementById('popup');
var popup = new ol.Overlay({
    element: popupElement,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, 0]
});
map.addOverlay(popup);

// Funktion zum Laden der JSON-Datei
function loadJSON(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Loaded JSON data:', data); // Debugging-Ausgabe

            // Füge die GeoJSON-Daten zur Vektorquelle hinzu
            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857' // OpenLayers Standardprojektion
            });
            vectorSource.addFeatures(features);
            console.log('Features after adding:', vectorSource.getFeatures());

            // Style für die Markierungen festlegen
            var markerStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'tankstelle.png', // Ersetze durch den Pfad zu deiner Markierungsgrafik
                    scale: 0.1 // Optional: Anpassen der Größe
                })
            });

            // Setze den Style für jedes Feature im Vektor-Layer
            vectorSource.getFeatures().forEach(function(feature) {
                feature.setStyle(markerStyle);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Pfad zur JSON-Datei
var jsonUrl = 'HVO.json'; // Ersetze durch den tatsächlichen Pfad zu deiner JSON-Datei
loadJSON(jsonUrl);

// Schließen-Button Event Listener hinzufügen
document.getElementById('popup-closer').addEventListener('click', function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Links
    popup.setPosition(undefined); // Schließt das Popup
    return false;
});

// Klick-Event hinzufügen
map.on('click', function(event) {
    var pixel = map.getPixelFromCoordinate(event.coordinate);
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
    });

    if (feature) {
        var coordinate = feature.getGeometry().getCoordinates();

        // Hole die verschiedenen Informationen aus dem Feature
        var properties = feature.getProperties();
        console.log('Feature properties:', properties); // Debugging-Ausgabe
        var name = properties.Name || 'Unbekannt';
        var address = properties.Adresse || 'Keine Adresse verfügbar';
        var fuelName = properties.Verkaufsname_Zapfs__ule || 'Nicht angegeben';

        var content = `<p><strong>Name:</strong> ${name}</p>
                       <p><strong>Adresse:</strong> ${address}</p>
                       <p><strong>Verkaufsname Zapfsäule:</strong> ${fuelName}</p>`;

        popup.setPosition(coordinate);
        document.getElementById('popup-content').innerHTML = content;
    } else {
        popup.setPosition(undefined);
    }
});
