SVG = 
{
    'getCanvas': function(embed_id)
    {
        var obj = document.getElementById(embed_id);
        var subDoc = this.getSubDocument(obj);
        var svg = d3.select(subDoc).select('svg');
        return svg;
    }

    'getSubDocument': function(embedding_element)
    {
        if (embedding_element.contentDocument)
        {
            return embedding_element.contentDocument;
        }
        else
        {
            var subdoc = null;
            try
            {
                subdoc = embedding_element.getSVGDocument();
            } catch(e) {}
            return subdoc;
        }
    }

}
