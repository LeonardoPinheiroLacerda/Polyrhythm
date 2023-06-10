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

}