import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {Text, View, StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';


class Pedido extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
    this.bounce = this.bounce.bind(this);
  }
  bounce(){
    this.refs.view.bounce();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
    
  }
  render() {
    const {usuario} = this.props;
    return (
      <Fragment>
        <Appbar.Header  style={styles.header}>
          <Icon name="bars" size={40} color="white" onPress={() => this.props.navigation.openDrawer()} />
          <Appbar.Content title="Pedidos" subtitle="crear y editar pedidos" />
          <TouchableWithoutFeedback onPress={this.bounce}>
          <Animatable.View ref="view">
          <Icon name="left" size={30} color="white" />
          </Animatable.View>
          </TouchableWithoutFeedback>
        </Appbar.Header>
        <Text style={styles.text}>Hola Pedido</Text>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Pedido);

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    fontWeight: '600',
    margin: 10,
    color: 'black',
    backgroundColor: 'transparent',
  },
  header:{
    backgroundColor: '#434343'
  }
});
