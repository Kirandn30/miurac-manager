import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import store from './redux';

const myCache = createEmotionCache({
  key: 'mantine',
  prepend: false
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <MantineProvider
      emotionCache={myCache}
      theme={{
        colors: {
          // Add your color
          primary: [
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
            '#002137FF',
          ],
          secondary: [
            '#d7ffff',
            '#aaf8ff',
            '#7bf3ff',
            '#49ecfe',
            '#1ce7fd',
            '#02cde3',
            '#02CBE1',
            '#00737f',
            '#00454e',
            '#00191d',
          ],
        },

        primaryColor: 'primary',
        fontFamily: 'Poppins',
        defaultRadius: 8,
      }}
    >
      <Notifications />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
