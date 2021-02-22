import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module from "../model/Module";
import PageProps from "./page-props";
import line from "simple-line-chart";
import Chart from 'chart.js';


class DailySummary extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
        this.newDateValue = this.newDateValue.bind(this);
        this.getLineChart = this.getLineChart.bind(this);
        this.getHexColor = this.getHexColor.bind(this);
    }

    async componentDidMount() {

        if (this.props.appState.userName === '' || this.props.appState.date === '') {
            this.props.history.push('/main');
            return;
        }
        //load timestamps from server
        console.log('DailySummary.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({ modules: this.props.appState.modules });

        const searchDate = new Date(this.props.appState.date);
        const datasets = this.props.appState.getModulesAsList().map((val, ind, arr) => {
            const yValues = [];
            const label = val.name;
            let values = new Map<string, number>();
            const timeStamps = val.timeStamps;
            timeStamps.forEach((ts, ind, timestamps) => {

                const date = new Date(ts.date);
                if (searchDate.getUTCFullYear() === date.getUTCFullYear()
                    && searchDate.getUTCMonth() === date.getUTCMonth()
                    && searchDate.getUTCDay() === date.getUTCDay()) {

                    //for each hour
                    date.setUTCMilliseconds(0);
                    date.setUTCSeconds(0);
                    date.setUTCMinutes(0);

                    let tmp = values.get(date.toISOString());
                    if (!tmp) {
                        values.set(date.toISOString(), ts.recordedTime);
                        return;
                    }
                    values.set(date.toISOString(), tmp + ts.recordedTime);

                }
            });
            for (let i = 0; i < 24; i++) {
                searchDate.setUTCHours(i);
                const currentDateString = searchDate.toISOString();
                const currentValue = values.get(currentDateString);
                if (!currentValue) {
                    yValues.push(0);
                    continue;
                }
                yValues.push(currentValue / 60);
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
        for (let i = 0; i < 24; i++) {
            /*searchDate.setUTCHours(i);
            const currentDateString = searchDate.toISOString();
            xValues.push(currentDateString);*/
            xValues.push(`${i}h`);
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
                    text: 'Working time per module (in minutes)'
                }
            }
        });
        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.global.responsive = false;
    }

    getHexColor(color: string) {
        switch (color) {
            case 'blue': return '#3e95cd';
            case 'red': return '#ff2d00';
            default: return '#000000';
        }
    }

    getLineChart(id: string) {
        let data = new Map<string, number>();
        /*for (let mod of this.props.appState.getModulesAsList()){
            for (let ts of mod.timeStamps){
                const date = ts.date;
                let tmp = data.get(date);
                if (!tmp){
                    data.set(date, ts.recordedTime);
                } else {
                    data.set(date, tmp+ts.recordedTime);
                }
            }
        }*/
        const module = this.props.appState.getFromModules(id);

        module!.timeStamps.forEach((val, ind, arr) => {
            const date = val.date;
            let tmp = data.get(date);
            if (!tmp) {
                data.set(date, val.recordedTime);
            } else {
                data.set(date, tmp + val.recordedTime);
            }
        });

        let resData: [x: number, y: number][] = [];
        data.forEach((val, key, map) => resData.push([this.newDateValue(key), val]))
        console.log(`Data: ${JSON.stringify(resData, null, 2)}`);
        line({
            canvas: document.querySelector("canvas")!,
            data: resData
        });
    }

    newDateValue(date: string) {
        const day = date.substring(0, 2);
        const month = date.substring(3, 5);
        const year = date.substring(6, 10);
        const dateobj = new Date(`${year}-${month}-${day}T00:00:00.000Z`); // ISO FORMAT
        return dateobj.valueOf();
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
                    Daily Summary for {this.props.appState.date.substring(0,10)}
                </div>

                <div>
                    <span>Module name</span>
                    <span>time</span>
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
                                    && tsDate.getUTCDay() == searchDate.getUTCDay()
                            }).forEach((val, ind, arr) => {
                                sum += val.recordedTime;
                            })
                            sum /= 60;
                            return (
                                <div key={module.id} onClick={() => this.getLineChart(module.id)}>
                                    <span>{module.name || '?'}</span>
                                    <span>{sum.toFixed(1)}min</span>
                                </div>
                            );
                        })
                }

                <canvas id="myChart" width="1000" height="400"></canvas>
            </div>
        );
    }
}

export default withRouter(DailySummary)