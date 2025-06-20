import { useState,useEffect } from 'react'
import Note from './components/Note.jsx'
import Notification from './components/Notification.jsx'
import Footer from './components/Footer.jsx'
import noteService from './services/notes.js'


const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  },[])

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
    noteService
      .update(id,changedNote)
      .then((returnedNote) => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
      .catch(() => { 
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server'`
        )
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() <  0.5
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const handleNoteChange =  (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? 
  notes 
  : notes.filter(note => note.important)

  if (!notes)
    return null

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
        </button>
      <ul>
        {notesToShow.map(note => 
       <Note 
       key={note.id} 
       note={note}
       toggleImportance={() => toggleImportanceOf(note.id)}
       />
      )}
      </ul>
      <form onSubmit={addNote}>
      <input  
      value={newNote}
      onChange={handleNoteChange}
      />
      <button type='submit'>save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
