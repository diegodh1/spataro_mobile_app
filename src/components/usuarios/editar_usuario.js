import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';

class Editar_usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }

  render() {
    const {usuario} = this.props;
    return (
      <Fragment>
        <Text style={styles.text}>Editar usuario</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Editar_usuario);

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
});
