// Zugriff auf das HTML-Element für die Anzeige der Geolocation-Daten
const x = document.getElementById('demo');

// Funktion, die darauf wartet, dass die Karte und die Vector-Quelle initialisiert sind, bevor der Callback ausgeführt wird
function waitForMapInitialization(callback) {
    if (window.map && window.vectorSource) {
        callback(); // Callback-Funktion aufrufen, wenn die Karte bereit ist
    } else {
        console.log("Warte auf die Initialisierung der Karte...");
        setTimeout(() => waitForMapInitialization(callback), 100); // Erneut nach 100 Millisekunden versuchen
    }
}

// Funktion zum Abrufen der aktuellen Geolocation des Benutzers
function getLocation() {
    if (navigator.geolocation) {
        // Warten, bis die Karte initialisiert ist, und dann die Geolocation des Benutzers abrufen
        waitForMapInitialization(() => {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        });
    } else {
        // Nachricht anzeigen, wenn Geolocation im Browser nicht unterstützt wird
        x.innerHTML = "Geolocation is not supported by this browser.";
        x.style.display = 'block'; // Zeigt das Element an, falls Geolocation nicht unterstützt wird
    }
}

// Funktion zur Verarbeitung der Geolocation-Daten und zum Aktualisieren der Karte
function showPosition(position) {
    const latitude = position.coords.latitude; // Breitengrad des Benutzers
    const longitude = position.coords.longitude; // Längengrad des Benutzers
    
    // Zeigt das #demo-Element an und aktualisiert den Inhalt mit den Geolocation-Daten
    x.style.display = 'block'; 
    x.innerHTML = `Breitengrad: ${latitude}<br>Längengrad: ${longitude}`;

    if (window.map && window.vectorSource) {
        const coordinate = ol.proj.fromLonLat([longitude, latitude]); // Koordinaten in das OpenLayers-Format konvertieren

        // Karte auf die aktuelle Position zentrieren und Zoom-Level anpassen
        window.map.getView().setCenter(coordinate);
        window.map.getView().setZoom(9); // Hier wird der Zoom-Level auf 9 gesetzt, ändere dies nach Bedarf

        // Marker für die aktuelle Position hinzufügen
        addMarker(coordinate);
    } else {
        console.error("Die Karte oder die Vector-Quelle ist nicht verfügbar."); // Fehlermeldung in der Konsole ausgeben
    }
}

// Funktion zum Hinzufügen eines Markers zur Karte
function addMarker(coordinate) {
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(coordinate) // Erstelle einen Marker an den angegebenen Koordinaten
    });

    marker.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1], // Ankerpunkt des Icons (die Stelle, an der es auf der Karte positioniert wird)
            anchorXUnits: 'fraction', // Einheit des Ankerpunktes (Bruchteil des Icons)
            anchorYUnits: 'fraction',
            src: 'Png/DU.png', // Pfad zum Bild des Markers
            scale: 0.09 // Größe des Icons anpassen
        })
    }));

    // Füge den Marker zur Vector-Quelle hinzu, ohne alte Marker zu entfernen
    window.vectorSource.addFeature(marker);
}

// Funktion zur Behandlung von Fehlern bei der Geolocation-Anfrage
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."; // Benutzer hat den Zugriff auf Geolocation verweigert
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."; // Standortinformationen sind nicht verfügbar
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."; // Die Anfrage zur Standortbestimmung ist abgelaufen
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."; // Ein unbekannter Fehler ist aufgetreten
            break;
    }
    x.style.display = 'block'; // Zeigt das Element bei einem Fehler an
}

// Event-Listener für den Button, der die Geolocation-Funktion auslöst
document.getElementById('get-location').addEventListener('click', getLocation);