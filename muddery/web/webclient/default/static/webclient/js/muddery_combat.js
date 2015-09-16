/*
Muddery webclient (javascript component)
*/

var combat = {
    _self_dbref: null,
    _current_target: null,
    _finished: false,
    _result: null,
    
    setSelf: function(dbref) {
        this._self_dbref = dbref;
    },

    createCombat: function(data) {
        this.closeCombat();

        var layer = $('<div>').addClass('overlayer').attr('id', 'overlayer');
        layer.prependTo($("body"));
        
        var box = $('<div>').attr('id', 'combat_box');
        $('<div>').attr('id', 'combat_characters').appendTo(box);
        $('<div>').attr('id', 'combat_commands').appendTo(box);
        box.prependTo($("body"));

        this._current_target = null;
        this._finished = false;
    
        webclient.doSetSizes();
    },

    
    finishCombat: function(data) {
        this._finished = true;
        this._result = data;
        
        setTimeout(combat.showCombatResult, 1000);
    },


    showCombatResult: function() {
        var self = combat;

        $('#combat_characters').remove();
        $('#combat_commands').remove();
        
        var box = $('#combat_box');
        var result = $('<div>').attr('id', 'combat_result');
        
        if ("stopped" in self._result) {
            result.text("Combat stopped !");
        }
        else if ("winner" in self._result) {
            var win = false;
            for (var i in self._result.winner) {
                if (self._result.winner[i].dbref == self._self_dbref) {
                    win = true;
                    break;
                }
            }
            
            if (win) {
                result.text("You win !");
            }
            else {
                result.text("You lost !");
            }
        }
        
        result.appendTo(box);
        
        var button = $('<input>').attr('type', 'button')
                                 .attr('id', 'button_center')
                                 .attr('onClick', 'combat.closeCombat()')
                                 .val('OK')
                                 .addClass('btn btn-primary');
    
        var div = $('<div>');
        div.append($('<div><br></div>'));
        div.append($('<center>').append(button));
        box.append(div);
        
        // popup box
        var result_h = result.outerHeight(true);
        var div_h = div.outerHeight(true);
        box.height(result_h + div_h);
    },


    closeCombat: function() {
        $('#overlayer').remove();
        $('#combat_box').remove();
    },


    displayCombatInfo: function(data) {
        var characters = $('#combat_characters');
        for (var i in data.characters) {
            var fighter = data.characters[i];
            var div = $('<div>').attr('id', 'fighter_' + fighter.dbref.slice(1))
                                .text(fighter.name)
                                .data('dbref', fighter.dbref);
            $('<div>').addClass('hp')
                      .attr('id', 'status_' + fighter.dbref.slice(1))
                      .text(fighter.hp + '/' + fighter.max_hp)
                      .appendTo(div);
            
            if (fighter.dbref == this._self_dbref) {
                div.addClass("fighter_self");
            }
            else {
                div.addClass("fighter_enemy");
                if (!this._current_target) {
                    this._current_target = fighter.dbref;
                }
            }
            
            div.appendTo(characters);
        }
    },
    
    
    displayCombatCommands: function(data) {
        var commands = $('#combat_commands');
        if (commands) {
            var content = $('<div>');
            for (var i in data) {
                var command = data[i];
                var button = $('<input>').addClass('btn')
                                         .addClass('btn-combat')
                                         .attr('type', 'button')
                                         .attr('key', command.key)
                                         .attr('onclick', 'combat.doCombatSkill(this); return false;')
                                         .css({'left': 20 + i * 60})
                                         .val(command.name);
                
                button.appendTo(content);
            }
            
            commands.html(content);
        }
    },


    displayCombatProcess: function(data) {
        for (var i in data) {
            if (data[i].type == "joined") {
                var result = $('#fighter_' + data[i].dbref.slice(1));
                if (result.length == 0) {
                    var fighter = data[i];
                    var div = $('<div>').attr('id', 'fighter_' + fighter.dbref.slice(1))
                                        .text(fighter.name)
                                        .data('dbref', fighter.dbref);
                    $('<div>').addClass('hp')
                              .attr('id', 'status_' + fighter.dbref.slice(1))
                              .text(fighter.hp + '/' + fighter.max_hp)
                              .appendTo(div);
                    
                    if (fighter.dbref == this._self_dbref) {
                        div.addClass("fighter_self");
                    }
                    else {
                        div.addClass("fighter_enemy");
                        if (!this._current_targ) {
                            this._current_target = fighter.dbref;
                        }
                    }
                    
                    var characters = $('#combat_characters');
                    div.appendTo(characters);
                }
            }
            else if (data[i].type == "attacked") {
                var caller = $('#fighter_' + data[i].caller.slice(1));
                if (data[i].caller == this._self_dbref) {
                    caller.animate({left: '50%'}, 100);
                    caller.animate({left: '12%'}, 100);
                }
                else {
                    caller.animate({right: '50%'}, 100);
                    caller.animate({right: '12%'}, 100);
                }
                
                var target = $('#status_' + data[i].target.slice(1));
                target.text(data[i].hp + '/' + data[i].max_hp)
            }
        }
        
        /*
        var fighter = $('status_' + data["character"]);
        if (fighter) {
            fighter.text(data["hp"] + '/' + data["max_hp"]).appendTo(div);
        }
        */
    },

    
    doCombatSkill: function(caller) {
        if (this._finished) {
            return;
        }

        commands.doCombatSkill(caller)
    },
    
        
    get_current_target: function() {
        return this._current_target;
    },
}