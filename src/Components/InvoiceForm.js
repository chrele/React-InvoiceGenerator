import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button , Form, Card, InputGroup } from 'react-bootstrap';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';

class InvoiceForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          currency: 'Rp',
          currentDate: '',
          invoiceNumber: 1,
          dateOfIssue: '',
          billTo: '',
          billToEmail: '',
          billToAddress: '',
          billFrom: '',
          billFromEmail: '',
          billFromAddress: '',
          notes: '',
          total: '0.00',
          totalBeforeTax: '0.00',
          subTotal: '0.00',
          taxRate: '',
          taxAmmount: '0.00',
          discountRate: '',
          discountAmmount: '0.00',
          bankName: '',
          bankAccount: '',
          bankOwner: ''
        };
        this.state.items = [
          {
            id: 0,
            name: '',
            description: '',
            price: '0.00',
            quantity: 1
          }
        ];
        this.editField = this.editField.bind(this);
      }

      componentDidMount(prevProps) {
        this.handleCalculateTotal()
      }

      handleRowDel(items) {
        var index = this.state.items.indexOf(items);
        this.state.items.splice(index, 1);
        this.setState(this.state.items);
      };

      handleAddEvent(evt) {
        var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var items = {
          id: id,
          name: '',
          price: '0.00',
          description: '',
          quantity: 1
        }
        this.state.items.push(items);
        this.setState(this.state.items);
      }

      handleCalculateTotal() {
        var items = this.state.items;
        var subTotal = 0;
    
        items.map(function(items) {
          subTotal = parseFloat(subTotal + (parseFloat(items.price) * parseInt(items.quantity)))
        });
    
        this.setState({
          subTotal: parseFloat(subTotal).toFixed(2)
        }, () => {
          this.setState({
            discountAmmount: parseFloat(parseFloat(subTotal) * (this.state.discountRate / 100)).toFixed(2)
          }, () => {
            this.setState({
              totalBeforeTax: parseFloat(parseFloat(subTotal) - this.state.discountAmmount).toFixed(2)
            }, () => {
              this.setState({
              taxAmmount: parseFloat((parseFloat(subTotal) - this.state.discountAmmount) * (this.state.taxRate / 100)).toFixed(2)
              }, () => {
                this.setState({
                  total: parseFloat((subTotal - this.state.discountAmmount) + parseFloat(this.state.taxAmmount)).toLocaleString(undefined, {minimumFractionDigits: 2})
                });
              });
            });
          });
        });
      };

      onItemizedItemEdit(evt) {
        var item = {
          id: evt.target.id,
          name: evt.target.name,
          value: evt.target.value
        };
        var items = this.state.items.slice();
        var newItems = items.map(function(items) {
          for (var key in items) {
            if (key == item.name && items.id == item.id) {
              items[key] = item.value;
            }
          }
          return items;
        });
        this.setState({items: newItems});
        this.handleCalculateTotal();
      };

      editField = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
        this.handleCalculateTotal();
      };

      onCurrencyChange = (selectedOption) => {
        this.setState(selectedOption);
      };

      openModal = (event) => {
        event.preventDefault()
        this.handleCalculateTotal()
        this.setState({isOpen: true})
      };

      closeModal = (event) => this.setState({isOpen: false});

    render() {
        return(
            <Form onSubmit={this.openModal}>
                <Row>
                  <Col md={8} lg={9}>
                    <Card className="p-4 p-xl-5 my-3 my-xl-4">
                      <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                        <div class="d-flex flex-column">
                          <div className="d-flex flex-column">
                            <div class="mb-2">
                              <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                              <span className="current-date">{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center">
                            <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                            <Form.Control type="date" value={this.state.dateOfIssue} name={"dateOfIssue"} onChange={(event) => this.editField(event)} style={{
                                maxWidth: '150px'
                              }} required="required"/>
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                          <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                          <Form.Control type="number" value={this.state.invoiceNumber} name={"invoiceNumber"} onChange={(event) => this.editField(event)} min="1" style={{
                              maxWidth: '70px'
                            }} required="required"/>
                        </div>
                      </div>
                      <hr className="my-4"/>
                      <Row>
                        <Col>
                          <Form.Label className="fw-bold">Bill to:</Form.Label>
                          <Form.Control placeholder={"Who is this invoice to?"} rows={3} value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                        </Col>
                        <Col>
                          <Form.Label className="fw-bold">Bill from:</Form.Label>
                          <Form.Control placeholder={"Who is this invoice from?"} rows={3} value={this.state.billFrom} type="text" name="billFrom" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                        </Col>
                      </Row>
                      <hr className="my-4"/>
                      <Row className="mb-4">
                        <Form.Label className="fw-bold">Please pay via bank transfer to:</Form.Label>
                        <Form.Control placeholder={"Bank Name"} rows={3} value={this.state.bankName} type="text" name="bankName" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                        <Form.Control placeholder={"Bank Account"} rows={3} value={this.state.bankAccount} type="text" name="bankAccount" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                        <Form.Control placeholder={"Bank Owner"} rows={3} value={this.state.bankOwner} type="text" name="bankOwner" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required"/>
                      </Row>
                      <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items}/>
                      <Row className="mt-4 justify-content-end">
                        <Col lg={6}>
                          <div className="d-flex flex-row align-items-start justify-content-between">
                            <span className="fw-bold">Subtotal:
                            </span>
                            <span>{this.state.currency} &nbsp;
                              {Number(this.state.subTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                          </div>
                          <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                            <span className="fw-bold">Discount:</span>  
                            <span> 
                              <span className="small ">({this.state.discountRate || 0}%)</span> &nbsp;
                              {this.state.currency} &nbsp;
                              {Number(this.state.discountAmmount).toLocaleString(undefined, {minimumFractionDigits: 2}) || 0}</span>
                          </div>
                          <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                            <span className="fw-bold">Total Before Tax:</span>
                            <span>
                              {this.state.currency} &nbsp;
                              {Number(this.state.totalBeforeTax).toLocaleString(undefined, {minimumFractionDigits: 2}) || 0}</span>
                          </div>
                          <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                            <span className="fw-bold">Tax:
                            </span>
                            <span>
                              <span className="small ">({this.state.taxRate || 0}%)</span> &nbsp;
                              {this.state.currency} &nbsp;
                              {Number(this.state.taxAmmount).toLocaleString(undefined, {minimumFractionDigits: 2}) || 0}</span>
                          </div>
                          <hr/>
                          <div className="d-flex flex-row align-items-start justify-content-between" style={{
                              fontSize: '1.125rem'
                            }}>
                            <span className="fw-bold">Total:
                            </span>
                            <span className="fw-bold">
                              {this.state.currency} &nbsp;
                              {this.state.total || 0.00}
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <hr className="my-4"/>
                      <Form.Label className="fw-bold">Notes:</Form.Label>
                      <Form.Control placeholder="Thanks for your business!" name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={1}/>
                    </Card>
                  </Col>
                  <Col md={4} lg={3}>
                    <div className="sticky-top pt-md-3 pt-xl-4">
                      <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
                      <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total}/>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Currency:</Form.Label>
                        <Form.Select onChange={event => this.onCurrencyChange({currency: event.target.value})} className="btn btn-light my-1" aria-label="Change Currency">
                          <option value="$">IDR (Indonesian Rupiah)</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="my-3">
                        <Form.Label className="fw-bold">Tax rate:</Form.Label>
                        <InputGroup className="my-1 flex-nowrap">
                          <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                          <InputGroup.Text className="bg-light fw-bold text-secondary small">
                            %
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="my-3">
                        <Form.Label className="fw-bold">Discount rate:</Form.Label>
                        <InputGroup className="my-1 flex-nowrap">
                          <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                          <InputGroup.Text className="bg-light fw-bold text-secondary small">
                            %
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
            </Form>
        )
    }
}

export default InvoiceForm