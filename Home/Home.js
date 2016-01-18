/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 'use strict';

 var React       = require('react-native');
 var ListCell    = require('./ListCell');
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

 var CACHE         = [];
 var firstLoad     = true;

 var Home = React.createClass({
   getInitialState: function() {
     console.log('getInitialState');
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
     this.fetchData(1);
   },

   render: function() {
     if (this.state.loadingPage == 1 && !this.state.loaded && firstLoad) {
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
                                         endRefreshing();
                                         }}
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

   _renderTopicListCell: function(data) {
     console.log('renderCell');
     return(
       <ListCell data     = {data}
                 onSelect = {() => this.selectTopic(data)}>
       </ListCell>
     );
   },

   _onEndReached: function() {
     if(!this.state.loaded) {
       return;
     }
     return this.fetchData(this.state.currentPage + 1);
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
   },

   fetchData: function(page) {
     this.setState({
       loaded:      false,
       loadingPage: page,
     });
     var limit  = 20;
     var offset = (page - 1) * limit;

     fetch(Api.HomeTopics(offset, limit))
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
       if (this.state.getData) {
         CACHE = [];
       }
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
         }
         if (!this.state.getData) {
           this.setState({
             dataSource:  this.state.dataSource.cloneWithRows(CACHE),
             loaded:      true,
             currentPage: this.state.currentPage + 1,
           });
         }
         this.state.getData = false;
         firstLoad          = false;
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

 module.exports = Home;
