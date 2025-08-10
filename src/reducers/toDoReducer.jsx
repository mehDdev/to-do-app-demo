function toDoReducer(toDos, action) {
    switch (action.type) {
        case 'render':
            return action.todos
    
        case 'add':
            return [
                ...toDos,
                {
                    id: action.id,
                    title: action.title,
                    completed: false
                }
            ]
    
        case 'delete':
            return toDos.filter(todo => todo.id !== action.ToDoId)

        case 'edit':
            return toDos.map((todo) => {
                if (todo.id == action.toDoId) return {...todo, title: action.newTitle}
                return todo
            });

        case 'change-completed':
            return toDos.map((todo) => {
                if (todo.id == action.toDoId) return {...todo, completed: !action.toDoCompleted}
                return todo
            });
        
        default:
            return toDos;
        }
};

export default toDoReducer;