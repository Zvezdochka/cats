var Socket = function()
{
    var that = this;
    that,manager = null;
    that.canvas = null;
    that.domNode = null;
    

    that.construct = function(manager)
    {
        manager.loadEnvironment(that);

        //making socket use
        that.domNode = that.canvas.append('use')
        that.domNode.attr('x', 500)
                    .attr('y', 500)
                    .attr('xlink:href', '#shreda');

        //making socket force node
        var forceNode = 
        {
            'x': that.domNode.attr('x'), 
            'y': that.domNode.attr('y'), 
            'fixed': true
        };
        that,manager.addForceNode(forceNode);
    }

    that.construct.apply(that, arguments);

}