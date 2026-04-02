/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Packages from "./pages/dashboard/Packages";
import Pickups from "./pages/dashboard/Pickups";
import Invoices from "./pages/dashboard/Invoices";

import DriverOverview from "./pages/driver/Overview";
import DriverPickups from "./pages/driver/Pickups";
import DriverPackages from "./pages/driver/Packages";
import DriverDeliveries from "./pages/driver/Deliveries";
import DriverInvoices from "./pages/driver/Invoices";

import WarehouseOverview from "./pages/warehouse/Overview";
import WarehouseInventory from "./pages/warehouse/Inventory";
import WarehouseInvoices from "./pages/warehouse/Invoices";

export default function App() {
  return (
    <BrowserRouter basename="/logitrack">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="packages" element={<Packages />} />
          <Route path="pickups" element={<Pickups />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>

        <Route path="/dashboard/driver" element={<DashboardLayout />}>
          <Route index element={<DriverOverview />} />
          <Route path="packages" element={<DriverPackages />} />
          <Route path="pickups" element={<DriverPickups />} />
          <Route path="deliveries" element={<DriverDeliveries />} />
          <Route path="invoices" element={<DriverInvoices />} />
        </Route>

        <Route path="/dashboard/warehouse" element={<DashboardLayout />}>
          <Route index element={<WarehouseOverview />} />
          <Route path="inventory" element={<WarehouseInventory />} />
          <Route path="invoices" element={<WarehouseInvoices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
