/**
 * Created by shivendra on 12/12/17.
 */

var rrt = {
    epsilon : null,
    init: function(grid, numNodes, epsilon) {
        rrt.epsilon = epsilon;
        for(var x = 0, xl = grid.length; x < xl; x++) {
            for(var y = 0, yl = grid[x].length; y < yl; y++) {
                var node = grid[x][y];
                node.sampled = false;
            }
        }
    },
    collisionDetector: function(grid, x_rand, y_rand, x_nearest, y_nearest){
        if(grid[x_rand][y_rand].isWall()){
            return true;
        }
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
        var i;
        for (i = 0; i < path.length; i++) {
            if(grid[path[i][0]][path[i][1]].isWall()){
                return true;
            }
        }
        for (i = 0; i < path.length; i++) {
            grid[path[i][0]][path[i][1]].sampled = true;
        }
        return false;

    },
    dist: function(p1, p2) {
        return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]))
    },
    step_from_to: function(p1,p2){
        if(rrt.dist(p1,p2) < rrt.epsilon){
            return p2;
        }
        else{
            theta = Math.atan2(p2[1]-p1[1],p2[0]-p1[0]);
            return [Math.floor(p1[0] + rrt.epsilon * Math.cos(theta)), Math.floor(p1[1] + rrt.epsilon * Math.sin(theta))]
        }
    },
    main: function (grid, numNodes, epsilon, start) {
        rrt.init(grid, numNodes, epsilon);

        var vertices = [];
        vertices.push([start.x, start.y]);
        
        var i;
        var j;
        var nn;
        var newNode;
        var rand;
        for (i = 0; i < numNodes; i++) {
            rand = [Math.floor(Math.random()*grid.length), Math.floor(Math.random()*grid.length)];
            // console.log(rand);
            nn = vertices[0];

            for (j = 0; j < vertices.length; j++) {
                if(rrt.dist(vertices[j], rand) < rrt.dist(nn, rand)){
                    nn = vertices[j];
                }
            }
            // console.log(nn);
            newNode = rrt.step_from_to(nn, rand);
            if(rrt.collisionDetector(grid, rand[0], rand[1], nn[0], nn[1]) == false){
                vertices.push(newNode);
            }
        }
        // console.log(vertices);
        // console.log(grid);
        return grid;
    }
};
