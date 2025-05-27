import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";

const CameraApp = () => {

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const [cameraActive, setCameraActive] = useState(false);

  
  const cameraRef = useRef<CameraType | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {

    return <View />;
  }

  if (!permission.granted) {
  
    return (
      <View style={styles.container}>
        <Text >We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  
  
  return (
    <View style={styles.container}>
      {cameraActive ? (
     
        <CameraView 
          style={styles.camera}
        
        >

          <Text style={styles.buttonText}>Camera is active!</Text>
        </CameraView >
      ) : (
      
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCameraActive(true)} 
        >
          <Text style={styles.buttonText}>Turn on camera 📸</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f0f0f0" 
  },
  button: { 
    backgroundColor: "#007AFF", 
    padding: 15, 
    borderRadius: 10 
  },
  buttonText: { 
    color: "white", 
    fontSize: 18 
  },
  camera: { 
    flex: 1, 
    width: "100%", 
    justifyContent: "flex-end", 
    alignItems: "center" 
  },
});

export default CameraApp;
