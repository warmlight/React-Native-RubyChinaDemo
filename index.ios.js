'use strict';

var React = require('react-native');
var Nodes = require('./Home/Nodes');
var Home  = require('./Home/Home');
var About = require('./Home/About');
var {
  AppRegistry,
  TabBarIOS,
  Navigator,
  NavigatorIOS,
  View,
  Text,
  StyleSheet
} = React;


var imitateTest = React.createClass({
  getInitialState: function() {
    return {
      selectedTab:'home',
    };
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor    = '#4D939F'
        barTintColor = '#ACD0CE'
      >
        <TabBarIOS.Item
          title    = '社区精华'
          icon     = {require('./Resources/icons/icon.png')}
          selected = {this.state.selectedTab === 'home'}
          onPress  = {() => {
            this.setState({
              selectedTab : 'home',
            });
          }}>
          <NavigatorIOS
            style        = {styles.nav}
            initialRoute = {{ title: '社区精华', component:Home }}
            shadowHidden = {true}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title    = '节点分类'
          icon     = {require('./Resources/icons/nodes.png')}
          selected = {this.state.selectedTab === 'nodes'}
          onPress  = {() => {
            this.setState({
              selectedTab : 'nodes',
            });
          }}>
          <NavigatorIOS
            style        = {styles.nav}
            initialRoute = {{ title: '节点分类', component: Nodes }}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title    = '关于'
          icon     = {require('./Resources/icons/reactnative_logo.png')}
          selected = {this.state.selectedTab === 'about'}
          onPress  = {() => {
            this.setState({
              selectedTab : 'about',
            });
          }}>
          <NavigatorIOS
            style        = {styles.nav}
            initialRoute = {{ title: '关于', component: About }}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  nav: {
    flex: 1
  }
});

module.exports = imitateTest;
AppRegistry.registerComponent('imitateTest', () => imitateTest);
