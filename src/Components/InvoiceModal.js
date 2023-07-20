import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      format: 'a4'
    });
    pdf.internal.scaleFactor = 1;
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', pdfWidth * 0.05, pdfHeight * 0.05, pdfWidth * 0.9, pdfHeight * 0.9);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div className='m-4' id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-80">
                <h4 className="fw-bold my-2">{this.props.info.billFrom}</h4>
                <h6 className="fw-bold text-muted mb-1">
                  Invoice #: {this.props.info.invoiceNumber||''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-muted"> {this.props.currency} {this.props.total}</h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo||''}</div>
                </Col>
                <Col className='align-items-center' md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom||''}</div>
                </Col>
                <Col className='align-items-right' md={4}>
                  <div className="fw-bold text-end">Date Of Issue:</div>
                  <div className='text-end'>{this.props.info.dateOfIssue||''}</div>
                </Col>
              </Row>
              <Row className='mb-4'>
                <Col>
                </Col>
                <Col>
                  <div className="fw-bold mt-2">Please pay via bank transfer to: </div>
                  <div>&nbsp;</div>
                </Col>
                <Col>
                  <div className='font-italic text-end'>{this.props.info.bankName||''}&nbsp; - &nbsp;{this.props.info.bankAccount||''}</div>
                  <div className='text-end'>{this.props.info.bankOwner||''}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th className='text-center'>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td className='text-center' style={{width: '70px'}}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name}
                        </td>
                        <td className="text-end" style={{width: '150px'}}>{this.props.currency} {Number(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="text-end" style={{width: '150px'}}>{this.props.currency} {Number(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold text-end" style={{width: '150px'}}>SUBTOTAL</td>
                    <td className="text-end" style={{width: '150px'}}>{this.props.currency} {Number(this.props.subTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                  {this.props.taxAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold text-end" style={{width: '150px'}}>TAX</td>
                      <td className="text-end" style={{width: '150px'}}>{this.props.currency} {Number(this.props.taxAmmount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  }
                  {this.props.discountAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold text-end" style={{width: '150px'}}>DISCOUNT</td>
                      <td className="text-end" style={{width: '150px'}}>{this.props.currency} {Number(this.props.discountAmmount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold text-end" style={{width: '150px'}}>TOTAL</td>
                    <td className="text-end" style={{width: '150px'}}>{this.props.currency} {this.props.total}</td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={3}>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Download Copy
                </Button>
              </Col>
              <Col md={3}>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

export default InvoiceModal;