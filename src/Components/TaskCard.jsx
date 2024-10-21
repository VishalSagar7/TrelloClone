import React, { useState } from 'react';
import { useContext } from 'react';
import { trelloContext } from '../App';
import { useDrag } from "react-dnd";
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const TaskCard = ({ data, id }) => {
    const ctx = useContext(trelloContext);

    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [editedTask, setEditedTask] = useState(data); // Track edited task name

    const [properties, ref] = useDrag(() => ({
        type: "CARD",
        item: { data, sourceId: id },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0 : 1,
            background: monitor.isDragging() ? "#23262B" : "#23262B"
        })
    }), [data]);

    const handleEdit = () => {
        if (isEditing && editedTask !== data) {
            // Dispatch the edited task
            ctx.dispatch({
                type: "EDIT_ITEM",
                payload: {
                    listName: id,
                    oldData: data,
                    newData: editedTask
                },
            });
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        // Dispatch to remove the task
        ctx.dispatch({
            type: "DELETE_ITEM",
            payload: {
                listName: id,
                data: data
            },
        });
    };

    return (
        <div
            ref={ref}
            style={{ opacity: properties.opacity, background: properties.background }}
            className='bg-[#23262B] text-white min-h-[40px] py-[5px] w-full px-[10px] flex items-center justify-between rounded' >

            {isEditing ? (
                <input
                    className="bg-[#1d1f23] text-white w-full mr-[10px] px-[5px] rounded"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    autoFocus
                />
            ) : (
                <h1 className='text-base font-semibold'>{data}</h1>
            )}

            <div className='flex gap-[10px]'>
                {/* Edit Button */}
                <button onClick={handleEdit} className='text-gray-400 hover:text-white'>
                    {isEditing ? 'Save' : <EditSharpIcon />}
                </button>

                {/* Delete Button */}
                <button onClick={handleDelete} className='text-red-400 hover:text-red-600'>
                    <DeleteSharpIcon />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
