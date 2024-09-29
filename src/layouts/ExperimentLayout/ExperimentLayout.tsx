import { FormEvent, useEffect, useState } from 'react'
import './experiment.css'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTask, fetchTasks, patchTask, postTasks, TaskState } from '../../../slices/taskSlice'
import { AppDispatch, RootState } from '../../../store/store'
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { useFeatureFlagVariantKey, useFeatureFlagPayload, PostHogFeature } from 'posthog-js/react'

const ExperimentLayout = () => {
  const variant = useFeatureFlagVariantKey('test-app')
  const payload = useFeatureFlagPayload('test-app')
  console.log("Variant is: ", variant);
  console.log(payload);


  const dispatch: AppDispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks)
  const [title, setTitle] = useState<string>('')
  const [id, setId] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [completed, setCompleted] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  async function handleTodoSubmit(e: FormEvent) {
    e.preventDefault()
    if (edit) {
      const editedTask: TaskState = {
        id,
        title,
        description,
        completed
      }
      dispatch(patchTask(editedTask))
      dispatch(fetchTasks())
      setTitle('')
      setDescription('')
      setCompleted(false)
      setEdit(false)
    }
    else {

      const newTask: TaskState = {
        id: Math.random() * 1000,
        title,
        description,
        completed
      }
      dispatch(postTasks(newTask))
      dispatch(fetchTasks())
      setTitle("")
      setDescription("")
      setCompleted(false)
    }
  }
  useEffect(() => {
    dispatch(fetchTasks())
  }, [])


  const handleTaskToggle = (task: TaskState) => {
    dispatch(patchTask({ ...task, completed: !task.completed }));
    dispatch(fetchTasks())
  };

  const handleDeleteTasks = (task: TaskState) => {
    dispatch(deleteTask(task.id))
    dispatch(fetchTasks())
  }

  const handleEditTasks = (task: TaskState) => {
    setEdit(true)
    setId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setCompleted(task.completed)
  }

  return (
    <div className="experiment-container" >
      <PostHogFeature flag='test-app' match={variant} >
        <h1 style={{marginBottom:"1rem"}} >Can Show Any Unique Component here!</h1>
      </PostHogFeature>
      <form onSubmit={handleTodoSubmit} className='experiment-form' >
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter the Title' />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} style={{ padding: '1rem', width: '100%' }} placeholder='Enter the Description'>
        </textarea>
        <button type='submit' >
          {edit ? 'Edit' : 'Add'}
        </button>
      </form>
      <div className="experiment-todo-container">
        {
          tasks.map((task: TaskState) => (
            <div key={task.id} className='experiment-todo' >
              <MdModeEdit onClick={() => handleEditTasks(task)} id='edit-icon' />
              <MdDelete onClick={() => handleDeleteTasks(task)} id='delete-icon' />
              <input checked={task.completed} onChange={() => handleTaskToggle(task)} id='completed-checkbox' type="checkbox" />
              {
                task.completed ? <del style={{ fontWeight: '500' }} >{task.title}</del> : <h1>{task.title}</h1>
              }
              {
                task.completed ? <del>{task.description}</del> : <p>{task.description}</p>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ExperimentLayout