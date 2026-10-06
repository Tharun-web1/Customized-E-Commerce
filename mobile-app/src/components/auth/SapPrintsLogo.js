import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText, Path, G } from 'react-native-svg';
import { colors } from '../../theme/colors';

export const SapPrintsLogo = () => {
  return (
    <View style={styles.container}>
      {/* Centered Logo Group */}
      <View style={styles.logoWrapper}>
        <Svg width="180" height="75" viewBox="0 0 180 75">
          {/* Circle 1: Yellow/Orange for @ */}
          <Circle cx="36" cy="36" r="30" fill="#FFA000" fillOpacity="0.95" />

          {/* Circle 2: Magenta/Pink for S */}
          <Circle cx="72" cy="36" r="30" fill="#FF1E67" fillOpacity="0.95" />

          {/* Circle 3: Blue/Cyan for A */}
          <Circle cx="108" cy="36" r="30" fill="#0099FF" fillOpacity="0.95" />

          {/* Circle 4: Green/Teal for P */}
          <Circle cx="144" cy="36" r="30" fill="#00C853" fillOpacity="0.95" />

          {/* White Letters: @ S A P */}
          <SvgText
            x="36"
            y="47"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="900"
            fontFamily="System"
            textAnchor="middle"
          >
            @
          </SvgText>
          <SvgText
            x="72"
            y="47"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="900"
            fontFamily="System"
            textAnchor="middle"
          >
            S
          </SvgText>
          <SvgText
            x="108"
            y="47"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="900"
            fontFamily="System"
            textAnchor="middle"
          >
            A
          </SvgText>
          <SvgText
            x="144"
            y="47"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="900"
            fontFamily="System"
            textAnchor="middle"
          >
            P
          </SvgText>
        </Svg>

        {/* Subtitle: SAP PRINTS */}
        <Text style={styles.brandTitle}>S A P   P R I N T S</Text>
      </View>

      {/* Top-Right Tagline: "Print Create Stand Out" */}
      <View style={styles.sloganWrapper}>
        <Text style={styles.sloganLine1}>Print</Text>
        <Text style={styles.sloganLine2}>Create</Text>
        <Text style={styles.sloganLine3}>Stand Out</Text>
        <Svg width="56" height="6" viewBox="0 0 56 6" style={styles.sloganUnderline}>
          <Path
            d="M 2 4 Q 28 0 54 3"
            stroke={colors.primaryPink}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 8,
    minHeight: 110,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B1B3D',
    letterSpacing: 4.5,
    marginTop: 2,
    textAlign: 'center',
  },
  sloganWrapper: {
    position: 'absolute',
    right: 4,
    top: 4,
    transform: [{ rotate: '-8deg' }],
    alignItems: 'flex-start',
  },
  sloganLine1: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1B3D',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  sloganLine2: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1B3D',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  sloganLine3: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1B3D',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  sloganUnderline: {
    marginTop: 1,
  },
});
