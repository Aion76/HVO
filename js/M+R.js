// Funktion zum Hinzufügen eines Event-Listeners für Marker-Klicks
function setupMapClickListener() {
    waitForMapInitialization(() => {
        window.map.on('singleclick', function (evt) {
            // Überprüfe, ob ein Feature (Marker) an der geklickten Position vorhanden ist
            const feature = window.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (feature) {
                // Extrahiere die Adresse des Markers aus den GeoJSON-Daten
                const address = feature.get('Adresse'); // Beachte: der Schlüssel sollte 'Adresse' sein, entsprechend deinem JSON
                const destinationInput = document.getElementById('destination'); // Hole das Zieladresse-Feld

                // Setze den Wert des Zieladresse-Feldes auf die Adresse des Markers
                if (destinationInput && address) {
                    destinationInput.value = address; // Setzt die Adresse als Zieladresse
                }
            }
        });
    });
}

// Beispiel zum Aufrufen der Funktion (stelle sicher, dass deine Karte und Vector-Source initialisiert sind)
setupMapClickListener();