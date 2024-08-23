function waitForMapInitialization(callback) {
    if (window.map && window.vectorSource) {
        callback(); // Callback-Funktion aufrufen, wenn die Karte bereit ist
    } else {
        console.log("Warte auf die Initialisierung der Karte...");
        setTimeout(() => waitForMapInitialization(callback), 100); // Erneut nach 100 Millisekunden versuchen
    }
}

// Funktion zum Einrichten des Event-Listeners für Marker-Klicks
function setupMapClickListener() {
    waitForMapInitialization(() => {
        // Stellen Sie sicher, dass die Karte bereit ist, bevor Sie den Event-Listener hinzufügen
        window.map.on('singleclick', function (evt) {
            // Überprüfe, ob ein Feature (Marker) an der geklickten Position vorhanden ist
            const feature = window.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (feature) {
                // Extrahiere die Koordinaten des Markers
                const coordinates = feature.getGeometry().getCoordinates();
                
                // Zentriere die Karte auf den Marker und setze den Zoom-Level
                window.map.getView().animate({
                    center: coordinates,
                    duration: 500, // Dauer der Animation in Millisekunden
                    zoom: 10.5 // Setzt den Zoom-Level auf 9 
                });
            }
        });
    });
}

// Beispiel zum Aufrufen der Funktion (stelle sicher, dass deine Karte initialisiert ist)
setupMapClickListener();