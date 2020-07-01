import React, {useState} from "react";
import style from './add-car-form.css'
import {POST_CAR, UPDATE_CAR} from "../../utils/constants";

class AddCarForm extends React.Component {

    passRegExp = /([a-zA-Z]+\d+.*)|(.*\d+[a-zA-Z]+)/;

    constructor(props) {
        super(props);

        this.state = {
            validated: false,
            isVinValid: true,
            isAddForm: true,
            model: '',
            year: '',
            vin: '',
            id: '',
            errorMessage: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onVinChange = this.onVinChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
    }

    componentWillReceiveProps({body}) {
        this.setState((p) => {
            console.log(body)
            if (body && body['Model']) {
                return {
                    model: body ? body['Model'] : '',
                    year: body ? body['Year'] : '',
                    vin: body ? body['VIN'] : '',
                    id: body ? body['CarId'] : '',
                    isAddForm: false
                }
            }

            return {
                isAddForm: true
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let body = {
            'Model': event.target.model.value,
            'Year': event.target.year.value,
            'VIN': event.target.vin.value
        };
        if (this.state.isAddForm) {
            fetch(POST_CAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then(r => {
                    if (r.status === 500) {
                        throw new Error("Error create car. Year should be smaller than 2020.")
                    }
                    return r;
                })
                .then(r => {
                    window.location.reload();
                })
                .catch((reason) => {
                    this.setState((p) => {
                       return {
                           errorMessage: reason.message
                       }
                    });
                });
        } else {
            fetch(UPDATE_CAR, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...body, 'CarId': this.state.id})
            })
                .then(r => window.location.reload());
        }
    }

    onYearChange(event) {
        let val = event.currentTarget.value;
        this.setState((p) => {
            return {
                year: val
            };
        });
    }

    onModelChange(event) {
        let val = event.currentTarget.value;
        this.setState((p) => {
            return {
                model: val
            };
        });
    }

    onVinChange(event) {
        let val = event.currentTarget.value;
        if (val.length !== 16) {
            this.setState((p) => {
                return {
                    isVinValid: false,
                    vin: val
                };
            });
        } else {
            this.setState((p) => {
                return {
                    isVinValid: true,
                    vin: val
                };
            });
        }
    }

    render() {
        return (
            <div>
                <hr/>
                <p className="subtitle">{this.state.isAddForm ? 'Add new car form' : 'Update car form'}</p>
                <div className="alert" hidden={!this.state.errorMessage}>
                    Error!!!
                    {this.state.errorMessage}
                </div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="model">Model</label>
                        <input onChange={this.onModelChange} id="model" type="text" value={this.state.model}/>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="year">Year</label>
                        <input onChange={this.onYearChange} id="year" type="number"  value={this.state.year}/>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="vin">VIN</label>
                        <input onChange={this.onVinChange} id="vin" type="text" value={this.state.vin}/>
                    </div>
                    <label className="error-label" htmlFor="vin" hidden={this.state.isVinValid}>VIN is invalid. The VIN length should be equals to 16 symbols.</label>
                    <button type="submit" className="btn-submit" disabled={!this.state.isVinValid}>
                        {this.state.isAddForm ? 'Add new car' : 'Update'}
                    </button>
                </form>
            </div>
        );
    }
}

export default AddCarForm;
