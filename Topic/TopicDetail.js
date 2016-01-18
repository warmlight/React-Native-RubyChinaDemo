'use strict';

var React = require('react-native');
var {
	Text,
	View,
	Image,
	ListView,
	ScrollView,
  StyleSheet,
	ActivityIndicatorIOS
} = React;


var Api         = require('../NetWork/API');
var timeago     = require('../Home/timeago');
var CommentCell = require('./CommentCell');
var HTMLView    = require('react-native-htmlview');

var HaveMoreComment = true;
var OLD_TOPIC_ID    = 0;
var CACHE           = [];

var TopicDetail     = React.createClass({
  getInitialState: function() {
    console.log('getInitialState');
    return {
      commentsDataSource: new ListView.DataSource({
        rowHasChanged:(r1, r2) => r1 !== r2
      }),
      loaded:             false,
      comment_loaded:     false,
      currentPage:        0,
    };
  },

  componentDidMount: function() {
    console.log('componentDidMount');
    this._fetchData();
    this._fetchCommentData(1);
  },

  render: function() {
    return (
      <View style = {{flex:1, marginTop: 64}}>
        {this._renderTopicHeader()}
        {this._renderContent()}
      </View>
    );
  },

  _renderTopicHeader: function() {
    var avatar_url = this.props.data.user.avatar_url;
    if (avatar_url.substr(0, 2) == '//') {
      avatar_url = 'https' + avatar_url;
    }
    return(
      <View style = {styles.header}>
        <View>
          <Text style = {styles.title}>
            {this.props.data.title}
          </Text>
          {this._renderInfo()}
        </View>
        <Image style = {styles.avatar}
          source = {{uri: avatar_url}} />
      </View>
    );
  },

  _renderInfo: function() {
    return(
      <Text style = {styles.info}>
        <Text style = {styles.node_name}>{this.props.data.node_name}</Text>
        •
        <Text style = {styles.user}>{this.props.data.user.login}</Text>
        <Text style = {styles.time}>于{timeago(this.props.data.replied_at)}发布</Text>
      </Text>
    );
  },

  _renderContent: function() {
    if (!this.state.loaded || !this.state.comment_loaded) {
      return(
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicatorIOS
            size  = "small"
            color = "#356DD0"
            />
        </View>
      );
    }
    return(
      <ListView
        style                            = {{marginBottom: 49}}
        renderHeader                     = {this._renderTopicContent}
        dataSource                       = {this.state.commentsDataSource}
        renderRow                        = {this._renderComments}
        renderfooter                     = {this._renderFooter}
        onEndReached                     = {this._onEndReached}
        automaticallyAdjustContentInsets = {false}
        showsVerticalScrollIndicator     = {false}
        >
      </ListView>

    );
  },

  _renderTopicContent: function() {
    return(
      <View style = {{flex: 1, backgroundColor: '#ffffff'}}>
        <View style = {{borderBottomWidth: 1, borderColor: '#cccccc'}}>
          <Text style = {styles.content}>
            <HTMLView value = {this.state.topic.body}
              stylesheet = {HTMLStyle}/>
          </Text>
        </View>
      </View>
    );
  },

  _renderComments: function(data){
    return (
      <CommentCell data={data} />
    );
  },

  _renderFooter: function() {
    if (!this.state.comment_loaded) {
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

  _onEndReached: function() {
    if (!this.state.comment_loaded){
      return;
    }
    if (HaveMoreComment) {
      return this._fetchCommentData(this.state.currentPage + 1);
    }
  },

  _fetchData: function() {
    console.log(Api.Topic(this.props.data.id));
    fetch(Api.Topic(this.props.data.id))
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((responseData) => {
      console.log('responseData ' + responseData);
      var regex = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g
      responseData.topic.body = responseData.topic.body.replace(regex, "<a href='$1'>$1</a>")
      this.setState({
        topic:          responseData.topic,
        loaded:         true,
        comment_loaded: this.state.comment_loaded,
      });
    })
    .done();
  },

  _fetchCommentData: function(page) {
    if (OLD_TOPIC_ID && (this.props.data.id != OLD_TOPIC_ID)) {
      CACHE = [];
    }
    var limit  = 20;
    var offset = limit * (page - 1);
    fetch(Api.Comments(this.props.data.id, offset, limit))
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      OLD_TOPIC_ID = this.props.data.id;
      this._cache(responseData.replies);
      this.setState({
        commentsDataSource: this.state.commentsDataSource.cloneWithRows(CACHE),
        currentPage:        page,
        loaded:             this.state.loaded,
        comment_loaded:     true,
      });
    })
    .done();
  },

  _cache: function(items) {
    for (var i in items) {
      CACHE.push(items[i])
    }
    if (items.length < 20) {
      HaveMoreComment = false;
    }
  },

});

var styles = StyleSheet.create({
  header: {
    flexDirection:     'row',
    backgroundColor:   '#f5f5f5',
    borderColor:       '#e9e9e9',
    borderBottomWidth: 1,
    padding:           5,
  },
  title: {
    fontSize:   16,
    fontWeight: 'bold',
    textAlign:  'left',
  },
  info: {
    fontSize:  12,
    marginTop: 5,
    textAlign: 'left',
    color:     '#666666',
  },
  avatar: {
    width:        50,
    height:       50,
    borderRadius: 4,
    marginLeft:   5,
  },
  node_name: {
    backgroundColor: '#f5f5f5',
    color:           '#778087',
    marginRight:     5,
  },
  user: {
    color:       '#666666',
    marginRight: 5,
    marginLeft:  5,
  },
  content: {
    fontSize: 14,
    color:    '#666666',
    padding:  10,
  },
});

var HTMLStyle = StyleSheet.create({
  a: {
    fontWeight: '300',
    color:      '#4D939F',
  },
});

module.exports = TopicDetail;
