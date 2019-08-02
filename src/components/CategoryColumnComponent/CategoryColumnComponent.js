import React from 'react';
// import { QuestionCardComponent} from '../../components';

class CategoryColumnComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    getPointAmount(questionIndex) {
        return (questionIndex + 1) * 200;
    }

    handleClick (question, questionValue) {
        this.props.onQuestionSelection(question, questionValue);
    }

    render() {
        let { name, questions } = this.props.category;

        return (
            <div>
                <h3>{ name }</h3>
                {questions.map((question, index) => (
                    <button onClick={ ()=> this.handleClick(question, this.getPointAmount(index)) } key={ `${this.props.category.id}-${index}`}>
                        ${ this.getPointAmount(index) }
                    </button>
                ))}
            </div>
        )
    }
}

export default CategoryColumnComponent;