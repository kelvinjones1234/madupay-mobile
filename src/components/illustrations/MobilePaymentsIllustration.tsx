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

export function MobilePaymentsIllustration({
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
        <LinearGradient id="bgGlow1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={meadow} stopOpacity="0.85" />
          <Stop offset="1" stopColor={meadowHigh} stopOpacity="0.3" />
        </LinearGradient>

        <LinearGradient id="goldCardGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD84D" />
          <Stop offset="0.6" stopColor={gold} />
          <Stop offset="1" stopColor="#D9A800" />
        </LinearGradient>

        <LinearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ink} />
          <Stop offset="1" stopColor={nightInk} />
        </LinearGradient>

        <LinearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE066" />
          <Stop offset="1" stopColor="#D9A800" />
        </LinearGradient>
      </Defs>

      {/* Ambient Backdrop Circle & Floor Shadow */}
      <Circle cx="190" cy="150" r="120" fill="url(#bgGlow1)" />
      <Path
        d="M70 260 C120 272, 260 272, 310 260 C270 252, 110 252, 70 260 Z"
        fill={meadowHigh}
        opacity="0.7"
      />

      {/* Subtle Atmospheric Accents */}
      <Circle cx="85" cy="80" r="5" fill={gold} opacity="0.8" />
      <Circle cx="305" cy="75" r="6" fill={ink} opacity="0.25" />
      <Circle cx="70" cy="175" r="4" fill={slate} opacity="0.3" />
      <Circle cx="315" cy="205" r="5" fill={gold} opacity="0.5" />

      {/* Sparkles */}
      <Path
        d="M95 125 L97 131 L103 133 L97 135 L95 141 L93 135 L87 133 L93 131 Z"
        fill={gold}
      />
      <Path
        d="M295 130 L297 135 L302 137 L297 139 L295 144 L293 139 L288 137 L293 135 Z"
        fill={ink}
        opacity="0.35"
      />

      {/* Smartphone Device Mockup */}
      <G transform="translate(125, 40)">
        {/* Soft Drop Shadow */}
        <Rect
          x="6"
          y="8"
          width="130"
          height="220"
          rx="26"
          fill={nightInk}
          opacity="0.12"
        />
        {/* Phone Outer Chassis */}
        <Rect
          x="0"
          y="0"
          width="130"
          height="220"
          rx="26"
          fill="url(#phoneGrad)"
        />
        {/* Subtle Glass Bezel Highlight */}
        <Rect
          x="2"
          y="2"
          width="126"
          height="216"
          rx="24"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Screen Area */}
        <Rect
          x="6"
          y="6"
          width="118"
          height="208"
          rx="21"
          fill="#FFFFFF"
        />

        {/* Dynamic Island Speaker */}
        <Rect
          x="46"
          y="13"
          width="38"
          height="7"
          rx="3.5"
          fill={nightInk}
        />

        {/* Screen Content: Minimalist UI */}
        {/* Mini Balance Banner */}
        <Rect x="14" y="32" width="90" height="46" rx="12" fill={meadow} />
        <Rect x="22" y="42" width="34" height="4" rx="2" fill={slate} opacity="0.5" />
        <Rect x="22" y="52" width="56" height="8" rx="4" fill={ink} />
        <Circle cx="90" cy="55" r="4.5" fill={gold} />

        {/* Recent Transfer Activity Lines */}
        <Rect x="14" y="88" width="90" height="22" rx="11" fill="#F8FAFC" stroke={meadow} strokeWidth="1" />
        <Circle cx="25" cy="99" r="6" fill={meadowHigh} />
        <Rect x="36" y="96" width="36" height="5" rx="2.5" fill={ink} opacity="0.8" />
        <Rect x="82" y="96" width="14" height="5" rx="2.5" fill="#059669" />

        <Rect x="14" y="116" width="90" height="22" rx="11" fill="#F8FAFC" stroke={meadow} strokeWidth="1" />
        <Circle cx="25" cy="127" r="6" fill={meadowHigh} />
        <Rect x="36" y="124" width="42" height="5" rx="2.5" fill={ink} opacity="0.8" />
        <Rect x="84" y="124" width="12" height="5" rx="2.5" fill={slate} opacity="0.6" />

        {/* Action Button Pill inside Phone */}
        <Rect x="14" y="152" width="90" height="26" rx="13" fill={gold} />
        <Rect x="38" y="163" width="42" height="5" rx="2.5" fill={nightInk} />

        {/* Home Indicator Bar */}
        <Rect x="44" y="200" width="42" height="3" rx="1.5" fill={slate} opacity="0.4" />
      </G>

      {/* Floating 3D Gold Payment Card (Slanted Perspective) */}
      <G transform="translate(68, 105) rotate(-14)">
        {/* Ambient Card Shadow */}
        <Rect
          x="4"
          y="6"
          width="135"
          height="84"
          rx="16"
          fill={nightInk}
          opacity="0.16"
        />
        {/* Card Body */}
        <Rect
          x="0"
          y="0"
          width="135"
          height="84"
          rx="16"
          fill="url(#goldCardGrad)"
        />
        {/* Subtle Card Border Highlight */}
        <Rect
          x="1"
          y="1"
          width="133"
          height="82"
          rx="15"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* EMV Microchip */}
        <Rect x="16" y="18" width="22" height="17" rx="4" fill="#FFFFFF" opacity="0.9" />
        <Rect x="20" y="23" width="14" height="7" rx="2" fill={gold} />

        {/* Contactless Waves */}
        <Path
          d="M48 20 A 7 7 0 0 1 48 32"
          stroke={nightInk}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <Path
          d="M53 17 A 12 12 0 0 1 53 35"
          stroke={nightInk}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Card Number Embossed Lines */}
        <Rect x="16" y="48" width="68" height="5" rx="2.5" fill={nightInk} opacity="0.8" />
        <Rect x="16" y="58" width="40" height="4" rx="2" fill={nightInk} opacity="0.6" />

        {/* Dual Circle Logo (Mastercard/Payment style) */}
        <Circle cx="106" cy="62" r="10" fill={nightInk} opacity="0.9" />
        <Circle cx="118" cy="62" r="10" fill={nightInk} opacity="0.5" />
      </G>

      {/* Floating Success Confirmation Badge */}
      <G transform="translate(235, 150)">
        {/* Shadow */}
        <Circle cx="22" cy="22" r="22" fill={nightInk} opacity="0.1" />
        {/* Outer Ring */}
        <Circle cx="20" cy="20" r="20" fill="#059669" />
        <Circle cx="20" cy="20" r="17" stroke="#34D399" strokeWidth="1.8" fill="none" opacity="0.5" />
        {/* Checkmark */}
        <Path
          d="M12 20 L17 25 L28 14"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      {/* Floating Golden Coin with Naira Sign */}
      <G transform="translate(85, 205)">
        <Circle cx="18" cy="18" r="18" fill="url(#coinGrad)" />
        <Circle cx="18" cy="18" r="15" stroke="#C49600" strokeWidth="1.8" fill="none" />
        {/* Naira Symbol */}
        <Path
          d="M13 11 L13 25 M23 11 L23 25 M13 11 L23 25 M10 16 L26 16 M10 20 L26 20"
          stroke={nightInk}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </G>

      {/* Contactless Transmission Rings (Radiating from card) */}
      <G transform="translate(190, 85)">
        <Path
          d="M0 0 A 24 24 0 0 1 24 24"
          stroke={gold}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
        />
        <Path
          d="M0 -10 A 34 34 0 0 1 34 24"
          stroke={gold}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.5"
        />
      </G>
    </Svg>
  );
}
