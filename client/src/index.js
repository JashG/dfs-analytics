import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  styles: {
    global: {},
  },
  components: {
    Button: {
      variants: {
        tab: {
          height: 'auto',
          fontSize: '2em',
          borderRadius: '12px 12px',
          padding: '20px',
        },
      },
    },
  },
  fonts: {
    body: 'Nunito, Roboto, Helvetica Neue, sans-serif',
    heading: 'Nunito, Roboto, Helvetica Neue, sans-serif',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
