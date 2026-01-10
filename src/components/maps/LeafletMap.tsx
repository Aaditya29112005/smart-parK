import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { PopularTimesChart } from '@/components/parking/PopularTimesChart';
import { ParkingLocation } from './MapboxMap'; // Re-using interface

// Fix for default marker icons in React Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom parking icon
const parkingIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom selected icon
const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// User location icon
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface LeafletMapProps {
    locations: ParkingLocation[];
    selectedLocationId: string | null;
    onLocationSelect: (id: string | null) => void;
    userLocation: [number, number] | null;
    onBook: (location: ParkingLocation) => void;
    showHeatmap?: boolean;
    demandWeights?: Record<string, number>;
}

// Component to handle map movement
function MapUpdater({ center, zoom }: { center: [number, number] | null, zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                duration: 2
            });
        }
    }, [center, zoom, map]);
    return null;
}

export function LeafletMap({
    locations,
    selectedLocationId,
    onLocationSelect,
    userLocation,
    onBook,
    showHeatmap = false,
    demandWeights = {}
}: LeafletMapProps) {
    const defaultPosition: [number, number] = [18.5204, 73.8567]; // Pune
    const center = userLocation ? [userLocation[0], userLocation[1]] as [number, number] : defaultPosition;

    // Find selected location for path
    const selectedLocProxy = locations.find(l => l.id === selectedLocationId);
    const aiPath = userLocation && selectedLocProxy ? [
        [userLocation[0], userLocation[1]],
        // Mock intermediate point for "curve"
        [
            (userLocation[0] + selectedLocProxy.coordinates.lat) / 2 + 0.001,
            (userLocation[1] + selectedLocProxy.coordinates.lng) / 2 - 0.001
        ],
        [selectedLocProxy.coordinates.lat, selectedLocProxy.coordinates.lng]
    ] as [number, number][] : null;


    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={center}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <MapUpdater
                    center={
                        selectedLocationId
                            ? [
                                locations.find(l => l.id === selectedLocationId)?.coordinates.lat || center[0],
                                locations.find(l => l.id === selectedLocationId)?.coordinates.lng || center[1]
                            ] as [number, number]
                            : (userLocation ? [userLocation[0], userLocation[1]] : null)
                    }
                    zoom={selectedLocationId ? 17 : 15}
                />

                {/* Dark Matter Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* AI Navigation Path */}
                {aiPath && (
                    <Polyline
                        positions={aiPath}
                        pathOptions={{ className: 'ai-path-glow' }}
                    />
                )}

                {/* User Location */}
                {userLocation && (
                    <Marker position={[userLocation[0], userLocation[1]]} icon={userIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* Heatmap Layer */}
                {showHeatmap && locations.map(loc => {
                    const weight = demandWeights[loc.id] || 0.1;
                    return (
                        <React.Fragment key={`heatmap-${loc.id}`}>
                            <Circle
                                center={[loc.coordinates.lat, loc.coordinates.lng]}
                                radius={200 * weight + 50}
                                pathOptions={{
                                    fillColor: weight > 0.7 ? '#ef4444' : weight > 0.4 ? '#f97316' : '#eab308',
                                    fillOpacity: 0.2,
                                    stroke: false
                                }}
                            />
                            <Circle
                                center={[loc.coordinates.lat, loc.coordinates.lng]}
                                radius={100 * weight + 20}
                                pathOptions={{
                                    fillColor: weight > 0.7 ? '#ef4444' : weight > 0.4 ? '#f97316' : '#eab308',
                                    fillOpacity: 0.4,
                                    stroke: false
                                }}
                            />
                        </React.Fragment>
                    );
                })}

                {/* Parking Locations */}
                {locations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={[loc.coordinates.lat, loc.coordinates.lng]}
                        icon={selectedLocationId === loc.id ? selectedIcon : parkingIcon}
                        eventHandlers={{
                            click: () => onLocationSelect(loc.id),
                        }}
                    >
                        {selectedLocationId === loc.id && (
                            <Popup
                                eventHandlers={{
                                    remove: () => onLocationSelect(null)
                                }}
                                className="custom-popup"
                            >
                                <div className="min-w-[200px] p-1">
                                    <h3 className="font-bold text-base">{loc.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{loc.address}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-primary">₹{loc.pricing.hourly}/hr</span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{loc.availability.available} spots</span>
                                    </div>

                                    <PopularTimesChart />

                                    <Button
                                        size="sm"
                                        className="w-full mt-3"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent map click
                                            onBook(loc);
                                        }}
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
