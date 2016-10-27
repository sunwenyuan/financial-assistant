import moment from 'moment';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import PreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import NextIcon from 'material-ui/svg-icons/av/skip-next';

import base from '../../base';
import Chart from '../Chart';
import { getColumnOptions } from '../../utils/chartHelper';

class TrendContainer extends React.Component {
  constructor() {
    super();

    this.getFirebaseSummaryEndpoint = this.getFirebaseSummaryEndpoint.bind(this);
    this.getFirebaseCategoryEndpoint = this.getFirebaseCategoryEndpoint.bind(this);
    this.goPreviousCategory = this.goPreviousCategory.bind(this);
    this.goNextCategory = this.goNextCategory.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.handleResize = this.handleResize.bind(this);

    const now = moment().format('YYYY-MM');
    this.months = [];
    for (let i = 12; i > 0; i -= 1) {
      this.months.push(moment(`${now}-01`).subtract(i, 'M').format('YYYY-MM'));
    }
    this.months.push(now);

    this.summaryData = [];
    this.categories = [];

    this.state = {
      currentCategoryIndex: 0
    };
  }

  componentDidMount() {
    // get category data
    base
      .fetch(this.getFirebaseCategoryEndpoint(), {
        context: this,
        isArray: true
      })
      .then((categories) => {
        const newCategories = [...categories];
        newCategories.push('Other');
        this.categories = newCategories;

        // get summary data
        base
          .fetch(this.getFirebaseSummaryEndpoint(), {
            context: this
          })
          .then((summaryData) => {
            this.summaryData = summaryData;
            this.renderChart(0);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // add listener to browser window resize
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    // remove listener to browser window resize
    window.removeEventListener("resize", this.handleResize);
  }

  getFirebaseCategoryEndpoint() {
    return `users/${this.props.uid}/categories`;
  }

  getFirebaseSummaryEndpoint() {
    return `users/${this.props.uid}/summary`;
  }

  goPreviousCategory() {
    if (this.state.currentCategoryIndex > 0) {
      const index = this.state.currentCategoryIndex - 1;
      this.renderChart(index);
    }
  }

  goNextCategory() {
    if (this.state.currentCategoryIndex < this.categories.length - 1) {
      const index = this.state.currentCategoryIndex + 1;
      this.renderChart(index);
    }
  }

  handleResize() {
    ReactDOM.unmountComponentAtNode(document.getElementById('trend-chart-container'));
    this.renderChart(this.state.currentCategoryIndex);
  }

  renderChart(currentCategoryIndex) {
    const data = [];
    const category = this.categories[currentCategoryIndex];

    _.forEach(this.months, (month) => {
      if (this.summaryData[month] === undefined) {
        data.push(0);
      } else {
        const summaryDataForOneMonth = this.summaryData[month];
        const match = _.find(summaryDataForOneMonth, item => item.name === category);
        if (match === undefined) {
          data.push(0);
        } else {
          data.push(new BigNumber(match.y).toNumber());
        }
      }
    });
    const series = [{
      name: category,
      data
    }];

    this.setState({
      currentCategoryIndex
    });

    const columnOptions = getColumnOptions(category, this.months, series);
    const element = React.createElement(Chart, { container: 'trend-chart-container', options: columnOptions });
    ReactDOM.render(element, document.getElementById('trend-chart-container'));
  }

  render() {
    return (
      <div className="trend-container">
        <Toolbar className="trend-container-toolbar">
          <ToolbarGroup>
            <RaisedButton
              label="Previous Category"
              primary
              labelPosition="after"
              icon={<PreviousIcon />}
              disabled={this.state.currentCategoryIndex === 0}
              onTouchTap={this.goPreviousCategory}
            />
            <ToolbarTitle text={this.categories[this.state.currentCategoryIndex]} />
            <RaisedButton
              label="Next Category"
              primary
              labelPosition="before"
              icon={<NextIcon />}
              disabled={this.state.currentCategoryIndex === this.categories.length - 1}
              onTouchTap={this.goNextCategory}
            />
          </ToolbarGroup>
        </Toolbar>
        <div className="trend-container-chart-wrapper" id="trend-chart-container" />
      </div>
    );
  }
}

TrendContainer.propTypes = {
  uid: React.PropTypes.string
};

export default TrendContainer;
