import Dashboard from "../models/dashboardModel.js";

class DashboardService {
  static async createDashboard(data) {
    const dashboard = new Dashboard(data);
    return await dashboard.save();
  }

  static async getDashboardsForUser(user) {
    if (user.role === "admin" || user.role === "developer") {
      // Admin and Developer can view all dashboards
      return await Dashboard.find({});
    } else if (user.role === "adminOrg") {
      // Org Admin can view dashboards in their organization(s)
      return await Dashboard.find({ organization_id: { $in: user.orgs } });
    } else {
      // Regular users view dashboards in their organization
      return await Dashboard.find({
        organization_id: user.organization_id,
        visibility: true, // Only show visible dashboards
      });
    }
  }

  static async getDashboardsByOrg(orgId) {
    return await Dashboard.find({ organization_id: orgId });
  }

  static async updateDashboard(id, data) {
    return await Dashboard.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteDashboard(id) {
    return await Dashboard.findByIdAndDelete(id);
  }
}

export default DashboardService;
