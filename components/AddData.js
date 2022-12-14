import React, { Component } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'
import styles from '../styles/AddData.module.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export default class AddData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InvoiceDate: "",
            VehicleNo: "",
            PartyName: "",
            Destination: "",
            Classification: "MARKET",
            UnloadedAt: "",
            Weight: 0,
            Rate: 0,
            Comission: 0,
            MktComission: 0,
            PaidTo: "",
            MExpense: 0,
            Remark: "",
            PayableFreight: 0,
            NetFreight: 0,
            DiffPayable: 0,
            PaidOn: "",
            OurRate: 0,
            OurFreight: 0,
            NetProfit: 0,

            RateData: [],
            RateSelected : null,
        }
    }

    componentDidMount() {
        // console.log(t)
        let rates = [];
        for(let item of this.props.RateData){
            rates.push({
                id : item.id,
                displayName: `${item["Name of Destination"]} (${item["Classification Name"]})`,
            })
        }
        this.setState({
            RateData : rates,
        })
    }

    addData = () => {
        let obj = {
            InvoiceDate: this.state.InvoiceDate,
            VehicleNo: (this.state.VehicleNo || ""),
            PartyName: (this.state.PartyName || ""),
            Destination: (this.state.Destination || ""),
            Classification: this.state.Classification,
            UnloadedAt: (this.state.UnloadedAt || ""),
            Weight: this.state.Weight,
            Rate: this.state.Rate,
            Comission: this.state.Comission,
            MktComission: this.state.MktComission,
            PaidTo: this.state.PaidTo,
            MExpense: this.state.MExpense,
            Remark: this.state.Remark,
            PayableFreight: (this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission,
            NetFreight: (this.state.Weight*this.state.Rate) + this.state.MExpense,
            DiffPayable: this.state.DiffPayable,
            PaidOn: this.state.PaidOn,
            OurRate: this.state.OurRate,
            OurFreight: (this.state.Weight * this.state.OurRate) - this.state.DiffPayable,
            NetProfit: (parseFloat(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight*this.state.Rate) + this.state.MExpense)) + parseFloat(this.state.Comission)),
        }
        // console.log(obj)
        this.props.updateData(obj);
    }

    handleOnSearch = (string, results) => {
        // console.log(string, results);
        this.setState({
            Destination : string,
        })
    };
 
    handleOnSelect = (item) => {
        console.log(item.id);
        let ownedItem = item;
        let index = item.id - 1;
        let RateItem = this.props.RateData[index];
        let OurRate = "";
        // if (item["Classification Name"] !== this.state.Classification) {
        //     for (let i of this.state.RateData) {
        //         if (i["Name of Destination"] === item["Name of Destination"] && i["Classification Name"] === this.state.Classification) {
        //             ownedItem = i;
        //             break;
        //         }
        //     }
        // }
        this.setState({
            // Destination: item["Name of Destination"],
            Destination : `${RateItem["Name of Destination"]} (${RateItem["Classification Name"]})`,
            // OurRate: parseFloat(ownedItem["ToT Freight (PMT)"])
            OurRate : parseFloat(RateItem["ToT Freight (PMT)"])
        })
        console.log(ownedItem);
    };

    // handleClass = (Classification) => {
    //     if (this.state.Destination === "") {
    //         alert("Destination not selected");
    //         this.setState({
    //             Classification: Classification
    //         })
    //         return;
    //     }
    //     let item;
    //     for (let i of this.state.RateData) {
    //         if (i["Name of Destination"] == this.state.Destination && i["Classification Name"] == Classification) {
    //             item = i;
    //             break;
    //         }
    //     }
    //     if (item === undefined) {
    //         alert("Destination do not exist in list. Are you sure to continue?");
    //         this.setState({
    //             Classification: Classification
    //         })
    //     }
    //     else {
    //         // console.log(item);
    //         this.setState({
    //             Destination: item["Name of Destination"],
    //             OurRate: parseFloat(item["ToT Freight (PMT)"]),
    //             Classification: Classification
    //         })
    //     }
    // }

    render() {
        return (
            <>
                <div className={styles.LoginBox}>
                    <div className={styles.box}>
                        <div className={styles.form}>
                            {/* <h2>Add Data</h2> */}
                            <Row>
                                {/* INVOICE DATE */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ InvoiceDate: e.target.value })}
                                        // required
                                        />
                                        <span>Invoice Date</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* VEHICLE NO. */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ VehicleNo: (e.target.value || "").toUpperCase() })}
                                            value={this.state.VehicleNo}
                                            required
                                        />
                                        <span>Vehicle No.</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* PARTY NAME */}
                                <Col md={4}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ PartyName: (e.target.value || "").toUpperCase() })}
                                            value={this.state.PartyName}
                                            required
                                        />
                                        <span>Party Name</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/* DESTINATION */}
                                <Col>
                                    <div style={{ width: "200", marginTop: "30px" }}>
                                        {/* <h2>My custom searchbox!</h2> */}
                                        <div style={{ marginBottom: 0 }}>Destination</div>
                                        <ReactSearchAutocomplete
                                            items={this.state.RateData}
                                            fuseOptions={{ keys: ["id", "displayName"] }} // Search on both fields
                                            resultStringKeyName="displayName" // String to display in the results
                                            onSearch={this.handleOnSearch}
                                            onSelect={this.handleOnSelect}
                                            showIcon={false}
                                            styling={{
                                                height: "34px",
                                                borderRadius: "4px",
                                                backgroundColor: "#1f5457",
                                                boxShadow: "none",
                                                hoverBackgroundColor: "lightgreen",
                                                color: "white",
                                                fontSize: "1em",
                                                letterSpacing: "0.05px",
                                                iconColor: "white",
                                                lineColor: "white",
                                                placeholderColor: "white",
                                                clearIconMargin: "3px 8px 0 0",
                                                zIndex: 20,
                                            }}
                                        />
                                        {/* <div style={{ marginTop: 20 }}>This text will be covered!</div> */}
                                    </div>
                                </Col>

                                {/* OWNED/MARKET */}
                                {/* <Col style={{ marginTop: "30px" }}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <FormGroup>
                                            <Input onChange={() => this.handleClass("OWNED")} style={{ width: "30px", height: "30px" }} name='class' type="radio" />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Owned</Label>
                                        </FormGroup>
                                        <FormGroup style={{ marginLeft: "10%" }}>
                                            <Input onChange={() => this.handleClass("MARKET")} defaultChecked style={{ width: "30px", height: "30px" }} name='class' type="radio" />
                                            {' '}
                                            <Label style={{ marginTop: "8px" }}>Market</Label>
                                        </FormGroup>
                                    </div>

                                </Col> */}
                                 
                                {/* Unloaded At */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({ UnloadedAt: (e.target.value|| "").toUpperCase()})}
                                            value={this.state.UnloadedAt}
                                            required
                                        />
                                        <span>Unloaded At</span>
                                        <i></i>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/* WEIGHT */}
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Weight: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Weight (MT)</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* RATE */}
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Rate: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Rate</span>
                                        <i></i>
                                    </div>
                                </Col>

                                {/* COMISSION */}
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ Comission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Comission</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Mkt Comission */}
                                <Col md={3}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MktComission: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Mkt Comission</span>
                                        <i></i>
                                    </div>
                                </Col>
                                {
                                    (this.state.MktComission && this.state.MktComission > 0) ?
                                    // PAID TO
                                    <Col>
                                        <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ PaidTo: (e.target.value || "").toUpperCase()})}
                                                value={this.state.PaidTo}
                                                required
                                            />
                                            <span>Mkt Comission Paid To</span>
                                            <i></i>
                                        </div>
                                    </Col>
                                    : 
                                    null
                                }
                            </Row>
                            
                            <Row>
                                {/* MISC EXPENSES */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ MExpense: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Miscellaneous Expenses</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {this.state.MExpense > 0 &&
                                // REMARK
                                    <Col>
                                        <div className={styles.inputBox}>
                                            <input
                                                type="text"
                                                onChange={(e) => this.setState({ Remark: (e.target.value || "").toUpperCase() })}
                                                value={this.state.Remark}
                                                required
                                            />
                                            <span>Remark</span>
                                            <i></i>
                                        </div>

                                    </Col>
                                }

                                {/* DIFFERENCE PAYABLE */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ DiffPayable: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            required
                                        />
                                        <span>Difference Payable</span>
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Paid On */}
                                <Col>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="date"
                                            onChange={(e) => this.setState({ PaidOn: e.target.value })}
                                        // required
                                        />
                                        <span>Paid On</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            
                            <Row style={{display: "flex", justifyContent: "center"}}>
                                {/* OUR RATE */}
                                <Col md={6}>
                                    <div className={styles.inputBox}>
                                        <input
                                            type="number"
                                            onChange={(e) => this.setState({ OurRate: (e.target.value === "") ? 0 : parseFloat(e.target.value) })}
                                            value={this.state.OurRate}
                                            required
                                        />
                                        <span>Our Rate</span>
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            <Row>
                                {/* Payable Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Payable Freight : </span>
                                        {(this.state.Weight * this.state.Rate) - this.state.Comission - this.state.MktComission}
                                    </div>

                                </Col>

                                {/* Net Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Freight : </span>
                                        {(this.state.Weight*this.state.Rate) + this.state.MExpense}
                                        <i></i>
                                    </div>

                                </Col>

                                {/* Our Freight */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Our Freight : </span>
                                        {(this.state.Weight * this.state.OurRate) - this.state.DiffPayable}
                                        <i></i>

                                    </div>

                                </Col>

                                {/* Net Profit */}
                                <Col >
                                    <div className={styles.disabledInput}>
                                        <span style={{ color: "#1f5457" }}>Net Profit : </span>
                                        {(parseInt(((this.state.Weight * this.state.OurRate) - this.state.DiffPayable) - ((this.state.Weight*this.state.Rate) + this.state.MExpense)) + parseInt(this.state.Comission))}
                                        <i></i>
                                    </div>

                                </Col>
                            </Row>
                            
                            <button onClick={this.addData} className={styles.button}><span>Add</span></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
