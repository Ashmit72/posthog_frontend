// src/App.tsx
import './App.css';
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask,postTasks , TaskState, patchTask, fetchTasks } from "../slices/taskSlice";
import { AppDispatch, RootState } from '../store/store.ts';
import { MdOutlineModeEditOutline } from "react-icons/md";
import Navbar from './components/Navbar/Navbar.tsx';
import ExperimentLayout from './layouts/ExperimentLayout/ExperimentLayout.tsx';
import { useFeatureFlagEnabled,useFeatureFlagPayload } from 'posthog-js/react'


const App = () => {
  const dispatch:AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks);
  const experiment=useSelector((state:RootState)=>state.experiment);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [completed, setIsCompleted] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const flagEnabled = useFeatureFlagEnabled('test-app')
  const payload = useFeatureFlagPayload('test-app')

  // console.log("Flag Enabled:", flagEnabled);
// console.log("Payload:", payload);


  useEffect(()=>{
    dispatch(fetchTasks())
  },[])


  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editTask && editingTaskId !== null) {
      // Update existing task
      const updatedTask: TaskState = {
        id: editingTaskId,
        title,
        description,
        completed
      };
      dispatch(patchTask(updatedTask));
      setEditTask(false);
      setEditingTaskId(null);
      dispatch(fetchTasks())
    } else {
      // Create new task
      const newTask: TaskState = {
        id: Math.random() * 1000,
        title,
        description,
        completed
      };
      dispatch(postTasks(newTask));
      dispatch(fetchTasks())
    }
    
    setTitle("");
    setDescription("");
    setIsCompleted(false);
  };

  
  const handleEdit = (task: TaskState) => {
    setTitle(task.title);
    setDescription(task.description);
    setIsCompleted(task.completed);
    setEditingTaskId(task.id);
    setEditTask(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
    dispatch(fetchTasks())
  };

  return (
    <>
    <Navbar/>
    {experiment?(<ExperimentLayout/>):(
      <div className='container'>
        {flagEnabled && payload?(
          <>
          <h1 style={{textAlign:'center',marginBottom:'1rem',color:'greenyellow'}} >Welcome</h1>
          <p style={{textAlign:'center',marginBottom:'1rem', color:"red"}} >Thanks for trying out our feature flags.</p>
          </>
        ):null}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter The Title"
          type="text"
          required
          />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter The Description"
          type="text"
          required
          />
        {editTask && (
          <label style={{ display: 'flex', gap: '1rem', cursor: 'pointer' }}>
            <input
              type='checkbox'
              checked={completed}
              onChange={() => setIsCompleted(!completed)}
              />
            Completed
          </label>
        )}
        <button type="submit">{editTask ? 'Edit Task' : 'Add Task'}</button>
      </form>

      <h2>Task List</h2>
      <ul>
        {tasks.map((task: TaskState) => (
          <li className='lists' key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status:{task.completed ? "Completed" : "Not Completed"}</p>
            <MdOutlineModeEditOutline onClick={() => handleEdit(task)} className='icon' />
            <button style={{ background: 'red', width: 'fit-content', margin: '0 auto' }} onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>)}
    </>
  );
};

export default App;
