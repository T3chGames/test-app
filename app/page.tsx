"use client";
import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./components/Draggable";
import { Droppable } from "./components/Droppable";

const notesData = [
  {
    id: "1",
    content: "Study English",
    position: {
      x: 0,
      y: 0,
    },
  },
  {
    id: "2",
    content: "Study German",
    position: {
      x: 10,
      y: 10,
    },
  },
];

export default function App() {
  const [notes, setNotes] = useState(notesData);
  const [parent, setParent] = useState(null);

  function handleDragEnd(ev) {
    // What to do here??
    // It's not a sortable, it's a free drag and drop
    const note = notes.find((x) => x.id === ev.active.id);
    note.position.x += ev.delta.x;
    note.position.y += ev.delta.y;
    const _notes = notes.map((x) => {
      if (x.id === note.id) return note;
      return x;
    });
    setNotes(_notes);
    setParent(ev ? ev.over.id : null);
    console.log(ev.over.id);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {notes.map((note) => (
        <Draggable
          styles={{
            position: "absolute",
            left: `${note.position.x}px`,
            top: `${note.position.y}px`,
          }}
          key={note.id}
          id={note.id}
          content={note.content}
        />
      ))}

      <Droppable key="container" id="container"></Droppable>
    </DndContext>
  );
}
