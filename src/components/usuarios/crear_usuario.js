import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {
  TextInput,
  List,
  Button,
  HelperText,
  Snackbar,
} from 'react-native-paper';
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
      menus: [
        {id_menu: 'ADMINISTRADOR', activo: true},
        {id_menu: 'VENDEDOR', activo: false},
      ],
      visible_menu: false,
      show_error_doc: false,
      show_error_pass: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
      filePath: '',
      cargando: false,
      show_snackbar: false,
      mensaje: '',
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
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: response.data,
        });
      }
    });
  };

  _menu_change = id_menu => {
    this.refs[id_menu].pulse();
    const menu_aux = this.state.menus;
    for (let i = 0; i < menu_aux.length; i++) {
      if (menu_aux[i].id_menu === id_menu && menu_aux[i].activo === false) {
        menu_aux[i].activo = true;
      } else if (menu_aux[i].id_menu === id_menu && menu_aux[i].activo === true) {
        menu_aux[i].activo = false;
      }
    }
    this.setState({menus: menu_aux});
  };
  _onDismissSnackBar = () => this.setState({show_snackbar: false});
  comprobar_form = () => {
    this.setState({
      show_error_doc: false,
      show_error_pass: false,
      show_error_name: false,
      show_error_email: false,
    });
    if (this.state.id_usuario.length < 1) this.setState({show_error_doc: true});
    if (this.state.passwrd.length < 1) this.setState({show_error_pass: true});
    if (this.state.name.length < 1) this.setState({show_error_name: true});
    if (!this.state.email.includes('@'))
      this.setState({show_error_email: true});
    setTimeout(() => {
      const {
        show_error_doc,
        show_error_pass,
        show_error_name,
        show_error_email,
      } = this.state;
      if (
        !show_error_doc &&
        !show_error_pass &&
        !show_error_name &&
        !show_error_email
      ) {
        this.setState({cargando: true});
        const menu_aux = this.state.menus.filter(x => x.activo == true);
        let menus_user = [];
        for (let i = 0; i < menu_aux.length; i++) {
          menus_user.push({
            UserID: this.state.id_usuario,
            ProfileID: menu_aux[i].id_menu,
            Status: menu_aux[i].activo,
          });
        }
        fetch(this.props.ruta+'/user/create', {
          method: 'POST',
          body: JSON.stringify({
            User: {
              UserID: this.state.id_usuario,
              Name: this.state.name,
              LastName: this.state.last_name,
              Email: this.state.email,
              Password: this.state.passwrd,
              Status: true,
              Photo: this.state.filePath,
            },
            Profiles: menus_user,
          }), // data can be `string` or {object}!
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === 201) {
              this.setState({
                id_usuario: '',
                id_tipo_doc: '',
                name: '',
                last_name: '',
                email: '',
                passwrd: '',
                filePath: '',
                cargando: false,
                show_snackbar: true,
                mensaje: 'Registro realizado con éxito',
              });
            } else {
              this.setState({
                cargando: false,
                show_snackbar: true,
                mensaje: response.message,
              });
            }
          })
          .catch(error => {
            this.setState({
              cargando: false,
              show_snackbar: true,
              mensaje: error,
            });
            alert('No se pudo realizar el registro');
          });
      }
    }, 100);
  };

  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <TextInput
            mode="outlined"
            label="ID Usuario"
            theme={{colors: {primary: 'red'}}}
            style={styles.input}
            value={this.state.id_usuario}
            onChangeText={text => this.setState({id_usuario: text})}
          />
          {this.state.show_error_doc ? (
            <HelperText type="error" visible={this.state.show_error_doc}>
              El ID de usuario no puede estar vacio
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Contraseña"
            theme={{colors: {primary: 'red'}}}
            style={styles.input}
            value={this.state.passwrd}
            onChangeText={text => this.setState({passwrd: text})}
          />
          {this.state.show_error_pass ? (
            <HelperText type="error" visible={this.state.show_error_pass}>
              La contraseña no puede estar vacia
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Nombre"
            theme={{colors: {primary: 'red'}}}
            style={styles.input}
            value={this.state.name}
            onChangeText={text => this.setState({name: text})}
          />
          {this.state.show_error_name ? (
            <HelperText type="error" visible={this.state.show_error_name}>
              El nombre no puede ser vacio
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Apellido"
            theme={{colors: {primary: 'red'}}}
            style={styles.input}
            value={this.state.last_name}
            onChangeText={text => this.setState({last_name: text})}
          />
          {this.state.show_error_last ? (
            <HelperText type="error" visible={this.state.show_error_last}>
              El Apellido no puede ser vacio
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Correo"
            theme={{colors: {primary: 'red'}}}
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
          {this.state.show_error_email ? (
            <HelperText type="error" visible={this.state.show_error_email}>
              El correo debe ser valido ejemplo: asd@gmail.com
            </HelperText>
          ) : null}
          <List.Section title="Información Extra">
            <List.Accordion
              title="Permisos"
              theme={{colors: {primary: 'red'}}}
              left={props => <List.Icon {...props} icon="folder" />}>
              {this.state.menus.map(row => (
                <TouchableWithoutFeedback
                  onPress={() => this._menu_change(row.id_menu)}>
                  <Animatable.View ref={row.id_menu}>
                    <List.Item
                      key={row.id_menu}
                      title={row.id_menu}
                      left={props =>
                        row.activo === false ? (
                          <List.Icon
                            {...props}
                            icon="close-circle-outline"
                            size={25}
                            color="red"
                          />
                        ) : (
                          <List.Icon
                            {...props}
                            icon="checkbox-marked-circle-outline"
                            size={25}
                            color="green"
                          />
                        )
                      }
                    />
                  </Animatable.View>
                </TouchableWithoutFeedback>
              ))}
            </List.Accordion>
          </List.Section>
          <Button
            mode="outlined"
            theme={{colors: {primary: 'black'}}}
            onPress={() => this.chooseFile()}>
            <Icon name="camera" size={30} />
            FOTO
          </Button>
          <Button
            mode="outlined"
            loading={this.state.cargando}
            theme={{colors: {primary: 'green'}}}
            onPress={() => this.comprobar_form()}>
            <Icon name="account-check-outline" size={35} />
            Registrar usuario
          </Button>
          {this.state.show_snackbar &&
          this.state.mensaje === 'Registro realizado con éxito' ? (
            <Snackbar
              visible={this.state.show_snackbar}
              onDismiss={this._onDismissSnackBar}
              style={{backgroundColor: '#5AB82C'}}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({show_snackbar: false, mensaje: ''});
                },
              }}>
              {this.state.mensaje}
            </Snackbar>
          ) : null}
          {this.state.show_snackbar &&
          this.state.mensaje !== 'Registro realizado con éxito' ? (
            <Snackbar
              visible={this.state.show_snackbar}
              onDismiss={this._onDismissSnackBar}
              style={{backgroundColor: '#E83A2C'}}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({show_snackbar: false, mensaje: ''});
                },
              }}>
              {this.state.mensaje}
            </Snackbar>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
    token: state.reducer.token,
    ruta: state.reducer.ruta,
  };
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Crear_usuario);

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
    marginTop: '3%',
  },
});
