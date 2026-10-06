import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Header } from '../../components/common/Header';
import {
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP,
} from '../../constants/config';

const FAQS = [
  {
    q: 'What is the standard turnaround time for Visiting Cards?',
    a: 'Standard orders are printed and dispatched within 24–48 hours. Metro express orders within Hyderabad and major tier-1 cities are delivered in 1–2 business days.',
  },
  {
    q: 'What paper stock and finishes do you offer?',
    a: 'We print on 350 GSM premium art board with Silk Matte, High Gloss, Woven Linen, Velvet Soft-Touch, Raised Spot UV, and Hot Gold Foil stamping.',
  },
  {
    q: 'Can I upload my own print-ready PDF or design artwork?',
    a: 'Yes! You can upload high-resolution PDF, PNG, JPG, or SVG files directly through the Upload Artwork screen. Our pre-flight engine verifies resolution and bleed margins automatically.',
  },
  {
    q: 'Do you provide GST input tax credit for businesses?',
    a: 'Yes, enter your 15-digit GSTIN during checkout or in Edit Profile. A GST-compliant tax invoice will be sent directly to your registered email.',
  },
  {
    q: 'What if I am not satisfied with the print quality?',
    a: 'We offer a 100% Quality Satisfaction Guarantee. If there is any printing or cutting defect, we will promptly re-print your batch at no extra cost or issue a full refund.',
  },
];

export const HelpSupportScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Support Request - SAP Prints Mobile App`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(SUPPORT_WHATSAPP);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Help & Support"
        subtitle="24/7 dedicated printing assistance"
        showBack
        navigation={navigation}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Contact Cards */}
        <View style={styles.contactCardsRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp} activeOpacity={0.85}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#E8FBF0' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactSub}>Instant Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleCall} activeOpacity={0.85}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#FFEBF1' }]}>
              <Ionicons name="call" size={22} color={colors.primaryPink} />
            </View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSub}>Mon–Sat 9AM–8PM</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmail} activeOpacity={0.85}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="mail" size={22} color={colors.primaryBlue} />
            </View>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactSub}>24h Response</Text>
          </TouchableOpacity>
        </View>

        {/* Office / Store Location */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="location" size={18} color={colors.primaryPink} />
            <Text style={styles.sectionHeading}>SAP Prints Production & Design Hub</Text>
          </View>
          <Text style={styles.addressLine}>
            Plot No. 42, Road No. 1, Near Forum Mall, KPHB Colony Phase 1, Kukatpally, Hyderabad, Telangana – 500072
          </Text>
          <Text style={styles.hoursLine}>
            Operating Hours: Monday to Saturday, 9:00 AM – 9:00 PM IST
          </Text>
        </View>

        {/* FAQ Accordion */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>

          {FAQS.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <View key={idx} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => setExpandedIndex(isExpanded ? null : idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.faqQuestion, isExpanded && styles.faqQuestionActive]}>{faq.q}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={isExpanded ? colors.primaryPink : colors.secondaryText}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqAnswerWrap}>
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Guarantee Seal */}
        <View style={styles.guaranteeCard}>
          <Ionicons name="shield-checkmark" size={32} color={colors.primaryPink} />
          <View style={styles.guaranteeTextWrap}>
            <Text style={styles.guaranteeTitle}>100% Quality & Bleed Guarantee</Text>
            <Text style={styles.guaranteeSub}>
              Every order undergoes rigorous digital pre-flight inspection before printing to ensure zero cutoff and razor-sharp color calibration.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  contactCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  contactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  contactSub: {
    fontSize: 10.5,
    color: colors.secondaryText,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryNavy,
    marginBottom: 10,
  },
  addressLine: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 19,
  },
  hoursLine: {
    fontSize: 12,
    color: colors.primaryPink,
    fontWeight: '700',
    marginTop: 6,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  faqQuestion: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.primaryNavy,
    flex: 1,
    lineHeight: 18,
  },
  faqQuestionActive: {
    color: colors.primaryPink,
  },
  faqAnswerWrap: {
    marginTop: 8,
    paddingTop: 4,
  },
  faqAnswer: {
    fontSize: 12.5,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  guaranteeCard: {
    backgroundColor: '#FFEBF1',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 28, 98, 0.2)',
  },
  guaranteeTextWrap: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  guaranteeSub: {
    fontSize: 11.5,
    color: colors.secondaryText,
    lineHeight: 16,
    marginTop: 3,
  },
});
