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
		that.selectionMarker = null;
        that.annihilatorPower = 1000;
        that.linkedMice = [];

		that.events =
        {
            'catPreselect' : function()
            {
                var centre = that.getCentre();
                var catMatrix = that.domNode.node().getScreenCTM();
                centre = centre.matrixTransform(catMatrix);

                var selectorBoundBox = that.canvas.select('#selector').node().getBBox();
                that.selectionMarker = that.markerContainer.append('use');
                that.selectionMarker.attr('xlink:href', '#selector')
                                    .attr('x', centre.x - selectorBoundBox.width / 2)
                                    .attr('y', centre.y - selectorBoundBox.height / 2)
                                    .classed('pre', true)
                                    .classed('selector', true);

                that.selectionMarker.node().cat = that;       //bind cat & selector
                that.selectionMarker.on('mouseout', that.events.catDeselect);
                that.domNode.on('mouseover', null);
            },

            'catDeselect' : function()
            {
                that.selectionMarker.remove();
                that.selectionMarker = null;
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
                var offsetX = d3.event.x - that.lastX;
                that.lastX = d3.event.x;

                var offsetY = d3.event.y - that.lastY;
                that.lastY = d3.event.y;

                that.pos.x += offsetX;
                that.pos.y += offsetY;
                that.domNode.attr('x', that.pos.x);
                that.domNode.attr('y', that.pos.y);
                if (that.selectionMarker)
                {
                    that.selectionMarker.attr('cx', that.selectionMarker.attr('cx')*1 + offsetX);
                    that.selectionMarker.attr('cy', that.selectionMarker.attr('cy')*1 + offsetY);
                }
            },

            'releaseCat' : function()
            {
                that.canvas.on('mousemove', null);
            }
        }

	    that.construct = function(manager)
	    {
            that.manager = manager; 
            // getting canvas, force, containers, cats
            manager.loadEnvironment(that);

            //createing cat in DOM
            that.domNode = that.catContainer.append('use');
            that.domNode.attr('xlink:href', '#shreda')
                        .attr('x', function(d, i){return i*200})
                        .attr('y', 0)
                        .style('opacity','0')
                        .classed('cat', true);

            that.domNode.on('mousedown', that.events.catchCat);
            that.domNode.on('mouseover', that.events.catPreselect);

            // creating cat in force nodes
            that.forceNode = {'x': that.domNode.x.animVal.value, 'y':that.domNode.y.animVal.value};
            that.forceNodes.push(that.forceNode);
//            that.manager.addNewCat(that);
	    }

        that.getCentre = function()
        {
            var catBoundBox = that.catNode.node().getBBox();
            var centre = that.manager.createSVGPoint();
            centre.x = that.domNode.attr('x')*1 + catBoundBox.width / 2;
            centre.y = that.domNode.attr('y')*1 + catBoundBox.height / 2;
            return centre;
        }

	    that.rotate = function(angle)
        {
            var domCat = that.domNode.node();
            var matrixTransformGroupToCat = domCat.getTransformToElement(domCat.parentNode);
            var catCentre = that.getCentre();
            
            matrixTransformGroupToCat = 
            (
                matrixTransformGroupToCat.translate(catCentre.x, catCentre.y),
                matrixTransformGroupToCat.rotate(angle),
                matrixTransformGroupToCat.translate(-catCentre.x, -catCentre.y)
            );

            var m = (m = matrixTransformGroupToCat, [m.a, m.b, m.c, m.d, m.e, m.f].join(' '));
            that.domNode.attr('transform', 'matrix(' + m + ')');
        }

        that.getAnnihilatorPower = function()
        {
            return that.annihilatorPower;
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
