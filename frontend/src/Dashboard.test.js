import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../src/components/Dashboard"; // adjust path as needed
import { BrowserRouter as Router } from "react-router-dom";
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.resetMocks();
  // localStorage.clear();
});
// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Dashboard Component - Failure Cases", () => {
  test("shows message when no token is found", async () => {
    localStorage.setItem("projectId", "1234");

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/No token found/i)).not.toBeNull();
    });
  });

  test("redirects when no projectId is present in props or localStorage", async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No project selected/i)).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully (500 error)", async () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    fetch.mockResponseOnce("", { status: 500, statusText: "Internal Server Error" });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Error fetching dashboard data/i)).not.toBeNull();
    });
  });

  test("handles malformed JSON response", async () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    fetch.mockResponseOnce("not-json", { status: 200 });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Error fetching dashboard data/i)).not.toBeNull();
    });
  });

  test("handles missing expected fields in response", async () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    // Missing metrics, insights, distributions
    fetch.mockResponseOnce(JSON.stringify({}));

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Sessions/i)).not.toBeInTheDocument();
    });
  });

  test("handles token being removed before fetch", async () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    // Simulate token removal
    localStorage.removeItem("token");

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/No token found/i)).not.toBeNull();
    });
  });

  test("handles slow network (simulate timeout)", async () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    jest.useFakeTimers();
    fetch.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 10000))
    );

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.queryByText(/Error fetching dashboard data/i)).not.toBeNull();
    });

    jest.useRealTimers();
  });

  test("renders loader initially", () => {
    localStorage.setItem("projectId", "1234");
    localStorage.setItem("token", "dummy");

    fetch.mockResponseOnce(JSON.stringify({ metrics: [], insights: [], distributions: {} }));

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const loader = screen.getByRole("status", { hidden: true });
    expect(loader).toBeInTheDocument();
  });
});
