import React, { useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, FullscreenControl, MapRef, Layer, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Star, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PopularTimesChart } from '@/components/parking/PopularTimesChart';

export interface LocationCoordinates {
    lat: number;
    lng: number;
}

export interface ParkingLocation {
    id: string;
    name: string;
    address: string;
    coordinates: LocationCoordinates;
    pricing: { hourly: number };
    rating: number;
    distance: number;
    availability: { total: number; available: number };
    amenities: { evCharging: boolean; covered: boolean; security: boolean };
}

interface MapboxMapProps {
    locations: ParkingLocation[];
    selectedLocationId: string | null;
    onLocationSelect: (id: string | null) => void;
    userLocation: [number, number] | null;
    onBook: (location: ParkingLocation) => void;
}

export function MapboxMap({ locations, selectedLocationId, onLocationSelect, userLocation, onBook }: MapboxMapProps) {
    const mapRef = useRef<MapRef>(null);
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    const isTokenValid = token && !token.includes('your-token');

    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    // Initial view state (Pune default)
    // Initial view state (Pune default)
    const initialViewState = {
        latitude: userLocation ? userLocation[0] : 18.5204,
        longitude: userLocation ? userLocation[1] : 73.8567,
        zoom: 15,
        pitch: 60,
        bearing: -17.6,
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
    };

    // Fly to user location when it becomes available or changes
    useEffect(() => {
        if (userLocation && mapRef.current) {
            mapRef.current.flyTo({
                center: [userLocation[1], userLocation[0]],
                zoom: 15,
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
    }, [userLocation]);

    if (!isTokenValid) {
        return (
            <div className="h-full w-full bg-muted flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-xl font-bold text-destructive mb-2">Mapbox Token Missing</h3>
                <p className="text-muted-foreground mb-4">
                    Please add your Mapbox public token to the .env file as <code className="bg-muted-foreground/20 p-1 rounded">VITE_MAPBOX_TOKEN</code>
                </p>
                <p className="text-xs text-muted-foreground">
                    Current value: {token || 'undefined'}
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11" // Switching to dark mode for "advanced" feel
                mapboxAccessToken={token}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                pitch={60}
                bearing={-17.6}
                maxPitch={85}
                onClick={(e) => {
                    // Basic click handling to clear selection if clicking map background
                    // Note: Marker clicks stop propagation usually
                    if (e.originalEvent.target === e.originalEvent.currentTarget) {
                        onLocationSelect(null);
                    }
                }}
            >
                <GeolocateControl position="top-right" trackUserLocation={true} showUserHeading={true} />
                <NavigationControl position="top-right" visualizePitch={true} />
                <FullscreenControl position="top-right" />

                {/* 3D Buildings Layer */}
                <Layer
                    id="3d-buildings"
                    source="composite"
                    source-layer="building"
                    filter={['==', 'extrude', 'true']}
                    type="fill-extrusion"
                    minzoom={14}
                    paint={{
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }}
                />

                {/* User Location */}
                {userLocation && (
                    <Marker longitude={userLocation[1]} latitude={userLocation[0]} anchor="center">
                        <div className="relative">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                            <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
                        </div>
                    </Marker>
                )}

                {/* Parking Locations */}
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        longitude={loc.coordinates.lng}
                        latitude={loc.coordinates.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onLocationSelect(loc.id);
                        }}
                    >
                        <div
                            className={`
                    flex flex-col items-center cursor-pointer transition-transform hover:scale-110
                    ${selectedLocationId === loc.id ? 'scale-125 z-10' : 'z-0'}
                `}
                        >
                            <div className={`
                    px-2 py-1 rounded-full text-xs font-bold shadow-md border-2 border-white mb-1
                    ${selectedLocationId === loc.id ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}
                `}>
                                ₹{loc.pricing.hourly}/hr
                            </div>
                            <MapPin
                                className={`
                        w-8 h-8 drop-shadow-md fill-current
                        ${selectedLocationId === loc.id ? 'text-indigo-600' : 'text-emerald-500'}
                    `}
                            />
                        </div>
                    </Marker>
                ))}

                {/* Popup for Selected Location */}
                {selectedLocation && (
                    <Popup
                        longitude={selectedLocation.coordinates.lng}
                        latitude={selectedLocation.coordinates.lat}
                        anchor="top"
                        closeOnClick={false}
                        onClose={() => onLocationSelect(null)}
                        offset={40}
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold">{selectedLocation.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{selectedLocation.address}</p>

                            <PopularTimesChart />

                            <Button size="sm" className="w-full mt-2" onClick={() => onBook(selectedLocation)}>
                                Book Now
                            </Button>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
