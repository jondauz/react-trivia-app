import React from 'react';
import { CategoryColumnComponent, QuestionCardComponent, AnswerFeedbackComponent, ScoreComponent } from '../../components';
import './TriviaAppContainer.scss';

class TriviaApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            finalCategories: [],
            currentQuestion: null,
            questionValue: null,
            currentScore: 0,
            showResultModal: false,
            lastResult: null
        };

        this.handleQuestionSelection = this.handleQuestionSelection.bind(this);
        this.handleAnswerSelection = this.handleAnswerSelection.bind(this);
        this.handleFeedbackModalClose = this.handleFeedbackModalClose.bind(this);
    }

    componentDidMount() {
        let apiRoot = "https://opentdb.com",
            numOfCategories = 5,
            chosenCategories = [],
            amountOfEasyQuestions = 2,
            amountOfMediumQuestions = 2,
            amountOfHardQuestions = 1;

        fetch(`${apiRoot}/api_category.php`)
            .then(res => res.json())
            .then(
                (result) => {
                    let categories = result.trivia_categories;
                    categories.sort(() => Math.random() - 0.5);

                    for (let i = 1; i <= numOfCategories; i++) {
                        chosenCategories.push(categories[i]);
                    }

                    return Promise.all(chosenCategories.map(category => fetch(`${apiRoot}/api.php?amount=${amountOfEasyQuestions}&category=${category.id}&difficulty=easy`).then(res => res.json())));
                },
                this.errorHandler
            )
            .then(
                (result) => {
                    chosenCategories.forEach((category, index) => {
                        category.questions = [...result[index].results]
                    });

                    return Promise.all(chosenCategories.map(category => fetch(`${apiRoot}/api.php?amount=${amountOfMediumQuestions}&category=${category.id}&difficulty=medium`).then(res => res.json())));
                },
                this.errorHandler
            )
            .then(
                (result) => {
                    chosenCategories.forEach((category, index) => {
                        category.questions = [...category.questions, ...result[index].results]
                    });

                    return Promise.all(chosenCategories.map(category => fetch(`${apiRoot}/api.php?amount=${amountOfHardQuestions}&category=${category.id}&difficulty=hard`).then(res => res.json())));
                },
                this.errorHandler
            )
            .then(
                (result) => {
                    chosenCategories.forEach((category, index) => {
                        category.questions = [...category.questions, ...result[index].results]
                    });

                    this.setState({
                        isLoaded: true,
                        finalCategories: this.addQuestionProps(chosenCategories)
                    });
                }
            );
    }

    addQuestionProps(categories) {
        return categories.map(category => ({
            ...category,
            questions: category.questions.map((question, index) => ({
                ...question,
                value: (index + 1) * 200,
                disabled: false
            }))
        }));
    }

    errorHandler(error) {
        this.setState({
            isLoaded: true,
            error
        });
    }

    handleQuestionSelection(question) {
        question.disabled = true;
        this.setState({
            currentQuestion: question
        });
    }

    handleAnswerSelection(answer) {
        let isCorrect = (this.state.currentQuestion.correct_answer === answer);
        this.setState({
            showResultModal: true,
            lastResult: { 
                isCorrect, 
                correctAnswer: this.state.currentQuestion.correct_answer,
                prevScore: this.state.currentScore,
                scoreChange: isCorrect ? this.state.currentQuestion.value : -(this.state.currentQuestion.value)
            },
            currentQuestion: null,
            currentScore: isCorrect ? this.state.currentScore + this.state.currentQuestion.value : this.state.currentScore - this.state.currentQuestion.value
        });
    }

    handleFeedbackModalClose() {
        this.setState({ showResultModal: false });
    }
 
    render() {
        const { error, isLoaded, finalCategories, currentQuestion, currentScore, lastResult, showResultModal } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (currentQuestion) {
            return (
                <div>
                    <QuestionCardComponent onAnswerSelection={ this.handleAnswerSelection } question={ currentQuestion } />;
                    <ScoreComponent score={ currentScore } /> 
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="gameBoard">
                        {finalCategories.map(category => (
                            <CategoryColumnComponent onQuestionSelection={this.handleQuestionSelection} key={category.id} category={category} />
                        ))}
                    </div>
                    { showResultModal && <AnswerFeedbackComponent onClose={ this.handleFeedbackModalClose } result={ lastResult } score={ currentScore } /> }
                    <ScoreComponent score={ currentScore } /> 
                </div>
            );
        }
    }
}

export default TriviaApp;