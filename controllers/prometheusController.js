import axios from "axios";
import PrometheusEndpoint from "./models/PrometheusEndpoint.js";

const getPrometheusData = async (req, res) => {
  try {
    const { endpointId } = req.params;
    const endpoint = await PrometheusEndpoint.findById(endpointId);

    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    const url = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { getPrometheusData };
