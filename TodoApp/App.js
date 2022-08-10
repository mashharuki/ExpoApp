import React from "react";
import React from 'react';
import TodoScreen from "./src/TodoScreen";
import store, { persistor } from "./src/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

/**
 * Appコンポーネント
 * React.Componentを継承する。
 */
export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TodoScreen />
        </PersistGate>
      </Provider> 
    )
  }
}