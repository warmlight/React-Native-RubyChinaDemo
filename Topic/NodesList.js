/**
* Sample React Native App
* https://github.com/facebook/react-native
*/

'use strict';

var React       = require('react-native');
var ListCell    = require('../Home/ListCell');
var Api         = require('../NetWork/API');
var TopicDetail = require('../Topic/TopicDetail');
var {
  Text,
  View,
  Image,
  ListView,
  StyleSheet,
  AlertIOS,
  Animated,
  PanResponder,
  ActivityIndicatorIOS,
} = React;

var CACHE     = [];
var NODE_ID   = 0;
var firstLoad = true;
var HaveMore  = true;

var NodesList = React.createClass({
  getInitialState: function() {
    console.log('getInitialState');
    console.log(firstLoad);
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged:(r1, r2) => r1 !== r2
      }),
      loaded:        false,
      getData:       false,
      loadingPage:   0,
      currentPage:   0,
      headerHeight:  0,
    };
  },

  componentDidMount: function() {
    console.log('fetchData');
    this.fetchData(1);
  },

  render: function() {
    if (this.state.loadingPage == 1 && !this.state.loaded) {
      console.log('render')
      return(
        <View style = {styles.container}>
          <ActivityIndicatorIOS
            size  = "small"
            color = "#356DD0"
            />
        </View>
      );
    }

    return this._renderTopicList();
  },

  _renderTopicList: function() {
    return(
      <ListView
        ref                          = {'list'}
        style                        = {styles.ListView}
        pageSize                     = {20}
        dataSource                   = {this.state.dataSource}
        renderFooter                 = {this._renderFooter}
        renderRow                    = {this._renderTopicListCell}
        onEndReached                 = {this._onEndReached}
        showsVerticalScrollIndicator = {false}
        onRefreshStart               = {(endRefreshing) => {
          this.state.getData = true;
          this.fetchData(1);
          endRefreshing();}}
          >
        </ListView>
      );
    },

    _renderFooter: function() {
      if (!this.state.loaded) {
        return(
          <View style = {[styles.container, {height : 40}]}>
            <ActivityIndicatorIOS
              size  = "small"
              color = "#356DD0"
              />
          </View>
        );
      }
      return;
    },

    _renderTopicListCell: function(data){
      return (
        <ListCell
          onSelect={
            () => this.selectTopic(data)
          }
          data={data} />
      );
    },

    _onEndReached: function() {
      console.log('onEndReached');
      if(!this.state.loaded) {
        return;
      }
      if (HaveMore) {
        return this.fetchData(this.state.currentPage + 1);
      }
    },

    selectTopic: function(data) {
      console.log(this.props.navigator);
      this.props.navigator.push({
        title: '详情',
        component: TopicDetail,
        passProps: {data: data},
      });
    },

    cache: function(items) {
      for (var i in items) {
        CACHE.push(items[i]);
      }
      if (items.length < 20) {
        HaveMore = false;
      }
      console.log(CACHE.length);
    },

    fetchData: function(page) {
      this.setState({
        loaded:      false,
        loadingPage: page,
      });
      var limit  = 20;
      var offset = (page - 1) * limit;
      var node_id = this.props.data.id;
      if (node_id != NODE_ID) {
        CACHE = [];
      }

      fetch(Api.NodeTopics(node_id, offset, limit))
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        AlertIOS.alert(
          'error',
          '请求失败：' + error.message,
        );
      })
      .then((responseData) => {
        if(!responseData.topics){
          this.setState({end: true});
          return;
        }
        if (this.state.getData) {
          CACHE = [];
        }
        NODE_ID = node_id;
        this.cache(responseData.topics);
        if (responseData.error) {
          AlertIOS.alert (
            'error',
            responseData.error,
          );
        }else{
          if (this.state.getData) {
            this.setState({
              dataSource:  this.state.dataSource.cloneWithRows(CACHE),
              loaded:      true,
              currentPage: 1,
            });
          }else {
            this.setState({
              dataSource:  this.state.dataSource.cloneWithRows(CACHE),
              loaded:      true,
              currentPage: this.state.currentPage + 1,
            });
          }
          this.state.getData = false;
        }
      })
      .done();
    },
  });

var styles = StyleSheet.create({
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: 'lightblue',
  },
  backWrap: {
    flex: 1,
    marginTop: 64,
    backgroundColor: 'lightblue'
  },
  ListView: {
    marginTop:    64,
    marginBottom: 49,
  },
  refrsh: {
    marginBottom: 0,
    height:       100,
    width:        40,
  },
  header: {
    backgroundColor: 'lightblue',
    justifyContent:  'center',
    alignItems:      'center',
    flexDirection:   'row',
  },
});

module.exports = NodesList;
