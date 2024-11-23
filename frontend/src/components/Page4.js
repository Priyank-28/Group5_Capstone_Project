

import './assets/styles/Page2.css';

const Page4 = () => {

  
  const statusStages = [
    { id: 'INV001', businessName: 'Tech Solutions Inc.',date:"09.01.2001" ,OrderNo:'A002',cname:'Alex',status: 'Pending' },
    { id: 'INV002', businessName: 'Creative Co.',date:"13.03.2008" ,OrderNo:'A003',cname:'peter', status: 'More Info Required' },
    { id: 'INV003', businessName: 'Retail Supplies',date:"03.03.2004" ,OrderNo:'A004',cname:'Alen', status: 'Approved' },
    { id: 'INV004', businessName: 'Marketing Plus',date:"22.10.2020" ,OrderNo:'A005',cname:'kevin',  status: 'Rejected' },
    { id: 'INV005', businessName: 'Tech Solutions Inc.',date:"26.08.2009" ,OrderNo:'A006',cname:'neethu',status: 'Pending' },
    { id: 'INV006', businessName: 'Creative Co.',date:"26.02.2009" ,OrderNo:'A007',cname:'praveen', status: 'More Info Required' },
    { id: 'INV007', businessName: 'Retail Supplies',date:"10.09.2012" ,OrderNo:'A008',cname:'kavi', status: 'Approved' },
    { id: 'INV008', businessName: 'Marketing Plus',date:"13.05.2008" , OrderNo:'A009',cname:'sowmiya', status: 'More Info Required' },
    { id: 'INV009', businessName: 'Tech Solutions Inc.',date:"20.06.2020",OrderNo:'A0010',cname:'deepi',status: 'Pending' },
    { id: 'INV0010', businessName: 'Creative Co.',date:"14.02.2024" ,OrderNo:'A0011',cname:'siva',status: 'Rejected' },
    { id: 'INV0012', businessName: 'Retail Supplies',date:"19.08.2004" ,OrderNo:'A0012',cname:'peter', status: 'Approved' },
    { id: 'INV0014', businessName: 'Marketing Plus',date:"24.09.2008" , OrderNo:'A0013',cname:'aneesh',  status: 'Approved'  }
  ];
  
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA500'; // Orange for Pending
      case 'More Info Required':
        return '#0074A3'; // Blue for More Info Required
      case 'Approved':
        return '#52B80E'; // Green for Approved
      case 'Rejected':
        return '#F46B5B'; // Red for Rejected
      default:
        return '#888888'; // Default color
    }
  };
  
 

  return (
    <div className="invoicePageContainer">
      <h1>⁠Manage Invoice</h1>

      
      <div className="invoiceStatusContainer ">
   
        <table style={{width:'100%',borderRadius:'1rem'}} >
          <thead>
            <tr  style={{ backgroundColor: '#f1f1f1' }}>
              <th>Invoice ID</th>
              <th>Business Name</th>
              <th>Invoice Date</th>
              <th>Purchase Order No</th>
              <th>Customer Name</th>
              <th style={{textAlign:'center'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {statusStages.map((invoice) => (
              <tr key={invoice.id} >
                <td>{invoice.id}</td>
                <td>{invoice.businessName}</td>
                <td>{invoice.date}</td>
                <td>{invoice.OrderNo}</td>
                <td>{invoice.cname}</td>
                <td style={{textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center'}}>
                  <div  style={{
                    backgroundColor: getStatusBackgroundColor(invoice.status),
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '6px',
                    width:'180px',
                  }}> {invoice.status}</div>
                </td>
              </tr>
            ))}
          </tbody>
    </table>
      </div>
    </div>
  );
};

export default Page4;
