import React from 'react';
import { 
  Text, 
  View,
  ScrollView,
  FlatList,
  //TextInput,
  //Button,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import {
  SearchBar,
  Input,
  Button,
} from 'react-native-elements';
import Icon from "react-native-vector-icons/Feather";
import styles from './Style'; 

const TODO = "@todoapp.todo";

/**
 * Todoを表示するためのコンポーネント
 * @param {*} props 引数
 * @returns 
 */
const TodoItem = (props) => {
  let textStyle = styles.todoItem;

  if (props.done === true) {
    textStyle = styles.todoItemDone
  }

  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <Text style={textStyle}>{props.title}</Text>
    </TouchableOpacity>
  )
}

/**
 * Appコンポーネント
 */
export default class App extends React.Component {

  /**
   * コンストラクター
   */
  constructor(props) {
    super(props);
    // ステート変数
    this.state = {
      todo: [],
      currentIndex: 0,
      inputText: "",
      filterText: "",
    }
  }

  // 描画される前に実行するメソッド
  componentDidMount() {
    // loadTodoメソッドを呼び出す
    this.loadTodo()
  }

  /**
   * Todoメソッド
   */
  loadTodo = async () => {
    try {
      const todoString = await AsyncStorage.getItem(TODO)

      if (todoString) {
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({todo: todo, currentIndex: currentIndex})
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Todoを保管するメソッド
   * @param {*} todo Todo
   */
  saveTodo = async (todo) => {
    try {
      // json形式に変換する。
      const todoString = JSON.stringify(todo)
      // セットする。
      await AsyncStorage.setItem(TODO, todoString)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Todoを新規に追加するメソッド
   */
  onAddItem = () => {
    // タイトルを取得する。
    const title = this.state.inputText

    if (title == "") {
      return
    }

    const index = this.state.currentIndex + 1
    const newTodo = {index: index, title: title, done: false}
    const todo = [...this.state.todo, newTodo]
    // ステートを更新する。
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: ""
    })
    // データをセットする。
    this.saveTodo(todo)
  }

  /**
   * Todoをタップした時のメソッド
   * @param {*} todoItem 選択したTodo
   */
  onTapTodoItem = (todoItem) => {
    const todo = this.state.todo
    // IDを取得数r。
    const index = todo.indexOf(todoItem)
    // todoのステータスを変更する。
    todoItem.done = !todoItem.done
    // 内容を更新する。
    todo[index] = todoItem
    // ステートを変換する。
    this.setState({todo: todo})
    this.saveTodo(todo)
  }

  render() {

    const filterText = this.state.filterText

    let todo = this.state.todo

    if (filterText !== "") {
      todo = todo.filter(t => t.title.includes(filterText))
    }

    const platform = Platform.OS == 'ios' ? 'ios' : 'android';

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {/* SearchBar */}
        <SearchBar
          platform={platform}
          cancelButtonTitle="Cancel"
          onChangeText={(text) => {this.setState({filterText: text})}}
          onClear={() => this.setState({filterText: ""})}
          value={this.state.filterText}
          placeholder="Type filter text"
        />
        <ScrollView style={styles.todolist}>
          <FlatList 
            data={todo}
            extraData={this.state}
            /* TodoItemリスト */
            renderItem={({item}) =>
              <TodoItem
                title={item.title}
                done={item.done}
                onTapTodoItem={() => this.onTapTodoItem(item)}
                />
            }
            keyExtractor={(item, index) => "todo_" + item.index}
          />
        </ScrollView>
        <View style={styles.input}>
          <Input
            onChangeText={(text) => this.setState({inputText: text})}
            value={this.state.inputText}
            containerStyle={styles.inputText}
          />
          <Button
            icon={
              <Icon
                name='plus'
                size={30}
                color='white'
              />
            }
            onPress={this.onAddItem}
            title=""
            buttonStyle={styles.inputButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}
