import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {Modal} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {Snackbar} from 'react-native-paper';
var Realm = require('realm');
let realm;

class Login extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      cargando: false,
      show_password: false,
      show_snack: false,
      message: '',
      realm: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.showPassword = this.showPassword.bind(this);
    realm = new Realm({
      schema: [
        {
          name: 'UserApp',
          properties: {
            userID: { type: 'int', default: 0 },
            username: 'string',
            password: 'string',
          },
        },
      ],
    });
  }

  componentDidMount(){
    this.setState({cargando: true});
    let users = realm.objects('UserApp')
    if(users.length > 0){
      let userTemp  = users[users.length - 1]
      fetch('http://192.168.1.9:4000/user/login', {
      method: 'POST',
      body: JSON.stringify({
        UserID: userTemp.username,
        Password: userTemp.password,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == 200) {
          this.setState({cargando: false});
          this.props.success_login(
            response.payload.User,
            response.payload.Profiles,
            response.payload.Token,
          );
          this.props.navigation.navigate('home');
        } else {
          this.setState({cargando: false});
          this.props.error_login(response.message);
          this.setState({message: response.message, show_snack: true});
        }
      })
      .catch(error => {
        this.setState({cargando: false});
        this.props.error_login('el servidor no puede procesar la solicitud');
      });
    }
    else{
      this.setState({cargando: false});
    }
  }

  makeRequest = () =>{
    fetch('http://192.168.1.9:4000/user/login', {
      method: 'POST',
      body: JSON.stringify({
        UserID: this.state.user,
        Password: this.state.password,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == 200) {
          var userApp = realm.objects('UserApp');
          var ID = 1
          realm.write(() => {
            realm.delete(userApp);
            realm.create('UserApp', {
              userID: ID,
              username: this.state.user,
              password: this.state.password,
            });
          });
          this.setState({cargando: false});
          this.props.success_login(
            response.payload.User,
            response.payload.Profiles,
            response.payload.Token,
          );
          this.props.navigation.navigate('home');
        } else {
          this.setState({cargando: false});
          this.props.error_login(response.message);
          this.setState({message: response.message, show_snack: true});
        }
      })
      .catch(error => {
        this.setState({cargando: false});
        this.props.error_login('el servidor no puede procesar la solicitud');
      });
  }
  //funcion encargada de ingresar seccion
  handleSubmit(event) {
    this.setState({cargando: true});
    this.makeRequest();
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
  onDismissSnackBar = () => this.setState({show_snack: false});
  render() {
    return (
      <Fragment>
        {this.state.cargando == false ? (
          <Fragment>
            <Animatable.View
              animation="flipInY"
              iterationCount={1}
              direction="alternate">
              <View style={styles.container}>
                <Image
                  style={styles.logo}
                  source={require('../../public/logo.png')}
                />
                <Input
                  type="text"
                  inputStyle={styles.input}
                  placeholder="  Nro de documento"
                  value={this.state.user}
                  onChangeText={text => this.setUser(text)}
                  leftIcon={<Icon name="user" size={32} />}
                />
                <View style={styles.input} />
                {this.state.show_password ? (
                  <Input
                    type="text"
                    inputStyle={styles.input}
                    placeholder="  Contraseña"
                    value={this.state.password}
                    onChangeText={text => this.setPassword(text)}
                    leftIcon={<Icon name="key" size={32} />}
                    rightIcon={
                      <TouchableOpacity onPress={this.showPassword}>
                        <Icon name="eyeo" size={32} />
                      </TouchableOpacity>
                    }
                  />
                ) : (
                  <Input
                    type="text"
                    inputStyle={styles.input}
                    placeholder="  Contraseña"
                    value={this.state.password}
                    onChangeText={text => this.setPassword(text)}
                    secureTextEntry={true}
                    leftIcon={<Icon name="key" size={32} />}
                    rightIcon={
                      <TouchableOpacity onPress={this.showPassword}>
                        <Icon name="eyeo" size={32} />
                      </TouchableOpacity>
                    }
                  />
                )}
                <LinearGradient
                  start={{x: 0.0, y: 0.25}}
                  end={{x: 0.5, y: 1.0}}
                  colors={['#ee0202', '#ee0202']}
                  style={styles.linearGradient}>
                  <TouchableOpacity onPress={this.handleSubmit}>
                    <Text style={styles.buttonText}>
                      Bienvenido a Calzado Rómulo
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.password}>¿Olvidó su Contraseña?</Text>
                <Snackbar
                  visible={this.state.show_snack}
                  onDismiss={this.onDismissSnackBar}
                  theme={{colors: {accent: 'white'}}}
                  action={{
                    label: 'OK',
                    onPress: () => {
                      this.setState({show_snack: false});
                    },
                  }}>
                  {this.state.message}
                </Snackbar>
              </View>
            </Animatable.View>
          </Fragment>
        ) : (
          <Modal
            visible={this.state.cargando}
            contentContainerStyle={{backgroundColor: '#fee89b'}}>
            <View style={{height: '100%'}}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

const styles = StyleSheet.create({
  container: {
    marginTop: '35%',
    alignItems: 'center',
    backgroundColor: 'white',
    backgroundColor: 'transparent',
  },
  input: {
    margin: '3%',
  },
  password: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    marginTop: '6%',
    color: 'black',
  },
  logo: {
    width: '90%',
    height: '25%',
    resizeMode: 'stretch',
    marginBottom: '15%',
    backgroundColor: 'transparent',
  },
  loader: {
    backgroundColor: 'transparent',
    resizeMode: 'stretch',
    marginTop: '50%',
    width: '100%',
    height: '50%',
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
    color: 'white',
    backgroundColor: 'transparent',
  },
});
