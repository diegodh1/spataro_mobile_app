import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import {Appbar, BottomNavigation} from 'react-native-paper';
import Crear_pedido from './crear_pedido';
import Editar_pedido from './editar_pedido';

class Pedido extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'crear',
          title: 'Crear Pedido',
          icon: props => <Icon name="adduser" size={25} color="white" />,
        },
        {
          key: 'editar',
          title: 'Editar Pedido',
          icon: props => <Icon name="edit" size={25} color="white" />,
        },
      ],
    };
    this.bounce = this.bounce.bind(this);
  }
  bounce(){
    this.refs.view.rubberBand();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
    
  }
  _handleIndexChange = index => this.setState({index});
  _renderScene = BottomNavigation.SceneMap({
    crear: Crear_pedido,
    editar: Editar_pedido,
  });
  render() {
    const {usuario} = this.props;
    return (
      <Fragment>
        <Appbar.Header  style={styles.header}>
          <Icon name="bars" size={40} color="white" onPress={() => this.props.navigation.openDrawer()} />
          <Appbar.Content title="Pedidos" subtitle="crear y editar Pedidos" />
          <TouchableWithoutFeedback onPress={this.bounce}>
          <Animatable.View ref="view">
          <Icon name="arrowleft" size={30} color="white" />
          </Animatable.View>
          </TouchableWithoutFeedback>
        </Appbar.Header>
        <BottomNavigation
          barStyle={styles.bottom}
          activeColor='white'
          inactiveColor='#CDCDCD'
          shifting={true}
          sceneAnimationEnabled ={true}
          navigationState={this.state}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
    ruta: state.reducer.ruta,
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
  header: {
    backgroundColor: '#e60000',
  },
  bottom: {
    backgroundColor: '#e60000',
  },
  activo:{
    color: 'white',
  },
  inactivo:{
    color: 'gray',
  }
});
