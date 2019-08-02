import React from 'react';
import './QuestionCardComponent.scss';

class QuestionCardComponent extends React.Component {
    constructor(props) {
      super(props);
      this.handleSelection = this.handleSelection.bind(this);
    }

    decodeText(text) {
      let textElem = document.createElement('textarea');
      textElem.innerHTML = text;
      return textElem.value;
    }

    handleSelection(answer) {
      this.props.onAnswerSelection(answer);
    }

    render() {
        const { category, question, type, correct_answer, incorrect_answers } = this.props.question;
        let selections = [correct_answer, ...incorrect_answers].sort(() => Math.random() - 0.5)

        if (type !== 'multiple') {
          selections = ['True', 'False'];
        }

        return (
          <div className="question__container">
            <div className="question__content">
              <h3>{ category }</h3>
              <p>{ this.decodeText(question) }</p>
                {selections.map((selection, index) => (
                  <button key={ index } onClick={ () => this.handleSelection(selection) }>
                    { this.decodeText(selection) }
                  </button>
                ))}
            </div>
          </div>
        )
    }
}

export default QuestionCardComponent;