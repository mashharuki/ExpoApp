import React from 'react';
import {
  View, 
  Text, 
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { MapView } from 'react-native-maps';
import Styles from './Style';
import {
  point
} from '@turf/helpers';
import destination from '@turf/destination';
import { createStackNavigator } from 'react-navigation';

/**
 * MapScreenコンポーネント
 */ 
class MapScreen extends React.Component {

  // タイトル
  static navigationOptions = {
    title: 'トイレマップ',
  };

  gotoElementScreen = (element, title) => {
    this.props.navigation.navigate('Element', { 
      element: element,
      title: title,
    })
  };

  /**
   * TagItemコンポーネント
   */
  TagItem = (props) => {
    const { tag } = props;

    return (
      <View style={Styles.tagItem}>
        <View style={Styles.tag}>
          <Text>{tag[0]}</Text>
        </View>
        <View style={Styles.tag}>
          <Text>{tag[1]}</Text>
        </View>
      </View>
    );
  };

  /**
   * コンストラクター
   */
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      south: null,
      west: null,
      north: null,
      east: null,
    };
  }

  /**
   * 地図情報が更新される度にbboxを再計算するメソッド
   */
  onRegionChangeComplete = (region) => {
    const center = point([region.longitude, region.latitude]);
    // 111kmから縦幅、横幅を計算する。
    const verticalMeter = 111 * region.latitudeDelta / 2;
    const horizonalMeter = 111 * region.longitudeDelta / 2;
    // 実際の距離を計算する。
    const options = {units: 'kilometers'};
    const south = destination(center, verticalMeter, 180, options);
    const west = destination(center, horizonalMeter, -90, options);
    const north = destination(center, verticalMeter, 0, options);
    const east = destination(center, horizonalMeter, 90, options);
    // bboxに保存する。
    this.setState({
      south: south.geometry.coordinates[1],
      west: west.geometry.coordinates[0],
      north: north.geometry.coordinates[1],
      east: east.geometry.coordinates[0],
    });
  };

  /**
   * トイレの位置情報を取得するメソッド
   */
  fetchToilet = () => {
    // データを用意する。
    const south = this.state.south
    const west = this.state.west
    const north = this.state.north
    const east = this.state.east
    // Query
    const body = `
      [out:json];
        (
          node
            [amenity=toilets]
            (${south},${west},${north},${east});
          node
            ["toilets:wheelchair"=yes]
            (${south},${west},${north},${east});
        );
        out;
    `

    // API呼び出し用のオプション
    const options = {
      method: 'POST',
      body: body
    }
    // API取得
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', options)
      const json = await response.json()
      // update state
      this.setState({elements: json.elements})
    } catch (e) {
      console.log(e)
    }
  };

  render() {
    return (
      <>
        <MapView
          style={Styles.mapview}
          initialRegion={{
            latitude: 35.681262,
            longitude: 139.766403,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00521,
          }}
        >
          {
            this.state.elements.map((element) => {
              let title = "トイレ"
              if (element.tags["name"] !== undefined) {
                title = element.tags["name"]
              }
              // 7: マーカーの代わりにPointAnnotationを利用
              return (
                <MapboxGL.PointAnnotation
                  coordinate={[element.lon, element.lat]}
                  title=""
                  key={"id_" + element.id}
                  id={"id_" + element.id}
                  onCalloutPress={() => this.gotoElementScreen(element, title)}
                >
                  { /* 8: マーカーに相当するものがないのでViewでポイントを表示する */ }
                  <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill} />
                  </View>
                  { /* 9: PointAnnotationをタップした時のCalloutを指定する */ }
                  <MapboxGL.Callout title={title} />
                </MapboxGL.PointAnnotation>
              )
            })
          }
        </MapView>
        {/* Button */}
        <View style={Styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.fetchToilet()}
            style={Styles.button}
          >
            <Text style={Styles.buttonItem}>トイレ取得</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

/**
 * 詳細を表示するElementScreenコンポーネントを追加
 */
class ElementScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', '')
    }
  };

  render() {
    const { navigation } = this.props;
    const element = navigation.getParam('element', undefined);

    if (element === undefined) {
      return (<View/>);
    }

    return (
      <View>
        <Text>{element.id}</Text>
      </View>
    );
  }
};

/**
 * StackNavigatorを作成
 */
const RootStack = createStackNavigator(
  {
    Map: MapScreen,
    Element: ElementScreen,
  },
  {
    initialRouteName: 'Map'
  }
);

/**
 * Appコンポーネント
 */
export default class App extends React.Component {

  render() {
    return <RootStack/>;
  }
};