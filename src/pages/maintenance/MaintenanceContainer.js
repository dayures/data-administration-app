import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { orange500 } from 'material-ui/styles/colors';

// d2
import { getInstance } from 'd2/lib/d2';

// App configs
import { maintenanceCheckboxes, RESOURCE_TABLES_OPTION_KEY } from './maintenance.conf';

import styles from './Maintenance.css';

class MaintenanceContainer extends Component {
    static propTypes = {
        t: PropTypes.func.isRequired,
        toggleLoading: PropTypes.func.isRequired,
    }

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < maintenanceCheckboxes.length; i++) {
            const checkbox = maintenanceCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        this.state = {
            checkAll: false,
            checkboxes,
        };

        this.performMaintenance = this.performMaintenance.bind(this);
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
    }

    toggleCheckAll() {
        const checked = !this.state.checkAll;

        const checkboxes = {};
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            checkboxes[key] = { checked };
        }

        this.setState({
            checkAll: checked,
            checkboxes,
        });
    }

    performMaintenance() {
        this.props.toggleLoading();
        const checkboxKeys = Object.keys(this.state.checkboxes);
        const formData = new FormData();

        let optionsSelected = 0;
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            const checked = this.state.checkboxes[key].checked;
            if (key !== RESOURCE_TABLES_OPTION_KEY && checked) {
                optionsSelected += 1;
                formData.append(key, checked);
            }
        }

        const requests = [];
        // FIX ME perform concurrent request. Similar to all in axios
        if (optionsSelected > 0) {
            const request = getInstance().then((d2) => {
                const api = d2.Api.getApi();
                api.post('maintenance', formData).then(() => {
                    this.props.toggleLoading();
                }).catch(() => {
                    this.props.toggleLoading();
                });
            });
            requests.push(request);
        }

        // resource table option is checked. It is treated differently
        if (this.state.checkboxes[RESOURCE_TABLES_OPTION_KEY].checked) {
            const request = getInstance().then((d2) => {
                const api = d2.Api.getApi();
                api.update('resourceTables').then(() => {

                }).catch(() => {

                });
            });
            requests.push(request);
        }
    }

    render() {
        const t = this.props.t;
        const checkboxes = this.state.checkboxes;
        const gridElements = maintenanceCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            const toggleCheckbox = (() => {
                const checked = !checkboxState;
                checkboxes[checkbox.key].checked = !checkboxState;
                this.setState({ checkboxes });

                if (checkbox.key === RESOURCE_TABLES_OPTION_KEY) {
                    this.isResourceTableSelected = checked;
                }
            });
            return (
                <GridTile key={checkbox.key}>
                    <Checkbox
                        label={t(checkbox.label)}
                        checked={checkboxState}
                        onCheck={toggleCheckbox}
                    />
                </GridTile>
            );
        });

        return (
            <div>
                <Checkbox
                    id="maintenance-check-all"
                    className={styles.maintenanceCheckAll}
                    checked={this.state.checkAll}
                    onCheck={this.toggleCheckAll}
                />
                <GridList
                    className={styles.maintenanceGridContainer}
                    cellHeight="auto"
                    cols={3}
                    padding={16}
                >
                    {gridElements}
                </GridList>
                <FlatButton
                    className={styles.maintenanceActionButton}
                    backgroundColor={orange500}
                    label={t('PERFORM MAINTENANCE')}
                    onClick={this.performMaintenance}
                />
            </div>
        );
    }
}

export default MaintenanceContainer;