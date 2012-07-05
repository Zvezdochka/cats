    var Cat = function()
	{
		var that = this;
        that.manager = null;
		that.canvas = null;
        that.catContainer = null;
        that.domNode = null;
        that.forceNode = null;
        that.catName = name;
		that.lastX = null;
		that.lastY = null;
		that.pos = {x: 0, y: 0};
		that.selectionMarker = null;
        that.annihilatorPower = 1000;

		that.events =
        {
            'catPreselect' : function()
            {
                var centre = that.getCentre();
                var catMatrix = that.catNode.node().getScreenCTM();
                centre = centre.matrixTransform(catMatrix);
                var selectorBoundBox = canvas.select('#selector').node().getBBox();
                that.selectionMarker = canvas.select('#markerGroup')
                      .append('use')
                      .attr('xlink:href', '#selector')
                      .attr('x', centre.x - selectorBoundBox.width / 2)
                      .attr('y', centre.y - selectorBoundBox.height / 2)
                      .classed('pre', true)
                      .classed('selector', true);
                that.selectionMarker.node().cat = that;       //bind cat & this
                that.selectionMarker.on('mouseout', that.events.catDeselect);
                catNode.on('mouseover', null);
            },

            'catDeselect' : function()
            {
                that.selectionMarker.remove();
                that.selectionMarker = null;
                catNode.on('mouseover', that.events.catPreselect);
            },

            'catchCat' : function()
            {
                canvas.on('mousemove', that.events.moveCat);
                canvas.on('mouseup', that.events.releaseCat);
                that.lastX = d3.event.x;
                that.lastY = d3.event.y;
                that.pos.x = that.catNode.attr('x')*1;
                that.pos.y = that.catNode.attr('y')*1;
            },

            'moveCat' : function()
            {
                var offsetX = d3.event.x - that.lastX;
                that.lastX = d3.event.x;

                var offsetY = d3.event.y - that.lastY;
                that.lastY = d3.event.y;

                that.pos.x += offsetX;
                that.pos.y += offsetY;
                that.catNode.attr('x', that.pos.x);
                that.catNode.attr('y', that.pos.y);
                if (that.selectionMarker)
                {
                    that.selectionMarker.attr('cx', that.selectionMarker.attr('cx')*1 + offsetX);
                    that.selectionMarker.attr('cy', that.selectionMarker.attr('cy')*1 + offsetY);
                }
            },

            'releaseCat' : function()
            {
                canvas.on('mousemove', null);
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
            var centre = canvas.node().createSVGPoint();
            centre.x = that.catNode.attr('x')*1 + catBoundBox.width / 2;
            centre.y = that.catNode.attr('y')*1 + catBoundBox.height / 2;
            return centre;
        }

	    that.rotate = function(angle)
        {
            var domCat = that.catNode.node();
            var matrixTransformGroupToCat = domCat.getTransformToElement(domCat.parentNode);
            matrixTransformGroupToCat = matrixTransformGroupToCat.translate(that.getCentre().x, that.getCentre().y);
            matrixTransformGroupToCat = matrixTransformGroupToCat.rotate(angle);
            matrixTransformGroupToCat = matrixTransformGroupToCat.translate(-that.getCentre().x, -that.getCentre().y);
            var m = (m = matrixTransformGroupToCat, [m.a, m.b, m.c, m.d, m.e, m.f].join(' '));
            that.catNode.attr('transform', 'matrix('+m+')');
        }

        that.getAnnihilatorPower = function()
        {
            return that.annihilatorPower;
        }

	    that.construct.apply(that, arguments);
	}
