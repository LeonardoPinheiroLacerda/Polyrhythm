class MathUtils {

    getDistance = (velocity, time) => {
        return velocity * time;
    }
    
    getVelocity = (distance, time) => {
        return distance / time;
    }
    
    getTime = (distance, velocity) => {
        return distance / velocity;
    }

    calcDistance = (velocity, time) => {
        const maxAngle = 2 * Math.PI;
        let distance = Math.PI + this.getDistance(velocity, time);
        let modDistance = distance % maxAngle;
        let ajustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;
        return ajustedDistance;
    }

    calculateNextImpactTime = (currentImpactTime, velocity) => {
        const distance = Math.PI;
        return currentImpactTime + this.getTime(distance, velocity) * 1000;
    }

    calculateCirclePosition = (radius, distance, centerX, centerY) => {
        const x = radius * Math.cos(distance) + centerX;
        const y = radius * Math.sin(distance) + centerY;
        return {x, y};
    }

    calculateCenterPoint = (width, height, verticalMargin = 0) => {
        return {
            x: canvas.width / 2,
            y: canvas.height - verticalMargin
        }
    }

}