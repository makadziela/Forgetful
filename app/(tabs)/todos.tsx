import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function TodoScreen() {

  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const router = useRouter();

  
  const addTodo = () => {
    if (todos.length >= 9) {
      Alert.alert(
        "Priority Limit Reached",
        "You cannot add more tasks. Maximum priority level is 9.",
        [{ text: "OK" }]
      );
      return;
    }
    if (newTodo.trim().length === 0) return;
    setTodos([...todos, newTodo]);
    setNewTodo('');
  };

  
  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };


  const goToNotes = () => {
    router.push('/notes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Tasks: {todos.length}/9</Text>
      {/* Input area for new todos */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add new task..."
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* List of todos */}
      <View style={styles.todoList}>
        {todos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <Text style={styles.todoText}>{todo}</Text>
            <TouchableOpacity 
              onPress={() => deleteTodo(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Button to navigate to notes */}
      <TouchableOpacity style={styles.notesButton} onPress={goToNotes}>
        <Text style={styles.notesButtonText}>Go to Notes with Photos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoText: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  notesButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  notesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  counter: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
}); 