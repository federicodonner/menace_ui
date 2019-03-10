import React from "react";

class Point extends React.Component {
  state: {
    details: {}
  };

  componentDidMount() {
    const details = {
      backgroundColor: "#" + this.props.color,
      left: this.props.left + "vw",
      top: this.props.top + "vh",
      key: this.props.id
    };
    this.setState({
      details
    });
  }

  render() {
    return (
      <>
        {this.state && (
          <div
            className="point"
            style={this.state.details}
            key={this.state.key}
          />
        )}
      </>
    );
  }
}

export default Point;
