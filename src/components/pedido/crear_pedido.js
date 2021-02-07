import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Modal,
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
import { Value } from 'react-native-reanimated';

class Crear_pedido extends Component {
  constructor(props) {
    super(props);
    let minDate = new Date()
    minDate.setDate(minDate.getDate() + 30);
    let enable_date = [
      minDate.getFullYear(),
      ('0' + (minDate.getMonth() + 1)).slice(-2),
      ('0' + minDate.getDate()).slice(-2)
    ].join('/');
    console.log(enable_date)
    this.state = {
      nombre_cliente: '',
      fecha: '',
      name: '',
      minDate: minDate,
      firma: '',
      observacion: '',
      cargando: false,
      clientes: [],
      clientes_aux: [],
      puntos_venta :[],
      punto_venta:'',
      searching: false,
      date: '',
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
      color: '',
      talla: '',
      precio_unitario:'',
      unidad_precio:'',
      referencias: [],
      colores_refencia: [],
      ref_color_tallas: [],
      referencias_aux: [],
      unidades: [],
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
    if (value != '' && value != undefined && value != null) {
      setTimeout(() => {
        const {nombre_cliente} = this.state;
        fetch(this.props.ruta+'/client/search/' + nombre_cliente, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            this.setState({clientes: response.payload, searching: false});
            let clientes = [];
            for (let i = 0; i < response.payload.length; i++) {
              let nombre = response.payload[i].NombreTercero;
              clientes.push({
                label: nombre,
                value: response.payload[i].NitTercero,
                key: response.payload[i].NitTercero,
              });
            }
            clientes = [...new Set(clientes)];
            this.setState({clientes_aux: clientes});
          })
          .catch(error => {
            this.setState({clientes: [], searching: false});
            alert(error);
          });
      }, 200);
    }else{
      this.setState({clientes: [], searching: false});
    }
  }

  search_referencia(value) {
    this.setState({
      id_referencia: value,
      searching: true,
      colores_refencia: [],
      ref_color_tallas: [],
    });
    fetch(this.props.ruta+'/pedido/search/item', {
      method: 'POST',
      body: JSON.stringify({
        DescripcionErp: value,
      }), // data can be `string` or {object}!
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        let temp = []
        for (let i = 0; i < response.payload.length; i++) {
          temp.push({
            label: response.payload[i].DescripcionErp,
            value: response.payload[i].CodigoErp,
            key: response.payload[i].CodigoErp,
          });
        }
        this.setState({referencias_aux:response.payload, referencias: temp, searching: false});
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }
  get_color_tallas(value){
    this.setState({id_referencia:value});
    this.search_color(value);
    this.search_talla(value);
  }
  search_color(value) {
    this.setState({
      searching: true,
      ref_color_tallas: []
    });
    fetch(this.props.ruta+'/pedido/get/color/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for(let i = 0; i < response.payload.length; i++){
          temp.push({
            label: response.payload[i].Ext1Color,
            value: response.payload[i],
            key: response.payload[i].Ext1,
          });
        }
        this.setState({
          colores_refencia: temp,
          searching: false,
        });
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      })
  }

  search_talla(value) {
    this.setState({
      searching: true,
      ref_color_tallas: []
    });
    fetch(this.props.ruta+'/pedido/get/talla/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for(let i = 0; i < response.payload.length; i++){
          temp.push({
            label: response.payload[i].F119Descripcion,
            value: response.payload[i],
            key: response.payload[i].IDExt2,
          });
        }
        this.setState({
          ref_color_tallas: temp,
          searching: false,
        });
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }

