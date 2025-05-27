
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrendChart = () => {
  const trendData = [
    { day: 'Mon', discovered: 12, resolved: 8 },
    { day: 'Tue', discovered: 8, resolved: 15 },
    { day: 'Wed', discovered: 15, resolved: 10 },
    { day: 'Thu', discovered: 6, resolved: 12 },
    { day: 'Fri', discovered: 20, resolved: 18 },
    { day: 'Sat', discovered: 3, resolved: 5 },
    { day: 'Sun', discovered: 7, resolved: 9 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="day" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="discovered" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          name="Discovered"
        />
        <Line 
          type="monotone" 
          dataKey="resolved" 
          stroke="#22c55e" 
          strokeWidth={2}
          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
          name="Resolved"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
