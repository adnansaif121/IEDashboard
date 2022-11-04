import React, { Component } from 'react'
import styles from '../styles/LoginPage.module.css'
import { Table, Button, Navbar, NavbarBrand, FormGroup, Form, Input, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Nav, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
import AddData from './AddData';
import UpdateData from './UpdateData';
import MyLedger from './MyLedger';
import Company from './Company';
import Transporter from './Transporter';
import firebase from '../config/firebase';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import deleteIcon from '../public/delete.png'
import download from '../public/download.png'
import arrow from '../public/arrow.png';
import edit from '../public/edit.png'
import controls from '../public/controls.png'
import Image from 'next/image'
import xlsx from "json-as-xlsx"

export default class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            AllData: null,
            data: [],
            displayData: [],
            toggle: false,
            toUpdate: null,
            toggleUpdateBox: false,
            toggleSidebar: false,
            sortOldToNew: true,
            filter: "showAll",
            showDate: false,
            startDate: null,
            endDate: null,
            dropdownOpen: false,
            db: "Ultratech",
            UltratechDb: null,
            OrientDb: null,
            Ledger: "MyLedger",
            myLedger : null,
            Transporter : null,
            Company : null,
            // isOrient : true,
        }
    }

    UpdateLedger = (data, db) => {
        let myLedger;
        let Transporter = [];
        let Company = [];
        if(db === "Ultratech"){
            myLedger = [...Object.values(data.Ultratech)];
        }
        else{
            myLedger = [...Object.values(data.Orient)];
        }
        for(let item of myLedger){
            if(item.MktComission != undefined && item.MktComission != null && item.MktComission != 0){
                let obj = {
                    InvoiceDate : item.InvoiceDate,
                    VehicleNo : item.VehicleNo,
                    MktComission : item.MktComission,
                    PaidTo : item.PaidTo,
                    PaidOn : item.PaidOn
                };
                Transporter.push(obj);
            }

            if(item.DiffPayable != undefined && item.DiffPayable != null && item.DiffPayable != 0){
                let obj = {
                    InvoiceDate : item.InvoiceDate,
                    VehicleNo : item.VehicleNo,
                    Weight : item.Weight,
                    Destination : item.Destination,
                    UnloadedAt : item.UnloadedAt,
                    PaidOn : item.PaidOn,
                    DiffPayable : item.DiffPayable,
                    PartyName : item.PartyName,
                };
                Company.push(obj);
            }
        }
        this.setState({
            myLedger,
            Transporter,
            Company,
        })
    }

    componentDidMount() {
        const db = getDatabase();
        const starCountRef = ref(db, '/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            this.UpdateLedger(data, this.state.db);
            let x = (this.state.db === "Ultratech") ? [...Object.values(data.Ultratech)] : [...Object.values(data.Orient)];
            this.setState({
                AllData : data,
                UltratechDb: [...Object.values(data.Ultratech)],
                OrientDb: [...Object.values(data.Orient)],
                data: x,
                displayData: x,
            })
        })
    }

    addData = (obj) => {
        const db = getDatabase();
        const id = new Date().getTime();
        obj.id = id;
        set(ref(db, '/' + this.state.db + '/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggle: false,
            })
        })
        // alert("New data added successfully");
    }

    onEditClick = (item) => {
        this.setState({ toUpdate: item, toggleUpdateBox: true })
    }

    updateData = (obj, id) => {
        const db = getDatabase();
        console.log(this.state.db);
        set(ref(db, '/' + this.state.db + '/' + id), {
            ...obj
        }).then(() => {
            this.setState({
                toggleUpdateBox: false
            })
        })
    }

    sortOnSearch = (e) => {
        let query = e.target.value;
        let result = [];
        if (this.state.Ledger === "Transporter"){
            for(let item of this.state.data){
                if(
                    item.InvoiceDate.includes(query) ||
                    item.VehicleNo.includes(query) ||
                    item.PaidTo.includes(query)
                ){
                    result.push(item);
                }
                    
            }
        }
        else{
            for (let item of this.state.data) {
                if (
                    item.InvoiceDate.includes(query) ||
                    item.PartyName.includes(query) ||
                    item.VehicleNo.includes(query) ||
                    item.Destination.includes(query) ||
                    item.UnloadedAt.includes(query) ||
                    item.Weight.includes(query)
                ) {
                    result.push(item);
                }
            }
        }
        console.log(result)
        if (result.length > 0) {
            this.setState({
                displayData: result,
            })
        }
        else {
            this.setState({
                displayData: this.state.data,
            })
        }
    }

    ExportData = () => {
        let data;
        if(this.state.Ledger === "MyLedger"){
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "PartyName", value: "PartyName" }, // Run functions
                        { label: "Destination", value: "Destination" },
                        { label: "UnloadedAt", value: "UnloadedAt" },
                        { label: "Weight", value: "Weight" },
                        { label: "Rate", value: "Rate" },
                        { label: "Comission", value: "Comission" },
                        { label: "MktComission", value: "MktComission" },
                        { label: "PayableFreight", value: "PayableFreight" },
                        { label: "NetFreight", value: "NetFreight" },
                        { label: "DiffPayable", value: "DiffPayable" },
                        { label: "PaidOn", value: "PaidOn" },
                        { label: "OurRate", value: "OurRate" },
                        { label: "OurFreight", value: "OurFreight" },
                        { label: "NetProfit", value: "NetProfit" }
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }
        else if(this.state.Ledger === "Company"){
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "MktComission", value: "MktComission" },
                        { label: "Paid To", value: "PaidTo"},
                        { label: "PaidOn", value: "PaidOn" },
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }
        else{
            data = [
                {
                    sheet: "MySpreadsheet",
                    columns: [
                        { label: "Invoice Date", value: "InvoiceDate" }, // Top level data
                        { label: "Vehicle No", value: "VehicleNo" }, // Custom format
                        { label: "PartyName", value: "PartyName" }, // Run functions
                        { label: "Destination", value: "Destination" },
                        { label: "UnloadedAt", value: "UnloadedAt" },
                        { label: "Weight", value: "Weight" },
                        { label: "DiffPayable", value: "DiffPayable" },
                        { label: "PaidOn", value: "PaidOn" },
                    ],
                    content: Object.values(this.state.displayData),
                },
            ]
        }

        console.log(Object.values(this.state.displayData));
        let settings = {
            fileName: "MySpreadsheet", // Name of the resulting spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
            writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
            RTL: false, // Display the columns from right-to-left (the default value is false)
        }
        xlsx(data, settings) // Will download the excel file
    }

    handleDelete = (id) => {
        const db = getDatabase();
        set(ref(db, '/' + this.state.db + '/' + id), {});
    }

    handleApply = () => {
        let x = this.state.data;
        let today = new Date();
        let monthPriorDate = new Date(new Date().setDate(today.getDate() - 30));
        let weekPriorDate = new Date(new Date().setDate(today.getDate() - 7));

        if (this.state.filter === 'Last30') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= monthPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filter === 'Last7') {
            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= weekPriorDate) {
                    return e;
                }
            })
        }
        else if (this.state.filter === "ByDate") {
            if (this.state.startDate == null || this.state.endDate == null) {
                alert("Please Fill start and end date fields");
                return;
            }
            let start = new Date(this.state.startDate);
            let end = new Date(this.state.endDate);
            if (start > end) {
                alert("Please fill start and end date correctly. End Date should be after start date");
                return;
            }
            console.log(start, end, typeof (start));

            x = x.filter(e => {
                let InvoiceDate = e.InvoiceDate;
                InvoiceDate = new Date(InvoiceDate);
                if (InvoiceDate >= start && InvoiceDate <= end) {
                    return e;
                }
            })
        }


        if (this.state.sortOldToNew == true) {
            console.log("sorting")
            x.sort((a, b) => a.id - b.id);
        }
        else {
            x.sort((b, a) => a.id - b.id);
        }

        console.log(x);
        this.setState({
            displayData: x,
            toggleSidebar: false,
        })
        // console.log(today,monthPriorDate, weekPriorDate);
    }

    changeDb = (newdb) => {
        if (newdb == this.state.db) {
            alert("The Data is of " + newdb + " already");
            return;
        }
        else {
            if (newdb == "Ultratech") {
                this.UpdateLedger(this.state.AllData, "Ultratech");
                this.setState({
                    data: this.state.UltratechDb,
                    displayData: this.state.UltratechDb,
                    db: newdb
                })
            }
            else {
                this.UpdateLedger(this.state.AllData, "Orient")
                this.setState({
                    data: this.state.OrientDb,
                    displayData: this.state.OrientDb,
                    db: newdb
                })
            }
        }
    }

    changeLedger = (newLedger) => {
        if(newLedger === this.state.Ledger){
            alert("This Ledger is already selected "+ newLedger);
            return;
        }

        if(newLedger === "MyLedger"){
            this.setState({
                data : this.state.myLedger,
                displayData : this.state.myLedger
            })
        }
        else if(newLedger === "Company"){
            this.setState({
                data : this.state.Company,
                displayData : this.state.Company,
            })
        }
        else{
            this.setState({
                data: this.state.Transporter,
                displayData : this.state.Transporter,
            })
        }

        this.setState({
            Ledger: newLedger,
        })
    }

    render() {
        // let HEIGHT = window.innerHeight;
        return (
            <>

                <div style={{ backgroundColor: "white" }}>

                    <Navbar
                        className="my-2"
                    // color="dark" 

                    >
                        <NavbarBrand >
                            <Button outline onClick={() => { this.setState({ toggleSidebar: !this.state.toggleSidebar }) }}>
                                <Image
                                    style={{ width: "20px", height: "20px" }}
                                    src={controls}
                                    alt="Picture of the author"
                                    width="10px"
                                    height="10px"
                                />
                            </Button>
                        </NavbarBrand>


                        {
                            this.state.toggleUpdateBox ?
                                <>
                                    <Button color='info' onClick={() => this.setState({ toggleUpdateBox: !this.state.toggleUpdateBox })}>Close</Button>
                                    <div></div>
                                </>
                                :
                                <>

                                    <div className={styles.inputBox} style={{ marginTop: "-32px" }}>

                                        <input
                                            type="text"
                                            onChange={this.sortOnSearch}
                                            required
                                        />
                                        <span>Search</span>
                                        <i></i>
                                    </div>

                                    <div>
                                        <div className={styles.dropdown} style={{ marginRight: "8px" }}>
                                            <Button outline className={styles.dropbtn}>
                                                Ledger
                                            </Button>
                                            <div className={styles.dropdownContent}>
                                                {
                                                    this.state.Ledger === "MyLedger"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("MyLedger")}>MyLedger</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("MyLedger")}>MyLedger</div>
                                                }
                                                {
                                                    this.state.Ledger === "Company"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("Company")}>Company Ledger</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("Company")}>Company Ledger</div>
                                                }
                                                {
                                                    this.state.Ledger === "Transporter"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeLedger("Transporter")}>Transporter</div>
                                                        :
                                                        <div onClick={() => this.changeLedger("Transporter")}>Transporter</div>
                                                }
                                            </div>
                                        </div>

                                        <div className={styles.dropdown} style={{ marginRight: "8px" }}>
                                            <Button outline className={styles.dropbtn}>
                                                <Image
                                                    style={{ width: "20px", height: "20px" }}
                                                    src={arrow}
                                                    alt="Picture of the author"
                                                    width="10px"
                                                    height="10px"
                                                />
                                            </Button>
                                            <div className={styles.dropdownContent}>
                                                {
                                                    this.state.db === "Ultratech"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeDb("Ultratech")}><h6>Ultratech</h6></div>
                                                        :
                                                        <div onClick={() => this.changeDb("Ultratech")}><h6>Ultratech</h6></div>
                                                }
                                                {
                                                    this.state.db === "Orient"
                                                        ?
                                                        <div style={{ backgroundColor: "#1f5457", color: "white" }} onClick={() => this.changeDb("Orient")}><h6>Orient</h6></div>
                                                        :
                                                        <div onClick={() => this.changeDb("Orient")}><h6>Orient</h6></div>
                                                }
                                            </div>
                                        </div>

                                        <Button outline
                                            style={{ marginRight: "50px" }}
                                            onClick={this.ExportData}
                                        >
                                            <Image
                                                style={{ width: "20px", height: "20px" }}
                                                src={download}
                                                alt="Picture of the author"
                                                width="10px"
                                                height="10px"
                                            />
                                        </Button>
                                    </div>
                                </>
                        }


                    </Navbar>

                    {this.state.toggleUpdateBox ?

                        <UpdateData updateData={this.updateData} style={{ marginTop: "-3%" }} data={this.state.toUpdate}></UpdateData>

                        :

                        <>
                            <div style={{
                                color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto", marginTop: "30px",
                                display: "block",
                                height: '400px',
                                overflowY: "scroll",
                                overflowX: "scroll",
                            }}>

                                {
                                    this.state.Ledger === "MyLedger" && 
                                    <MyLedger displayData={this.state.displayData} handleDelete={this.handleDelete} onEditClick={this.onEditClick}></MyLedger>
                                }
                                {
                                    this.state.Ledger === "Company" && 
                                    <Company displayData={this.state.displayData}></Company>
                                }
                                {
                                    this.state.Ledger === "Transporter" && 
                                    <Transporter displayData={this.state.displayData}></Transporter>
                                }
                            </div>


                            <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>

                                {this.state.toggle === false ?
                                    <Button outline style={{ width: "100px" }} onClick={() => this.setState({ toggle: !this.state.toggle })}>Enter</Button>
                                    :
                                    <Button outline onClick={() => this.setState({ toggle: !this.state.toggle })}>Close</Button>
                                }
                            </div>

                            {
                                this.state.toggle === true &&
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                                    <AddData updateData={this.addData}></AddData>
                                </div>
                            }
                        </>

                    }

                    {this.state.toggleSidebar &&

                        <div style={{
                            width: "300px", height: `100%`, position: 'absolute', backgroundColor: "#1f5457", top: "72px", color: "white", padding: "30px 30px", zIndex: "20",
                            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                        }}>
                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px" }}>
                                <FormGroup >
                                    <Input onChange={(e) => { this.setState({ sortOldToNew: true }) }} defaultChecked type="radio" name='sort' />
                                    <Label style={{ marginLeft: "5px" }}>Old to New</Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input onChange={(e) => { this.setState({ sortOldToNew: false }) }} name="sort" type="radio" />
                                    <Label style={{ marginLeft: "5px" }}>New to Old</Label>
                                </FormGroup>
                            </div>

                            <div style={{ border: "2px solid grey", borderRadius: "10%", padding: "10px 10px", marginTop: "10px" }}>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "showAll", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Show All </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last30", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Last 30 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "Last7", showDate: false })} />
                                    <Label style={{ marginLeft: "5px" }} check> Last 7 Days </Label>
                                </FormGroup>
                                <FormGroup >
                                    <Input name='filter' type="radio" onChange={(e) => this.setState({ filter: "ByDate", showDate: true })} />
                                    <Label style={{ marginLeft: "5px" }} check> Search by date </Label>
                                    {
                                        this.state.showDate
                                            ?
                                            <>
                                                <div className={styles.inputBox} style={{ width: "200px" }}>
                                                    <input
                                                        type="date"
                                                        onChange={(e) => this.setState({ startDate: e.target.value })}
                                                    // required
                                                    />
                                                    <span>Start Date</span>
                                                    <i></i>
                                                </div>
                                                <div className={styles.inputBox} style={{ width: "200px" }}>
                                                    <input
                                                        type="date"
                                                        onChange={(e) => this.setState({ endDate: e.target.value })}
                                                    // required
                                                    />
                                                    <span>End Date</span>
                                                    <i></i>
                                                </div>
                                            </>
                                            :
                                            null
                                    }
                                </FormGroup>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Button onClick={this.handleApply} outline color='info' style={{ width: "100%" }}>
                                    Apply
                                </Button>
                            </div>
                        </div>


                    }
                </div>


            </>

        )
    }
}

