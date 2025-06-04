import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type Note = {
  id: string;
  text: string;
  priority: number;
  completed: boolean;
  completedAt?: Date;
  imageUri?: string;
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [priority, setPriority] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (editingNoteId !== null) {
      const noteToEdit = notes.find(note => note.id === editingNoteId);
      if (noteToEdit) {
        setNewNote(noteToEdit.text);
        setPriority(noteToEdit.priority);
        setSelectedImage(noteToEdit.imageUri || null);
      }
    } else {
      setNewNote('');
      setPriority(1);
      setSelectedImage(null);
    }
  }, [editingNoteId, notes]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
    
        const notesWithDates = parsedNotes.map(note => {
          if (note.completed && note.completedAt) {
            return { ...note, completedAt: new Date(note.completedAt) };
          }
          return note;
        });
        setNotes(notesWithDates);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          "Camera Permission",
          "We need camera access to take photos. Please enable it in your device settings.",
          [{ text: "OK" }]
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
    } catch (error) {
      Alert.alert("Error", "Could not access camera. Please try again.");
      console.log(error);
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const activeTasks = notes.filter(note => !note.completed).length;
      if (activeTasks >= 9) {
        Alert.alert(
          'Maximum Tasks Reached',
          'You have reached the maximum of 9 active tasks. Please complete or remove some tasks before adding new ones.'
        );
        return;
      }

      const note: Note = {
        id: Date.now().toString(),
        text: newNote,
        priority,
        completed: false,
        imageUri: selectedImage || undefined
      };

      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setNewNote('');
      setPriority(1);
      setSelectedImage(null);
    }
  };

  const updateNote = () => {
    if (editingNoteId === null || !newNote.trim()) {
      return; // Should not happen if UI is correct, but for safety
    }

    const updatedNotes = notes.map(note => {
      if (note.id === editingNoteId) {
        return {
          ...note,
          text: newNote,
          priority: priority, // Allow changing priority during edit
          imageUri: selectedImage || undefined,
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNoteId(null); // Exit editing mode
  };

  const cancelEdit = () => {
    setEditingNoteId(null); // Exit editing mode
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return { ...note, completed: true, completedAt: new Date() };
      }
      return note;
    });
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const activeNotes = notes.filter(note => !note.completed);
  const completedNotes = notes.filter(note => note.completed);

  return (
    <>
      <Stack.Screen options={{ title: "Tasks" }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.counter}>Active Tasks: {activeNotes.length}/9</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newNote}
            onChangeText={setNewNote}
            placeholder="Add a new task..."
            placeholderTextColor="#666"
          />
          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {[1, 2, 3].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === p && styles.priorityButtonTextActive,
                  ]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonText}>📸</Text>
          </TouchableOpacity>

          {/* Show Add Task button when not editing */}
          {editingNoteId === null && (
            <TouchableOpacity
              style={[styles.addButton, activeNotes.length >= 9 && styles.addButtonDisabled]}
              onPress={addNote}
              disabled={activeNotes.length >= 9}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          )}

          {/* Show Save and Cancel buttons when editing */}
          {editingNoteId !== null && (
            <View style={styles.editingButtonsContainer}>
              <TouchableOpacity style={styles.addButtonEditing} onPress={updateNote}>
                <Text style={styles.addButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButtonEditing} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView style={styles.notesList}>
          {activeNotes.map((note) => (
            <TouchableOpacity 
              key={note.id} 
              onPress={() => setEditingNoteId(note.id)} 
              style={[
                styles.noteItem,
                {
                  borderLeftColor: 
                    note.priority === 3 ? '#FF3B30' : 
                    note.priority === 2 ? '#4CAF50' : 
                    '#007AFF'
                },
                editingNoteId === note.id && styles.editingItem,
              ]}
            >
              <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.completionButtonLeft}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#808080" /> 
              </TouchableOpacity>
              <View style={styles.noteContent}>
                <Text style={styles.noteText}>{note.text}</Text>
                <View style={styles.priorityIndicator}>
                  {[...Array(note.priority)].map((_, i) => (
                    <Text 
                      key={i} 
                      style={[
                        styles.priorityDot,
                        {
                          color: 
                            note.priority === 3 ? '#FF3B30' : 
                            note.priority === 2 ? '#4CAF50' : 
                            '#007AFF'
                        }
                      ]}>
                      •
                    </Text>
                  ))}
                </View>
                {note.imageUri && (
                  <Image source={{ uri: note.imageUri }} style={styles.noteImage} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {completedNotes.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.completedTitle}>Completed Tasks</Text>
              {completedNotes.map((note) => (
                <View key={note.id} style={styles.completedNoteItem}>
                  <Text style={styles.completedNoteText}>{note.text}</Text>
                  {note.imageUri && (
                    <Image source={{ uri: note.imageUri }} style={styles.completedNoteImage} />
                  )}
                  <Text style={styles.completedDate}>
                    {note.completedAt?.toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  counter: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#666',
  },
  priorityButtons: {
    flexDirection: 'row',
  },
  priorityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#666',
  },
  priorityButtonTextActive: {
    color: 'white',
  },
  cameraButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 5,
  },
  noteContent: {
    flex: 1,
    marginRight: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  priorityIndicator: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  priorityDot: {
    fontSize: 20,
    color: '#007AFF',
    marginRight: 2,
  },
  noteImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 5,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#999', // Gray color for cancel
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editingItem: {
    borderColor: '#007AFF', // Highlight color
    borderWidth: 2,
  },
  editingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButtonEditing: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonEditing: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  completedNoteItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  completedNoteText: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  completedNoteImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  completedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
}); 