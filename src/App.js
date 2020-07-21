import React from 'react';
import './App.css';
import Authors from './Authors.js';

function App() {
    return (
        <div className="app">
            <div className="appHeader"></div>
            <div className="appMain">
                <Authors></Authors>
            </div>
        </div>
    );
}

export default App;