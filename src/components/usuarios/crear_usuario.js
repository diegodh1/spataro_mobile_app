import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {TextInput, List, Button} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

class Crear_usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_usuario: '',
      passwrd: '',
      name: '',
      last_name: '',
      email: '',
      menus: [],
      checked: false,
      visible_menu: false,
      filePath: '',
    };
    this._menu_change = this._menu_change.bind(this);
    this._openMenu = this._openMenu.bind(this);
    this._closeMenu = this._closeMenu.bind(this);
    this.chooseFile = this.chooseFile.bind(this);
  }

  _openMenu = () => this.setState({visible_menu: true});

  _closeMenu = () => this.setState({visible_menu: false});

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
      }
    });
  };

  componentDidMount() {
    fetch('http://192.168.1.86:4000/get_menus', {
      method: 'POST',
      body: JSON.stringify({}), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({menus: response});
      })
      .catch(error => {
        alert(error);
      });
  }

  _menu_change = id_menu => {
    this.refs[id_menu].pulse();
    const menu_aux = this.state.menus;
    for (let i = 0; i < menu_aux.length; i++) {
      if (menu_aux[i].id === id_menu && menu_aux[i].activo === 0) {
        menu_aux[i].activo = 1;
      } else if (menu_aux[i].id === id_menu && menu_aux[i].activo === 1) {
        menu_aux[i].activo = 0;
      }
    }
    this.setState({menus: menu_aux});
  };

  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <TextInput
            mode="outlined"
            label="Nro. Documento"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.id_usuario}
            onChangeText={text => this.setState({id_usuario: text})}
          />
          <TextInput
            mode="outlined"
            label="Contraseña"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.passwrd}
            onChangeText={text => this.setState({passwrd: text})}
          />
          <TextInput
            mode="outlined"
            label="Nombre"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.name}
            onChangeText={text => this.setState({name: text})}
          />
          <TextInput
            mode="outlined"
            label="Apellido"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.last_name}
            onChangeText={text => this.setState({last_name: text})}
          />
          <TextInput
            mode="outlined"
            label="Correo"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
          <List.Section>
            <List.Subheader>PERMISOS DEL USUARIO</List.Subheader>

            {this.state.menus.map(row => (
              <TouchableWithoutFeedback
                onPress={() => this._menu_change(row.id)}>
                <Animatable.View ref={row.id}>
                  <List.Item
                    key={row.id}
                    title={row.id}
                    left={() =>
                      row.activo === 0 ? (
                        <Icon name="closecircleo" size={32} color="red" />
                      ) : (
                        <Icon name="checkcircleo" size={32} color="green" />
                      )
                    }
                  />
                </Animatable.View>
              </TouchableWithoutFeedback>
            ))}
          </List.Section>
          <Button
            mode="outlined"
            theme={{colors: {primary: 'black'}}}
            onPress={() => this.chooseFile()}>
              <Icon name="camerao" size={35} />
                Foto
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Crear_usuario);

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
  input: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
  },
});
