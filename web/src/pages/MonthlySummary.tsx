import Chart from "chart.js";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module from "../model/Module";
import PageProps from "./page-props";


class MonthlySummary extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
    }

    async componentDidMount() {

        if (this.props.appState.userName === '' || this.props.appState.date === '') {
            this.props.history.push('/main');
            return;
        }
        //load products from server
        console.log('DailySummary.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({ modules: this.props.appState.modules });

        let searchDate = new Date(this.props.appState.date);
        searchDate.setUTCDate(1);
        let maxDays = searchDate.getUTCMonth() % 2 ? 31 : 32;
        if (searchDate.getUTCMonth() === 2) maxDays = 29;
        const datasets = this.props.appState.getModulesAsList().map((val, ind, arr) => {
            const yValues = [];
            const label = val.name;
            let values = new Map<string, number>();
            const timeStamps = val.timeStamps;
            timeStamps.forEach((ts, ind, timestamps) => {
                searchDate = new Date(this.props.appState.date);
                const date = new Date(ts.date);
                if (searchDate.getUTCFullYear() === date.getUTCFullYear()
                    && searchDate.getUTCMonth() === date.getUTCMonth()) {

                    //for each day
                    date.setUTCMilliseconds(0);
                    date.setUTCSeconds(0);
                    date.setUTCMinutes(0);
                    date.setUTCHours(0);

                    let tmp = values.get(date.toISOString());
                    if (!tmp) {
                        values.set(date.toISOString(), ts.recordedTime);
                        return;
                    }
                    values.set(date.toISOString(), tmp + ts.recordedTime);

                }
            });

            for (let i = 1; i < maxDays; i++) {
                searchDate.setUTCDate(i);
                const currentDateString = searchDate.toISOString();
                const currentValue = values.get(currentDateString);
                if (!currentValue) {
                    yValues.push(0);
                    continue;
                }
                yValues.push(currentValue / 60 / 60);
            }

            const dataset = {
                label: label,
                data: yValues,
                borderColor: this.getHexColor(val.buttonID),
                fill: false
            }

            return dataset;
        });

        const xValues = [];
        for (let i = 1; i < maxDays; i++) {
            /*searchDate.setUTCHours(i);
            const currentDateString = searchDate.toISOString();
            xValues.push(currentDateString);*/
            xValues.push(`day ${i}`);
        }

        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.global.responsive = false;
        var ctx: any = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: datasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Working time per module (in hours)'
                },
                responsive: true
            }
        });
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.global.responsive = false;
    }

    getHexColor(color: string) {
        switch (color) {
            case 'blue': return '#3e95cd';
            case 'red': return '#ff2d00';
            case 'yellow': return '#fbff00';
            case 'green': return '#2efe2e';
            default: return '#000000';
        }
    }

    render() {
        return (
            <div className="App">
                <div>
                    <Link to="/main">
                        <button id="mainButton">Main</button>
                    </Link>
                </div>
                <div>
                    <h1>Monthly Summary for {this.props.appState.date.substring(5, 7)}</h1>
                </div>
                <hr></hr>
                <div>
                    <span><h2>Module name</h2></span>
                    <span><h2>time</h2></span>
                </div>

                {
                    this.props.appState.userName === '' && this.props.appState.date === '' ? null :
                        this.props.appState.getModulesAsList().map((module) => {
                            let sum = 0.0;
                            module.timeStamps.filter((ts) => {
                                const tsDate = new Date(ts.date);
                                const searchDate = new Date(this.props.appState.date);
                                return tsDate.getUTCFullYear() === searchDate.getUTCFullYear()
                                    && tsDate.getUTCMonth() === searchDate.getUTCMonth()
                            }).forEach((val, ind, arr) => {
                                sum += val.recordedTime;
                            })
                            sum /= 60;
                            sum /= 60;
                            return (
                                <div key={module.id} className="SpanSurrounder">
                                    <span>{module.name || '?'}</span>
                                    <span>{sum.toFixed(1)}hours</span>
                                </div>
                            );
                        })
                }
                <hr></hr>
                <div className="chart-container" style={{ position: 'relative', height: '50vh', width: '80vw', marginLeft: 'auto', marginRight: 'auto' }}>
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        );
    }
}

export default withRouter(MonthlySummary)