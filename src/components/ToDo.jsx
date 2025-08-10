import Checkbox from "./Checkbox"
import EditButton from "./EditButton"
import DeleteButton from "./DeleteButton"
import { useContext } from "react"
import { ToDosContext } from "../context/ToDosContext"
import { toast } from "react-toastify"

function ToDo({ id, title, completed }) {
  const {
    apiUrl,
    toDoDispatcher,
    setTodosDisplayer,
    setModal,
  } = useContext(ToDosContext);

  const deleteToDo = async (ToDoId) => {
    try {
      // Make a DELETE request to the API
      const res = await fetch(`${apiUrl}/${ToDoId}`, {
        method: 'DELETE',
      });
      // Check if the request was successful
      if (!res.ok) throw new Error('Request failed');
      // Update the local state
      toDoDispatcher({
        type: 'delete',
        ToDoId
      });
      // Update the todosDisplayer state to remove the deleted ToDo
      setTodosDisplayer(prev => {
        if (!prev) return null;
        return prev.filter(todo => todo.id !== ToDoId);
      });
      // Show success message
      toast.success('To do deleted successfully');

    } catch (err) {
      // Log the error  
      console.error('Error deleting todo:', err);
      // Show error message
      toast.error('Failed to delete ToDo');

    }
  };
  const changeCompletedToDo = async (toDoId, toDoCompleted) => {
    // Create a new object with the updated completed status
    const newToDo = {
      completed: !toDoCompleted
    };
    // Make a PUT request to the API to update the completed status
    const res = await fetch(`${apiUrl}/${toDoId}`, {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(newToDo)
    });
    // Check if the request was successful
    if (!res.ok) throw new Error('Request failed');
    // Update the local state
    toDoDispatcher({
      type: 'change-completed',
      toDoId,
      toDoCompleted
    })
    
  };
  const editMode = (toDoId, toDoTitle) => {
    // Store the current ToDo in sessionStorage
    sessionStorage.setItem('current-todo', JSON.stringify({ id: toDoId, title: toDoTitle }));
    // Set the modal to 'edit' mode
    setModal('edit');
  };

  return (
    <div className="group flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center">
            <Checkbox label={title} checked={completed} onClick={() => changeCompletedToDo(id, completed)} />
        </div>
        {/* Right section */}
        <div className="flex md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible md:transition-all">
          <EditButton onClick={() => editMode(id, title)} />
          <DeleteButton onClick={() => deleteToDo(id)} />
        </div>
    </div>
  )
};

export default ToDo;