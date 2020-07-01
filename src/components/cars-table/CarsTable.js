import React from "react";
import {DELETE_CAR, GET_CARS} from '../../utils/constants'
import style from './cars-table.css'

class CarsTable extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            tableRows: [],
            total: 0,
            isLoading: true,
            currentPage: 1,
            currentSortId: 'CarId',
            sortDirection: true, // true - ASC, false - DESC
            callback: props.callback
        };

        this.getCars = this.getCars.bind(this);
        this.onHeadClick = this.onHeadClick.bind(this);
        this.onPrevPage = this.onPrevPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
    }

    componentDidMount() {
        this.getCars(1,  'CarId', true);
    }

    onHeadClick(event) {
        let id = event.currentTarget.id;
        this.setState((prevState) => {
            if (prevState.currentSortId === id) {
                this.getCars(this.state.currentPage, prevState.currentSortId, !prevState.sortDirection);
                return {
                    sortDirection: !prevState.sortDirection
                };
            } else {
                this.getCars(this.state.currentPage, id, true);
                return {
                    currentSortId: id,
                    sortDirection: true
                };
            }
        });
    }

    onNextPage() {
        this.setState((prevState) => {
            this.getCars(prevState.currentPage + 1, prevState.currentSortId, prevState.sortDirection);
            return {
                currentPage: prevState.currentPage + 1
            }
        });
    }

    onPrevPage() {
        this.setState((prevState) => {
            this.getCars(prevState.currentPage - 1, prevState.currentSortId, prevState.sortDirection);
            return {
                currentPage: prevState.currentPage - 1
            }
        });
    }

    getCars(page, currentSortId, sortDirection) {
        // setTimeout required for imitate long loading, just waiting for a 1 second
        setTimeout(() => {
            fetch(GET_CARS + `?sortBy=${currentSortId}&sort=${sortDirection ? 'asc' : 'desc'}&page=${page}`)
                .then(response => response.json())
                .then( response =>
                    this.setState((prevState) => {
                        return {
                            tableRows: response['Page'],
                            isLoading: false,
                            total: response['PageCount']
                        }
                    })
                );
        }, 1000);
    }

    delete(id) {
        fetch(DELETE_CAR + `${id}`, {
            method: 'Delete'
        }).then(
            r => window.location.reload()
        );
    }

    updateTable() {
        let table = [];
        let rows = this.state.tableRows;
        let attrs = ['CarId', 'Model', 'Year', 'VIN'];
        for (let i = 0; i < rows.length; i++) {
            let children = [];
            for (let j in attrs) {
                if (rows[i].hasOwnProperty(attrs[j])) {
                    children.push(<td className="cars-table-td" key={j.toString() + i.toString()}>{`${rows[i][attrs[j]].toString()}`}</td>)
                }
            }
            children.push(
                <td className="cars-table-td" key={rows[i]['CarId']}>
                    <button
                        type="button"
                        className="btn-edit"
                        onClick={() => this.state.callback({
                            'CarId': rows[i]['CarId'],
                            'Model': rows[i]['Model'],
                            'Year': rows[i]['Year'],
                            'VIN': rows[i]['VIN']
                        })}>
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn-delete"
                        onClick={() => this.delete(rows[i]['CarId'])}
                    >Delete</button>
                </td>);
            table.push(<tr key={rows[i]['CarId']}>{children}</tr>)
        }
        return table;
    }

    render() {
        return (
            <div>
                <button onClick={this.state.callback} type="button" className="btn-add">Add car</button>
                <table className="cars-table">
                    <thead className="cars-table-header">
                        <tr>
                            <th onClick={this.onHeadClick} id="CarId" className="cars-table-th">
                                CarId
                                <span hidden={!(this.state.currentSortId == 'CarId')}>{this.state.sortDirection ? '▲' : '▼'}</span>
                            </th>
                            <th onClick={this.onHeadClick} id="Model" className="cars-table-th">
                                Model
                                <span hidden={!(this.state.currentSortId == 'Model')}>{this.state.sortDirection ? '▲' : '▼'}</span>
                            </th>
                            <th onClick={this.onHeadClick} id="Year" className="cars-table-th">
                                Year
                                <span hidden={!(this.state.currentSortId == 'Year')}>{this.state.sortDirection ? '▲' : '▼'}</span>
                            </th>
                            <th onClick={this.onHeadClick} id="VIN" className="cars-table-th">
                                VIN
                                <span hidden={!(this.state.currentSortId == 'VIN')}>{this.state.sortDirection ? '▲' : '▼'}</span>
                            </th>
                            <th className="cars-table-th">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody hidden={this.state.isLoading}>
                        {this.updateTable()}
                    </tbody>
                </table>
                <div hidden={!this.state.isLoading}>
                    Loading...
                </div>
                <div className="paginated-panel">
                    <div className="paginated-panel-buttons">
                        <button
                            onClick={this.onPrevPage}
                            type="button"
                            className="btn-paginate"
                            disabled={this.state.currentPage > 1 ? null : 'disabled'}>
                            &#x3c;
                        </button>
                        <button
                            onClick={this.onNextPage}
                            type="button"
                            className="btn-paginate"
                            disabled={this.state.currentPage >= this.state.total ? 'disabled' : null}>
                            &#x3e;
                        </button>
                    </div>
                    <div className="text-info">
                        Total pages: {this.state.total},  Current page: {this.state.currentPage}
                    </div>
                </div>
            </div>
        );
    }

}

export default CarsTable;
