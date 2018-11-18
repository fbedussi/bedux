const requireModule = () => require('./bedux');

let errorMessages = {
    setState: "Promises aren't accepted, setState accepts only plain objects or functions",
    dispatch: "Promises aren't accepted, dispatch accepts only plain objects or functions as actions"
}


beforeEach(() => {
    jest.clearAllMocks()
        .resetModules();
})

test('getState should return current state', () => {
    const { getState } = requireModule();
    
    expect(getState()).toEqual({});
});

test('setState should update the state', () => {
    const { setState, getState } = requireModule();

    const state = {a: 'a'};
    setState(state)

    expect(getState()).toEqual(state);

    const stateUpdate = {b: 'b'};
    setState(stateUpdate);

    expect(getState()).toEqual({...state, ...stateUpdate})
});

test('setState should not update state if receives a promise', () => {
    const { setState } = requireModule();
    
    expect( () => {
        setState( new Promise(resolve => resolve()) ) 
    }).toThrowError( errorMessages.setState );
});

describe('subscribeState', () => {
    test('should add a listener to state updates', () => {
        const { setState, subscribeState } = requireModule();

        const mockCallback = jest.fn();
        
        subscribeState(mockCallback);
        setState({c: 'c'});
        
        expect(mockCallback).toBeCalled();
    });

    test('should not add the listener to state updates if it\'s not a function', () => {
        const { setState, subscribeState } = requireModule();

        subscribeState({});
        
        expect( setState({a: 'a'}) );
    });

    test('should prevent multiple subscription with the same callback', () => {
        const { setState, subscribeState } = requireModule();

        const mockCallback = jest.fn();
        
        subscribeState(mockCallback);
        subscribeState(mockCallback);    
        setState({c: 'c2'});
        
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});

describe('subscribePartialState', () => {
    test('listeners should be executed only when the relevant portion of the state is changed', () => {
        const { setState, subscribePartialState } = requireModule();
    
        const mockCallback = jest.fn();
        
        subscribePartialState('h', mockCallback);
        setState({h: 'h'});
        
        expect(mockCallback).toBeCalled();
    });

    test('listeners should be executed only when the relevant portion of the *nested* state is changed', () => {
        const { setState, subscribePartialState } = requireModule();
    
        const mockCallback = jest.fn();
        
        subscribePartialState('boo.baz.foo', mockCallback);
        setState({boo: {
            baz: {
                foo: 'foo'
            }
        }});
        
        expect(mockCallback).toBeCalled();
    });

    test('subscibing non a non existing prop doesn\'t trigger an error and doesn\'t trigger the callback', () => {
        const { setState, subscribePartialState } = requireModule();
    
        const mockCallback = jest.fn();
        
        subscribePartialState('boo.foo.baz', mockCallback);
        setState({boo: {
            baz: {
                foo: 'foo'
            }
        }});
        
        expect(mockCallback).not.toBeCalled();
    });
    
    test('listeners should not be executed when a non relevant portion of the state is changed', () => {
        const { setState, subscribePartialState } = requireModule();
    
        const mockCallback = jest.fn();
        
        subscribePartialState('i', mockCallback);
        setState({l: 'l'});
        
        expect(mockCallback).not.toBeCalled();
    });
    
    test('should not add the listener to state updates if it\'s not a function', () => {
        const { setState, subscribePartialState } = requireModule();
    
        subscribePartialState('a', {});
        
        expect( setState({a: 'a'}) );
    });

    test('should prevent multiple subscription with the same callback for the same partial', () => {
        const { setState, subscribePartialState } = requireModule();

        const mockCallback = jest.fn();
        
        subscribePartialState('a', mockCallback);
        subscribePartialState('a', mockCallback);    
        setState({a: 'a'});
        
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('should not prevent multiple subscription with the same callback for different partials', () => {
        const { setState, subscribePartialState } = requireModule();

        const mockCallback = jest.fn();
        
        subscribePartialState('a', mockCallback);
        subscribePartialState('b', mockCallback);    
        setState({a: 'a', b: 'b'});
        
        expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    test('should not prevent multiple subscription with different callbacks to the same partial', () => {
        const { setState, subscribePartialState } = requireModule();

        const mockCallbackA = jest.fn();
        const mockCallbackB = jest.fn();
        
        subscribePartialState('a', mockCallbackA);
        subscribePartialState('a', mockCallbackB);    
        setState({a: 'a'});
        
        expect(mockCallbackA).toHaveBeenCalledTimes(1);
        expect(mockCallbackB).toHaveBeenCalledTimes(1);
    });
});

test('unsubscribeState should remove specified listener from state update notifications', () => {
    const { setState, subscribeState, unsubscribeState } = requireModule();

    const mockCallback = jest.fn();

    subscribeState(mockCallback);
    unsubscribeState(mockCallback);

    setState({d: 'd'});

    expect(mockCallback).not.toBeCalled();
});

test('unsubscribePartialState should remove specified listener for given prop from state update notifications', () => {
    const { setState, subscribePartialState, unsubscribePartialState } = requireModule();

    const mockCallback = jest.fn();

    subscribePartialState('d', mockCallback);
    unsubscribePartialState('d', mockCallback);

    setState({d: 'd'});

    expect(mockCallback).not.toBeCalled();
});

describe('dispatch', () => {
    test('should accept an object', () => {
        const { getState, dispatch } = requireModule();
    
        dispatch({e: 'e'});
    
        expect(getState()).toHaveProperty('e', 'e');
    });
    
    test('should accept a function', () => {
        const { getState, dispatch, setState } = requireModule();
    
        setState({a: 1});

        dispatch((state) => ({...state, b: state.a+1}));
    
        expect(getState()).toHaveProperty('a', 1);    
        expect(getState()).toHaveProperty('b', 2);    
    });
    
    test('should throw an error if a Promise is dispatched', () => {
        const { dispatch } = requireModule();
    
        expect( () => {
            dispatch(Promise.resolve({g: 'g'})) 
        }).toThrowError( errorMessages.dispatch );
    });
});
