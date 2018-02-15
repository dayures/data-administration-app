import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, FontIcon } from 'material-ui';
import classNames from 'classnames';

import styles from './FeedbackSnackbarBody.css';

import { ERROR, LOADING, SUCCESS } from '../SnackbarTypes';

class FeedbackSnackbarBody extends PureComponent {
    static propTypes = {
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
    };

    render() {
        const translator = this.context.t;
        let icon;
        switch (this.props.type) {
        case SUCCESS:
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    done
                </FontIcon>
            );
            break;
        case LOADING:
            icon = <CircularProgress className={styles.icon} color={'#ffffff'} size={28} thickness={2} />;
            break;
        case ERROR:
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    error
                </FontIcon>
            );
            break;
        default:
            icon = (
                <FontIcon className={classNames('material-icons', styles.icon)}>
                    warning
                </FontIcon>
            );
            break;
        }
        const snackBarContent = (
            <div className={styles.content}>
                <div>
                    {translator(this.props.message)}
                </div>
                {icon}
            </div>
        );
        return (
            snackBarContent
        );
    }
}

export default FeedbackSnackbarBody;