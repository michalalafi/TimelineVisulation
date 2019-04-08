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

    _logListeners : [
        {
            listener : "itemLogClick",
            handlerer : new Closure(this, this._itemLogClicked)
        }
    ],

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
        
        //Setup elements
        this._startTestElement = $("#start_test_content");
        this._endTestElement = $("#end_test_content");
        this._testContentElement = $("#test_content");
        this._answerElement = $("#answer_text");
        this._questionLabelElement = $("#question_label");
        this._wrongAnswerElement = $("#wrong_anser_content");
        this._progressLabelElement = $("#questions_progress_label");

        //Item click
        this.addListener("itemLogClick", new Closure(this, this._itemLogClicked));
        //Timeline zoom
        this.addListener("timelineLogZoom", new Closure(this, this._timelineLogZoomed));
        //Relation click
        this.addListener("relationLogClick", new Closure(this, this._relationLogClicked));
        //Item enter
        this.addListener("itemLogEnter", new Closure(this, this._itemLogEnter));
        //Relation enter
        this.addListener("relationLogEnter", new Closure(this, this._relationLogEnter));
        //Relation enter
        this.addListener("itemLogRightClick", new Closure(this, this._itemLogRightClicked));

        //Confirm button click
        $("#confirm_btn").on("click", new Closure(this, this._confirmAnswer));

        this._answerElement.on("keyup", new Closure(this, this._keyUpEvent));

        document.body.addEventListener("click",new Closure(this, this._mouseClickEvent), true);

        this.__closeGroupDebug();
    },

    _setupTestObject: function(){
        this._test = new Object();
        this._test.mouseClickedCount = 0;
        this._test.questions = [];
    },
    /**
     * Starts test
     */
    _startTest : function(){
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
    _endTest : function(){
        // Hide content
        this._toggleVisibilityOfElement(this._testContentElement, false);
        // Hide content
        this._toggleVisibilityOfElement(this._endTestElement, true);

        // Set end time
        this._test.endTime = new Date();
        // Set duration
        this._test.duration = Math.round((this._test.endTime.getTime() - this._test.startTime.getTime())/1000);
        // Set events count
        this._test.eventsCount = this._countEventsInTest(this._test);

        console.log(this._test);
     
        this._copyPaste();
    },
    _countEventsInTest : function(test){
        var result = 0;
        for(var i = 0; i < test.questions.length; i++){
            var question = test.questions[i];
            if(question.events !== null){
                result += question.events.length;
            }
        }
        return result;
    },
    _setupQuestionObjectByActualIndex : function(){
        //Creating question object 
        var questionIndex = this._question_index;
        var questionText = this._questions[this._question_index].text;

        var question = new Object();

        question.events = [];
        question.index = questionIndex;
        question.questionText = questionText;
        question.questionStartTime = new Date();

        return question;
    },
    _endQuestion : function(){
        this._actualQuestion.questionEndTime = new Date();
        this._actualQuestion.questionDuration = Math.round((this._actualQuestion.questionEndTime.getTime() - this._actualQuestion.questionStartTime.getTime())/1000);
    },
    /**
     * 
     */
    _isEndOfTest : function(){
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
        if(this._actualQuestion !== null){
           this._endQuestion();
        }

        this._actualQuestion = this._setupQuestionObjectByActualIndex();
        this._test.questions.push(this._actualQuestion);

        //Change label
        this._questionLabelElement.text(this._actualQuestion.text);
    },
    /**
     * 
     * @param {*} e 
     */
    _confirmAnswer : function(e){
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

    _createEvent : function(info, eventType){
        var event = new Object();
        event.info = info;
        event.eventType = eventType;
        event.eventTime = new Date();
        return event;
    },
    /** ############################# Section - event handlerer  ############################# */
    _itemLogClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item click"));
    },
    _timelineLogZoomed : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Timeline zoom"));
    },
    _relationLogClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Relation click"));
    },
    _itemLogEnter : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item enter"));
    },
    _relationLogEnter : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Relation enter"));
    },
    _itemLogRightClicked : function(e){
        this._actualQuestion.events.push(this._createEvent(e, "Item right clicked"));
    },
    /**
     * If possible prepare JSON string to copy paste
     */
    _copyPaste : function(){
        var copied = false;
  
        // Create textarea element
        const textarea = document.createElement('textarea');

        // // Note: cache should not be re-used by repeated calls to JSON.stringify.
        // var cache = [];
        // textarea.value = JSON.stringify(this._test, function(key, value) {
        //     if (typeof value === 'object' && value !== null) {
        //         if (cache.indexOf(value) !== -1) {
        //             // Duplicate reference found
        //             try {
        //                 // If this value does not reference a parent it can be deduped
        //                 return JSON.parse(JSON.stringify(value));
        //             } catch (error) {
        //                 // discard key if value cannot be deduped
        //                 return;
        //             }
        //         }
        //         // Store value in our collection
        //         cache.push(value);
        //     }
        //     return value;
        // });
        // cache = null;

        // // Set the value of the text
        textarea.value = JSON.stringify(this._test);
        
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
    },
    /**
     * If enter was pressed, call confirm Answer
     * @param {event} e 
     */
    _keyUpEvent : function(e){
        if(e.keyCode === 13){
            this._confirmAnswer();
        }
    },
    /**
     * Increments mouse clicked count
     * @param {event} e 
     */
    _mouseClickEvent : function(e){
        this._test.mouseClickedCount++;
    }
    
});

return QuestionTool;   
});


