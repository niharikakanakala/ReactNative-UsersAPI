import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import axios from "axios";
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
            job_title: "Chief Intranet Strategist",
            address: "390 Kassulke Road",
            personal_details: {
              date_of_birth: "2023-09-08T00:04:26.014Z",
              IBAN: "CR79581244460872475027",
            },
          },
        ];
      
        axios.get = jest.fn().mockResolvedValueOnce({ data: mockData });
      
        const { getByText } = render(<App />);
        const fetchButton = getByText("Fetch Users");
      
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
});

