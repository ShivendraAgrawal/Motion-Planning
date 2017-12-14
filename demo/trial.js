/**
 * Created by shivendra on 13/12/17.
 */
var paths = function (x_rand, y_rand, x_nearest, y_nearest) {
    var path = [[x_nearest, y_nearest]];
    var x_step = 0;
    var y_step = 0;
    if(x_nearest > x_rand){
        x_step = -1;
    }
    else{
        x_step = 1;
    }
    if(y_nearest > y_rand){
        y_step = -1;
    }
    else{
        y_step = 1;
    }
    if(Math.abs(x_rand-x_nearest) > Math.abs(y_rand-y_nearest)){
        diagonal_steps = Math.abs(y_rand-y_nearest);
        while(diagonal_steps != 0){
            x_nearest = x_nearest+x_step;
            y_nearest = y_nearest+y_step;
            path.push([x_nearest, y_nearest]);
            diagonal_steps = diagonal_steps - 1;
        }
        remaining_steps = Math.abs(x_rand-x_nearest) - Math.abs(y_rand-y_nearest);
        while(remaining_steps != 0){
            x_nearest = x_nearest+x_step;
            path.push([x_nearest, y_nearest]);
            remaining_steps = remaining_steps - 1;
        }
    }
    else{
        diagonal_steps = Math.abs(x_rand-x_nearest);
        while(diagonal_steps != 0){
            x_nearest = x_nearest+x_step;
            y_nearest = y_nearest+y_step;
            path.push([x_nearest, y_nearest]);
            diagonal_steps = diagonal_steps - 1;
        }
        remaining_steps = Math.abs(y_rand-y_nearest) - Math.abs(x_rand-x_nearest);
        while(remaining_steps != 0){
            y_nearest = y_nearest+y_step;
            path.push([x_nearest, y_nearest]);
            remaining_steps = remaining_steps - 1;
        }
    }
    return path;
};

console.log(paths(22,22,0,3));
