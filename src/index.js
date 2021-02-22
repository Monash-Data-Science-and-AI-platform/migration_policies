import React from 'react';
import ReactDOM from 'react-dom';
import Mediator from './Mediator';
import {Ion}  from "cesium"
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdjMTU0Yi00MmQxLTRhM2MtYTFjZS02ZTgwZTViZDdkMjciLCJpZCI6MzczNzgsImlhdCI6MTYxMjc1MDgyMX0.Flj_3KxCUzLkIgFfnF1meU0Fw_WvYHsNPogyTGd6Jms';



ReactDOM.render(<Mediator />, document.getElementById('root'));
