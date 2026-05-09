import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const explainText =
  async (text, context) => {

    const response =
      await axios.post(
        `${API_URL}/api/ai/explain`,
        {
          text,
          context,
        }
      );

    return response.data;
};