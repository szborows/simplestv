import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

import FullScreen from 'react-fullscreen';

main();

function main() {
    const app = document.createElement('div');

    document.body.appendChild(app);
    ReactDOM.render(
        <FullScreen>
            <App />
        </FullScreen>, app);
}
