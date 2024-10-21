import { createContext, useReducer, useState } from 'react'
import TaskList from './Components/TaskList'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const trelloContext = createContext();

function App() {

  const initialState = {
    todoList: [],
    workingOnList: [],
    completedList: [],
  }

  const reducerFn = (state, action) => {
    switch (action.type) {
      case "Add_Item": {
        return {
          ...state,
          [action.payload.listName]: [...state[action.payload.listName], action.payload.data]
        };
      }

      case "MOVE_ITEM": {
        const sourceArray = state?.[action.payload?.data?.sourceId]?.filter((item) => item !== action.payload?.data?.data);
        return {
          ...state,
          [action.payload?.destinationList]: [...state[action.payload?.destinationList], action.payload?.data?.data],
          [action.payload?.data?.sourceId]: sourceArray,
        };
      }

      case "EDIT_ITEM": {
        const updatedList = state[action.payload.listName].map(item =>
          item === action.payload.oldData ? action.payload.newData : item
        );
        return {
          ...state,
          [action.payload.listName]: updatedList
        };
      }

      case "DELETE_ITEM": {
        const updatedList = state[action.payload.listName].filter(item => item !== action.payload.data);
        return {
          ...state,
          [action.payload.listName]: updatedList
        };
      }

      default:
        return state;
    }
  };


  const [state, dispatch] = useReducer(reducerFn, initialState)



  return (
    <div className='px-[150px] bg-sky-500 min-h-[100vh] pt-[20px]'>
      {/* <h1 className='text-3xl'>this is Trello</h1> */}

      <trelloContext.Provider value={{ state, dispatch }}>
        <DndProvider backend={HTML5Backend}>
          <div className='flex justify-between gap-[20px]'>
            <TaskList title="To do" id="todoList" />
            <TaskList title="Working on" id="workingOnList" />
            <TaskList title="Completed" id="completedList" />
          </div>
        </DndProvider>
      </trelloContext.Provider>
    </div>
  )
}

export default App
