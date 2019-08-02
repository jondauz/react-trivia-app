import React from 'react';
// import { QuestionCardComponent} from '../../components';

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
            <div>
                <h3>{ name }</h3>
                {questions.map((question, index) => (
                    <button type="button" disabled={ question.disabled } onClick={ () => this.handleClick(question) } key={ index }>
                        ${ question.value }
                    </button>
                ))}
            </div>
        )
    }
}

export default CategoryColumnComponent;