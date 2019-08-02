import React from 'react';

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

    handleSelection(selection) {
      const { correct_answer} = this.props.question;
      let isCorrect = false;

      if(selection === correct_answer) {
        isCorrect = true;
      }

      this.props.onAnswerSelection(isCorrect);
    }

    render() {
        const { question, type, correct_answer, incorrect_answers } = this.props.question;
        let selections = [correct_answer, ...incorrect_answers].sort(() => Math.random() - 0.5)

        if (type !== 'multiple') {
          selections = ['True', 'False'];
        }

        return (
          <div>
            <p>{ this.decodeText(question) }</p>
            <ul>
              {selections.map((selection, index) => (
                <li key={ index }>
                  <button onClick={ () => this.handleSelection(selection) }>
                    { this.decodeText(selection) }
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
    }
}

export default QuestionCardComponent;