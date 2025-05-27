
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Vulnerability } from '@/types/vulnerability';

interface AgingMetricsProps {
  vulnerabilities: Vulnerability[];
}

export const AgingMetrics = ({ vulnerabilities }: AgingMetricsProps) => {
  const getAgingData = () => {
    const now = new Date();
    const ageRanges = {
      '0-7 days': 0,
      '8-30 days': 0,
      '31-60 days': 0,
      '61-90 days': 0,
      '90+ days': 0
    };

    vulnerabilities.forEach(vuln => {
      const diffTime = Math.abs(now.getTime() - vuln.discoveredDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) ageRanges['0-7 days']++;
      else if (diffDays <= 30) ageRanges['8-30 days']++;
      else if (diffDays <= 60) ageRanges['31-60 days']++;
      else if (diffDays <= 90) ageRanges['61-90 days']++;
      else ageRanges['90+ days']++;
    });

    return Object.entries(ageRanges).map(([range, count]) => ({
      range,
      count,
      fill: count > 0 ? '#3b82f6' : '#1f2937'
    }));
  };

  const data = getAgingData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="range" 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
        />
        <YAxis stroke="#9ca3af" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
