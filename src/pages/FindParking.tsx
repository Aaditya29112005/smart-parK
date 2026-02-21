import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, ArrowUpDown, Flame, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { ParkingLocation as MapLocation } from '@/components/maps/MapboxMap';
import { VoiceAssistant } from '@/components/ai/VoiceAssistant';
import { MOCK_PARKING_LOCATIONS, ParkingLocation } from '@/data/parkingLocations';
import { useParking } from '@/contexts/ParkingContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ScheduleModal } from '@/components/parking/ScheduleModal';

export default function FindParkingWithMap() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price' | 'distance' | 'none'>('none');
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const { vehicles, isSurgeActive, demandWeights } = useParking();
    // Get user's live location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Default to Pune, India
                    setUserLocation([18.5204, 73.8567]);
                }
            );

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => console.error('Error watching location:', error),
                { enableHighAccuracy: true, maximumAge: 10000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setUserLocation([18.5204, 73.8567]);
        }
    }, []);

    const filteredLocations = [...MOCK_PARKING_LOCATIONS].filter(
        (loc) =>
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'price') return a.pricing.hourly - b.pricing.hourly;
        if (sortBy === 'distance' && userLocation) {
            // Simple distance heuristic
            const distA = Math.sqrt(Math.pow(a.coordinates.lat - userLocation[0], 2) + Math.pow(a.coordinates.lng - userLocation[1], 2));
            const distB = Math.sqrt(Math.pow(b.coordinates.lat - userLocation[0], 2) + Math.pow(b.coordinates.lng - userLocation[1], 2));
            return distA - distB;
        }
        return 0;
    }) as unknown as ParkingLocation[];

    // Auto-focus logic: If search matches a location exactly or there's only one result, focus it
    useEffect(() => {
        if (searchQuery.length > 2) {
            const exactMatch = filteredLocations.find(loc =>
                loc.name.toLowerCase() === searchQuery.toLowerCase() ||
                loc.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (exactMatch) {
                setSelectedLocationId(exactMatch.id);
            } else if (filteredLocations.length === 1) {
                setSelectedLocationId(filteredLocations[0].id);
            }
        }
    }, [searchQuery, filteredLocations]);

    const handleBookNow = (location: MapLocation) => {
        if (vehicles.length === 0) {
            navigate('/add-vehicle', { state: { location, returnToBooking: true } });
        } else {
            navigate('/slots', { state: { location } });
        }
    };

    const handleVoiceCommand = (text: string) => {
        const lowerText = text.toLowerCase();

        // 1. Direct Location Matching (Phoenix, Seasons, etc.)
        const matchedLocation = MOCK_PARKING_LOCATIONS.find(loc =>
            lowerText.includes(loc.name.toLowerCase()) ||
            lowerText.includes(loc.name.toLowerCase().split(' ')[0]) ||
            (loc.address.toLowerCase().includes(lowerText) && lowerText.length > 5)
        );

        if (matchedLocation) {
            // If it's just the name OR contains navigation keywords
            const navigationKeywords = ['go to', 'park at', 'select', 'where is', 'show me', 'navigate'];
            const isNavCommand = navigationKeywords.some(kw => lowerText.includes(kw));
            const isPureNameMatch = lowerText.trim() === matchedLocation.name.toLowerCase() ||
                lowerText.trim() === matchedLocation.name.toLowerCase().split(' ')[0];

            if (isNavCommand || isPureNameMatch || lowerText.includes('lot')) {
                setSelectedLocationId(matchedLocation.id);
                setSearchQuery(matchedLocation.name);
                toast({
                    title: "AI Navigator",
                    description: `Navigating to ${matchedLocation.name}...`,
                    duration: 3000
                });
                return;
            }
        }

        // 2. Action Trigger (Book/Reserve)
        if (lowerText.includes('book') || lowerText.includes('reserve') || lowerText.includes('start')) {
            const currentLoc = MOCK_PARKING_LOCATIONS.find(l => l.id === selectedLocationId);
            if (currentLoc) {
                handleBookNow(currentLoc as any);
            } else if (matchedLocation) {
                handleBookNow(matchedLocation as any);
            } else {
                toast({ title: "Voice Action Error", description: "Please select a location first", variant: "destructive" });
            }
            return;
        }

        // 3. Filters
        if (lowerText.includes('cheap') || lowerText.includes('lowest') || lowerText.includes('price')) {
            setSortBy('price');
            return;
        }
        if (lowerText.includes('near') || lowerText.includes('close') || lowerText.includes('distance')) {
            setSortBy('distance');
            return;
        }

        // 4. Fallback Search
        if (lowerText.includes('find') || lowerText.includes('search')) {
            const query = lowerText.replace(/find|search|parking|near/g, '').trim();
            setSearchQuery(query);
        } else if (lowerText.includes('clear')) {
            setSearchQuery('');
            setSortBy('none');
            setSelectedLocationId(null);
        }
    };

    return (
        <MobileLayout>
            <div className="relative h-screen flex flex-col md:flex-row overflow-hidden bg-background">
                {/* Desktop Sidebar - Premium List Explorer */}
                <aside className="hidden md:flex w-[420px] h-full flex-col border-r border-white/5 bg-card/10 backdrop-blur-3xl shadow-[20px_0_60px_rgba(0,0,0,0.2)] z-50">
                    <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-foreground">Explorer</h1>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Live Network</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
                                <Search className="w-5 h-5 text-primary" />
                            </div>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 rounded-2xl bg-white/5 border-white/10 text-sm font-medium focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
                            <Badge
                                variant={sortBy === 'price' ? 'default' : 'secondary'}
                                className="h-8 rounded-full px-4 cursor-pointer text-xs uppercase font-black tracking-widest whitespace-nowrap"
                                onClick={() => setSortBy(sortBy === 'price' ? 'none' : 'price')}
                            >
                                ₹ Lowest Price
                            </Badge>
                            <Badge
                                variant={sortBy === 'distance' ? 'default' : 'secondary'}
                                className="h-8 rounded-full px-4 cursor-pointer text-xs uppercase font-black tracking-widest whitespace-nowrap"
                                onClick={() => setSortBy(sortBy === 'distance' ? 'none' : 'distance')}
                            >
                                <ArrowUpDown className="w-3 h-3 mr-1" /> Closest
                            </Badge>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-12 scrollbar-none">
                        {filteredLocations.map((loc, index) => (
                            <motion.div
                                key={loc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={cn(
                                        "group p-4 rounded-[2rem] border-transparent bg-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer relative overflow-hidden",
                                        selectedLocationId === loc.id ? "bg-primary/15 border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.15)] ring-1 ring-primary/20" : ""
                                    )}
                                    onClick={() => {
                                        setSelectedLocationId(loc.id);
                                        toast({
                                            title: "Point Focused",
                                            description: `Viewing ${loc.name}`,
                                            duration: 1500
                                        });
                                    }}
                                >
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors shadow-2xl">
                                            <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                        </div>
                                        <div className="flex-1 py-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-black text-sm text-foreground tracking-tight leading-tight mb-1">{loc.name}</h3>
                                                <p className="text-xs text-muted-foreground truncate opacity-60 leading-tight">{loc.address}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[15px] font-black text-primary">₹{loc.pricing.hourly}<span className="text-xs opacity-60 font-bold ml-0.5">/hr</span></span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-[10px] uppercase font-bold tracking-wider border-primary/20 hover:bg-primary/10 hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedLocationId(loc.id);
                                                            setIsScheduleModalOpen(true);
                                                        }}
                                                    >
                                                        Schedule
                                                    </Button>
                                                    <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", loc.availability.available > 10 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]")} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{loc.availability.available} slots</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedLocationId === loc.id && (
                                        <motion.div
                                            layoutId="desktop-active-indicator"
                                            className="absolute inset-y-0 left-0 w-1 bg-primary"
                                        />
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </aside>

                <div className="flex-1 relative h-full">
                    {/* Better Search Bar Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <div className="space-y-3 pointer-events-auto max-w-lg mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search premium spots..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-14 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-0 text-lg font-medium outline-none ring-0"
                                    />
                                </div>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                                    className="h-14 w-14 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md"
                                >
                                    {viewMode === 'map' ? <ArrowUpDown className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                                </Button>
                            </div>

                            {/* Filters Row */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                <Badge
                                    variant={sortBy === 'none' ? 'default' : 'secondary'}
                                    className="h-8 rounded-full px-4 cursor-pointer whitespace-nowrap"
                                    onClick={() => setSortBy('none')}
                                >
                                    All Nearby
                                </Badge>
                                <Badge
                                    variant={sortBy === 'price' ? 'default' : 'secondary'}
                                    className="h-8 rounded-full px-4 cursor-pointer whitespace-nowrap flex items-center gap-2"
                                    onClick={() => setSortBy('price')}
                                >
                                    <ArrowUpDown className="w-3 h-3" />
                                    Lowest Price
                                </Badge>
                                <Badge
                                    variant={sortBy === 'distance' ? 'default' : 'secondary'}
                                    className="h-8 rounded-full px-4 cursor-pointer whitespace-nowrap flex items-center gap-2"
                                    onClick={() => setSortBy('distance')}
                                >
                                    <MapPin className="w-3 h-3" />
                                    Closest First
                                </Badge>
                                <Badge
                                    variant={showHeatmap ? 'default' : 'secondary'}
                                    className={`h-8 rounded-full px-4 cursor-pointer whitespace-nowrap flex items-center gap-2 transition-all ${showHeatmap ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                                    onClick={() => setShowHeatmap(!showHeatmap)}
                                >
                                    <Flame className={`w-3 h-3 ${showHeatmap ? 'animate-pulse' : ''}`} />
                                    Demand Heatmap
                                </Badge>
                            </div>

                            {isSurgeActive && (
                                <div className="bg-orange-500/90 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 animate-bounce" />
                                        <span className="text-xs font-black uppercase tracking-widest">Surge Mode Active</span>
                                    </div>
                                    <span className="text-xs font-bold opacity-80">Prices adjusted (+25%)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map & List Content */}
                    <div className="h-full w-full pb-16 relative">
                        <AnimatePresence mode="wait">
                            {viewMode === 'map' ? (
                                <motion.div
                                    key="map-view"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full w-full"
                                >
                                    <LeafletMap
                                        locations={filteredLocations}
                                        selectedLocationId={selectedLocationId}
                                        onLocationSelect={setSelectedLocationId}
                                        userLocation={userLocation}
                                        onBook={handleBookNow}
                                        showHeatmap={showHeatmap}
                                        demandWeights={demandWeights}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list-view"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="h-full w-full bg-background pt-32 px-4 overflow-y-auto"
                                >
                                    <div className="max-w-lg mx-auto space-y-4 pb-24">
                                        <div className="flex items-center justify-between px-2 mb-2">
                                            <h2 className="text-2xl font-black tracking-tighter">Available Spots</h2>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{filteredLocations.length} locations</p>
                                        </div>

                                        {filteredLocations.map((loc, index) => (
                                            <motion.div
                                                key={loc.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card
                                                    className={cn(
                                                        "group relative overflow-hidden transition-all duration-500 cursor-pointer border-white/5 shadow-2xl hover:shadow-primary/5 hover:border-primary/20 bg-card/50 backdrop-blur-xl",
                                                        selectedLocationId === loc.id ? "ring-2 ring-primary border-transparent" : ""
                                                    )}
                                                    onClick={() => {
                                                        setSelectedLocationId(loc.id);
                                                        setViewMode('map');
                                                        toast({
                                                            title: "View Focused",
                                                            description: `Centering map on ${loc.name}`,
                                                            duration: 2000
                                                        });
                                                    }}
                                                >
                                                    <div className="flex gap-4 p-4">
                                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 z-10" />
                                                            <img
                                                                src={loc.image}
                                                                alt={loc.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                            <div className="absolute top-2 left-2 z-20">
                                                                <div className="bg-primary/90 backdrop-blur-md text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-lg">
                                                                    ₹{loc.pricing.hourly}/hr
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 flex flex-col justify-between py-1">
                                                            <div>
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                    <h3 className="font-black text-lg leading-tight tracking-tight group-hover:text-primary transition-colors">{loc.name}</h3>
                                                                    <div className="flex items-center gap-1 text-orange-500">
                                                                        <TrendingUp className="w-3 h-3" />
                                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Top Pick</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mb-2">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {loc.address}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                                                                    <span>Occupancy</span>
                                                                    <span>{loc.availability.available}/{loc.availability.total} Free</span>
                                                                </div>
                                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
                                                                    {Array.from({ length: 12 }).map((_, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className={cn(
                                                                                "h-full flex-1 transition-all duration-1000",
                                                                                i < (loc.availability.available / loc.availability.total) * 12
                                                                                    ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                                                                                    : "bg-muted-foreground/10"
                                                                            )}
                                                                            style={{ transitionDelay: `${i * 50}ms` }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}

                                        {filteredLocations.length === 0 && (
                                            <div className="text-center py-20">
                                                <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                                <p className="text-muted-foreground font-bold tracking-tight">No results found for your search</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <VoiceAssistant onCommand={handleVoiceCommand} />
                </div>
            </div>
            {selectedLocationId && (
                <ScheduleModal
                    isOpen={isScheduleModalOpen}
                    onClose={() => setIsScheduleModalOpen(false)}
                    location={MOCK_PARKING_LOCATIONS.find(l => l.id === selectedLocationId)!}
                />
            )}
        </MobileLayout >
    );
}
