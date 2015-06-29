import React, { Component } from 'react';
import createShallowRenderer from './helpers/createShallowRenderer';
import expect from 'expect.js';
import makeHotify from '../src/makeHotify';

import { autobind } from 'core-decorators';

class Bar {
  
  @autobind
  getProps() {
    return typeof this.props; 
  }

  render() {
    return <div>{this.getProps()}</div>;
  }
}

describe('autobind usage', function() {

  let renderer;
  let hotify;

  beforeEach(() => {
    renderer = createShallowRenderer();
    hotify = makeHotify();
  });

  it('should bind methods of hotified components', function() {
    const HotBar = hotify(Bar);
    const barInstance = renderer.render(<HotBar />);
    expect(renderer.getRenderOutput().props.children).to.equal('object');
  }); 
})
