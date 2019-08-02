import React from 'react';
import { CategoryColumnComponent, QuestionCardComponent } from '../../components';
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
          currentScore: 0
        };

        this.handleQuestionSelection = this.handleQuestionSelection.bind(this);
        this.handleAnswerSelection = this.handleAnswerSelection.bind(this);
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

                    for(let i = 1; i <= numOfCategories; i++) {
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
                        finalCategories: chosenCategories
                    });
                }
            );
    }

    errorHandler(error) {
        this.setState({
            isLoaded: true,
            error
        });
    }

    handleQuestionSelection(question, questionValue) {
      this.setState({
        currentQuestion: question,
        questionValue
      });
    }

    handleAnswerSelection(isCorrect) {
      this.setState({
        currentQuestion: null,
        questionValue: null,
        currentScore: isCorrect ? this.state.currentScore + this.state.questionValue : this.state.currentScore - this.state.questionValue
      });
    }

    render() {
        const { error, isLoaded, finalCategories, currentQuestion, currentScore } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (currentQuestion) {
            return <QuestionCardComponent onAnswerSelection={ this.handleAnswerSelection } question={ currentQuestion } />;
        }
         else {
            return (
              <div>
                { currentScore }
                <div className="gameBoard">
                    {finalCategories.map(category => (
                        <CategoryColumnComponent onQuestionSelection={ this.handleQuestionSelection } key={ category.id } category={ category } />
                    ))}
                </div>
              </div>
            );
        }
    }
}

export default TriviaApp;