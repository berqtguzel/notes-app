import { useState } from "react";
import { Note } from "@/app/page";

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, content: string) => void;
}

export default function NotesList({ notes, onDeleteNote, onUpdateNote }: NotesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdateNote(editingId, editContent);
      setEditingId(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">Henüz not eklenmedi.</p>
        <p className="text-gray-400 text-sm">İlk notunu eklemek için sol taraftaki formu kullan!</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return "Bugün";
    } else if (diffDays === 2) {
      return "Dün";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notlarım ({notes.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${note.color} rounded-xl p-6 shadow-lg transform hover:rotate-1 hover:scale-105 transition-all duration-200 relative group`}
            style={{
              transform: `rotate(${Math.random() * 4 - 2}deg)`,
            }}
          >
            {/* Butonlar */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <button
                onClick={() => startEdit(note)}
                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                title="Notu düzenle"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                title="Notu sil"
              >
                ×
              </button>
            </div>
            
            {/* Not içeriği */}
            <div className="mb-4">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-2 text-gray-800 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              )}
            </div>
            
            {/* Tarih bilgileri */}
            <div className="text-xs text-gray-600 space-y-1">
              <div className="font-medium">
                📅 Oluşturuldu: {formatDate(note.createdAt)} {formatTime(note.createdAt)}
              </div>
              {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                <div className="font-medium">
                  ✏️ Düzenlendi: {formatDate(note.updatedAt)} {formatTime(note.updatedAt)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
