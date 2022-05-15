export const computeGridDimensions = (width: string, height: string, cellSize: number) => {
  // Subtract two to take into account the the paddings
  const squaresToFitWidth = Math.floor(Number(width) / cellSize) - 2;
  const squaresToFitHeight = Math.floor(Number(height) / cellSize) - 2;
  const totalPaddingX = Number(width) - squaresToFitWidth * cellSize;
  const totalPaddingY = Number(height) - squaresToFitHeight * cellSize;
  const paddingLeft = Math.ceil(totalPaddingX / 2) - 0.5;
  const paddingTop = Math.ceil(totalPaddingY / 2) - 0.5;
  const paddingRight = Number(width) - squaresToFitWidth * cellSize - paddingLeft;
  const paddingBottom = Number(height) - squaresToFitHeight * cellSize - paddingTop;
  return {
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom
  };
};
