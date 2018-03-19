/**
 * @author Michal Fiala
 * @version 1.0
 */
define([
    'momentjs',
    'cz/kajda/data/AbstractEntity'
],
function(moment, AbstractEntity) {
    
/**
 * Default implementation of the class mapping database items to an subentity.
 * @memberOf {cz.kajda.data}
 */
var SubEntity = new Class("cz.kajda.data.SubEntity", {

    _extends : AbstractEntity,

    /**
     * @constructor
     * @param {Object} data data of subitem to be mapped
     */
    _constructor : function(data) {
        AbstractEntity.call(this, data.id);

         this._startTime = moment.utc(data.begin);
         this._continuous = isset(data.end);
         this._endTime = isset(data.end) ? moment.utc(data.end) : null;
         this._cssClasses = data.css ? /*this._createCssClasses(data.css)*/ data.css : null;
    },

    _startTime : null,
    _endTime : null,
    _continuous : null,
    _cssClasses : null,
   
    /**
     * Checks whether the entity represents a moment or an interval.
     * Returned value is not influenced by presence of start and end time.
     * @returns {Boolean}
     */
    isContinuous : function() {
        return this._continuous;
    },

    /**
     * @returns {moment} start time of represented event
     */
    getStart : function() {
        return this._startTime;
    },

    /**
     * @returns {moment} end time of represented event
     */
    getEnd : function() {
        return this._endTime;
    },
    getCssClasses : function() 
    {
        return this._cssClasses;
    },
    /**
     * Parse rawCssClasses into array of strings
     * @returns {Array<String>} parsed array of strings
     */
    _createCssClasses : function(rawCssClasses)
    {
        var split = rawCssClasses.split(" ");
        return split;
    },
    //</editor-fold>
    
});


return SubEntity;
});