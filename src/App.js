import React from 'react';
import './App.css';
import CarsTable from "./components/cars-table/CarsTable";
import AddCarForm from "./components/add-car-form/AddCarForm";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddFormShow: false,
            body: null
        };

        this.showNewCarForm = this.showNewCarForm.bind(this);
    }

    showNewCarForm(body) {
        this.setState((p) => {
           return {
               isAddFormShow: true,
               body: body
           }
        });
    }

    render() {
        return (
            <div className="container">
                <div className="app">
                    <div className="flex">
                        <img width={50} height={50} src="https://png.pngitem.com/pimgs/s/338-3388568_ricardo-milos-hd-png-download.png" />
                        <p className="title">Каршеринг имени Рикардо Милоса</p>
                    </div>
                    <p className="subtitle">Список машин в каршеринге</p>
                    <div hidden={this.state.isAddFormShow}>
                        <CarsTable callback={this.showNewCarForm}/>
                    </div>
                    <div hidden={!this.state.isAddFormShow}>
                        <AddCarForm body={this.state.body} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
