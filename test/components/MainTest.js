/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;
import createComponent from 'helpers/shallowRenderHelper';

import GalleryByReactApp from 'components/GalleryByReactApp';

describe('MainComponent', function () {

  beforeEach(function () {
    this.GalleryByReactAppComponent = createComponent(GalleryByReactApp);
  });

  it('should have its component name as default className', function () {
    expect(this.GalleryByReactAppComponent.props.className).to.equal('index');
  });
});
