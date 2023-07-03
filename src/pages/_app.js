
import { persistor, store } from '@/redux/store';
import '@/styles/globals.css'
import { ThemeProvider } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { createTheme } from "@mui/material/styles";

// Create a theme instance
export const theme = createTheme({
  // Customize your theme here
});



export default function App({ Component, pageProps }) {
  return (
   <ThemeProvider theme={theme}>
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Toaster
            position="top-center"
            reverseOrder={true}
          />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
   </ThemeProvider>
    )
}
