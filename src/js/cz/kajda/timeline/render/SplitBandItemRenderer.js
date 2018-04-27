define([
    'momentjs',
    'cz/kajda/timeline/render/AbstractItemRenderer',
    'cz/kajda/timeline/render/Color'
], 
function(moment, AbstractItemRenderer, Color) {
    
    
/**
 * Renderer for entity with subentities.
 * Renders items as a bar in the passed color 
 * that contain label inside if possible, otherwise puts the label aside.
 * Renders subitems as bars or circle
 * @memberOf cz.kajda.timeline.render
 */
var SplitBandItemRenderer = new Class("cz.kajda.timeline.render.SplitBandItemRenderer", {
    
    _extends : AbstractItemRenderer,
    
    _constructor : function(bgColor) {
        AbstractItemRenderer.call(this);
        bgColor = bgColor == null ? "#03f945" : bgColor;

        this._color = bgColor instanceof Color ? bgColor : Color.fromHex(bgColor);
    },
    
    MOMENT_CLASS : 'moment',
    INTERVAL_CLASS : "interval",
    DURATION_CLASS : "duration",
    LABEL_CLASS : "title",
    SUB_ITEM_CLASS : "subitem",
    SPLIT_ITEM_MOMENT_CLASS : "splititem-moment",
    DEFAULT_COLOR_CLASS : "default-color",

    
    //<editor-fold defaultstate="collapsed" desc="private members">
        
        /** @member {cz.kajda.timeline.render.Color} */
        _color : null,
        
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="private methods">

        /**
         * @private
         * Using HTML5 canvas estimates width of the passed string.
         * @param {String} str
         * @param {String} font font specification (e.g. "bold 10px Arial" or "12px")
         * @returns{Number} width estimation 
         */
        _getTextWidth : function(str, font) {
            // re-use canvas object for better performance
            var canvas = this._getTextWidth.canvas || (this._getTextWidth.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = font;
            var metrics = context.measureText(str);
            return metrics.width;
        },

        /**
         * @private
         * Renders an interval entity.
         * @param {cz.kajda.timeline.AbstractItem} item
         * @returns {jQuery}
         */
        _renderContinuous : function(item) {
            var subEntities = item.getEntity().getSubEntities();
            var subItems = item.getSubItems();

            var wrapper = new $("<div>")
                    .addClass(this.INTERVAL_CLASS)
                    .css({
                        "background-color" : "transparent",
                        "border-color" : this._color.darken(20).getRgba()
                    });
            // // Foreach subItem in BandItem
            // // Create div element and append it to wrapper
            // for(var i=0; i < subItems.length; i++)
            // {
            //     var subItem = subItems[i];

            //     var element = this.renderSubItem(subItem);   
                
            //     subItem.setElement(element);

            //     wrapper.append(element);    
            // }
                   
            return wrapper;
        },
        renderSubItem : function(subItem)
        {
            var subEntity = subItem.getEntity();

            // GET CSS of subEntity
            var cssClasses = subEntity.getCssClasses();
            // Create div element
            var element = new $("<div>")
                        .attr("id",subEntity.getId())
                        .addClass(this.SUB_ITEM_CLASS)
                        .css({
                            "border-color" : this._color.darken(20).getRgba()
                        });
            // Add css to element
            element.addClass((cssClasses) ? cssClasses : this.DEFAULT_COLOR_CLASS);
            // Is entity moment?
            // Add moment subentity class
            if(!subEntity.isContinuous())
                element.addClass(this.SPLIT_ITEM_MOMENT_CLASS);

            return element;    
        },
        /**
         * @private
         * Renders a moment entity.
         * @param {cz.kajda.timeline.AbstractItem} item
         * @returns {jQuery}
         */
        _renderMoment : function(item) {         
            var element = new $("<div>")
                    .addClass(this.MOMENT_CLASS)
                    .css({
                        "background-color" : this._color.getRgba(),
                        "border-color" : this._color.darken(20).getRgb()
                    });
            
            return element;
        },
        /**
         * @private
         * Checks whether the item protrudes from the wrapper on the left or right
         * and if so, performs cropping.
         * @param {cz.kajda.timeline.AbstractItem} item
         * @returns {Object} {left : Number, width : Number} new dimension
         */
        _correctProtrusion : function(item) {
            var entity = item.getEntity(),
                duration = entity.getDuration(),
                projection = item.getTimeline().getProjection(),
                leftPos = projection.moment2px(entity.getStart()),
                width = projection.duration2px(duration);
                
            if(entity.isContinuous()) {

                // if the entity protrudes from the wrapper on the left
                // (horizontal position is less than 0), crop it
                if(leftPos < 0) {
                    width += leftPos;
                    leftPos = 0;
                }

                // if the entity protrudes from the wrapper on the right
                // (horizontal position is greater than wrapper width), crop it
                if(width > item.getTimeline().getBandGroup().getWidth()) {
                    width = item.getTimeline().getBandGroup().getWidth();
                }

            }
            
            return {
                left : leftPos,
                width : width 
            };

        },
        /**
         * @private
         * Recalculates left position and width in wrapper for continuous subentity
         * @param {cz.kajda.data.AbstractEntity} subEntity
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _correctProtrusionSubEntity: function(subEntity, item) {

                var itemLeft = item.getPosition().left,
                    projection = item.getTimeline().getProjection(),
                    startTimeSubEntity = subEntity.getStart();
                /*
                    Prvni zpusob vypočet left pozice podle šířky celeho divu

                    Vypočteno začatek subEntity -  začátek entity 

                    Vypočtení jakou část zabírá od začátku subEntita 

                    Left pozice bude násobek koeficientu s aktuální šírkou Entity
                */
                        /* Rozdil zacatku cele entity od zacatku subEntity */
                        /* var duration = moment.duration(subEntity.getStart().diff(entity.getStart())); */
                        /* Podil subEntity vuci Entite */
                        /*var diveded = duration._milliseconds / entityDuration._milliseconds;
                        leftPos = entityWidth * diveded; */
                /* Druhy zpusob je prevedeni rozdilu zacatku subEntity od zacatku Entity na px */
                        /* Rozdil zacatku cele entity od zacatku subEntity */
                        /* var duration = moment.duration(subEntity.getStart().diff(entity.getStart())); */
                        /*leftPos =  projection.duration2px(duration); */
                /* Treti zpusob je nalezeni vzdalenosti Entity od zacatku a SubEntity od zacatku a pak odecteni techto vzdalenosti */
                        /* var entityLeft = projection.moment2px(startTime);
                        var subEntityLeft = projection.moment2px(startTimeSubEntity);
                        leftPos = projection.moment2px(startTimeSubEntity) - projection.moment2px(startTime); */
                /* Ctvrty zpusob left pozice subEntity v celem kontextu - left pozice entity */
                var leftPos = projection.moment2px(startTimeSubEntity) - itemLeft;
                var width = projection.duration2px(subEntity.getDuration());
                var htmlElement = item.getHtmlElement().find("#"+subEntity.getId());

                var htmlElement2 = item.getSubItems()[sub]

                $(htmlElement).css({
                    "position" : "absolute",
                    "left" : leftPos,
                    "width" : width
                });
        },
        /**
         * @private
         * Recalculates left position and width in wrapper for moment subentity
         * @param {cz.kajda.data.AbstractEntity} subEntity
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _correctProtrusionSubEntityMoment: function(subEntity,item) {
            var itemLeft = item.getPosition().left,
                projection = item.getTimeline().getProjection(),
                startTimeSubEntity = subEntity.getStart();

            var leftPos = projection.moment2px(startTimeSubEntity) - itemLeft;
            var htmlElement = item.getHtmlElement().find("#"+subEntity.getId());
            $(htmlElement).css({
                    "position" : "absolute",
                    "left" : leftPos,
                });
        },

        _correctProtrusionSubItemContinuous : function(subItem, item)
        {

            var entity = subItem.getEntity();
            var projection = item.getTimeline().getProjection();

            var leftPos = projection.moment2px(entity.getStart()) - item.getPosition().left; 
            var width = projection.duration2px(entity.getDuration());
            /*
                Prvni zpusob vypočet left pozice podle šířky celeho divu

                Vypočteno začatek subEntity -  začátek entity 

                Vypočtení jakou část zabírá od začátku subEntita 

                Left pozice bude násobek koeficientu s aktuální šírkou Entity
            */
                    /* Rozdil zacatku cele entity od zacatku subEntity */
                    /* var duration = moment.duration(subEntity.getStart().diff(entity.getStart())); */
                    /* Podil subEntity vuci Entite */
                    /*var diveded = duration._milliseconds / entityDuration._milliseconds;
                    leftPos = entityWidth * diveded; */
            /* Druhy zpusob je prevedeni rozdilu zacatku subEntity od zacatku Entity na px */
                    /* Rozdil zacatku cele entity od zacatku subEntity */
                    /* var duration = moment.duration(subEntity.getStart().diff(entity.getStart())); */
                    /*leftPos =  projection.duration2px(duration); */
            /* Treti zpusob je nalezeni vzdalenosti Entity od zacatku a SubEntity od zacatku a pak odecteni techto vzdalenosti */
                    /* var entityLeft = projection.moment2px(startTime);
                    var subEntityLeft = projection.moment2px(startTimeSubEntity);
                    leftPos = projection.moment2px(startTimeSubEntity) - projection.moment2px(startTime); */
            /* Ctvrty zpusob left pozice subEntity v celem kontextu - left pozice entity */
            var htmlElement = subItem.getHtmlElement();
            var renderer = subItem.getR();
            $(htmlElement).css({
                "position" : "absolute",
                "left" : leftPos,
                "width" : width
            });
        },

        _correctProtrusionSubItemMoment : function(subItem, item){
            var entity = subItem.getEntity();
            var projection = item.getTimeline().getProjection();
            var leftPos = projection.moment2px(entity.getStart()) - item.getPosition().left;

            var htmlElement = subItem.getHtmlElement();
            $(htmlElement).css({
                    "position" : "absolute",
                    "left" : leftPos,
                });

        },
        /**
         * @private
         * Correct protusion of sub-entities
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _correctProtrusionSubEntities: function(item){
            var entity = item.getEntity(),
                subEntities = entity.getSubEntities(),
                subItems = item.getSubItems();

            for(var i = 0; i < subItems.length; i++)
            {
                var subItem = subItems[i];
                if(subItem.getEntity().isContinuous())
                    this._correctProtrusionSubItemContinuous(subItem, item);
                else 
                    this._correctProtrusionSubItemMoment(subItem, item);
            }
            // for(var i = 0; i < subEntities.length; i++)
            // {
            //     if(subEntities[i].isContinuous())
            //         this._correctProtrusionSubEntity(subEntities[i],item);
            //     else 
            //         this._correctProtrusionSubEntityMoment(subEntities[i],item);
            // }

        },
        
        /**
         * @private
         * Redraws item label.
         * If possible, centers the label according to the time pointer.
         * Otherwise sticks it to the left or right side of the duration element.
         * @param {cz.kajda.timeline.AbstractItem} item
         */
        _redrawLabel : function(item) {

            var labelEl = item.getHtmlElement().find("." + this.LABEL_CLASS),
                durationEl = item.getHtmlElement().find("." + this.DURATION_CLASS),
                timeline = item.getTimeline();
        
            // label width is less than duration width, label can be put in it
            if(durationEl.width() > labelEl.width()) {
                var timePointerLeft = timeline.getWidth() / 2;
                var itemLeft = item.getPosition().left + timeline.getWrapper().getPosition().left;
                var itemRight = itemLeft + durationEl.width();
                var titleSemiwidth = labelEl.width() / 2;
                
                labelEl.css({
                    "position" : "absolute"
                });
                
                // item is too left to center the label
                if(itemRight < timePointerLeft + titleSemiwidth) {
                    labelEl.css({
                        "right" : 0
                    });
                } else
                // item is too right to center the label
                if(itemLeft > timePointerLeft - titleSemiwidth) {
                    labelEl.css({
                        "left" : 0
                    });
                }
                // the label can be centered, item matches the time pointer optimally
                else {
                    labelEl.css({
                        "left" : timePointerLeft - itemLeft - titleSemiwidth
                    });
                }
            }
            
            // otherwise, put the label aside
            else {
                labelEl.css({
                    "position" : ""
                });
            }
        },

    //</editor-fold>
    
    //<editor-fold defaultstate="collapsed" desc="overridden">
      
        /** @see cz.kajda.timeline.render.AbstractItemRenderer#render */
        render : function(item) {
            var itemWrapper = $("<div>");
            var element = item.getEntity().isContinuous() ? this._renderContinuous(item) : this._renderMoment(item);
            element.addClass(this.DURATION_CLASS);
            var titleEl = $("<div>")
                    .addClass(this.LABEL_CLASS)
                    .text(item.getEntity().getTitle());
            
            itemWrapper.append(element)
                    .append(titleEl);
            
            item.setLabelElement(titleEl);
            item.setDurationElement(element);

            return itemWrapper;
        },
        
        /** @see cz.kajda.timeline.render.AbstractItemRenderer#redraw */
        redraw : function(item) {
            if(!item.isInDOM()) return;
            var entity = item.getEntity(),
                dims = this._correctProtrusion(item),
                leftPos = dims.left,
                width = dims.width;
                
            item.getHtmlElement().css({
                "position" : "absolute",
                "left" : leftPos
            });

            if(entity.isContinuous())
                item.getHtmlElement().find("." + this.DURATION_CLASS).css("width", width);
            
            if(item.isFocused())
                item.getHtmlElement().addClass("focused");
            else
                item.getHtmlElement().removeClass("focused");

            this._redrawLabel(item);

            // If wrapper has width smaller than 30px => hide all subentities   
            if(width < 30)
                item.getHtmlElement()
                    // Give BandItem color
                    .find("." + this.DURATION_CLASS).css("background-color",this._color.getRgba())
                    .find("." + this.SUB_ITEM_CLASS).each(function()
                        {
                            $(this).hide();
                        });
            // Else recalculate atributes of subentities and show them
            else{
                this._correctProtrusionSubEntities(item);

                item.getHtmlElement()
                .find("." + this.DURATION_CLASS).css("background-color","transparent")
                .find("." + this.SUB_ITEM_CLASS).each(function()
                    {
                        $(this).show();
                    })
            }
        }
        
    //</editor-fold>

});


return SplitBandItemRenderer;
});