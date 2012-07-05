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

    }

    that.updatePosition = function()
    {
        that.domNode.attr('x', that.forceNode.x)
                    .attr('y', that.forceNode.y);
    }

    that.construct.apply(that, arguments);
}