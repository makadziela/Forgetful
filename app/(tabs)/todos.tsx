import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// This is our main todos screen
export default function TodoScreen() {
  // Keep track of our todos and new todo input
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const router = useRouter();

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim().length === 0) return;
    setTodos([...todos, newTodo]);
    setNewTodo('');
  };

  
  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  // Navigate to notes screen
  const goToNotes = () => {
    router.push('/notes');
  };

  return (
    <View style={styles.container}>
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
}); 