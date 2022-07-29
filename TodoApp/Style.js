import {
    StyleSheet,
    StatusBar,
    Platform
} from 'react-native';
import { isIphoneSE, concernSESize } from "react-native-iphone-se-helper";

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
    height: isIphoneSE() ? 80 : 50,
    flexDirection: isIphoneSE() ? '' : 'row',
    paddingRight: isIphoneSE() ? 0 : 10,
    paddingBottom : isIphoneSE() ? 30 : 0,
  },
  inputText: {
    paddingLeft:10,
    paddingRight: 10,
    flex: 1,
    color: 'black',
  },
  inputButton: {
    width: 48,
    height: 48,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 48,
    backgroundColor: '#ff6347',
  },
  // 5: TODO表示用のスタイル
  todoItem: {
    fontSize: 20,
    // backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  },
});

export default Styles;