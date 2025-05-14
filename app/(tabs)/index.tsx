import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";


export default function CameraScreen() {

  const [cameraActive, setCameraActive] = useState(false);
 
  const [permission, requestPermission] = useCameraPermissions();

  // If we don't have permission yet
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need access to your camera</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        // Show camera when active
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera}>
            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setCameraActive(false)}
              >
                <Text style={styles.buttonText}>Close Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        // Show button to open camera when inactive
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCameraActive(true)}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  }
});
