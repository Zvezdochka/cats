var CatEventsProxy = function()
{
    var that = this;
    that.canvas = null;

    that.construct = function(manager)
    {
        manager.loadEnvironment(that);
        var tail = that.canvas.select('#tail');
        tail.on('mousedown', that.tailgrabber);
    }

    that.tailgrabber = function()
    {
        var cat = d3.event.target.correspondingUseElement.catModel;
        cat.events.tailgrabber();
    }

    that.construct.apply(that, arguments);
}