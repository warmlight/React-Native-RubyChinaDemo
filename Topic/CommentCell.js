'use strict';
var React    = require('react-native');
var timeago  = require('../Home/timeago');
var HTMLView = require('react-native-htmlview');

var {
  View,
  Text,
  Image,
  StyleSheet,
} = React;

var CommentCell = React.createClass({
  render: function() {
    var data           = this.props.data;
    var body           = data.body_html.replace(/<\/?[^>]+>/g,'');
    var commentContent = body.replace(/^#/, '回复');
    var regex = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g
    commentContent = commentContent.replace(regex, '<a href=$1>$1</a>');

    var avatar_url = data.user.avatar_url;
    if (avatar_url.substr(0, 2) == '//') {
      avatar_url = 'https:' + avatar_url;
    }
    return(
      <View style = {styles.container}>
        <Image style = {styles.avatar}
          source = {{uri: avatar_url}} />

        <View style = {styles.content}>

          <View style = {styles.infoBar}>
            <Text style = {styles.nickName}>
              {data.user.name}
            </Text>

            <Text style = {styles.time}>
              {timeago(data.created_at)}
            </Text>
          </View>

          <Text style = {styles.comment}>
            <HTMLView value = {commentContent}
              stylesheet = {HTMLStyle}/>
          </Text>

        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex:              1,
    padding:           8,
    borderBottomWidth: 1,
    flexDirection:     'row',
    borderColor:       '#eeeeee',
    justifyContent:    'center',
    backgroundColor:   '#ffffff',
  },
  avatar: {
    width:        30,
    height:       30,
    marginLeft:   5,
    borderRadius: 15,
  },
  content: {
    flex:         1,
    marginBottom: 5,
    marginLeft:   10
  },
  infoBar: {
    flexDirection: 'row',
  },
  nickName: {
    color:      '#356DD0',
    marginLeft: 3,
  },
  time: {
    fontSize:   12,
    marginLeft: 5,
    color:      '666666',
  },
  comment: {
    paddingTop: 5,
    fontSize:   12,
    color:      '#666666',
  },
});

var HTMLStyle = StyleSheet.create({
  a: {
    color:      '#4D939F',
  },
})

module.exports = CommentCell;
