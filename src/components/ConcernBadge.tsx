interface ConcernBadgeProps {
  concern: string;
}

export default function ConcernBadge({ concern }: ConcernBadgeProps) {
  const isHigh = concern.toLowerCase().includes('above') || concern.toLowerCase().includes('unresolved');
  const isMedium = concern.toLowerCase().includes('surface') || concern.toLowerCase().includes('near');
  
  const colorClass = isHigh 
    ? 'bg-red-100 text-red-800' 
    : isMedium 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-blue-100 text-blue-800';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {isHigh ? '⚠️' : isMedium ? '⚡' : 'ℹ️'} {concern}
    </span>
  );
}
