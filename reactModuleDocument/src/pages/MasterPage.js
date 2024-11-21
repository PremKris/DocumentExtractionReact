import React, { useEffect, useState } from "react";
import { Container, Box, TextField,Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { getTableData, getTableCount } from "api";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "orderNumber", headerName: "Order Number", width: 250 },
  { field: "vendorName", headerName: "Vendor Name", flex: 1 },
  { field: "CompanyCode", headerName: "Company Code", flex: 1 }
];

const PAGE_SIZE = 15;

export default function MasterPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordrno, setordrno] = useState(null);
  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);

  const nav = useNavigate();

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);
      setLoading(true);

      if (isFirstLoad) {
        const count = await getTableCount();
        setRowCount(count);
      }

      const _items = await getTableData({
        $top: PAGE_SIZE,
        $skip: skip
      });
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });
      setItems(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChanged = ({ page }) => {
    loadData(false, page * PAGE_SIZE);
  };

  const handleClick = () => {
    // nav("/object");
    loadData(true);
    
  };
  const handleRowClick = (e) => {
    console.log(e.row.orderNumber);
    setordrno(e.row.orderNumber);
    nav(`/object-page/${e.row.orderNumber}`);
    console.log("success");
  }

  useEffect(() => {
    // when component mounted
    loadData(true);
  }, []);

  return (
    <>
      <div className="blue-header" style={{ backgroundColor: '#3f51b5', color: 'white', padding: '20px', textAlign: 'center' }}>
        <Typography variant="h4">Document Exchange</Typography>
      </div>
      <div className="input-container">
        <div className="input-group">
          <TextField label="Enter Order Number"></TextField>
        </div>
        <div className="input-group">
          <TextField label="Enter Vendor Name"></TextField>
        </div>
        <div className="input-group">
          <TextField label="Enter Plant Code"></TextField>
        </div>
      </div>
      <div style={{ margin: '10px 10px 20px 10px' }}>
        <button className='create' onClick={handleClick}>Go</button>
      </div >
      <div>

      </div>
      <Container disableGutters >
        <Box height="80vh" py={5}>
          <DataGrid
            loading={loading}
            rows={items}
            columns={columns}
            pageSize={PAGE_SIZE}
            paginationMode="server"
            rowCount={rowCount}
            onPageChange={handlePageChanged}
            onRowClick={handleRowClick}
          />
        </Box>
      </Container>
    </>
  );
}
