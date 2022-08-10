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
  ListItem,
} from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/Feather";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import styles from './../Style'; 
import { addTodo, toggleTodo } from './actionCreators';

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;
const TODO = "@todoapp.todo";

/**
 * Todoを表示するためのコンポーネント
 * @param {*} props 引数
 * @returns 
 */
const TodoItem = (props) => {

  let icon = null;

  if (props.done === true) {
    icon = <Icon2 name='done'/>
  }

  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <ListItem
        title={props.title}
        rightIcon={icon}
        bottomDivider
      /> 
    </TouchableOpacity>
  )
}

/**
 * TodoScreenコンポーネント
 */
class TodoScreen extends React.Component {

  /**
   * コンストラクター
   */
  constructor(props) {
    super(props);
    // ステート変数
    this.state = {
      inputText: "",
      filterText: "",
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

    // データをセットする。
    this.state.addTodo(title);
    // ステート変数を更新する。
    this.setState({
      inputText: ""
    })
  }

  /**
   * Todoをタップした時のメソッド
   * @param {*} todoItem 選択したTodo
   */
  onTapTodoItem = (todoItem) => {
    // actionCreatorsの関数を呼び出す。
    this.props.toggleTodo(todoItem);
  }

  render() {

    const filterText = this.state.filterText

    let todo = this.props.todos

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

/**
 * todoReducerのstateをpropsへマップするためのメソッド
 */
const mapStateToProps = state => {
  return {
    todos: state.todos.todos,
  }
};

/**
 * actionCreatorsの関数をpropsへマップするためのメソッド
 */
const mapDispatchToProps = dispatch => {
  return {
    addTodo(text) {
      dispatch(addTodo(text))
    },
    toggleTodo(todo) {
      dispatch(toggleTodo(todo))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoScreen);