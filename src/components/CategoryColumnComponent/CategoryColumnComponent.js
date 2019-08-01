import React from 'react';
import { QuestionCardComponent} from '../../components';

class CategoryColumnComponent extends React.Component {

    getPointAmount(questionIndex) {
        return (questionIndex + 1) * 200;
    }

    render() {
        let { name, questions } = this.props.category;

        return (
            <div>
                <h3>{ name }</h3>
                {questions.map((question, index) => (
                    <QuestionCardComponent key={ `${this.props.category.id}-${index}`} question={ question } value={ this.getPointAmount(index) } />
                ))}
            </div>
        )
    }
}

export default CategoryColumnComponent;