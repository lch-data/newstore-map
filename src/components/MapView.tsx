"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Store } from "@/lib/stores";
import { useRouter } from "next/navigation";

const icon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ stores }: { stores: Store[] }) {
  const router = useRouter();

  return (
    <div className="card">
      <h2>지도</h2>
      <MapContainer center={[37.5665, 126.978]} zoom={12} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stores.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
            <Popup>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{s.address}</div>
              <button
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #333",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/stores/${s.id}`)}
              >
                상세보기
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
