import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Modal,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TextInput,
  Button,
  Snackbar,
  Divider,
  Searchbar,
  DataTable,
  ActivityIndicator,
  Paragraph,
  Title,
  Badge,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Firma from './firma';
import AwesomeAlert from 'react-native-awesome-alerts';

class Editar_pedido extends Component {
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
      ver_firma:false,
      id_pedido: '',
      id_cliente: '',
      selected_cliente: {nombre: '', apellido: '', correo: '', id_cliente: ''},
      show_snack: false,
      message: '',
      show_firma: false,
      show_unidades: false,
      file: {uri: ''},
      base64: '',
      id_referencia: '',
      id_ref_color: '',
      id_consecutivo: '',
      referencias: [],
      colores_refencia: [],
      ref_color_tallas: [],
      ref_color_tallas_aux: [],
      cantidad: 0,
      item: {},
      informacion: {items: []},
      actualizando: false,
      show_dialog: false,
      estado_pedido: 'PENDIENTE',
      direccion_despacho: '',
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

  search_referencia(value) {
    this.setState({
      id_referencia: value,
      searching: true,
      colores_refencia: [],
      ref_color_tallas: [],
    });
    fetch('http://192.168.1.86:4000/search_ref', {
      method: 'POST',
      body: JSON.stringify({
        id_referencia: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({referencias: response.sugerencias, searching: false});
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }

  search_ref_color(value) {
    this.setState({
      searching: true,
      ref_color_tallas: [],
      id_referencia: value,
    });
    fetch('http://192.168.1.86:4000/search_ref_color', {
      method: 'POST',
      body: JSON.stringify({
        id_referencia: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          colores_refencia: response.sugerencias,
          searching: false,
        });
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }

  search_ref_color_talla(value) {
    this.setState({
      searching: true,
      id_ref_color: value,
    });
    fetch('http://192.168.1.86:4000/search_ref_color_talla', {
      method: 'POST',
      body: JSON.stringify({
        id_ref_color: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          ref_color_tallas: response.sugerencias,
          searching: false,
        });
        let aux_tallas = [];
        for (let i = 0; i < response.sugerencias.length; i++) {
          aux_tallas.push({
            label: '' + response.sugerencias[i].id_talla,
            value: '' + response.sugerencias[i].id_consecutivo,
          });
        }
        this.setState({ref_color_tallas_aux: aux_tallas});
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
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
  crear_pedido(value) {
    this.setState({cargando: true});
    const {id_cliente, date, observacion, direccion_despacho} = this.state;
    const ruta = this.state.file.uri;
    if (ruta !== '') {
      RNFS.readFile(ruta, 'base64') //substring(7) -> to remove the file://
        .then(res => this.setState({firma: res}));
    }
    setTimeout(() => {
      const {firma} = this.state;

      fetch('http://192.168.1.86:4000/editar_pedido', {
        method: 'POST',
        body: JSON.stringify({
          id_cliente,
          activo: value,
          fecha: date,
          firma,
          id_pedido: this.state.id_pedido,
          observacion,
          direccion: direccion_despacho,
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
            this.setState({
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
              selected_cliente: {
                nombre: '',
                apellido: '',
                correo: '',
                id_cliente: '',
              },
              show_snack: true,
              message: 'OPERACIÓN REALIZADA',
              show_firma: false,
              show_unidades: false,
              file: {uri: ''},
              base64: '',
              id_referencia: '',
              id_ref_color: '',
              id_consecutivo: '',
              referencias: [],
              colores_refencia: [],
              ref_color_tallas: [],
              ref_color_tallas_aux: [],
              cantidad: 0,
              item: {},
              informacion: {items: []},
              actualizando: false,
              show_dialog: false,
              estado_pedido: 'PENDIENTE',
              direccion_despacho: '',
            });
          }
        })
        .catch(error => {
          alert(error);
          this.setState({cargando: false});
        });
    }, 200);
  }
  search_pedido(value) {
    this.setState({id_pedido: value});
    if(value!==''){
      this.setState({searching: true});
    fetch('http://192.168.1.86:4000/search_pedido', {
      method: 'POST',
      body: JSON.stringify({
        id_pedido: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          searching: false,
          id_cliente: response.cliente.id_cliente,
          selected_cliente: response.cliente,
          firma: response.pedido.firma,
          date: response.pedido.fecha,
          observacion: response.pedido.observacion,
          direccion_despacho: response.pedido.direccion,
          estado_pedido: response.pedido.activo,
          informacion: response.unidades,
          searching: false
        });
      })
      .catch(error => {
        this.setState({
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
          id_cliente: '',
          selected_cliente: {
            nombre: '',
            apellido: '',
            correo: '',
            id_cliente: '',
          },
          show_snack: true,
          message: 'OPERACIÓN REALIZADA',
          show_firma: false,
          show_unidades: false,
          file: {uri: ''},
          base64: '',
          id_referencia: '',
          id_ref_color: '',
          id_consecutivo: '',
          referencias: [],
          colores_refencia: [],
          ref_color_tallas: [],
          ref_color_tallas_aux: [],
          cantidad: 0,
          item: {},
          informacion: {items: []},
          actualizando: false,
          show_dialog: false,
          estado_pedido: 'PENDIENTE',
          direccion_despacho: '',
        });
        alert(error);
      });
    }
  }

  registrar_unidades() {
    this.setState({cargando: true});
    if (
      Number(this.state.cantidad) &&
      this.state.cantidad > 0 &&
      this.state.id_consecutivo !== ''
    ) {
      fetch('http://192.168.1.86:4000/agregar_item_pedido', {
        method: 'POST',
        body: JSON.stringify({
          id_pedido: this.state.id_pedido,
          id_consecutivo: this.state.id_consecutivo,
          unidades: this.state.cantidad,
          precio: this.state.item.precio,
        }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(response => {
          if (response.message === 'Registro Realizado') {
            this.setState({cargando: false, cantidad: 0});
            this.dar_unidades_registradas();
          } else {
            this.setState({cargando: false});
            alert(response.message);
          }
        })
        .catch(error => {
          this.setState({cargando: false});
          alert(error);
        });
    } else {
      this.setState({cargando: false});
      alert(
        'La cantidad debe ser un número y mayor a 0, y debe escoger una referencia, color y talla',
      );
    }
  }

  dar_unidades_registradas() {
    fetch('http://192.168.1.86:4000/dar_items_guardados', {
      method: 'POST',
      body: JSON.stringify({
        id_pedido: this.state.id_pedido,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({informacion: response});
      })
      .catch(error => {
        alert(error);
      });
  }
  delete_ref_pedido(value) {
    this.setState({actualizando: true});
    fetch('http://192.168.1.86:4000/eliminar_ref_unidades', {
      method: 'POST',
      body: JSON.stringify({
        id_pedido: this.state.id_pedido,
        consecutivo: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          this.setState({actualizando: false});
          this.dar_unidades_registradas();
        } else {
          this.setState({actualizando: false});
          alert(response.message);
        }
      })
      .catch(error => {
        this.setState({actualizando: false});
        alert(error);
      });
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }
  set_id_cliente = value => {
    this.setState({id_cliente: value});
    for (let i = 0; i < this.state.clientes.length; i++) {
      if (this.state.clientes[i].id_cliente === value) {
        this.setState({selected_cliente: this.state.clientes[i]});
      }
    }
  };
  set_id_consecutivo = value => {
    this.setState({id_consecutivo: value});
    let temp = this.state.ref_color_tallas;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id_consecutivo == value) {
        this.setState({item: temp[i]});
      }
    }
  };
  set_cantidad = value => {
    this.setState({cantidad: value});
  };
  onDismissSnackBar = () => this.setState({show_snack: false});
  _hide_unidades = () => this.setState({show_unidades: false});
  _hide_firma = () => this.setState({show_firma: false});
  bounce() {
    this.refs.view.rubberBand();
  }

  hide_dialog = value => {
    this.setState({show_dialog: false, estado_pedido: value});
    this.crear_pedido(value);
  };
  show_crear_pedido = () => {
    if (this.state.id_pedido === '') {
      this.crear_pedido('PENDIENTE');
    } else {
      this.setState({show_dialog: true});
    }
  };
  render() {
    const {usuario} = this.props;
    const placeholder = {
      label: 'Seleccionar un cliente...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_ref = {
      label: 'Seleccionar una referencia...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_color = {
      label: 'Seleccionar un color...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_talla = {
      label: 'Seleccionar una talla...',
      value: null,
      color: '#9EA0A4',
    };
    const elevation = 4;
    const size = 40;
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <Badge size={size} style={{backgroundColor: 'red'}}>
              {this.state.id_pedido}
            </Badge>
            <Searchbar
              placeholder="Buscar Pedido"
              theme={{colors: {primary: '#ff8c00'}}}
              style={{width: '90%', marginLeft: '5%'}}
              onChangeText={text => this.search_pedido(text)}
              value={this.state.id_pedido}
            />
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

            <Searchbar
              placeholder="Buscar por Nombre"
              theme={{colors: {primary: '#ff8c00'}}}
              style={{width: '90%', marginLeft: '5%'}}
              onChangeText={text => this.search_cliente_n(text)}
              value={this.state.nombre_cliente}
            />
            <Divider />
            <Searchbar
              placeholder="Buscar por Apellido"
              theme={{colors: {primary: '#ff8c00'}}}
              style={{width: '90%', marginLeft: '5%'}}
              onChangeText={text => this.search_cliente_a(text)}
              value={this.state.apellido_cliente}
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
            <View style={{width: '90%', marginLeft: '5%', marginTop: '3%'}}>
              <Title>Nro {this.state.selected_cliente.id_cliente}</Title>
              <Paragraph>
                {this.state.selected_cliente.nombre +
                  ' ' +
                  this.state.selected_cliente.apellido}
              </Paragraph>
              <Paragraph>{this.state.selected_cliente.correo}</Paragraph>
            </View>
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
                    width: '95%',
                    marginTop: '5%',
                    marginLeft: '2%',
                    backgroundColor: 'black',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: '#F7B21E'}}}
                  onPress={() => this.setState({ver_firma: true})}>
                  <Icon name="camera-iris" size={25} />
                  Visualizar Firma
                </Button>
                <Button
                  mode="outlined"
                  style={{
                    width: '95%',
                    marginTop: '5%',
                    marginLeft: '2%',
                    backgroundColor: 'black',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: '#F7B21E'}}}
                  onPress={() => this.select_file()}>
                  <Icon name="cursor-pointer" size={25} />
                  Seleccionar Firma
                </Button>
                <TextInput
                  mode="outlined"
                  multiline={true}
                  label="Ingresar Observación"
                  theme={{colors: {primary: '#ff8c00'}}}
                  style={styles.input}
                  value={this.state.observacion}
                  onChangeText={text => this.setState({observacion: text})}
                />
                <TextInput
                  mode="outlined"
                  label="Ingresar Dirección Despacho"
                  theme={{colors: {primary: '#ff8c00'}}}
                  style={styles.input}
                  value={this.state.direccion_despacho}
                  onChangeText={text =>
                    this.setState({direccion_despacho: text})
                  }
                />
              </View>
            ) : null}
            {this.state.id_pedido === '' ? (
              <Button
                mode="outlined"
                style={{
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: '10%',
                  backgroundColor: '#F7B21E',
                  borderRadius: 10,
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'black'}}}
                onPress={() => this.show_crear_pedido()}>
                <Icon name="account-check-outline" size={35} />
                Registrar Pedido
              </Button>
            ) : (
              <Button
                mode="outlined"
                style={{
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: '10%',
                  backgroundColor: '#F7B21E',
                  borderRadius: 10,
                }}
                loading={this.state.cargando}
                disabled={this.state.estado_pedido==='ENVIADO'?true:false}
                theme={{colors: {primary: 'black'}}}
                onPress={() => this.show_crear_pedido()}>
                <Icon name="account-check-outline" size={35} />
                Actualizar Pedido
              </Button>
            )}
            <AwesomeAlert
              show={this.state.show_dialog}
              showProgress={false}
              title="¿Qué desea hacer con el pedido?"
              message="Si lo finaliza podrá editar el pedido después pero no se enviará al correo de la persona y si lo envía no podrá editarlo después pero se enviará el correo"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="Finalizar"
              confirmText="Enviar"
              confirmButtonColor="#DD6B55"
              cancelButtonColor="green"
              onCancelPressed={() => {
                this.hide_dialog('FINALIZADO');
              }}
              onConfirmPressed={() => {
                this.hide_dialog('ENVIADO');
              }}
            />
            <Modal
              animationType="slide"
              visible={this.state.show_unidades}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <SafeAreaView>
                <ScrollView>
                  <View>
                    {this.state.searching ? (
                      <View style={styles.center_view}>
                        <ActivityIndicator
                          animating={true}
                          style={{
                            top: '35%',
                            position: 'absolute',
                            right: '20%',
                          }}
                          color="red"
                        />
                        <Text style={{fontSize: 20, marginTop: '5%'}}>
                          Buscando
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.center_view}>
                        <Text style={{fontSize: 20, marginTop: '5%'}}>
                          Buscar Sugerencias
                        </Text>
                      </View>
                    )}
                    <TextInput
                      mode="outlined"
                      label="Buscar Referencia"
                      theme={{colors: {primary: '#ff8c00'}}}
                      style={styles.input}
                      value={this.state.id_referencia}
                      onChangeText={text => this.search_referencia(text)}
                    />
                    <RNPickerSelect
                      placeholder={placeholder_ref}
                      onValueChange={value => this.search_ref_color(value)}
                      items={this.state.referencias}
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
                    <RNPickerSelect
                      placeholder={placeholder_color}
                      onValueChange={value =>
                        this.search_ref_color_talla(value)
                      }
                      items={this.state.colores_refencia}
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
                    <RNPickerSelect
                      placeholder={placeholder_talla}
                      onValueChange={value => this.set_id_consecutivo(value)}
                      items={this.state.ref_color_tallas_aux}
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
                    <TextInput
                      mode="outlined"
                      label="Ingresar Cantidad"
                      theme={{colors: {primary: '#ff8c00'}}}
                      style={styles.input}
                      value={this.state.cantidad}
                      onChangeText={text => this.set_cantidad(text)}
                    />
                    <Button
                      mode="outlined"
                      style={{
                        width: '70%',
                        marginLeft: '15%',
                        backgroundColor: 'black',
                        borderRadius: 10,
                        marginTop: '5%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: '#F7B21E'}}}
                      onPress={() => this.registrar_unidades()}>
                      <Icon name="cart" size={35} />
                      Agregar
                    </Button>
                    <View>
                      {this.state.actualizando ? (
                        <View style={styles.center_view}>
                          <ActivityIndicator
                            animating={true}
                            style={{
                              top: '35%',
                              position: 'absolute',
                              right: '20%',
                            }}
                            color="red"
                          />
                          <Text style={{fontSize: 20, marginTop: '5%'}}>
                            actualizando
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.center_view}>
                          <Text style={{fontSize: 20, marginTop: '5%'}}>
                            Información
                          </Text>
                        </View>
                      )}
                    </View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Referencia</DataTable.Title>
                        <DataTable.Title>Color</DataTable.Title>
                        <DataTable.Title>Talla</DataTable.Title>
                        <DataTable.Title>Unidades</DataTable.Title>
                        <DataTable.Title>Eliminar</DataTable.Title>
                      </DataTable.Header>
                    </DataTable>
                    {this.state.informacion.items.map((row, index) => (
                      <DataTable.Row
                        key={index}
                        onPress={() =>
                          this.delete_ref_pedido(row.id_consecutivo)
                        }>
                        <DataTable.Cell>{row.referencia}</DataTable.Cell>
                        <DataTable.Cell>{row.color}</DataTable.Cell>
                        <DataTable.Cell>{row.id_talla}</DataTable.Cell>
                        <DataTable.Cell>{row.unidades}</DataTable.Cell>
                        <DataTable.Cell>
                          <Icon name="delete" size={35} color="red" />
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                    <View style={styles.center_view}>
                      <Text style={{marginTop: '5%'}}>
                        TOTAL UNIDADES: {this.state.informacion.unidades_total}
                      </Text>
                      <Text>
                        PRECIO TOTAL: {this.state.informacion.precio_total}
                      </Text>
                    </View>
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                        marginTop: '5%',
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
              {this.state.show_firma ? <Firma /> : null}
            </Modal>
            <Modal
              animationType="slide"
              visible={this.state.ver_firma}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <Button
                mode="outlined"
                style={{
                  width: '100%',
                }}
                theme={{colors: {primary: 'green'}}}
                onPress={() => this.setState({ver_firma:false})}>
                <Icon name="check" size={35} />
                Finalizar
              </Button>
              <Image
              style={{width: '100%',
                height: '70%',}}
                source={{uri: `data:image/png;base64,${this.state.firma}`}}
              />
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
)(Editar_pedido);

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
