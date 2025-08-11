export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="noqta logo" role="img">
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="190 18"
        strokeDashoffset="6"
      />
      <circle cx="50" cy="50" r="6" fill="white" />
    </svg>
  );
}
