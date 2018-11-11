let state = {}

let stateSubscribers = [];
let partialStateSubscribers = {};

export function subscribeState(cb) {
    if (typeof cb !== 'function') {
        return;
    }
    
    unsubscribeState(cb);
    stateSubscribers.push(cb);
}

export function subscribePartialState(prop, cb) {
    if (typeof cb !== 'function') {
        return;
    }
    
    unsubscribePartialState(prop, cb);

    if (typeof partialStateSubscribers[prop] === 'undefined') {
        partialStateSubscribers[prop] = [];
    }

    partialStateSubscribers[prop].push(cb);
}

export function unsubscribeState(cb) {
    stateSubscribers = stateSubscribers.filter((registeredCb) => registeredCb != cb); 
}

export function unsubscribePartialState(prop, cb) {
    if (typeof partialStateSubscribers[prop] !== 'undefined') {
        partialStateSubscribers[prop] = partialStateSubscribers[prop].filter((registeredCb) => registeredCb != cb); ;
    }
}

//Use in case of emergency, normally state should be accessed trough actions
export function getState() {
    return {...state};
}

function getNestedValue(obj, key) {
    return key
        .split('.')
        .reduce((nestedValue, partialKey) => {
            return nestedValue && nestedValue.hasOwnProperty(partialKey) ? nestedValue[partialKey] : null;
        }, obj);
}

export function setState(newStatePortion) {
    if (newStatePortion instanceof Promise) {
        return;
    }
    
    const oldState = state;
    state = {...state, ...newStatePortion};
    
    stateSubscribers.forEach((cb) => cb(state, oldState));

    Object.keys(partialStateSubscribers)
        .forEach( (key) => {
            const oldValue = getNestedValue(oldState, key);
            const newValue = getNestedValue(state, key); 
            if (newValue !== oldValue) {
                partialStateSubscribers[key].forEach((cb) => cb(newValue, oldValue))
            } 
        });
}

export function dispatch(action) {
    if (action instanceof Promise) {
        return;
    }
    setState(typeof action === 'function' ? action({...state}) : action);
}