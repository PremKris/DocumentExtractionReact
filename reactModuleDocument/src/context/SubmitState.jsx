import React, { useState } from "react";
import SubmitContext from "./SubmitContext";

function SubmitState(props) {
  const [constData, setConstData] = useState("Hello from const");
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result); // Resolve with base64 string when done
      };

      reader.onerror = (error) => {
        reject(error); // Reject the promise if there's an error
      };
    });
  };
  const handleSubmitContext = async (
    e,
    {
      genInfo,
      selectedFile,
      content,
      postAttachmentReadiness,
      id,
      approverMail,
      approverName,
      uploadedFiles,
      setUploadedFiles,
      setSelectedFile,
      setIsModalOpen,
      setApproverMail,
      setApproverName,
      setFileInputKey,
    }
  ) => {
    console.log("Context function");
    //Convert it into base64
    let base64String = "";
    try {
      base64String = await getBase64(selectedFile);
      console.log("Base64 String:", base64String);
      const contentAfterSplit = base64String.split(",")[1];
      content = contentAfterSplit;
    } catch (error) {
      console.log("Error converting file to base64:", error);
    }

    //data for readiness to post
    const dataForReadiness = {
      vendorNo: genInfo.vendorNo,
      orderNumber: genInfo.orderNumber,
      fileName: selectedFile.name,
      size: selectedFile.size,
      status: "pending",
      // mediaType: selectedFile.type
      mediaType: "image/png",
    };

    //Callling post function data readiness
    try {
      console.log("content :", content);
      const postData = await postAttachmentReadiness(dataForReadiness);
      console.log("postData", postData);
      id = postData.ID;
      // const updateData = await updateAttachment(content,id);
      // console.log("Updated Data : " , updateData);
      const response = await fetch(
        `https://6724d9b4trial-dev-docexchange-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/Files(${id})/content`,
        {
          method: "PUT", // or PUT, depending on API specs
          headers: {
            "Content-Type": "application/json", // Fixed casing
          },
          body: JSON.stringify({
            content: content,
            mediaType: "image/png", // Include any other required fields
          }),
        }
      );
      console.log("kd", response);
    } catch (error) {
      console.error("Error:");
    }

    console.log({ email: approverMail, name: approverName });
    if (selectedFile) {
      const newFile = {
        id: id,
        name: selectedFile.name,
        uploadedBy: approverName || "privileged",
        uploadDate: new Date().toLocaleString(),
        status: "PENDING",
        approverMail: approverMail || "None",
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      setSelectedFile(null);
      setIsModalOpen(false); // Close modal on submit
      setApproverMail(approverMail);
      setApproverName(approverName);
      setFileInputKey(Date.now()); // Reset the file input key
    }
  };
  return (
    <>
      <SubmitContext.Provider
        value={{ handleSubmitContext, constData, setConstData }}
      >
        {props.children}
      </SubmitContext.Provider>
    </>
  );
}

export default SubmitState;
