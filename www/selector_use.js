var SelectorUse = function()
{
    var that = this;
    that.manager = null;
    that.canvas = null;

    that.construct = function(manager, defsSelectorId)
    {
        manager.loadEnvironment(that);

        // draw selector (catCentre)
/*                var selectorBoundBox = that.canvas.select(defsSelectorId).node().getBBox();
                selectionMarker = that.markerContainer.append('use');
                selectionMarker.attr('xlink:href', defsSelectorId)
                                    .attr('x', catCentre.x - selectorBoundBox.width / 2)
                                    .attr('y', catCentre.y - selectorBoundBox.height / 2)
                                    .classed('pre', true)
                                    .classed('selector', true);
*/
    }

    that.move = function()
    {

    }

    that.remove = function()
    {

    }

    that.construct.apply(that, arguments);
}