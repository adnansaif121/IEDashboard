import React, { Component } from 'react'
import {
    Table,
    Button
} from 'reactstrap';
import deleteIcon from '../public/delete.png'
import edit from '../public/edit.png'
import transfer from '../public/transfer.png'
import Image from 'next/image'
import NoData from './NoData'; 

export default class MyLedger extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                {this.props.displayData && this.props.displayData.length > 0 &&
                    <div style={{
                        color: "black", width: "90vw", display: "flex", justifyContent: "center", margin: "auto",
                        display: "block",
                        height: '80vh',
                        overflowY: "scroll",
                        overflowX: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px"
                    }}>
                        <Table striped bordered >

                            <thead>
                                <tr style={{position: "sticky", top: "0", backgroundColor: "#59C1BD",  color: "black"}}>
                                    <th >
                                        <div style={{ marginRight: "90px" }}>
                                            #
                                        </div>
                                    </th>
                                    <th >
                                        Invoice Date
                                    </th>
                                    <th >
                                        Vehicle No.
                                    </th>
                                    <th>
                                        Party Name
                                    </th>
                                    <th>
                                        Destination
                                    </th>
                                    <th>
                                        Unloaded At
                                    </th>
                                    <th>
                                        Vehicle Owner
                                    </th>
                                    <th>
                                        Weight (MT)
                                    </th>
                                    <th>
                                        Rate (???)
                                    </th>
                                    <th>
                                        Comission
                                    </th>
                                    {this.props.DB === "Orient" && 
                                    <>
                                        <th>
                                            Mkt Comission
                                        </th>
                                        <th>
                                            Miscellaneous Expenses
                                        </th>
                                        <th>
                                            Remark
                                        </th>
                                    </>
                                    }
                                    <th>
                                        Payable Freight
                                    </th>
                                    <th>
                                        Net Freight
                                    </th>
                                    {this.props.DB === "Orient" &&

                                        <th>
                                            Difference Payable
                                        </th>
                                    }
                                    <th>
                                        Paid On
                                    </th>
                                    <th>
                                        Our Rate
                                    </th>
                                    <th>
                                        Our Freight
                                    </th>
                                    <th>
                                        Net Profit
                                    </th>
                                    {/* <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                                        Option
                                    </th>
                                    <th style={{ borderTop: "2px solid white", borderRight: "2px solid white" }}>
                                        Option
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.displayData && this.props.displayData.map((item, i) => {
                                    return (
                                        
                                            <tr key={i} >

                                                <th scope="row">
                                                    <details>
                                                        <summary>{i + 1}</summary>
                                                        <div style={{display: "flex"}}>
                                                            <button onClick={() => this.props.handleDelete(item.id)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}>
                                                                <Image
                                                                    style={{ width: "25px", height: "25px"}}
                                                                    src={deleteIcon}
                                                                    alt="Picture of the author"
                                                                />
                                                            </button>
                                                            <button onClick={() => this.props.onEditClick(item)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}> 
                                                                <Image
                                                                    style={{ width: "25px", height: "25px" }}
                                                                    src={edit}
                                                                    alt="Picture of the author"
                                                                />
                                                            </button>
                                                            <button onClick={() => this.props.onTransferClick(item)} style={{border: "none", backgroundColor: "Transparent", padding: "0", margin: "4px"}}> 
                                                                <Image
                                                                    style={{ width: "25px", height: "25px" }}
                                                                    src={transfer}
                                                                    alt="Picture of the author"
                                                                />
                                                            </button>
                                                        </div>
                                                    </details>
                                                </th>

                                                <td >
                                                    {item.InvoiceDate}
                                                </td>
                                                <td>
                                                    {item.VehicleNo}
                                                </td>
                                                <td>
                                                    {item.PartyName}
                                                </td>
                                                <td>
                                                    {`${item.Destination} (${item.Classification})`} {item.kmsLead || null}
                                                </td>
                                                <td>
                                                    {item.UnloadedAt}
                                                </td>
                                                <td>
                                                    {item.VehicleOwnerName || "Not Available"}
                                                </td>
                                                <td>
                                                    {item.Weight}
                                                </td>
                                                <td>
                                                    {item.Rate}
                                                </td>
                                                <td>
                                                    {item.Comission}
                                                </td>
                                                {this.props.DB === "Orient" &&
                                                    <>
                                                    <td> 
                                                        {item.MktComission}
                                                    </td>
                                                    <td>
                                                        {item.MExpense}
                                                    </td>
                                                    <td>
                                                        {item.Remark}
                                                    </td>
                                                </>
                                                }
                                                <td>
                                                    {item.PayableFreight}
                                                </td>
                                                <td>
                                                    {item.NetFreight}
                                                </td>
                                                {this.props.DB === "Orient" &&
                                                    <td>
                                                        {item.DiffPayable}
                                                    </td>
                                                }
                                                <td>
                                                    {item.PaidOn}
                                                </td>
                                                <td>
                                                    {item.OurRate}
                                                </td>
                                                <td>
                                                    {item.OurFreight}
                                                </td>
                                                <td>
                                                    {item.NetProfit}
                                                </td>

                                            </tr>

                                        
                                    )
                                })}

                            </tbody>
                        </Table>
                    </div>

                }
                {
                    this.props.displayData && this.props.displayData.length === 0 &&
                    <NoData filter={this.props.filter}></NoData>
                }
           
            </>
        )
    }
}
