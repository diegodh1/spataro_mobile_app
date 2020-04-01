import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Crear_usuario from './crear_usuario';
import Editar_usuario from './editar_usuario';
import * as Animatable from 'react-native-animatable';
import {Appbar, BottomNavigation} from 'react-native-paper';

class Usuario extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'crear',
          title: 'Crear Usuario',
          icon: props => <Icon name="adduser" size={25} color="white" />,
        },
        {
          key: 'editar',
          title: 'Editar usuario',
          icon: props => <Icon name="edit" size={25} color="white" />,
        },
      ],
    };
  }
  _handleIndexChange = index => this.setState({index});

  _renderScene = BottomNavigation.SceneMap({
    crear: Crear_usuario,
    editar: Editar_usuario,
  });

  render() {
    const {usuario} = this.props;
    return (
      <Fragment>
        <Appbar.Header style={styles.header}>
          <Icon
            name="bars"
            size={40}
            color="white"
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content title="Usuarios" subtitle="crear y editar usuarios" />
          <Icon name="infocirlceo" size={23} color="white" />
        </Appbar.Header>
        <Text style={styles.text}>Hola Usuario</Text>
        <BottomNavigation
          barStyle={styles.bottom}
          activeColor='#F2994A'
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
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Usuario);

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
    backgroundColor: '#434343',
  },
  bottom: {
    backgroundColor: '#434343',
  },
  activo:{
    color: '#F2994A',
  },
  inactivo:{
    color: '#CDCDCD',
  }
});
