// Funktion zum Laden von GeoJSON-Daten und Hinzufügen zu einer Vector-Source
function loadJSON(url, vectorSource) {
    // Verwende die Fetch API, um die GeoJSON-Daten von der angegebenen URL abzurufen
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

            // Erstelle eine Instanz des GeoJSON-Formats und konvertiere die JSON-Daten in OpenLayers Features
            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857' // Setze die Projektion der Features auf EPSG:3857 (Web Mercator)
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
