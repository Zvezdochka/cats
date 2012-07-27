var Mouse = function()
{
    var that = this;
    that.manager = null;
    that.canvas = null;
    that.domNode = null;
    that.forceNode = null;
    that.linkedCat = null;

    that.construct = function(manager)
    {
        // getting canvas, force, containers, cats
        manager.loadEnvironment(that);

        // mouse-DOM creating
        that.domNode = that.canvas.insert('use');
        that.domNode.attr('xlink:href', '#chromed_mouse')
                    .attr('class', 'mouse')
                    .attr('width', 100)
                    .call(manager.force.drag);

        // mouse-force node creating
        var point = d3.svg.mouse(that.canvas.node()); // coords where comp mouse has clicked
        that.forceNode = {'x': point[0], 'y': point[1]};
        manager.addForceNode(that.forceNode);

        that.updatePosition(); 
        that.domNode.on('dblclick', that.createLink);

    }

    that.getForceNode = function()
    {
        return that.forceNode;
    }

    that.updatePosition = function()
    {
        that.domNode.attr('x', that.forceNode.x)
                    .attr('y', that.forceNode.y);
    }

    that.createLink = function()
    {
       // making link between mouse and cat
        //find cat-actor
        var nearestCat = that.findNearestCat();
        var nearestMouse = that.findNearestMouse(nearestCat.cat);
        if (!nearestMouse.mouse) 
        {
            var target = nearestCat.cat;
        } else if (!nearestCat.cat)
        { 
            return ;
        } else 
        {
            target = (nearestCat.distance < nearestMouse.distance ? nearestCat.cat : nearestMouse.mouse);
        }

        that.manager.createForceLink(target, that);

        //save link to cat
        that.linkedCat = nearestCat.cat;
        that.linkedCat.addLinkedMouse(that);
    }

    that.findNearestCat = function()
    {
        var min = {'distance': null, 'cat': null};
        that.manager.iterateCats(function(catObject)
        {
            var cat = catObject.getForceNode();
            var mouse = that.forceNode;
            var distance = {'x': cat.x - mouse.x, 'y': cat.y - mouse.y};
            distance = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

            if (distance <= catObject.getAnnihilatorPower())
            {
                if ((distance < min.distance) || !min.distance)
                {
                    min.distance = distance;
                    min.cat = catObject;
                }
            }
        });
        return min;
    }

    that.findNearestMouse = function(cat)
    {
        var min = {'distance': null, 'mouse': null};
        cat.iterateLinkedMice(function(mouse)
        {
            var thisMouse = that.forceNode;
            var thatMouse = mouse.getForceNode();
            var distance = {'x': thisMouse.x - thatMouse.x, 'y': thisMouse.y - thatMouse.y};
            distance = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

            if ((distance < min.distance) || !min.distance)
            {
                min.distance = distance;
                min.mouse = mouse;
            }
        });
        return min;
    }

    that.construct.apply(that, arguments);
}