require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

//获取图片相关路径，将图片名信息转换成路径信息
var j = 0;
imageDatas = (function genImageURL(imageDataArr){
	for(var i = 0;j=imageDataArr.length,i<j;i++){
		var singleImageData = imageDataArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      		<section className="img-sec">
      		
      		</section>
      		<nav className="controller-nav">
      		</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
