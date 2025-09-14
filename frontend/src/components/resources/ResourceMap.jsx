// File: src/components/resources/ResourceMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ResourceMap({ resources }) {
  const center = resources.length
    ? [resources[0].location.lat, resources[0].location.lng]
    : [20.5937, 78.9629]; // Default to India center

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {resources.map((r) => (
          <Marker key={r.id} position={[r.location.lat, r.location.lng]}>
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.address}
              <br />
              Status: {r.availability_status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
