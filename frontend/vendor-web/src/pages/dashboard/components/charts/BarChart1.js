import React, { Component } from "react";
import Chart from "react-apexcharts";

class ColumnChart1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData,
      chartOptions: props.chartOptions,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chartData !== this.props.chartData || prevProps.chartOptions !== this.props.chartOptions) {
      this.setState({
        chartData: this.props.chartData,
        chartOptions: this.props.chartOptions,
      });
    }
  }

  render() {
    return (
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '1000px' }}>
          <Chart
            options={this.state.chartOptions}
            series={this.state.chartData}
            type="bar"
            height={340}
          />
        </div>
      </div>
    );
  }
}

export default ColumnChart1;
