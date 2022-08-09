import React from "react";
import React from 'react';
import TodoScreen from "./src/TodoScreen";
import {store} from "./src/store";
import { Provider } from "react-redux";

/**
 * Appコンポーネント
 * React.Componentを継承する。
 */
export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <TodoScreen />
      </Provider> 
    )
  }
}