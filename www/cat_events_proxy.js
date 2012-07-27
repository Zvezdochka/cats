var CatEventsProxy = function()
{
    var that = this;
    that.canvas = null;

    that.construct = function(manager)
    {
        manager.loadEnvironment(that);

        var tail = that.canvas.select('#tail');
        tail.on('mousedown', that.tailgrabber);

        var catBody = that.canvas.select('#shreda_image');
        catBody.on('mousedown', that.catchCat);
    }

    that.getCatUse = function(d3event)
    {
        var groupUse = d3event.target.correspondingUseElement;
        return groupUse.cat;
    }

    // event handlers
    
    that.tailgrabber = function()
    {
        var catUse = that.getCatUse(d3.event);
        return catUse.events.tailgrabber(d3.event);
    }

    that.catchCat = function()
    {
        var catUse = that.getCatUse(d3.event);
        return catUse.events.catchCat(d3.event);
    }

    that.construct.apply(that, arguments);
}