var CatManager = function()
{
	var that = this;
	that.canvas = null;
	that.force = null;
	that.catContainer = null;
	that.markerContainer = null;


	that.construct = function(svgElementSelector)
	{
		that.canvas = getSVGCanvas(svgElementSelector);
		that.markerContainer = that.canvas.append('g').attr('id', 'markerGroup');
		that.catContainer = that.canvas.append('g').attr('id', 'catGroup');

        that.force = d3.layout.force();
		that.force.nodes(forceNodes)
             .links(forceLinks)
             //.gravity(0)
             .charge(-1000)
             //.linkDistance(0)
             .size([500, 250])
             .start();

        that.force.on('tick', function()
        {
             redrawMice();
             redrawMiceLinks();
        });

	    that.canvas.on('click', that.addNewAnimal);
	}

	that.getCatContainer = function()
	{
		return that.catContainer;
	}

	that.getMarkerContainer = function()
	{
		return that.markerContainer;
	}

	that.addNewAnimal = function()
	{
        if (d3.event.ctrlKey)
        { // mouse adding
            var point = d3.svg.mouse(this), // coords where comp mouse has clicked
                newMouseNode = {'x': point[0], 'y': point[1]},
                n = forceNodes.push(newMouseNode);
        } else
        { // cat adding
			if (d3.event.target == canvas.node())
			{
            	catNames.push('shreda');
                redraw();
            }
        }
        that.force.start();
	}

	that.construct.apply(that, arguments);
}

