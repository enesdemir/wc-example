/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";
import { Core } from "@walletconnect/core";
import { ICore } from "@walletconnect/types";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { CameraScreen } from "react-native-camera-kit";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

let web3wallet: any;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black
          }
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark
          }
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [camera, setCamera] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === "dark";
  useEffect(() => {
    check(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log("This feature is not available (on this device / in this context)");
            break;
          case RESULTS.DENIED:
            request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(res => {
              setCamera(true);
            });
            console.log("The permission has not been requested / is denied but requestable");
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("The permission is granted");
            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {
        // …
      });

  }, []);

  const asyncFunc = async () => {

    const core = new Core({
      projectId: "bf1e836a805d9db636ac03f989bea914",
      relayUrl: "wss://relay.walletconnect.com"
    });

    web3wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: "Slash",
        description: "Slash",
        url: "https://slash.space/",
        icons: ["https://avatars.githubusercontent.com/u/37784886"]
      }
    });
    web3wallet.on("session_proposal", async (proposal) => {
      console.log(proposal);
      /*const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces,
      });*/
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {camera && <View
        style={{
          height: 650,
          width: 400
        }}><CameraScreen
        style={{
          height: 650,
          width: 400
        }}
        // Show/hide scan frame
        scanBarcode={true}
        hideControls={true}
        // Scanner Frame color
        onReadCode={event => {
          console.log(event.nativeEvent.codeStringValue);

          web3wallet.core.pairing.pair({ uri: event.nativeEvent.codeStringValue });
        }}
      /></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600"
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400"
  },
  highlight: {
    fontWeight: "700"
  }
});

export default App;
