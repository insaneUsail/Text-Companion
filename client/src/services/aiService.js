import axios from "axios";

export const explainText =
  async (text, context) => {

    const response =
      await axios.post(
        "http://localhost:5000/api/ai/explain",
        {
          text,
          context,
        }
      );

    return response.data;
};