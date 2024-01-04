import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Note 1', x: 50, y: 50, pinned: false, width: 150, height: 100 },
  ]);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });

  const boardRef = useRef(null);

  useEffect(() => {
    const updateBoardPosition = () => {
      const boardRect = boardRef.current.getBoundingClientRect();
      setBoardPosition({ x: boardRect.left, y: boardRect.top });
    };

    window.addEventListener('resize', updateBoardPosition);
    updateBoardPosition(); // Initial position

    return () => {
      window.removeEventListener('resize', updateBoardPosition);
    };
  }, []);

  const addNote = () => {
    const newNote = {
      id: notes.length + 1,
      text: 'New Note',
      x: 0,
      y: 0,
      pinned: false,
      width: 150,
      height: 100,
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const handleEdit = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, editing: !note.editing } : note
      )
    );
  };

  const handleEditChange = (id, newText) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text: newText } : note
      )
    );
  };

  const handleEditBlur = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, editing: false } : note
      )
    );
  };

  return (
    <div
    className="notice-board"
    ref={boardRef}
    style={{ position: 'relative', overflow: 'hidden' }}
  >
    <button className="add-button" onClick={addNote}>
      +
    </button>
    {notes.map((note) => (
      <Draggable
      key={note.id}
      defaultPosition={{ x: note.x, y: note.y }}
      onStart={(e, data) => handleEditBlur(note.id)}
      onDrag={(e, data) => {
        if (note.pinned) {
          // If the note is pinned, prevent dragging
          data.x = 0;
          data.y = 0;
        }
      }}
      onStop={(e, data) => {
        if (note.pinned) {

          setNotes((prevNotes) =>
            prevNotes.map((prevNote) =>
              prevNote.id === note.id ? { ...prevNote, x: 0, y: 0 } : prevNote
            )
          );
        }
      }}
      draggable={!note.pinned} 
      >
        <div
          className={`sticky-note ${note.pinned ? 'pinned' : ''}`}
          style={{ width: note.width, height: note.height }}
        >
          <div className="controls">
            <button onClick={() => deleteNote(note.id)}>x</button>
            <button onClick={() => togglePin(note.id)}>
              {note.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => handleEdit(note.id)}>
              {note.editing ? 'Save' : 'Edit'}
            </button>
          </div>
          {note.editing ? (
            <textarea
              value={note.text}
              onChange={(e) => handleEditChange(note.id, e.target.value)}
              onBlur={() => handleEditBlur(note.id)}
              autoFocus
            />
          ) : (
            <div className="note-content" onClick={() => handleEdit(note.id)}>
              {note.text}
            </div>
          )}
        </div>
      </Draggable>
    ))}
  </div>
  );
};

export default App;
