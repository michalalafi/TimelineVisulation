/**
 * @author Michal Fiala
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable',
    '../../data/questions',
],
function(Observable, __questions_data) {
    

var QuestionTool = new Class("QuestionTool", {
    
    _extends : Observable,

    _constructor : function() {
        this._setup();
        Observable.call(this);
    },
    /** */
    _jsonResult : "",
    /** */
    _question_index : 0,
    /** */
    _question_max_index : 0,
    /** */
    _questions : {},
    /** */
    _setup : function(){
        this.__groupDebug("Questions setup info");

        // Prepare questions
        this._setQuestions();
        // Set events
        this._setupEvents();
        // Set first question
        this._changeQuestion(this._questions[this._question_index]);
        // Visible content
        this._showContent();
        // Change progress
        this._changeProgressLabel();

        this.__closeGroupDebug();
    },
    /**
     * 
     */
    _setQuestions : function(){
        this.__groupDebug("Questions ready");

        this._questions = __questions_data.questions;
        console.log(this._questions);
        this._question_max_index = this._questions.length - 1;

        this.__closeGroupDebug();
    },
    /**
     * 
     */
    _setupEvents : function(){
        this.__groupDebug("Events setup");

            this.addListener("itemLogClick", new Closure(this, this._itemLogClicked));
            $("#confirm_btn").on("click", new Closure(this, this._confirmAnswer));

        this.__closeGroupDebug();
    },
    /**
     * 
     */
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
    /**
     * 
     */
    _incrementQuestionsIndex : function(){
        if(this._question_index == this._question_max_index)
        {
            alert("Konec hry");
        }
        else
        {
            this._question_index++;
        }
    },
    _changeQuestion : function(question){
        this.__groupDebug("Question changed");

        $("#question_label").text(question.text);

        this.__closeGroupDebug();
    },
    _confirmAnswer : function(e){
        var answer = $("#answer_text").val();
        if(answer === this._questions[this._question_index].answer){
            this._rightAnswer();
        }
        else{
            this._wrongAnwer();
        }
    },
    _rightAnswer : function() {
        this._incrementQuestionsIndex();
        this._changeProgressLabel();
        this._changeQuestion(this._questions[this._question_index]);
    },
    _wrongAnwer : function() {
        $("#wrong_anser_content").show();
        setTimeout(function(){
            $("#wrong_anser_content").hide();
        }, 500);
    },
    _changeProgressLabel : function(){
        $("#questions_done_label").text((this._question_index + 1) + "/" + (this._question_max_index + 1) ) 
    },
    _itemLogClicked : function(e){
        this._jsonResult += JSON.stringify(e);
        console.log(this._jsonResult);
    }
    
});

return QuestionTool;   
});


