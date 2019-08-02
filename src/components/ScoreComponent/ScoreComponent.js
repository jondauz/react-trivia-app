import React from 'react';
import './ScoreComponent.scss';

class ScoreComponent extends React.Component {
    render() {
        return (
            <div className="score__container">
                Score: { this.props.score }
            </div>
        )
    }
}

export default ScoreComponent;