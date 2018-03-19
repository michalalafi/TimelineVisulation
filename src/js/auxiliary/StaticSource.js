/**
 * @author Bc. Michal Kacerovský
 * @version 1.0
 */

define([
    'cz/kajda/data/AbstractDataSource',
    'cz/kajda/data/Collection',
    '../../data/data'
],
function(AbstractDataSource, Collection, __data) {
    

/**
 * Data source used for test purpose.
 * gets data from a JSON variable.
 */
var StaticSource = new Class("StaticSource", {
   
    _extends : AbstractDataSource,

    /**
     * @constructor
     * @param {Class} T_entity object that entities should be mapped to
     * @param {Class} T_relation object that relations should be mapped to
     */
    _constructor: function(T_entity, T_relation) {
        AbstractDataSource.call(this, T_entity, T_relation);
    },
    
    //<editor-fold defaultstate="collapsed" desc="overridden">

        /** @see cz.kajda.data.AbstractDataSource#loadData */
        loadData : function() {
            this._map(__data);
            this._fireEvent("dataLoaded", this);
        },

        /** @see cz.kajda.data.AbstractDataSource#_map */
        _map : function(data) {
            var entities = new Collection(),
                relations = new Collection();

            // map entities 
            for(var i = 0; i < data.nodes.length; i++) {    
                entities.add(new this._objectMapping.entity(data.nodes[i]));
            }

            // map relations
            for(var i = 0; i < data.edges.length; i++) {
                var edge = data.edges[i],
                    edgeObj = new this._objectMapping.relation(edge); // mapped object
            
                if(!entities.get(edge.from).hasRelation(edgeObj.getId()))
                    entities.get(edge.from).addRelation(edge.id);
                if(!entities.get(edge.to).hasRelation(edgeObj.getId()))
                    entities.get(edge.to).addRelation(edge.id);
                
                relations.add(edgeObj);
            }

            this._entities = entities;
            this._relations = relations;
        }
    
    //</editor-fold>
    
});
    
return StaticSource;
});

