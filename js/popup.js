// Funktion zum Einrichten des Popups auf der Karte
function setupPopup(map) {
    // Zugriff auf das Popup-Element im HTML
    var popupElement = document.getElementById('popup-container');

    // Erstellen eines neuen Overlays für das Popup
    var popup = new ol.Overlay({
        element: popupElement, // Das HTML-Element, das als Popup verwendet wird
        positioning: 'bottom-center', // Positionierung des Popups relativ zur Koordinate
        stopEvent: false, // Verhindert, dass das Klick-Ereignis durch das Popup gestoppt wird
        offset: [0, 0] // Offset des Popups relativ zur Koordinate
    });

    // Hinzufügen des Popups zur Karte
    map.addOverlay(popup);

    // Event-Listener für den Schließen-Button im Popup
    document.getElementById('popup-closer').addEventListener('click', function(event) {
        event.preventDefault(); // Verhindert die Standardaktion des Links (Seite neu laden)
        popup.setPosition(undefined); // Setzt die Position des Popups auf undefined (versteckt es)
        popupElement.style.display = 'none'; // Versteckt das Popup-Element
        return false; // Verhindert, dass der Link weitere Aktionen ausführt
    });

    // Event-Listener für Klicks auf die Karte
    map.on('click', function(event) {
        // Ermittelt den Pixel auf der Karte, der dem Klick entspricht
        var pixel = map.getPixelFromCoordinate(event.coordinate);
        
        // Überprüft, ob sich an diesem Pixel ein Feature befindet
        var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });

        if (feature) {
            // Wenn ein Feature gefunden wurde, erhält es seine Koordinaten und Eigenschaften
            var coordinate = feature.getGeometry().getCoordinates();
            var properties = feature.getProperties();
            var name = properties.Name || 'Unbekannt'; // Wenn der Name fehlt, wird 'Unbekannt' verwendet
            var address = properties.Adresse || 'Keine Adresse verfügbar'; // Wenn die Adresse fehlt
            var fuelName = properties.Verkaufsname_Zapfs__ule || 'Nicht angegeben'; // Verkaufsname der Zapfsäule

            // Erstellen des Inhalts für das Popup
            var content = `<p><strong>Name:</strong> ${name}</p>
                           <p><strong>Adresse:</strong> ${address}</p>
                           <p><strong>Verkaufsname Zapfsäule:</strong> ${fuelName}</p>`;

            // Setzen der Position des Popups auf die Koordinaten des Features
            popup.setPosition(coordinate);
            // Setzen des Inhalts des Popups
            document.getElementById('popup-content').innerHTML = content;
            // Anzeigen des Popups
            popupElement.style.display = 'block';
        } else {
            // Wenn kein Feature gefunden wurde, verstecke das Popup
            popupElement.style.display = 'none';
        }
    });
}

// Funktion zum Schließen des Popups
function closePopup() {
    const popupContainer = document.getElementById('popup-container');
    if (popupContainer) {
        popupContainer.style.display = 'none'; // Versteckt das Popup
    }
}

// Hinzufügen eines globalen Event-Listeners für die Esc-Taste
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.preventDefault(); // Verhindert die Standardaktion der Esc-Taste (z.B. Browser zurück)
        closePopup(); // Funktion zum Schließen des Popups aufrufen
    }
});