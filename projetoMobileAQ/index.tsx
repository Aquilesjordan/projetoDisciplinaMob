// index.tsx ou App.tsx
import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './AppNavigator';

export default function App() {
  return <AppNavigator />;
}

registerRootComponent(App);
