import React from "react";
import Point from "./Point";

class App extends React.Component {
  state: {
    points: [],
    results: {
      defeats: 0,
      draws: 0,
      victories: 0
    },
    distanceX: 0.5,
    distanceY: 0.8,
    zeroY: 40,
    refresh: false
  };

  addPoint = variation => event => {
    event.preventDefault();
    const points = this.state.points;
    const newPoint = {
      id: points[points.length - 1].id + 1,
      fixedId: points.length,
      left: points[0].left + points.length * this.state.distanceX,
      top: points[points.length - 1].top - variation * this.state.distanceY,
      color: "ff0000"
    };
    points.push(newPoint);

    this.setState(
      {
        points
      },
      function() {
        localStorage.setItem("menace_state", JSON.stringify(this.state));
      }
    );

    const results = this.state.results;
    switch (variation) {
      case -1:
        results.defeats = results.defeats + 1;
        break;
      case 1:
        results.draws = results.draws + 1;
        break;
      case 3:
        results.victories = results.victories + 1;
        break;
      default:
        break;
    }
    this.setState({
      results
    });
    if (newPoint.left >= 40) {
      this.adjustSize("x");
    }

    if (newPoint.top >= 55 || newPoint.top < 0) {
      this.adjustSize("y");
    }
  };

  adjustSize = axis => {
    var variationX = 1;
    var variationY = 1;

    switch (axis) {
      case "x":
        var distanceX = this.state.distanceX;
        distanceX = distanceX * 0.9;
        this.setState({
          distanceX
        });
        variationX = 0.9;
        break;
      case "y":
        var distanceY = this.state.distanceY;
        distanceY = distanceY * 0.9;
        this.setState({
          distanceY
        });
        variationY = 0.9;
        break;
    }

    const points = this.state.points;
    points.forEach(
      function(point, index) {
        point.left = point.left * variationX;
        point.top =
          this.state.zeroY + (point.top - this.state.zeroY) * variationY;
      }.bind(this)
    );

    this.setState(
      {
        points
      },
      function() {
        this.refresh();
      }
    );
  };

  rotateColor = event => {
    event.preventDefault();
    var points = this.state.points;
    if (points[this.state.points.length - 1].color == "ff0000") {
      points[this.state.points.length - 1].color = "00ff00";
    } else if (points[this.state.points.length - 1].color == "00ff00") {
      points[this.state.points.length - 1].color = "0000ff";
    } else {
      points[this.state.points.length - 1].color = "ff0000";
    }

    this.setState({ points }, function() {
      localStorage.setItem("menace_state", JSON.stringify(this.state));
      this.refresh();
    });
  };

  refresh = () => {
    var points = this.state.points;
    points.forEach(
      function(point, index) {
        point.id = point.id + points.length;
      }.bind(this)
    );

    this.setState({
      points
    });
  };

  componentDidMount() {
    var dummyPoint = {
      id: 0,
      left: 0,
      top: 40,
      color: "ffffff"
    };
    const points = [];
    points.push(dummyPoint);
    this.setState({
      points
    });

    const results = {
      defeats: 0,
      draws: 0,
      victories: 0
    };

    this.setState({
      results
    });

    const distanceX = 0.5;
    this.setState({
      distanceX
    });
    const distanceY = 0.8;
    this.setState({
      distanceY
    });
    const zeroY = 40;
    this.setState({
      zeroY
    });
    const refresh = false;
    this.setState({
      refresh
    });

    const previous = JSON.parse(localStorage.getItem("menace_state"));
    if (previous) {
      this.setState(previous);
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <div className="content">
            <div className="graph-background">
              <div className="xaxis" />
              <div className="yaxis" />
              <div className="yaxislabel">
                Variación de cuentas en la primera caja
              </div>
              <div className="xaxislabel">Cantidad de partidas</div>
              {this.state && this.state.distanceX && (
                <>
                  <div className="label label1">
                    {Math.round(5 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label2">
                    {Math.round(10 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label3">
                    {Math.round(15 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label4">
                    {Math.round(20 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label5">
                    {Math.round(25 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label6">
                    {Math.round(30 * (1 / this.state.distanceX))}
                  </div>
                  <div className="label label7">
                    {Math.round(35 * (1 / this.state.distanceX))}
                  </div>
                </>
              )}
              {this.state && this.state.points && (
                <>
                  {this.state.points.map(obj => {
                    return (
                      <Point
                        id={obj.id}
                        color={obj.color}
                        left={obj.left}
                        top={obj.top}
                        key={obj.id}
                      />
                    );
                  })}
                </>
              )}
            </div>
            {this.state && this.state.results && (
              <>
                <p className="result derrotas strong">
                  <span onClick={this.addPoint(-1)}>
                    <a href="#">{this.state.results.defeats}</a>
                  </span>
                </p>
                <p className="result empates strong">
                  <span onClick={this.addPoint(1)}>
                    <a href="#">{this.state.results.draws}</a>
                  </span>
                </p>
                <p className="result victorias strong">
                  <span onClick={this.addPoint(3)}>
                    <a href="#">{this.state.results.victories}</a>
                  </span>
                </p>
              </>
            )}
            <div onClick={this.rotateColor} className="colorButton" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
