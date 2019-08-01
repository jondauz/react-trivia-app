import React from 'react';
import { CategoryColumnComponent } from '../../components';
import './TriviaAppContainer.scss';

class TriviaApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          finalCategories: []
        };
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

    render() {
        const { error, isLoaded, finalCategories } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="gameBoard">
                    {finalCategories.map(category => (
                        <CategoryColumnComponent key={ category.id } category={ category } />
                    ))}
                </div>
            );
        }
    }
}

export default TriviaApp;