import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Alert } from 'react-native';

export const takePhoto = async (setSelectedImage: (uri: string) => void) => {
  const cameraPermission = await Camera.requestCameraPermissionsAsync();
  if (cameraPermission.status !== 'granted') {
    Alert.alert(
      'Camera Permission',
      'We need camera access to take photos. Please enable it in your device settings.',
      [{ text: 'OK' }]
    );
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    cameraType: ImagePicker.CameraType.back,
  });
  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);
  }
}; 