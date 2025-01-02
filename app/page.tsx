"use client";

import React, { useState, useEffect } from "react";

const GRID_SIZE = 4;

const getEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const getRandomTile = (grid: number[][]): number[][] => {
  const emptyCells: { row: number; col: number }[] = [];
  grid.forEach((row, rIdx) =>
    row.forEach((cell, cIdx) => {
      if (cell === 0) emptyCells.push({ row: rIdx, col: cIdx });
    })
  );

  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map((row) => [...row]);
  newGrid[row][col] = newValue;

  return newGrid;
};

const moveRowLeft = (row: number[]): number[] => {
  const newRow = row.filter((value) => value !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
    }
  }
  return newRow.filter((value) => value !== 0).concat(new Array(GRID_SIZE).fill(0)).slice(0, GRID_SIZE);
};

const rotateGrid = (grid: number[][]): number[][] => {
  const newGrid = getEmptyGrid();
  grid.forEach((row, rIdx) =>
    row.forEach((value, cIdx) => {
      newGrid[cIdx][GRID_SIZE - 1 - rIdx] = value;
    })
  );
  return newGrid;
};

const moveGridLeft = (grid: number[][]): number[][] => {
  return grid.map((row) => moveRowLeft(row));
};

const areGridsEqual = (grid1: number[][], grid2: number[][]): boolean => {
  return grid1.flat().join("") === grid2.flat().join("");
};

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(getRandomTile(getEmptyGrid()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const move = (direction: "left" | "right" | "up" | "down") => {
    let newGrid = grid;

    if (direction === "left") {
      newGrid = moveGridLeft(grid);
    } else if (direction === "right") {
      newGrid = rotateGrid(rotateGrid(moveGridLeft(rotateGrid(rotateGrid(grid)))));
    } else if (direction === "up") {
      newGrid = rotateGrid(moveGridLeft(rotateGrid(rotateGrid(rotateGrid(grid)))));
    } else if (direction === "down") {
      newGrid = rotateGrid(rotateGrid(rotateGrid(moveGridLeft(rotateGrid(grid)))));
    }

    if (!areGridsEqual(grid, newGrid)) {
      const updatedGrid = getRandomTile(newGrid);
      setGrid(updatedGrid);
      const newScore = updatedGrid.flat().reduce((acc, value) => acc + value, 0);
      setScore(newScore);

      if (!canMove(updatedGrid)) {
        setGameOver(true);
      }
    }
  };

  const canMove = (grid: number[][]): boolean => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) return true;
        if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
      }
    }
    return false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, gameOver]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#faf8ef",
        color: "#776e65",
        textAlign: "center",
      }}
    >
      <h1>2048</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Controls:</strong>
        </p>
        <p>Arrow Keys: Move tiles</p>
      </div>
      <h2>Score: {score}</h2>
      {gameOver && <h3>Game Over! Try again.</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
          gap: "10px",
          backgroundColor: "#bbada0",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {grid.flat().map((value, idx) => (
          <div
            key={idx}
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: value ? "#f2b179" : "#cdc1b4",
              color: value > 4 ? "#f9f6f2" : "#776e65",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {value || ""}
          </div>
        ))}
      </div>
      {gameOver && (
        <button
          onClick={() => setGrid(getRandomTile(getEmptyGrid()))}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default Game2048;
