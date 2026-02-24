"use client";

import { MapContainer, Marker, TileLayer, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function ClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export function MapPicker({
  lat,
  lon,
  radius,
  onChange
}: {
  lat: number;
  lon: number;
  radius?: number;
  onChange: (lat: number, lon: number) => void;
}) {
  const position = useMemo(() => ({ lat, lng: lon }), [lat, lon]);

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom className="rounded-md">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const p = (e.target as L.Marker).getLatLng();
            onChange(p.lat, p.lng);
          }
        }}
      />
      <ClickHandler onPick={onChange} />
      {radius ? <Circle center={position} radius={radius} pathOptions={{ color: "#2563eb" }} /> : null}
    </MapContainer>
  );
}
