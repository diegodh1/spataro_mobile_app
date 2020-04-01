import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {Modal} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

class Login extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      cargando: false,
      show_password: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }
  //funcion encargada de ingresar seccion
  handleSubmit(event) {
    this.setState({cargando: true});
    fetch('http://192.168.1.86:4000/iniciar_sesion', {
      method: 'POST',
      body: JSON.stringify({
        id_usuario: this.state.user,
        passwrd: this.state.password,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (
          response.usuario.id_usuario != '' &&
          response.usuario.id_usuario != undefined &&
          response.usuario.id_usuario != null
        ) {
          this.setState({cargando: false});
          this.props.success_login(response.usuario);
          this.props.navigation.navigate('home');
        } else {
          if (response.status == 200) {
            this.setState({cargando: false});
            this.props.error_login(
              'error ingresando sesión, compruebe usuario y contraseña',
            );
            alert('error ingresando sesión, compruebe usuario y contraseña');
          } else {
            this.setState({cargando: false});
            this.props.error_login(
              'el servidor no puede procesar la solicitud',
            );
            alert('error interno del servidor');
          }
        }
      })
      .catch(error => {
        this.props.error_login('el servidor no puede procesar la solicitud');
      });
    event.preventDefault();
  }
  setUser(value) {
    this.setState({user: value});
  }
  setPassword(value) {
    this.setState({password: value});
  }
  showPassword(event) {
    this.setState({show_password: true});
    event.preventDefault();
  }
  render() {
    return (
      <Fragment>
        {this.state.cargando == false ? (
          <LinearGradient
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            colors={['#000000', '#434343']}
            style={{height: '100%'}}>
            <Animatable.View
              animation="flipInY"
              iterationCount={1}
              direction="alternate">
              <View style={styles.container}>
                <Image
                  style={styles.logo}
                  source={require('../../public/Logo2020.png')}
                />
                <Input
                  type="text"
                  inputStyle={styles.input}
                  placeholder="  Nro de documento"
                  placeholderTextColor="white"
                  value={this.state.user}
                  onChangeText={text => this.setUser(text)}
                  leftIcon={<Icon name="user" size={32} color="white" />}
                />
                <View style={styles.input}></View>
                {this.state.show_password ? (
                  <Input
                    type="text"
                    inputStyle={styles.input}
                    placeholder="  Contraseña"
                    placeholderTextColor="white"
                    value={this.state.password}
                    onChangeText={text => this.setPassword(text)}
                    leftIcon={<Icon name="key" size={32} color="white" />}
                    rightIcon={
                      <TouchableOpacity onPress={this.showPassword}>
                        <Icon name="eyeo" size={32} color="white" />
                      </TouchableOpacity>
                    }
                  />
                ) : (
                  <Input
                    type="text"
                    inputStyle={styles.input}
                    placeholder="  Contraseña"
                    placeholderTextColor="white"
                    value={this.state.password}
                    onChangeText={text => this.setPassword(text)}
                    secureTextEntry={true}
                    leftIcon={<Icon name="key" size={32} color="white" />}
                    rightIcon={
                      <TouchableOpacity onPress={this.showPassword}>
                        <Icon name="eyeo" size={32} color="white" />
                      </TouchableOpacity>
                    }
                  />
                )}
                <LinearGradient
                  start={{x: 0.0, y: 0.25}}
                  end={{x: 0.5, y: 1.0}}
                  colors={['#F2994A', '#F2C94C']}
                  style={styles.linearGradient}>
                  <TouchableOpacity onPress={this.handleSubmit}>
                    <Text style={styles.buttonText}>
                      Ingresar a Spataro Napoli
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.password}>¿Olvidó su Contraseña?</Text>
              </View>
            </Animatable.View>
          </LinearGradient>
        ) : (
          <Modal visible={this.state.cargando} contentContainerStyle={{backgroundColor:'#fee89b'}}>
            <View style={{height:'100%'}}>
            <Image
              style={styles.loader}
              source={require('../../public/loader.gif')}
            />
            </View>
          </Modal>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {
  success_login,
  error_login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    marginTop: '40%',
    alignItems: 'center',
    backgroundColor: 'white',
    backgroundColor: 'transparent',
  },
  input: {
    margin: '3%',
    color: 'white',
  },
  password: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    marginTop: '6%',
    color: '#F2C94C',
  },
  logo: {
    width: '90%',
    height: '25%',
    resizeMode: 'stretch',
    marginBottom: '10%',
    backgroundColor: 'transparent',
  },
  loader: {
    backgroundColor: 'transparent',
    resizeMode: 'stretch',
    marginTop:'50%',
    width:'100%',
    height:'50%',
  },
  linearGradient: {
    marginTop: '15%',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    fontWeight: '600',
    margin: 10,
    color: 'black',
    backgroundColor: 'transparent',
  },
});
