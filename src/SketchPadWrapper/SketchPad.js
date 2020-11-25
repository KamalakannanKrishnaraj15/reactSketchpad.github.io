import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import { SKETCH_PENCIL, Pencil } from "../components";

export const sketchToolsMap = {
  [SKETCH_PENCIL]: Pencil,
};

export default class SketchPad extends Component {

  tool = null;
  constructor(props) {
    super(props);
    this.initTool = this.initTool.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.getTouchPosition = this.getTouchPosition.bind(this);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.initTool(this.props.tool);
  }

  initTool(tool) {
    this.tool = this.props.sketchToolsMap[tool](this.ctx);
  }

  onMouseDown(e) {
    this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size);
  }

  onMouseMove(e) {
    this.tool.onMouseMove(...this.getCursorPosition(e));
  }

  onMouseUp(e) {
    this.tool.onMouseUp(...this.getCursorPosition(e));
  }

  onTouchStart(e) {
    e.stopPropagation();
    const { x,y } = this.getTouchPosition(e);
    this.tool.onTouchStart(x, y, this.props.color, this.props.size);
  }

  onTouchMove(e) {
    e.stopPropagation();
    const { x,y } = this.getTouchPosition(e);
    this.tool.onTouchMove(x, y, this.canvas);
  }

  onTouchEnd(e) {
    e.stopPropagation();
    const { x,y } = this.getTouchPosition(e);
    this.tool.onTouchEnd(x, y, this.canvas);
  }

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }
  
  getTouchPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const { left, top, width, height } = rect;
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    let clientX, clientY;

    // use first touch if available
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    const finalX = (clientX - left) * (canvasWidth / width);
    const finalY = (clientY - top) * (canvasHeight / height);

    // return mouse/touch position inside canvas supports both mobile and desktop
    return {
      x: finalX,
      y: finalY
    };
  }


  render() {
    const { width, height, canvasClassName, isEraser, isHighLighter } = this.props;
    const eraserClassName = isEraser ? "eraser" : "";

    return (
      <canvas
        ref={(canvas) => { this.canvasRef = canvas; }}
        id="canvas"
        className={`${canvasClassName} ${eraserClassName}`}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        onTouchStart={ this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        width={width}
        height={height}
      />
    )
  }
}

SketchPad.defaultProps = {
  width: 500,
  height: 500,
  color: '#000',
  size: 5,
  canvasClassName: 'canvas',
  animate: true,
  tool: SKETCH_PENCIL,
  sketchToolsMap
};

