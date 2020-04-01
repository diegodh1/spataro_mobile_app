import React from 'react';
import Login from './src/components/login';
import Usuario from './src/components/usuarios';
import Cliente from './src/components/cliente';
import Pedido from './src/components/pedido';
import Home from './src/components/home';
import Menu_perfil from './src/components/home/drawer_perfil';
import Crear_usuario from './src/components/usuarios/crear_usuario';
import Editar_usuario from './src/components/usuarios/editar_usuario';
import { Provider } from 'react-redux';
import store from './src/store';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
console.disableYellowBox = true;
const AppSwitchNavigator = createSwitchNavigator({
  inicio: { screen: Login },
  home: {screen: Home},
  Usuario: {screen: Usuario},
  Cliente: {screen: Cliente},
  Pedido: {screen: Pedido},
  Menu_perfil: {screen: Menu_perfil},
  Crear_usuario: {screen: Crear_usuario},
  Editar_usuario: {screen: Editar_usuario},
});
const AppContainer = createAppContainer(AppSwitchNavigator);

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
