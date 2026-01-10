import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, Navigation, Zap, Shield, Accessibility } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MOCK_PARKING_LOCATIONS, ParkingLocation } from '@/data/parkingLocations';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function AdvancedSearchPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

    // Filters
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [maxDistance, setMaxDistance] = useState(10);
    const [filters, setFilters] = useState({
        evCharging: false,
        covered: false,
        security: false,
        wheelchairAccess: false,
        valet: false,
        overnight: false,
    });

    // Filter and sort locations
    const filteredLocations = useMemo(() => {
        const results = MOCK_PARKING_LOCATIONS.filter((loc) => {
            // Search query
            if (searchQuery && !loc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !loc.address.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Price filter
            if (loc.pricing.hourly < priceRange[0] || loc.pricing.hourly > priceRange[1]) {
                return false;
            }

            // Distance filter
            if (loc.distance > maxDistance) {
                return false;
            }

            // Amenity filters
            if (filters.evCharging && !loc.amenities.evCharging) return false;
            if (filters.covered && !loc.amenities.covered) return false;
            if (filters.security && !loc.amenities.security) return false;
            if (filters.wheelchairAccess && !loc.amenities.wheelchairAccess) return false;
            if (filters.valet && !loc.amenities.valet) return false;
            if (filters.overnight && !loc.amenities.overnight) return false;

            return true;
        });

        // Sort
        results.sort((a, b) => {
            if (sortBy === 'distance') return a.distance - b.distance;
            if (sortBy === 'price') return a.pricing.hourly - b.pricing.hourly;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });

        return results;
    }, [searchQuery, priceRange, maxDistance, filters, sortBy]);

    const handleLocationSelect = (location: ParkingLocation) => {
        // Navigate to booking with location data
        navigate('/slots', { state: { location } });
    };

    return (
        <MobileLayout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-6 pb-8">
                    <h1 className="text-2xl font-bold mb-4">Find Parking</h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                        <Input
                            placeholder="Search by location, landmark, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                        />
                    </div>

                    {/* Filter Toggle & Sort */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant={showFilters ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex-1"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm"
                        >
                            <option value="distance">Distance</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <Card className="m-4 p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}/hr
                            </label>
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                min={0}
                                max={100}
                                step={5}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Max Distance: {maxDistance} km
                            </label>
                            <Slider
                                value={[maxDistance]}
                                onValueChange={(val) => setMaxDistance(val[0])}
                                min={1}
                                max={20}
                                step={1}
                                className="mt-2"
                            />
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <h3 className="font-semibold text-sm">Amenities</h3>
                            {Object.entries(filters).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-sm capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <Switch
                                        checked={value}
                                        onCheckedChange={(checked) => setFilters({ ...filters, [key]: checked })}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Results */}
                <div className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {filteredLocations.length} locations found
                    </p>

                    {filteredLocations.map((location) => (
                        <Card
                            key={location.id}
                            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleLocationSelect(location)}
                        >
                            <div className="flex gap-3">
                                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-muted-foreground" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-bold">{location.name}</h3>
                                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                                            <Star className="w-3 h-3 fill-current" />
                                            {location.rating}
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-2">{location.address}</p>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                        <span className="flex items-center gap-1">
                                            <Navigation className="w-3 h-3" />
                                            {location.distance} km
                                        </span>
                                        <span className="font-bold text-primary">₹{location.pricing.hourly}/hr</span>
                                        <span className={location.availability.available > 20 ? 'text-green-600' : 'text-orange-600'}>
                                            {location.availability.available} spots
                                        </span>
                                    </div>

                                    <div className="flex gap-1 flex-wrap">
                                        {location.amenities.evCharging && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Zap className="w-3 h-3 mr-1" /> EV
                                            </Badge>
                                        )}
                                        {location.amenities.security && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Shield className="w-3 h-3 mr-1" /> Secure
                                            </Badge>
                                        )}
                                        {location.amenities.wheelchairAccess && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Accessibility className="w-3 h-3 mr-1" /> Accessible
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredLocations.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No parking locations match your filters</p>
                            <Button variant="link" onClick={() => {
                                setFilters({
                                    evCharging: false,
                                    covered: false,
                                    security: false,
                                    wheelchairAccess: false,
                                    valet: false,
                                    overnight: false,
                                });
                                setPriceRange([0, 100]);
                                setMaxDistance(10);
                            }}>
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
