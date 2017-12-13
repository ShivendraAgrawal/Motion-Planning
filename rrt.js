/**
 * Created by shivendra on 12/12/17.
 */

var rrt = {
    init: function(grid, numNodes, epsilon) {
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
        for (var i = 0; i < path.length; i++) {
            if(grid[path[i][0]][path[i][1]].isWall()){
                return true;
            }
        }
        for (var i = 0; i < path.length; i++) {
            if(grid[path[i][0]][path[i][1]].isWall()){
                grid[path[i][0]][path[i][1]].sampled = true;
            }
        }

    },
    heap: function() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    },
    expand: function(grid, start, end, diagonal, heuristic) {
        astar.init(grid);
        heuristic = heuristic || astar.manhattan;
        diagonal = !!diagonal;

        var openHeap = astar.heap();

        openHeap.push(start);

        while(openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            var neighbors = astar.neighbors(grid, currentNode, diagonal);

            for(var i=0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                if(neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    manhattan: function(pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    },
    chebychev: function(pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return Math.max(d1, d2);
    },
    neighbors: function(grid, node, diagonals) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        // West
        if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }

        // East
        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }

        // South
        if(grid[x] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }

        // North
        if(grid[x] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }

        if (diagonals) {

            // Southwest
            if(grid[x-1] && grid[x-1][y-1]) {
                ret.push(grid[x-1][y-1]);
            }

            // Southeast
            if(grid[x+1] && grid[x+1][y-1]) {
                ret.push(grid[x+1][y-1]);
            }

            // Northwest
            if(grid[x-1] && grid[x-1][y+1]) {
                ret.push(grid[x-1][y+1]);
            }

            // Northeast
            if(grid[x+1] && grid[x+1][y+1]) {
                ret.push(grid[x+1][y+1]);
            }

        }

        return ret;
    }
};
