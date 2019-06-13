/** @format */
import './core/types';
import './workspace/config';

import {AppRegistry} from 'react-native';
import App from './workspace/main';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
