let state = {}

let stateSubscribers = [];
let partialStateSubscribers = {};

export function subscribeState(cb) {
    if(typeof cb !== 'function') {
        return;
    }
    
    unsubscribeState(cb);
    stateSubscribers.push(cb);
}

export function subscribePartialState(cb, prop) {
    if(typeof cb !== 'function') {
        return;
    }
    
    unsubscribePartialState(cb, prop);

    if(typeof partialStateSubscribers[prop] === 'undefined') {
        partialStateSubscribers[prop] = [];
    }

    partialStateSubscribers[prop].push(cb);
}

export function unsubscribeState(cb) {
    stateSubscribers = stateSubscribers.filter((registeredCb) => registeredCb != cb); 
}

export function unsubscribePartialState(cb, prop) {
    if(typeof partialStateSubscribers[prop] !== 'undefined') {
        partialStateSubscribers[prop] = partialStateSubscribers[prop].filter((registeredCb) => registeredCb != cb); ;
    }
}

//Use in case of emergency, normally state shoud be accessed trough actions
export function getState() {
    return {...state};
}

export function setState(newStatePortion) {
    if (newStatePortion instanceof Promise) {
        return;
    }
    const oldState = state;
    state = {...state, ...newStatePortion};
    
    stateSubscribers.forEach((cb) => cb(state, oldState));

    Object.entries(partialStateSubscribers)
        .map( ([prop, subscribers]) => (
            {prop, subscribers}
        ))
        .filter( ({prop}) =>
            oldState[prop] !== state[prop]
        )
        .forEach( ({subscribers}) =>
            subscribers.forEach((cb) => cb(state, oldState))
        );
}

export function dispatch(action) {
    if (action instanceof Promise) {
        return;
    }
    setState(typeof action === 'function' ? action({...state}) : action);
}