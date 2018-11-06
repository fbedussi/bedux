# Bedux

A minimalistic global state manager

[demo](https://fbedussi.github.io/bedux/).

Bedux is a simple yet powerful global state manager, heavily inspierd by hyperApp state management. It differs from other solutions, like Redux, in that actions are not messages that can or cannot be listend to to modify the state. In Bedux actions are functions that, when dispatched, directly modify the state. This is more *deterministic*, *less verbose* and *less error prone* compared to a pub/sub pattern. No need to define action's types, actions, action creator and reducers. No need to double check that the string written as the action's type matches the string used in the reducer. You just define a bunch of functions that receive values and return an udated state portion. There's no risk to forget to listen to an action and no risk to mispell an action's type. And say goodbye to that ugly mega switch statement too. 
Whenever Bedux returs the state it performs a shallow copy of the previous state, so a minimum grade of *immutability is enforced*. 
The downside is a little less freedom and more coupling compared to a pub/sub pattern. So it may or may not be the right tool, depending on your coding style and the app you are building.  
Do you need *async actions*? Bedux has you covered, without any additional lines of code. Just use a function that returns a promise. Functions that return a promise don't trigger state changes. To update state just dispatch another action when the async operation completes. 

## Api
- setState(state: object): sets the initial state
- subscribeState(callback: (state, oldState) => void): register a callback that will be called whenever the state changes. The callback receives two parameter: the new and the old state. 
- unsubscribeState(callback): removes the callback from the subscriber list.  
- subscribePartialState(callback: (state, oldState) => void, prop: string) register a callback that will be called only when state.prop will change.
- unsubscribePartialState(callback: (state, oldState) => void, prop: string) removes the callback from the subscriber list.
- dispatch(action: (value) => (state) => updatedStatePortion): dispatch an action.

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
