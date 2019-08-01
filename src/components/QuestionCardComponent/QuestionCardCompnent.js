import React from 'react';

class QuestionCardComponent extends React.Component {
    render() {
        console.log(this.props.question);
        return (
            <div>
              ${ this.props.value}
            </div>
        )
    }
}

export default QuestionCardComponent;