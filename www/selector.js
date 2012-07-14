var CatSelector = function()
{
    var that = this;
    that.manager = null;
    that.canvas = null;
    that.selector = null;
    that.buttons = {rotate: null};

    that.construct = function(manager, selectorGroupId)
    {
        // getting manager, canvas, force, containers
        manager.loadEnvironment(that);

        that.selector = that.canvas.select(selectorGroupId);
        that.buttons.rotate = that.selector.select('#buttonRotate');
        that.buttons.rotate.on('mousedown', that.buttonRotatePress);
    }

    that.buttonRotatePress = function()
    {
        that.canvas.on('mousemove', that.buttonRotateMove(d3.event));
        that.canvas.on('mouseup', that.buttonRotateRelease);
    }

    that.buttonRotateMove = function(mouseDownEvent)
    {
        var catObj = mouseDownEvent.target.correspondingUseElement.cat;

        var selectorCentre = catObj.getCentre();
        var catMatrix = catObj.getDomNode({'native': true}).getScreenCTM();
        selectorCentre = selectorCentre.matrixTransform(catMatrix);

        function getPoint(event)
        {
            return 
            {   
                'x': event.x - selectorCentre.x, 
                'y': selectorCentre.y - event.y
            };
        }

        var startPoint = getPoint(mouseDownEvent);

        var startAngle = Math.atan(startPoint.y / startPoint.x);
        startAngle = that.radToDeg(startAngle);
        var anglePos = startAngle;

        return function() 
        {
            var angleOffset;
            var mouseMoveEvent = d3.event;

            var movePoint = getPoint(mouseMoveEvent);

            var angle = Math.atan(movePoint.y / movePoint.x);

            if (movePoint.x < 0 && movePoint.y > 0)
            {
                angle += Math.PI;
            }
            else if (movePoint.x < 0 && movePoint.y < 0)
            {
                angle -= Math.PI;
            }

            angle = that.radToDeg(angle);
            angleOffset = -(angle - anglePos);
            anglePos = angle;

            catObj.rotate(angleOffset);
        }
    }

    that.radToDeg = function(radian)
    {
        return radian * 180 / Math.PI;
    }

    that.buttonRotateRelease = function()
    {
        that.canvas.on('mousemove', null);
    }

    that.construct.apply(that, arguments);
}
