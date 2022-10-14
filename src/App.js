import './index.css';
import React, { useEffect } from "react";
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import { useState } from "react";
import AddTask from './components/AddTask';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import About from './components/About';



function App() {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)
    }
    getTasks()
  }, [])


// fetch tasks
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}

const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

// Code to delete task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',
  } )
  setTasks(tasks.filter((task) => task.id !== id ))}

// Code to toggle reminder 
const toggleReminder = async (id) => {
  const taskToToggle =  await fetchTask(id)
  const updtask = {...taskToToggle,
  reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updtask)
  })

  const data = await res.json()

  setTasks(
    tasks.map((task) => task.id === id ? 
    {...task, reminder: data.reminder} 
    : task))
} 

// code to addtask
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()
  setTasks([...tasks, data])
  // const id = Math.floor(Math.random() * 100000) + 1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}

  return (
  <Router>
    <div className="container">
      <Header onAdd = {() => setShowAddTask(!showAddTask)} 
      showAdd = {showAddTask}/>
      {showAddTask && <AddTask onAdd = {addTask}/>}
      {tasks.length ? (
      <Tasks  tasks = {tasks} onDelete ={deleteTask} 
      onToggle = {toggleReminder}/>) : ("No Tasks") }
      <Routes>
      <Route path= '/about' component={About}/>
      </Routes>
      <Footer/>
    </div>
  </Router>
  )
}

export default App;
