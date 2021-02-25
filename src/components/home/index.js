import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Usuario from '../usuarios';
import Cliente from '../cliente';
import Pedido from '../pedido';
import Catalogo from '../catalogo';
import Menu_perfil from './drawer_perfil';
import Referencia from '../referencia';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';

let tipo = 'ADMINISTRADOR';
function get_perfil() {
  const profiles = useSelector(state => state.reducer.profiles);
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].ProfileID == 'VENDEDOR') {
      tipo = 'VENDEDOR';
    } else {
      tipo = 'ADMINISTRADOR';
      break
    }
  }
}
function CustomDrawerContent({progress, ...rest}) {
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View style={{transform: [{translateX}]}}>
        <View style={styles.drawerContent}>
          <Menu_perfil />
        </View>
        <DrawerItemList {...rest} />
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <React.Fragment>
      {tipo == 'ADMINISTRADOR' ? (
        <Drawer.Navigator
          drawerContent={props => <CustomDrawerContent {...props} />}
          drawerStyle={{
            backgroundColor: 'white',
            width: 260,
          }}
          drawerContentOptions={{
            activeTintColor: 'red',
            inactiveTintColor: 'black',
          }}>
          <Drawer.Screen
            name="Pedido"
            component={Pedido}
            options={{
              drawerIcon: config => (
                <Icon name="carryout" size={23} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="Usuario"
            component={Usuario}
            options={{
              drawerIcon: config => (
                <Icon name="user" size={23} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="Cliente"
            component={Cliente}
            options={{
              drawerIcon: config => (
                <Icon name="smileo" size={23} color="black" />
              ),
            }}
          />
          <Drawer.Screen
            name="Catalogo"
            component={Catalogo}
            options={{
              drawerIcon: config => (
                <Icon name="picture" size={23} color="black" />
              ),
            }}
          />
        </Drawer.Navigator>
      ) : (
        <Drawer.Navigator
          drawerContent={props => <CustomDrawerContent {...props} />}
          drawerStyle={{
            backgroundColor: '#252424',
            width: 260,
          }}
          drawerContentOptions={{
            activeTintColor: '#ff8c00',
            inactiveTintColor: '#CDCDCD',
          }}>
          <Drawer.Screen
            name="Pedido"
            component={Pedido}
            options={{
              drawerIcon: config => (
                <Icon name="carryout" size={23} color="white" />
              ),
            }}
          />
          <Drawer.Screen
            name="Catalogo"
            component={Catalogo}
            options={{
              drawerIcon: config => (
                <Icon name="file1" size={23} color="black" />
              ),
            }}
          />
        </Drawer.Navigator>
      )}
    </React.Fragment>
  );
}

export default function Home() {
  get_perfil()
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
