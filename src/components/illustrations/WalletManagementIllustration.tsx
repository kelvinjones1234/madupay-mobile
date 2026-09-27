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

export function WalletManagementIllustration({
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
        <LinearGradient id="bgGlow2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={meadow} stopOpacity="0.85" />
          <Stop offset="1" stopColor={meadowHigh} stopOpacity="0.3" />
        </LinearGradient>

        <LinearGradient id="walletMainGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ink} />
          <Stop offset="1" stopColor={nightInk} />
        </LinearGradient>

        <LinearGradient id="goldCardGrad2" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFD84D" />
          <Stop offset="1" stopColor={gold} />
        </LinearGradient>

        <LinearGradient id="meadowCardGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={meadowHigh} />
        </LinearGradient>

        <LinearGradient id="coinGrad2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE066" />
          <Stop offset="1" stopColor="#D9A800" />
        </LinearGradient>
      </Defs>

      {/* Ambient Backdrop Circle & Floor Shadow */}
      <Circle cx="190" cy="150" r="120" fill="url(#bgGlow2)" />
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

      {/* Stacked Cards Emerging from the Wallet (Back Layer) */}
      {/* 1. Platinum / Canvas White Card */}
      <G transform="translate(100, 60) rotate(-8)">
        <Rect x="0" y="0" width="135" height="82" rx="14" fill="url(#meadowCardGrad)" stroke={meadow} strokeWidth="1.5" />
        <Rect x="14" y="14" width="18" height="13" rx="3" fill={meadowHigh} />
        <Rect x="14" y="38" width="55" height="4" rx="2" fill={ink} opacity="0.3" />
        <Circle cx="114" cy="62" r="8" fill={ink} opacity="0.2" />
      </G>

      {/* 2. Signature MaduPay Warm Gold Card */}
      <G transform="translate(145, 52) rotate(6)">
        <Rect x="3" y="4" width="135" height="82" rx="14" fill={nightInk} opacity="0.1" />
        <Rect x="0" y="0" width="135" height="82" rx="14" fill="url(#goldCardGrad2)" />
        <Rect x="14" y="14" width="20" height="14" rx="3.5" fill="#FFFFFF" opacity="0.9" />
        <Rect x="17" y="18" width="14" height="6" rx="1.5" fill={gold} />
        <Path d="M42 16 A 6 6 0 0 1 42 26" stroke={nightInk} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <Rect x="14" y="40" width="65" height="5" rx="2.5" fill={nightInk} opacity="0.8" />
        <Circle cx="108" cy="60" r="9" fill={nightInk} opacity="0.8" />
        <Circle cx="118" cy="60" r="9" fill={nightInk} opacity="0.4" />
      </G>

      {/* Main Luxury Leather Digital Wallet (Front Layer) */}
      <G transform="translate(85, 105)">
        {/* Deep Drop Shadow */}
        <Rect x="5" y="8" width="210" height="130" rx="24" fill={nightInk} opacity="0.14" />
        {/* Wallet Main Body */}
        <Rect x="0" y="0" width="210" height="130" rx="24" fill="url(#walletMainGrad)" />

        {/* Subtle Edge Stitching Effect */}
        <Path
          d="M16 16 L194 16 M194 16 L194 114 M194 114 L16 114 M16 114 L16 16"
          stroke={slate}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.35"
        />

        {/* Front Pocket Cutout Arc */}
        <Path
          d="M0 48 C60 56, 150 56, 210 48 L210 130 C210 142, 198 142, 186 142 L24 142 C12 142, 0 142, 0 130 Z"
          fill={ink}
        />

        {/* Gold Clasp Strap & Metal Buckle */}
        <G transform="translate(150, 48)">
          <Path
            d="M0 0 L40 0 C46 0, 50 4, 50 10 L50 32 C50 38, 46 42, 40 42 L0 42 Z"
            fill={nightInk}
          />
          {/* Metal Clasp Emblem */}
          <Circle cx="32" cy="21" r="10" fill={gold} />
          <Circle cx="32" cy="21" r="5" fill={nightInk} />
        </G>
      </G>

      {/* Floating Balance & Analytics Banner (Front Left) */}
      <G transform="translate(35, 145)">
        {/* Shadow */}
        <Rect x="4" y="6" width="138" height="74" rx="18" fill={nightInk} opacity="0.12" />
        {/* Card Body */}
        <Rect x="0" y="0" width="138" height="74" rx="18" fill="#FFFFFF" stroke={meadow} strokeWidth="1.5" />

        {/* Label */}
        <Rect x="14" y="14" width="46" height="5" rx="2.5" fill={slate} opacity="0.5" />

        {/* Amount: stylized pill bars representing ₦ balance */}
        <Rect x="14" y="26" width="75" height="10" rx="5" fill={ink} />

        {/* Green Growth Badge */}
        <G transform="translate(14, 46)">
          <Rect x="0" y="0" width="56" height="18" rx="9" fill="#ECFDF5" />
          {/* Green arrow up */}
          <Path d="M9 11 L13 7 L17 11 M13 7 L13 14" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Rect x="22" y="7" width="26" height="4" rx="2" fill="#059669" />
        </G>

        {/* Mini Sparkline Chart */}
        <Path
          d="M86 56 L96 50 L106 53 L120 42"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx="120" cy="42" r="3" fill="#059669" />
      </G>

      {/* Stack of Floating Golden Coins with Naira Symbol (Front Right) */}
      <G transform="translate(230, 205)">
        <Circle cx="20" cy="20" r="20" fill="url(#coinGrad2)" />
        <Circle cx="20" cy="20" r="16.5" stroke="#C49600" strokeWidth="2" fill="none" />
        <Path
          d="M14 12 L14 28 M26 12 L26 28 M14 12 L26 28 M11 18 L29 18 M11 22 L29 22"
          stroke={nightInk}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </G>

      <G transform="translate(265, 222)">
        <Circle cx="15" cy="15" r="15" fill="url(#coinGrad2)" />
        <Circle cx="15" cy="15" r="12" stroke="#C49600" strokeWidth="1.8" fill="none" />
        <Path
          d="M11 9 L11 21 M20 9 L20 21 M11 9 L20 21 M8 13 L22 13 M8 17 L22 17"
          stroke={nightInk}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
