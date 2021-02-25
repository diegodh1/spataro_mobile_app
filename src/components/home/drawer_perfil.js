import React, {Component, Fragment} from 'react';
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
  Button,
} from 'react-native-paper';

class Menu_perfil extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {usuario} = this.props;
    return (
      <View style={styles.userInfoSection}>
        <Avatar.Image
          source={{
            uri: `data:image/jpeg;base64,${usuario.Photo}`,
          }}
          style={styles.image}
          size={100}
        />
        <Title style={styles.title}>{usuario.Name}</Title>
        <Caption style={styles.caption}>{usuario.Email}</Caption>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
    ruta: state.reducer.ruta,
  };
};
const mapDispatchToProps = {
  success_login,
  error_login,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu_perfil);
const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    marginTop: '6%',
    marginLeft: '25%',
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
    color: '#CDCDCD',
  },
});
