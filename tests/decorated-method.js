import React, { Component } from 'react';
import createShallowRenderer from './helpers/createShallowRenderer';
import expect from 'expect.js';
import makeHotify from '../src/makeHotify';
import autobind from 'autobind-decorator';

class DecoratedMethod extends Component {
  instanceProperty = 42

  @autobind
  decoratedMethod() {
    return this.instanceProperty;
  }

  render() {
    return (
      <div></div>
    );
  }
}


describe('decorated method', () => {
  let renderer;
  let hotify;

  beforeEach(() => {
    renderer = createShallowRenderer();
    hotify = makeHotify();
  });

  it('preserves context in decorated methods', () => {
    const HotDecoratedMethod = hotify(DecoratedMethod);
    const instance = renderer.render(<HotDecoratedMethod />);
    expect(instance.decoratedMethod()).to.equal(42);
  });
});