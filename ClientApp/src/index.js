import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import {IntlProvider} from "react-intl";

import {en, de} from './i18n/index';

const locale = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
const msg = {
    'en-US': en,
    'en-GB': en,
    'de-DE': de,
    'de': de,
};

const message = (locale === 'en-US') ? en : Object.assign({}, en, msg[locale]);

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={message}>
      <Router>
          <App />
      </Router>
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
