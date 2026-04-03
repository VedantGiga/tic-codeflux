export default function WaterWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" style={{ height: "120px" }}>
      <svg
        className="relative block w-full"
        style={{ height: "120px" }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax-waves">
          <use xlinkHref="#wave" x="48" y="0" fill="rgba(255,255,255,0.03)" />
          <use xlinkHref="#wave" x="48" y="3" fill="rgba(255,255,255,0.02)" />
          <use xlinkHref="#wave" x="48" y="5" fill="rgba(255,255,255,0.015)" />
          <use xlinkHref="#wave" x="48" y="7" fill="rgba(255,255,255,0.01)" />
        </g>
      </svg>
    </div>
  );
}

