import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import axios from "axios";
import { act } from "react-test-renderer";
import App from "./App";

describe("Test", () => {
    it("renders the Fetch Users button", () => {
        const { getByText } = render(<App />);
        const fetchButton = getByText("Fetch Users");
        expect(fetchButton).toBeTruthy();
      });

      it("displays loading text while fetching data", async () => {
        const { getByText } = render(<App />);
        const fetchButton = getByText("Fetch Users");
    
        fireEvent.press(fetchButton);
    
        const loadingText = await waitFor(() => getByText("Loading..."));
        expect(loadingText).toBeTruthy();
      });
      jest.mock("axios");

      it("displays error message when there is an API error", async () => {
        const mockError = new Error("API Error");
        jest.spyOn(axios, "get").mockRejectedValueOnce(mockError);
      
        const { getByText } = render(<App />);
        const fetchButton = getByText("Fetch Users");
      
        fireEvent.press(fetchButton);
      
        const errorText = await waitFor(() => getByText(`Error: ${mockError.message}`));
        expect(errorText).toBeTruthy();
      });
      
      it("displays the employee list after successful data fetch", async () => {
        const mockData = [
          {
            id: 1,
            first_name: "Eldora",
            last_name: "Bode",
            address: "390 Kassulke Road",
            job_title: "Chief Intranet Strategist",
            personal_details: {
              date_of_birth: "2023-09-08T00:04:26.014Z",
              IBAN: "CR79581244460872475027",
            },
          },
        ];
    
        axios.get.mockResolvedValueOnce({ data: mockData });
    
        const { getByText, getByTestId } = render(<App fetchData={jest.fn()} />);
        const fetchButton = getByTestId("fetch-button");
    
        fireEvent.press(fetchButton);
    
        await waitFor(() => getByText("Employee List"));
        const employeeName = getByText("Name: Eldora Bode");
        const jobTitle = getByText("Job title: Chief Intranet Strategist");
        const address = getByText("Address: 390 Kassulke Road");
        const dob = getByText("DOB: 2023-09-08T00:04:26.014Z");
    
        expect(employeeName).toBeTruthy();
        expect(jobTitle).toBeTruthy();
        expect(address).toBeTruthy();
        expect(dob).toBeTruthy();
      });

      it("returns an empty array for an empty input array", () => {
        const data = [];
        const filteredEmployees = data.filter(
          (employee) => employee.last_name === "Bode" || employee.last_name === "Mueller"
        );
    
        expect(filteredEmployees).toEqual([]);
      });

      it("returns an empty array if there are no employees with last_name 'Bode' or 'Mueller'", () => {
        const data = [
          { id: 1, last_name: "Smith" },
          { id: 2, last_name: "Johnson" },
          { id: 3, last_name: "Doe" },
        ];
    
        const filteredEmployees = data.filter(
          (employee) => employee.last_name === "Bode" || employee.last_name === "Mueller"
        );
    
        expect(filteredEmployees).toEqual([]);
      });

      it("filters employees with last_name 'Bode'", () => {
        const data = [
          { id: 1, last_name: "Bode" },
          { id: 2, last_name: "Mueller" },
          { id: 3, last_name: "Doe" },
        ];
    
        const filteredEmployees = data.filter(
          (employee) => employee.last_name === "Bode" || employee.last_name === "Mueller"
        );
    
        expect(filteredEmployees).toEqual([
          { id: 1, last_name: "Bode" },
          { id: 2, last_name: "Mueller" },
        ]);
      });
      
});

