import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from "react-native-svg";
import { colors } from "../../theme/colors";

interface IllustrationProps extends SvgProps {
  width?: number;
  height?: number;
}

export function SecurityTrustIllustration({
  width = 320,
  height = 260,
  ...props
}: IllustrationProps) {
  const gold = colors.ditto.gold; // #F5C518
  const ink = colors.ditto.ink; // #221A50
  const nightInk = colors.ditto.nightInk; // #130E30
  const meadow = colors.ditto.meadow; // #EFF2E5
  const meadowHigh = colors.ditto.meadowHigh; // #E2E7CF
  const slate = colors.ditto.slate; // #5F5C6E

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 380 300"
      fill="none"
      {...props}
    >
      <Defs>
        <LinearGradient id="bgGlow4" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={meadow} stopOpacity="0.85" />
          <Stop offset="1" stopColor={meadowHigh} stopOpacity="0.3" />
        </LinearGradient>

        <LinearGradient id="shieldOuterGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD84D" />
          <Stop offset="1" stopColor={gold} />
        </LinearGradient>

        <LinearGradient id="shieldInnerGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ink} />
          <Stop offset="1" stopColor={nightInk} />
        </LinearGradient>

        <LinearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE066" />
          <Stop offset="1" stopColor="#D9A800" />
        </LinearGradient>
      </Defs>

      {/* Ambient Backdrop Circle & Floor Shadow */}
      <Circle cx="190" cy="150" r="120" fill="url(#bgGlow4)" />
      <Path
        d="M70 260 C120 272, 260 272, 310 260 C270 252, 110 252, 70 260 Z"
        fill={meadowHigh}
        opacity="0.7"
      />

      {/* Atmospheric Accents */}
      <Circle cx="75" cy="75" r="5" fill={gold} opacity="0.8" />
      <Circle cx="305" cy="80" r="6" fill={ink} opacity="0.25" />
      <Circle cx="65" cy="180" r="4" fill={slate} opacity="0.3" />

      {/* Sparkles */}
      <Path
        d="M80 120 L82 126 L88 128 L82 130 L80 136 L78 130 L72 128 L78 126 Z"
        fill={gold}
      />
      <Path
        d="M310 135 L312 140 L317 142 L312 144 L310 149 L308 144 L303 142 L308 140 Z"
        fill={ink}
        opacity="0.35"
      />

      {/* Concentric Security Protection Rings */}
      <Circle cx="190" cy="138" r="95" stroke={gold} strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.4" />
      <Circle cx="190" cy="138" r="110" stroke={ink} strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.2" />

      {/* Large Majestic Security Shield */}
      <G transform="translate(110, 48)">
        {/* Soft Drop Shadow */}
        <Path
          d="M80 8 L156 36 C156 126, 80 174, 80 174 C80 174, 4 126, 4 36 Z"
          fill={nightInk}
          opacity="0.14"
          transform="translate(4, 8)"
        />

        {/* Outer Gold Shield Rim */}
        <Path
          d="M80 0 L160 28 C160 122, 80 170, 80 170 C80 170, 0 122, 0 28 Z"
          fill="url(#shieldOuterGrad)"
        />

        {/* Inner Deep Night Ink Shield Core */}
        <Path
          d="M80 10 L146 34 C146 114, 80 156, 80 156 C80 156, 14 114, 14 34 Z"
          fill="url(#shieldInnerGrad)"
        />

        {/* Subtle Shield Edge Bevel */}
        <Path
          d="M80 14 L140 36 C140 108, 80 148, 80 148"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
          fill="none"
        />

        {/* Central Padlock & Biometric Mechanism */}
        <G transform="translate(54, 48)">
          {/* Padlock Shackle */}
          <Path
            d="M16 28 L16 16 C16 6.5, 36 6.5, 36 16 L36 28"
            stroke={gold}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Padlock Body */}
          <Rect x="4" y="24" width="44" height="38" rx="10" fill={gold} />
          {/* Keyhole */}
          <Circle cx="26" cy="39" r="5" fill={nightInk} />
          <Path d="M24 41 L28 41 L27.5 51 L24.5 51 Z" fill={nightInk} />
        </G>

        {/* Radiating Fingerprint Arcs (Under padlock) */}
        <Path
          d="M44 114 C56 104, 104 104, 116 114"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />
        <Path
          d="M54 125 C64 117, 96 117, 106 125"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />
        <Path
          d="M66 135 C72 130, 88 130, 94 135"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />
      </G>

      {/* Floating Verified Checkmark Badge (Bottom Left) */}
      <G transform="translate(68, 175)">
        <Circle cx="24" cy="24" r="24" fill={nightInk} opacity="0.12" />
        <Circle cx="22" cy="22" r="22" fill="#059669" />
        <Circle cx="22" cy="22" r="18" stroke="#34D399" strokeWidth="2" fill="none" opacity="0.5" />
        <Path
          d="M13 22 L19 28 L31 16"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      {/* Floating 256-Bit Encrypted Pill Badge (Upper Left) */}
      <G transform="translate(45, 95)">
        <Rect x="2" y="3" width="76" height="30" rx="15" fill={nightInk} opacity="0.1" />
        <Rect x="0" y="0" width="76" height="30" rx="15" fill="#FFFFFF" stroke={meadow} strokeWidth="1.5" />
        <Circle cx="16" cy="15" r="6" fill="#059669" />
        <Rect x="28" y="12" width="36" height="6" rx="3" fill={ink} />
      </G>

      {/* Floating Golden Security Key (Right Side) */}
      <G transform="translate(260, 150) rotate(-25)">
        <Circle cx="16" cy="16" r="14" stroke="url(#keyGrad)" strokeWidth="5.5" fill="none" />
        <Rect x="28" y="13" width="34" height="6" rx="3" fill="url(#keyGrad)" />
        <Rect x="46" y="19" width="5" height="8" rx="2" fill="url(#keyGrad)" />
        <Rect x="54" y="19" width="5" height="11" rx="2" fill="url(#keyGrad)" />
      </G>
    </Svg>
  );
}
