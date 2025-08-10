import ToDoList from "./ToDoList";
import '../styles/main.css'

function App() {
  return (
    <div className="fixed inset-0 flex justify-center bg-custom-white dark:bg-custom-black font-inter select-none">
      <ToDoList />
    </div>
  );
}

export default App;