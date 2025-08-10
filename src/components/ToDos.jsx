import { useContext } from "react"
import ToDo from "./ToDo"
import { ToDosContext } from "../context/ToDosContext";

function ToDos() {
    const { toDos: toDosData } = useContext(ToDosContext);

    return (
        <div className="divide-y divide-custom-purple *:py-4.5 *:first:pt-0 *:last:pb-0">
            {
                toDosData.map(toDo => <ToDo key={toDo.id} {...toDo} />)
            }
        </div>
    )
};

export default ToDos;