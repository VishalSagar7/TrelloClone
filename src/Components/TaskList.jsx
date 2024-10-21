import React, { useRef, useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { useContext } from 'react';
import { trelloContext } from '../App';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useDrop } from "react-dnd";

const TaskList = (props) => {
    const [showInputBox, setShowInputBox] = useState(false);
    const inputRef = useRef();
    const ctx = useContext(trelloContext) ?? {};

    const [properties, ref] = useDrop({
        accept: "CARD",
        drop: (item) => {
            ctx.dispatch({
                type: "MOVE_ITEM",
                payload: {
                    data: item,
                    destinationList: props?.id,
                }
            })
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            abcd: true
        }),
    })

    const id = props.id ?? {};

    const addButtonHandle = () => {
        const task = inputRef.current.value;
        ctx.dispatch({
            type: "Add_Item",
            payload: {
                data: task,
                listName: props.id,
            },
        });
        inputRef.current.value = "";
        setShowInputBox(false);
    };

    return (
        <div ref={ref} className="flex  flex-col bg-[#111205] w-[350px] p-[15px] pt-[10px] rounded ">
            <h1 className="text-lg  text-gray-200 text-left mb-[10px]">{props?.title}</h1>

            <div className="flex  flex-col justify-between gap-[10px] overflow-hidden transition-all duration-500 ease-in-out max-h-[1000px]">
                {ctx?.state[id]?.map((data, index) => (
                    <TaskCard key={index} data={data} id={id} index={index} />
                ))}
            </div>

            {showInputBox ? (
                <div className="mt-[10px]">
                    <textarea
                        ref={inputRef}
                        className="h-[60px] text-white bg-[#23262B] pt-[5px] w-full rounded outline-none pl-[10px] "
                        placeholder="Enter task"
                    />
                    <div className="flex justify-left gap-[20px] mt-[10px]">
                        <button
                            onClick={addButtonHandle}
                            className="h-[35px] rounded w-[100px] text-black font-mono bg-sky-500 hover:bg-blue-400">
                            Add task
                        </button>
                        <button
                            onClick={() => setShowInputBox(false)}
                            className="h-[35px] rounded  text-white ">
                            <CloseSharpIcon />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowInputBox(true)}
                    className="h-[35px] rounded w-full mt-[10px] pl-[10px] text-left  bg-[#111205] text-white hover:bg-[#4e5157]">
                    + Add new task
                </button>
            )}
        </div>
    );
};

export default TaskList;