  search_puntos_envio(value) {
    this.setState({
      puntos_venta: []
    });
    fetch(this.props.ruta+'/pedido/get/puntos/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for(let i = 0; i < response.payload.length; i++){
          temp.push({
            label: response.payload[i].PuntoEnvio,
            value: response.payload[i],
            key: response.payload[i].F215Rowid,
          });
        }
        this.setState({
          puntos_venta: temp,
        });
      })
      .catch(error => {
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

  crear_pedido() {
    this.setState({cargando: true});
    const {id_cliente, date, observacion, direccion_despacho} = this.state;
    const {usuario} = this.props;
    let id_usuario = usuario.id_usuario;
    const ruta = this.state.file.uri;
    if (ruta !== '') {
      RNFS.readFile(ruta, 'base64') //substring(7) -> to remove the file://
        .then(res => this.setState({firma: res}));
    }
    let fechaAux = this.state.date.split("/");
    let data = {
      InfoPedido:{
        PvcDocID:this.state.id_cliente,
        PvcFechaEntrega:fechaAux[0]+"-"+fechaAux[1]+"-"+fechaAux[2]+"T00:00:00Z",
        PvcDocVendedor: this.props.usuario.UserID,
        F215ID:""+this.state.punto_venta,
        PvcNotas:this.state.observacion
      },
      DetallePedido:[]
    }
    for(let i = 0; i < this.state.unidades.length; i++){
      data.DetallePedido.push({
        PvcDetFechaEntrega:fechaAux[0]+""+fechaAux[1]+""+fechaAux[2],
        PvcDetCant: parseInt(""+this.state.unidades[i].Unidades),
        PvcDetNota: "NO TIENE",
        PvcDetReferencia: this.state.unidades[i].ReferenciaID,
        PvcDetExt1: this.state.unidades[i].Color,
        PvcDetExt2: this.state.unidades[i].Talla,
        PvcDetPrecioUnt: parseInt(""+this.state.unidades[i].PrecioUnitario),
      })
    }
    if(fechaAux.length < 2){
      this.setState({cargando: false, show_dialog:true, message:'Por favor seleccione una fecha de despacho'});
    }
    else if(data.DetallePedido.length == 0){
      this.setState({cargando: false, show_dialog:true, message:'Por favor agregue items al pedido'});
    }
    else{
      fetch(this.props.ruta+'/pedido/crear', {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if(response.status == 201){
          this.setState({cargando: false, show_dialog:true, message:'Registro Realizado!!'});
        }
      })
      .catch(error => {
        this.setState({cargando: false, show_dialog:true, message:'No se pudo realizar el pedido, por favor verifique conexión a internet.'});
        alert(error);
      });
    }
  }

  add_items() {
    let temp = this.state.unidades;
    let found = false;
    for(let i = 0; i < temp.length; i++){
      if(this.state.id_referencia == temp[i].Referencia 
        && this.state.color == temp[i].Color 
        && this.state.talla == temp[i].Talla){
        temp[i].Unidades = this.state.cantidad;
        found = true;
        break;
      }
    }
    
    let aux = "0"
    for(let j = 0; j < this.state.referencias_aux.length; j++){
      if(this.state.referencias_aux[j].CodigoErp == this.state.id_referencia ){
        aux = this.state.referencias_aux[j].F120Referencia.trim();
        break;
      }
    }
    if(!found){
      temp.push({ReferenciaID: aux,Referencia:this.state.id_referencia, Color:this.state.color.trim(), Talla:this.state.talla.IDExt2.trim(), Unidades:this.state.cantidad, PrecioUnitario:this.state.precio_unitario,PrecioUnidad: this.state.unidad_precio});
    }
    this.setState({unidades:temp});
  }

  delete_ref_pedido(value) {
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }
  set_id_cliente = value => {
    this.setState({id_cliente: value, searching:true});
    for (let i = 0; i < this.state.clientes.length; i++) {
      if (this.state.clientes[i].NitTercero === value) {
        fetch(this.props.ruta+'/client/info/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            if(response.payload.length > 0){
              this.setState({
                selected_cliente:{nit:response.payload[0].NitCC, email:response.payload[0].Email, direccion:response.payload[0].Direccion, telefono: response.payload[0].Telefono,celular: response.payload[0].Celular},
                searching:false
              })
            }
          })
          .catch(error => {
            this.setState({selected_cliente: {nit:'', email:'', direccion:'', telefono: '',celular: ''}, searching:false});
            alert(error);
          });
      }
    }
    this.setState({searching:false});
    this.search_puntos_envio(value);
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

    const punto_venta_label = {
      label: 'Dirección de despacho...',
      value: null,
      color: '#9EA0A4',
    };
    const elevation = 4;
    const size = 40;
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <Badge size={size} style={{backgroundColor: 'green'}}>
              {this.state.id_pedido}
            </Badge>
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
              style={styles.input}
              onChangeText={text => this.search_cliente_n(text)}
              value={this.state.nombre_cliente}
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
              <Title>Nro {this.state.selected_cliente.nit}</Title>
              <Paragraph>{"Correo: "+ (this.state.selected_cliente.email==undefined?"":this.state.selected_cliente.email)}</Paragraph>
              <Paragraph>{"Dirección: "+(this.state.selected_cliente.direccion==undefined?"":this.state.selected_cliente.direccion)}</Paragraph>
              <Paragraph>{"Teléfono: "+(this.state.selected_cliente.telefono==undefined?"":this.state.selected_cliente.telefono)}</Paragraph>
              <Paragraph>{"Celular: "+(this.state.selected_cliente.celular==undefined?"":this.state.selected_cliente.celular)}</Paragraph>
            </View>
            <Divider />
            <DatePicker
              style={{width: '90%', marginTop: '5%', marginLeft: '3%'}}
              date={this.state.date}
              mode="date"
              minDate = {this.state.minDate}
              placeholder="seleccionar Fecha Despacho"
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
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Button
                  mode="outlined"
                  style={{
                    width: '47%',
                    marginTop: '10%',
                    marginLeft: '2%',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: 'green'}}}
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
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: 'green'}}}
                  onPress={() => this.setState({show_firma: true})}>
                  <Icon name="feather" size={35} />
                  Firma
                </Button>
              </View>
              <View>
                <Button
                  mode="outlined"
                  style={{
                    width: '95%',
                    marginTop: '5%',
                    marginLeft: '2%',
                  }}
                  loading={this.state.cargando}
                  theme={{colors: {primary: 'green'}}}
                  onPress={() => this.select_file()}>
                  <Icon name="feather" size={35} />
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
                <RNPickerSelect
                      placeholder={punto_venta_label}
                      onValueChange={value => this.setState({punto_venta:value.F215Rowid})}
                      items={this.state.puntos_venta}
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
              </View>
              <Button
                mode="outlined"
                style={{
                  width: '90%',
                  marginLeft: '5%',
                  marginTop: '10%',
                  marginBottom: '2%',
                  backgroundColor: 'green',
                  borderRadius: 10,
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'white'}}}
                onPress={() => this.crear_pedido()}>
                <Icon name="account-check-outline" size={35} />
                Registrar Pedido
              </Button>
            <AwesomeAlert
              show={this.state.show_dialog}
              showProgress={false}
              title="Información"
              message={this.state.message}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="Aceptar"
              confirmButtonColor="green"
              onConfirmPressed={() => {
                this.setState({show_dialog:false});
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
                      onValueChange={value => this.get_color_tallas(value)}
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
                      onValueChange={value => this.setState({color: value.Ext1, precio_unitario: value.PrecioUnt, unidad_precio: value.UndPrecio})}
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
                      onValueChange={value => this.setState({talla:value})}
                      items={this.state.ref_color_tallas}
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
                      onPress={() => this.add_items()}>
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
                    {this.state.unidades.map((row, index) => (
                      <DataTable.Row
                        key={index}
                        onPress={() =>
                          this.delete_ref_pedido(row.id_consecutivo)
                        }>
                        <DataTable.Cell>{row.Referencia}</DataTable.Cell>
                        <DataTable.Cell>{row.Color}</DataTable.Cell>
                        <DataTable.Cell>{row.Talla}</DataTable.Cell>
                        <DataTable.Cell>{row.Unidades}</DataTable.Cell>
                        <DataTable.Cell>
                          <Icon name="delete" size={35} color="red" />
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                    <View style={styles.center_view}>
                      <Text style={{marginTop: '5%'}}>
                        TOTAL UNIDADES: 
                      </Text>
                      <Text>
                        PRECIO TOTAL:
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
    backgroundColor: 'red',
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
