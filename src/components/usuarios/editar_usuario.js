import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Switch,
  View,
  ScrollView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {
  TextInput,
  List,
  Button,
  HelperText,
  Snackbar,
  Searchbar,
  ActivityIndicator
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

class Editar_usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_usuario: '',
      id_usuario_aux: '',
      name: '',
      last_name: '',
      email: '',
      activo: false,
      menus: [
        {id_menu: 'ADMINISTRADOR', activo: true},
        {id_menu: 'VENDEDOR', activo: false},
      ],
      menus_aux: [],
      visible_menu: false,
      show_error_doc: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
      filePath: '',
      cargando: false,
      searching: false,
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

  
  _change_search = query => {
    this.setState({id_usuario_aux: query, searching: true});
    setTimeout(() => {
      if (
        this.state.id_usuario_aux.length > 0
      ) {
        fetch('http://192.168.1.9:4000/user/search/'+this.state.id_usuario_aux, {
          method: 'GET',// data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === 200) {
              this.setState({
                id_usuario: response.payload.User.UserID,
                name: response.payload.User.Name,
                last_name: response.payload.User.LastName,
                email: response.payload.User.Email,
                activo: response.payload.User.Status,
                menu_aux: response.payload.Profiles,
              });
              let menu_temp = this.state.menus;
              menu_temp = menu_temp.map(x =>
                response.payload.Profiles.filter(y => y.ProfileID == x.id_menu && y.Status == true).length > 0
                  ? {id_menu: x.id_menu, activo: true}
                  : {id_menu: x.id_menu, activo: false},
              );
              let temp_path = response.payload.User.Photo;

              this.setState({
                menus: menu_temp,
                filePath: temp_path,
                searching: false,
              });
            } else {
              this.setState({
                mensaje: 'Usuario no encontrado',
                searching: false,
              });
            }
          })
          .catch(error => {
            this.setState({
              mensaje: 'error interno del servidor',
              searching: false,
            });
          });
      }else{
        this.setState({
          id_usuario: '',
          name: '',
          last_name: '',
          email: '',
          activo: false,
          menu_aux: [],
          searching: false,
        });
      }
    }, 50);
  };
  _activar_desactivar_user = () =>
    this.setState(state => ({activo: !state.activo}));

  _menu_change = id_menu => {
    this.refs[id_menu].pulse();
    const menu_aux = this.state.menus;
    for (let i = 0; i < menu_aux.length; i++) {
      if (menu_aux[i].id_menu === id_menu && menu_aux[i].activo == false) {
        menu_aux[i].activo = true;
      } else if (menu_aux[i].id_menu === id_menu && menu_aux[i].activo == true) {
        menu_aux[i].activo = false;
      }
    }
    this.setState({menus: menu_aux});
  };
  _onDismissSnackBar = () => this.setState({show_snackbar: false});
  comprobar_form = () => {
    if (this.state.name.length < 1) this.setState({show_error_name: true});
    if (this.state.last_name.length < 1) this.setState({show_error_last: true});
    if (!this.state.email.includes('@'))
      this.setState({show_error_email: true});
    if (this.state.name.length > 1) this.setState({show_error_name: false});
    if (this.state.last_name.length > 1)
      this.setState({show_error_last: false});
    if (this.state.email.includes('@'))
      this.setState({show_error_email: false});
    setTimeout(() => {
      const {
        show_error_doc,
        show_error_name,
        show_error_last,
        show_error_email,
      } = this.state;
      if (
        !show_error_doc &&
        !show_error_name &&
        !show_error_last &&
        !show_error_email
      ) {
        this.setState({cargando: true});
        const {menus} = this.state;
        let menus_user = [];
        for (let i = 0; i < menus.length; i++) {
          menus_user.push({
            UserID: this.state.id_usuario,
            ProfileID: menus[i].id_menu,
            Status: menus[i].activo,
          });
        }
        fetch('http://192.168.1.9:4000/user/update', {
          method: 'POST',
          body: JSON.stringify({
            User: {
              UserID: this.state.id_usuario,
              Name: this.state.name,
              LastName: this.state.last_name,
              Email: this.state.email,
              Status: this.state.activo,
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
            if (response.status === 200) {
              this.setState({
                id_usuario_aux: '',
                id_tipo_doc: '',
                name: '',
                last_name: '',
                email: '',
                activo: false,
                filePath: '',
                cargando: false,
                show_snackbar: true,
                mensaje: response.message,
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
          });
      }
    }, 100);
  };

  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <Searchbar
            style={{marginTop: '2%', backgroundColor: '#F7F7F7'}}
            placeholder="Buscar por Id"
            onChangeText={this._change_search}
            value={this.state.id_usuario_aux}
          />
          {this.state.searching ? (
            <ActivityIndicator
              style={{marginTop: '2%'}}
              animating={this.state.searching}
              color="red"
            />
          ) : null}
          <TextInput
            mode="outlined"
            disabled={true}
            label="Usuario ID"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.id_usuario_aux}
            onChangeText={text => this.setState({id_usuario_aux: text})}
          />
          {this.state.show_error_doc ? (
            <HelperText type="error" visible={this.state.show_error_doc}>
              El numero de documento solo contiene numeros
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Nombre"
            theme={{colors: {primary: '#ff8c00'}}}
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
            theme={{colors: {primary: '#ff8c00'}}}
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
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
          {this.state.show_error_email ? (
            <HelperText type="error" visible={this.state.show_error_email}>
              El correo debe ser valido ejemplo: asd@gmail.com
            </HelperText>
          ) : null}
          <View style={styles.container}>
            <Text>Activar o Desactivar Usuario</Text>
            <Switch
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
              trackColor={{false: '#767577', true: '#59B02F'}}
              thumbColor={this.state.activo ? '#EDF3EB' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this._activar_desactivar_user()}
              value={this.state.activo}
            />
          </View>
          <List.Section title="Información Extra">
            <List.Accordion
              title="Permisos"
              theme={{colors: {primary: '#ff8c00'}}}
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
            theme={{colors: {primary: '#ff8c00'}}}
            onPress={() => this.comprobar_form()}>
            <Icon name="account-check-outline" size={35} />
            Editar usuario
          </Button>
          {this.state.show_snackbar &&
          this.state.mensaje === 'Actualización Realizada!' ? (
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
          this.state.mensaje !== 'Actualización Realizada!' ? (
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
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Editar_usuario);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
  },
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
