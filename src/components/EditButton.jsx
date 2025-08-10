import { Pencil } from "lucide-react"



function EditButton({onClick: clickHandler }) {
    return (
        <button type="button" className="cursor-pointer" onClick={clickHandler}>
            <Pencil className="size-4.5 text-custom-gray hover:text-custom-purple transition-colors" />
        </button>
    )
}

export default EditButton