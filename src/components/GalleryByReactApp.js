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

class ImgFigure extends React.Component {
  constructor(props){
  	super(props);
  }
  render() {
  	var styleObj = {};
  	if(this.props.arrange.pos){
  		styleObj = this.props.arrange.pos
  	}

  	return (
     	<figure className="img-figure">
     		<img src={this.props.data.imageURL} alt={this.props.data.title}/>
     		<figcaption>
     			<h2 className="img-title">{this.props.data.title}</h2>
     		</figcaption>
     	</figure>
    );
  }
}
/*
*取区域内的随机数
*/
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}

class AppComponentApp extends React.Component {
  constructor(props){
  	super(props);
  	this.state={imgsArrangeArr:[
  			/*{
  				pos:{
  					left:'0',
  					top:'0'	
  				}
  			}*/
  		]};
  }
  Contant:{
  	centerPos:{
  		left:0,
  		right:0
  	},
  	hPosRange:{//水平方向取值范围
  		leftSecX:[0,0],
  		rightSecX:[0,0],
  		y:[0,0]
  	},
  	vPosRange:{//垂直方向取值范围
  		x:[0,0],
  		topY:[0,0]
  	}
  }
  /*
   *重新布局所有图片
   *@pa
  */
  rearrange(centerIndex){
  	var imgsArrangeArr = this.state.imgsArrangeArr,
  		Contant = this.Contant,
  		centerPos = Contant.centerPos,
  		hPosRange = Contant.hPosRange,
  		vPosRange = Contant.vPosRange,
  		hPosRangeLeftSecX = hPosRange.leftSecX,
  		hPosRangeRightSecX = hPosRange.rightSecX,
  		hPosRangeY = hPosRange.y,
  		vPosRangeTopY = vPosRange.topY,
  		vPosRangeX = vPosRange.x,
  		imgsArrangeTopArr = [],
  		topImgNum = Math.ceil(Math.random() * 2),
  		topImgSpliceIndex = 0,
  		imgsArrangeCenterArr = imgsArrangArr.splice(centerIndex,1);
  		//首先居中centerIndex的图片
  		imgsArrangeCenterArr[0].pos = centerPos;
  		//取出要布局上侧的图片状态信息
  		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
  		imgsArrangArr = imgsArrangArr.splice(topImgSpliceIndex, topImgNum);
  		//布局上部图片
  		imgsArrangeTopArr.forEach(function(value,index){
  			imgsArrangeTopArr[index].pos = {
  				top: getRangeRandom(vPosRangeX[0], vPosRangeTopY[1]),
  				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
  			}
  		});

  		//布局左右两侧状态信息
  		for(var i = 0, j = imgsArrangArr.length;j < i; i++){
  			var hPosRangeLORX = null;
  			if(i < k){
  				hPosRangeLORX = hPosRangeLeftSecX;
  			}else{
  				hPosRangeLORX = hPosRangeRightSecX;
  			}
  			imgsArrangArr[i].pos = {
  				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
  				length: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
  			}
  		}
  		if(imgsArrangeTopArr && imgsArrangArr[0]){
  			imgsArrangArr.splice(topImgSpliceIndex, 0,imgsArrangeTopArr[0]);
  		}


  }
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
  	//获取舞台的大小
  	var stageDom = React.findDOMNode(this.refs.stage),
  		stageW = stageDom.scrollWidrh,
  		stageH = stageDom.scrollHright,
  		halfStageW = Math.ceil(stageW / 2),
  		halfStageH = Math.ceil(stageH / 2);
  	//先获取一个imageFiguer的大小
  	var imgFiguerDOM = React.findDOMNode(this.refs.imgFiguer0),
  		imgW = imgFiguerDOM.scrollWidrh,
  		imgH = imgFiguerDOM.scrollHright,
  		halfImgW = Math.ceil(imgW / 2),
  		halfImgH = Math.ceil(imgH / 2);

  	//计算中心图片的位置点
  	this.Contant.centerPos = {
  		left: halfStageW - halfImgW,
  		right: halfStageH - halfImgH
  	}
  	//计算左侧，右侧图片排布区域取值范围
  	this.Contant.hPosRange.leftSecX[0] = -halfImgW;
  	this.Contant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  	
  	this.Contant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  	this.Contant.hPosRange.rightSecX[1] = stageW - halfImgW;
  	this.Contant.hPosRange.y[0] = -halfImgH;
  	this.Contant.hPosRange.y[1] = stageH - halfImgH;

  	//计算上侧区域图片排布
  	this.Contant.hPosRange.x[0] = halfStageW-imgW;
  	this.Contant.hPosRange.x[1] = halfImgW;
  	this.Contant.hPosRange.topY[0] = -halfImgH; 
  	this.Contant.hPosRange.topY[1] = halfStageH - halfImgH * 3
  }
  render() {
  	var controllerUnits =[];
  	var imgFiguer = [];
  	imageDatas.forEach(function(value,index){
  			if(!this.state.imgsArrangArr[index]){
  				this.state.imgsArrangArr[index]={
  					/*pos:{
  						left:0,top:0
  					}*/
  				}
  			}
  			imgFiguer.push(<ImgFigure data={value} ref={'imgFiguer'+index} arrange={this.state.imgsArrangArr[index]}/>);
  	}.bind(this));
    return (
      <section className="stage" ref="stage">
      		<section className="img-sec">
				{imgFiguer}
      		</section>
      		<nav className="controller-nav">
      			{controllerUnits}
      		</nav>
      </section>
    );
  }
}

AppComponentApp.defaultProps = {
};

export default AppComponentApp;
