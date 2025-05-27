import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  text: string;
  imageUri?: string;
  completed: boolean;
  completedAt?: Date;
};

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map(task => {
          if (task.completed && task.completedAt) {
            return { ...task, completedAt: new Date(task.completedAt) };
          }
          return task;
        });
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
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

  const addTask = () => {
    if (tasks.length >= 9) {
      Alert.alert(
        'Maximum Tasks Reached',
        'You have reached the maximum of 9 tasks. Please complete or remove some tasks before adding new ones.'
      );
      return;
    }
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        imageUri: selectedImage || undefined,
        completed: false
      };

      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setNewTask("");
      setSelectedImage(null);
    }
  };

  const removeTask = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: true, completedAt: new Date() };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <Text style={styles.counter}>Active Tasks: {activeTasks.length}/9</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Add new task"
        />
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, activeTasks.length >= 9 && styles.buttonDisabled]} 
          onPress={addTask}
          disabled={activeTasks.length >= 9}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
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

      <View style={styles.taskList}>
        {activeTasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskText}>{task.text}</Text>
              {task.imageUri && (
                <Image source={{ uri: task.imageUri }} style={styles.taskImage} />
              )}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeTask(task.id)}
            >
              <Text style={styles.removeButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        ))}

        {completedTasks.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedTitle}>Completed Tasks</Text>
            {completedTasks.map((task) => (
              <View key={task.id} style={styles.completedTaskItem}>
                <Text style={styles.completedTaskText}>{task.text}</Text>
                {task.imageUri && (
                  <Image source={{ uri: task.imageUri }} style={styles.completedTaskImage} />
                )}
                <Text style={styles.completedDate}>
                  {task.completedAt?.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  counter: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  cameraButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
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
  completedTaskItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  completedTaskText: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  completedTaskImage: {
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
