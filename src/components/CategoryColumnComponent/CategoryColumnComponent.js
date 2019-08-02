import React from 'react';
import './CategoryColumnComponent.scss';

class CategoryColumnComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (question) {
        this.props.onQuestionSelection(question);
    }

    render() {
        let { name, questions } = this.props.category;

        return (
            <div className="category__container">
                <div className="category__title">
                    <h3>{ name }</h3>
                </div>
                <div className="category__selections">
                    {questions.map((question, index) => (
                        <button type="button" disabled={ question.disabled } onClick={ () => this.handleClick(question) } key={ index }>
                            ${ question.value }
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}

export default CategoryColumnComponent;