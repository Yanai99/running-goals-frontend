interface BeachPlaceholderProps {
    size?: number;
  }
  
  const BeachPlaceholder: React.FC<BeachPlaceholderProps> = ({ size = 200 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
    >
      {/* Circle Mask */}
    <clipPath id="circleMask">
      <circle cx="100" cy="100" r="100" />
    </clipPath>

    {/* Apply Mask */}
    <g clipPath="url(#circleMask)">
      {/* Sky */}
      <rect width="200" height="100" fill="#87CEEB" />
      
      {/* Sand */}
      <rect y="100" width="200" height="100" fill="#F4A460" />
      
      {/* Sun */}
      <circle cx="160" cy="40" r="20" fill="#FFD700" />
      
      {/* Sea */}
      <rect y="100" width="200" height="30" fill="#1E90FF" />
      
      {/* Umbrella */}
      <path d="M80 100 Q100 70 120 100 Z" fill="#FF6347" />
      <rect x="99" y="100" width="2" height="50" fill="#8B4513" />
      
      {/* Waves */}
      <path
        d="M0 120 Q20 115 40 120 T80 120 T120 120 T160 120 T200 120"
        stroke="#1E90FF"
        strokeWidth="2"
        fill="none"
      />
    </g>

    {/* Circle Border */}
    <circle cx="100" cy="100" r="99" stroke="#000" strokeWidth="2" fill="none" />
    </svg>
  );
  
  export default BeachPlaceholder;
