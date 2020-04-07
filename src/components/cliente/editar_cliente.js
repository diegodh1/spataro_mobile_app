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

class Editar_cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_usuario: '',
      id_usuario_aux: '',
      name: '',
      last_name: '',
      email: '',
      activo: false,
      tipos_doc: [],
      visible_menu: false,
      show_error_doc: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
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
      direcciones: [],
      telefonos: [],
    };
    this.registrar_direccion = this.registrar_direccion.bind(this);
    this.delete_direccion = this.delete_direccion.bind(this);
    this.registrar_telefono = this.registrar_telefono.bind(this);
    this.delete_telefonos = this.delete_telefonos.bind(this);
  }

  componentDidMount() {
    fetch('http://192.168.1.86:4000/get_documentos', {
      method: 'POST',
      body: JSON.stringify({}), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({tipos_doc: response});
      })
      .catch((error) => {
        alert(error);
      });
  }

  search_ciudad(value) {
    this.setState({id_ciudad: value, searching: true});

    fetch('http://192.168.1.86:4000/get_ciudades', {
      method: 'POST',
      body: JSON.stringify({
        id_ciudad: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({ciudades: response, searching: false});
      })
      .catch((error) => {
        this.setState({searching: false});
        alert(error);
      });
  }

  search_pais(value) {
    this.setState({id_pais: value, searching: true});

    fetch('http://192.168.1.86:4000/get_paises', {
      method: 'POST',
      body: JSON.stringify({
        id_pais: value,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({paises: response, searching: false});
      })
      .catch((error) => {
        this.setState({searching: false});
        alert(error);
      });
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }
  _showModal_ciudad = () => this.setState({ciudad_open: true});
  _hideModal_ciudad = () => this.setState({ciudad_open: false});
  _showModal_pais = () => this.setState({pais_open: true});
  _hideModal_pais = () => this.setState({pais_open: false});
  _showModal_direccion = () => this.setState({direccion_open: true});
  _hideModal_direccion = () => this.setState({direccion_open: false});
  _showModal_telefono = () => this.setState({telefono_open: true});
  _hideModal_telefono = () => this.setState({telefono_open: false});

  _onDismissSnackBar = () => this.setState({show_snackbar: false});

  comprobar_form = () => {
    if (!Number(this.state.id_usuario_aux))
      this.setState({show_error_doc: true});
    if (this.state.name.length < 1) this.setState({show_error_name: true});
    if (this.state.last_name.length < 1) this.setState({show_error_last: true});
    if (!this.state.email.includes('@'))
      this.setState({show_error_email: true});
    if (Number(this.state.id_usuario_aux))
      this.setState({show_error_doc: false});
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
        fetch('http://192.168.1.86:4000/editar_cliente', {
          method: 'POST',
          body: JSON.stringify({
            id_cliente: this.state.id_usuario_aux,
            id_client_aux: this.state.id_usuario,
            id_tipo_doc: this.state.id_tipo_doc,
            nombre: this.state.name,
            apellido: this.state.last_name,
            correo: this.state.email,
            activo: this.state.activo,
            direcciones: this.state.direcciones,
            telefonos: this.state.telefonos,
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                mensaje: 'Registro realizado con éxito',
                show_snackbar: true,
                id_usuario_aux: '',
                id_tipo_doc: '',
                name: '',
                last_name: '',
                email: '',
                direcciones: [],
                telefonos: [],
                cargando: false,
              });
            } else {
              this.setState({
                mensaje: response.message,
                show_snackbar: true,
                cargando: false,
              });
            }
          })
          .catch((error) => {
            this.setState({
              show_snackbar: true,
              mensaje: error,
              cargando: false,
            });
          });
      }
    }, 100);
  };
  registrar_direccion() {
    if (
      this.state.id_pais.length > 2 &&
      this.state.id_ciudad.length > 2 &&
      this.state.id_direccion.length > 1
    ) {
      this.setState({error_direccion_tel: false});
      this.refs['direccion'].rubberBand();
      let {id_direccion, direcciones} = this.state;
      direcciones.push({
        id_pais: this.state.id_pais,
        id_ciudad: this.state.id_ciudad,
        direccion: id_direccion,
      });
      this.setState({direcciones: direcciones});
    } else {
      this.setState({error_direccion_tel: true});
    }
  }
  delete_direccion(dir) {
    let {direcciones} = this.state;
    direcciones = direcciones.filter((x) => x.direccion !== dir);
    this.setState({direcciones: direcciones});
  }

  search_cliente(text) {
    this.setState({id_usuario: text, searching: true});
    fetch('http://192.168.1.86:4000/search_cliente', {
      method: 'POST',
      body: JSON.stringify({
        id_cliente: text,
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          id_usuario_aux: ""+response.id_cliente,
          id_tipo_doc: response.id_tipo_doc,
          name: response.nombre,
          last_name: response.apellido,
          email: response.correo,
          direcciones: response.direcciones,
          telefonos: response.telefonos,
          activo: response.activo,
          searching: false,
        });
      })
      .catch((error) => {
        this.setState({
          searching: false,
        });
      });
  }
  registrar_telefono() {
    if (
      this.state.id_pais.length > 2 &&
      this.state.id_ciudad.length > 2 &&
      this.state.id_telefono.length > 1
    ) {
      this.setState({error_direccion_tel: false});
      this.refs['telefono'].rubberBand();
      let {id_telefono, telefonos} = this.state;
      telefonos.push({
        id_pais: this.state.id_pais,
        id_ciudad: this.state.id_ciudad,
        telefono: id_telefono,
      });
      this.setState({telefonos: telefonos});
    } else {
      this.setState({error_direccion_tel: true});
    }
  }
  delete_telefonos(tel) {
    let {telefonos} = this.state;
    telefonos = telefonos.filter((x) => x.telefono !== tel);
    this.setState({telefonos: telefonos});
  }
  _activar_desactivar_cliente = () =>
  this.setState(state => ({activo: !state.activo}));


  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{height: '100%'}}>
            {this.state.searching ? (
              <View style={styles.center_view}>
                <ActivityIndicator
                  animating={true}
                  style={{top: 0, right: '20%', position: 'absolute'}}
                  color="red"
                />
                <Text>Buscando</Text>
              </View>
            ) : (
              <View style={styles.center_view}>
                <Text>Buscar Cliente por Id</Text>
              </View>
            )}
            <TextInput
              mode="outlined"
              label="Id Ciente"
              theme={{colors: {primary: '#ff8c00'}}}
              style={styles.input}
              value={this.state.id_usuario}
              onChangeText={(text) => this.search_cliente(text)}
            />
            <Picker
              selectedValue={this.state.id_tipo_doc}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({id_tipo_doc: itemValue})
              }>
              {this.state.tipos_doc.map((row) => (
                <Picker.Item label={row.id_tipo_doc} value={row.id_tipo_doc} />
              ))}
            </Picker>
            <TextInput
              mode="outlined"
              label="Nro. Documento"
              theme={{colors: {primary: '#ff8c00'}}}
              style={styles.input}
              value={this.state.id_usuario_aux}
              onChangeText={(text) => this.setState({id_usuario_aux: text})}
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
              onChangeText={(text) => this.setState({name: text})}
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
              onChangeText={(text) => this.setState({last_name: text})}
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
              onChangeText={(text) => this.setState({email: text})}
            />
            {this.state.show_error_email ? (
              <HelperText type="error" visible={this.state.show_error_email}>
                El correo debe ser valido ejemplo: asd@gmail.com
              </HelperText>
            ) : null}
             <View style={styles.container}>
            <Text>Activar o Desactivar Cliente</Text>
            <Switch
              style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
              trackColor={{false: '#767577', true: '#59B02F'}}
              thumbColor={this.state.activo ? '#EDF3EB' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this._activar_desactivar_cliente()}
              value={this.state.activo}
            />
            </View>
            <Modal
              animationType="slide"
              visible={this.state.ciudad_open}
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
                          style={{top: 0, right: '20%', position: 'absolute'}}
                          color="red"
                        />
                        <Text>Buscando</Text>
                      </View>
                    ) : (
                      <View style={styles.center_view}>
                        <Text>Seleccionar Ciudad</Text>
                      </View>
                    )}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput
                        mode="outlined"
                        label="Ciudad"
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={{width: '90%', marginLeft: '2%'}}
                        value={this.state.id_ciudad}
                        onChangeText={(text) => this.search_ciudad(text)}
                      />
                    </View>
                    {this.state.ciudades.map((row, index) => (
                      <List.Item
                        title={row.id_ciudad}
                        onPress={() =>
                          this.setState({id_ciudad: row.id_ciudad})
                        }
                        left={(props) => (
                          <List.Icon {...props} color="#000" icon="magnify" />
                        )}
                      />
                    ))}
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'green'}}}
                      onPress={() => this._hideModal_ciudad()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              visible={this.state.pais_open}
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
                          style={{top: 0, right: '20%', position: 'absolute'}}
                          color="red"
                        />
                        <Text>Buscando</Text>
                      </View>
                    ) : (
                      <View style={styles.center_view}>
                        <Text>Seleccionar País</Text>
                      </View>
                    )}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput
                        mode="outlined"
                        label="País"
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={{width: '90%', marginLeft: '2%'}}
                        value={this.state.id_pais}
                        onChangeText={(text) => this.search_pais(text)}
                      />
                    </View>
                    {this.state.paises.map((row, index) => (
                      <List.Item
                        title={row.id_pais}
                        onPress={() => this.setState({id_pais: row.id_pais})}
                        left={(props) => (
                          <List.Icon {...props} color="#000" icon="magnify" />
                        )}
                      />
                    ))}
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'green'}}}
                      onPress={() => this._hideModal_pais()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              visible={this.state.direccion_open}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <SafeAreaView>
                <ScrollView>
                  <View style={styles.center_view}>
                    <View style={{marginTop: '4%'}}>
                      <Text style={{fontSize: 20}}>Registrar Dirección</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput
                        mode="outlined"
                        label="Dirección"
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={{width: '85%', marginLeft: '2%'}}
                        value={this.state.id_direccion}
                        onChangeText={(text) =>
                          this.setState({id_direccion: text})
                        }
                      />
                      <TouchableWithoutFeedback
                        onPress={this.registrar_direccion}>
                        <Animatable.View ref="direccion">
                          <Icon
                            name="checkbox-marked"
                            color="green"
                            size={60}
                          />
                        </Animatable.View>
                      </TouchableWithoutFeedback>
                    </View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Dirección</DataTable.Title>
                        <DataTable.Title numeric>Eliminar</DataTable.Title>
                      </DataTable.Header>
                      {this.state.direcciones.map((row, index) => (
                        <DataTable.Row
                          key={index}
                          onPress={() => this.delete_direccion(row.direccion)}>
                          <DataTable.Cell>{row.direccion}</DataTable.Cell>
                          <DataTable.Cell numeric>
                            <Icon name="close-circle" color="red" size={30} />
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                    <Snackbar
                      visible={this.state.error_direccion_tel}
                      onDismiss={this._onDismissSnackBar}
                      duration={2}
                      style={{backgroundColor: '#E74026'}}
                      action={{
                        label: 'OK',
                        onPress: () => {
                          this.setState({error_direccion_tel: false});
                        },
                      }}>
                      El país, la ciudad y la dirección no pueden ser vacio
                    </Snackbar>
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'green'}}}
                      onPress={() => this._hideModal_direccion()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              visible={this.state.telefono_open}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <SafeAreaView>
                <ScrollView>
                  <View style={styles.center_view}>
                    <View style={{marginTop: '4%'}}>
                      <Text style={{fontSize: 20}}>Registrar Teléfono</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput
                        mode="outlined"
                        label="Teléfono"
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={{width: '85%', marginLeft: '2%'}}
                        value={this.state.id_telefono}
                        onChangeText={(text) =>
                          this.setState({id_telefono: text})
                        }
                      />
                      <TouchableWithoutFeedback
                        onPress={this.registrar_telefono}>
                        <Animatable.View ref="telefono">
                          <Icon
                            name="checkbox-marked"
                            color="green"
                            size={60}
                          />
                        </Animatable.View>
                      </TouchableWithoutFeedback>
                    </View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Teléfono</DataTable.Title>
                        <DataTable.Title numeric>Eliminar</DataTable.Title>
                      </DataTable.Header>
                      {this.state.telefonos.map((row, index) => (
                        <DataTable.Row
                          key={index}
                          onPress={() => this.delete_telefonos(row.telefono)}>
                          <DataTable.Cell>{row.telefono}</DataTable.Cell>
                          <DataTable.Cell numeric>
                            <Icon name="close-circle" color="red" size={30} />
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                    <Snackbar
                      visible={this.state.error_direccion_tel}
                      onDismiss={this._onDismissSnackBar}
                      duration={2}
                      style={{backgroundColor: '#E74026'}}
                      action={{
                        label: 'OK',
                        onPress: () => {
                          this.setState({error_direccion_tel: false});
                        },
                      }}>
                      El país, la ciudad y el teléfono no pueden ser vacio
                    </Snackbar>
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'green'}}}
                      onPress={() => this._hideModal_telefono()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>
            <Divider />

            <View style={{flex: 1, flexDirection: 'row'}}>
              <FAB
                style={styles.fab}
                small
                label="País"
                icon="map-marker-outline"
                onPress={() => this._showModal_pais()}
              />
              <FAB
                style={styles.fab}
                small
                icon="earth"
                label="Ciudad"
                onPress={() => this._showModal_ciudad()}
              />
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <FAB
                style={styles.fab}
                small
                icon="home-outline"
                label="Dirección"
                onPress={() => this._showModal_direccion()}
              />
              <FAB
                style={styles.fab}
                small
                label="Teléfono"
                icon="phone-outline"
                onPress={() => this._showModal_telefono()}
              />
            </View>
            <Button
              mode="outlined"
              style={{width: '60%', marginLeft: '20%', marginTop: '5%'}}
              loading={this.state.cargando}
              theme={{colors: {primary: 'green'}}}
              onPress={() => this.comprobar_form()}>
              <Icon name="account-check-outline" size={35} />
              Editar Cliente
            </Button>
            {this.state.show_snackbar &&
            this.state.mensaje === 'Registro realizado con éxito' ? (
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
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Editar_cliente);

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
