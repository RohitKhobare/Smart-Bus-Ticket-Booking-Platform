import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default icon paths need adjustment when bundling
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface BusPosition {
  id: string;
  lat: number;
  lng: number;
}

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
const socket = io(API_URL);

export interface BusMapProps {
  /** only show this bus if provided */
  busId?: string;
}

export default function BusMap({ busId }: BusMapProps = {}) {
  const [buses, setBuses] = useState<BusPosition[]>([]);

  useEffect(() => {
    socket.on("busUpdates", (positions: BusPosition[]) => {
      if (busId) {
        setBuses(positions.filter((b) => b.id === busId));
      } else {
        setBuses(positions);
      }
    });

    return () => {
      socket.off("busUpdates");
    };
  }, [busId]);

  const defaultCenter: [number, number] = [23.03, 72.58];
  const center: [number, number] =
    buses.length > 0 ? [buses[0].lat, buses[0].lng] : defaultCenter;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {buses.map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lng]}>
            <Popup>Bus {bus.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
