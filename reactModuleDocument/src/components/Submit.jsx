import { Button } from "@material-ui/core";
import React from "react";

export default function Submit() {
  return (
    <>
    
      <Button
        // onClick={editingFile ? handleEditSubmit : handleSubmit}
        color="primary"
        variant="contained"
      >
        {/* {editingFile ? "Save Changes" : "Submit"} */}
      </Button>
    </>
  );
}
