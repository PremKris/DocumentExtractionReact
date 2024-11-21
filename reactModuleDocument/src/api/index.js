import axios from "axios";

// const baseURL = "documentExtraction/";
const baseURL = "https://6724d9b4trial-dev-docexchange-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my";

const instance = axios.create({
  baseURL
});

export const getTableData = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/PODetails", {
    params
  });

  return data.d?.results || data.d || data.value;
};


export const getTableDataForPoLineItem = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/POLineItems", {
    params
  });

  return data.d?.results || data.d || data.value;
};
export const postAttachmentReadiness = async (dataForReadiness) => {
  const { data } = await instance.post("/Files",
    dataForReadiness
  );
  return data;
};
export const putAttachmentReadiness = async (dataForReadiness,id) => {
  const { data } = await instance.put(`/Files(${id})/content`,
    dataForReadiness
  );
return data;
};
export const patchAttachmentReadiness = async (dataForReadiness,id) => {
  const { data } = await instance.patch(`/Files(${id})`,
    dataForReadiness
  );
return data;
};
export const deleteAttachmentReadiness = async (id) => {
  const { data } = await instance.delete(`/Files(${id})`
  );
return data.d?.results || data.d || data.value;
};
export const getPoVendor = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/POVendors", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getTableCount = async () => {
  const { data } = await instance.get("/PODetails/$count");
  return data;
};

export const getTableCountForLineItems = async () => {
  const { data } = await instance.get("/POLineItems/$count");
  return data;
};

export const getTableCountForPoVendors = async () => {
  const { data } = await instance.get("/POVendors/$count");
  return data;
};
