// Funktion zur Verarbeitung der Geolocation-Daten und zum Aktualisieren der Karte
function showPosition(position) {
    const latitude = position.coords.latitude; // Breitengrad des Benutzers
    const longitude = position.coords.longitude; // Längengrad des Benutzers
    
    // Zeigt das #demo-Element an und aktualisiert den Inhalt mit den Geolocation-Daten
    x.style.display = 'block'; 
    x.innerHTML = `Breitengrad: ${latitude}<br>Längengrad: ${longitude}`;

    // Aktualisiert das Startadressenfeld mit den Koordinaten
    const originInput = document.getElementById('origin');
    if (originInput) {
        originInput.value = `${latitude}, ${longitude}`; // Setzt die Koordinaten als Startadresse
    }

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