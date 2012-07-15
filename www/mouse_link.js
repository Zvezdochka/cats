var MouseLink = function()
{
    var that = this;
    that.canvas = null;
    that.target = null;
    that.source = null;
    that.domNode = null;

    that.construct = function(manager, target, source)
    {
        manager.loadEnvironment(that);
        that.target = target;
        that.source = source;

        that.domNode = that.canvas.insert('line');
        that.domNode.attr('class', 'mouselink');
        that.updatePosition();
    }

    that.getForceLink = function()
    {
        return {'target': that.target.getForceNode(), 'source': that.source.getForceNode()};   
    }

    that.updatePosition = function()
    {
        var target = that.target.getForceNode();
        var source = that.source.getForceNode();

        that.domNode.attr('x1', source.x)
                    .attr('y1', source.y)
                    .attr('x2', target.x)
                    .attr('y2', target.y);
    }

    that.construct.apply(that, arguments);
}