import { Trash2 } from "lucide-react"



function DeleteButton({ onClick: clickHandler }) {
    return (
        <button type="button" className="ml-2.5 cursor-pointer" onClick={clickHandler}>
            <Trash2 className="size-4.5 text-custom-gray hover:text-red-500 transition-colors" />
        </button>
    )
}

export default DeleteButton