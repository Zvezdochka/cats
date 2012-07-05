var Mouse = function()
{
    var that = this;
    that.domNode = null;
    that.forceNode = null;

    that.construct = function(manager)
    {
        that.manager = manager; 
        // getting canvas, force, containers, cats
        manager.loadEnvironment(that);

        // mouse-DOM creating
        that.domNode = that.canvas.insert('use');
        that.domNode.attr('xlink:href', '#chromed_mouse')
                    .attr('class', 'mouse')
                    .attr('width', 100)
                    .call(that.force.drag);

        // mouse-force node creating
        var point = d3.svg.mouse(that.canvas.node()), // coords where comp mouse has clicked
            that.forceNode = {'x': point[0], 'y': point[1]};
        manager.addForceNode(that.forceNode);

//        that.catBelongTo = null;
        
        that.updatePosition(); 
        that.domNode.on('dblclick', that.createLink);

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
        var cat_found = false;
//
        
        that.cats.forEach(function(cat)
        {
            if (cat_found) {return ;}
            var distanceCat = {'x': cat.pos.x - d.x, 'y': cat.pos.y - d.y};
            distanceCat = Math.sqrt(distanceCat.x * distanceCat.x + distanceCat.y * distanceCat.y);
            if (distanceCat <= cat.catAnnihilatorPower)
            {   //cat found. find mouse to link to
                cat_found = true;
                var distanceMin = 100000;
                mice.forEach(function(mouse)
                {
                    if (mouse.catBelongTo == cat)
                    {
                        var distanceMouse = ({'x': mouse.forceNode.x - d.x, 'y': mouse.forceNode.y - d.y},
                                            Math.sqrt(distanceMouse.x * distanceMouse.x + distanceMouse.y * distanceMouse.y));
                        if (distanceMouse < distanceMin)
                        {
                            distanceMin = distanceMouse;
                        }
                    }
                });
                var target = null;
                if (distanceMin < distanceCat)
                {
                    target =  mouse.forceNode;
                } else
                {   // mouse enough close to cat

                    target = cat.forceNode;
                }
                link = {'target': target, 'source': d};
                forceLinks.push(link);
                force.start();
                //redrawMiceLinks();

                //save link to cat
                mice.forEach(function(mouse)
                {
                    if (mouse.mouseNode == d3.select(this))
                    {   //found mouse to link it to cat
                        mouse.catBelongTo = cat;
                    }
                });
          //      break;
            }
        })
    }

    that.findNearestCat = function()
    {
        var min = {'distance': null, 'cat': null};
        that.manager.iterateCats(function(catObject)
        {
            var cat = catObject.getForceNode();
            var mouse = that.forceNode;
            var distance = ({'x': cat.x - mouse.x, 'y': cat.y - mouse.y},
                            Math.sqrt(distance.x * distance.x + distance.y * distance.y));

            if (distance <= catObject.getAnnihilatorPower())
            {
                if ((distance < min.distance) || !min.distance)
                {
                    min.distance = distance;
                    min.cat = catObject;
                }
            }
        });
        return min.cat;
    }

    that.findNearestMouse = function()
    {

    }


    that.construct.apply(that, arguments);
}