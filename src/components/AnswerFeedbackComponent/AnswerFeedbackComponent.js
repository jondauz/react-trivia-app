import React from 'react';
import './AnswerFeedbackComponent.scss';

class AnswerFeedbackComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleCloseSelf = this.handleCloseSelf.bind(this);
    }

    decodeText(text) {
        let textElem = document.createElement('textarea');
        textElem.innerHTML = text;
        return textElem.value;
    }
    
    handleCloseSelf() {
        this.props.onClose();
    }

    render() {
        const { isCorrect, scoreChange, prevScore, correctAnswer } = this.props.result;
        return (
            <div className="feedback__container" onClick={ this.handleCloseSelf }>
                <div className="feedback__content">
                    <p>{ isCorrect ? "Correct!" : "Wrong!" } The answer is { this.decodeText(correctAnswer) }</p>
                    <p>{ scoreChange }</p>
                    <p>Previous Score: { prevScore }</p>
                    <p>New Score: { this.props.score }</p>
                </div>
            </div>
        )
    }
}

export default AnswerFeedbackComponent;