import { shallow } from "enzyme";
import React from 'react';
import InputBox from './InputBox';

it('expect to render input box component', () => {
    expect(shallow(<InputBox />)).toMatchSnapshot();
})