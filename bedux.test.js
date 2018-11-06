beforeEach(() => {
    jest.clearAllMocks()
        .resetModules();
})

test('getState', () => {
    const { getState } = require('./bedux');
    
    expect(getState()).toEqual({});
});

test('setState', () => {
    const { setState, getState } = require('./bedux');

    const state = {
        a: 'a'
    };
    setState(state)

    expect(getState()).toEqual(state);

    const stateUpdate = {b: 'b'};
    setState(stateUpdate);

    expect(getState()).toEqual({...state, ...stateUpdate})
});

test('do not update state if setState recevies a promise', () => {
    const { setState, getState } = require('./bedux');

    const state = {
        a: 'a'
    };
    setState(state)

    setState(new Promise(resolve => resolve()));
    expect(getState()).toEqual(state);
    
    setState(Promise.resolve());
    expect(getState()).toEqual(state);
});

test('subscription', () => {
    const { setState, subscribeState } = require('./bedux');

    const mockCallback = jest.fn();
    
    subscribeState(mockCallback);
    setState({c: 'c'});
    
    expect(mockCallback).toBeCalled();
});

test('subscribeToPartialState should run listener only when the relevant portion of the state is changed', () => {
    const { setState, subscribeToPartialState } = require('./bedux');

    const mockCallback = jest.fn();
    
    subscribeToPartialState(mockCallback, 'h');
    setState({h: 'h'});
    
    expect(mockCallback).toBeCalled();
});

test('subscribeToPartialState should not run listener when a non relevant portion of the state is changed', () => {
    const { setState, subscribeToPartialState } = require('./bedux');

    const mockCallback = jest.fn();
    
    subscribeToPartialState(mockCallback, 'i');
    setState({l: 'l'});
    
    expect(mockCallback).not.toBeCalled();
});

test('prevent multiple subscription with the same callback', () => {
    const { setState, subscribeState } = require('./bedux');

    const mockCallback = jest.fn();
    
    subscribeState(mockCallback);
    subscribeState(mockCallback);    
    setState({c: 'c2'});
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('unsubscription', () => {
    const { setState, subscribeState, unsubscribeState } = require('./bedux');

    const mockCallback = jest.fn();

    subscribeState(mockCallback);
    unsubscribeState(mockCallback);

    setState({d: 'd'});

    expect(mockCallback).not.toBeCalled();
});

test('dispatch an object', () => {
    const { getState, dispatch } = require('./bedux');

    dispatch({e: 'e'});

    expect(getState()).toHaveProperty('e', 'e');
});

test('dispatch a function', () => {
    const { getState, dispatch } = require('./bedux');

    dispatch(() => ({f: 'f'}));

    expect(getState()).toHaveProperty('f', 'f');    
});

test('dispatching a promise do not trigger a state update', () => {
    const { getState, dispatch } = require('./bedux');

    dispatch(Promise.resolve({g: 'g'}));

    expect(getState()).not.toHaveProperty('g', 'g');    
})
