require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

/*
*获取图片相关路径，将图片名信息转换成路径信息
*/
imageDatas = (function genImageURL(imageDataArr){
	for(var i = 0,j = imageDataArr.length;i < j;i++){
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);
/*
*取区域内的随机数
*/
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}
/*
*取0~30°旋转角度
*/
function get30degRandom(){
	let baseDeg = 30;
	return (Math.random() > 0.5?"":"-")+Math.ceil(Math.random() * baseDeg);
}

class ImgFigure extends React.Component {
  constructor(props){
  	super(props);
  }
  handleClick(e){
  		this.props.inverse();
  		e.stopPropagation();
  		e.preventDefault();
  	}
  render() {
  	var styleObj = {};
  	//设置排布位置
  	if(this.props.arrange.pos){
  		styleObj = this.props.arrange.pos;
  	}
  	//设置旋转角度
  	if(this.props.arrange.rotate){
  		['MozTransform','msTransform','WebkitTransform','transform'].forEach(function(value){
  			styleObj[value]="rotate("+this.props.arrange.rotate+"deg)";
  		}.bind(this));
  	}
  	//设置中心图片的优先级
  	if(this.props.arrange.isCenter){
  		styleObj.zIndex = "11";
  	}else{
  		styleObj.zIndex = "0";
  	}
  	var imgFiguerClassName = "img-figure";
  		imgFiguerClassName += this.props.arrange.isInverse?' is-inverse':'';
  	return (
  			<figure className={imgFiguerClassName} style={styleObj} ref ="figure" onClick={this.handleClick.bind(this) }>
     			<img src={this.props.data.imageURL} alt={this.props.data.title}/>
     			<figcaption>
     				<h2 className="img-title">{this.props.data.title}</h2>
     				<div className="img-back" onClick={this.handleClick.bind(this) }>
     					<p>{this.props.data.desc}</p>
     				</div>
     			</figcaption>
     		</figure>
    );
  }
}

class AppComponentApp extends React.Component {
  constructor(props){
  	super(props);
  	this.state={imgsArrangeArr:[
  		{
  			pos:{left:'0',top:'0'},
  			rotate:0,//选中角度
  			isCenter:false,//是否是中心图片
  			isInverse:false

  		}
  	]}
  }
  Contant = {
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
  };
  /*
  *翻转图片
  *
  */
  inverse(index){
  	return function(){
  		var imgsArrangeArr = this.state.imgsArrangeArr;
  		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
  		this.setState({
  			imgsArrangeArr: imgsArrangeArr
  		})
  	}.bind(this);
  }
  /*
   *重新布局所有图片
   *@centerIndex指定居中排布哪个图片
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
  		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
  		//首先居中centerIndex的图片
  		imgsArrangeCenterArr[0] = { 
  			pos:centerPos,
  			rotate: 0,
  			isCenter:true,
  			isInverse:false
  		};
  		//取出要布局上侧的图片状态信息,布局上部图片
  		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
  		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);		
  		imgsArrangeTopArr.forEach(function(value,index){
  			imgsArrangeTopArr[index] = {
  				pos:{
  					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
  					left: getRangeRandom(vPosRangeTopY[0], vPosRangeX[1])
  				},
  				rotate: get30degRandom()
  			}
  		});
  		//布局左右两侧状态信息
  		for(var i = 0, j=imgsArrangeArr.length,k = j / 2;i < j; i++){
  			var hPosRangeLORX = null;
  			if(i < k){
  				hPosRangeLORX = hPosRangeLeftSecX;
  			}else{
  				hPosRangeLORX = hPosRangeRightSecX;
  			}
  			imgsArrangeArr[i] = {
  				pos:{
  					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
  					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
  				},
  				rotate:	get30degRandom()
  			}
  		}
  		if(imgsArrangeTopArr && imgsArrangeArr[0]){
  			imgsArrangeArr.splice(topImgSpliceIndex, 0,imgsArrangeTopArr[0]);
  		}
  		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
  		//重新渲染图片
  		this.setState({
  			imgsArrangeArr: imgsArrangeArr
  		})
  }
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
  	//获取舞台的大小
  	var stageDOM = this.refs.stage,
  		stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
  		halfStageW = Math.ceil(stageW / 2),
  		halfStageH = Math.ceil(stageH / 2);
  	//先获取一个imageFiguer的大小
  	
  	var imgFiguerDOM = this.refs.imgFiguer0.refs.figure,
  		imgW = imgFiguerDOM.scrollWidth,
  		imgH = imgFiguerDOM.scrollHeight,
  		halfImgW = Math.ceil(imgW / 2),
  		halfImgH = Math.ceil(imgH / 2);
  	//计算中心图片的位置点
  	this.Contant.centerPos = {
  		left: halfStageW - halfImgW,
  		top: halfStageH - halfImgH
  	};
  	//计算左侧，右侧图片排布区域取值范围
  	this.Contant.hPosRange.leftSecX[0] = -halfImgW;
  	this.Contant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  	this.Contant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  	this.Contant.hPosRange.rightSecX[1] = stageW - halfImgW;
  	this.Contant.hPosRange.y[0] = -halfImgH;
  	this.Contant.hPosRange.y[1] = stageH - halfImgH;
  	//计算上侧区域图片排布
  	this.Contant.vPosRange.topY[0] = - halfImgH; 
  	this.Contant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
  	this.Contant.vPosRange.x[0] = halfStageW - imgW;
  	this.Contant.vPosRange.x[1] = halfStageW;
  	
  	this.rearrange(0);
  }

  render(){
  	var controllerUnits =[];
  	var imgFigures = [];
 	
  	imageDatas.forEach(function(value,index){
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index]={
  				pos:{left:0,top:0},
  				rotate:0,
  				isCenter:false,
  				isInverse:false
  			};
  		}
  		imgFigures.push(<ImgFigure data={value} ref={'imgFiguer'+index} key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
  	}.bind(this));
    return (
      <section className="stage" ref="stage">
      		<section className="img-sec">
				{imgFigures}
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
