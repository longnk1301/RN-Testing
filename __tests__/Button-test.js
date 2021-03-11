import React from 'react';

import Button from '../src/components/Button';
import {View, Text} from 'react-native';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Button', () => {
  it('should render without issues', () => {
    //shallow calls the constructor of the component and the component’s render method.
    const component = shallow(<Button />);

    //matcher. toBe() compares values or object instances, making it more suitable to the === operator.
    expect(component.length).toBe(1);

    //.toMatchSnapshot() to compare previous and current snapshots. When there isn’t an old snapshot, ‘Jest’ creates a new one.
    //To compare snapshots we use the toJson(component) method; it returns a compatible format of our component for ‘Jest’ snapshots.
    expect(toJson(component)).toMatchSnapshot();
  });

  //We create a mock function which returns ‘I was Pressed’, then render our component using shallow().
  //Afterwards simulate a press by calling .props().onPress().
  //The method .props returns an object containing all props of a component
  //Considering the normal behavior of a button, pressing the Button component only once should call our mock function — which returns ‘I was Pressed’.
  //To test for this, expect() is called twice.
  //Ensuring mockFn is called once, and its return value is correct.
  it('should call onPress event', () => {
    //There are two ways to mock functions in ‘Jest’:
    //Creating mock functions in test scripts.Writing manual mocks to override dependencies.
    const result = 'I was Pressed';
    const mockFn = jest.fn(() => result);
    const component = shallow(<Button onPress={mockFn} />);

    expect(mockFn).not.toHaveBeenCalled();

    component.props().onPress();

    expect(mockFn.mock.calls.length).toBe(1);
    expect(component.props().onPress()).toBe(result);
  });

  //The next thing we want to make sure of is onPress not calling mockFn when isLoading is true.
  it('should not call onPress event when loading is true', () => {
    const result = 'I was pressed';
    const mockFn = jest.fn(() => result);

    const component = shallow(<Button isLoading={true} onPress={mockFn} />);

    component.props().onPress();
    //When isLoading prop is true, we simulate a press on Button, which shouldn’t trigger a call to mockFn. Therefore the number of calls to mockFn remains 0.
    expect(mockFn.mock.calls.length).toBe(0);
  });

  //if Button renders the correct title.
  it('button should render title passed to it', () => {
    const title = 'Primary Button';
    const component = shallow(<Button title={title} />);

    //We use the .find method to obtain the Text component in Button, the child of Text should be the same as the title prop.
    expect(component.find(Text).first().props().children).toBe(title);
  });

  // if the title of Button renders ‘Loading…’ when isLoading=== true
  it('should be Loading... text when isLoading === true', () => {
    //We use setProps to update the props passed to Button and force a re-render, then we check if the title rendered is “Loading…”
    const component = shallow(<Button isLoading={false} />);
    component.setProps({isLoading: true});
    component.update();
    expect(component.find(Text).first().props().children).toBe('Loading...');
  });

  //if the styles of Button change when we pass the transparent prop to Button.
  it('should have transparent styles when transparent is true', () => {
    const transparentContainer = {
      width: '100%',
      height: 50,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    };

    const transparentTitle = {
      color: '#74B3CE',
    };

    const component = shallow(<Button transparent />);

    //We use the .toMatchObject to check if our style objects are correct.
    expect(component.children(View).props('style').style).toMatchObject(
      transparentContainer,
    );

    expect(
      component.children(View).children(Text).props('style').style,
    ).toMatchObject(transparentTitle);
  });
});
