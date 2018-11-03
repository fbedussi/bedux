# Bedux

A minimalistic global state manager

[demo](https://fbedussi.github.io/bedux/).

## Getting started
```html
<h1>Bedux demo</h1>

<h2>The Canonical Counter</h2>
<div id="counter">0</div>
<button id="plusOne">+1</button>
<button id="plusOneAsync">+1 async</button>
<button id="setTen">set 10</button>

<h2>Type and display</h2>
<input type="text" id="input1"/>
<div id="display1"></div>

<h2>Type and append</h2>
<input type="text" id="input2"/>
<div id="display2"></div>
```

```javascript
import {setState, dispatch, subscribeState} from './index.js';

const counter = document.querySelector('#counter');
const plusOneBtn = document.querySelector('#plusOne');
const plusOneAsyncBtn = document.querySelector('#plusOneAsync');
const setTenBtn = document.querySelector('#setTen');
const input1 = document.querySelector('#input1');
const input2 = document.querySelector('#input2');
const display1 = document.querySelector('#display1');
const display2 = document.querySelector('#display2');

setState({
    counter: 0,
    text: '',
    growingString: '',
});

//actions can be values or function taking values ad/or state
const actions = { 
    plusOne: (state) => ({counter: state.counter + 1}),
    
    //async action must be functions returning promises
    //to modify the state a new action must be dispatched when the promise is resolved
    plusOneAsync: () => new Promise((resolve) => setTimeout(function() {
        dispatch(actions.plusOne);
        resolve();
    })),
    setTen: {counter: 10},
    updateText: (text) => () => ({text}), 
    appendLetter: (letter) => (state) => ({growingString: state.growingString + letter}),
};

subscribeState(function(state) {
    counter.innerHTML = state.counter;
    display1.textContent = state.text;
    display2.textContent = state.growingString;
});

plusOneBtn.addEventListener('click', function() {
    dispatch(actions.plusOne);
});

plusOneAsyncBtn.addEventListener('click', function() {
    dispatch(actions.plusOneAsync);
});

setTenBtn.addEventListener('click', function() {
    dispatch(actions.setTen);
});

input1.addEventListener('input', function() {
    dispatch(actions.updateText(this.value));
});

input2.addEventListener('keydown', function() {
    dispatch(actions.appendLetter(this.value));
});
```
