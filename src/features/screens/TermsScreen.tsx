import { View, Text, ScrollView } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TermsScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView
      className="flex-1 p-4 gap-y-3  mt-4 "
      style={{ paddingTop: insets.top }}
    >
      <Text className="font-semibold">Last Updated: September 1, 2023</Text>
      <Text>
        These Terms of Service ("Terms") govern your use of our platform, and by
        accessing or using the Site, you agree to be bound by these Terms.
        Please read them carefully.
      </Text>

      <Text className="font-semibold text-lg"> 1. Acceptance of Terms</Text>
      <Text>
        By accessing or using our Site, you agree to comply with and be bound by
        these Terms. If you do not agree with these Terms, please refrain from
        using the Site.
      </Text>
      <Text className="font-semibold text-lg"> 2. User Eligibility</Text>
      <Text>
        You must be at least 18 years old to use our services. By using the
        Site, you confirm that you are of legal age.
      </Text>
      <Text className="font-semibold text-lg">
        3. Listing and Posting Guidelines
      </Text>
      <Text>
        a. Property Listings: When you post a property listing on our Site, you
        agree to provide accurate and up-to-date information about the property.
      </Text>
      <Text>
        b. Prohibited Content: You may not post or promote any content that is
        illegal, fraudulent, misleading, discriminatory, or violates any
        applicable laws or regulations.
      </Text>
      <Text className="font-semibold text-lg">4. Privacy</Text>
      <Text>
        Our Privacy Policy governs the collection, use, and sharing of your
        personal information. By using the Site, you consent to our Privacy
        Policy.
      </Text>
      <Text className="font-semibold text-lg">5. User Conduct </Text>
      <Text>
        a. You agree to use the Site in a lawful and respectful manner.
      </Text>
      <Text>
        b. You may not engage in any activity that disrupts or interferes with
        the proper functioning of the Site.
      </Text>
      <Text className="font-semibold text-lg"> 6. Intellectual Property</Text>
      <Text className="mb-10">
        All content and materials on the Site, including logos, trademarks, and
        text, are protected by intellectual property laws. You may not use,
        reproduce, or distribute these materials without our written consent.
      </Text>
    </KeyboardAwareScrollView>
  );
};

export default TermsScreen;
