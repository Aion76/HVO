document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('route-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Verhindert das Standard-Formularverhalten

        // Adressen aus den Eingabefeldern holen
        var origin = encodeURIComponent(document.getElementById('origin').value);
        var destination = encodeURIComponent(document.getElementById('destination').value);

        // Google Maps Routenplaner-Link erstellen
        var mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

        // Benutzer zur Google Maps Routenplanungsseite weiterleiten
        window.location.href = mapsLink;
    });
});