import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { fetchMineRecordById, updateMineRecord, fetchStatusOptions } from '@/actionCreators/mineActionCreator';
import { getMines, getCurrentPermitteeIds, getCurrentPermittees, getMineStatusOptions } from '@/selectors/mineSelectors';
import MineTenureInfo from '@/components/mine/TenureTab/MineTenureInfo';
import MineSummary from '@/components/mine/SummaryTab/MineSummary';
import MineHeader from '@/components/mine/MineHeader';
import MineContactInfo from '@/components/mine/ContactTab/MineContactInfo';
import MinePermitInfo from '@/components/mine/PermitTab/MinePermitInfo';
import Loading from '@/components/common/Loading';
import NullScreen from '@/components/common/NullScreen';

/**
 * @class MineDashboard.js is an individual mines dashboard, gets Mine data from redux and passes into children.
 */
const TabPane = Tabs.TabPane;

const propTypes = {
  fetchMineRecordById: PropTypes.func.isRequired,
  updateMineRecord: PropTypes.func,
  fetchStatusOptions: PropTypes.func.isRequired,
  mines: PropTypes.object,
  mineIds: PropTypes.array,
  permittees: PropTypes.object,
  permitteesIds: PropTypes.array,
  mineStatusOptions: PropTypes.array
};

const defaultProps = {
  mines: {},
};

export class MineDashboard extends Component {

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchMineRecordById(id);
    this.props.fetchStatusOptions();
  }
  render() {
    const { id } = this.props.match.params;
    const mine = this.props.mines[id];
    const { permittees, permitteeIds } = this.props;
    if (!mine) {
      return(<Loading />)
    } else {
        return (
          <div className="dashboard">
            <div>
              <MineHeader mine={mine} {...this.props}/>
            </div>
            <div className="dashboard__content">
              <Tabs
                defaultActiveKey="1"
                size='large'
                animated={{ inkBar: true, tabPane: false }}
              >
                <TabPane tab="Summary" key="1">
                  <MineSummary mine={mine} permittees={permittees} permitteeIds={permitteeIds}/>
                </TabPane>
                <TabPane tab="Permit" key="2">
                  <MinePermitInfo mine={mine} />
                </TabPane>
                <TabPane tab="Contact Information" key="3">
                  <MineContactInfo mine={mine} />
                </TabPane>
                <TabPane tab="Compliance" key="4">
                  <NullScreen type="generic" />
                </TabPane>
                <TabPane tab="Tenure" key="5">
                  <MineTenureInfo mine={mine} {...this.props}/>
                </TabPane>
              </Tabs>
            </div>
          </div>
        );
      }
    }
  }

const mapStateToProps = (state) => {
  return {
    mines: getMines(state),
    permittees: getCurrentPermittees(state),
    permitteeIds: getCurrentPermitteeIds(state),
    mineStatusOptions: getMineStatusOptions(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchMineRecordById,
    fetchStatusOptions,
    updateMineRecord
  }, dispatch);
};


MineDashboard.propTypes = propTypes;
MineDashboard.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(MineDashboard);