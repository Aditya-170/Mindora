"use client";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Ellipse, Text } from "react-konva";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { io } from "socket.io-client";


const Whiteboard = ({ roomId }) => {
    const stageRef = useRef(null);
    const containerRef = useRef(null); // <- new: wrapper for stage + textarea
    const textAreaRef = useRef(null);
    const { user } = useUser();
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [tool, setTool] = useState("draw"); // draw, eraser, line, rect, square, circle, ellipse, text
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(4);
    const [saving, setSaving] = useState(false);
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [currentShape, setCurrentShape] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // text state
    const [texts, setTexts] = useState([]);
    const [isEditingText, setIsEditingText] = useState(false);
    const [textPos, setTextPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setStageSize({ width: window.innerWidth - 40, height: window.innerHeight - 150 });
    }, []);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io("https://mindora-new-1.onrender.com");
        const socket = socketRef.current;

        if (roomId && user) {
            // Send an object with roomId and userName
            socket.emit("join-room", {
                roomId,
                userName: user.fullName || user.username || "Anonymous"
            });
        }

        socket.on("draw-action", ({ type, data }) => {
            if (type === "line") setLines(prev => [...prev, data]);
            else if (type === "shape") setShapes(prev => [...prev, data]);
            else if (type === "text") setTexts(prev => [...prev, data]);
        });

        socket.on("cursor-move", ({ userId, name, x, y }) => {
            setCursors((prev) => ({
                ...prev,
                [userId]: { x, y, name },
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId, user]);



    const handleMouseDown = (e) => {
        const pos = e.target.getStage().getPointerPosition();

        if (tool === "draw" || tool === "eraser") {
            setIsDrawing(true);
            setLines([
                ...lines,
                {
                    points: [pos.x, pos.y],
                    color: tool === "eraser" ? "white" : color,
                    strokeWidth: lineWidth,
                },
            ]);
        } else if (["line", "rect", "square", "circle", "ellipse"].includes(tool)) {
            setIsDrawing(true);
            setCurrentShape({
                type: tool,
                start: pos,
                end: pos,
                color,
                strokeWidth: lineWidth,
            });
        } else if (tool === "text" && !isEditingText) {
            // place textarea inside the same container (position: relative)
            // so top/left are container-relative and visible
            setTextPos({ x: pos.x, y: pos.y });

            const ta = textAreaRef.current;
            if (!ta || !containerRef.current) return;

            // ensure textarea is positioned relative to container
            ta.style.display = "block";
            ta.style.position = "absolute";
            // position relative to container: use pos.x/pos.y directly (container is position: relative)
            ta.style.left = `${pos.x}px`;
            ta.style.top = `${pos.y}px`;
            ta.style.minWidth = "200px";      // <- increased minimum width
            ta.style.width = "400px";         // <- default width (longer)
            ta.style.height = "100px";
            ta.style.fontSize = "18px";
            ta.style.border = "1px solid #ccc";
            ta.style.padding = "4px";
            ta.style.background = "white";
            ta.style.color = color;
            ta.style.zIndex = 1000;
            ta.value = "";
            // small delay to ensure it becomes visible before focus
            setTimeout(() => ta.focus(), 0);
            setIsEditingText(true);
        }
    };
    const [cursors, setCursors] = useState({});

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on("cursor-move", ({ userId, name, x, y }) => {
            setCursors((prev) => ({
                ...prev,
                [userId]: { x, y, name },
            }));
        });

        return () => {
            socketRef.current.off("cursor-move");
        };
    }, [roomId]);

    useEffect(() => {
        // console.log("Cursors updated:", cursors);
    }, [cursors]);

    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        // --- Cursor always emits ---
        if (pos && user) {
            socketRef.current.emit("cursor-move", {
                roomId,
                userId: user.id,
                name: user.fullName || user.username || "Anonymous",
                x: pos.x,
                y: pos.y,
            });
        }
        if (!isDrawing) return;
        // const pos = e.target.getStage().getPointerPosition();

        if (tool === "draw" || tool === "eraser") {
            const lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([pos.x, pos.y]);
            setLines(lines.slice(0, -1).concat(lastLine));
            socketRef.current.emit("draw-action", { roomId, type: "line", data: lastLine });
        } else if (currentShape) {
            setCurrentShape({ ...currentShape, end: pos });
        }
    };

    const handleMouseUp = () => {
        if (tool === "draw" || tool === "eraser") {
            setIsDrawing(false);
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
                socketRef.current.emit("draw-action", { roomId, type: "line", data: lastLine });
            }
        } else if (currentShape) {
            setShapes([...shapes, currentShape]);
            socketRef.current.emit("draw-action", { roomId, type: "shape", data: currentShape });
            setCurrentShape(null);
            setIsDrawing(false);
        }
    };


    const handleTextCommit = () => {
        const ta = textAreaRef.current;
        if (!ta) return;
        const value = ta.value.trim();
        if (value !== "") {
            const newText = {
                x: textPos.x,
                y: textPos.y,
                text: value,
                color: color,
                fontSize: 20,
            };
            setTexts([...texts, newText]);
            socketRef.current.emit("draw-action", { roomId, type: "text", data: newText });
        }

        // hide & reset textarea
        ta.style.display = "none";
        ta.value = "";
        setIsEditingText(false);
    };

    const handleSaveToDB = async () => {
        if (isEditingText) handleTextCommit();
        if (!stageRef.current || !user) return;

        setSaving(true);

        try {
            // 1️⃣ Get whiteboard image as data URL
            const uri = stageRef.current.toDataURL({ pixelRatio: 2 });

            // convert to Blob
            const res = await fetch(uri);
            const blob = await res.blob();

            // 2️⃣ Upload to Cloudinary (similar to your image upload)
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", "your_upload_preset"); // if needed by Cloudinary

            const cloudRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const cloudData = await cloudRes.json();
            if (cloudData.error) throw new Error(cloudData.error);

            const imageUrl = cloudData.secure_url;

            // 3️⃣ Save record in DB
            const saveRes = await fetch("/api/images/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    topic: "Whiteboard Drawing",
                    uploaderId: user.id,
                    link: imageUrl,
                }),
            });
            const saveData = await saveRes.json();
            if (saveData.error) throw new Error(saveData.error);

            toast.success("Whiteboard saved successfully!", { style: { background: "black", color: "yellow" } });
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Save failed", { style: { background: "red", color: "white" } });
        }

        setSaving(false);
    };


    const handleUndo = () => {
        if (lines.length > 0) {
            setLines(lines.slice(0, -1));
        } else if (shapes.length > 0) {
            setShapes(shapes.slice(0, -1));
        } else if (texts.length > 0) {
            setTexts(texts.slice(0, -1));
        }
    };

    const renderShape = (shape, i) => {
        const { start, end, color, strokeWidth, type, xOffset = 0, yOffset = 0 } = shape;
        const x = start.x + xOffset;
        const y = start.y + yOffset;
        const w = end.x - start.x;
        const h = end.y - start.y;

        switch (type) {
            case "line":
                return (
                    <Line
                        key={i}
                        points={[start.x, start.y, end.x, end.y]}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        lineCap="round"
                    />
                );
            case "rect":
                return (
                    <Rect
                        key={i}
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                );
            case "square": {
                const size = Math.max(Math.abs(w), Math.abs(h));
                return (
                    <Rect
                        key={i}
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                );
            }
            case "circle": {
                const radius = Math.sqrt(w * w + h * h);
                return (
                    <Circle
                        key={i}
                        x={x}
                        y={y}
                        radius={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                );
            }
            case "ellipse":
                return (
                    <Ellipse
                        key={i}
                        x={x + w / 2}
                        y={y + h / 2}
                        radiusX={Math.abs(w / 2)}
                        radiusY={Math.abs(h / 2)}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                );
            default:
                return null;
        }
    };

    const renderCurrentShape = () => {
        if (!currentShape) return null;
        return renderShape(currentShape, "current");
    };


    const tools = ["draw", "eraser", "line", "rect", "square", "circle", "ellipse", "text"];

    return (
        <div style={{ padding: 20 }}>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                {tools.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTool(t)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 5,
                            border: "2px solid",
                            borderColor: tool === t ? "purple" : "#ccc",
                            backgroundColor: tool === t ? "purple" : "white",
                            color: tool === t ? "white" : "black",
                            cursor: "pointer",
                        }}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}

                <select
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    style={{ padding: 6, borderRadius: 5 }}
                >
                    <option value={2}>Thin</option>
                    <option value={4}>Normal</option>
                    <option value={8}>Thick</option>
                </select>

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: 40, height: 40, border: "none", cursor: "pointer" }}
                />

                <button
                    onClick={handleUndo}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 5,
                        backgroundColor: "orange",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Undo
                </button>

                <button onClick={handleSaveToDB} disabled={saving} style={{ padding: "8px 12px", borderRadius: 5, backgroundColor: "green", color: "white", border: "none", cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>

            {/* Whiteboard container (position: relative so textarea positions correctly) */}
            <div
                ref={containerRef}
                style={{
                    border: "2px solid #333",
                    backgroundColor: "white",
                    width: stageSize.width,
                    height: stageSize.height,
                    margin: "auto",
                    position: "relative",
                }}
            >
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {lines.map((line, i) =>
                            line && line.points ? (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke={line.color}
                                    strokeWidth={line.strokeWidth}
                                    lineCap="round"
                                />
                            ) : null
                        )}

                        {shapes.map(renderShape)}
                        {renderCurrentShape()}
                        {texts.map((t, i) => (
                            <Text key={i} x={t.x} y={t.y} text={t.text} fontSize={t.fontSize} fill={t.color} />
                        ))}
                    </Layer>
                    <Layer>
                        {Object.entries(cursors).map(([id, c]) =>
                            id !== user?.id ? (
                                <React.Fragment key={id}>
                                    <Circle x={c.x} y={c.y} radius={5} fill="red" />
                                    <Text x={c.x + 8} y={c.y - 10} text={c.name} fontSize={14} fill="black" />
                                </React.Fragment>
                            ) : null
                        )}
                    </Layer>

                </Stage>

                {/* Textarea for typing — positioned relative to container */}
                <textarea
                    ref={textAreaRef}
                    style={{
                        display: "none",
                        position: "absolute",
                        zIndex: 1000,
                        background: "white",
                        border: "1px solid #ccc",
                        padding: "4px",
                        fontSize: "18px",
                        outline: "none",
                        resize: "none",
                        minHeight: "22px",
                    }}
                    onBlur={handleTextCommit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleTextCommit();
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Whiteboard;
