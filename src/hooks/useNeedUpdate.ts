import VersionCheck from "react-native-version-check";
import { useState } from "react";

export interface NeedUpdateResult {
  isNeeded: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
}

const useNeedUpdate = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);

  //get current app version
  //   console.log(VersionCheck.getCurrentVersion()); // 0.1.1

  //   //fetch latest version from play store
  //   VersionCheck.getLatestVersion() // Automatically choose profer provider using `Platform.select` by device platform.
  //     .then((latestVersion) => {
  //       console.log(latestVersion); // 0.1.2
  //     });

  //get play store url of your app
  // VersionCheck.getPlayStoreUrl({ packageName: "", ignoreErrors: true }).then((url) =>
  //   //console.log(url) //string
  // );  // Returns url of Play Store of app.

  //needUpdate() will receive both versions and return true is latest version is greater
  VersionCheck.needUpdate({
    //currentVersion: "",//default:app's current version from getCurrentVersion()
    //latestVersion: "", //default: app's latest version from getLatestVersion()
  })
    .then(async (res) => {
      //console.log(res); //result: {isNeeded, storeUrl, currentVersion, latestVersion}
      //if (res.isNeeded) //Linking.openURL(res.storeUrl); // open store if update is needed.
      setResult({ storeUrl: res.storeUrl, latestVersion: res.latestVersion });
      setIsUpdateAvailable(res.isNeeded);
      setIsChecking(false);
    })
    .catch((err) => {
      setIsChecking(false);
      setIsUpdateAvailable(false);
      //console.log(err);
    });

  return { isChecking, isUpdateAvailable, result } as const;
};

export default useNeedUpdate;
