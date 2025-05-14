import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import { Camera } from 'expo-camera';

type Note = {
  id: string;
  text: string;
  image: string | null;
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      // Request camera permission
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          "Camera Permission",
          "We need camera access to take photos. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch camera directly
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.back,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not access camera. Please try again.");
      console.log(error);
    }
  };

  const addNote = () => {
    if (noteText.trim().length === 0 && !selectedImage) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      text: noteText,
      image: selectedImage,
    };
    
    setNotes([...notes, newNote]);
    setNoteText('');
    setSelectedImage(null);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <>
      <Stack.Screen options={{ title: "Notes with Photos" }} />
      <View style={styles.container}>
        <ScrollView style={styles.noteList}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteText}>{note.text}</Text>
                
                {note.image && (
                  <Image source={{ uri: note.image }} style={styles.noteImage} />
                )}
                
                <TouchableOpacity 
                  onPress={() => deleteNote(note.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notes yet. Create your first note below!</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          {selectedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <Text style={styles.photoReadyText}>Photo ready to add ✓</Text>
            </View>
          ) : (
            <Text style={styles.photoHintText}>Take a photo to include with your note</Text>
          )}
          
          <TextInput
            style={styles.input}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Write your note..."
            multiline
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.buttonText}>📸 Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.addButton} onPress={addNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  noteList: {
    flex: 1,
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 10,
  },
  noteImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    minHeight: 80,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 5,
    width: 140,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  photoReadyText: {
    marginTop: 5,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  photoHintText: {
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
}); 