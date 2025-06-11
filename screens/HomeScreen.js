import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, 
  TouchableOpacity, FlatList, Keyboard, Alert, ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [categories, setCategories] = useState(["General", "Meeting", "To-Do"]);
  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [noteContent, setNoteContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { saveData(); }, [categories, notes]);

  const loadData = async () => {
    try {
      const categoriesData = await AsyncStorage.getItem('@categories');
      const notesData = await AsyncStorage.getItem('@notes');
      if (categoriesData) setCategories(JSON.parse(categoriesData));
      if (notesData) setNotes(JSON.parse(notesData));
    } catch (error) {
      console.log("Failed to load data", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@categories', JSON.stringify(categories));
      await AsyncStorage.setItem('@notes', JSON.stringify(notes));
    } catch (error) {
      console.log("Failed to save data", error);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() === '') return;
    if (categories.includes(newCategory)) {
      Alert.alert("Category already exists");
      return;
    }
    setCategories([...categories, newCategory]);
    setNewCategory('');
    Keyboard.dismiss();
  };

  const deleteCategory = (category) => {
    if (category === "General") {
      Alert.alert("Cannot delete default category");
      return;
    }
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category}" and its notes?`,
      [
        { text: "Cancel" },
        {
          text: "Delete", style: "destructive", onPress: () => {
            const updatedCategories = categories.filter(c => c !== category);
            const updatedNotes = notes.filter(note => note.category !== category);
            setCategories(updatedCategories);
            setNotes(updatedNotes);
            if (selectedCategory === category) setSelectedCategory("General");
          }
        }
      ]
    );
  };

  const saveNote = () => {
    if (noteContent.trim() === '') return;
    if (editingNoteId) {
      const updatedNotes = notes.map(note =>
        note.id === editingNoteId 
          ? { ...note, content: noteContent, category: selectedCategory }
          : note
      );
      setNotes(updatedNotes);
      setEditingNoteId(null);
    } else {
      const newNote = {
        id: Date.now(),
        content: noteContent,
        category: selectedCategory,
        date: new Date().toLocaleDateString(),
      };
      setNotes([newNote, ...notes]);
    }
    setNoteContent('');
    Keyboard.dismiss();
  };

  const editNote = (note) => {
    setNoteContent(note.content);
    setSelectedCategory(note.category);
    setEditingNoteId(note.id);
  };

  const deleteNote = (id) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: () => {
          setNotes(notes.filter(note => note.id !== id));
          if (editingNoteId === id) {
            setEditingNoteId(null);
            setNoteContent('');
          }
        }}
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>EveryNote</Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search your note"
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="calendar-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={{ marginLeft: 15 }}>
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((item) => (
            <View key={item} style={styles.categoryWrapper}>
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item && styles.categorySelected
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>

              {item !== "General" && (
                <TouchableOpacity
                  style={styles.deleteCategoryBtn}
                  onPress={() => deleteCategory(item)}
                >
                  <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.newCategoryContainer}>
            <TextInput
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="+ Create Category"
              placeholderTextColor="#666"
              style={styles.newCategoryInput}
              onSubmitEditing={addCategory}
            />
          </View>
        </ScrollView>

        {/* Date */}
        <Text style={styles.date}>{new Date().toDateString()}</Text>

        {/* Note Input */}
        <TextInput
          placeholder="What's on your mind today?"
          placeholderTextColor="#666"
          value={noteContent}
          onChangeText={setNoteContent}
          style={styles.noteInput}
          multiline
        />
        <TouchableOpacity style={styles.addBtn} onPress={saveNote}>
          <Text style={styles.addBtnText}>{editingNoteId ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>

        {/* Notes List */}
        <FlatList
          data={notes}
          keyExtractor={item => item.id.toString()}
          style={{ marginTop: 20 }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <Text style={styles.noteCategory}>#{item.category}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => editNote(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNote(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  appTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { flexDirection: 'row', marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: '#111', borderRadius: 10, padding: 12, color: '#fff' },
  categoryContainer: { marginBottom: 10 },
  categoryWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  categoryItem: {
    paddingVertical: 6, paddingHorizontal: 14, backgroundColor: '#111',
    borderRadius: 20, borderColor: '#333', borderWidth: 1,
  },
  categorySelected: { backgroundColor: 'gray' },
  categoryText: { color: '#fff' },
  deleteCategoryBtn: { marginLeft: 5 },
  newCategoryContainer: { justifyContent: 'center' },
  newCategoryInput: {
    backgroundColor: '#111', paddingHorizontal: 10, borderRadius: 20,
    width: 140, color: '#fff', borderColor: '#333', borderWidth: 1,
  },
  date: { color: '#fff', fontSize: 16, marginVertical: 10 },
  noteInput: {
    backgroundColor: '#111', color: '#fff', borderRadius: 10,
    padding: 15, height: 550, textAlignVertical: 'top',
    fontSize: 18, fontStyle: 'italic'
  },
  addBtn: {
    backgroundColor: '#fff', padding: 12, borderRadius: 10,
    alignItems: 'center', marginTop: 10,
  },
  addBtnText: { fontWeight: 'bold' },
  noteCard: {
    backgroundColor: '#111', padding: 15, borderRadius: 10, marginVertical: 8,
  },
  noteCategory: { color: '#aaa', fontStyle: 'italic', marginBottom: 5 },
  noteContent: { color: '#fff', fontSize: 16 },
  noteDate: { color: '#555', fontSize: 12, marginTop: 5 },
  buttonRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' },
  editBtn: { marginRight: 10, backgroundColor: '#3498db', padding: 8, borderRadius: 5 },
  deleteBtn: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
