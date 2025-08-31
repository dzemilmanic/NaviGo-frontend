import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {useState} from 'React';
const LocationPicker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  // Klik na mapu
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onSelect({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });
      }
    });
    return null;
  };

  return (
    <MapContainer center={[44.0, 17.0]} zoom={8} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {position && <Marker position={position} />}
    </MapContainer>
  );
};
export default LocationPicker;