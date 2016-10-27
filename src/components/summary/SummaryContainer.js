import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import PreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import NextIcon from 'material-ui/svg-icons/av/skip-next';

import base from '../../base';
import Chart from '../Chart';
import { getPieOptions } from '../../utils/chartHelper';

class SummaryContainer extends React.Component {
  constructor() {
    super();

    this.goPreviousMonth = this.goPreviousMonth.bind(this);
    this.goNextMonth = this.goNextMonth.bind(this);
    this.getFirebaseEndpoint = this.getFirebaseEndpoint.bind(this);
    this.getSummaryData = this.getSummaryData.bind(this);
    this.handleResize = this.handleResize.bind(this);

    const now = moment().format('YYYY-MM');
    this.state = {
      month: now
    };
  }

  componentDidMount() {
    this.getSummaryData(this.state.month);

    // add listener to browser window resize
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    // remove listener to browser window resize
    window.removeEventListener("resize", this.handleResize);
  }

  getFirebaseEndpoint(month) {
    let endpoint = `users/${this.props.uid}/summary`;
    if (month !== undefined) {
      endpoint += `/${month}`;
    }
    return endpoint;
  }

  getSummaryData(month) {
    base
      .fetch(this.getFirebaseEndpoint(month), {
        context: this,
        isArray: true
      })
      .then((summaryData) => {
        const newSummaryData = [...summaryData];
        _.remove(newSummaryData, item => item.name === 'Income');
        const pieOptions = getPieOptions(month, newSummaryData);
        this.setState({
          month
        });
        const element = React.createElement(Chart, { container: 'summary-chart', options: pieOptions });
        ReactDOM.render(element, document.getElementById('summary-chart'));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleResize() {
    ReactDOM.unmountComponentAtNode(document.getElementById('summary-chart'));
    this.getSummaryData(this.state.month);
  }

  goPreviousMonth() {
    const previousMonth = moment(`${this.state.month}-01`).subtract(1, 'M').format('YYYY-MM');
    this.getSummaryData(previousMonth);
  }

  goNextMonth() {
    const nextMonth = moment(`${this.state.month}-01`).add(1, 'M').format('YYYY-MM');
    this.getSummaryData(nextMonth);
  }

  render() {
    return (
      <div className="summary-container">
        <Toolbar className="summary-container-toolbar">
          <ToolbarGroup>
            <RaisedButton
              label="Previous Month"
              primary
              labelPosition="after"
              icon={<PreviousIcon />}
              onTouchTap={this.goPreviousMonth}
            />
            <ToolbarTitle text={this.state.month} />
            <RaisedButton
              label="Next Month"
              primary
              labelPosition="before"
              icon={<NextIcon />}
              disabled={moment(`${this.state.month}-01`).add(1, 'M').unix() > moment().unix()}
              onTouchTap={this.goNextMonth}
            />
          </ToolbarGroup>
        </Toolbar>
        <div className="summary-container-graph-wrapper" id="summary-chart" />
      </div>
    );
  }
}

SummaryContainer.propTypes = {
  uid: React.PropTypes.string
};

export default SummaryContainer;
