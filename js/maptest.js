// Funktion zur Initialisierung der Karte
function initializeMap() {
    // Erstellen einer OSM (OpenStreetMap) Tile-Layer für die Karte
    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM() // Definiert die Quelle der OSM-Daten
    });

    // Erstellen einer Vector-Source für das Hinzufügen von Features wie Marker
    var vectorSource = new ol.source.Vector({
        features: [] // Initialisiert mit einer leeren Liste von Features
    });

    // Erstellen einer Vector-Layer, die die Features von der Vector-Source verwendet
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource // Verbindet die Layer mit der Vector-Source
    });

    // Erstellen einer View für die Karte
    var view = new ol.View({
        center: ol.proj.fromLonLat([10.4515, 51.1657]), // Setzt den anfänglichen Mittelpunkt auf Deutschland-Koordinaten
        zoom: 5.7, // Setzt den anfänglichen Zoom-Level
        extent: ol.proj.transformExtent([-30, 34, 50, 72], 'EPSG:4326', 'EPSG:3857') // Extent für Europa
    });

    // Erstellen der Karte
    var map = new ol.Map({
        target: 'map', // Der ID des HTML-Elements, in dem die Karte angezeigt wird
        layers: [osmLayer, vectorLayer], // Hinzufügen der OSM- und Vector-Layers zur Karte
        view: view // Setzt die View der Karte
    });

    // Exportiere die Karte und die Vector-Source als globale Variablen
    window.map = map; // Macht die Karte global verfügbar
    window.vectorSource = vectorSource; // Macht die Vector-Source global verfügbar
}

// Funktion zum Laden von JSON-Daten und Hinzufügen zu einer Vector-Source
function loadJSON(url, vectorSource) {
    // Verwende die Fetch API, um die JSON-Daten von der angegebenen URL abzurufen
    fetch(url)
        .then(response => {
            // Überprüfe, ob die Antwort erfolgreich war
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            // Konvertiere die Antwort in ein JSON-Objekt
            return response.json();
        })
        .then(data => {
            // Gibt die geladenen JSON-Daten in der Konsole aus
            console.log('Loaded JSON data:', data);

            // Konvertiere die Daten in OpenLayers Features
            var features = data.map(item => {
                // Erstelle ein OpenLayers Feature für jeden Eintrag in der JSON-Datei
                return new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([item.longitude, item.latitude])
                    ),
                    name: item.name // oder andere relevante Daten, falls vorhanden
                });
            });

            // Füge die konvertierten Features zur Vector-Source hinzu
            vectorSource.addFeatures(features);

            // Gibt die Features der Vector-Source nach dem Hinzufügen in der Konsole aus
            console.log('Features after adding:', vectorSource.getFeatures());

            // Definiere das Styling für die Marker
            var markerStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1], // Setze den Anker des Icons auf die untere Mitte des Bildes
                    anchorXUnits: 'fraction', // Ankerkoordinaten als Bruchteil der Icon-Breite
                    anchorYUnits: 'fraction', // Ankerkoordinaten als Bruchteil der Icon-Höhe
                    src: 'Png/tankstelle.png', // Quelle des Icons
                    scale: 0.1 // Skaliere das Icon auf 10% seiner Originalgröße
                })
            });

            // Wende das definierte Marker-Styling auf jedes Feature in der Vector-Source an
            vectorSource.getFeatures().forEach(function(feature) {
                feature.setStyle(markerStyle);
            });
        })
        .catch(error => {
            // Gibt eine Fehlermeldung aus, falls beim Laden oder Verarbeiten der JSON-Daten ein Fehler auftritt
            console.error('Error loading JSON:', error);
        });
}

// Funktion zum Einrichten des Popup-Handlers
function setupPopup(map) {
    // Erstelle ein Overlay für das Popup
    var popup = new ol.Overlay({
        element: document.getElementById('popup'), // HTML-Element für das Popup
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50]
    });
    map.addOverlay(popup);

    // Füge einen Event-Listener für Klicks auf der Karte hinzu
    map.on('singleclick', function (evt) {
        var coordinate = evt.coordinate;
        var features = map.getFeaturesAtPixel(evt.pixel);
        var feature = features[0];

        if (feature) {
            // Zeige das Popup bei den Koordinaten des Klicks
            popup.setPosition(coordinate);
            var content = '<p>' + feature.get('name') + '</p>'; // Beispielinhalt
            document.getElementById('popup-content').innerHTML = content;
        } else {
            // Verstecke das Popup, wenn kein Feature angeklickt wurde
            popup.setPosition(undefined);
        }
    });
}

// Event-Listener, der aufgerufen wird, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    initializeMap(); // Initialisiert die Karte
    loadJSON('DataJson/HVO.json', window.vectorSource); // Lädt Daten aus der JSON-Datei und fügt sie zur Vector-Source hinzu
    setupPopup(window.map); // Initialisiert das Popup-Handling auf der Karte
});