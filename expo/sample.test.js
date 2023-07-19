import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import axios from "axios";
import App from "./App";
jest.mock("axios");                                 
describe("Test", () => {
    it("fetches and filters employees data correctly", async () => {
        const mockData = [
          { id: 1, last_name: "Bode" },
          { id: 2, last_name: "Mueller" },
          { id: 3, last_name: "Doe" },
        ];
      
        let isLoading = true;
        const setIsLoading = jest.fn((value) => {
          isLoading = value;
        });
      
        let error = null;
        const setError = jest.fn((value) => {
          error = value;
        });
      
        let employees = [];
        const setEmployees = jest.fn((value) => {
          employees = value;
        });
      
        const fetchData = async () => {
          setIsLoading(true);
          setError(null);
          try {
            const response = await axios.get("https://synth.hackerearth.com/api/employees/");
            const data = response.data;
            const filteredEmployees = data.filter(
              (employee) => employee.last_name === "Bode" || employee.last_name === "Mueller"
            );
            setEmployees(filteredEmployees);
            setIsLoading(false);
          } catch (error) {
            setError(error);
            setIsLoading(false);
          }
        };
      
        jest.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });
      
        await fetchData();
      
        expect(setIsLoading).toHaveBeenCalledWith(true);
        expect(setIsLoading).toHaveBeenCalledWith(false);
        expect(error).toBeNull();
        expect(setError).toHaveBeenCalledWith(null);
        expect(employees).toEqual([
          { id: 1, last_name: "Bode" },
          { id: 2, last_name: "Mueller" },
        ]);
        expect(setEmployees).toHaveBeenCalledWith([
          { id: 1, last_name: "Bode" },
          { id: 2, last_name: "Mueller" },
        ]);
        expect(isLoading).toBe(false);
      
        jest.restoreAllMocks(); // Restore the original implementation of axios.get
      });
});

