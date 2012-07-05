var CatManager = function()
{
	var that = this;
	that.canvas =  null;
	that.force = null;
    that.forceNodes = [];
	that.catContainer = null;
	that.markerContainer = null;
    that.cats = [];
    that.mice = [];

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

    that.loadEnvironment = function(animal)
    {
        var environment = 
        {   
            'canvas'         : that.canvas, 
            'force'          : that.force, 
            'catContainer'   : that.catContainer,
            'markerContainer': that.markerContainer,
        };

        for (var envName in environment)
        {
            animal[envName] = environment[envName];
        };
    }

	that.addNewAnimal = function()
	{
		if (d3.event.target == that.canvas.node())
		{
	        if (d3.event.ctrlKey)
	        { // mouse creating
                var newMouse = new Mouse(that);
                that.mice.push(newMouse);

	            var point = d3.svg.mouse(this), // coords where comp mouse has clicked
	                newMouseNode = {'x': point[0], 'y': point[1]},
	                n = forceNodes.push(newMouseNode);
	        } else
	        { // cat creating
            	var newCat = new Cat(that); //pass catManager
                that.cats.push(newCat);

            	catNames.push('shreda');
                redraw();
	        }
	        that.force.start();
    	}
	}

    that.addForceNode = function(node)
    {
        that.forceNodes.push(node);
    }

	that.construct.apply(that, arguments);
}
