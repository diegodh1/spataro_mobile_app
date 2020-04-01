import { createStore, combineReducers,applyMiddleware } from 'redux';
import reducer from './reducer';
import middleware from './middleware';

const redux_reducer = combineReducers({
    reducer,
});
const store = createStore(redux_reducer,undefined,applyMiddleware(middleware));
export default store;