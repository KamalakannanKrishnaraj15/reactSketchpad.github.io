import React, { Component } from 'react';
import { SketchPad, SKETCH_PENCIL, rgbToHex } from "./SketchPadWrapper";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tool:SKETCH_PENCIL,
      size: 2,
      color: '#000000',
      isEraser: false,
      isHighLighter: false,
    };

    this.getActiveClassName = this.getActiveClassName.bind(this);
    this.updateToolProperties = this.updateToolProperties.bind(this);
  }

  getActiveClassName(condition) {
    return condition ? 'active' : '';
  }

  updateToolProperties(color, hightlighter, eraser, size = 5) {
    this.setState({
      tool: SKETCH_PENCIL,
      color: color,
      size: size,
      isHighLighter: hightlighter,
      isEraser: eraser,
    });
  }

  render() {
    const { tool, size, color, isEraser, isHighLighter } = this.state;
    
    return (
      <div className="sketchpad-wrapper">
        <h1 className="title">React SketchPad</h1>
        <div className="toolswrapper">
          <div className="tools-container">
            <label htmlFor="" className="tools-label">Tools: </label>
            <div className="tools">
              <button
                className={`tool ${this.getActiveClassName(!isEraser && !isHighLighter)}`}
                onClick={() => this.updateToolProperties(rgbToHex(0, 0, 0), false, false)}
              >
                Pencil
              </button>
              <button
                className={`tool ${this.getActiveClassName(isHighLighter)}`}
                onClick={() => this.updateToolProperties(rgbToHex(251, 255, 128), true, false, 15)}
              >
                Hightlighter
              </button>
              <button
                className={`tool ${this.getActiveClassName(isEraser)}`}
                onClick={() => this.updateToolProperties(rgbToHex(255, 255, 255), false, true)}
              >
                Eraser
              </button>
            </div>
          </div>
          <div className="options">
            <label htmlFor="" className="tools-label">Size: </label>
            <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
          </div>
          <div className="options">
            <label htmlFor="" className="tools-label">Color: </label>
            <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
          </div>
        </div>
        <div className="sketchpad-container">
          <SketchPad
            width={1200}
            height={600}
            animate={true}
            size={size}
            color={color}
            tool={tool}
            isEraser={isEraser}
            isHighLighter={isHighLighter}
          />
        </div>
      </div>
    );
  }
}

export default App;
