import React, { useState } from 'react';
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [objects, setObjects] = useState([]);
  const [tool, setTool] = useState('draw'); // 'draw', 'text', 'shape'
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);

  const handleMouseDown = (e) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setCurrentLine([pos]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== 'draw') return;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine((prevLine) => [...prevLine, pos]);
  };

  const handleMouseUp = () => {
    if (tool === 'draw') {
      setIsDrawing(false);
      setLines((prevLines) => [...prevLines, currentLine]);
      setCurrentLine([]);
    }
  };

  const handleAddText = (e) => {
    if (tool === 'text') {
      const pos = e.target.getStage().getPointerPosition();
      const newText = new Text({
        x: pos.x,
        y: pos.y,
        text: 'New Text',
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: color,
      });
      setObjects((prevObjects) => [...prevObjects, newText]);
    }
  };

  const handleAddShape = (e) => {
    if (tool === 'shape') {
      const pos = e.target.getStage().getPointerPosition();
      const newShape = new Rect({
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 100,
        fill: color,
        draggable: true,
      });
      setObjects((prevObjects) => [...prevObjects, newShape]);
    }
  };

  const handleSave = () => {
    const uri = e.target.toDataURL();
    const link = document.createElement('a');
    link.href = uri;
    link.download = 'whiteboard.png';
    link.click();
  };

  return (
    <div>
      <div>
        <button onClick={() => setTool('draw')}>Draw</button>
        <button onClick={() => setTool('text')}>Text</button>
        <button onClick={() => setTool('shape')}>Shape</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={tool === 'text' ? handleAddText : tool === 'shape' ? handleAddShape : null}
      >
        <Layer>
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.flat()}
              stroke={color}
              strokeWidth={lineWidth}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {objects.map((object, index) => (
            <React.Fragment key={index}>{object}</React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
