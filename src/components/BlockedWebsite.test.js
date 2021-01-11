import { shallow } from "enzyme";
import React from 'react';
import BlockedWebsite from './BlockedWebsite';

it('expect to render blocked website list', () => {
    expect(shallow(<BlockedWebsite/>)).toMatchSnapshot();
})