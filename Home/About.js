var React = require('react-native');
var {
  TouchableHighlight,
  Text ,
  Image,
  View,
  Dimensions,
  ActivityIndicatorIOS,
} = React;

var About = React.createClass ({
  getInitialState: function() {
    return {
      animating:true,
    };
  },

  render: function() {
    return (
      <View style = {styles.container}>

        <Image
          style       = {styles.logo}
          onLoad      = {this._endActivityIndicatior}
          onLoadStart = {this._startActivityIndicatior}
          source      = {{uri:'https://ruby-china-files.b0.upaiyun.com/assets/big_logo-5cdc3135cbb21938b8cd789bb9ffaa13.png'}}
          >
          <ActivityIndicatorIOS
            animating = {this.state.animating}
            style     = {[styles.activity, {height: 50}]}
            size      = "small"
            />
        </Image>

        <Text style = {styles.introduction}>
          Ruby China，对！没错！{'\n'}
          这里就是 Ruby 社区，目前这里已经是国内最权威的 Ruby 社区，拥有国内所有资深的 Ruby 工程师。
        </Text>

        <TouchableHighlight
          onPress       = {() => this._onPress('Ruby China', 'http://github.com/henter/ReactNativeRubyChina')}
          underlayColor = 'pink'
          activeOpacity = {0.9}
          >
          <Text style = {styles.link}>
            http://github.com/henter/ReactNativeRubyChina
          </Text>
        </TouchableHighlight>

      </View>
    );
  },

  _startActivityIndicatior:function(){
    this.setState({
      animating:true
    });
  },

  _endActivityIndicatior:function(){
    this.setState({
      animating:false
    });
  },

  _onPress: function(title, url) {
    this.props.navigator.push({
      title:     title,
      passProps: {url:url},
      component: require('../Web/Web'),
    });
  },
});

var styles = React.StyleSheet.create({
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: '#F5FCFF',
    padding:         10,
  },
  logo:{
    width:          Dimensions.get('window').width,
    height:         150,
    resizeMode:     Image.resizeMode.contain,
    justifyContent: 'center',
    alignItems:     'center',
  },
  activity: {
    backgroundColor: 'clear'
  },
  introduction:{
    fontSize:   18,
    textAlign:  'left',
    fontWeight: 'bold',
  },
  link:{
    fontSize:  10,
    color:     '#0e53e7',
    textAlign: 'center',
    marginTop: 10,
  }
});

module.exports = About;
