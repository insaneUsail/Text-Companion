import axios from "axios";

export const uploadPdf = async (file) => {
  try {
    const formData = new FormData();

    formData.append("pdf", file);

    const response = await axios.post(
      "http://localhost:5000/api/upload",
      formData
    );

    return response.data;

  } catch (error) {
    console.log(error);
    throw error;
  }
};