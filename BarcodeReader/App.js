import React, {Component} from 'react';
import {
  View,
  Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

/**
 * Appコンポーネント
 */
export default class App extends Component<Props> {
  
  /**
   * コンストラクター
   */
  constructor(props) {
    super(props);
    this.state = {
      showBarcode: false,
    };
  }

  /**
   * バーコードの情報を受け取るためのメソッド
   */
  onBarcodeRead = (obj) => {
    if(!this.state.showBarcode) {
      this.setState({showBarcode: true});

      Alert.alert(
        'バーコード',
        obj.data,
        [
          {text: "閉じる", onPress: () => {this.setState({showBarcode: false})}}
        ]
      )
    }
  };

  render() {
    return(
      <View style={{flex: 1}}>
        <RNCamera
          style={{flex: 1}}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onBarCodeRead={this.onBarCodeRead}
        />
      </View>
    );
  }
};

