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

export function BillServicesIllustration({
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
        <LinearGradient id="bgGlow3" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={meadow} stopOpacity="0.85" />
          <Stop offset="1" stopColor={meadowHigh} stopOpacity="0.3" />
        </LinearGradient>

        <LinearGradient id="tabletGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ink} />
          <Stop offset="1" stopColor={nightInk} />
        </LinearGradient>

        <LinearGradient id="goldBadgeGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD84D" />
          <Stop offset="1" stopColor={gold} />
        </LinearGradient>
      </Defs>

      {/* Ambient Backdrop Circle & Floor Shadow */}
      <Circle cx="190" cy="150" r="120" fill="url(#bgGlow3)" />
      <Path
        d="M70 260 C120 272, 260 272, 310 260 C270 252, 110 252, 70 260 Z"
        fill={meadowHigh}
        opacity="0.7"
      />

      {/* Atmospheric Accents */}
      <Circle cx="80" cy="80" r="5" fill={gold} opacity="0.8" />
      <Circle cx="305" cy="75" r="6" fill={ink} opacity="0.25" />
      <Circle cx="65" cy="180" r="4" fill={slate} opacity="0.3" />

      {/* Sparkles */}
      <Path
        d="M85 125 L87 131 L93 133 L87 135 L85 141 L83 135 L77 133 L83 131 Z"
        fill={gold}
      />
      <Path
        d="M305 130 L307 135 L312 137 L307 139 L305 144 L303 139 L298 137 L303 135 Z"
        fill={ink}
        opacity="0.35"
      />

      {/* Sleek Central Payment Kiosk / Tablet */}
      <G transform="translate(115, 45)">
        {/* Soft Drop Shadow */}
        <Rect x="6" y="8" width="150" height="195" rx="24" fill={nightInk} opacity="0.14" />
        {/* Outer Frame */}
        <Rect x="0" y="0" width="150" height="195" rx="24" fill="url(#tabletGrad)" />
        {/* Frame Highlight */}
        <Rect x="2" y="2" width="146" height="191" rx="22" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" fill="none" />

        {/* Screen Display */}
        <Rect x="6" y="6" width="138" height="183" rx="19" fill="#FFFFFF" />

        {/* Top App Bar inside Tablet */}
        <Rect x="16" y="16" width="50" height="7" rx="3.5" fill={meadowHigh} />
        <Circle cx="122" cy="19" r="4.5" fill={gold} />

        {/* Service Grid 2x2 */}
        {/* 1. Electricity (Lightning Tile) */}
        <Rect x="14" y="34" width="52" height="46" rx="12" fill={meadow} />
        <Circle cx="40" cy="52" r="12" fill={gold} />
        <Path d="M41 45 L35 53 L40 53 L39 60 L45 52 L40 52 Z" fill={nightInk} />
        <Rect x="24" y="70" width="32" height="4" rx="2" fill={ink} opacity="0.8" />

        {/* 2. Airtime & Data (Antenna Waves Tile) */}
        <Rect x="74" y="34" width="52" height="46" rx="12" fill={meadow} />
        <Circle cx="100" cy="52" r="12" fill={ink} />
        <Path
          d="M93 57 A 8 8 0 0 1 107 57 M96 54 A 4 4 0 0 1 104 54 M100 52 A 1 1 0 0 1 100 52.5"
          stroke={gold}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <Rect x="84" y="70" width="32" height="4" rx="2" fill={ink} opacity="0.8" />

        {/* 3. Cable TV (Monitor Tile) */}
        <Rect x="14" y="88" width="52" height="46" rx="12" fill={meadow} />
        <Circle cx="40" cy="106" r="12" fill={meadowHigh} />
        <Rect x="33" y="100" width="14" height="10" rx="2" stroke={ink} strokeWidth="1.8" fill="none" />
        <Path d="M37 110 L43 110" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
        <Rect x="24" y="124" width="32" height="4" rx="2" fill={ink} opacity="0.8" />

        {/* 4. Internet / Utilities Tile */}
        <Rect x="74" y="88" width="52" height="46" rx="12" fill={meadow} />
        <Circle cx="100" cy="106" r="12" fill="#D1FAE5" />
        <Circle cx="100" cy="106" r="6" fill="#059669" />
        <Rect x="84" y="124" width="32" height="4" rx="2" fill={ink} opacity="0.8" />

        {/* Quick Pay Pill Button */}
        <Rect x="14" y="146" width="112" height="26" rx="13" fill={gold} />
        <Rect x="42" y="157" width="56" height="5" rx="2.5" fill={nightInk} />
      </G>

      {/* Floating Thermal Itemized Receipt (Slanted on Left) */}
      <G transform="translate(40, 105) rotate(-10)">
        {/* Soft Drop Shadow */}
        <Rect x="4" y="5" width="80" height="125" rx="10" fill={nightInk} opacity="0.12" />
        {/* Receipt Body */}
        <Rect x="0" y="0" width="80" height="125" rx="10" fill="#FFFFFF" stroke={meadow} strokeWidth="1.5" />

        {/* Success Stamp Header */}
        <Circle cx="40" cy="18" r="9" fill="#059669" />
        <Path d="M35 18 L38 21 L45 15" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Itemized Lines */}
        <Rect x="14" y="36" width="52" height="5" rx="2.5" fill={ink} opacity="0.8" />
        <Rect x="14" y="46" width="34" height="4" rx="2" fill={slate} opacity="0.5" />
        <Rect x="54" y="46" width="12" height="4" rx="2" fill={ink} opacity="0.8" />
        <Rect x="14" y="56" width="28" height="4" rx="2" fill={slate} opacity="0.5" />
        <Rect x="48" y="56" width="18" height="4" rx="2" fill={ink} opacity="0.8" />

        {/* Perforated Divider */}
        <Path d="M12 68 L68 68" stroke={slate} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

        {/* Total Row */}
        <Rect x="14" y="76" width="22" height="5" rx="2.5" fill={ink} />
        <Rect x="42" y="76" width="24" height="5" rx="2.5" fill="#059669" />

        {/* Barcode Lines */}
        <Path
          d="M14 94 L14 110 M18 94 L18 110 M22 94 L22 110 M27 94 L27 110 M32 94 L32 110 M36 94 L36 110 M42 94 L42 110 M47 94 L47 110 M52 94 L52 110 M58 94 L58 110 M64 94 L64 110"
          stroke={ink}
          strokeWidth="2"
          opacity="0.6"
        />
      </G>

      {/* Floating Electricity Fast Badge (Upper Right) */}
      <G transform="translate(245, 75)">
        <Circle cx="24" cy="24" r="24" fill={nightInk} opacity="0.1" />
        <Circle cx="22" cy="22" r="22" fill="url(#goldBadgeGrad)" />
        <Circle cx="22" cy="22" r="18" stroke="#DDA800" strokeWidth="2" fill="none" />
        <Path d="M24 11 L15 22 L23 22 L20 33 L29 20 L21 20 Z" fill={nightInk} />
      </G>

      {/* Floating Wireless Waves Badge (Lower Right) */}
      <G transform="translate(255, 175)">
        <Circle cx="20" cy="20" r="20" fill="#FFFFFF" stroke={meadow} strokeWidth="1.5" />
        <Circle cx="20" cy="20" r="16" fill={meadow} />
        <Path
          d="M14 24 A 8 8 0 0 1 26 24 M16 21 A 5 5 0 0 1 24 21 M20 18 A 1 1 0 0 1 20 18.5"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}
