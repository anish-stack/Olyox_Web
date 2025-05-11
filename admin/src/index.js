import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import './index.css'
import {Toaster} from 'react-hot-toast'

import App from './App'
import store from './store'
import ErrorBoundary from './ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>

  <Provider store={store}>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
  </Provider>
  </ErrorBoundary>
)

