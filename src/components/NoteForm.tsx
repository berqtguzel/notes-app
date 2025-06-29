import { useState } from "react";

interface NoteFormProps {
  onAddNote: (note: string) => void;
}

export default function NoteForm({ onAddNote }: NoteFormProps) {
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim() === "") return;
    onAddNote(note);
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Bugün ne düşündün? Duygularını, planlarını veya aklına gelen her şeyi yazabilirsin..."
          className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
          rows={6}
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {note.length}/500
        </div>
      </div>
      
      <button
        type="submit"
        disabled={note.trim() === ""}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        ✨ Not Ekle
      </button>
    </form>
  );
}
