var CatManager = function()
{
	var that = this;
	that.canvas =  null;
    that.catContainer = null;
    that.markerContainer = null;

	that.force = null;
    that.forceNodes = [];
    that.forceLinks = [];

    that.cats = [];
    that.mice = [];
    that.links = [];

	that.construct = function(svgElementSelector)
	{
		that.canvas = SVG.getCanvas(svgElementSelector);
		that.markerContainer = that.canvas.append('g').attr('id', 'markerGroup');
		that.catContainer = that.canvas.append('g').attr('id', 'catGroup');

        /*create instance of selector*/
        that.catSelector = new CatSelector(that, '#selector');

        /*create instance of cateventsProxy*/
        that.catEventsProxy = new CatEventsProxy(that);

        /*create instance of socket*/
        that.socket = new Socket(that);

        that.force = d3.layout.force();
		that.force.nodes(that.forceNodes)
             .links(that.forceLinks)
             //.gravity(0)
             .charge(-1000)
             //.linkDistance(0)
             .size([500, 250])
             .start();

        that.force.on('tick', that.updateAnimalPositions);

	    that.canvas.on('click', that.addNewAnimal);
	}

    that.loadEnvironment = function(environmetable)
    {
        var environment = 
        {   
            'manager'        : that,
            'canvas'         : that.canvas, 
            'force'          : that.force, 
            'catContainer'   : that.catContainer,
            'markerContainer': that.markerContainer
        };

        for (var envName in environment)
        {
            if (envName in environmetable)
            {
                environmetable[envName] = environment[envName];                
            }
        };
    }

    that.createSVGPoint = function()
    {
        return that.canvas.node().createSVGPoint();
    }

    that.createSelectorUse = function(cat, onDeselect)
    {
        return new SelectorUse(that, '#selector', cat, onDeselect);
    }

	that.addNewAnimal = function()
	{
		if (d3.event.target == that.canvas.node())
		{
	        if (d3.event.ctrlKey)
	        { // mouse creating
                var newMouse = new Mouse(that);
                that.mice.push(newMouse);
	        } else
	        { // cat creating
            	var newCat = new Cat(that); //pass catManager
                that.cats.push(newCat);
	        }
	        that.force.start();
    	}
	}

    that.updateAnimalPositions = function()
    {
        var updater = function(animal)
        {
            animal.updatePosition();
        }
        that.cats.forEach(updater);
        that.mice.forEach(updater);
        that.links.forEach(updater);
    }

    that.iterateCats = function(handler)
    {
        that.cats.forEach(handler);
    }

    that.addForceNode = function(node)
    {
        that.forceNodes.push(node);
        if (that.force)
        {
            that.force.start();
        }
    }

    that.createForceLink = function(target, source)
    {
        var link = new MouseLink(that, target, source);
        that.links.push(link);

        that.forceLinks.push(link.getForceLink());
        that.force.start();
    }

    that.onCatConnectionStart = function(cat)
    {
        that.connectingCat = cat;
        that.socket.startListeningEvents(); // say socket to start listening mouseover|mouseout events
        that.canvas.on('mouseup', that.onCatConnectionCancel);
    }

    that.onCatConnectionCancel = function()
    {
        that.connectingCat.events.releaseTail();
        that.connectingCat = null;
        that.socket.stopListeningEvents();
        that.canvas.on('mouseup', null);
    }

    that.onSocketHighlighted = function(socket)
    {
        that.connectingCat.events.fixTail(socket);
    }

    that.onSocketLowlighted = function(socket)
    {
        that.connectingCat.events.unfixTail(socket);
    }

    that.onSocketSelected = function(socket)
    {
        that.connectingCat.events.fixTail(socket);
        that.socket.stopListeningEvents();
        that.canvas.on('mouseup', null);

        that.createForceLink(socket, that.connectingCat);
        that.connectingCat = null;
    }

	that.construct.apply(that, arguments);
}

