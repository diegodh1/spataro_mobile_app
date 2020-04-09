import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Switch,
  View,
  ScrollView,
  Picker,
  TouchableHighlight,
  TouchableOpacity,
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
  Searchbar,
  DataTable,
  Subheading,
  Portal,
  Provider,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Firma from './firma';

class Crear_pedido extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre_cliente: '',
      apellido_cliente: '',
      fecha: '',
      name: '',
      firma: '',
      observacion: '',
      cargando: false,
      clientes: [],
      clientes_aux: [],
      searching: false,
      date: '',
      id_pedido: '',
      id_cliente: '',
      show_snack: false,
      message: '',
      show_firma: false,
      show_unidades: false,
      file: {uri: ''},
      base64: '',
    };
    this.bounce = this.bounce.bind(this);
  }

  search_cliente_n(value) {
    this.setState({nombre_cliente: value, searching: true, clientes_aux: []});
    setTimeout(() => {
      const {nombre_cliente, apellido_cliente} = this.state;
      fetch('http://192.168.1.86:4000/buscar_cliente', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre_cliente,
          apellido: apellido_cliente,
        }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(response => {
          this.setState({clientes: response, searching: false});
          let clientes = this.state.clientes_aux;
          for (let i = 0; i < response.length; i++) {
            let nombre = response[i].nombre + ' ' + response[i].apellido;
            clientes.push({label: nombre, value: response[i].id_cliente});
          }
          this.setState({clientes_aux: clientes});
        })
        .catch(error => {
          this.setState({clientes: [], searching: false});
          alert(error);
        });
    }, 200);
  }
  async select_file() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState({file: res});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  search_cliente_a(value) {
    this.setState({apellido_cliente: value, searching: true, clientes_aux: []});
    setTimeout(() => {
      const {nombre_cliente, apellido_cliente} = this.state;
      fetch('http://192.168.1.86:4000/buscar_cliente', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre_cliente,
          apellido: apellido_cliente,
        }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(response => {
          this.setState({clientes: response, searching: false});
          let clientes = this.state.clientes_aux;
          for (let i = 0; i < response.length; i++) {
            let nombre = response[i].nombre + ' ' + response[i].apellido;
            clientes.push({label: nombre, value: response[i].id_cliente});
          }
          this.setState({clientes_aux: clientes});
        })
        .catch(error => {
          this.setState({clientes: [], searching: false});
          alert(error);
        });
    }, 200);
  }
  crear_pedido() {
    this.setState({cargando: true});
    const {id_cliente, date, observacion} = this.state;
    const {usuario} = this.props;
    let id_usuario = usuario.id_usuario;
    const ruta = this.state.file.uri;
    if(ruta!==''){
    RNFS.readFile(ruta, 'base64') //substring(7) -> to remove the file://
      .then(res => this.setState({firma: res}));
    }
    
    setTimeout(() => {
      const {firma} = this.state;
      if (this.state.id_pedido === '') {
        fetch('http://192.168.1.86:4000/crear_pedido', {
          method: 'POST',
          body: JSON.stringify({
            id_cliente,
            id_usuario,
            fecha: date,
            firma,
            observacion,
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.id_pedido == -1) {
              alert('no se pudo obtener el número de pedido');
              this.setState({cargando: false});
            } else {
              let mensaje =
                'Registro realizado con número: ' + response.id_pedido;
              this.setState({
                cargando: false,
                show_snack: true,
                id_pedido: response.id_pedido,
                message: mensaje,
              });
            }
          })
          .catch(error => {
            alert(error);
            this.setState({cargando: false});
          });
      } else {
        fetch('http://192.168.1.86:4000/editar_pedido', {
          method: 'POST',
          body: JSON.stringify({
            id_cliente,
            activo: 'REALIZADO',
            fecha: date,
            firma,
            id_pedido: this.state.id_pedido,
            observacion,
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.status === 500) {
              alert(response.message);
              this.setState({cargando: false});
            } else {
              let mensaje = 'Pedido Finalizado';
              this.setState({
                cargando: false,
                show_snack: true,
                id_pedido: response.id_pedido,
                message: mensaje,
              });
            }
          })
          .catch(error => {
            alert(error);
            this.setState({cargando: false});
          });
      }
    }, 200);
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }
  set_id_cliente = value => this.setState({id_cliente: value});
  onDismissSnackBar = () => this.setState({show_snack: false});
  _hide_unidades = () => this.setState({show_unidades: false});
  _hide_firma = () => this.setState({show_firma: false});
  bounce() {
    this.refs.view.rubberBand();
  }
  render() {
    const {usuario} = this.props;
    const placeholder = {
      label: 'Seleccionar un cliente...',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{height: '100%'}}>
            {this.state.searching ? (
              <View style={styles.center_view}>
                <ActivityIndicator
                  animating={true}
                  style={{top: '35%', right: '20%', position: 'absolute'}}
                  color="red"
                />
                <Text style={{fontSize: 20, marginTop: '5%'}}>Buscando</Text>
              </View>
            ) : (
              <View style={styles.center_view}>
                <Text style={{fontSize: 20, marginTop: '5%'}}>
                  Buscar Cliente
                </Text>
              </View>
            )}

            <TextInput
              mode="outlined"
              label="Buscar por Nombre"
              theme={{colors: {primary: '#ff8c00'}}}
              style={styles.input}
              value={this.state.nombre_cliente}
              onChangeText={text => this.search_cliente_n(text)}
            />
            <TextInput
              mode="outlined"
              label="Buscar por Apellido"
              theme={{colors: {primary: '#ff8c00'}}}
              style={styles.input}
              value={this.state.apellido_cliente}
              onChangeText={text => this.search_cliente_a(text)}
            />
            <RNPickerSelect
              placeholder={placeholder}
              onValueChange={value => this.set_id_cliente(value)}
              items={this.state.clientes_aux}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 20,
                  right: 10,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 16,
                },
              }}
            />
            <Divider />
            <DatePicker
              style={{width: '90%', marginTop: '5%', marginLeft: '3%'}}
              date={this.state.date}
              mode="date"
              placeholder="seleccionar Fecha"
              format="YYYY/MM/DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  fontSize: '18',
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                this.setState({date: date});
              }}
            />
            <View>
              <Snackbar
                visible={this.state.show_snack}
                onDismiss={this.onDismissSnackBar}
                style={{backgroundColor: '#59B03B'}}
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
            {this.state.id_pedido !== '' ? (
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Button
                  mode="outlined"
                  style={{
                    width: '47%',
                    marginTop: '10%',
                    marginLeft: '2%',
                    backgroundColor: 'black',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: '#F7B21E'}}}
                  onPress={() => this.setState({show_unidades: true})}>
                  <Icon name="pen" size={35} />
                  Unidades
                </Button>
                <Button
                  mode="outlined"
                  style={{
                    width: '47%',
                    marginTop: '10%',
                    marginLeft: '2%',
                    backgroundColor: 'black',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: '#F7B21E'}}}
                  onPress={() => this.setState({show_firma: true})}>
                  <Icon name="feather" size={35} />
                  Firma
                </Button>
              </View>
            ) : null}
            {this.state.id_pedido !== '' ? (
              <View>
                <Button
                  mode="outlined"
                  style={{
                    width: '90%',
                    marginTop: '5%',
                    marginLeft: '4%',
                    backgroundColor: 'black',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: '#F7B21E'}}}
                  onPress={() => this.select_file()}>
                  <Icon name="feather" size={35} />
                  Seleccionar Firma
                </Button>
                <Text style={styles.center_view}>{this.state.file.uri}</Text>
                <TextInput
                  mode="outlined"
                  multiline={true}
                  label="Ingresar Observación"
                  theme={{colors: {primary: '#ff8c00'}}}
                  style={styles.input}
                  value={this.state.observacion}
                  onChangeText={text => this.setState({observacion: text})}
                />
              </View>
            ) : null}
            
            <Button
              mode="outlined"
              style={{
                width: '60%',
                marginLeft: '20%',
                marginTop: '10%',
                backgroundColor: '#F7B21E',
              }}
              loading={this.state.cargando}
              theme={{colors: {primary: 'black'}}}
              onPress={() => this.crear_pedido()}>
              <Icon name="account-check-outline" size={35} />
              Registrar
            </Button>

            <Modal
              animationType="slide"
              visible={this.state.show_unidades}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <SafeAreaView>
                <ScrollView>
                  <View style={styles.center_view}>
                    <Text>unidades</Text>
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'green'}}}
                      onPress={() => this._hide_unidades()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              visible={this.state.show_firma}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <Button
                mode="outlined"
                style={{
                  width: '100%',
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'green'}}}
                onPress={() => this._hide_firma()}>
                <Icon name="check" size={35} />
                Finalizar
              </Button>
              {this.state.show_firma?
              <Firma />:null}
            </Modal>
          </View>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Crear_pedido);

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    width: '95%',
    marginLeft: '2%',
    marginTop: '5%',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
