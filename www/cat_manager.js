var CatManager = function()
{
	var that = this;
	that.canvas =  null;
	that.force = null;
	that.catContainer = null;
	that.markerContainer = null;
    that.cats = [];

	that.construct = function(svgElementSelector)
	{
		that.canvas = SVG.getCanvas(svgElementSelector);
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

	that.getGlobalSettings = function()
	{
		return {'canvas': that.canvas, 
                'force': that.force, 
                'catContainer': that.catContainer,
                'markerContainer': that.markerContainer,
                'cats': that.cats
                };
	}

	that.createNewAnimal = function()
	{
		if (d3.event.target == that.canvas.node())
		{
	        if (d3.event.ctrlKey)
	        { // mouse creating
	            var point = d3.svg.mouse(this), // coords where comp mouse has clicked
	                newMouseNode = {'x': point[0], 'y': point[1]},
	                n = forceNodes.push(newMouseNode);
	        } else
	        { // cat creating
            	var newCat = new Cat(that); //pass catManager

            	catNames.push('shreda');
                redraw();
	        }
	        that.force.start();
    	}
	}

    that.addNewCat = function(catObj)
    {
        that.cats.push(catObj);
    }

	that.construct.apply(that, arguments);
}

