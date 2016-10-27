import React from 'react';
import Highcharts from 'highcharts';
import _ from 'lodash';

class Chart extends React.Component {
  // When the DOM is ready, create the chart.
  componentDidMount() {
      // Extend Highcharts with modules
    if (this.props.modules) {
      _.forEach(this.props.modules, module => module(Highcharts));
    }
    // Set container which the chart should render to.
    this.chart = new Highcharts.Chart(
      this.props.container,
      this.props.options
    );
  }

  // Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  }

  // Create the div which the chart will be rendered to.
  render() {
    return React.createElement('div', { id: this.props.container });
  }
}

export default Chart;
