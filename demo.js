import {setState, dispatch, subscribeState} from './index.js';

const counter = document.querySelector('#counter');
const plusOneBtn = document.querySelector('#plusOne');
const plusOneAsyncBtn = document.querySelector('#plusOneAsync');
const setTenBtn = document.querySelector('#setTen');

setState({counter: 0});

const actions = {
    plusOne: (state) => ({counter: state.counter + 1}),
    plusOneAsync: () => new Promise((resolve) => setTimeout(function() {
        dispatch(actions.plusOne);
        resolve();
    })),
    setTen: {counter: 10},
};

subscribeState(function(state) {
    counter.innerHTML = state.counter;
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