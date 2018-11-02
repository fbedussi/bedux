let state = {}

const stateSubscribers = [];

export function subscribeState(cb) {
    stateSubscribers.push(cb);
}

//Use in case of emergency, normally state shoud be accessed trough actions
export function getState() {
    return {...state};
}

export function setState(newStatePortion) {
    const oldState = state;
    state = {...state, ...newStatePortion};
    stateSubscribers.forEach((cb) => cb(state, oldState));
}

export function dispatch(action) {
    if (action instanceof Promise) {
        return;
    }
    setState(typeof action === 'function' ? action({...state}) : action);
}