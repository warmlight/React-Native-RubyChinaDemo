var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  Animated,
  LayoutAnimation,
} = React;

class imageDetail extends React.Component{
  constructor() {
    super();
  }

  render() {
  return (
    <View style = {styles.container}>
      <Text style = {styles.header}>耶耶耶耶耶</Text>
    </View>
    );
  }
}

// class Playground extends React.Component {
//   constructor(props: any) {
//     console.log('i am constructor');
//     super(props);
//     this.state = {
//       bounceValue: new Animated.Value(0),
//     };
//   }
//   render(): ReactElement {
//     console.log('i am rendering');
//     console.log(this.state.bounceValue);
//     return (
//       <Animated.Image                         // Base: Image, Text, View
//         source={{uri: 'http://pic.nipic.com/2007-11-09/2007119122519868_2.jpg'}}
//         style={{
//           flex: 1,
//   width:100,
//           height:5,
//           transform: [                        // `transform` is an ordered array
//             {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
//           ]
//         }}
//       />
//     );
//   }
//   componentDidMount() {
//     console.log('i am componentDidMount');
//     this.state.bounceValue.setValue(1.5);     // Start large
//     Animated.spring(                          // Base: spring, decay, timing
//       this.state.bounceValue,                 // Animate `bounceValue`
//       {
//         toValue: 0.8,                         // Animate to smaller size
//         friction: 0,                          // Bouncier spring
//       }
//     ).start();                                // Start the animation
//   }
// }

var styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'white',
    paddingTop:64,
  },
});

module.exports = imageDetail;
// AppRegistry.registerComponent('MoveTest', () => imageDetail);
