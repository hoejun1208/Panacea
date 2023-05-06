import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,  
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, Canvas, Image} from 'react-native-pytorch-core';
import detectObjects from './Pages/screens/ObjectDetector';
import CameraScreen from './Pages/screens/CameraScreen';
import LoadingScreen from './Pages/screens/LoadingScreen';
import ResultsScreen from './Pages/screens/ResultsScreen';

const ScreenStates = {
  CAMERA: 0,
  LOADING: 1,
  RESULTS: 2,
};

export default function ObjectDetectionExample() {
  const [image, setImage] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState(null);
  const [screenState, setScreenState] = useState(ScreenStates.CAMERA);

  // Handle the reset button and return to the camera capturing mode
  const handleReset = useCallback(async () => {
    setScreenState(ScreenStates.CAMERA);
    if (image != null) {
      await image.release();
    }
    setImage(null);
    setBoundingBoxes(null);
  }, [image, setScreenState]);

  // This handler function handles the camera's capture event
  async function handleImage(capturedImage) {
    setImage(capturedImage);
    // Wait for image to process through YOLOv5 model and draw resulting image
    setScreenState(ScreenStates.LOADING);
    try {
      const newBoxes = await detectObjects(capturedImage);
      setBoundingBoxes(newBoxes);
      // Switch to the ResultsScreen to display the detected objects
      setScreenState(ScreenStates.RESULTS);
    } catch (err) {
      // In case something goes wrong, go back to the CameraScreen to take a new picture
      handleReset();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {screenState === ScreenStates.CAMERA && (
        <CameraScreen onCapture={handleImage} />
      )}
      {screenState === ScreenStates.LOADING && <LoadingScreen />}
      {screenState === ScreenStates.RESULTS && (
        <ResultsScreen
          image={image}
          boundingBoxes={boundingBoxes}
          onReset={handleReset}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
//##############################################################################
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, ActivityIndicator } from 'react-native';
// import { useSharedValue } from 'react-native-reanimated';
// import {
//   Camera,
//   useCameraDevices,
//   useFrameProcessor,
// } from 'react-native-vision-camera';
// import { labelImage } from 'vision-camera-image-labeler';

// import { Label } from './Pages/components/Label';

// export default function App() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const currentLabel = useSharedValue('');

//   const devices = useCameraDevices();
//   const device = devices.back;

//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === 'authorized');
//     })();
//   }, []);

//   const frameProcessor = useFrameProcessor(
//     (frame) => {
//       'worklet';
//       const labels = labelImage(frame);

//       //console.log('Labels:', labels);
//       console.log('Labels:', labels[0]?.label, labels[0]?.bounds)
//       currentLabel.value = labels[0]?.label;
//     },
//     [currentLabel]
//   );

//   return (
//     <View style={styles.container}>
//       {device != null && hasPermission ? (
//         <>
//           <Camera
//             style={styles.camera}
//             device={device}
//             isActive={true}
//             frameProcessor={frameProcessor}
//             frameProcessorFps={3}
//           />
//           <Label sharedValue={currentLabel} />
//         </>
//       ) : (
//         <ActivityIndicator size="large" color="white" />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'black',
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
// });

//======================================================================================================================
// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function App() {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Open up App.js to start working on your app!</Text>
// //       <StatusBar style="auto" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });

// import * as React from 'react';
// import { Text, View, StyleSheet } from 'react-native';
// import Constants from 'expo-constants';
// // npm install @react-navigation/native --save해줬음
// import {NavigationContainer} from '@react-navigation/native';

// // bottomtabnavigation은 바꿀거임 우리 앱에 맞게 일단은 사이즈 보려고 넣어둔거임
// import BottomTab from './Components/BottomTab';
// import Navigation from './Components/StackNavigation';
// // import BottomTabNavigationApp from './Navigation/BottomTabNavigationApp';
// // import Navigation from './Navigation/Navigation';

// // test
// // import Test from './Test';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <NavigationContainer>
//         <Navigation />
//       </NavigationContainer>
//     </View>
//     // <Test />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// // import React, { useRef, useEffect } from 'react';
// // import { StyleSheet, View, ActivityIndicator } from 'react-native';
// // import { Camera, useCameraDevices } from 'react-native-vision-camera';

// // const LoadingView = () => (
// //   <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
// //     <ActivityIndicator size="large" color="#0000ff" />
// //   </View>
// // );

// // export default function App() {
// //   const cameraRef = useRef(null);
// //   useEffect(() => {
// //     const getPermission = async () => {
// //       const cameraPermission = await Camera.getCameraPermissionStatus();
// //       const microphonePermission = await Camera.getMicrophonePermissionStatus();
// //       await Camera.requestCameraPermission();
// //       await Camera.requestMicrophonePermission();
// //     };
// //     getPermission();
// //   }, []);

// //   const devices = useCameraDevices()
// //   const device = devices.back

// //   if (device == null) return <LoadingView />
// //   return (
// //     <Camera
// //       style={StyleSheet.absoluteFill}
// //       device={device}
// //       isActive={true}
// //     />
// //   )
// // }