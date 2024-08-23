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

// Event-Listener, der aufgerufen wird, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    initializeMap(); // Initialisiert die Karte
    loadJSON('DataJson/HVO.json', window.vectorSource); // Lädt Daten aus der JSON-Datei und fügt sie zur Vector-Source hinzu
    setupPopup(window.map); // Initialisiert das Popup-Handling auf der Karte
});
