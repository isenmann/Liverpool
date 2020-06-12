import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {IntlProvider} from "react-intl";

import {en, de} from './i18n/index';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const locale = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
const msg = {
    'en-US': en,
    'en-GB': en,
    'de-DE': de,
    'de': de,
};

const message = (locale === 'en-US') ? en : Object.assign({}, en, msg[locale]);

ReactDOM.render(
    <IntlProvider locale={locale} messages={message}>
        <BrowserRouter basename={baseUrl}>
            <App />
        </BrowserRouter>
    </IntlProvider>,
  rootElement);

registerServiceWorker();

