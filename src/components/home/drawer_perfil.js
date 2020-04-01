import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import {success_login, error_login} from '../../actions';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

class Menu_perfil extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {usuario} = this.props;
    return (<View style={styles.userInfoSection}>
      <Avatar.Image
        source={{
          uri:
          `data:image/jpeg;base64,${usuario.foto}`,
        }}
        style={styles.image}
        size={100}
      />
      <Title style={styles.title}>{usuario.nombre}</Title>
      <Caption style={styles.caption}>{usuario.correo}</Caption>
    </View>);
  }
}
const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu_perfil);

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 15,
    fontWeight: 'bold',
    color:'#CDCDCD'
  },
  image:{
    marginTop:'6%',
    marginLeft:'25%'
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
    color:'#CDCDCD'
  }
});