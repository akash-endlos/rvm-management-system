
import { persistor, store } from '@/redux/store';
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Toaster
            position="top-center"
            reverseOrder={true}
          />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
    )
}
