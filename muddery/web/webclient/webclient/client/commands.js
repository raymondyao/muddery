
if (typeof(require) != "undefined") {
    require("../client/defines.js");
}

$$.commands = {
    // commands
    cmdString : function(command, args) {
        return JSON.stringify({"cmd" : command, "args" : args});
    },
    
    sendRawCommand: function(cmd) {
    	Evennia.msg("text", cmd);
    },
    
    // functions when user click a command link
    //
    doCommandLink: function(cmd, args) {
        Evennia.msg("text", this.cmdString(cmd, args));
    },
    
    doCastSkill : function(skill, target, combat) {
        var cmd = "castskill";
        var args = {"skill": skill,
                    "target": target,
                    "combat": combat};
        Evennia.msg("text", this.cmdString(cmd, args));
    },

    doQuickLogin: function(playername) {
        var args = {"playername" : playername};
        Evennia.msg("text", this.cmdString("quick_login", args));
    },

    // login
    doLogin: function(playername, password) {
        var args = {"playername" : playername,
                    "password" : password};
        
        Evennia.msg("text", this.cmdString("connect", args));
    },

    // register
    doRegister: function(playername, password, password_verify, connect) {
        
        if (!Evennia.isConnected()) {
            Evennia.connect();
        }

        if (password != password_verify) {
            $$.main.showAlert($$("Password does not match."));
            return;
        }

        var args = {"playername": playername,
                    "password": password,
                    "connect": connect};
        Evennia.msg("text", this.cmdString("create", args));

        $$.component.login.setPlayerName(playername);
    },

    // change password
    doChangePassword: function(current, password, password_verify) {

        if (!Evennia.isConnected()) {
            Evennia.connect();
        }

        if (password != password_verify) {
            $$.main.showAlert($$("Password does not match."));
            return;
        }

        var args = {"current": current,
                    "new": password};
        Evennia.msg("text", this.cmdString("change_pw", args));
    },

    // create new character
    createCharacter: function(name) {
   	 	var args = {"name": name};
		Evennia.msg("text", this.cmdString("char_create", args));
    },

    // delete a character
    deleteCharacter: function(dbref, password) {
        if (!password) {
            return;
        }

        var args = {"dbref": dbref,
                    "password": password};
		Evennia.msg("text", this.cmdString("char_delete", args));
    },
    
    // puppet a character
    puppetCharacter: function(dbref) {
    	Evennia.msg("text", this.cmdString("puppet", dbref));
    },
    
    // unpuppet current character
    unpuppetCharacter: function() {
        Evennia.msg("text", this.cmdString("unpuppet", ""));
    },
    
    // look
    doLook : function(dbref) {
        Evennia.msg("text", this.cmdString("look", dbref));
    },

    // go to
    doGoto : function(dbref) {
        Evennia.msg("text", this.cmdString("goto", dbref));
    },
    
    // talk
    doTalk : function(dbref) {
        Evennia.msg("text", this.cmdString("talk", dbref));
    },
    
    // buy something
    buyGoods: function(dbref) {
    	Evennia.msg("text", this.cmdString("buy", dbref));
    },
    
    // dialogue
    doDialogue: function(dialogue, sentence, npc) {
        if ($$.data_handler.dialogues_list.length > 0) {
            $$.main.showDialogue($$.data_handler.dialogues_list.shift());
        }
        else {
            var args = {"dialogue": dialogue,
                        "sentence": sentence,
                        "npc": npc};
            Evennia.msg("text", this.cmdString("dialogue", args));
        }
    },
    
    // logout
    doLogout : function() {
        localStorage.is_auto_login = "";
        Evennia.msg("text", this.cmdString("quit", ""));
    },
    
    // send command from command box
    doSendCommand: function() {
        var command = $("#box_command :text").val();
        $("#box_command :text").val("");
        
        Evennia.msg("text", command);
    },
    
    // send command text
    doSendText: function(test) {
        Evennia.msg("text", test);
    },
    
    // send out a speech
    say: function(channel, message) {
        var args = {"channel": channel,
                    "message": message}
        Evennia.msg("text", this.cmdString("say", args));
    },
    
    // make a match
    makeMatch: function() {
    	Evennia.msg("text", this.cmdString("make_match", ""));
    },

    // queue up an honour combat
    queueUpCombat: function() {
    	Evennia.msg("text", this.cmdString("queue_up_combat", ""));
    },
    
    // quit a combat queue
    quitCombatQueue: function() {
    	Evennia.msg("text", this.cmdString("quit_combat_queue", ""));
    },
    
    // confirm an honour combat
    confirmCombat: function() {
    	Evennia.msg("text", this.cmdString("confirm_combat", ""));
    },

    // reject an honour combat
    rejectCombat: function() {
    	Evennia.msg("text", this.cmdString("reject_combat", ""));
    },
    
    // get character rankings
    getRankings: function() {
    	Evennia.msg("text", this.cmdString("get_rankings", ""));
    },
    
    // do test
    doTest: function() {
        // test codes
    },

    doAutoLoginConfig: function(playername, password, save_password, auto_login) {
        if (save_password) {
            localStorage.login_name = playername;
            localStorage.login_password = password;

            if (auto_login) {
                localStorage.is_auto_login = "1";
            } else {
                localStorage.is_auto_login = "";
            }
        }
    },

    doSavePassword: function(save_password) {
        if (save_password) {
            localStorage.is_save_password = "1";
        }
        else {
            localStorage.login_name = "";
            localStorage.login_password = "";
            localStorage.is_save_password = "";
            localStorage.is_auto_login = "";
        }
    },

    doRemoveAutoLogin: function() {
        localStorage.is_auto_login = "";
    },
}
