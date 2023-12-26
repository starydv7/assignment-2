import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Note 1', x: 50, y: 50, pinned: false, width: 150, height: 100 },
  ]);

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

  const handleDragStart = (e, id) => {
    const note = notes.find((n) => n.id === id);
    e.dataTransfer.setData('text/plain', id.toString());
    e.dataTransfer.setDragImage(e.target, note.width / 2, note.height / 2);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const note = notes.find((n) => n.id === id);
    if (note) {
      const x = e.clientX - note.width / 2;
      const y = e.clientY - note.height / 2;
      handleDrag(id, x, y);
    }
  };

  const handleDrag = (id, x, y) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, x, y } : note))
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

  const dragItem = useRef(null);

  useEffect(() => {
    const noticeBoard = document.querySelector('.notice-board');

    const handleMouseMove = (e) => {
      if (dragItem.current) {
        const x = e.clientX - dragItem.current.width / 2;
        const y = e.clientY - dragItem.current.height / 2;

        const maxX = noticeBoard.offsetWidth - dragItem.current.width;
        const maxY = noticeBoard.offsetHeight - dragItem.current.height;

        const boundedX = Math.min(Math.max(x, 0), maxX);
        const boundedY = Math.min(Math.max(y, 0), maxY);

        handleDrag(dragItem.current.id, boundedX, boundedY);
      }
    };

    const handleMouseUp = () => {
      dragItem.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [notes]);

  return (
    <div className="notice-board" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <button onClick={addNote}>+</button>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`sticky-note ${note.pinned ? 'pinned' : ''}`}
          style={{ top: note.y, left: note.x }}
          draggable={!note.pinned}
          onDragStart={(e) => {
            handleDragStart(e, note.id);
            dragItem.current = note;
          }}
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
            <input
              type="text"
              value={note.text}
              onChange={(e) => handleEditChange(note.id, e.target.value)}
              onBlur={() => handleEditBlur(note.id)}
              autoFocus
            />
          ) : (
            <div onClick={() => handleEdit(note.id)}>{note.text}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
