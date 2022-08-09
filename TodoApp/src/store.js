import { createStore } from "redux";
import rootReducer from './rootReducer';

// todo用のStore
export const store = createStore(rootReducer);