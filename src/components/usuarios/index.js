import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {StyleSheet,} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Crear_usuario from './crear_usuario';
import Editar_usuario from './editar_usuario';
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
            color="#ff8c00"
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content title="Usuarios" subtitle="crear y editar usuarios" />
        </Appbar.Header>
        <BottomNavigation
          barStyle={styles.bottom}
          activeColor='#ff8c00'
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
    backgroundColor: '#000000',
  },
  bottom: {
    backgroundColor: '#000000',
  },
  activo:{
    color: '#F2994A',
  },
  inactivo:{
    color: '#CDCDCD',
  }
});
