import React from 'react';

import * as conf from './data.integrity.conf';

import Page from '../Page';
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard';

class DataIntegrity extends Page {
    constructor(props, context) {
        super(props, context);
        this.state.cards = this.state.cards || {};
    }

    componentDidMount() {
        if (!this.context.loading && !this.context.pageState) {
            this.initDataIntegrityCheck();
        }
    }

    componentWillUnmount() {
        if (this.context && this.context.pageState) {
            clearTimeout(this.context.pageState.timeoutId);
        }
    }

    startRequestTaskStatusTimeout() {
        return setTimeout(() => { this.requestTaskStatus(); }, conf.PULL_INTERVAL);
    }

    initDataIntegrityCheck() {
        const api = this.context.d2.Api.getApi();
        this.context.updateAppState({
            loading: true,
            currentSection: this.props.sectionKey,
            pageState: {
                loaded: false,
            },
        });

        api.post(conf.INIT_ENDPOINT).then(() => {
            this.context.updateAppState({
                loading: true,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: true,
                    timeoutId: this.startRequestTaskStatusTimeout(),
                },
            });
        }).catch(() => {
            // TODO show error
            this.context.updateAppState({
                loading: false,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: true,
                },
            });
        });
    }

    requestTaskStatus() {
        const api = this.context.d2.Api.getApi();
        api.get(conf.PULL_ENDPOINT).then((response) => {
            if (!response.length) {
                this.context.updateAppState({
                    loading: true,
                    currentSection: this.props.sectionKey,
                    pageState: {
                        loaded: false,
                        timeoutId: this.startRequestTaskStatusTimeout(),
                    },
                });
            } else {
                this.loadData();
                this.context.updateAppState({
                    loading: false,
                    currentSection: this.props.sectionKey,
                    pageState: {
                        loaded: true,
                    },
                });
            }
        }).catch(() => {
            // console.log('ERROR', e);
        });
    }

    loadData() {
        const api = this.context.d2.Api.getApi();
        api.get(conf.DATA_ENDPOINT).then((response) => {
            this.context.updateAppState({
                loading: false,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: true,
                    cards: response,
                },
            });
        }).catch(() => {
            // console.log('ERROR', e);
        });
    }

    render() {
        const keys = Object.keys(this.state.cards);
        const cardsToShow = [];
        for (let i = 0; i < keys.length; i++) {
            cardsToShow.push(
                <DataIntegrityCard
                    key={keys[i]}
                    title={
                        conf.dataIntegrityControls.find(
                            control => control.key === keys[i]).label
                    }
                    content={this.state.cards[keys[i]]}
                />,
            );
        }
        return (
            <div className="page-wrapper">
                <h1>{ this.context.t('Data Integrity') }</h1>
                {cardsToShow}
            </div>
        );
    }
}

export default DataIntegrity;
