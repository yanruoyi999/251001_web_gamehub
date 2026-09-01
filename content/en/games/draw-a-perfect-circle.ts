export const drawPerfectCircleContent = {
  title: 'Draw a Perfect Circle',
  description:
    'Draw one continuous circle and get local feedback on closure, roundness, and smoothness. Nothing you draw leaves this page.',
  instructions: [
    'Press or touch the canvas and draw one continuous loop.',
    'Finish close to where you started, then lift your pointer.',
    'Use the three score details to make the next circle more even.',
  ],
  scoringNotes: [
    {
      title: 'Closure',
      body: 'Checks how close the end of the stroke is to its starting point compared with the size of the drawing.',
    },
    {
      title: 'Roundness',
      body: 'Compares each point with the average distance from the center. A steadier radius earns a higher score.',
    },
    {
      title: 'Smoothness',
      body: 'Looks for consistent spacing between neighboring points so sudden jumps lower the result.',
    },
  ],
  privacyNote:
    'Scoring happens in this browser tab. The drawing is not uploaded, saved, or sent to analytics.',
} as const;
