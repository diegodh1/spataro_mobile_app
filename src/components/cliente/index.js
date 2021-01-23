import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import {Appbar, BottomNavigation} from 'react-native-paper';
import Crear_cliente from './crear_cliente';
import Editar_cliente from './editar_cliente';

class Cliente extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'crear',
          title: 'Crear Cliente',
          icon: props => <Icon name="adduser" size={25} color="white" />,
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
    crear: Crear_cliente,
  });
  render() {
    const {usuario} = this.props;
    return (
      <Fragment>
        <Appbar.Header  style={styles.header}>
          <Icon name="bars" size={40} color="white" onPress={() => this.props.navigation.openDrawer()} />
          <Appbar.Content title="Clientes" subtitle="crear y editar clientes" />
          <TouchableWithoutFeedback onPress={this.bounce}>
          <Animatable.View ref="view">
          <Icon name="left" size={30} color="white" />
          </Animatable.View>
          </TouchableWithoutFeedback>
        </Appbar.Header>
        <Crear_cliente/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cliente);

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
    color: '#F2994A',
  },
  inactivo:{
    color: '#CDCDCD',
  }
});
