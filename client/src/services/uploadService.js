import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const uploadPdf =
  async (file) => {

    const formData =
      new FormData();

    formData.append(
      "pdf",
      file
    );

    const response =
      await axios.post(
        `${API_URL}/api/upload`,
        formData
      );

    return response.data;
};