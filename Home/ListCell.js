var React   = require("react-native");
var timeago = require('./timeago');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} = React;

var ListCell = React.createClass({
  render: function() {
    var data = this.props.data;
    var avatar_url = data.user.avatar_url;
    if ((avatar_url.substr(0, 2) == '//')) {
      avatar_url = 'https:' + avatar_url;
    }
    return (
      <TouchableHighlight underlayColor = {'lightblue'} onPress = {this.props.onSelect}>
        <View style = {styles.container}>
          <Image style = {styles.avatar}
            source = {{uri: avatar_url}} />
          <View style = {styles.topic}>
            <Text style = {styles.title}>
              {data.title}
            </Text>
            {this._renderInfo()}
          </View>
          {this._renderCommentCount()}
        </View>
      </TouchableHighlight>
    )
  },

  _renderInfo: function(){
		var data = this.props.data;
		if(data.replied_at){
			return (
						<Text style = {styles.info}>
							<Text style = {styles.node_name}>{data.node_name}</Text> •
							<Text style = {styles.user}>{data.user.login}</Text> •
							<Text>最后由</Text>
							<Text style = {styles.user}>{data.node_name}</Text>
							<Text style = {styles.time}>于{timeago(data.replied_at)}发布</Text>
						</Text>
						);
		}
		return (
						<Text style = {styles.info}>
							<Text style = {styles.node_name}>{data.node_name}</Text> •
							<Text style = {styles.user}>{data.user.login}</Text> •
							<Text style = {styles.time}>于{timeago(data.replied_at)}发布</Text>
						</Text>
			);
	},

  _renderCommentCount: function() {
    var data = this.props.data;
    if (data.replies_count) {
      if(data.replies_count > 99){
        data.replies_count = '99+';
      }
      return(
        <View style = {styles.commentWrapper}>
          <Text style = {styles.commentNumText}>{data.replies_count}</Text>
        </View>
      );
    }
    return;
  },
});

var styles = React.StyleSheet.create({
  container: {
    flex:              1,
    padding:           10,
    borderColor:       '#E2E2E2',
    borderBottomWidth: 1,
    flexDirection:     'row',
    justifyContent:    'center',
    backgroundColor:   '#ffffff',
  },
  avatar: {
    alignSelf:    'center',
    width:        50,
    height:       50,
    borderRadius: 25,
  },
  topic: {
    flex:         1,
    marginBottom: 5,
    marginLeft:   8,
  },
  title: {
    fontSize:   14,
    textAlign:  'left',
    color:      '#356DD0',
  },
  info: {
    fontSize:  12,
    textAlign: 'left',
    color:     '#aaaaaa',
    marginTop: 5,
  },
  node_name: {
    color:       '#778087',
    marginRight: 5,
    marginLeft:  5,
  },
  user: {
    color:       '#666666',
    marginRight: 5,
    marginLeft:  5,
  },
  commentWrapper:{
    borderRadius:    10,
    paddingTop:      2,
    paddingBottom:   2,
    paddingLeft:     10,
    paddingRight:    10,
    marginLeft:      8,
    justifyContent:  'center',
    backgroundColor: '#ACD0CE',
    alignItems:      'center',
    height:          18,
    width:           50,
  },
  commentNumText:{
    color:      '#ffffff',
    fontWeight: 'bold',
  },
});

module.exports = ListCell;
