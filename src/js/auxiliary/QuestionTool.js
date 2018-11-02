/**
 * @author Michal Fiala
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable'
],
function(Observable) {
    

var QuestionTool = new Class("QuestionTool", {
    
    _extends : Observable,

    _jsonResult : "",

    _questions : [
        {
            "text" : "Kdo byl prvni kral?",
            "answer" : "Karel"
        },
        {
            "text" : "Kdo je Karel?",
            "answer" : "Karel"
        }
    ],

    _question_index : 0,


    
    _constructor : function() {
        this._setup();
        Observable.call(this);
    },
    _setup : function(){
        this.__groupDebug("Questions setup info");

        this._setupEvents();
        this._changeQuestion(this._questions[this._question_index]);
        this._showContent();

        this.__closeGroupDebug();
    },
    _showContent : function(){
        this.__groupDebug("Content visible");

        $("#testing_content").children().each(function(){
            if($(this).is(":visible"))
                $(this).hide();
            else
                $(this).show();    
        });

        this.__closeGroupDebug();
    },
    _setupEvents : function(){
        this.__groupDebug("Events setup");

            this.addListener("itemLogClick", new Closure(this, this._nodeClicked));
            $("#confirm_btn").on("click", new Closure(this, this._confirmAnswer));

        this.__closeGroupDebug();
    },
    _incrementQuestionsIndex : function(){
        if(this._question_index == (this._questions.length - 1))
        {
            alert("Konec hry");
        }
        else
            this._question_index++;
    },
    _changeQuestion : function(question){
        this.__groupDebug("Question changed");

        $("#question_label").text(question.text);

        this.__closeGroupDebug();
    },
    _confirmAnswer : function(e){
        this._incrementQuestionsIndex();
        this._changeQuestion(this._questions[this._question_index]);
    },
    _nodeClicked : function(e){
        this._jsonResult += JSON.stringify(e);
        console.log(this._jsonResult);
    }
    
});

return QuestionTool;   
});


