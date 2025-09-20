import React from 'react';

const InvoiceCard = ({ invoice }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <div className="font-bold text-lg mb-2">Invoice</div>
    <div className="mb-1">Amount: <span className="font-semibold">${invoice?.amount || '0.00'}</span></div>
    <div className="mb-1">Date: {invoice?.date || 'N/A'}</div>
    <div className="mb-1">Payment Method: {invoice?.method || 'Card'}</div>
    <div className="mb-1">Status: <span className="font-semibold text-green-600">{invoice?.status || 'Paid'}</span></div>
  </div>
);

export default InvoiceCard;
