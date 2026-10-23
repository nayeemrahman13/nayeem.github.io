const SHELL =
  "m69.5 22.38-0.54-4.43c-0.4-3.38-1.63-6.33-3.76-8.59l-2.91-3.08c-1.1-1.09-1.8-1.39-3.74-1.39h-37.1c-1.94 0-2.64 0.3-3.74 1.39l-2.91 3.08c-2.13 2.26-3.36 5.21-3.76 8.59l-0.54 4.43c-1.82 8.29-2.9 17.33-2.9 26.36 0 5.77 0.42 11.51 1.26 16.35 1.35 8.22 7.33 9.96 18.94 9.96h24.4c11.61 0 17.59-1.74 18.94-9.96 0.84-4.84 1.26-10.58 1.26-16.35 0-9.03-1.08-18.07-2.9-26.36z";
const LEFT_CHEEK =
  "m18.74 38.94c-0.52-12.5-5.81-16.43-8.31-16.56-1.78 8.23-2.83 17.29-2.83 26.36 0 5.77 0.42 11.51 1.26 16.35 1.35 8.22 7.33 9.96 18.94 9.96-4.25-0.8-6.15-3.96-6.87-8.84-1.12-7.91-1.72-18.84-2.19-27.27z";
const RIGHT_CHEEK =
  "m69.5 22.38c-1.88 0.13-3.09 1.44-2.98 4.13 0.18 4.3-0.07 7.69-1.44 12.62-1.77 6.49-2.57 11.58-2.99 18.44-0.25 3.97-0.5 7.17-0.99 9.7-0.87 4.61-3.54 7.27-7.23 7.78 10.61-0.19 16.02-2.38 17.27-9.96 0.8-4.91 1.26-10.58 1.26-16.35 0-9.2-1.1-18.49-2.9-26.36z";

