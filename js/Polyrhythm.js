class Polyrhythm {

    constructor(canvas) {
        this.canvas = canvas;
        
        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");

        document.addEventListener("visibilitychange", (evt => this.soundEnabled = false));
        canvas.addEventListener("click", (evt) => this.soundEnabled = !this.soundEnabled);

        for(let index = 0; index < this.arcLength; index ++) {
            this.getAudio(index).preload;
        }
    }


    colors = [
        "#fbf6f6",
        "#f9f0f1",
        "#f6eaec",
        "#f4e4e6",
        "#f1dfe1",
        "#efd9db",
        "#edd3d6",
        "#eacdd0",
        "#e8c8cb",
        "#e6c2c6",
        "#e3bcc0",
        "#e1b6bb",
        "#deb0b5",
        "#dcabb0",
        "#daa5ab",
        "#d79fa5",
        "#d599a0",
        "#d3939a",
        "#d08e95",
        "#ce888f",
        "#cb828a",
        "#c97c85",
        "#c7777f",
        "#c4717a",
        "#c26b74",
        "#c0656f",
        "#bd5f6a",
        "#bb5a64",
        "#b8545f",
        "#b64e59",
        "#b34955",
        "#ad4752",
        "#a7444f",
        "#a2424c",
        "#9c404a",
        "#963d47",
        "#903b44",
        "#8a3841",
        "#85363f",
        "#7f343c",
        "#793139",
        "#732f36",
        "#6d2d34",
        "#682a31",
        "#62282e",
        "#5c252b",
        "#562329",
        "#512126",
        "#4b1e23",
        "#451c20",
        "#3f1a1e",
        "#39171b",
        "#341518",
        "#2e1215",
        "#281013",
        "#220e10",
        "#1c0b0d",
        "#17090a",
        "#110708",
        "#0b0405",
    ].slice(33, 54);
    
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
        backgroundColor: "rgba(0, 0, 0, 0)",
        mainColor: this.colors[21]
    }

    margin = {
        horizontalMargin: 0.14,
        verticalMargin: 0.07,
    };
    
    guideLineWidth = 0;

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

        const verticalMarginDistance = this.margin.verticalMargin * height;
        const horizontalMarginDistance = this.margin.horizontalMargin * width;
        return {verticalMarginDistance, horizontalMarginDistance};
    }

    background = () => {
        const {width, height} = this.canvas;   

        this.context.fillStyle = this.style.backgroundColor;
        this.context.fillRect(0, 0, width, height);
        
        if(this.debugMode) {

            this.writeDebug();   
        }
    }    

    guideLine = () => {

        const {width, height} = this.canvas;

        const {
            horizontalMarginDistance, 
            verticalMarginDistance
        } = this.getMarginDistance();

        this.guideLineWidth = width - horizontalMarginDistance * 2;

        // Circle guide line

        const initialArcRadius = this.guideLineWidth * this.initialArcRadius;
        const spacing = ((this.guideLineWidth / 2 - initialArcRadius) / (this.arcLength - 1));
        const y = height - verticalMarginDistance;
        
        for(let index = 0; index < this.arcLength; index ++) {
            const x = horizontalMarginDistance + (spacing * index);
            const color = this.colors.slice(0).reverse()[index];
            
            this.statiCircle(x, y, color);
        }

        for(let index = this.arcLength; index < this.arcLength * 2; index ++) {
            let x = horizontalMarginDistance + (spacing * (index - 1));
            x += this.initialArcRadius * (this.guideLineWidth * 2);
            const color = this.colors[index - 21]
            
            this.statiCircle(x, y, color);
        }

        // Line guide line

        // this.context.strokeStyle = this.style.mainColor;
        // this.context.beginPath();
        // this.context.moveTo(horizontalMarginDistance, height - verticalMarginDistance);
        // this.context.lineTo(width - horizontalMarginDistance, height - verticalMarginDistance);
        // this.context.stroke();

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

    circle = (distance, radius, color) => {

        const {x, y} = this.mathUtils.calculateCirclePosition(radius, distance, this.centerPoint.x, this.centerPoint.y);

        this.context.beginPath();
        this.context.fillStyle = color === undefined ? this.style.mainColor : color;
        this.context.arc(x, y, this.guideLineWidth * this.ballRadius, 0, Math.PI * 2);
        this.context.fill();

    }

    statiCircle = (x, y, color) => {
        this.context.beginPath();
        this.context.fillStyle = color === undefined ? this.style.mainColor : color;
        this.context.arc(x, y, this.guideLineWidth * this.ballRadius, 0, Math.PI * 2);
        this.context.fill();
    }

    arcsAndCircles = () => {
        const initialArcRadius = this.guideLineWidth * this.initialArcRadius;
        const spacing = ((this.guideLineWidth / 2 - initialArcRadius) / (this.arcLength - 1));

        for(let index = 0; index < this.arcLength; index ++) {
            const radius = initialArcRadius + ((index) * spacing);

            const {color, nextImpactTime, velocity} = this.getArcData(index);
  
            const circleDistance = this.mathUtils.calcDistance(velocity, this.time);

            this.arc(radius, color);
            this.circle(circleDistance, radius, color);
            
            //Delay para corrigir tempo
            if(new Date().getTime() + 150 >= nextImpactTime) {
                this.impactTime[index] = new Date().getTime();                

                if(this.soundEnabled){
                    const audio = this.getAudio(index);
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

    getAudio = (index) => {
        return new Audio(`./assets/key-${index}.mp3`);
    }

    writeDebug = () => {

        const {width, height} = this.canvas;

        const fontSize = 15;
        const fontFamily = "Monospace";
        const fontColor = "black";
        const margin = 15;
        const lineSpacing = 5;

        const columnLeftX = margin;
        const columnRightX = width - 200 - margin;

        const backgroundColor = `rgba(255, 255, 255, 0.3)`;
        
        let i;

        let actualLineLeft = 0;
        let actualLineRight = 0;

        const lineY = (i) => fontSize + margin + i * (fontSize + lineSpacing);
        const nextLine = (column = "left") => {
            if(column === "left") {
                actualLineLeft += 1;
                return lineY(actualLineLeft - 1);
            } else if(column === "right") {
                actualLineRight += 1;
                return lineY(actualLineRight - 1);
            }
        }

        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, 230, height);
        this.context.fill();

        this.context.fillStyle = backgroundColor;
        this.context.fillRect(columnRightX - margin, 0, width, height);
        this.context.fill();

        const debug = (text, column = "left") => {
            this.context.fillText(text, column === "left" ? columnLeftX : columnRightX, nextLine(column));
        }

        this.context.font = `${fontSize}px ${fontFamily}`;
        this.context.fillStyle = fontColor;


        debug(`Dimensions: (${width}, ${height})`);
        debug(`Guide line: ${this.guideLineWidth}`);
        debug(`Guide line margin X: ${Math.trunc(this.margin.horizontalMargin * 100)}%`);
        debug(`Guide line margin Y: ${Math.trunc(Math.trunc(this.margin.verticalMargin * 100))}%`);
        debug(`Sound enabled: ${this.soundEnabled}`);
        debug(`Volume: ${this.volume * 100}%`);
        debug(``);
        debug(`Last impact time: `);
        for(i = 0; i < this.arcLength; i ++) {
            const impactDate = new Date(this.impactTime[i]);
            debug(` - ${impactDate.toTimeString().split(" ")[0]}:${impactDate.getMilliseconds()}`);
        }

        debug(`Center point:`, "right");
        debug(`  - x: ${this.centerPoint.x}`, "right");
        debug(`  - y: ${this.centerPoint.y}`, "right");
        debug(`Number of arcs: ${this.arcLength}`, "right");
        debug(`Ball radius: ${this.ballRadius * 100}%`, "right");
        debug(`First arc radius: ${this.initialArcRadius * 100}%`, "right");
        debug(`Cycle time: ${this.cycleTime}ms`, "right");
        
        debug(``, "right");
        debug(`Runtime: ${this.time}s`, "right"); 
        debug(`Next impact count down: `, "right");
        for(i = 0; i < this.arcLength; i ++) {
            let {nextImpactTime} = this.getArcData(i);

            nextImpactTime = Math.trunc(nextImpactTime);
            nextImpactTime -= new Date().getTime();

            nextImpactTime /= 1000;
            debug(`  - ${nextImpactTime}s, `, "right");
        }
        
    }
}