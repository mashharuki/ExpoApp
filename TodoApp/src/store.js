import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from './rootReducer';

// 永続化の設定
const persistConfig = {
    key: 'TODO',
    storage,
    whitelist: ['todos', 'currentIndex']  
};

// 新しいreducerを生成する。
const persistReducer = persistReducer(persistConfig, rootReducer);
// todo用のStore
const store = createStore(rootReducer);
// persistオブジェクトを生成する。
export const persistor = persistStore(store);

export default store;