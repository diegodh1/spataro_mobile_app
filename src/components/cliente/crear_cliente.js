import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  ScrollView,
  Picker,
  Text,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Autocomplete from 'react-native-autocomplete-input';
import * as Animatable from 'react-native-animatable';
import {
  TextInput,
  List,
  Button,
  HelperText,
  Snackbar,
  Divider,
  DataTable,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import FormData from 'form-data';

class Crear_cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_usuario: '',
      id_usuario_aux: '',
      name: '',
      last_name: '',
      email: '',
      cell: '',
      tel: '',
      dir: '',
      ciudad: '',
      pais: '',
      files: [],
      activo: false,
      tipos_doc: [
        'NIT',
        'CÉDULA',
        'CÉDULA EXTRANJERA',
        'TARJETA DE IDENTIDAD',
        'RUT',
      ],
      visible_menu: false,
      show_error_doc: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
      show_error_cell: false,
      show_error_tel: false,
      show_error_dir: false,
      show_error_ciudad: false,
      show_error_pais: false,
      cargando: false,
      searching: false,
      show_snackbar: false,
      mensaje: '',
      id_ciudad: '',
      id_pais: '',
      id_direccion: '',
      id_telefono: '',
      ciudades: [],
      ciudad_open: false,
      pais_open: false,
      direccion_open: false,
      telefono_open: false,
      error_direccion_tel: false,
      paises: [],
      id_tipo_doc: 'NIT',
      direcciones: [],
      telefonos: [],
    };
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }

  _onDismissSnackBar = () => this.setState({show_snackbar: false});

  comprobar_form = () => {
    this.setState({
      show_error_doc: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
      show_error_cell: false,
      show_error_tel: false,
      show_error_dir: false,
      show_error_ciudad: false,
      show_error_pais: false,
    });

    if (!Number(this.state.id_usuario_aux))
      this.setState({show_error_doc: true});
    if (this.state.name.length < 1) this.setState({show_error_name: true});
    if (this.state.last_name.length < 1) this.setState({show_error_last: true});
    if (!this.state.email.includes('@'))
      this.setState({show_error_email: true});
    if (!Number(this.state.cell)) this.setState({show_error_cell: true});
    if (!Number(this.state.tel)) this.setState({show_error_tel: true});
    if (this.state.dir.length < 6) this.setState({show_error_dir: true});
    if (this.state.ciudad.length == 0) this.setState({show_error_ciudad: true});
    if (this.state.pais.length == 0) this.setState({show_error_pais: true});
    setTimeout(() => {
      const {
        show_error_doc,
        show_error_name,
        show_error_last,
        show_error_email,
        show_error_cell,
        show_error_tel,
        show_error_dir,
        show_error_ciudad,
        show_error_pais,
      } = this.state;
      if (
        !show_error_doc &&
        !show_error_name &&
        !show_error_last &&
        !show_error_email &&
        !show_error_cell &&
        !show_error_tel &&
        !show_error_dir &&
        !show_error_ciudad &&
        !show_error_pais
      ) {
        this.setState({cargando: true});
        var formData = new FormData();
        formData.append('tipoDoc', this.state.id_tipo_doc);
        formData.append('nroDoc', this.state.id_usuario_aux);
        formData.append('name', this.state.name);
        formData.append('lastName', this.state.last_name);
        formData.append('email', this.state.email);
        formData.append('cellphone', this.state.cell);
        formData.append('phone', this.state.tel);
        formData.append('dir', this.state.dir);
        formData.append('ciudad', this.state.ciudad);
        formData.append('pais', this.state.pais);
        this.state.files.forEach((item, i) => {
          formData.append("upload[]", item);
        });

        fetch(this.props.ruta+'/client/create', {
          method: 'POST',
          body: formData, // data can be `string` or {object}!
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === 200) {
              this.setState({
                mensaje: response.message,
                show_snackbar: true,
                id_usuario_aux: '',
                name: '',
                last_name: '',
                email: '',
                cargando: false,
                cell:'',
                tel:'',
                dir:'',
                ciudad:'',
                pais:''
              });
            } else {
              alert(response.message);
              this.setState({mensaje: response.message, cargando: false});
            }
          })
          .catch(error => {
            this.setState({
              show_snackbar: true,
              mensaje: error.text(),
              cargando: false,
            });
          });
      }
    }, 100);
  };

  async select_file() {
    try {
      const results  = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      let resp = []
      for (const res of results) {
        resp.push(res);
      }
      this.setState({files: resp});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView style={styles.containerS}>
        <ScrollView>
          <View style={{height: '100%', marginTop: '2%'}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                marginLeft: '2%',
                marginRight: '3%',
                borderRadius: 4,
              }}>
              <Picker
                selectedValue={this.state.id_tipo_doc}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({id_tipo_doc: itemValue})
                }>
                {this.state.tipos_doc.map(row => (
                  <Picker.Item label={row} value={row} />
                ))}
              </Picker>
            </View>
            <TextInput
              mode="outlined"
              label="Nro. Documento"
              theme={{colors: {primary: 'red'}}}
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
            <TextInput
              mode="outlined"
              label="Celular"
              theme={{colors: {primary: 'red'}}}
              style={styles.input}
              value={this.state.cell}
              onChangeText={text => this.setState({cell: text})}
            />
            {this.state.show_error_cell ? (
              <HelperText type="error" visible={this.state.show_error_cell}>
                Debe ingresar un número de celular válido
              </HelperText>
            ) : null}
            <TextInput
              mode="outlined"
              label="Teléfono"
              theme={{colors: {primary: 'red'}}}
              style={styles.input}
              value={this.state.tel}
              onChangeText={text => this.setState({tel: text})}
            />
            {this.state.show_error_tel ? (
              <HelperText type="error" visible={this.state.show_error_tel}>
                Debe ingresar un número de télefono válido
              </HelperText>
            ) : null}
            <TextInput
              mode="outlined"
              label="Dirección"
              theme={{colors: {primary: 'red'}}}
              style={styles.input}
              value={this.state.dir}
              onChangeText={text => this.setState({dir: text})}
            />
            {this.state.show_error_dir ? (
              <HelperText type="error" visible={this.state.show_error_dir}>
                Debe ingresar una dirección válida
              </HelperText>
            ) : null}
            <TextInput
              mode="outlined"
              label="Ciudad"
              theme={{colors: {primary: 'red'}}}
              style={styles.input}
              value={this.state.ciudad}
              onChangeText={text => this.setState({ciudad: text})}
            />
            {this.state.show_error_ciudad ? (
              <HelperText type="error" visible={this.state.show_error_ciudad}>
                Debe ingresar la ciudad del cliente
              </HelperText>
            ) : null}
            <TextInput
              mode="outlined"
              label="País"
              theme={{colors: {primary: 'red'}}}
              style={styles.input}
              value={this.state.pais}
              onChangeText={text => this.setState({pais: text})}
            />
            {this.state.show_error_pais ? (
              <HelperText type="error" visible={this.state.show_error_pais}>
                Debe ingresar el país del cliente
              </HelperText>
            ) : null}
            <Divider />
            <Button
              mode="outlined"
              style={{
                width: '95%',
                marginTop: '5%',
                marginLeft: '2%',
              }}
              theme={{colors: {primary: 'green'}}}
              onPress={() => this.select_file()}>
              <Icon name="paperclip" size={25} />
              Adjuntar Documento
            </Button>
            <Button
              mode="outlined"
              style={{
                width: '95%',
                marginLeft: '2%',
                marginTop: '5%',
                marginBottom: '5%',
                backgroundColor: '#e60000',
                borderRadius: 15,
                
              }}
              loading={this.state.cargando}
              theme={{colors: {primary: 'white'}}}
              onPress={() => this.comprobar_form()}>
              <Icon name="check" size={30} />
              Enviar Petición
            </Button>
            <Snackbar
              visible={this.state.show_snackbar}
              onDismiss={this._onDismissSnackBar}
              style={{backgroundColor: '#4B0082'}}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({show_snackbar: false, mensaje: ''});
                },
              }}>
              {this.state.mensaje}
            </Snackbar>
          </View>
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
)(Crear_cliente);

const styles = StyleSheet.create({
  containerS: {
    flex: 1,
  },
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
  center_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
  },
  select: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
    backgroundColor: '#F7C877',
    color: 'black',
    height: 50,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  openButton: {
    borderRadius: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  fab: {
    width: '45%',
    marginLeft: '2%',
    backgroundColor: '#F0C02B',
    marginTop: '4%',
  },
});
