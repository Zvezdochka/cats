var Socket = function()
{
    var that = this;
    that.manager = null;
    that.canvas = null;
    that.domNode = null;
    that.forceNode = null;

    that.construct = function(manager)
    {
        manager.loadEnvironment(that);

        //making socket use
        that.domNode = that.canvas.append('use')
        that.domNode.attr('x', 500)
                    .attr('y', 500)
                    .attr('xlink:href', '#socket');

        //making socket force node
        that.forceNode = 
        {
            'x': that.domNode.attr('x'), 
            'y': that.domNode.attr('y'),
            'fixed' : true
        };
        that.manager.addForceNode(that.forceNode);
    }

    that.getCentre = function()
    {
        var socketBoundBox = that.domNode.node().getBBox();
        var centre = that.manager.createSVGPoint();
        centre.x = that.domNode.attr('x')*1 + socketBoundBox.width / 2;
        centre.y = that.domNode.attr('y')*1 + socketBoundBox.height / 2;
        return centre;
    }

    that.startListeningEvents = function()
    {
        that.domNode.on('mouseover', that.onHighlight);
        that.domNode.on('mouseout', that.onLowlight);
        that.domNode.on('mouseup', that.onSelect);
    }

    that.stopListeningEvents = function()
    {
        that.domNode.on('mouseover', null);
        that.domNode.on('mouseout', null);
        that.domNode.on('mouseup', null);
    }

    that.onHighlight = function()
    {
        // draw highlight

        // say manager i'm highlighted
        that.manager.onSocketHighlighted(that);
    }

    that.onLowlight = function()
    {
        that.manager.onSocketLowlighted(that);   
    }

    that.onSelect = function()
    {
        that.manager.onSocketSelected(that);   
        return false;
    }


    that.getForceNode = function()
    {
        return that.forceNode;
    }

    that.construct.apply(that, arguments);

}