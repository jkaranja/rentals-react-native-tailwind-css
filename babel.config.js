module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      "nativewind/babel", //ensure you use version tailwindcss@3.3.2
      "react-native-reanimated/plugin", //has to be listed last
    ],
  };
};
