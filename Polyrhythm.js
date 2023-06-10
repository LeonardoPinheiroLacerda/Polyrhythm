class Polyrhythm {

    constructor(canvas) {
        this.canvas = canvas;
        
        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");

        document.addEventListener("visibilitychange", (evt => this.soundEnabled = false));
        canvas.addEventListener("click", (evt) => this.soundEnabled = !this.soundEnabled)
    }

    colors = [
        "#D0E7F5",
        "#D9E7F4",
        "#D6E3F4",
        "#BCDFF5",
        "#B7D9F4",
        "#C3D4F0",
        "#9DC1F3",
        "#9AA9F4",
        "#8D83EF",
        "#AE69F0",
        "#D46FF1",
        "#DB5AE7",
        "#D911DA",
        "#D601CB",
        "#E713BF",
        "#F24CAE",
        "#FB79AB",
        "#FFB6C1",
        "#FED2CF",
        "#FDDFD5",
        "#FEDCD1"
    ];
    
    loopsForCycle = [
        50,
        49,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        40,
        39,
        38,
        37,
        36,
        35,
        34,
        33,
        32,
        31,
        30,
        29,
        28
    ]

    style = {
        backgroundColor: "black",
        mainColor: "#D0E7F5"
    }

    dimensions = {
        horizontalMargin: 20,
        verticalMargin: 7,

        guideLineWidth: 0
    }

    debugMode = false;
    mathUtils = new MathUtils();


    startTime = new Date().getTime();
    impactTime = new Array(21).fill(this.startTime, 0, 23)
    time = 0;
    centerPoint = {x: 0, y: 0}
    arcLength = 21;
    
    soundEnabled = false;
    volume = 0.03;
    initialArcRadius = 0.03;
    ballRadius = 0.005;
    cycleTime = 600;

    setDebugMode = (mode) => {
        this.debugMode = mode;
    }

    getArcData = (index) => {
        const fullLoop = Math.PI * 2;
        const numberOfLoops = this.loopsForCycle[index];
        const cycleDistance = fullLoop * numberOfLoops;
        const velocity = this.mathUtils.getVelocity(cycleDistance, this.cycleTime);
        
        return {
            color: this.colors[index],
            nextImpactTime: this.mathUtils.calculateNextImpactTime(this.impactTime[index], velocity),
            velocity
        }
    }

    getMarginDistance = () => {
        const {width, height} = this.canvas;

        const verticalMarginDistance = this.dimensions.verticalMargin / 100 * height;
        const horizontalMarginDistance = this.dimensions.horizontalMargin / 100 * width;
        return {verticalMarginDistance, horizontalMarginDistance};
    }

    background = () => {
        const {width, height} = this.canvas;   

        this.context.fillStyle = this.style.backgroundColor;
        this.context.fillRect(0, 0, width, height);
        
        if(this.debugMode) {
            const lineY = (i) => 18 + i * 20;

            let i;

            this.context.font = "15px Monospace";
            this.context.fillStyle = "white";
            this.context.fillText(`Dimensions: (${width}, ${height}),  `, 3, lineY(0));
            this.context.fillText(`GuideLine: ${this.dimensions.guideLineWidth},`, 3, lineY(1));
            this.context.fillText(`SoundEnabled: ${this.soundEnabled},`, 3, lineY(2));
            this.context.fillText(`LastImpactTime: [`, 3, lineY(3));
            for(i = 0; i < this.arcLength; i ++) {
                this.context.fillText(`    ${this.impactTime[i]},`, 3, lineY(i + 4));
            }
            this.context.fillText(`]`, 3, lineY(i + 4));
        }
    }    

    guideLine = () => {

        const {width, height} = this.canvas;

        const {
            horizontalMarginDistance, 
            verticalMarginDistance
        } = this.getMarginDistance();

        this.dimensions.guideLineWidth = width - horizontalMarginDistance * 2;

        this.context.strokeStyle = this.style.mainColor;
        this.context.beginPath();
        this.context.moveTo(horizontalMarginDistance, height - verticalMarginDistance);
        this.context.lineTo(width - horizontalMarginDistance, height - verticalMarginDistance);
        this.context.stroke();

    }

    arc = (radius, color) => {

        const {verticalMarginDistance} = this.getMarginDistance();
        const {height, width} = this.canvas;

        const y = height - verticalMarginDistance;
        const x = width / 2;

        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.arc(x, y, radius, Math.PI, Math.PI * 2);
        this.context.stroke();
    }

    circle = (distance, radius) => {

        const {x, y} = this.mathUtils.calculateCirclePosition(radius, distance, this.centerPoint.x, this.centerPoint.y);

        this.context.beginPath();
        this.context.fillStyle = this.style.mainColor;
        this.context.arc(x, y, this.dimensions.guideLineWidth * this.ballRadius, 0, Math.PI * 2);
        this.context.fill();

    }

    arcsAndCircles = () => {
        const initialArcRadius = this.dimensions.guideLineWidth * this.initialArcRadius;
        const spacing = ((this.dimensions.guideLineWidth / 2 - initialArcRadius) / (this.arcLength - 1));

        for(let index = 0; index < this.arcLength; index ++) {
            const radius = initialArcRadius + ((index) * spacing);

            const {color, nextImpactTime, velocity} = this.getArcData(index);
  
            const circleDistance = this.mathUtils.calcDistance(velocity, this.time);

            this.arc(radius, color);
            this.circle(circleDistance, radius);
            
            if(new Date().getTime() >= nextImpactTime) {
                this.impactTime[index] = new Date().getTime();                

                if(this.soundEnabled){
                    const audio = new Audio(`./assets/key-${index}.mp3`);
                    audio.volume = this.volume;
                    audio.play();
                }
            }

        }

    }

    drawFrame = () => {
        requestAnimationFrame(() => {
            //Determina o tamanho do frame
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            //Determina tempo de execução em segundos
            this.time = (new Date().getTime() - this.startTime) / 1000;

            //Calcula ponto central
            const {verticalMarginDistance} = this.getMarginDistance();
            const {width, height} = this.canvas;
            this.centerPoint = this.mathUtils.calculateCenterPoint(width, height, verticalMarginDistance);
    
            //Desenha frame
            this.background();
            this.guideLine();
            this.arcsAndCircles();

            //Recalcula novo frame
            this.drawFrame();
        });
    }
    run = this.drawFrame;
}