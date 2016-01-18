/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Api = require('../NetWork/API');
var NodesList = require('../Topic/NodesList');
var {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  ActivityIndicatorIOS,
} = React;

var Nodes = React.createClass({
  getInitialState: function() {
    return {
      nodes:  [],
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  render: function() {
    if (!this.state.loaded) {
      return this._renderLoading();
    }
    return this._renderNodeList();
  },

  fetchData: function () {
    fetch(Api.Nodes())
    .then((response) => {
      console.log(response.__proto__);
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData.__proto__);
      if (!responseData.nodes) {
        return;
      }

      this.setState({
        nodes:  responseData.nodes,
        loaded: true,
      });
    });
  },

  _renderLoading: function() {
    return(
      <View style = {styles.container}>
        <ActivityIndicatorIOS
          size  = "small"
          color = "#356DD0"
          />
      </View>
    );
  },

  _renderNodeList: function() {
    return(
      <ScrollView style = {{marginTop:64, marginBottom: 49}}>
        {this._renderNodesAuto()}
      </ScrollView>
    );
  },

  _renderNodesAuto: function() {
    var row    = [];
    var nodes  = this.state.nodes;
    //Math.ceil()执行向上舍入，即它总是将数值向上舍入为最接近的整数
    var rowNum = Math.ceil(nodes.length / 3);
    for (var i = 1; i <= rowNum; i++) {
      //slice() 方法可从已有的数组中返回选定的元素。
      row.push(nodes.slice((i - 1) * 3, i * 3));
    };
    return row.map(this._renderNodes);
  },

  _renderNodes: function(nodes, i) {
    return(
      <View style = {styles.nodes} key = {i}>
        {nodes.map(this._renderNodeCell)}
      </View>
    );
  },

  //要有一个key来标识每个控件，否则会出现警告
  _renderNodeCell: function(data, i) {
    return(
      <TouchableHighlight underlayColor = {'lightblue'}
        key = {i}
        onPress = {
          () => this._selectNode(data)
        }>
        <View style = {styles.nodeWrapper}>
          <Text style = {styles.node}>
            {data.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _selectNode: function(data) {
    this.props.navigator.push({
      title: data.name,
      component: NodesList,
      passProps: {data: data},
    });
  },
});

var styles = StyleSheet.create({
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: '#F5FCFF',
  },
  node: {
    fontSize:   14,
    fontWeight: 'bold',
    textAlign:  'center',
    color:      '#666E74',
  },
  nodeWrapper: {
    flex:            1,
    backgroundColor: '#ACD0CE',
    flexDirection:   'row',
    justifyContent:  'center',
    padding:         8,
    margin:          5,
    marginBottom:    5,
    width:           (Dimensions.get('window').width - 6 * 5 - 16) / 3,
  },
  nodes: {
    flex:          1,
    padding:       8,
    flexDirection: 'row',
  },
});

module.exports = Nodes;
