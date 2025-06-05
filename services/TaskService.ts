import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../models/Note';

export const loadNotes = async (): Promise<Note[]> => {
  try {
    console.log('TaskService: Loading notes...');
    const savedNotes = await AsyncStorage.getItem('notes');
    if (savedNotes) {
      console.log('TaskService: Found saved notes.');
      const parsedNotes: Note[] = JSON.parse(savedNotes);
      const notesWithDates = parsedNotes.map(note => {
        if (note.completed && note.completedAt) {
          return { ...note, completedAt: new Date(note.completedAt) };
        }
        return note;
      });
      console.log('TaskService: Loaded notes count:', notesWithDates.length);
      return notesWithDates;
    }
    console.log('TaskService: No saved notes found.');
    return [];
  } catch (error) {
    console.error('TaskService: Error loading notes:', error);
    return [];
  }
};

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    console.log('TaskService: Saving notes...', notes.length);
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
    console.log('TaskService: Notes saved successfully.');
  } catch (error) {
    console.error('TaskService: Error saving notes:', error);
  }
}; 