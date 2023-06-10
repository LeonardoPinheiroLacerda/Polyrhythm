class PolyrhythmDOM {

    buildBackgroundImage = (src, parent = document.body, id = "background") => {
        const background = document.createElement("img");
        background.src = src;
        background.id = "background";
        parent.appendChild(background);
        return background;
    }

    buildCanvas = (parent = document.body, id = "canvas") => {
        const canvas = document.createElement("canvas");
        canvas.id = id;
        parent.appendChild(canvas);
        return canvas;
    } 

}