// Portrait body drawn with QuiverAI (Arrow 2 Telos studio-lighting pass on
// instax-camera-soft.svg): key light from the upper left, a recessed lens
// socket and shutter collar. The lens and shutter holes are clipped out
// because both are HTML layered on top. CSS colours .ready-light and
// .counter-digit, so neither carries a fill.
export default function MiniBody({ counter }) {
  return (
    <svg className="instax-body" viewBox="6 3 68 74" aria-hidden="true">
      <defs>
        <clipPath id="clear-apertures" clipPathUnits="userSpaceOnUse">
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 3H74V77H6Z M59 41.82A19 19 0 1 0 21 41.82A19 19 0 1 0 59 41.82Z M68.28 31.29A3.78 3.78 0 1 0 60.72 31.29A3.78 3.78 0 1 0 68.28 31.29Z"
          />
        </clipPath>
        <radialGradient
          id="studio-body-key"
          gradientUnits="userSpaceOnUse"
          cx="23"
          cy="18"
          fx="21"
          fy="13"
          r="66"
        >
          <stop offset="0%" stopColor="#FFFDFA" />
          <stop offset="25%" stopColor="#F9F7F2" />
          <stop offset="60%" stopColor="#F3F0EA" />
          <stop offset="85%" stopColor="#EFECE5" />
          <stop offset="100%" stopColor="#EDE9E2" />
        </radialGradient>
        <linearGradient
          id="studio-body-rim"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="4.89"
          x2="0"
          y2="9"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="studio-body-occlusion"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="71.8"
          x2="0"
          y2="75.05"
        >
          <stop offset="0%" stopColor="#343330" stopOpacity="0" />
          <stop offset="45%" stopColor="#343330" stopOpacity="0.012" />
          <stop offset="80%" stopColor="#343330" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#343330" stopOpacity="0.065" />
        </linearGradient>
        <linearGradient
          id="studio-left-panel"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="22.38"
          x2="0"
          y2="75.05"
        >
          <stop offset="0%" stopColor="#DAD7D1" />
          <stop offset="18%" stopColor="#E8E5DF" />
          <stop offset="55%" stopColor="#D5D1CA" />
          <stop offset="85%" stopColor="#C5C1BA" />
          <stop offset="100%" stopColor="#ACA8A1" />
        </linearGradient>
        <linearGradient id="studio-left-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="2.5%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="6%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="12%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="studio-right-panel"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="22.38"
          x2="0"
          y2="75.05"
        >
          <stop offset="0%" stopColor="#CCC8C1" />
          <stop offset="18%" stopColor="#DDD9D2" />
          <stop offset="55%" stopColor="#CAC6BF" />
          <stop offset="85%" stopColor="#BAB6AF" />
          <stop offset="100%" stopColor="#A29E97" />
        </linearGradient>
        <linearGradient
          id="studio-right-edge"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="94%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="97.5%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="studio-shoulder-light"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="studio-top-edge-light"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="5.19"
          x2="0"
          y2="22.36"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#FFFDFA" stopOpacity="0.75" />
          <stop offset="75%" stopColor="#FFFDFA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFDFA" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="studio-bottom-edge-shadow"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="65.04"
          x2="0"
          y2="74.75"
        >
          <stop offset="0%" stopColor="#605B54" stopOpacity="0" />
          <stop offset="50%" stopColor="#605B54" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#605B54" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient
          id="studio-slot-shadow"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#080807" />
          <stop offset="100%" stopColor="#282725" />
        </linearGradient>
        <linearGradient
          id="studio-slot-highlight"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FFFDFA" stopOpacity="0.15" />
          <stop offset="20%" stopColor="#FFFDFA" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#FFFDFA" stopOpacity="0.95" />
          <stop offset="80%" stopColor="#FFFDFA" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFFDFA" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="studio-slot-lip"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="68.3"
          x2="0"
          y2="72.2"
        >
          <stop offset="0%" stopColor="#A5A19A" />
          <stop offset="15%" stopColor="#E7E3DD" />
          <stop offset="40%" stopColor="#D8D4CD" />
          <stop offset="77%" stopColor="#B5B1AA" />
          <stop offset="100%" stopColor="#F8F6F1" />
        </linearGradient>
        <linearGradient
          id="studio-slot-cavity"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="69"
          x2="0"
          y2="71.5"
        >
          <stop offset="0%" stopColor="#10100F" />
          <stop offset="22%" stopColor="#191918" />
          <stop offset="70%" stopColor="#32312E" />
          <stop offset="100%" stopColor="#171716" />
        </linearGradient>
        <linearGradient
          id="studio-ring-contact"
          gradientUnits="userSpaceOnUse"
          x1="25"
          y1="26.82"
          x2="55"
          y2="56.82"
        >
          <stop offset="0%" stopColor="#D6D1C8" />
          <stop offset="100%" stopColor="#F2EFE9" />
        </linearGradient>
        <linearGradient
          id="studio-ring-bevel"
          gradientUnits="userSpaceOnUse"
          x1="26"
          y1="27.82"
          x2="54"
          y2="55.82"
        >
          <stop offset="0%" stopColor="#C9C3B9" />
          <stop offset="50%" stopColor="#DAD5CC" />
          <stop offset="100%" stopColor="#E8E4DC" />
        </linearGradient>
        <linearGradient
          id="studio-ring-inner-shadow"
          gradientUnits="userSpaceOnUse"
          x1="26"
          y1="27.82"
          x2="54"
          y2="55.82"
        >
          <stop offset="0%" stopColor="#49453F" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#49453F" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient
          id="studio-ring-highlight"
          gradientUnits="userSpaceOnUse"
          x1="25"
          y1="26.82"
          x2="55"
          y2="56.82"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient
          id="studio-shutter-collar"
          gradientUnits="userSpaceOnUse"
          x1="61.03"
          y1="27.82"
          x2="67.97"
          y2="34.76"
        >
          <stop offset="0%" stopColor="#B7B0A5" />
          <stop offset="30%" stopColor="#CFC9BF" />
          <stop offset="58%" stopColor="#E1DCD3" />
          <stop offset="100%" stopColor="#F7F4ED" />
        </linearGradient>
        <linearGradient
          id="studio-shutter-inner-shadow"
          gradientUnits="userSpaceOnUse"
          x1="61.69"
          y1="28.48"
          x2="67.31"
          y2="34.1"
        >
          <stop offset="0%" stopColor="#696258" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#696258" stopOpacity="0.25" />
          <stop offset="65%" stopColor="#696258" stopOpacity="0" />
          <stop offset="100%" stopColor="#696258" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="studio-shutter-lip-light"
          gradientUnits="userSpaceOnUse"
          x1="61.14"
          y1="27.93"
          x2="67.86"
          y2="34.65"
        >
          <stop offset="0%" stopColor="#FFFDFA" stopOpacity="0" />
          <stop offset="40%" stopColor="#FFFDFA" stopOpacity="0" />
          <stop offset="75%" stopColor="#FFFDFA" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFDFA" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient
          id="studio-counter-surround"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FAF8F3" />
          <stop offset="25%" stopColor="#DDD9D2" />
          <stop offset="65%" stopColor="#B7B2AB" />
          <stop offset="100%" stopColor="#8D8881" />
        </linearGradient>
        <linearGradient
          id="studio-counter-glass"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#151514" />
          <stop offset="10%" stopColor="#343330" />
          <stop offset="22%" stopColor="#68655F" />
          <stop offset="29%" stopColor="#4C4944" />
          <stop offset="42%" stopColor="#242321" />
          <stop offset="80%" stopColor="#151514" />
          <stop offset="100%" stopColor="#302E2B" />
        </linearGradient>
        <linearGradient id="studio-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#696660" />
          <stop offset="35%" stopColor="#383632" />
          <stop offset="100%" stopColor="#1B1A18" />
        </linearGradient>
        <linearGradient
          id="studio-bezel-edge"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFDFA" />
          <stop offset="50%" stopColor="#D5D1CA" />
          <stop offset="100%" stopColor="#817C75" />
        </linearGradient>
        <radialGradient
          id="studio-flash-inset"
          cx="0.3"
          cy="0.22"
          fx="0.25"
          fy="0.17"
          r="0.95"
        >
          <stop offset="0%" stopColor="#AAA69F" />
          <stop offset="25%" stopColor="#79756F" />
          <stop offset="65%" stopColor="#4B4945" />
          <stop offset="100%" stopColor="#262522" />
        </radialGradient>
        <linearGradient
          id="studio-flash-reflector"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient
          id="studio-flash-dividers"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="13.9"
          x2="0"
          y2="21.16"
        >
          <stop offset="0%" stopColor="#69665F" />
          <stop offset="50%" stopColor="#B0ACA5" />
          <stop offset="100%" stopColor="#77736D" />
        </linearGradient>
        <linearGradient
          id="studio-flash-glass"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#77736D" />
          <stop offset="10%" stopColor="#C5C1B9" />
          <stop offset="25%" stopColor="#E8E5DE" />
          <stop offset="37%" stopColor="#FAF8F2" />
          <stop offset="45%" stopColor="#D5D1C9" />
          <stop offset="63%" stopColor="#B3AFA7" />
          <stop offset="85%" stopColor="#D5D1CA" />
          <stop offset="100%" stopColor="#827E77" />
        </linearGradient>
        <linearGradient
          id="studio-finder-aperture"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FCFBF7" />
          <stop offset="50%" stopColor="#D8D5CE" />
          <stop offset="100%" stopColor="#AAA69F" />
        </linearGradient>
        <radialGradient
          id="studio-finder-glass"
          cx="0.3"
          cy="0.22"
          fx="0.25"
          fy="0.17"
          r="0.95"
        >
          <stop offset="0%" stopColor="#B4B0A8" />
          <stop offset="12%" stopColor="#87837C" />
          <stop offset="30%" stopColor="#55524C" />
          <stop offset="60%" stopColor="#2E2C29" />
          <stop offset="100%" stopColor="#151514" />
        </radialGradient>
        <linearGradient
          id="studio-sensor-frame"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#514E48" />
          <stop offset="50%" stopColor="#2B2926" />
          <stop offset="100%" stopColor="#191816" />
        </linearGradient>
        <radialGradient
          id="studio-sensor-glass"
          cx="0.3"
          cy="0.22"
          fx="0.25"
          fy="0.17"
          r="0.95"
        >
          <stop offset="0%" stopColor="#B9B5AD" />
          <stop offset="35%" stopColor="#807C75" />
          <stop offset="100%" stopColor="#45423D" />
        </radialGradient>
      </defs>
      <g clipPath="url(#clear-apertures)">
        <g id="body">
          <path d={SHELL} fill="url(#studio-body-key)" />
          <path d={SHELL} fill="url(#studio-body-rim)" />
          <path d={SHELL} fill="url(#studio-body-occlusion)" />
          <path d={LEFT_CHEEK} fill="url(#studio-left-panel)" />
          <path d={LEFT_CHEEK} fill="url(#studio-left-edge)" />
          <path d={RIGHT_CHEEK} fill="url(#studio-right-panel)" />
          <path
            d="m18.09 10.66c-1.9 0.91-3.37 6.88-3.38 10.61-0.01 1.62 2.06 1.77 2.06-0.14 0-3.91 0.66-7.8 1.71-9.94 0.17-0.36-0.09-0.65-0.39-0.53z"
            fill="url(#studio-shoulder-light)"
            opacity="0.55"
          />
          <path
            d="m13.09 12.47c-0.91 1.27-1.48 3.39-1.58 5.14-0.03 0.7 0.7 0.83 0.72 0.07 0.05-1.78 0.42-3.7 0.98-4.99 0.08-0.18-0.02-0.34-0.12-0.22z"
            fill="url(#studio-shoulder-light)"
            opacity="0.3"
          />
          <path
            d="m64.51 10.69c-0.34-0.08-0.56 0.28-0.26 0.53 1.72 1.48 2.81 4.95 3.2 7.6 0.1 0.72 1.18 0.39 1.1-0.6-0.27-3.78-1.97-7.03-4.04-7.53z"
            fill="url(#studio-shoulder-light)"
            opacity="0.25"
          />
          <path d={RIGHT_CHEEK} fill="url(#studio-right-edge)" />
          <path
            d="M10.77 22.36l0.54-4.38c0.39-3.31 1.59-6.2 3.68-8.42l2.91-3.08c1.04-1.03 1.69-1.29 3.55-1.29h37.1c1.86 0 2.51 0.26 3.55 1.29l2.91 3.08c2.09 2.22 3.29 5.11 3.68 8.42l0.54 4.38"
            fill="none"
            stroke="url(#studio-top-edge-light)"
            strokeWidth="0.25"
            strokeLinecap="round"
          />
          <path
            d="M9.13 65.04c1.31 7.99 7.18 9.71 18.67 9.71h24.4c11.49 0 17.36-1.72 18.67-9.71"
            fill="none"
            stroke="url(#studio-bottom-edge-shadow)"
            strokeWidth="0.25"
            strokeLinecap="round"
          />
        </g>
        <g id="print-slot">
          <rect
            x="16"
            y="68.3"
            width="48"
            height="3.9"
            rx="1.95"
            fill="url(#studio-slot-lip)"
          />
          <rect
            x="18"
            y="69"
            width="44"
            height="2.5"
            rx="1.25"
            fill="url(#studio-slot-cavity)"
          />
          <rect
            x="19"
            y="69.35"
            width="42"
            height="0.6"
            rx="0.3"
            fill="url(#studio-slot-shadow)"
          />
          <rect
            x="17"
            y="72.3"
            width="46"
            height="0.9"
            rx="0.45"
            fill="url(#studio-slot-highlight)"
          />
        </g>
        <g id="lens-mount">
          <circle
            cx="40"
            cy="41.82"
            r="20.6"
            fill="none"
            stroke="url(#studio-ring-contact)"
            strokeWidth="0.8"
          />
          <circle
            cx="40"
            cy="41.82"
            r="20"
            fill="none"
            stroke="url(#studio-ring-bevel)"
            strokeWidth="1.2"
          />
          <circle
            cx="40"
            cy="41.82"
            r="19.7"
            fill="none"
            stroke="url(#studio-ring-inner-shadow)"
            strokeWidth="0.6"
          />
          <circle
            cx="40"
            cy="41.82"
            r="20.63"
            fill="none"
            stroke="url(#studio-ring-highlight)"
            strokeWidth="0.32"
          />
        </g>
        <g id="counter">
          <rect
            x="58.4"
            y="58.6"
            width="7.2"
            height="4.6"
            rx="1"
            fill="url(#studio-counter-surround)"
          />
          <rect
            x="59"
            y="59.1"
            width="6"
            height="3.6"
            rx="0.7"
            fill="url(#studio-counter-glass)"
          />
          <text
            className="counter-digit"
            x="62"
            y="61.95"
            textAnchor="middle"
            fontSize="2.6"
          >
            {counter}
          </text>
        </g>
        <g id="flash">
          <path
            d="m28.61 11.64h-7.56c-0.97 0-1.67 0.67-1.67 1.72v8.43c0 1.05 0.75 1.75 1.74 1.75h7.47c0.96 0 1.71-0.69 1.71-1.68v-8.54c0-1.01-0.69-1.68-1.69-1.68z"
            fill="url(#studio-bezel)"
            stroke="url(#studio-bezel-edge)"
            strokeOpacity="0.6"
            strokeWidth="0.4"
          />
          <path
            d="m27.94 12.84h-6.39c-0.46 0-0.75 0.29-0.75 0.78v7.97c0 0.48 0.28 0.75 0.77 0.75h6.36c0.54 0 0.83-0.25 0.83-0.79v-7.94c0-0.51-0.27-0.77-0.82-0.77z"
            fill="url(#studio-flash-inset)"
          />
          <path
            className="flash-window"
            d="m27.2 13.9h-4.72c-0.12 0-0.17 0.06-0.17 0.18v6.91c0 0.12 0.05 0.17 0.17 0.17h4.72c0.1 0 0.14-0.05 0.14-0.16v-6.94c0-0.11-0.04-0.16-0.14-0.16z"
            fill="url(#studio-flash-glass)"
          />
          <path
            d="m23.72 13.9v7.26h2.08v-7.26h-2.08z"
            fill="url(#studio-flash-reflector)"
            opacity="0.45"
          />
          <path
            d="m23.66 13.9v7.26"
            fill="none"
            stroke="url(#studio-flash-dividers)"
            strokeWidth="0.2279"
          />
          <path
            d="m25.8 13.9v7.26"
            fill="none"
            stroke="url(#studio-flash-dividers)"
            strokeWidth="0.1519"
          />
        </g>
        <g id="viewfinder">
          <path
            d="m63.11 12.83h-4.67c-1.1 0-1.78 0.69-1.78 1.82v4.72c0 1.14 0.77 1.85 1.81 1.85h4.64c1.08 0 1.84-0.7 1.84-1.8v-4.75c0-1.14-0.7-1.84-1.84-1.84z"
            fill="url(#studio-bezel)"
            stroke="url(#studio-bezel-edge)"
            strokeOpacity="0.6"
            strokeWidth="0.4"
          />
          <path
            d="m62.05 14.68h-2.58c-0.66 0-0.98 0.32-0.98 0.97v2.72c0 0.67 0.34 0.98 0.99 0.98h2.56c0.63 0 0.95-0.32 0.95-0.96v-2.76c0-0.65-0.3-0.95-0.94-0.95z"
            fill="url(#studio-finder-glass)"
          />
          <path
            d="m60.99 15.72h-0.68c-0.22 0-0.32 0.11-0.32 0.32v1.19c0 0.21 0.12 0.31 0.33 0.31h0.66c0.21 0 0.31-0.1 0.31-0.3v-1.2c0-0.22-0.09-0.32-0.3-0.32z"
            fill="url(#studio-finder-aperture)"
          />
        </g>
        <circle className="ready-light" cx="53.4" cy="15.2" r="0.6" />
        <g id="sensor">
          <path
            d="m48.65 14.68h-0.69c-0.62 0-1.01 0.43-1.01 1.04v3.62c0 0.65 0.43 1.08 1.03 1.08h0.66c0.58 0 1-0.45 1-1.06v-3.65c0-0.61-0.39-1.03-0.99-1.03z"
            fill="url(#studio-sensor-frame)"
          />
          <path
            d="m48.71 16.95h-0.86c-0.21 0-0.32 0.12-0.32 0.34v1.16c0 0.22 0.12 0.33 0.33 0.33h0.84c0.22 0 0.32-0.11 0.32-0.32v-1.17c0-0.23-0.1-0.34-0.31-0.34z"
            fill="url(#studio-sensor-glass)"
          />
        </g>
        <g id="shutter-halo">
          <circle
            cx="64.5"
            cy="31.29"
            r="4.34"
            fill="none"
            stroke="url(#studio-shutter-collar)"
            strokeWidth="1.12"
          />
          <circle
            cx="64.5"
            cy="31.29"
            r="3.97"
            fill="none"
            stroke="url(#studio-shutter-inner-shadow)"
            strokeWidth="0.38"
          />
          <circle
            cx="64.5"
            cy="31.29"
            r="4.75"
            fill="none"
            stroke="url(#studio-shutter-lip-light)"
            strokeWidth="0.22"
          />
        </g>
      </g>
    </svg>
  );
}
