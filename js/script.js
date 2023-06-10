const polyrhythmDOM = new PolyrhythmDOM();

const background = polyrhythmDOM.buildBackgroundImage("../assets/backgrounds/background.gif");
const canvas = polyrhythmDOM.buildCanvas();

const polyrhythm = new Polyrhythm(canvas);

polyrhythm.setDebugMode(true);
polyrhythm.run();