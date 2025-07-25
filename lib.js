export const isInBetween = (frame, { fromFrame, toFrame }) => {
  return frame >= fromFrame && frame <= toFrame;
};
