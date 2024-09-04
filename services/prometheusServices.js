import PrometheusEndpoint from "../models/prometheusEndpointModel.js";

const prometheusService = {
  createEndpoint: async ({ name, baseUrl, path, query }) => {
    try {
      const endpoint = new PrometheusEndpoint({ name, baseUrl, path, query });
      await endpoint.save();
      return endpoint;
    } catch (error) {
      throw new Error(`Error creating Prometheus endpoint: ${error.message}`);
    }
  },

  getAllEndpoints: async () => {
    try {
      const endpoints = await PrometheusEndpoint.find();
      return endpoints;
    } catch (error) {
      throw new Error(
        `Error retrieving Prometheus endpoints: ${error.message}`
      );
    }
  },

  getEndpointById: async (id) => {
    try {
      const endpoint = await PrometheusEndpoint.findById(id);
      if (!endpoint) {
        throw new Error("Prometheus endpoint not found");
      }
      return endpoint;
    } catch (error) {
      throw new Error(`Error retrieving Prometheus endpoint: ${error.message}`);
    }
  },

  updateEndpointById: async (id, { name, baseUrl, path, query }) => {
    try {
      const updatedEndpoint = await PrometheusEndpoint.findByIdAndUpdate(
        id,
        { name, baseUrl, path, query },
        { new: true }
      );
      if (!updatedEndpoint) {
        throw new Error("Prometheus endpoint not found");
      }
      return updatedEndpoint;
    } catch (error) {
      throw new Error(`Error updating Prometheus endpoint: ${error.message}`);
    }
  },

  deleteEndpointById: async (id) => {
    try {
      const deletedEndpoint = await PrometheusEndpoint.findByIdAndDelete(id);
      if (!deletedEndpoint) {
        throw new Error("Prometheus endpoint not found");
      }
      return deletedEndpoint;
    } catch (error) {
      throw new Error(`Error deleting Prometheus endpoint: ${error.message}`);
    }
  },
  
  getEndpointUrl: async (id) => {
    try {
      const endpoint = await PrometheusEndpoint.findById(id);
      if (!endpoint) {
        throw new Error("Prometheus endpoint not found");
      }

      // Construct the full URL
      const { baseUrl, path, query } = endpoint;
      const fullUrl = `${baseUrl}${path}${query}`;

      return {
        endpoint,
        fullUrl,
      };
    } catch (error) {
      throw new Error(`Error fetching Prometheus endpoint: ${error.message}`);
    }
  },
};

export default prometheusService;
