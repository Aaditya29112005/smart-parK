import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card } from "@/components/ui/card";

// Mock data generation for "Popular Times"
const generatePopularTimes = () => {
    const data = [];
    const hours = ["6A", "9A", "12P", "3P", "6P", "9P"];
    for (let i = 0; i < 6; i++) {
        data.push({
            time: hours[i],
            occupancy: Math.floor(Math.random() * 80) + 20, // 20-100%
        });
    }
    return data;
};

export function PopularTimesChart() {
    const data = generatePopularTimes();

    return (
        <div className="w-full h-[120px] mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-muted-foreground">Popular Times</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Live</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.occupancy > 75 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                                fillOpacity={index === 2 ? 1 : 0.3} // Highlight "current" time (mock 12P)
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
