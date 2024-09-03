import prometheusService from "../services/prometheusServices.js";

// @desc    Create a new Prometheus Endpoint
// @route   POST /api/prometheus
// @access  Public
export const createEndpoint = async (req, res) => {
  try {
    const endpoint = await prometheusService.createEndpoint(req.body);
    res.status(201).json(endpoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create endpoint", error: error.message });
  }
};

// @desc    Get all Prometheus Endpoints
// @route   GET /api/prometheus
// @access  Public
export const getAllEndpoints = async (req, res) => {
  try {
    const endpoints = await prometheusService.getAllEndpoints();
    res.status(200).json(endpoints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch endpoints", error: error.message });
  }
};

// @desc    Get a single Prometheus Endpoint by ID
// @route   GET /api/prometheus/:id
// @access  Public
export const getEndpointById = async (req, res) => {
  const { id } = req.params;
  try {
    const endpoint = await prometheusService.getEndpointById(id);
    res.status(200).json(endpoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch endpoint", error: error.message });
  }
};

// @desc    Update a Prometheus Endpoint by ID
// @route   PUT /api/prometheus/:id
// @access  Public
export const updateEndpointById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEndpoint = await prometheusService.updateEndpointById(
      id,
      req.body
    );
    res.status(200).json(updatedEndpoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update endpoint", error: error.message });
  }
};

// @desc    Delete a Prometheus Endpoint by ID
// @route   DELETE /api/prometheus/:id
// @access  Public
export const deleteEndpointById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEndpoint = await prometheusService.deleteEndpointById(id);
    res.status(200).json({ message: "Endpoint deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete endpoint", error: error.message });
  }
};

export const constructPrometheusUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const { endpoint, fullUrl } = await prometheusService.getEndpointUrl(id);

    res.status(200).json({
      endpoint,
      fullUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to construct URL",
      error: error.message,
    });
  }
};