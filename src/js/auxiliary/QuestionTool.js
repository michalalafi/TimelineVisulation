/**
 * @author Michal Fiala
 * @version 1.0
 */

define([
    'cz/kajda/common/Observable',
    '../../data/questions',
],
function(Observable, __questionsData) {
    

var QuestionTool = new Class("QuestionTool", {
    
    _extends : Observable,

    
    _constructor : function() {
        this._setup();
        Observable.call(this);
    },
    _test : null,
    /** Result of user activities */
    _jsonResult : "",
    /** Actuall question */
    _question_index : 0,
    /** Max questions */
    _question_max_index : 0,
    /** Questions */
    _questions : {},

    _actualQuestion : null,

    _WRONG_ANSWER_TIMEOUT : 1000,

    _answerElement : null,

    _testContentElement : null,

    _startTestElement : null,

    _endTestElement : null,

    _questionLabelElement : null,

    _wrongAnswerElement : null,

    _progressLabelElement : null,

    _startOfTestTime: null,

    _endOfTestTime: null,

    /**
     * Setup question tool
     */
    _setup : function(){
        this.__groupDebug("Questions setup info");

        this._setupTestObject();
        // Prepare questions
        this._setupQuestions();
        // Set events
        this._setupEvents();
        //Start test
        this._startTest();

        this.__closeGroupDebug();
    },
    /**
     * Prepare question from array
     */
    _setupQuestions : function(){
        this.__groupDebug("Questions ready");
        //Set questions
        this._questions = __questionsData.questions;
        //Set max questions index
        this._question_max_index = this._questions.length - 1;
        
        console.log(this._questions);

        this.__closeGroupDebug();
    },
    /**
     * Prepare events to be logged
     */
    _setupEvents : function(){
        this.__groupDebug("Events setup");

        //Item click
        this.addListener("itemLogClick", new Closure(this, this._itemLogClicked));

        //Timeline zoom
        this.addListener("timelineLogZoom", new Closure(this, this._timelineLogZoomed));

        //Confirm button click
        $("#confirm_btn").on("click", new Closure(this, this._confirmAnswer));

        //Setup elements
        this._startTestElement = $("#start_test_content");
        this._endTestElement = $("#end_test_content");
        this._testContentElement = $("#test_content");
        this._answerElement = $("#answer_text");
        this._questionLabelElement = $("#question_label");
        this._wrongAnswerElement = $("#wrong_anser_content");
        this._progressLabelElement = $("#questions_progress_label");

        this.__closeGroupDebug();
    },

    _setupTestObject(){
        this._test = new Object();
        this._test.eventsCount = 0;
        this._test.questions = [];
    },
    _setupQuestionObjectByActualIndex(){
        //Creating question object 
        var questionIndex = this._question_index;
        var questionText = this._questions[this._question_index].text;

        var question = new Object();

        question.events = [];
        question.index = questionIndex;
        question.text = questionText;

        return question;
    },
    /**
     * Starts test
     */
    _startTest(){
        // Visible content
        this._toggleVisibilityOfElement(this._testContentElement, true);
        // Not visible start button
        this._toggleVisibilityOfElement(this._startTestElement, false);
        // Set first question
        this._changeQuestion(this._questions[this._question_index]);
        // Change progress
        this._changeProgressLabel();
        // Set start time
        this._test.startTime = new Date();
    },
    _endTest(){
        // Hide content
        this._toggleVisibilityOfElement(this._testContentElement, false);
        // Hide content
        this._toggleVisibilityOfElement(this._endTestElement, true);

        // Set start time
        this._test.endTime = new Date();
        this._test.duration = Math.round((this._test.endTime.getTime() - this._test.startTime.getTime())/1000);

        console.log(this._test);
    },
    /**
     * 
     */
    _isEndOfTest(){
        if(this._question_index >= this._question_max_index){
            return true;
        }
        return false;
    },
    /**
     * 
     */
    _toggleVisibilityOfElement : function(element ,visibility){
        if(visibility)
            element.show();
        else
            element.hide(); 
    },
    /**
     * Increment index
     */
    _incrementQuestionsIndex : function(){
        this._question_index++;
    },
    /**
     * 
     */
    _changeQuestion : function(){
        this.__groupDebug("Question changed");
        this._actualQuestion = this._setupQuestionObjectByActualIndex();
        this._test.questions.push(this._actualQuestion);

        //Change label
        this._questionLabelElement.text(this._actualQuestion.text);

        this.__closeGroupDebug();
    },
    /**
     * 
     * @param {*} e 
     */
    _confirmAnswer : function(e){
        console.log(this._test);
        var answer = this._answerElement.val();
        if(answer === this._questions[this._question_index].answer){
            this._rightAnswer();
        }
        else{
            this._wrongAnswer();
        }

        this._answerElement.val("");
    },
    /**
     * 
     */
    _rightAnswer : function() {
        if(this._isEndOfTest()){
            this._endTest();
        }
        else{
            this._incrementQuestionsIndex();
            this._changeProgressLabel();
            this._changeQuestion();
        }
    },
    /**
     * 
     */
    _wrongAnswer : function() {
        var el = this._wrongAnswerElement;
        this._toggleVisibilityOfElement(el, true);
        setTimeout(function(){
            el.hide();
        }, this._WRONG_ANSWER_TIMEOUT);
    },
    /**
     * 
     */
    _changeProgressLabel : function(){
        // this._progressLabelElement.text((this._question_index + 1) + "/" + (this._question_max_index + 1) );
        var actual = (this._question_index + 1);
        var to = (this._question_max_index + 1);
        this._progressLabelElement.text(`${actual}/${to}`);
    },
    /**
     * 
     */
    _itemLogClicked : function(e){
        this._actualQuestion.events.push(e);
    },
    /**
     * 
     * @param {*} e 
     */
    _timelineLogZoomed : function(e){
        this._actualQuestion.events.push(e);
    },
    _copyPasteTest(){
        var copied = false;
  
        // Create textarea element
        const textarea = document.createElement('textarea');
        
        // Set the value of the text
        textarea.value = "Ahoj kluku";
        
        // Make sure we cant change the text of the textarea
        textarea.setAttribute('readonly', '');
        
        // Hide the textarea off the screnn
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        
        // Add the textarea to the page
        document.body.appendChild(textarea);

        // Copy the textarea
        textarea.select()

        try {
            var successful = document.execCommand('copy');
            copied = true;
        } catch(err) {
            copied = false;
        }

        textarea.remove();
        console.log(copied);
    }
    
});

return QuestionTool;   
});


