    var Cat = function()
	{
		var that = this;
        that.manager = null;
		that.canvas = null;
        that.catContainer = null;
        that.markerContainer = null;
        that.domNode = null;
        that.forceNode = null;
        that.catName = name;
		that.lastX = null;
		that.lastY = null;
		that.pos = {x: 0, y: 0};
		that.selectorUse = null; // object to control selectorUse
        that.annihilatorPower = 1000;
        that.linkedMice = [];

		that.events =
        {
            'catPreselect' : function()
            {
                // create use, send cat & handler for deselection
                that.selectorUse = that.manager.createSelectorUse(that, that.events.catDeselect);
                that.domNode.on('mouseover', null);
            },

            'catDeselect' : function()
            {
                that.selectorUse.remove();
                that.selectorUse = null;
                that.domNode.on('mouseover', that.events.catPreselect);
            },

            'catchCat' : function()
            {
                that.canvas.on('mousemove', that.events.moveCat);
                that.canvas.on('mouseup', that.events.releaseCat);

                that.lastX = d3.event.x;
                that.lastY = d3.event.y;
                that.pos.x = that.domNode.attr('x')*1;
                that.pos.y = that.domNode.attr('y')*1;
            },

            'moveCat' : function()
            {
                var offset = 
                {
                    'x': d3.event.x - that.lastX, 
                    'y': d3.event.y - that.lastY
                };
                that.lastX = d3.event.x;
                that.lastY = d3.event.y;

                that.pos.x += offset.x;
                that.pos.y += offset.y;
                that.domNode.attr('x', that.pos.x);
                that.domNode.attr('y', that.pos.y);

                if (that.selectorUse)
                {
                    that.selectorUse.moveBy(offset);
                }
            },

            'releaseCat' : function()
            {
                that.canvas.on('mousemove', null);
            },

            'tailgrabber' : function()
            {
                console.info('sdfsd');
            }

        }

	    that.construct = function(manager)
	    {
            // getting canvas, force, containers, cats
            manager.loadEnvironment(that);

            //createing cat in DOM
            var point = d3.svg.mouse(that.canvas.node()); // coords where comp mouse has clicked
         
            that.domNode = that.catContainer.append('use');
            that.domNode.attr('xlink:href', '#shreda')
                        .attr('x', point[0])
                        .attr('y', point[1])
                        .style('opacity','0')
                        .classed('cat', true)
                        .transition()
                            .style('opacity', 1)
                            .duration(1000);
            that.domNode.node().catModel = that;

            that.domNode.on('mousedown', that.events.catchCat);
            that.domNode.on('mouseover', that.events.catPreselect);

            // creating cat in force nodes
            that.forceNode = 
            {
                'x': that.domNode.node().x.animVal.value, 
                'y': that.domNode.node().y.animVal.value
            };
            that.manager.addForceNode(that.forceNode);
	    }

        that.getCentre = function()
        {
            var catBoundBox = that.domNode.node().getBBox();
            var centre = that.manager.createSVGPoint();
            centre.x = that.domNode.attr('x')*1 + catBoundBox.width / 2;
            centre.y = that.domNode.attr('y')*1 + catBoundBox.height / 2;
            return centre;
        }

        that.getScreenCTM = function()
        {
            return that.domNode.node().getScreenCTM();
        }

	    that.rotate = function(angle)
        {
            var domCat = that.domNode.node();
            var matrixTransformGroupToCat = domCat.getTransformToElement(domCat.parentNode);
            var catCentre = that.getCentre();
            
            newMatrix = matrixTransformGroupToCat.translate(catCentre.x, catCentre.y);
            newMatrix = newMatrix.rotate(angle);
            matrixTransformGroupToCat = newMatrix.translate(-catCentre.x, -catCentre.y);

            var m = (m = matrixTransformGroupToCat, [m.a, m.b, m.c, m.d, m.e, m.f].join(' '));
            that.domNode.attr('transform', 'matrix(' + m + ')');
        }

        that.updatePosition = function()
        {
            that.domNode.attr('x', that.forceNode.x)
                        .attr('y', that.forceNode.y);
        }

        that.getAnnihilatorPower = function()
        {
            return that.annihilatorPower;
        }

        that.getDomNode = function(args)
        {
            args = (args == undefined)? {'native' : true} : args;
            return (args.native ? that.domNode.node() : that.domNode);
        }

        that.getForceNode = function()
        {
            return that.forceNode;
        }

        that.addLinkedMouse = function(mouse)
        {
            that.linkedMice.push(mouse);
        }

        that.iterateLinkedMice = function(handler)
        {
            that.linkedMice.forEach(handler);
        }

	    that.construct.apply(that, arguments);
	}
