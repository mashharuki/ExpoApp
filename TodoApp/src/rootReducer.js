import { combineReducers } from "redux";
import todoReducer from "./todoReducer";

/**
 * Todoを扱うためのReducer
 */
export default combineReducers({
    todos: todoReducer
})