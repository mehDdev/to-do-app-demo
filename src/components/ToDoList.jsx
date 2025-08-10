import { ChevronDown, ChevronUp, LoaderCircle, Plus, Search } from "lucide-react"
import { useEffect, useReducer, useRef, useState } from "react"
import ToDos from "../components/ToDos";
import { toast } from "react-toastify";
import toDoReducer from "../reducers/toDoReducer";
import { ToDosContext } from "../context/ToDosContext";
import ThemeToggle from "../components/ThemeToggle";
import TodoModal from "./Modal";

function ToDoList() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  const [isLoading, setIsLoading] = useState(true);
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const [todosDisplayer, setTodosDisplayer] = useState(false);
  const [toDos, toDoDispatcher] = useReducer(toDoReducer, []);
  const [modal, setModal] = useState(false);
  const modalInputRef  = useRef(null);

  const getToDoListFromApi = async () => {
    try {
      // Fetch the todo list from the API
      const res = await fetch(apiUrl);
      // Check if the response is ok
      if (!res.ok) throw new Error('Request failed');
      // Parse the response data
      let data = await res.json();
      // Limiting to 6 items
      data = data.slice(0, 4);
      return data
    } catch (error) {
      console.error('Error fetching to do list:', error);
      toast.error('Failed to fetch to do list');
      return [];
    }
  };
  const renderToDos = async () => {
    // Fetch the todo list from the API
    let toDosData = await getToDoListFromApi();
    // Dispatch the action to render the todo list
    toDoDispatcher({
      type: 'render',
      todos: toDosData
    });    
    // Close loading
    setIsLoading(false);  
      
  };
  const addToDo = async () => {
    // Get the input value from the modal input ref
    const addTodoInp = modalInputRef.current;
    // Check if the modal input is not null
    if (!addTodoInp.value) {
      toast.error('Please enter a todo');
      return;
    }
    // Create a new todo object
    const newToDo = {
      title: addTodoInp.value,
    };
    
    try {
      // Send a POST request to the API to add a new todo
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newToDo)
      });
      // Check if the response is ok
      if (!res.ok) throw new Error('Request failed');
      // Parse the response data
      const dataTodo = await res.json();
      // Dispatch the action to add the new todo
      toDoDispatcher({
        type: 'add',
        id: Date.now(),
        title: dataTodo.title
      })
      // Clear the modal input
      emptyModalInput();
      // Close the modal
      setModal(false);
      // Show success message
      toast.success('New todo added');
      
    } catch (error) { 
      // Log the error
      console.error('Error adding todo:', error);
      // Show error message
      toast.error('Failed to add todo');
    }

  };
  const editToDo = async () => {
    // Get the input value from the modal input ref
    const modalInput = modalInputRef.current;
    // Check if the input is not empty
    if (!modalInput.value) {    
      toast.error('Please enter a todo');
      return;
    }

    try {
      // Create a new todo object with the id and title
      const newToDo = {
        id: modalInput.dataset.toDoId,
        title: modalInput.value
      };
      // Send a PUT request to the API to update the todo
      const res = await fetch(`${apiUrl}/${newToDo.id}`, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({ title: newToDo.title })
      });
      // Parse the response data
      const dataTodo = await res.json();  
      // Check if the response is ok
      if (!res.ok) throw new Error('Request failed');
      // Update the todo list in the state
      toDoDispatcher({
        type: 'edit',
        todos: toDos,
        toDoId: dataTodo.id,
        newTitle: dataTodo.title
      });
      // Clear the modal input
      emptyModalInput();
      // Close the modal
      setModal(false);
      // Show success message
      toast.success('Todo updated');

    } catch (err) { 
      console.error('Error editing todo:', err);      
      toast.error('Failed to edit todo');
    }
    
  };
  const handleModalCancel = () => {
    emptyModalInput();
    setModal(false);

  };
  const handleModalApply = (e) => {
    // Check if the key pressed is Enter or if the event is a click
    if (e.key === 'Enter' || e.type === 'click') {
      // Check if the modal is in add or edit mode
      if (modal === 'add') {
        addToDo();
        emptyModalInput();

      } else if (modal === 'edit') {
        editToDo();
        emptyModalInput();
      };

    }

  };
  const searchToDo = (e) => {
    console.log(todosDisplayer);
    console.log(toDos);
    console.log(`input value`);
    console.log(typeof e.target.value);
    
    if (e.target.value === '') {
      setTodosDisplayer(false);
      return
    };

    const searchToDoInp = e.target.value;
    const resultSearch = toDos.filter((toDo) => toDo.title.includes(searchToDoInp));
    setTodosDisplayer(resultSearch);
    
  };
  const filteringToDos = async (e) => {
    if (e.target.tagName !== 'LI') return;
    
    try {
      const filter = e.target.dataset.filter;
      
      setTodosDisplayer(
        toDos.filter(toDo => {
          if (filter === "All") return true;
          if (filter === "Complete") return toDo.completed === true;
          if (filter === "Incomplete") return toDo.completed === false;
        })
      );
      
    } catch (err) {
      console.error(err);
    }
  };
  const emptyModalInput = () => {
    modalInputRef.current.value = '';
  }

  useEffect(() => {
    const currentTodo = JSON.parse(sessionStorage.getItem('current-todo'));
    // If there is a current todo in sessionStorage, set it to the modal input
    if (modal === 'edit' && currentTodo) {
      modalInputRef.current.dataset.toDoId = currentTodo.id;
      modalInputRef.current.value = currentTodo.title;
      sessionStorage.removeItem('current-todo');

    }

    setTimeout(() => {
      modalInputRef.current?.focus();
    }, 50);

  }, [modal]);

  useEffect(() => { 
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.documentElement.classList.add('dark'); 
    renderToDos();

  }, []);
  
  return (
    <div className="relative">
      <header className="md:w-187.5">
        <div className="px-4 md:px-0">
          {/* Title */}
          <div>
            <h1 className="mt-10 text-center text-2xl md:text-2.5xl font-medium text-custom-black dark:text-custom-white">
              TO DO LIST
            </h1>
          </div>
          {/* Search box, Dropdown menu and Theme toggle */}
          <div className="flex gap-x-4 mt-4.5">
            {/* Search box */}
            <div className="grow-1">
              <div className="flex items-center gap-x-4 h-9.5 px-4 py-2.5 border border-custom-purple dark:border-custom-white rounded-md ring-2 ring-transparent focus-within:ring-custom-purple/40 dark:focus-within:ring-custom-white/40 transition-all">
                <input type="text" placeholder="Search..." className="w-full text-custom-purple dark:text-white outline-none" onKeyUp={searchToDo} />
                <button type="button" className="cursor-pointer">
                  <Search className="size-6 text-custom-purple dark:text-custom-white" />
                </button>
              </div>
            </div>
            {/* Dropdown menu */}
            <div>
              <div className={`relative flex justify-between items-center w-23.25 h-9.5 px-2.5 bg-custom-purple ${dropDownMenu ? 'bg-custom-purple-2': ''} rounded-md border-2 border-transparent hover:shadow-normal transition-all cursor-pointer text-white`} 
              onClick={() => setDropDownMenu(!dropDownMenu)} >
                <span>
                  ALL
                </span>
                <ChevronDown className={`${dropDownMenu ? 'hidden': ''}`} />
                <ChevronUp className={`${dropDownMenu ? '': 'hidden'}`} />
                <div className={`absolute -left-0.5 -right-0.5 top-9 py-2 bg-custom-white opacity-0 invisible border border-custom-purple rounded-md transition-all ${dropDownMenu ? '!opacity-100 !visible' : ''}`}>
                  <ul className="space-y-2 *:px-1.5  *:text-base *:text-custom-purple *:hover:bg-custom-purple/20 *:transition-all" onClick={filteringToDos}>
                  {
                    ['All', 'Complete', 'Incomplete'].map(item => {
                      return <li key={item} data-filter={item}>{item}</li>
                    })
                  }
                  </ul>
                </div>
              </div>
            </div>
            {/* Theme toggle */}
            <div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="flex justify-center h-180 mt-7.5">
        <section className="w-full md:w-130 h-full mx-auto overflow-auto">
          <div className="container">
          {
            isLoading ? (
              <div className="h-full">
                <LoaderCircle className="size-8 mx-auto animate-spin text-custom-purple" />
              </div>
            ) : toDos ? (
              <ToDosContext.Provider
                value={{
                  toDos: todosDisplayer || toDos,
                  toDoDispatcher,
                  todosDisplayer,
                  setTodosDisplayer,
                  apiUrl,
                  modal,
                  setModal
                }}
              >
                <ToDos />
              </ToDosContext.Provider>
            ) : (
              <div>
                <img
                  src="./src/images/vectors/detective-check-foot-print-1.svg"
                  alt="Detective check foot print"
                  className="dark:hidden mx-auto"
                />
                <img
                  src="./src/images/vectors/detective-check-foot-print-2.svg"
                  alt="Detective check foot print"
                  className="hidden dark:block mx-auto"
                />
              </div>
            )
          }
          </div>
        </section>
        <article className="absolute bottom-8 left-2 right-2 flex flex-col-reverse md:flex-row justify-between items-center gap-y-4">
          {/* Demo mode banner */}
          <p className="md:right-0 w-fit bg-custom-white/80 dark:bg-custom-black/80 text-sm text-custom-purple dark:text-custom-white border border-custom-purple dark:border-custom-white rounded-md px-2.5 py-1.5">
            This is a demo version of the app using a fake API.
            <br />
            It uses <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noopener" className="font-bold underline">JSONPlaceholder</a> for testing and demo purposes only.
          </p>
          {/* Add button */}
          <button type="button" className=" flex justify-center items-center size-12.5 bg-custom-purple hover:bg-custom-purple-2 border-2 border-custom-purple hover:shadow-normal transition-all rounded-full cursor-pointer"
          onClick={() => setModal('add')} >
            <Plus className="size-6 text-white" />
          </button>
        </article>
      </main>
      <TodoModal
        modal={modal}
        modalInputRef={modalInputRef}
        handleModalApply={handleModalApply}
        handleModalCancel={handleModalCancel}
      />
    </div>
  )
};

export default ToDoList;