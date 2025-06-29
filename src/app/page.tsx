"use client"
import { useState, useEffect } from "react";
import NoteForm from "@/components/NoteForm";
import NotesList from "@/components/NotesList";

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);

  // Component mount olduktan sonra localStorage'dan notları yükle
  useEffect(() => {
    setMounted(true);
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Notlar yüklenirken hata oluştu:', error);
      }
    }
  }, []);

  // Notları localStorage'a kaydet (sadece mounted olduktan sonra)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, mounted]);

  const addNote = (content: string) => {
    const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: randomColor
    };
    
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, content, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Hydration sırasında loading göster
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Günlük Notlarım</h1>
          <p className="text-gray-600">Düşüncelerini post-it tarzında kaydet!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Yeni Not Ekle</h2>
              <NoteForm onAddNote={addNote} />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <NotesList notes={notes} onDeleteNote={deleteNote} onUpdateNote={updateNote} />
          </div>
        </div>
      </div>
    </div>
  );
}
