import { View, Text } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivacyScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView
      className="flex-1 p-4  gap-y-3 mt-4"
      style={{ paddingTop: insets.top }}
    >
      <Text className="font-semibold text-lg">
        Last Updated: September 1, 2023
      </Text>
      <Text>
        This Privacy Policy outlines how we collect, use, disclose, and
        safeguard your personal information. By using the App, you consent to
        the practices described in this policy.
      </Text>
      <Text className="font-semibold text-lg">1. Information We Collect </Text>
      <Text>
        a. User-Provided Information: When you create an account or list a
        property on our Site, we collect personal information such as your name,
        email address, phone number, and property details.
      </Text>
      <Text>
        b. Property Information: This includes details about properties you list
        or inquire about, such as location, price, features, and images.
      </Text>
      <Text>
        c. Device Information: We may collect information about the device you
        are using, including but not limited to, the device type, operating
        system, unique device identifiers, and mobile network information.
      </Text>
      <Text className="font-semibold text-lg">2. Use of Your Information</Text>
      <Text>
        a. Property Listings: We use your information to display property
        listings, connect buyers and sellers, and facilitate property-related
        transactions.
      </Text>
      <Text>
        b. Communication: We may use your contact information to send you
        transactional messages, updates, and promotional offers related to our
        services.
      </Text>
      <Text>
        c. Improvement and Analysis: We use collected data to analyze user
        behavior, improve our Site's functionality, and enhance user experience.
      </Text>
      <Text className="font-semibold text-lg">3. Sharing Your Information</Text>
      <Text>
        a. Property Listings: Your property information, including contact
        details, may be shared with potential buyers or renters.
      </Text>
      <Text>
        b. Legal Compliance: We may disclose your information when required by
        law, such as in response to legal requests or to protect our rights and
        interests.
      </Text>
      <Text className="font-semibold text-lg">4. Data Security</Text>
      <Text>
        We take reasonable measures to protect your personal information from
        unauthorized access, alteration, disclosure, or destruction.
      </Text>
      <Text className="font-semibold text-lg">5. Your Choices</Text>
      <Text>
        You may access, update, or delete your account information through the
        App's settings. You can also contact us at support@atwelia.com for
        assistance.
      </Text>

      <Text className="font-semibold text-lg">6. Children's Privacy</Text>
      <Text>
        The App is not intended for children under the age of 13, and we do not
        knowingly collect personal information from children.
      </Text>

      <Text className="font-semibold text-lg">7. Third-Party Links</Text>
      <Text>
        Our Site may contain links to third-party websites. We are not
        responsible for the privacy practices or content on these external
        sites.
      </Text>
      <Text className="font-semibold text-lg">
        8. Changes to this Privacy Policy
      </Text>
      <Text className="mb-10">
        We may update this Privacy Policy to reflect changes in our practices or
        legal requirements.
      </Text>
    </KeyboardAwareScrollView>
  );
};

export default PrivacyScreen;
