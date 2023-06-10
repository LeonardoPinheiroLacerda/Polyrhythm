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
    

    style = {
        backgroundColor: "black",
        mainColor: "#D0E7F5"
    }

    dimensions = {
        horizontalMargin: 20,
        verticalMargin: 7,

        lineWidth: 0
    }

    debugMode = false;
    mathUtils = new MathUtils();


    startTime = new Date().getTime();
    impactTime = new Array(22).fill(this.startTime, 0, 23)
    time = 0;
    arcLegth = 21;
    
    soundEnabled = false;

    setDebugMode = (mode) => {
        this.debugMode = mode;
    }

    getArcData = (index) => {
        const fullLoop = Math.PI * 2;
        const numberOfLoops = 50 - index;
        const cycleDistance = fullLoop * numberOfLoops;
        const cycleTime = 600;
        const velocity = this.mathUtils.getVelocity(cycleDistance, cycleTime);
        
        return {
            color: this.colors[index],
            nextImpactTime: this.calculateNextImpactTime(this.impactTime[index], velocity),
            velocity
        }
    }

    calculateNextImpactTime = (currentImpactTime, velocity) => {
        return currentImpactTime + (Math.PI / velocity) * 1000;
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

            this.context.font = "15px Monospace";
            this.context.fillStyle = "white";
            this.context.fillText(`Dimensions: (${width}, ${height}),  `, 3, lineY(0));
            this.context.fillText(`LineWidth: ${this.dimensions.lineWidth},`, 3, lineY(1));
            this.context.fillText(`SoundEnabled: ${this.soundEnabled},`, 3, lineY(2));
            this.context.fillText(`NextImpact: [`, 3, lineY(3));
            for(let i = 1; i <= 21; i ++) {
                this.context.fillText(`    ${this.impactTime[i]},`, 3, lineY(i + 3));
            }
            this.context.fillText(`]`, 3, lineY(25));
        }
    }    

    guideLine = () => {

        const {width, height} = this.canvas;

        const {
            horizontalMarginDistance, 
            verticalMarginDistance
        } = this.getMarginDistance();

        this.dimensions.lineWidth = width - horizontalMarginDistance * 2;

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

        const {verticalMarginDistance} = this.getMarginDistance();
        const {height, width} = this.canvas;

        const centerY = height - verticalMarginDistance;
        const centerX = width / 2;

        const x = radius * Math.cos(distance) + centerX;
        const y = radius * Math.sin(distance) + centerY;

        this.context.beginPath();
        this.context.fillStyle = this.style.mainColor;
        this.context.arc(x, y, this.dimensions.lineWidth * 0.005, 0, Math.PI * 2);
        this.context.fill();

    }

    arcsAndCircles = () => {
        const initialArcRadius = this.dimensions.lineWidth * 0.03;
        const spacing = ((this.dimensions.lineWidth / 2 - initialArcRadius) / this.arcLegth);

        for(let i = 1; i <= this.arcLegth; i ++) {
            const radius = initialArcRadius + ((i) * spacing);

            const {color, nextImpactTime, velocity} = this.getArcData(i);

  
            const circleDistance = this.mathUtils.calcDistance(velocity, this.time);

            this.arc(radius, color);
            this.circle(circleDistance, radius);
            
            if(new Date().getTime() >= nextImpactTime) {
                this.impactTime[i] = new Date().getTime();                

                if(this.soundEnabled){
                    const audio = new Audio(`./assets/key-${i - 1}.mp3`);
                    audio.volume = 0.03;
                    audio.play();
                }
            }

        }

    }

    drawFrame = () => {
        requestAnimationFrame(() => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            this.time = (new Date().getTime() - this.startTime) / 1000;
    
            this.background();
            this.guideLine();
            this.arcsAndCircles();

            this.drawFrame();
        });
    }
    run = this.drawFrame;
}