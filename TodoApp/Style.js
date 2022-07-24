import {
    StyleSheet,
    StatusBar,
    Platform
} from 'react-native';

// 高さを固定する
const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

/**
 * スタイルシートの定義
 */
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1
  },
  input: {
    height: 30,
    flexDirection: 'row',
  },
  inputText: {
    flex: 1,
  },
  inputButton: {
    width: 100,
  },
  // 5: TODO表示用のスタイル
  todoItem: {
    fontSize: 20,
    backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  },
});

export default Styles;