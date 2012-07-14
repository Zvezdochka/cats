var SelectorUse = function()
{
    var that = this;
    that.manager = null;
    that.canvas = null;
    that.markerContainer = null;
    that.domNode = null;

    that.construct = function(manager, defsSelectorId, cat, onDeselect)
    {
        manager.loadEnvironment(that);

        var catCentre = cat.getCentre();
        var catMatrix = cat.getScreenCTM();
        catCentre = catCentre.matrixTransform(catMatrix);

        // draw selector
        var selectorBoundBox = that.canvas.select(defsSelectorId).node().getBBox();
        that.domNode = that.markerContainer.append('use');
        that.domNode.attr('xlink:href', defsSelectorId)
                    .attr('x', catCentre.x - selectorBoundBox.width / 2)
                    .attr('y', catCentre.y - selectorBoundBox.height / 2)
                    .classed('pre', true)
                    .classed('selector', true);

        that.domNode.node().cat = cat;       //bind cat & selector
        that.domNode.on('mouseout', onDeselect);
    }

    that.moveBy = function(offset)
    {
        that.domNode.attr('x', that.domNode.attr('x')*1 + offset.x);
        that.domNode.attr('y', that.domNode.attr('y')*1 + offset.y);
    }

    that.remove = function()
    {
        that.domNode.remove();
    }

    that.construct.apply(that, arguments);
}