import React from 'react';
import { motion } from 'framer-motion';
import { ParkingSlot } from '@/types/parking';
import { cn } from '@/lib/utils';

interface DigitalTwinHubProps {
    slots: ParkingSlot[];
    selectedSlot?: string;
    onSelectSlot: (slot: ParkingSlot) => void;
    recommendedSlot?: string;
}

export function DigitalTwinHub({ slots, selectedSlot, onSelectSlot, recommendedSlot }: DigitalTwinHubProps) {
    // Organize slots into rows for the SVG layout
    // Assuming A, B, C rows logic from demo data
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

    // SVG Config
    const slotWidth = 60;
    const slotHeight = 100;
    const rowGap = 140; // Driving lane
    const colGap = 10;
    const startX = 50;
    const startY = 50;

    return (
        <div className="w-full h-[500px] overflow-auto bg-black/90 rounded-xl border border-primary/20 relative">
            {/* Grid Background Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <svg
                width={800}
                height={850}
                className="w-full min-w-[800px] absolute z-10 overflow-hidden"
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="slotGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 255, 255, 0.2)" />
                        <stop offset="100%" stopColor="rgba(0, 255, 255, 0.0)" />
                    </linearGradient>
                </defs>

                {/* Draw Rows */}
                {rows.map((rowChar, rowIndex) => {
                    // Get slots for this row
                    const rowSlots = slots.filter(s => s.id.toLowerCase().startsWith(rowChar.toLowerCase()));
                    const yPos = startY + (Math.floor(rowIndex / 2) * (slotHeight + rowGap));
                    // Alternate top/bottom for driving lane
                    const isTopSide = rowIndex % 2 === 0;
                    const finalY = isTopSide ? yPos : yPos + slotHeight + 40; // 40px barrier

                    return rowSlots.map((slot, index) => {
                        const xPos = startX + (index * (slotWidth + colGap));
                        const isSelected = selectedSlot === slot.id;
                        const isRecommended = recommendedSlot === slot.id;
                        const isAvailable = slot.is_available;

                        // Color selection using Theme Variables
                        let strokeColor = "hsl(var(--muted-foreground))";
                        let fillColor = "transparent";

                        if (!isAvailable) {
                            strokeColor = "hsl(var(--destructive))"; // Occupied -> Red/Destructive
                            fillColor = "hsl(var(--destructive) / 0.2)";
                        } else if (isSelected) {
                            strokeColor = "hsl(var(--primary))"; // Selected -> Primary (Purple/Blue)
                            fillColor = "hsl(var(--primary) / 0.3)";
                        } else if (isRecommended) {
                            strokeColor = "hsl(var(--accent))"; // Recommended -> Accent
                            fillColor = "hsl(var(--accent) / 0.2)";
                        } else {
                            strokeColor = "hsl(var(--primary) / 0.5)"; // Available -> Dim Primary
                        }

                        return (
                            <motion.g
                                key={slot.id}
                                onClick={() => isAvailable && onSelectSlot(slot)}
                                whileHover={isAvailable ? { scale: 1.05 } : {}}
                                style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                            >
                                {/* Slot Box */}
                                <rect
                                    x={xPos}
                                    y={finalY}
                                    width={slotWidth}
                                    height={slotHeight}
                                    rx="4"
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth={isSelected || isRecommended ? 3 : 1}
                                    filter={isSelected || isRecommended ? "url(#glow)" : ""}
                                    className="transition-colors duration-300"
                                />

                                {/* Slot ID */}
                                <text
                                    x={xPos + slotWidth / 2}
                                    y={finalY + slotHeight / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {slot.name}
                                </text>

                                {/* Vehicle shape if occupied */}
                                {!isAvailable && (
                                    <path
                                        d={`M ${xPos + 10} ${finalY + 20} L ${xPos + slotWidth - 10} ${finalY + 20} L ${xPos + slotWidth - 10} ${finalY + slotHeight - 20} L ${xPos + 10} ${finalY + slotHeight - 20} Z`}
                                        fill="#ff3333"
                                        opacity="0.3"
                                        rx="2"
                                    />
                                )}

                                {/* EV Charging & V2G Visualizations */}
                                {slot.has_ev_charging && (
                                    <g>
                                        {/* Charging Station Base Icon */}
                                        <path
                                            d={`M ${xPos + 5} ${finalY + 5} h 10 v 10 h -10 Z M ${xPos + 8} ${finalY + 8} l 4 0 l -4 4 l 4 0`}
                                            stroke={!slot.is_available ? "#00f3ff" : "#00f3ff55"}
                                            strokeWidth="1"
                                            fill="none"
                                        />

                                        {/* Occupied EV Features */}
                                        {!slot.is_available && (
                                            <>
                                                {/* Charge Progress Bar */}
                                                <rect
                                                    x={xPos + slotWidth - 12}
                                                    y={finalY + 20}
                                                    width={4}
                                                    height={slotHeight - 40}
                                                    fill="#1f2937"
                                                    rx="2"
                                                />
                                                <motion.rect
                                                    x={xPos + slotWidth - 12}
                                                    y={finalY + slotHeight - 20}
                                                    width={4}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: -(slotHeight - 40) * ((slot.ev_charge_level || 65) / 100) }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                                                    fill="#00f3ff"
                                                    rx="2"
                                                    filter="url(#glow)"
                                                />

                                                {/* V2G Energy Flow */}
                                                {slot.is_v2g_active && (
                                                    <motion.path
                                                        d={`M ${xPos + slotWidth / 2} ${finalY + 70} L ${xPos + slotWidth / 2} ${finalY + 30}`}
                                                        stroke="#fbbf24"
                                                        strokeWidth="2"
                                                        strokeDasharray="4,4"
                                                        animate={{ strokeDashoffset: [20, 0] }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        filter="url(#glow)"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </g>
                                )}

                                {slot.has_handicap && (
                                    <circle
                                        cx={xPos + 10}
                                        cy={finalY + slotHeight - 10}
                                        r="4"
                                        stroke="white"
                                        strokeWidth="1"
                                        fill="none"
                                        opacity="0.5"
                                    />
                                )}
                            </motion.g>
                        );
                    });
                })}

                {/* Driving Lanes Markings */}
                <path d="M 40 200 L 760 200" stroke="#444" strokeWidth="2" strokeDasharray="10,10" />
                <path d="M 40 440 L 760 440" stroke="#444" strokeWidth="2" strokeDasharray="10,10" />
            </svg>

            {/* HUD Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full shadow-[0_0_8px_hsl(var(--destructive)/0.6)]" />
                    <span className="text-[10px] text-muted-foreground font-mono">OCCUPIED</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/50 rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                    <span className="text-[10px] text-muted-foreground font-mono">AVAILABLE</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.6)] animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-mono">SELECTED</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#00f3ff] rounded-sm shadow-[0_0_8px_#00f3ff55]" />
                    <span className="text-[10px] text-[#00f3ff] font-mono uppercase">EV HUD ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 flex items-center justify-center">
                        <div className="w-full h-[2px] bg-yellow-400 rotate-90 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-yellow-400 font-mono uppercase tracking-tighter">V2G SELL-BACK</span>
                </div>
            </div>
        </div>
    );
}
