import { setState, getState, subscribeState, unsubscribeState, dispatch } from './bedux.js';

test('getState', () => {
    expect(getState()).toEqual({});
});

test('setState', () => {
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
    const state = getState();
    setState(new Promise(resolve => resolve()));
    expect(getState()).toEqual(state);
    setState(Promise.resolve());
    expect(getState()).toEqual(state);
});

test('subscription', () => {
    const mockCallback = jest.fn();
    subscribeState(mockCallback);
    setState({c: 'c'});
    expect(mockCallback).toBeCalled();
});

test('prevent multiple subscription with the same callback', () => {
    const mockCallback = jest.fn();
    subscribeState(mockCallback);
    subscribeState(mockCallback);
    setState({c: 'c2'});
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('unsubscription', () => {
    const mockCallback = jest.fn();
    unsubscribeState(mockCallback);
    setState({d: 'd'});
    expect(mockCallback).not.toBeCalled();
});

test('dispatch an object', () => {
    const mockCallback = jest.fn();
    subscribeState(mockCallback);
    dispatch({e: 'e'});
    expect(mockCallback).toBeCalled();
    expect(getState()).toEqual({
        a: 'a',
        b: 'b',
        c: 'c2',
        d: 'd',
        e: 'e'
    });    
});

test('dispatch a function', () => {
    const mockCallback = jest.fn();
    subscribeState(mockCallback);
    dispatch(() => ({f: 'f'}));
    expect(mockCallback).toBeCalled();
    expect(getState()).toEqual({
        a: 'a',
        b: 'b',
        c: 'c2',
        d: 'd',
        e: 'e',
        f: 'f'
    });    
});

test('dispatching a promise do not trigger a state update', () => {
    const mockCallback = jest.fn();
    subscribeState(mockCallback);
    dispatch(Promise.resolve({g: 'g'}));
    expect(mockCallback).not.toBeCalled();
    expect(getState()).toEqual({
        a: 'a',
        b: 'b',
        c: 'c2',
        d: 'd',
        e: 'e',
        f: 'f'
    });    
})


